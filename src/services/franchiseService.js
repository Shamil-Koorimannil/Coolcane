/**
 * Client service for CoolCane Franchise Enquiry submission.
 * Submits leads to Google Sheets via server endpoint (/api/franchise-enquiry)
 * with robust client-side direct fallback and automatic retry.
 */

const DEFAULT_GOOGLE_SHEETS_URL =
  'https://script.google.com/macros/s/AKfycbzrqv5SGVW4D4zM6YfpbZvSSCjtKTFEALQFUDlu1QbDJsSIC89-Qj_S0kNt5g7Zmk19wQ/exec';

/**
 * Format custom human-readable date & time in IST / local time.
 * Example: 22/10/2026, 01:15:30 PM
 */
export const formatCustomDate = (date = new Date()) => {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strHours = String(hours).padStart(2, '0');

    return `${day}/${month}/${year}, ${strHours}:${minutes}:${seconds} ${ampm}`;
  }
};

/**
 * Classify priority on client for immediate use or direct sheet submission
 */
export const getLeadPriority = (timeline = '') => {
  const normalized = timeline.trim().toLowerCase();
  if (normalized.includes('2 month')) return 'HOT';
  if (normalized.includes('6 month')) return 'WARM';
  return 'COLD';
};

/**
 * Submit directly to Google Sheets using FormData (robust fallback if /api route unavailable)
 */
async function submitDirectToGoogleSheets(payload) {
  let scriptUrl =
    import.meta.env.VITE_GOOGLE_SHEETS_URL ||
    import.meta.env.VITE_FRANCHISE_SUBMIT_URL ||
    DEFAULT_GOOGLE_SHEETS_URL;

  scriptUrl = scriptUrl.trim().replace(/^h+ttps:\/\//i, 'https://').replace(/^h+ttp:\/\//i, 'http://');

  const formData = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    formData.append(key, value !== undefined && value !== null ? String(value) : '');
  }

  // Google Apps Script requires mode: 'no-cors' from browsers to bypass CORS redirect restrictions
  await fetch(scriptUrl, {
    method: 'POST',
    mode: 'no-cors',
    body: formData,
  });

  return {
    success: true,
    message: 'Franchise enquiry successfully recorded in Google Sheets.',
    mode: 'direct',
  };
}

/**
 * Main submit function with retry & dual-path delivery (API first, direct sheets fallback)
 */
export const submitFranchiseEnquiry = async (enquiryData, retryCount = 1) => {
  const fullName = enquiryData.fullName ? enquiryData.fullName.trim() : '';
  const rawPhone = enquiryData.phoneNumber ? enquiryData.phoneNumber.trim() : '';
  const countryCode = enquiryData.countryCode || '+91';
  const fullPhone = rawPhone.startsWith('+') ? rawPhone : `${countryCode} ${rawPhone}`;
  const investment = enquiryData.investmentReadiness || '';
  const investmentValue = investment.toLowerCase().includes('yes')
    ? 'Yes (₹10 Lakhs)'
    : 'No (< ₹10 Lakhs)';
  const timeline = enquiryData.openingTimeline || '';
  const priority = getLeadPriority(timeline);
  const formattedDate = formatCustomDate();

  const payload = {
    fullName,
    phoneNumber: fullPhone,
    countryCode,
    occupation: enquiryData.occupation || '',
    preferredLocation: enquiryData.preferredLocation ? enquiryData.preferredLocation.trim() : '',
    openingTimeline: timeline,
    investmentReadiness: investment,
  };

  // Full payload formatted for Google Sheets
  const directSheetsPayload = {
    SubmittedAt: formattedDate,
    Name: fullName,
    fullName: fullName,
    CountryCode: countryCode,
    Phone: fullPhone,
    phoneNumber: fullPhone,
    Occupation: enquiryData.occupation || '',
    'Franchise Location': enquiryData.preferredLocation ? enquiryData.preferredLocation.trim() : '',
    Location: enquiryData.preferredLocation ? enquiryData.preferredLocation.trim() : '',
    preferredLocation: enquiryData.preferredLocation ? enquiryData.preferredLocation.trim() : '',
    OpeningTimeline: timeline,
    openingTimeline: timeline,
    Investment: investmentValue,
    investmentReadiness: investment,
    Priority: priority,
    priority: priority,
    PageSource: '/franchise-enquiry',
  };

  const attemptSubmit = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      // Step 1: Try primary serverless / API endpoint
      const response = await fetch('/api/franchise-enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // If /api endpoint is not found (e.g. static hosting on GitHub Pages, S3, Netlify CDN)
      if (response.status === 404 || response.status === 405) {
        console.warn('API route not available on host. Falling back to direct Google Sheets submission.');
        return await submitDirectToGoogleSheets(directSheetsPayload);
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        // If server rate-limited (duplicate click)
        if (response.status === 429) {
          const err = new Error(data.error || 'Please wait a moment before submitting again.');
          err.isDuplicate = true;
          throw err;
        }

        // If server failed communicating with Google Sheets, try direct client fallback
        if (response.status >= 500) {
          console.warn('Server API failed. Attempting direct Google Sheets fallback.');
          return await submitDirectToGoogleSheets(directSheetsPayload);
        }

        const errorMessage =
          data.error ||
          `Submission failed (HTTP ${response.status}). Please check your connection and try again.`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (err) {
      clearTimeout(timeoutId);

      // If user aborted or network error, attempt direct client submission as fallback
      if (err.name === 'AbortError' || err.message?.includes('Failed to fetch')) {
        console.warn('Network issue reaching API. Falling back to direct Google Sheets submission.');
        try {
          return await submitDirectToGoogleSheets(directSheetsPayload);
        } catch (directErr) {
          console.error('Direct fallback also failed:', directErr);
        }
      }

      throw err;
    }
  };

  try {
    return await attemptSubmit();
  } catch (error) {
    if (retryCount > 0 && !error.isDuplicate) {
      console.log('Submission attempt failed, retrying in 1s...', error);
      await new Promise((r) => setTimeout(r, 1000));
      return submitFranchiseEnquiry(enquiryData, retryCount - 1);
    }
    console.error('Error submitting franchise enquiry:', error);
    throw error;
  }
};
