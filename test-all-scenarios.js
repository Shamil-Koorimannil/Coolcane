/**
 * Comprehensive Automated Verification Suite
 * Verifies all 11 required scenarios:
 * 1. "Within 2 months" produces HOT priority
 * 2. "Within 6 months" produces WARM priority
 * 3. "Within 1 year" produces COLD priority
 * 4. "More than 1 year" produces COLD priority
 * 5. "Just exploring opportunities" produces COLD priority
 * 6. Investment readiness is stored independently of priority
 * 7. Demo mode allows form and classification logic to be tested without contacting Getlead
 * 8. Demo mode is clearly identified and never reports that a real CRM lead was created
 * 9. Live mode uses the configured API key to submit the lead
 * 10. Missing or invalid live credentials produce an appropriate error instead of a false success
 * 11. Live submissions send the correct answers and priority to Getlead CRM API
 */

import { classifyLeadPriority } from './api/lib/leadPriority.js';
import { getIntegrationStatus, buildLeadNotes, submitLeadToGetlead } from './api/lib/getleadClient.js';
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
    let statusCode = 200;
    let headers = {};
    let responseData = '';

    const req = {
      method: 'POST',
      body: body,
      headers: { 'content-type': 'application/json' },
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
        Object.assign(process.env, origEnv);
        resolve({ status: this.statusCode, data });
      },
      end: function (data) {
        if (data) responseData = data;
        let parsed = {};
        try {
          parsed = JSON.parse(responseData);
        } catch {
          parsed = { raw: responseData };
        }
        Object.assign(process.env, origEnv);
        resolve({ status: this.statusCode, data: parsed });
      },
    };

    handler(req, res).catch((err) => {
      Object.assign(process.env, origEnv);
      resolve({ status: 500, error: err });
    });
  });
}

