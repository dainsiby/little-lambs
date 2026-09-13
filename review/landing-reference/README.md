# Landing reference update

Homepage-only styling uses the existing LandingHero and a SiteHeader landing variant. Other page headers and lower homepage sections are preserved. Explore Books scrolls to the existing catalogue; price removed from the hero. The portrait illustration is a generated adaptation of the existing artwork (see ASSETS.md).

Validation: production build, TypeScript, ESLint, 26 unit tests (`npx vitest run tests/unit`), and 28 Playwright tests passed (2 device-specific skips). Screenshots inspected at 1440px and 375px. Overflow and catalogue navigation checked at 320, 390, 768, 900, 1024 and 1440px.

The browser suite ran against the production server using an environment-local Chromium executable because the standard Playwright browser download timed out. No browser runtime dependency was added to the project.

Database-backed flows were not verified: DATABASE_URL is absent in this environment. The build completed using the project's existing catalogue fallback. Existing `npm test` also discovers the Playwright suite; use `npx vitest run tests/unit` for unit tests and `npm run test:e2e` for browser tests.
