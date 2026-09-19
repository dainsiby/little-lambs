const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\dains\\.gemini\\antigravity-ide\\brain\\bb777120-16d2-41b1-b700-6c579aae619c';
const BASE_URL = 'http://localhost:3000';

async function main() {
  const browser = await chromium.launch({ headless: true });

  const routes = [
    { name: 'verify-homepage', path: '/' },
    { name: 'verify-books', path: '/books' },
    { name: 'verify-book-slug', path: '/books/little-lambs-activity-book' },
    { name: 'verify-cart', path: '/cart' },
    { name: 'verify-checkout', path: '/checkout' },
  ];

  for (const route of routes) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    
    console.log(`Navigating to ${route.path}...`);
    const response = await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle' });
    console.log(`Status for ${route.path}: ${response.status()}`);
    
    if (response.status() !== 200) {
      throw new Error(`Route ${route.path} failed with status ${response.status()}`);
    }

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, `${route.name}.png`),
      fullPage: false,
    });
    await context.close();
  }

  await browser.close();
  console.log('All routes verified and rendered cleanly (200 OK).');
}

main().catch((err) => {
  console.error('Route verification failed:', err);
  process.exit(1);
});
