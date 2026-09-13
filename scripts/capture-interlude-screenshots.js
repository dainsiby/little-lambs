import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function capture() {
  const artifactsDir = 'C:\\Users\\dains\\.gemini\\antigravity-ide\\brain\\93471b74-4e35-423e-87de-5cd9fb1d652c';
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }

  const browser = await chromium.launch();

  // 1. Desktop 1440x900 view (Hero + Yellow Strip + Faith section top)
  const desktopCtx = await browser.newContext({ viewport: { width: 1440, height: 950 } });
  const desktopPage = await desktopCtx.newPage();
  await desktopPage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  const desktopScreenshotPath = path.join(artifactsDir, 'desktop-yellow-interlude.png');
  await desktopPage.screenshot({ path: desktopScreenshotPath, fullPage: false });

  // 2. Mobile 375x812 view (Hero bottom + Yellow Strip + Faith section top)
  const mobileCtx = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  const mobileScreenshotPath = path.join(artifactsDir, 'mobile-yellow-interlude.png');
  await mobilePage.screenshot({ path: mobileScreenshotPath, fullPage: false });

  await desktopCtx.close();
  await mobileCtx.close();
  await browser.close();

  console.log('Desktop and mobile interlude screenshots captured successfully!');
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
