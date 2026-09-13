import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function capture() {
  const screenshotDir = path.resolve('scratch/screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const artifactsDir = 'C:\\Users\\dains\\.gemini\\antigravity-ide\\brain\\93471b74-4e35-423e-87de-5cd9fb1d652c';
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }

  const browser = await chromium.launch();
  
  // 1. Desktop 1440x900 Viewport
  const desktop1440Ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page1440 = await desktop1440Ctx.newPage();
  await page1440.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  
  const d1440Path = path.join(screenshotDir, 'desktop-home-1440x900.png');
  await page1440.screenshot({ path: d1440Path, fullPage: false });
  fs.copyFileSync(d1440Path, path.join(artifactsDir, 'desktop-home-1440x900.png'));

  // 2. Desktop Full Page
  const dFullPagePath = path.join(screenshotDir, 'desktop-home-full-page.png');
  await page1440.screenshot({ path: dFullPagePath, fullPage: true });
  fs.copyFileSync(dFullPagePath, path.join(artifactsDir, 'desktop-home-full-page.png'));

  // 3. Featured Book Section
  const featuredElem = page1440.locator('.featured-book-section');
  if (await featuredElem.isVisible()) {
    const featuredPath = path.join(screenshotDir, 'featured-book-section.png');
    await featuredElem.screenshot({ path: featuredPath });
    fs.copyFileSync(featuredPath, path.join(artifactsDir, 'featured-book-section.png'));
  }

  // 4. Our Story Section
  const storyElem = page1440.locator('.our-story-teaser');
  if (await storyElem.isVisible()) {
    const storyPath = path.join(screenshotDir, 'our-story-section.png');
    await storyElem.screenshot({ path: storyPath });
    fs.copyFileSync(storyPath, path.join(artifactsDir, 'our-story-section.png'));
  }

  await desktop1440Ctx.close();

  // 5. Tablet 768x1024 Viewport
  const tabletCtx = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  const pageTablet = await tabletCtx.newPage();
  await pageTablet.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  const tabletPath = path.join(screenshotDir, 'tablet-home-768x1024.png');
  await pageTablet.screenshot({ path: tabletPath, fullPage: false });
  fs.copyFileSync(tabletPath, path.join(artifactsDir, 'tablet-home-768x1024.png'));
  await tabletCtx.close();

  // 6. Mobile 375x812 Viewport
  const mobileCtx = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  
  const m375Path = path.join(screenshotDir, 'mobile-home-375x812.png');
  await mobilePage.screenshot({ path: m375Path, fullPage: false });
  fs.copyFileSync(m375Path, path.join(artifactsDir, 'mobile-home-375x812.png'));

  // 7. Mobile Full Page
  const mFullPagePath = path.join(screenshotDir, 'mobile-home-full-page.png');
  await mobilePage.screenshot({ path: mFullPagePath, fullPage: true });
  fs.copyFileSync(mFullPagePath, path.join(artifactsDir, 'mobile-home-full-page.png'));

  await mobileCtx.close();

  await browser.close();
  console.log('All 7 homepage reference screenshots captured successfully!');
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
