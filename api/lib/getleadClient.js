/**
 * Getlead CRM Client & Integration Module.
 *
 * Handles:
 * - Environment status (demo mode vs live mode vs misconfigured production)
 * - Metadata retrieval (/meta) to inspect custom fields and reference data
 * - Mapping lead priority and investment qualification
 * - Lead creation (POST /leads) with notes and metadata-matched fields
 * - Error handling for auth failures, rate limits, network errors
 */

import { classifyLeadPriority } from './leadPriority.js';

export const PLACEHOLDER_API_KEY = 'replace_with_your_real_api_key';
export const DEFAULT_API_BASE_URL = 'https://v3.getleadcrm.com/api/v1';

/**
 * Determine integration status based on server-side environment variables.
 *
 * Guaranteed security rules:
 * - In production, never silently simulate a lead if credentials are missing.
 * - Demo mode is only active when in development and key is placeholder/missing,
 *   or when explicitly requested in non-production.
 * - Live mode is active when a real key is present.
 */
export function getIntegrationStatus() {
  const rawKey = process.env.GETLEAD_API_KEY || '';
  const apiKey = rawKey.trim();
  const envMode = (process.env.GETLEAD_MODE || 'auto').trim().toLowerCase();
  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = process.env.GETLEAD_API_URL || DEFAULT_API_BASE_URL;

  const isPlaceholderOrMissing =
    !apiKey ||
    apiKey === PLACEHOLDER_API_KEY ||
    apiKey.startsWith('replace_with') ||
    apiKey.toLowerCase().includes('placeholder');

  // Explicit demo mode check
  if (envMode === 'demo') {
    if (isProduction) {
      return {
        mode: 'misconfigured',
        isConfigured: false,
        baseUrl,
        error: 'GETLEAD_MODE cannot be set to demo in production. A valid GETLEAD_API_KEY must be provided.'
      };
    }
    return {
      mode: 'demo',
      isConfigured: false,
      baseUrl,
      reason: 'GETLEAD_MODE is explicitly set to demo.'
    };
  }

  // Production or explicit live mode
  if (isProduction || envMode === 'live') {
    if (isPlaceholderOrMissing) {
      return {
        mode: 'misconfigured',
        isConfigured: false,
        baseUrl,
        error: 'Getlead CRM is not configured in production. Please set a valid GETLEAD_API_KEY.'
      };
    }
    return {
      mode: 'live',
      isConfigured: true,
      apiKey,
      baseUrl
    };
  }

  // Development with placeholder/missing key
  if (isPlaceholderOrMissing) {
    return {
      mode: 'demo',
      isConfigured: false,
      baseUrl,
      reason: 'API key is missing or set to placeholder in development.'
    };
  }

  // Development with valid key
  return {
    mode: 'live',
    isConfigured: true,
    apiKey,
    baseUrl
  };
}

/**
 * Format structured notes for Getlead CRM.
 * Preserves priority, occupation, location, timeline, and investment readiness.
 *
 * Priority is strictly calculated from timeline and is listed independently
 * from investment readiness.
 */
export function buildLeadNotes({
  priority,
  occupation,
  preferredLocation,
  openingTimeline,
  investmentReadiness
}) {
  return [
    'CoolCane Franchise Enquiry',
    `Priority: ${priority}`,
    `Occupation: ${occupation || 'Not specified'}`,
    `Preferred Location: ${preferredLocation || 'Not specified'}`,
    `Opening Timeline: ${openingTimeline || 'Not specified'}`,
    `Investment Readiness: ${investmentReadiness || 'Not specified'}`
  ].join('\n');
}

/**
 * Fetch reference data and custom field definitions from Getlead CRM metadata endpoint.
 */
export async function fetchGetleadMetadata(apiKey, baseUrl = DEFAULT_API_BASE_URL) {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const url = `${cleanBase}/meta`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      const error = new Error(`Failed to fetch Getlead CRM metadata (HTTP ${response.status})`);
      error.status = response.status;
      error.details = errorText;
      throw error;
    }

    const json = await response.json();
    return json.data || json;
  } catch (err) {
    if (err.status) throw err;
    const networkErr = new Error(`Network error connecting to Getlead CRM metadata: ${err.message}`);
    networkErr.status = 502;
    throw networkErr;
  }
}

/**
 * Helper to match custom fields by name or key from metadata.
 */
function findCustomField(customFields = [], keywords = []) {
  if (!Array.isArray(customFields)) return null;

  return customFields.find((f) => {
    const key = (f.field_key || f.key || f.id || '').toLowerCase();
    const name = (f.name || f.label || '').toLowerCase();
    return keywords.some((kw) => key === kw || name === kw || key.includes(kw) || name.includes(kw));
  });
}

/**
 * Submit lead to Getlead CRM API.
 * Uses metadata to inspect available custom fields, sets priority in custom fields
 * if compatible, and always includes the full structured priority notes.
 */
