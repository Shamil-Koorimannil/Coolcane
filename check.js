import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error.stack || error));

  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  
  await page.waitForTimeout(2000); // give it time to render

  const html = await page.evaluate(() => document.body.innerHTML);
  console.log('HTML CONTENT:', html.substring(0, 500)); // Print first 500 chars

  await browser.close();
})();
