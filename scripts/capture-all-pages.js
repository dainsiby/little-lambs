const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\dains\\.gemini\\antigravity-ide\\brain\\03b49d05-635c-4f62-86d8-54776188d6da';
const BASE_URL = 'http://localhost:3000';

async function main() {
  const browser = await chromium.launch({ headless: true });

  const pagesToCapture = [
    { name: 'homepage-after', path: '/' },
    { name: 'books-page', path: '/books' },
    { name: 'book-detail', path: '/books/little-lambs-christian-activity-book' },
    { name: 'our-story-page', path: '/our-story' },
    { name: 'about-page', path: '/about' },
    { name: 'cart-page', path: '/cart' },
    { name: 'checkout-page', path: '/checkout' },
  ];

  for (const pageItem of pagesToCapture) {
    // Desktop (1280x800)
    const contextDesktop = await browser.newContext({
      viewport: { width: 1280, height: 800 },
    });
    const pageDesktop = await contextDesktop.newPage();
    await pageDesktop.goto(`${BASE_URL}${pageItem.path}`, { waitUntil: 'networkidle' });
    await pageDesktop.screenshot({
      path: path.join(ARTIFACT_DIR, `${pageItem.name}-desktop.png`),
      fullPage: true,
    });
    await contextDesktop.close();

    // Mobile (390x844)
    const contextMobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    const pageMobile = await contextMobile.newPage();
    await pageMobile.goto(`${BASE_URL}${pageItem.path}`, { waitUntil: 'networkidle' });
    await pageMobile.screenshot({
      path: path.join(ARTIFACT_DIR, `${pageItem.name}-mobile.png`),
      fullPage: true,
    });
    await contextMobile.close();
  }

  await browser.close();
  console.log('Successfully captured all screenshots.');
}

main().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
