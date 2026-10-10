# LifeWise Counseling & Wellness website

The existing homepage and the remaining LifeWise pages share the ivory, green, and gold design. Content and reference images come from the supplied `../scraped_site` clone.

The site includes services and seven service detail pages; a care team directory and five profiles; consultation booking; insurance and pricing; FAQs; referral partners; supervision and career development; five client information pages; and a searchable reflections archive with 35 full articles.

## Run locally

Install Node.js, open a terminal in this folder, then run `npm install` once and `npm run dev`. Vite opens a local development server so React modules and site assets are served with browser-safe URLs.

## Build for hosting

Run `npm run build`. The generated `dist` folder is a static site; upload its contents to a static host. The build creates a separate `index.html` for each route, so direct page visits work without requiring a single-page application rewrite. A host must serve directory index files, as most static hosts do. Double-clicking `index.html` directly (`file://`) is not a reliable way to run a React app because browsers restrict JavaScript modules.

React and Vite are declared in `package.json` and installed locally by `npm install`. Google Fonts are optional and fall back to system serif/sans fonts.

## Content and navigation

Homepage markup is in `src/site.jsx`. Interior layouts and client navigation are in `src/pages.jsx`, with styles in `src/pages.css`. The source content is bundled in `src/content.json`; copied reference images live in `public/images/reference`.

The seven service detail pages use `src/service-pages.jsx` and `src/service-pages.css` to present the reference content as image-led introductions, topic panels, editorial sections, counseling approach cards, and closing invitations. The shared framed navbar and service directory are in `src/navigation.jsx` and `src/navigation.css`. The homepage Sanctuary spans the full viewport width, with its content centered inside.

Interior service cards and page heroes use 19 distinct, locally stored Unsplash photographs. The manifest is in `src/media.json`, images are in `public/images/unsplash`, and sources are recorded in `docs/media-credits.md`. Articles without an original photo use text cards instead of a repeated fallback image. Logos and provider portraits retain their consistent identities.

Internal links stay in the local website. The consultation page opens the original Google booking calendar. Existing provider scheduling links remain in their profiles. No backend or contact-form submission service is required.

`python scripts/import-content.py` refreshes imported content and images from the supplied clone. It requires Beautiful Soup (`beautifulsoup4`). This is optional; normal development and builds use the checked-in content and do not require Python. WordPress attachment pages and duplicate archive pagination snapshots are represented by their images and the combined reflections archive.

## Verification

After a production build, `python scripts/check-site.py` runs an isolated headless browser against `dist`. It requires Python Playwright and Chromium. It checks all 62 routes, local links, browser errors, responsive widths, navigation and browser Back, search and category filters, load-more behavior, FAQs, and the original consultation calendar link. Visual review captures are in `docs/qa`.
