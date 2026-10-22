/**
 * Client service for CoolCane Franchise Enquiry submission.
 * Directly records leads into Google Sheets via Google Apps Script Web App.
 */

const DEFAULT_GOOGLE_SHEETS_URL =
  'https://script.google.com/macros/s/AKfycbwtXjLrPXsKWRYId7O4tlumexXgUyeUD6W8zDJm-QMOpfisdcwPKIyK_fXTUDvu1P8d/exec';

/**
 * Format custom human-readable date & time in IST (Indian Standard Time).
 * Example: 22/10/2026, 17:41:17
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
      hour12: false,
    }).format(date);
  } catch {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
  }
};

/**
 * Classify priority on client (HOT / WARM / COLD)
 */
export const getLeadPriority = (timeline = '') => {
  const normalized = timeline.trim().toLowerCase();
  if (normalized.includes('2 month')) return 'HOT';
  if (normalized.includes('6 month')) return 'WARM';
  return 'COLD';
};

/**
 * Direct Google Sheets submission with automatic retry and timeout.
 * Dual-delivery ensures compatibility with Google Apps Script doPost(e):
 * - URL query parameters populate e.parameter
 * - text/plain JSON body populates e.postData.contents
 */
export const submitFranchiseEnquiry = async (enquiryData, retryCount = 1) => {
  let scriptUrl =
    import.meta.env.VITE_GOOGLE_SHEETS_URL ||
    import.meta.env.VITE_FRANCHISE_SUBMIT_URL ||
    DEFAULT_GOOGLE_SHEETS_URL;

  // Sanitize URL protocol typos
  scriptUrl = scriptUrl.trim().replace(/^h+ttps:\/\//i, 'https://').replace(/^h+ttp:\/\//i, 'http://');

  const fullName = enquiryData.fullName ? enquiryData.fullName.trim() : '';
  const rawPhone = enquiryData.phoneNumber ? enquiryData.phoneNumber.trim() : '';
  const countryCode = (enquiryData.countryCode || '+91').replace(/\+/g, '').trim();
  const digitsOnlyPhone = rawPhone.replace(/\D/g, '');
  const cleanPhone = digitsOnlyPhone || rawPhone;

  // Exact matching for user's doPost: "Yes" or "No"
  const rawInvestment = enquiryData.investmentReadiness || '';
  const investment = rawInvestment.toLowerCase().includes('yes') ? 'Yes' : 'No';

  const timeline = enquiryData.openingTimeline || '';
  const location = enquiryData.preferredLocation ? enquiryData.preferredLocation.trim() : '';
  const formattedDate = formatCustomDate();
  const priority = getLeadPriority(timeline);

  // Payload with exact keys from user's doPost headers and fallback keys:
  // SubmittedAt | Name | CountryCode | Phone | Occupation | Franchise Location | OpeningTimeline | Investment | PageSource
  const payload = {
    SubmittedAt: formattedDate,
    Name: fullName,
    fullName: fullName,
    CountryCode: countryCode,
    Phone: cleanPhone,
    phoneNumber: cleanPhone,
    Occupation: enquiryData.occupation || '',
    'Franchise Location': location,
    Location: location,
    preferredLocation: location,
    OpeningTimeline: timeline,
    openingTimeline: timeline,
    Investment: investment,
    InvestmentReadiness: investment,
    Priority: priority,
    PageSource: '/franchise-enquiry',
  };

  // Construct URL with query parameters to populate e.parameter in Google Apps Script
  const queryParams = new URLSearchParams(payload).toString();
  const targetUrl = scriptUrl.includes('?') ? `${scriptUrl}&${queryParams}` : `${scriptUrl}?${queryParams}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    // text/plain is CORS-safelisted so mode: 'no-cors' sends the JSON body cleanly to Google Apps Script
    await fetch(targetUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    return {
      success: true,
      message: 'Franchise enquiry successfully recorded in Google Sheets.',
      priority,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (retryCount > 0 && error.name !== 'AbortError') {
      console.warn('Google Sheets submission failed, retrying in 1s...', error);
      await new Promise((r) => setTimeout(r, 1000));
      return submitFranchiseEnquiry(enquiryData, retryCount - 1);
    }

    console.error('Error submitting to Google Sheets:', error);
    throw new Error('Unable to submit enquiry. Please check your network connection and try again.');
  }
};
