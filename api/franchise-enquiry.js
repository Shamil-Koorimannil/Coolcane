import { classifyLeadPriority } from './lib/leadPriority.js';

// Default Google Apps Script Web App URL for CoolCane Google Sheet
const DEFAULT_GOOGLE_SHEETS_URL =
  'https://script.google.com/macros/s/AKfycbwtXjLrPXsKWRYId7O4tlumexXgUyeUD6W8zDJm-QMOpfisdcwPKIyK_fXTUDvu1P8d/exec';

// Simple in-memory rate-limiter / deduplication store (phone + timestamp)
const recentSubmissions = new Map();
const DEDUPLICATION_WINDOW_MS = 5000; // 5 seconds debounce per phone number

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
 * Format custom human-readable date & time in IST (Indian Standard Time).
 * Example: 22/10/2026, 01:15:30 PM
 */
function formatCustomDate(date = new Date()) {
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
}

/**
 * Helper to safely extract JSON body across Vercel serverless, Express, and Node connect middleware.
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
  if (res.setHeader) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  }
  if (res.status && res.json) {
    return res.status(statusCode).json(data);
  }
  res.statusCode = statusCode;
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
    errors.push('A valid contact number is required.');
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
  if (!openingTimeline) {
    errors.push('Launch timeline selection is required.');
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
      investmentReadiness,
    },
  };
}

/**
 * Send franchise enquiry row to Google Sheets via Google Apps Script Web App.
 */
async function appendLeadToGoogleSheets(payload) {
  const targetUrl = (
    process.env.GOOGLE_SHEETS_URL ||
    process.env.VITE_GOOGLE_SHEETS_URL ||
    process.env.VITE_FRANCHISE_SUBMIT_URL ||
    DEFAULT_GOOGLE_SHEETS_URL
  )
    .trim()
    .replace(/^h+ttps:\/\//i, 'https://')
    .replace(/^h+ttp:\/\//i, 'http://');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(payload)) {
      formData.append(key, value !== undefined && value !== null ? String(value) : '');
    }

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formData.toString(),
      redirect: 'follow',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const responseText = await response.text().catch(() => '');
    let parsedJson = null;
    try {
      parsedJson = JSON.parse(responseText);
    } catch {
      // Non-JSON response (standard with some Apps Script deployments)
    }

    if (response.ok || (parsedJson && parsedJson.status === 'success')) {
      return { success: true, data: parsedJson || { status: 'success' } };
    }

    throw new Error(
      `Google Sheets script returned HTTP ${response.status}: ${responseText.slice(0, 150)}`
    );
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Google Sheets request timed out after 12 seconds');
    }
    throw error;
  }
}

/**
 * Main serverless handler for /api/franchise-enquiry
 */
export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return sendResponse(res, 204, {});
  }

  if (req.method !== 'POST') {
    return sendResponse(res, 405, {
      success: false,
      error: 'Method not allowed. Use POST.',
    });
  }

  let body;
  try {
    body = await parseRequestBody(req);
  } catch (parseErr) {
    return sendResponse(res, 400, {
      success: false,
      error: parseErr.message || 'Malformed JSON payload',
    });
  }

  // Server-side validation of the 6 answers
  const validation = validateEnquiryPayload(body);
  if (!validation.isValid) {
    return sendResponse(res, 400, {
      success: false,
      error: validation.errors[0],
      errors: validation.errors,
    });
  }

  const sanitized = validation.sanitized;

  // Rapid duplicate submission prevention
  const dedupKey = `${sanitized.phoneNumber}_${sanitized.openingTimeline}`;
  const now = Date.now();
  if (recentSubmissions.has(dedupKey) && now - recentSubmissions.get(dedupKey) < DEDUPLICATION_WINDOW_MS) {
    return sendResponse(res, 429, {
      success: false,
      isDuplicate: true,
      error: 'Duplicate submission detected. Please wait a few seconds before submitting again.',
    });
  }
  recentSubmissions.set(dedupKey, now);

  // Calculate Lead Priority (HOT / WARM / COLD)
  let priority = 'WARM';
  try {
    priority = classifyLeadPriority(sanitized.openingTimeline);
  } catch {
    priority = 'WARM';
  }

  // Format Investment to human-friendly summary
  const investmentValue = sanitized.investmentReadiness.toLowerCase().includes('yes')
    ? 'Yes (₹10 Lakhs)'
    : 'No (< ₹10 Lakhs)';

  // Build full international phone format
  const fullPhone = sanitized.phoneNumber.startsWith('+')
    ? sanitized.phoneNumber
    : `${sanitized.countryCode} ${sanitized.phoneNumber}`;

  const timestamp = formatCustomDate();

  // Prepare full column payload for Google Sheets
  const sheetsPayload = {
    SubmittedAt: timestamp,
    Name: sanitized.fullName,
    fullName: sanitized.fullName,
    CountryCode: sanitized.countryCode,
    Phone: fullPhone,
    phoneNumber: fullPhone,
    Occupation: sanitized.occupation,
    'Franchise Location': sanitized.preferredLocation,
    Location: sanitized.preferredLocation,
    preferredLocation: sanitized.preferredLocation,
    OpeningTimeline: sanitized.openingTimeline,
    openingTimeline: sanitized.openingTimeline,
    Investment: investmentValue,
    investmentReadiness: sanitized.investmentReadiness,
    Priority: priority,
    priority: priority,
    PageSource: '/franchise-enquiry',
  };

  try {
    await appendLeadToGoogleSheets(sheetsPayload);

    return sendResponse(res, 200, {
      success: true,
      message: 'Franchise enquiry successfully recorded in Google Sheets.',
      priority,
      lead: {
        name: sanitized.fullName,
        phone: fullPhone,
        location: sanitized.preferredLocation,
        timeline: sanitized.openingTimeline,
        investment: investmentValue,
        priority,
      },
    });
  } catch (sheetsErr) {
    console.error('[GOOGLE SHEETS SUBMISSION ERROR]:', sheetsErr.message);

    return sendResponse(res, 502, {
      success: false,
      isRetryable: true,
      error: 'Failed to record enquiry to Google Sheets. Please check your connection and try again.',
      details: sheetsErr.message,
    });
  }
}
