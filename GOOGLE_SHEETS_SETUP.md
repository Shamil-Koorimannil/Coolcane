# CoolCane Franchise Enquiry — Google Sheets Integration Guide

This guide contains the production Google Apps Script code and deployment instructions for recording franchise enquiries into your Google Sheet.

---

## Active Deployed Web App Info

- **Web App URL**: `https://script.google.com/macros/s/AKfycbwtXjLrPXsKWRYId7O4tlumexXgUyeUD6W8zDJm-QMOpfisdcwPKIyK_fXTUDvu1P8d/exec`
- **Deployment ID**: `AKfycbwtXjLrPXsKWRYId7O4tlumexXgUyeUD6W8zDJm-QMOpfisdcwPKIyK_fXTUDvu1P8d`

---

## Production Google Apps Script Code

Copy and paste this exact script into your Google Sheet's Apps Script editor (**Extensions** > **Apps Script**):

```javascript
/**
 * CoolCane Franchise Enquiry — Production Webhook Receiver
 * Appends form submissions directly into the Google Sheet.
 */

// Helper to handle GET requests (e.g. testing the URL in browser)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "active",
      message: "CoolCane Franchise Google Apps Script is running."
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Main handler for POST requests from the website form
function doPost(e) {
  // Prevent race conditions on concurrent submissions
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Wait up to 10 seconds for concurrent requests

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    // Target "Sheet1" or fall back to the first tab
    var sheet = ss.getSheetByName("Sheet1") || ss.getSheets()[0];

    // Auto-create exact headers if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "SubmittedAt",
        "Name",
        "CountryCode",
        "Phone",
        "Occupation",
        "Franchise Location",
        "OpeningTimeline",
        "Investment",
        "PageSource"
      ]);
    }

    // Extract payload from either URL query parameters or JSON body
    var data = {};

    // 1. Read query parameters if available
    if (e && e.parameter) {
      data = Object.assign({}, e.parameter);
    }

    // 2. Read and merge JSON body if available
    if (e && e.postData && e.postData.contents) {
      try {
        var json = JSON.parse(e.postData.contents);
        data = Object.assign({}, data, json);
      } catch (jsonErr) {
        // If not JSON, attempt form-urlencoded parsing
        if (typeof e.postData.contents === 'string' && e.postData.contents.indexOf('=') !== -1) {
          var pairs = e.postData.contents.split('&');
          for (var i = 0; i < pairs.length; i++) {
            var parts = pairs[i].split('=');
            if (parts.length === 2) {
              data[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1].replace(/\+/g, ' '));
            }
          }
        }
      }
    }

    // Extract fields with fallbacks
    var submittedAt = data.SubmittedAt || Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy, HH:mm:ss");
    var name = data.Name || data.fullName || "";
    var rawCountryCode = data.CountryCode || data.countryCode || "91";
    var countryCode = rawCountryCode.toString().replace(/\+/g, "").trim();
    var rawPhone = data.Phone || data.phoneNumber || "";
    var phone = rawPhone.toString().trim();
    var occupation = data.Occupation || data.occupation || "";
    var location = data["Franchise Location"] || data.Location || data.preferredLocation || "";
    var openingTimeline = data.OpeningTimeline || data.openingTimeline || "";

    // Format Investment to clean "Yes" or "No"
    var rawInvestment = (data.Investment || data.InvestmentReadiness || data.investmentReadiness || "").toString();
    var investment = rawInvestment.toLowerCase().indexOf("yes") !== -1 ? "Yes" : (rawInvestment.toLowerCase().indexOf("no") !== -1 ? "No" : rawInvestment);

    var pageSource = data.PageSource || data.pageSource || "/franchise-enquiry";

    // Ensure we do not append an entirely empty row
    if (!name && !phone && !location) {
      return ContentService
        .createTextOutput(JSON.stringify({ result: "error", message: "Empty payload received" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Append lead to Google Sheet (as text values to prevent formatting issues)
    sheet.appendRow([
      submittedAt,
      name,
      "'" + countryCode,
      "'" + phone,
      occupation,
      location,
      openingTimeline,
      investment,
      pageSource
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", status: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

---

## 4-Step Deployment Instructions

1. Open your Google Sheet (**Coolcane Franchise enquiries**).
2. Go to **Extensions** > **Apps Script**.
3. Replace the entire code in `Code.gs` with the script above and click the **Save** (floppy disk) icon.
4. **Deploy as a Web App**:
   - Click **Deploy** (top right) > **Manage deployments**.
   - Click the **pencil icon** (Edit) on your existing deployment.
   - Under **Version**, click the dropdown and choose **"New version"**.
   - Verify:
     - **Execute as**: **Me**
     - **Who has access**: **Anyone**
   - Click **Deploy** and **Done**.