export async function submitLeadToGetlead({
  apiKey,
  baseUrl = DEFAULT_API_BASE_URL,
  enquiryData,
  priority
}) {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const leadsUrl = `${cleanBase}/leads`;

  // 1. Inspect metadata for custom fields
  let customFieldsMeta = [];
  try {
    const meta = await fetchGetleadMetadata(apiKey, baseUrl);
    if (meta && Array.isArray(meta.custom_fields)) {
      customFieldsMeta = meta.custom_fields;
    }
  } catch (metaErr) {
    console.warn('Could not fetch Getlead metadata; proceeding with standard fields and notes:', metaErr.message);
  }

  // 2. Build custom_fields payload if compatible fields are defined in CRM
  const customFieldsPayload = {};

  // Check for existing priority custom field
  const priorityField = findCustomField(customFieldsMeta, ['priority', 'lead_priority', 'leadpriority']);
  if (priorityField) {
    const fieldKey = priorityField.field_key || priorityField.key || priorityField.id;
    // If it's a select field with options, try to match the option value
    if (Array.isArray(priorityField.options) && priorityField.options.length > 0) {
      const matchedOpt = priorityField.options.find((opt) => {
        const val = typeof opt === 'string' ? opt : opt.value || opt.label || '';
        return val.toLowerCase() === priority.toLowerCase();
      });
      customFieldsPayload[fieldKey] = matchedOpt ? (typeof matchedOpt === 'string' ? matchedOpt : matchedOpt.value || matchedOpt.label) : priority;
    } else {
      customFieldsPayload[fieldKey] = priority;
    }
  }

  // Check for investment qualification custom field (stored separately from priority)
  const investmentField = findCustomField(customFieldsMeta, ['investment', 'investment_readiness', 'budget']);
  if (investmentField) {
    const fieldKey = investmentField.field_key || investmentField.key || investmentField.id;
    customFieldsPayload[fieldKey] = enquiryData.investmentReadiness || '';
  }

  // Check for franchise location custom field
  const locationField = findCustomField(customFieldsMeta, ['location', 'preferred_location', 'city']);
  if (locationField) {
    const fieldKey = locationField.field_key || locationField.key || locationField.id;
    customFieldsPayload[fieldKey] = enquiryData.preferredLocation || '';
  }

  // Check for occupation custom field
  const occupationField = findCustomField(customFieldsMeta, ['occupation', 'profession', 'background']);
  if (occupationField) {
    const fieldKey = occupationField.field_key || occupationField.key || occupationField.id;
    customFieldsPayload[fieldKey] = enquiryData.occupation || '';
  }

  // 3. Structured notes with priority and lead qualifications
  const leadNotes = buildLeadNotes({
    priority,
    occupation: enquiryData.occupation,
    preferredLocation: enquiryData.preferredLocation,
    openingTimeline: enquiryData.openingTimeline,
    investmentReadiness: enquiryData.investmentReadiness
  });

  // 4. Construct payload adhering strictly to Getlead V3 API documentation
  const phoneNumbers = [enquiryData.phoneNumber];

  const payload = {
    name: enquiryData.fullName,
    phone_numbers: phoneNumbers,
    notes: leadNotes
  };

  if (Object.keys(customFieldsPayload).length > 0) {
    payload.custom_fields = customFieldsPayload;
  }

  // 5. Send POST request to Getlead CRM
  let response;
  try {
    response = await fetch(leadsUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });
  } catch (netErr) {
    const err = new Error(`Network failure connecting to Getlead CRM: ${netErr.message}`);
    err.status = 502;
    err.isRetryable = true;
    throw err;
  }

  if (!response.ok) {
    let errorDetails = '';
    let parsedBody = null;
    try {
      parsedBody = await response.json();
      errorDetails = parsedBody.message || parsedBody.error || JSON.stringify(parsedBody);
    } catch {
      errorDetails = await response.text().catch(() => '');
    }

    let errorMessage = `Getlead CRM submission failed (HTTP ${response.status})`;
    let isRetryable = false;

    if (response.status === 401 || response.status === 403) {
      errorMessage = 'Getlead CRM authentication failed. The configured API key is invalid or unauthorized.';
    } else if (response.status === 429) {
      errorMessage = 'Getlead CRM rate limit exceeded (maximum 100 requests/min). Please try again shortly.';
      isRetryable = true;
    } else if (response.status === 422) {
      errorMessage = `Getlead CRM validation error: ${errorDetails}`;
    } else if (response.status >= 500) {
      errorMessage = 'Getlead CRM server error. Please try again.';
      isRetryable = true;
    } else if (errorDetails) {
      errorMessage = `Getlead CRM: ${errorDetails}`;
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    error.details = errorDetails;
    error.isRetryable = isRetryable;
    throw error;
  }

  const result = await response.json().catch(() => ({ success: true }));
  return {
    success: true,
    data: result,
    priority,
    leadNotes
  };
}
