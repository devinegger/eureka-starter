# Eureka Starter

The agency template used to spin up a new client site in 30 minutes. Built with [Eleventy (11ty)](https://www.11ty.dev/), zero JavaScript frameworks, and a token-based design system that swaps between dark and light themes and per-brand accent palettes from a single line of CSS.

## What ships in the box

- **Complete dark/light design system** — a two-layer token architecture (primitive colors, spacing, type → semantic surfaces, text, accents) defined in [tokens.css](src/assets/css/tokens.css). Components reference semantic tokens only; new brands override 4 lines of CSS.
- **10 production page templates** — home (landing), about, services overview + paginated detail, service-areas overview + paginated detail, contact (with honeypot + Turnstile slot), blog index + posts, 404.
- **Modular section partials** — hero, pitch, services-grid, differentiator, process-steps, industries-chips, testimonials, cta-block, widget-slot, plus nav and footer.
- **A widget slot pattern** — drop any self-contained widget into a consistent section wrapper. Includes a live PageSpeed Insights checker out of the box and a stub ROI calculator ready to flesh out.
- **Decap CMS** wired at `/admin` with editorial workflow and collections for site config, services, service-areas, testimonials, and blog posts.
- **Responsive image pipeline** via [@11ty/eleventy-img](https://www.11ty.dev/docs/plugins/image/) (AVIF/WebP/fallback at 400/800/1280 widths).
- **GitHub Pages deploy** via Actions (already wired up).
- **Page scaffolders** — `npm run new-page`, `new-folder`, `convert-page`.

## Quick start

```bash
npm install
npm run serve
# open http://localhost:8080
```

One-shot build to `_site/`:

```bash
npm run build
```

## Folder structure

```
.
├── design-reference/              # canonical design source (HTML + README); never deleted
├── eleventy.config.mjs            # 11ty config, ESM
├── scripts/                       # page scaffolders
├── src/
│   ├── _data/                     # site config + content for partials
│   │   ├── site.json              # brand, contact, theme, brand variant
│   │   ├── nav.json               # primary + footer menus
│   │   ├── services.json          # 4 services, used by grid + paginated detail pages
│   │   ├── serviceAreas.json      # cities, used by paginated detail pages
│   │   ├── industries.json        # chip cloud
│   │   ├── testimonials.json
│   │   ├── hero.json              # home page hero content + health-card mock
│   │   ├── pitch.json
│   │   ├── differentiator.json
│   │   ├── process.json
│   │   └── finalCta.json          # final CTA block + mini contact form
│   ├── _includes/
│   │   ├── layouts/               # base, page, post, landing
│   │   ├── partials/              # section components (nav, footer, hero, etc.)
│   │   └── widgets/               # pagespeed-checker, roi-calculator
│   ├── admin/                     # Decap CMS shell + config.yml
│   ├── assets/
│   │   ├── css/                   # tokens / base / components / utilities (+ main.css imports them)
│   │   └── js/                    # nav-mobile, pagespeed-widget, contact-form
│   ├── images/                    # source content images (processed responsive)
│   ├── pages/                     # all routable pages
│   │   ├── index.njk              # /
│   │   ├── about.njk
│   │   ├── contact.njk
│   │   ├── 404.njk
│   │   ├── services/
│   │   │   ├── index.njk          # /services/
│   │   │   └── service.njk        # /services/[slug]/ (paginated)
│   │   ├── service-areas/
│   │   │   ├── index.njk
│   │   │   └── area.njk           # paginated
│   │   └── blog/
│   │       ├── blog.json          # directory-data: layout + post tag
│   │       ├── index.njk
│   │       └── *.md               # one file per post
│   └── static/                    # raw passthrough (favicons, OG images, uploads)
└── _site/                         # build output, git-ignored
```

## The design system

### Two-layer tokens

**Primitives** (`src/assets/css/tokens.css`) are raw values: color ramps, the 4-based spacing scale, font sizes, radii. They never appear in component code.

**Semantic tokens** are meaning-based aliases that point at primitives. Components reference these only:

```css
.btn--primary {
  background: var(--accent-default);
  color: var(--accent-contrast);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
}
```

The semantic layer is bound twice — once for the dark theme (default), once for light:

```css
:root, [data-theme="dark"] {
  --surface-base: var(--color-neutral-950);
  --text-primary: var(--color-foreground);
  --accent-default: var(--color-teal-500);
  /* ... */
}

[data-theme="light"] {
  --surface-base: var(--color-neutral-0);
  --text-primary: var(--color-ink-dark);
  --accent-default: var(--color-teal-500);
  /* ... */
}
```

Legacy aliases (`--paper`, `--ink`, `--teal`, etc.) match the original design-reference names so any markup you copy from `design-reference/` still works.

### Theming a site

Set `theme` in `src/_data/site.json`:

```json
{ "theme": "dark" }   // or "light"
```

That writes `data-theme="dark"` onto the root `<html>` element. To override per-section, wrap with `data-theme="light"` on any element.

### Per-brand accent override

A new portfolio brand only needs to override the four accent semantic tokens. Add to `src/assets/css/tokens.css`:

```css
[data-brand="brand-b"] {
  --accent-default:  #C2410C;        /* terracotta */
  --accent-hover:    #EA580C;
  --accent-contrast: var(--color-neutral-0);
  --accent-glow:     rgba(194, 65, 12, 0.20);
}
```

Then set `"brand": "brand-b"` in `site.json`. The whole site re-accent without touching a single component.

## Pages and partials

Every page is data-driven — edit JSON in `src/_data/` and the templates update. The home page (`src/pages/index.njk`) is the canonical example: it composes 9 partials in sequence and pulls all copy from data files.

### Adding a service

Append an object to `src/_data/services.json`. A new `/services/<slug>/` page is generated automatically (paginated via `src/pages/services/service.njk`) and a new card appears on the home and services index pages.

### Adding a service area

Same pattern — append to `src/_data/serviceAreas.json`.

### Adding a blog post

Drop a `.md` file in `src/pages/blog/`:

```md
---
title: Post title
description: One-line summary, shown on the index card.
date: 2026-05-17
author: Eureka team
---

Post body in Markdown.
```

It'll appear on `/blog/` automatically (most recent first) and at `/blog/<slug>/`.

### Adding a new top-level page

Quickest: use the scaffolder.

```bash
npm run new-page services/diagnostics "Free Diagnostics"
npm run new-page about-the-team "About The Team"
```

Then add a nav entry in `src/_data/nav.json` if you want it in the menu.

## The widget slot

A widget is any self-contained interactive element that drops into a section with consistent padding, eyebrow, heading, and meta line.

### Use a widget on a page

In page front matter:

```yaml
---
widget: pagespeed-checker
widgetEyebrow: Free site audit
widgetTitle: How fast is your site, really?
widgetLede: Drop your URL. We’ll run a live PageSpeed check.
widgetMeta: Live · powered by Google PSI
hasPagespeedWidget: true   # loads pagespeed-widget.js
---
{% include "partials/widget-slot.njk" %}
```

### Add a new widget

1. Drop a new `.njk` file in `src/_includes/widgets/your-widget.njk` (markup only, scoped under `.eureka-widget`).
2. Add the matching branch in `src/_includes/partials/widget-slot.njk`:
   ```njk
   {% elif widget == "your-widget" %}
     {% include "widgets/your-widget.njk" %}
   ```
3. If the widget needs JS, drop it in `src/assets/js/your-widget.js` and add a conditional script tag in `src/_includes/layouts/base.njk`.

## Forms

The home page and contact page both ship a form with:

- **Honeypot field** (`.hp-field` + `name="hp-field"`) — hidden via CSS, dropped on submit if filled
- **Cloudflare Turnstile placeholder** — div with `class="cf-turnstile"` and `data-sitekey="{{ site.turnstileSiteKey }}"`. Set the key in `site.json` to enable; the script tag is loaded conditionally on pages with `hasContactForm: true`.
- **Client-side honeypot check** in `src/assets/js/contact-form.js`
- **Submit target**: not wired yet. Bind `/api/contact` (a Cloudflare Worker is the natural fit) before going live.

## Decap CMS

Visit `/admin/` to edit content. Collections:

- **Site settings** — brand, theme, contact info, addresses
- **Services** — full list with pricing, FAQ, included items
- **Service areas** — cities and local highlights
- **Testimonials**
- **Blog posts** — folder-based collection with editor

Auth uses [DecapBridge](https://decapbridge.com) (free starter). When traffic justifies, swap to a self-hosted Cloudflare Worker handling GitHub OAuth — drop in the new `auth_endpoint` in `src/admin/config.yml` and remove the bridge script tag from `src/admin/index.html`.

## Deploying to GitHub Pages

The workflow is already wired (`.github/workflows/deploy.yml`):

1. Push to `main`.
2. **Settings → Pages → Source → GitHub Actions**.
3. Site builds with `PATH_PREFIX=/<repo-name>/` and publishes.

Custom domain? Drop a `CNAME` file in `src/static/` and unset `PATH_PREFIX` in the workflow.

## Spinning up a new client site

1. Click **Use this template** on GitHub (or `gh repo create my-client --template devinegger/eureka-starter`).
2. Edit `src/_data/site.json` — name, brand mark, contact info, address, theme.
3. Replace content in `src/_data/services.json`, `serviceAreas.json`, `testimonials.json`, `industries.json`, and the section files (`hero.json`, `pitch.json`, `differentiator.json`, `finalCta.json`).
4. Add 2-3 starter blog posts in `src/pages/blog/`.
5. If the client wants a different accent color, add a `[data-brand="client-name"] { … }` block to `tokens.css` and set `brand` in `site.json`.
6. Run `npm run build`, push, enable Pages.

About 30 minutes if the client has their copy ready.

## Notes

- Lighthouse target: 95+ on mobile out of the box. No web fonts, system font stack, lazy-loaded responsive images.
- Reduced-motion respected in `base.css`.
- Skip-to-main link, ARIA labels, semantic landmarks throughout.
- The `design-reference/` folder is the canonical source of truth for the visual language. It's git-tracked and ignored by 11ty (see `.eleventyignore`). Don't delete it — future template work compares against it for consistency.
- `AGENTS.md` is the longer-form notes for keeping this template coherent over time.
