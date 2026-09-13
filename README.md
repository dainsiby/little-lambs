# little-lambs-store-v2

Responsive Little Lambs landing page built with Next.js App Router, TypeScript, Tailwind CSS and ESLint. This independent v2 project contains frontend presentation only.

## Run locally

Use Node.js 24 LTS and npm 11. From this directory:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. This address refers to the computer running the server; it is not a published website.

## Validation

```sh
npm run lint
npx tsc --noEmit
npm run build
```

All three passed for this handoff. Browser verification passed at 1440×900, 1280×800, 768×1024 and 375×812, without horizontal overflow, missing visible images or JavaScript page errors. See `review/validation.json` and the four browser screenshots.

## Latest visual revision

Removed the separate corner product-book overlay to reveal the existing meadow. Removed the displayed price from the hero and informational preview. The illustration and book being read are unchanged.

## UI behavior

- Desktop: rounded split hero, cream panel, organic SVG curve with a gold edge, navy display headline, botanical accent and continuous storybook scene.
- Mobile and tablet (up to 900px): content-first stacked composition, hamburger navigation, horizontal organic curve and illustration below.
- GET YOUR COPY and BOOK open an informational book preview with the real cover. No purchase or reservation occurs.
- OUR STORY and CONTACT open informational dialogs. The contact email comes from the original cover PDF.
- The cart icon is disabled and its badge is a static zero. No cart functionality exists.
- Dialogs support Escape and restore focus using native HTML dialog behavior. Navigation uses semantic links/buttons and visible keyboard focus styles.
- No authentication, database, Prisma, admin, checkout, payments, custom API routes or backend business functionality.

## Source files

- `src/app/layout.tsx`: document shell, metadata and skip link.
- `src/app/page.tsx`: homepage entry point.
- `src/app/globals.css`: Tailwind import, local fonts and responsive styles.
- `src/components/layout/SiteHeader.tsx`: logo, navigation and mobile menu.
- `src/components/home/LandingHero.tsx`: hero composition.
- `src/components/home/HeroCopy.tsx`: headline, underline, description and CTA.
- `src/components/home/OrganicDivider.tsx`: desktop and mobile curves.
- `src/components/home/StorybookScene.tsx`: illustration and real product-cover layers.
- `src/components/home/BotanicalAccent.tsx`: restrained SVG leaves.
- `src/components/home/BookPreview.tsx`: informational product preview.
- `src/components/ui/InfoDialog.tsx`: reusable native dialog trigger.
- `src/components/ui/Icons.tsx`: lightweight accessible decorative icons.
- `src/lib/`, `src/types/`, `public/icons/`: reserved expansion directories.
- `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`: framework/tooling configuration.
- `package.json`, `package-lock.json`: pinned dependencies and reproducible installs.
- `public/brand/`, `public/books/`, `public/illustrations/`, `public/fonts/`: project-owned asset copies.
- `design-reference/astra-approved-landing-page.png`: reference only, never served as the interface.

## Asset notes

See `ASSETS.md` for origins and remaining limitations. The illustration is a new generated asset based on the approved reference, not the exact original illustration. The authentic logo embedded in the supplied cover PDF is small and low resolution; a standalone high-resolution official logo should replace it when available. The real product cover has not been regenerated.

No commits, pushes or deployments were made.
