// Service for handling franchise enquiry submission to Google Sheets / CRM
const formatCustomDate = (date = new Date()) => {
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
};

export const submitFranchiseEnquiry = async (enquiryData) => {
  let SCRIPT_URL =
    import.meta.env.VITE_FRANCHISE_SUBMIT_URL ||
    import.meta.env.VITE_API_URL ||
    'https://script.google.com/macros/s/AKfycbzrqv5SGVW4D4zM6YfpbZvSSCjtKTFEALQFUDlu1QbDJsSIC89-Qj_S0kNt5g7Zmk19wQ/exec';

  // Sanitize URL protocol typos (e.g. hhttps:// -> https://)
  SCRIPT_URL = SCRIPT_URL.trim().replace(/^h+ttps:\/\//i, 'https://').replace(/^h+ttp:\/\//i, 'http://');

  // Format Investment to just "Yes" or "No"
  const rawInvestment = enquiryData.investmentReadiness || '';
  const investmentValue = rawInvestment.toLowerCase().includes('yes') ? 'Yes' : 'No';

  // Payload appended in exact requested column order:
  // SubmittedAt | Name | CountryCode | Phone | Occupation | Franchise Location | OpeningTimeline | Investment | PageSource
  const formData = new FormData();
  formData.append('SubmittedAt', formatCustomDate());
  formData.append('Name', enquiryData.fullName ? enquiryData.fullName.trim() : '');
  formData.append('CountryCode', enquiryData.countryCode || '+91');
  formData.append('Phone', enquiryData.phoneNumber ? enquiryData.phoneNumber.trim() : '');
  formData.append('Occupation', enquiryData.occupation || '');
  formData.append('Franchise Location', enquiryData.preferredLocation ? enquiryData.preferredLocation.trim() : '');
  formData.append('OpeningTimeline', enquiryData.openingTimeline || '');
  formData.append('Investment', investmentValue);
  formData.append('PageSource', '/franchise-enquiry');

  console.log('Submitting franchise enquiry to URL:', SCRIPT_URL);

  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });

    return { success: true };
  } catch (error) {
    console.error('Error submitting franchise enquiry to Google Sheets:', error);
    throw new Error(error?.message || 'Failed to submit enquiry. Please check your network connection and try again.');
  }
};
