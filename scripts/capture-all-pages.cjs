const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\dains\\.gemini\\antigravity-ide\\brain\\03b49d05-635c-4f62-86d8-54776188d6da';
const BASE_URL = 'http://localhost:3000';

async function main() {
  const browser = await chromium.launch({ headless: true });

  const pagesToCapture = [
    { name: 'homepage-final', path: '/' },
    { name: 'books-page', path: '/books' },
    { name: 'book-detail', path: '/books/little-lambs-christian-activity-book' },
    { name: 'our-story-page', path: '/our-story' },
    { name: 'about-page', path: '/about' },
    { name: 'cart-page', path: '/cart' },
    { name: 'checkout-page', path: '/checkout' },
    { name: 'account-page', path: '/account' },
  ];

  const viewports = [
    { name: 'desktop', width: 1280, height: 800 },
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'mobile-375', width: 375, height: 812 },
    { name: 'mobile-430', width: 430, height: 932 },
  ];

  for (const pageItem of pagesToCapture) {
    for (const vp of viewports) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}${pageItem.path}`, { waitUntil: 'networkidle' });
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, `${pageItem.name}-${vp.name}.png`),
        fullPage: true,
      });
      await context.close();
    }
  }

  await browser.close();
  console.log('All customer workflow screenshots captured successfully.');
}

main().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
