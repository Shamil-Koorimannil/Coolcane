/**
 * Client service for CoolCane Franchise Enquiry submission.
 * Directly records leads into Google Sheets via Google Apps Script Web App.
 */

const DEFAULT_GOOGLE_SHEETS_URL =
  'https://script.google.com/macros/s/AKfycbzrqv5SGVW4D4zM6YfpbZvSSCjtKTFEALQFUDlu1QbDJsSIC89-Qj_S0kNt5g7Zmk19wQ/exec';

/**
 * Format custom human-readable date & time in IST (Indian Standard Time).
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
 * Classify priority on client (HOT / WARM / COLD)
 */
export const getLeadPriority = (timeline = '') => {
  const normalized = timeline.trim().toLowerCase();
  if (normalized.includes('2 month')) return 'HOT';
  if (normalized.includes('6 month')) return 'WARM';
  return 'COLD';
};

/**
 * Direct Google Sheets submission with automatic retry and timeout
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
  const countryCode = enquiryData.countryCode || '+91';
  const fullPhone = rawPhone.startsWith('+') ? rawPhone : `${countryCode} ${rawPhone}`;
  const investment = enquiryData.investmentReadiness || '';
  const investmentValue = investment.toLowerCase().includes('yes')
    ? 'Yes (₹10 Lakhs)'
    : 'No (< ₹10 Lakhs)';
  const timeline = enquiryData.openingTimeline || '';
  const priority = getLeadPriority(timeline);
  const location = enquiryData.preferredLocation ? enquiryData.preferredLocation.trim() : '';
  const formattedDate = formatCustomDate();

  // Prepare FormData for Google Apps Script
  const formData = new FormData();
  formData.append('SubmittedAt', formattedDate);
  formData.append('Name', fullName);
  formData.append('fullName', fullName);
  formData.append('CountryCode', countryCode);
  formData.append('Phone', fullPhone);
  formData.append('phoneNumber', fullPhone);
  formData.append('Occupation', enquiryData.occupation || '');
  formData.append('Franchise Location', location);
  formData.append('Location', location);
  formData.append('preferredLocation', location);
  formData.append('OpeningTimeline', timeline);
  formData.append('openingTimeline', timeline);
  formData.append('Investment', investmentValue);
  formData.append('Minimum Investment Acknowledged', investmentValue);
  formData.append('investmentReadiness', investment);
  formData.append('Priority', priority);
  formData.append('priority', priority);
  formData.append('PageSource', '/franchise-enquiry');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    // Direct submission to Google Apps Script Web App
    // Note: mode: 'no-cors' is required by browsers for cross-origin POST to Google Apps Script
    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
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
