/**
 * Client service for CoolCane Franchise Enquiry submission.
 * Communicates with server-side endpoint (/api/franchise-enquiry) which securely
 * manages Getlead CRM integration, lead priority classification, and demo mode.
 */

export const getFranchiseIntegrationStatus = async () => {
  try {
    const res = await fetch('/api/status', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    if (!res.ok) return { mode: 'live' };
    return await res.json();
  } catch {
    return { mode: 'live' };
  }
};

export const submitFranchiseEnquiry = async (enquiryData) => {
  const payload = {
    fullName: enquiryData.fullName ? enquiryData.fullName.trim() : '',
    phoneNumber: enquiryData.phoneNumber ? enquiryData.phoneNumber.trim() : '',
    countryCode: enquiryData.countryCode || '+91',
    occupation: enquiryData.occupation || '',
    preferredLocation: enquiryData.preferredLocation ? enquiryData.preferredLocation.trim() : '',
    openingTimeline: enquiryData.openingTimeline || '',
    investmentReadiness: enquiryData.investmentReadiness || '',
  };

  try {
    const response = await fetch('/api/franchise-enquiry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      const errorMessage =
        data.error ||
        `Submission failed (HTTP ${response.status}). Please check your connection and try again.`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.isDuplicate = Boolean(data.isDuplicate);
      error.isRetryable = data.isRetryable !== false;
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error submitting franchise enquiry:', error);
    throw error;
  }
};
