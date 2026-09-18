import { chromium } from 'playwright';

(async () => {
  try {
    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: 'C:/Users/dains/.gemini/antigravity-ide/brain/bb777120-16d2-41b1-b700-6c579aae619c/homepage-baseline-desktop.png',
      fullPage: true,
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: 'C:/Users/dains/.gemini/antigravity-ide/brain/bb777120-16d2-41b1-b700-6c579aae619c/homepage-baseline-mobile.png',
      fullPage: true,
    });

    await browser.close();
    console.log('Homepage baseline screenshots captured successfully!');
  } catch (err) {
    console.error('Error capturing baseline screenshots:', err);
  }
})();