async function runTests() {
  console.log('\n========================================');
  console.log('🧪 RUNNING COOLCANE GETLEAD CRM TESTS');
  console.log('========================================\n');

  // Scenario 1: Selecting "Within 2 months" produces HOT priority
  const p1 = classifyLeadPriority('Within 2 months');
  assert(p1 === 'HOT', 'Scenario 1: "Within 2 months" maps to HOT');

  // Scenario 2: Selecting "Within 6 months" produces WARM priority
  const p2 = classifyLeadPriority('Within 6 months');
  assert(p2 === 'WARM', 'Scenario 2: "Within 6 months" maps to WARM');

  // Scenario 3: Selecting "Within 1 year" produces COLD priority
  const p3 = classifyLeadPriority('Within 1 year');
  assert(p3 === 'COLD', 'Scenario 3: "Within 1 year" maps to COLD');

  // Scenario 4: Selecting "More than 1 year" produces COLD priority
  const p4 = classifyLeadPriority('More than 1 year');
  assert(p4 === 'COLD', 'Scenario 4: "More than 1 year" maps to COLD');

  // Scenario 5: Selecting "Just exploring opportunities" produces COLD priority
  const p5 = classifyLeadPriority('Just exploring opportunities');
  assert(p5 === 'COLD', 'Scenario 5: "Just exploring opportunities" maps to COLD');

  // Scenario 6: Investment readiness is stored independently of priority
  const pLowBudget = classifyLeadPriority('Within 2 months');
  const notesLowBudget = buildLeadNotes({
    priority: pLowBudget,
    occupation: 'Self-employed / Freelancer',
    preferredLocation: 'Kochi',
    openingTimeline: 'Within 2 months',
    investmentReadiness: 'No, my budget is below ₹10 lakh.',
  });
  assert(pLowBudget === 'HOT', 'Scenario 6a: Lead with below 10L budget still receives HOT priority when timeline is within 2 months');
  assert(notesLowBudget.includes('Priority: HOT'), 'Scenario 6b: Notes contain Priority: HOT');
  assert(
    notesLowBudget.includes('Investment Readiness: No, my budget is below ₹10 lakh.'),
    'Scenario 6c: Investment readiness is preserved independently in notes'
  );

  // Scenario 7: Demo mode allows testing without contacting Getlead
  const demoReq = await simulateRequest(
    {
      fullName: 'Rahul Test',
      phoneNumber: '+919876543210',
      occupation: 'Business owner',
      preferredLocation: 'Kozhikode, Kerala',
      openingTimeline: 'Within 2 months',
      investmentReadiness: 'Yes, I am ready to invest ₹10 lakh',
    },
    {
      NODE_ENV: 'development',
      GETLEAD_API_KEY: 'replace_with_your_real_api_key',
      GETLEAD_MODE: 'demo',
    }
  );
  assert(demoReq.status === 200, 'Scenario 7a: Demo submission returns HTTP 200');
  assert(demoReq.data.success === true, 'Scenario 7b: Demo submission returns success: true');
  assert(demoReq.data.mode === 'demo', 'Scenario 7c: Mode is identified as "demo"');
  assert(demoReq.data.priority === 'HOT', 'Scenario 7d: Priority is correctly computed as HOT in demo mode');

  // Scenario 8: Demo mode is clearly identified and never reports that a real CRM lead was created
  assert(
    demoReq.data.message.includes('Demo Mode') && demoReq.data.message.includes('NOT sent to Getlead CRM'),
    'Scenario 8: Demo response explicitly specifies lead was NOT sent to Getlead CRM'
  );

  // Scenario 10: Missing or invalid live credentials produce an appropriate error instead of false success
  const misconfiguredProd = await simulateRequest(
    {
      fullName: 'Rahul Test Prod',
      phoneNumber: '+919876543299',
      occupation: 'Business owner',
      preferredLocation: 'Kozhikode, Kerala',
      openingTimeline: 'Within 2 months',
      investmentReadiness: 'Yes, I am ready to invest ₹10 lakh',
    },
    {
      NODE_ENV: 'production',
      GETLEAD_API_KEY: 'replace_with_your_real_api_key',
      GETLEAD_MODE: 'auto',
    }
  );
  assert(misconfiguredProd.status === 503, 'Scenario 10a: Missing API key in production safely fails with HTTP 503');
  assert(misconfiguredProd.data.success === false, 'Scenario 10b: Production does not report false success');
  assert(
    misconfiguredProd.data.error.includes('GETLEAD_API_KEY'),
    'Scenario 10c: Error message informs admin of missing GETLEAD_API_KEY'
  );

  // Scenario 9 & 11: Live mode with mock Getlead CRM API server
  // Spin up a temporary local HTTP server acting as Getlead CRM v3 to test live submission
  let receivedLeadPayload = null;
  let receivedAuthHeader = null;
  let metaRequested = false;

  const mockGetleadServer = http.createServer((req, res) => {
    if (req.url === '/meta' && req.method === 'GET') {
      metaRequested = true;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          data: {
            custom_fields: [
              { id: 'cf_priority', field_key: 'lead_priority', name: 'Lead Priority', type: 'select', options: ['HOT', 'WARM', 'COLD'] },
              { id: 'cf_inv', field_key: 'investment_budget', name: 'Investment Readiness', type: 'text' }
            ]
          }
        })
      );
      return;
    }

    if (req.url === '/leads' && req.method === 'POST') {
      receivedAuthHeader = req.headers['authorization'];
      let body = '';
      req.on('data', (c) => (body += c));
      req.on('end', () => {
        receivedLeadPayload = JSON.parse(body);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data: { id: 'lead_abc123' } }));
      });
      return;
    }

    res.writeHead(404);
    res.end();
  });

  await new Promise((resolve) => mockGetleadServer.listen(9876, resolve));
  const mockBaseUrl = 'http://127.0.0.1:9876';

  try {
    const liveSubmission = await simulateRequest(
      {
        fullName: 'Jane Doe',
        phoneNumber: '+919988776655',
        occupation: 'Investor',
        preferredLocation: 'Kozhikode, Kerala',
        openingTimeline: 'Within 6 months',
        investmentReadiness: 'Yes, I am ready to invest ₹10 lakh',
      },
      {
        NODE_ENV: 'production',
        GETLEAD_API_KEY: 'ik_real_test_key_coolcane',
        GETLEAD_MODE: 'live',
        GETLEAD_API_URL: mockBaseUrl,
      }
    );

    assert(liveSubmission.status === 200, 'Scenario 9a: Live submission succeeded with HTTP 200');
    assert(liveSubmission.data.mode === 'live', 'Scenario 9b: Live mode returned');
    assert(liveSubmission.data.priority === 'WARM', 'Scenario 9c: Priority correctly set to WARM');
    assert(receivedAuthHeader === 'Bearer ik_real_test_key_coolcane', 'Scenario 9d: Correct Bearer token passed to Getlead');
    assert(metaRequested === true, 'Scenario 11a: Getlead CRM /meta endpoint was inspected');
    assert(receivedLeadPayload.name === 'Jane Doe', 'Scenario 11b: Lead name correctly submitted');
    assert(receivedLeadPayload.phone_numbers[0] === '+919988776655', 'Scenario 11c: Phone number correctly submitted');
    assert(receivedLeadPayload.custom_fields.lead_priority === 'WARM', 'Scenario 11d: Priority stored in Getlead custom field');
    assert(receivedLeadPayload.notes.includes('Priority: WARM'), 'Scenario 11e: Notes contain Priority: WARM');
    assert(receivedLeadPayload.notes.includes('Occupation: Investor'), 'Scenario 11f: Notes contain Occupation: Investor');
  } finally {
    mockGetleadServer.close();
  }

  console.log('\n========================================');
  console.log('🎉 ALL 11 VERIFICATION SCENARIOS PASSED!');
  console.log('========================================\n');
}

runTests().catch((e) => {
  console.error(e);
  process.exit(1);
});
