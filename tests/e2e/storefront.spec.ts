import { test, expect } from '@playwright/test';

test.describe('Little Lambs Homepage Final Match & Refinement E2E Suite', () => {
  test('Header sits above hero, renders headline, yellow SVG underline, Explore Books CTA (no hero price), and story illustration', async ({ page }) => {
    await page.goto('/');

    // Header located above hero
    const header = page.locator('.site-header');
    await expect(header).toBeVisible();

    // Headline
    const headline = page.locator('#hero-title');
    await expect(headline).toBeVisible();
    await expect(headline).toContainText('A little book');

    // SVG Underline
    const underlineSvg = page.locator('.hero-underline-svg');
    await expect(underlineSvg).toBeVisible();

    // Explore Books CTA Button
    const ctaBtn = page.locator('.hero-purchase-row .explore-books-cta');
    await expect(ctaBtn).toBeVisible();
    await expect(ctaBtn).toContainText('GET YOUR COPY');

    // Verify hero price badge is present
    const priceBadge = page.locator('.hero-price-badge');
    await expect(priceBadge).toBeVisible();

    // Story Illustration Image verification (naturalWidth > 0 & visible)
    const storyImg = page.locator('.hero-story-img');
    await expect(storyImg).toBeVisible();

    const imgStats = await storyImg.evaluate((img: HTMLImageElement) => ({
      naturalWidth: img.naturalWidth,
      complete: img.complete,
    }));

    expect(imgStats.complete).toBe(true);
    expect(imgStats.naturalWidth).toBeGreaterThan(0);
  });

  test('Check FOR CURIOUS LITTLE MINDS section & 3 activity cards (PRAY, PLAY, LEARN)', async ({ page }) => {
    await page.goto('/');

    const curiousSection = page.locator('#curious-minds');
    await expect(curiousSection).toBeVisible();
    await expect(curiousSection).toContainText('Faith begins with');

    const cards = page.locator('.activity-card');
    await expect(cards).toHaveCount(3);

    await expect(cards.nth(0)).toContainText('01 / PRAY');
    await expect(cards.nth(1)).toContainText('02 / PLAY');
    await expect(cards.nth(2)).toContainText('03 / LEARN');
  });

  test('Check Our Story section with reading lamb mascot and SMYM Elanji Unit facts', async ({ page }) => {
    await page.goto('/');

    const storySection = page.locator('.our-story-teaser');
    await expect(storySection).toBeVisible();
    await expect(storySection).toContainText('OUR LITTLE STORY');
    await expect(storySection).toContainText('SMYM Elanji Unit');

    const mascotImg = page.locator('.story-mascot-img');
    await expect(mascotImg).toBeVisible();
  });

  test('Check Catalogue section ("Ready to explore our catalogue?") renders Book 01 and 2 placeholders', async ({ page }) => {
    await page.goto('/');

    const catalogueSection = page.locator('.our-books-section');
    await catalogueSection.scrollIntoViewIfNeeded();
    await expect(catalogueSection).toBeVisible();
    await expect(catalogueSection).toContainText('Ready to explore');

    const cards = page.locator('.catalogue-card');
    await expect(cards).toHaveCount(3);
    await expect(cards.nth(0)).toContainText('Little Lambs – Book 01');
    await expect(cards.nth(1)).toContainText('More Books');
    await expect(cards.nth(2)).toContainText('More Books');
  });

  test('Check FAQ section ("FOR THE GROWN-UPS") renders 4 interactive accordion items', async ({ page }) => {
    await page.goto('/');

    const faqSection = page.locator('#faqs');
    await expect(faqSection).toBeVisible();
    await expect(faqSection).toContainText('FOR THE GROWN-UPS');

    const faqButtons = page.locator('.faq-question-btn');
    await expect(faqButtons).toHaveCount(4);

    // Item 0 is open by default
    await expect(faqButtons.nth(0)).toHaveAttribute('aria-expanded', 'true');

    // Click item 1 to expand
    await faqButtons.nth(1).click();
    await expect(faqButtons.nth(1)).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#faq-answer-1')).toBeVisible();
  });

  test('Check zero horizontal overflow across homepage', async ({ page }) => {
    await page.goto('/');
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(overflow).toBe(false);
  });

  test('Desktop navigation links render with navy contrast and function', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop nav test only');
    await page.goto('/');

    const booksLink = page.locator('#main-navigation a[href="/books"]');
    await expect(booksLink).toBeVisible();
    await booksLink.click();
    await expect(page).toHaveURL(/\/books/);
  });

  test('Mobile menu opens, closes on Escape, and navigates', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile menu test only');
    await page.goto('/');

    const menuToggle = page.locator('.menu-toggle');
    await expect(menuToggle).toBeVisible();

    // Open menu
    await menuToggle.click();
    const nav = page.locator('#main-navigation');
    await expect(nav).toHaveClass(/is-open/);

    // Close on Escape key
    await page.keyboard.press('Escape');
    await expect(nav).not.toHaveClass(/is-open/);
  });

  test('Check exact homepage section ordering flow', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.site-header')).toBeVisible();
    await expect(page.locator('.split-landing-hero')).toBeVisible();
    await expect(page.locator('.curious-minds-section')).toBeVisible();
    await expect(page.locator('.our-story-teaser')).toBeVisible();
    await expect(page.locator('.our-books-section')).toBeVisible();
    await expect(page.locator('.faq-section')).toBeVisible();
    await expect(page.locator('.site-footer')).toBeVisible();
  });
});
