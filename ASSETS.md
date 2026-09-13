# Asset provenance

| File | Origin and use |
| --- | --- |
| `design-reference/astra-approved-landing-page.png` | Exact copy of the supplied Astra screenshot, reference only. |
| `public/books/cover-front.png` | Front half rendered directly from the original `little lamb_cover(4).pdf`. The landscape aspect ratio is retained. Used in the product preview and perspective-transformed reading-book cover. |
| `public/brand/logo.png` | Official logo extracted from the upper-right of the original cover PDF. No AI recreation. The source mark is low resolution. CSS blending removes the white rectangular appearance against the cream panel. |
| `public/illustrations/storybook-scene.png` | Single continuous illustration generated with the built-in Image Generation tool using the supplied Astra screenshot as a visual reference. No interface, lettering or product artwork generated into the scene. |
| `public/fonts/source-serif-4.woff2` | Source Serif 4 variable Latin font, distributed via Fontsource 5.3.0. License included beside the file. |
| `public/fonts/dm-sans.woff2` | DM Sans variable Latin font, distributed via Fontsource 5.3.0. License included beside the file. |

The exact official cover image is placed over the plain reading-book face in React/SVG with no separate corner product copy. These are layout layers, not an AI interpretation of the cover. The open-book pose differs slightly from the screenshot to accommodate the continuous new illustration.

The small official logo remains a source-quality limitation. Replacing it with a supplied high-resolution logo does not require layout changes.

## Illustration generation prompt

Create ONLY a full-bleed standalone storybook illustration asset for the right half of a real coded website. Use the supplied screenshot as visual reference for the painterly scene, not as an edit target UI. Output a single portrait image, 1024 x 1280 if possible. Match the reference's rich hand-painted warm countryside: large leafy tree canopy fills upper third, thick tree trunk at right, blue sky and distant small cream church with cross around mid upper right, Jesus with brown hair white robe and blue sash seated lower center beneath the tree, three children gathered (girl in pink on left, curly-haired boy right upper, girl yellow right lower), white lamb lying lower left, delicate meadow daisies and grass. Match relative reference positions: Jesus head around x46% y43%; three children heads x24% y60%, x64% y57%, x79% y67%. Jesus and children reading ONE open book near x53% y73%, light blue plain cover, no lettering or invented branding; keep cover face simple so authentic artwork can be overlaid in code. Leave flowers only in bottom right for an authentic product cover overlay later. One continuous coherent illustration with naturally connected background and figures. Entire canvas is illustrated, from left edge to right edge. No white panel, no curved divider, no screenshot, no phone frame, no navigation, no logo, no buttons, no typography, no product mockup at bottom right. Warm natural light, botanical brush strokes, premium traditional children's watercolor/gouache picture-book finish, anatomically coherent hands and faces, peaceful and tender. Do not generate product artwork, logos or words. Return the generated asset with its local path for use in the project.

## Landing reference portrait (September 2026)

- File: `public/illustrations/storybook-hero-portrait.webp`
- Derived from the existing `public/illustrations/storybook-hero-scene.png` with the built-in image generation tool; original retained.
- Purpose: portrait composition for the homepage, with all three children visible and upper canopy space for HTML navigation. This is a generated adaptation, not an exact extraction of the supplied mockup.
- Prompt: Create a portrait 1024x1536 website illustration asset by extending and recomposing this existing illustration. Keep the same Jesus, all three children (girl red dress left, boy cream center right, girl blue right), lamb, open Little Lambs book, painterly style and sunny palette. Tree trunk on left, lush tree canopy upper third, blue sky and distant church right, meadow daisies below. Keep complete character group in middle/lower portion, all faces and lamb visible with side margins. Upper 25% canopy and sky only to leave room for actual HTML navigation. Match existing book artwork. Image fills rectangle edge to edge. NO UI, no buttons, no navigation text, no border, no white panels, no additional books or people. Only text on existing book: Little Lambs.
