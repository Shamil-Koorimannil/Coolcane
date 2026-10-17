import { getIntegrationStatus } from './lib/getleadClient.js';

/**
 * Public status endpoint for the frontend to detect if integration is running in
 * 'demo', 'live', or 'misconfigured' mode.
 *
 * CRITICAL SECURITY: Never returns the API key.
 */
export default async function handler(req, res) {
  if (res.setHeader) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
  }

  const status = getIntegrationStatus();

  const responsePayload = {
    mode: status.mode, // 'demo' | 'live' | 'misconfigured'
    isConfigured: status.isConfigured,
    message:
      status.mode === 'demo'
        ? 'Demo mode active. Submissions are simulated locally.'
        : status.mode === 'live'
        ? 'Live mode active. Connected to Getlead CRM.'
        : 'Production environment missing valid GETLEAD_API_KEY.'
  };

  if (res.status && res.json) {
    return res.status(200).json(responsePayload);
  }

  res.statusCode = 200;
  res.end(JSON.stringify(responsePayload));
}
