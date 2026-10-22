# CoolCane Franchise Enquiry — Google Sheets Integration Guide

This guide explains how franchise enquiries are recorded directly into Google Sheets in production.

---

## 1. Active Integration Endpoint

The franchise enquiry form submits directly to the deployed Google Apps Script Web App:
```
https://script.google.com/macros/s/AKfycbzrqv5SGVW4D4zM6YfpbZvSSCjtKTFEALQFUDlu1QbDJsSIC89-Qj_S0kNt5g7Zmk19wQ/exec
```

Environment variables are configured in `.env` and `.env.example`:
```env
GOOGLE_SHEETS_URL=https://script.google.com/macros/s/AKfycbzrqv5SGVW4D4zM6YfpbZvSSCjtKTFEALQFUDlu1QbDJsSIC89-Qj_S0kNt5g7Zmk19wQ/exec
VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/AKfycbzrqv5SGVW4D4zM6YfpbZvSSCjtKTFEALQFUDlu1QbDJsSIC89-Qj_S0kNt5g7Zmk19wQ/exec
VITE_FRANCHISE_SUBMIT_URL=https://script.google.com/macros/s/AKfycbzrqv5SGVW4D4zM6YfpbZvSSCjtKTFEALQFUDlu1QbDJsSIC89-Qj_S0kNt5g7Zmk19wQ/exec
```

---

## 2. Production Architecture

1. **Dual-Route Delivery (Zero Lost Leads Guarantee)**:
   - **Primary**: Form submits via serverless endpoint `/api/franchise-enquiry`. The server validates all fields, computes lead priority (`HOT` / `WARM` / `COLD`), formats the IST timestamp, prevents rapid duplicate submissions, and posts to Google Sheets with timeout handling.
   - **Direct Fallback**: If the serverless endpoint is ever unreachable (e.g., if hosted on static CDN like GitHub Pages or S3), `src/services/franchiseService.js` automatically falls back to direct client-to-Google-Sheets submission via `no-cors` mode with automatic retry.

2. **Lead Priority Scoring**:
   - `HOT`: Launch timeline **Within 2 months**
   - `WARM`: Launch timeline **Within 6 months**
   - `COLD`: Launch timeline **Within 1 year**, **More than 1 year**, or **Just exploring**

3. **Data Columns Recorded in Google Sheets**:
   - `SubmittedAt`: Date & time formatted in IST (`DD/MM/YYYY, HH:MM:SS AM/PM`)
   - `Name`: Applicant's full name
   - `CountryCode`: Country calling code (e.g. `+91`)
   - `Phone`: Formatted contact number
   - `Occupation`: Current occupation (or custom "Other" answer)
   - `Franchise Location`: Preferred store city/area
   - `OpeningTimeline`: Target launch timeline
   - `Investment`: `Yes (₹10 Lakhs)` or `No (< ₹10 Lakhs)`
   - `Priority`: `HOT` / `WARM` / `COLD`
   - `PageSource`: Source page (`/franchise-enquiry`)

---

## 3. How to Connect a New / Different Google Sheet

If you ever wish to redirect submissions to a new Google Sheet:

1. Open your Google Sheet.
2. In the top row (Row 1), add the header names:
   ```
   SubmittedAt | Name | CountryCode | Phone | Occupation | Franchise Location | OpeningTimeline | Investment | Priority | PageSource
   ```
3. Click **Extensions > Apps Script**.
4. Paste the following script:
   ```javascript
   function doPost(e) {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     var data = e.parameter || {};

     sheet.appendRow([
       data.SubmittedAt || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
       data.Name || data.fullName || '',
       data.CountryCode || '+91',
       data.Phone || data.phoneNumber || '',
       data.Occupation || '',
       data['Franchise Location'] || data.Location || data.preferredLocation || '',
       data.OpeningTimeline || data.openingTimeline || '',
       data.Investment || data.investmentReadiness || '',
       data.Priority || data.priority || '',
       data.PageSource || '/franchise-enquiry'
     ]);

     return ContentService
       .createTextOutput(JSON.stringify({ status: "success" }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```
5. Click **Deploy > New deployment**.
6. Select **Type: Web app**.
   - **Execute as**: *Me*
   - **Who has access**: *Anyone* (Important: do not choose "Only myself").
7. Copy the generated **Web App URL** and update `GOOGLE_SHEETS_URL` in `.env` and `.env.example`.
