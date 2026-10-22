/**
 * Production Verification Suite for CoolCane Franchise Google Sheets Integration
 *
 * Verifies:
 * 1. Priority classification rules ("Within 2 months" -> HOT, "Within 6 months" -> WARM, COLD for longer)
 * 2. Robust payload validation (catches missing or invalid inputs with clear error messages)
 * 3. Anti-spam rapid submission debouncing (duplicate submission within 5s returns 429)
 * 4. Google Sheets column mapping and payload formatting (mock server verifies all columns received)
 * 5. End-to-end live connection verification with the configured Google Apps Script Web App
 */

import { classifyLeadPriority } from './api/lib/leadPriority.js';
import handler from './api/franchise-enquiry.js';
import http from 'http';

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

async function simulateRequest(body, envOverrides = {}) {
  const origEnv = { ...process.env };
  Object.assign(process.env, envOverrides);

  return new Promise((resolve) => {
    let headers = {};
    let responseData = '';

    const req = {
      method: 'POST',
      body: body,
      headers: { 'content-type': 'application/json' },
    };

    const restoreEnv = () => {
      for (const k of Object.keys(process.env)) {
        if (!(k in origEnv)) {
          delete process.env[k];
        }
      }
      Object.assign(process.env, origEnv);
    };

    const res = {
      statusCode: 200,
      setHeader: (k, v) => {
        headers[k] = v;
      },
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        responseData = JSON.stringify(data);
        restoreEnv();
        resolve({ status: this.statusCode, headers, data });
      },
      end: function (data) {
        if (data) responseData = data;
        let parsed = {};
        try {
          parsed = JSON.parse(responseData);
        } catch {
          parsed = { raw: responseData };
        }
        restoreEnv();
        resolve({ status: this.statusCode, headers, data: parsed });
      },
    };

    handler(req, res).catch((err) => {
      restoreEnv();
      resolve({ status: 500, error: err });
    });
  });
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING COOLCANE PRODUCTION GOOGLE SHEETS TESTS');
  console.log('======================================================\n');

  // Test 1: Priority Mapping
  assert(classifyLeadPriority('Within 2 months') === 'HOT', 'Test 1a: "Within 2 months" maps to HOT');
  assert(classifyLeadPriority('Within 6 months') === 'WARM', 'Test 1b: "Within 6 months" maps to WARM');
  assert(classifyLeadPriority('Within 1 year') === 'COLD', 'Test 1c: "Within 1 year" maps to COLD');
  assert(classifyLeadPriority('More than 1 year') === 'COLD', 'Test 1d: "More than 1 year" maps to COLD');
  assert(classifyLeadPriority('Just exploring opportunities') === 'COLD', 'Test 1e: "Just exploring opportunities" maps to COLD');

  // Test 2: Input Validation Failures
  const missingNameRes = await simulateRequest({
    fullName: '',
    phoneNumber: '+919876543210',
    occupation: 'Business owner',
    preferredLocation: 'Kochi',
    openingTimeline: 'Within 2 months',
    investmentReadiness: 'Yes, I am ready to invest ₹10 lakh',
  });
  assert(missingNameRes.status === 400, 'Test 2a: Missing full name returns HTTP 400');
  assert(missingNameRes.data.error.includes('Full name'), 'Test 2b: Error message specifies full name is required');

  const invalidPhoneRes = await simulateRequest({
    fullName: 'Test User',
    phoneNumber: '123',
    occupation: 'Business owner',
    preferredLocation: 'Kochi',
    openingTimeline: 'Within 2 months',
    investmentReadiness: 'Yes, I am ready to invest ₹10 lakh',
  });
  assert(invalidPhoneRes.status === 400, 'Test 2c: Invalid phone number returns HTTP 400');

  // Test 3: Mock Google Sheets Server Verification
  let receivedSheetsBody = null;
  const mockSheetsServer = http.createServer((req, res) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => {
      const params = new URLSearchParams(raw);
      receivedSheetsBody = Object.fromEntries(params.entries());
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'success' }));
    });
  });

  await new Promise((resolve) => mockSheetsServer.listen(9877, resolve));

  try {
    const validSubmission = await simulateRequest(
      {
        fullName: 'Mohammed Shamil',
        phoneNumber: '+91 98765 43210',
        countryCode: '+91',
        occupation: 'Business owner',
        preferredLocation: 'Calicut, Kerala',
        openingTimeline: 'Within 2 months',
        investmentReadiness: 'Yes, I am ready to invest ₹10 lakh',
      },
      {
        GOOGLE_SHEETS_URL: 'http://127.0.0.1:9877/exec',
      }
    );

    assert(validSubmission.status === 200, 'Test 3a: Valid submission returns HTTP 200');
    assert(validSubmission.data.success === true, 'Test 3b: Response returns success: true');
    assert(validSubmission.data.priority === 'HOT', 'Test 3c: Lead priority is correctly calculated as HOT');
    assert(receivedSheetsBody !== null, 'Test 3d: Mock Google Sheets server received payload');
    assert(receivedSheetsBody.Name === 'Mohammed Shamil', 'Test 3e: Sheets column "Name" received correctly');
    assert(receivedSheetsBody.Phone.includes('98765'), 'Test 3f: Sheets column "Phone" received correctly');
    assert(receivedSheetsBody.Occupation === 'Business owner', 'Test 3g: Sheets column "Occupation" received correctly');
    assert(receivedSheetsBody['Franchise Location'] === 'Calicut, Kerala', 'Test 3h: Sheets column "Franchise Location" received correctly');
    assert(receivedSheetsBody.OpeningTimeline === 'Within 2 months', 'Test 3i: Sheets column "OpeningTimeline" received correctly');
    assert(receivedSheetsBody.Priority === 'HOT', 'Test 3j: Sheets column "Priority" received correctly');
    assert(receivedSheetsBody.Investment === 'Yes (₹10 Lakhs)', 'Test 3k: Sheets column "Investment" formatted correctly');
    assert(Boolean(receivedSheetsBody.SubmittedAt), 'Test 3l: Sheets column "SubmittedAt" timestamp populated');

    // Test 4: Rate Limiting / Debouncing (Submitting immediately with same phone)
    const duplicateRes = await simulateRequest(
      {
        fullName: 'Mohammed Shamil',
        phoneNumber: '+91 98765 43210',
        countryCode: '+91',
        occupation: 'Business owner',
        preferredLocation: 'Calicut, Kerala',
        openingTimeline: 'Within 2 months',
        investmentReadiness: 'Yes, I am ready to invest ₹10 lakh',
      },
      {
        GOOGLE_SHEETS_URL: 'http://127.0.0.1:9877/exec',
      }
    );
    assert(duplicateRes.status === 429, 'Test 4a: Rapid duplicate submission triggers HTTP 429 rate limit');
    assert(duplicateRes.data.isDuplicate === true, 'Test 4b: Duplicate flag returned');
  } finally {
    mockSheetsServer.close();
  }

  // Test 5: End-to-End Live Google Apps Script Connection
  console.log('\n--- Testing Live Google Apps Script Web App Connection ---');
  const liveRes = await simulateRequest({
    fullName: 'CoolCane Production Verification',
    phoneNumber: '+919999900000',
    countryCode: '+91',
    occupation: 'Investor',
    preferredLocation: 'Bangalore, Karnataka',
    openingTimeline: 'Within 6 months',
    investmentReadiness: 'Yes, I am ready to invest ₹10 lakh',
  });
  assert(liveRes.status === 200, 'Test 5a: Live Google Sheets endpoint returns HTTP 200');
  assert(liveRes.data.success === true, 'Test 5b: Live Google Sheets records enquiry with success: true');
  assert(liveRes.data.priority === 'WARM', 'Test 5c: Priority is WARM for 6 months timeline');

  console.log('\n======================================================');
  console.log('🎉 ALL PRODUCTION GOOGLE SHEETS TESTS PASSED!');
  console.log('======================================================\n');
}

runTests().catch((e) => {
  console.error(e);
  process.exit(1);
});
