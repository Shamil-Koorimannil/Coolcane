import { classifyLeadPriority } from './lib/leadPriority.js';
import { getIntegrationStatus, submitLeadToGetlead, buildLeadNotes } from './lib/getleadClient.js';

// Simple in-memory rate-limiter / deduplication store (phone + timestamp)
const recentSubmissions = new Map();
const DEDUPLICATION_WINDOW_MS = 6000; // 6 seconds debounce per phone number

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of recentSubmissions.entries()) {
    if (now - timestamp > DEDUPLICATION_WINDOW_MS * 2) {
      recentSubmissions.delete(key);
    }
  }
}, 30000).unref?.();

/**
 * Helper to safely extract JSON body across Vercel serverless and Node connect middleware.
 */
async function parseRequestBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 5e5) {
        // 500KB cap
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!raw.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Invalid JSON format in request body'));
      }
    });
    req.on('error', (err) => reject(err));
  });
}

function sendResponse(res, statusCode, data) {
  if (res.status && res.json) {
    return res.status(statusCode).json(data);
  }
  res.statusCode = statusCode;
  if (res.setHeader) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
  }
  res.end(JSON.stringify(data));
}

/**
 * Validate the six questionnaire answers on the server.
 */
function validateEnquiryPayload(data) {
  const errors = [];

  // 1. Full Name
  const fullName = typeof data.fullName === 'string' ? data.fullName.trim() : '';
  if (!fullName || fullName.length < 2) {
    errors.push('Full name is required and must be at least 2 characters.');
  }

  // 2. Phone Number
  const phoneNumber = typeof data.phoneNumber === 'string' ? data.phoneNumber.trim() : '';
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  if (!phoneNumber || digitsOnly.length < 7 || digitsOnly.length > 15) {
    errors.push('A valid international contact number is required.');
  }

  // 3. Occupation
  const occupation = typeof data.occupation === 'string' ? data.occupation.trim() : '';
  if (!occupation) {
    errors.push('Current occupation is required.');
  }

  // 4. Preferred Location
  const preferredLocation = typeof data.preferredLocation === 'string' ? data.preferredLocation.trim() : '';
  if (!preferredLocation) {
    errors.push('Preferred franchise location is required.');
  }

  // 5. Opening Timeline
  const openingTimeline = typeof data.openingTimeline === 'string' ? data.openingTimeline.trim() : '';
  const validTimelines = [
    'Within 2 months',
    'Within 6 months',
    'Within 1 year',
    'More than 1 year',
    'Just exploring opportunities'
  ];
  if (!openingTimeline) {
    errors.push('Launch timeline selection is required.');
  } else if (!validTimelines.includes(openingTimeline)) {
    // If not exact match, verify it can still be classified
    try {
      classifyLeadPriority(openingTimeline);
    } catch {
      errors.push(`Invalid timeline option: "${openingTimeline}".`);
    }
  }

  // 6. Investment Readiness
  const investmentReadiness = typeof data.investmentReadiness === 'string' ? data.investmentReadiness.trim() : '';
  if (!investmentReadiness) {
    errors.push('Investment readiness selection is required.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      fullName,
      phoneNumber,
      countryCode: data.countryCode || '+91',
      occupation,
      preferredLocation,
      openingTimeline,
      investmentReadiness
    }
  };
}

/**
 * Main serverless handler for /api/franchise-enquiry
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendResponse(res, 405, {
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  let body;
  try {
    body = await parseRequestBody(req);
  } catch (parseErr) {
    return sendResponse(res, 400, {
      success: false,
      error: parseErr.message || 'Malformed JSON payload'
    });
  }

  // Server-side validation of the 6 answers
  const validation = validateEnquiryPayload(body);
  if (!validation.isValid) {
    return sendResponse(res, 400, {
      success: false,
      error: validation.errors[0],
      errors: validation.errors
    });
  }

  const sanitizedData = validation.sanitized;

  // Rapid duplicate submission prevention
  const dedupKey = `${sanitizedData.phoneNumber}_${sanitizedData.openingTimeline}`;
  const now = Date.now();
  if (recentSubmissions.has(dedupKey) && now - recentSubmissions.get(dedupKey) < DEDUPLICATION_WINDOW_MS) {
    return sendResponse(res, 429, {
      success: false,
      isDuplicate: true,
      error: 'Duplicate submission detected. Please wait a few seconds before submitting again.'
    });
  }
  recentSubmissions.set(dedupKey, now);

  // Server-side Priority Calculation
  let priority;
  try {
    priority = classifyLeadPriority(sanitizedData.openingTimeline);
  } catch (err) {
    return sendResponse(res, 400, {
      success: false,
      error: err.message
    });
  }

  // Determine Integration Mode
  const status = getIntegrationStatus();

  // Scenario 1: Misconfigured production environment (Fail safely)
  if (status.mode === 'misconfigured') {
    console.error('[CRM ERROR] Misconfigured integration in production:', status.error);
    return sendResponse(res, 503, {
      success: false,
      mode: 'misconfigured',
      error: status.error || 'CRM service is not configured. Please contact the administrator.'
    });
  }

  // Scenario 2: Development / Demo Mode (Simulate without sending to Getlead)
  if (status.mode === 'demo') {
    const simulatedNotes = buildLeadNotes({
      priority,
      occupation: sanitizedData.occupation,
      preferredLocation: sanitizedData.preferredLocation,
      openingTimeline: sanitizedData.openingTimeline,
      investmentReadiness: sanitizedData.investmentReadiness
    });

    console.log('\n--- [COOLCANE CRM DEMO MODE SUBMISSION] ---');
    console.log('Priority Calculated:', priority);
    console.log('Lead Details:', {
      name: sanitizedData.fullName,
      phone: sanitizedData.phoneNumber,
      timeline: sanitizedData.openingTimeline,
      investment: sanitizedData.investmentReadiness,
      location: sanitizedData.preferredLocation,
      occupation: sanitizedData.occupation
    });
    console.log('Simulated CRM Notes:\n' + simulatedNotes);
    console.log('-------------------------------------------\n');

    return sendResponse(res, 200, {
      success: true,
      mode: 'demo',
      priority,
      message:
        'Franchise enquiry simulated successfully in Demo Mode. Lead data was NOT sent to Getlead CRM.',
      simulatedLead: {
        name: sanitizedData.fullName,
        phone: sanitizedData.phoneNumber,
        priority,
        openingTimeline: sanitizedData.openingTimeline,
        investmentReadiness: sanitizedData.investmentReadiness,
        preferredLocation: sanitizedData.preferredLocation,
        occupation: sanitizedData.occupation
      }
    });
  }

  // Scenario 3: Live Mode (Send to real Getlead CRM API)
  try {
    const crmResult = await submitLeadToGetlead({
      apiKey: status.apiKey,
      baseUrl: status.baseUrl,
      enquiryData: sanitizedData,
      priority
    });

    return sendResponse(res, 200, {
      success: true,
      mode: 'live',
      priority,
      message: 'Franchise enquiry successfully recorded in Getlead CRM.',
      leadId: crmResult.data?.id || crmResult.data?.lead?.id || null
    });
  } catch (crmErr) {
    console.error('[GETLEAD API ERROR]:', crmErr.message, crmErr.details || '');

    const statusCode = crmErr.status && crmErr.status >= 400 && crmErr.status < 600 ? crmErr.status : 502;

    return sendResponse(res, statusCode, {
      success: false,
      mode: 'live',
      priority,
      isRetryable: crmErr.isRetryable !== false,
      error: crmErr.message || 'Failed to submit enquiry to Getlead CRM. Please try again.'
    });
  }
}
