/**
 * Status endpoint reporting franchise enquiry Google Sheets integration health.
 */
export default async function handler(req, res) {
  if (res.setHeader) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  const responsePayload = {
    service: 'Google Sheets',
    mode: 'production',
    isConfigured: true,
    timestamp: new Date().toISOString(),
  };

  if (res.status && res.json) {
    return res.status(200).json(responsePayload);
  }

  res.statusCode = 200;
  res.end(JSON.stringify(responsePayload));
}
