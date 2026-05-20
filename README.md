# Eureka Starter

The agency template used to spin up a new client site in 30 minutes. Built with [Eleventy (11ty)](https://www.11ty.dev/) on **markdown content + Handlebars templates**. Token-based design system, dark/light themes, per-brand accent colors. Zero JavaScript frameworks, no bundler, no build step beyond 11ty itself.

## The shape

- **Every page is a `.md` file** under `src/pages/`. Frontmatter declares which layout to use and which blocks (sections) compose the page.
- **Layouts and partials are `.hbs`** under `src/_includes/`. Content editors never open one.
- **All copy lives in `src/_data/*.json`.** A new client site is mostly JSON edits.
- **CMS:** [TinaCMS](https://tina.io) with block-based composition, auth via Tina Cloud (free tier).
- **Pages compose by declaring blocks**, drag-to-reorder in the CMS:

  ```yaml
  ---
  layout: layouts/landing.hbs
  blocks:
    - _template: page-hero
      eyebrow: About
      title: A small team that ships.
      sub: Built for owner-operators.
    - _template: body            # ← markdown body renders here
    - _template: about-values
    - _template: cta-block
  ---

  ## Markdown body
  ```

  Legacy pages can still use the bare `sections: [name, name]` array — both formats render via the same layout. Tina edits emit the block form.

## What ships in the box

- **Complete dark/light design system** — two-layer token architecture (primitive colors, spacing, type → semantic surfaces, text, accents) in [tokens.css](src/assets/css/tokens.css). Components reference semantic tokens only; new brands override 4 lines of CSS.
- **10 production page templates** — home, about, services overview + paginated detail, service-areas overview + paginated detail, contact (with honeypot + Turnstile slot), blog index + posts, 404. All driven from data files.
- **18 section partials** — `hero`, `pitch`, `services-grid`, `differentiator`, `process-steps`, `industries-chips`, `widget-slot`, `testimonials`, `cta-block`, `page-hero`, `about-values`, `contact-info-form`, `service-areas-grid`, `blog-listing`, `error-404`, plus shared `nav` and `footer`.
- **Widget slot pattern** — drop any self-contained widget into a consistent section wrapper. PageSpeed Insights checker functional out of the box, ROI calculator stub ready to flesh out.
- **TinaCMS** at `/admin/` with block-based page composition, collections for every data file, and Git-based content (no separate database). Auth via Tina Cloud.
- **Responsive image pipeline** via [@11ty/eleventy-img](https://www.11ty.dev/docs/plugins/image/) (AVIF/WebP/fallback at 400/800/1280 widths).
- **GitHub Pages deploy** via Actions.
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
├── eleventy.config.mjs            # 11ty config, ESM, Handlebars as custom extension
├── scripts/                       # page scaffolders
├── src/
│   ├── _data/                     # site config + section content
│   │   ├── site.json              # brand, contact, theme, brand variant
│   │   ├── nav.json               # primary + footer menus
│   │   ├── services.json          # 4 services, used by grid + paginated detail pages
│   │   ├── serviceAreas.json      # cities, used by paginated detail pages
│   │   ├── industries.json
│   │   ├── testimonials.json
│   │   ├── about.json             # values grid content
│   │   ├── hero.json
│   │   ├── pitch.json
│   │   ├── differentiator.json
│   │   ├── process.json
│   │   └── finalCta.json
│   ├── _includes/
│   │   ├── layouts/               # base.hbs, landing.hbs, page.hbs, post.hbs,
│   │   │                          # service.hbs (paginated), area.hbs (paginated)
│   │   ├── partials/              # 18 section components — referenceable by name
│   │   │                          # from any page's `sections:` frontmatter
│   │   └── widgets/               # pagespeed-checker, roi-calculator
│   ├── admin/                     # Decap CMS shell + config.yml
│   ├── assets/
│   │   ├── css/                   # tokens / base / components / utilities (+ main.css)
│   │   └── js/                    # nav-mobile, pagespeed-widget, contact-form
│   ├── images/                    # source content images (processed responsive)
│   ├── pages/                     # every routable page is .md here
│   │   ├── index.md               # home landing
│   │   ├── about.md
│   │   ├── contact.md
│   │   ├── 404.md
│   │   ├── services/
│   │   │   ├── index.md
│   │   │   └── service.md         # paginated over services.json
│   │   ├── service-areas/
│   │   │   ├── index.md
│   │   │   └── area.md            # paginated over serviceAreas.json
│   │   └── blog/
│   │       ├── blog.json          # directory-data: layout + post tag
│   │       ├── index.md
│   │       └── *.md               # one file per post
│   └── static/                    # raw passthrough (favicons, OG images, uploads)
└── _site/                         # build output, git-ignored
```

## Authoring a page

### A landing page (composed sections, no body)

```yaml
---
layout: layouts/landing.hbs
title: My Page
permalink: /my-page/
sections:
  - page-hero
  - services-grid
  - process-steps
  - cta-block
pageHero:
  eyebrow: Section
  title: Page heading
  sub: Supporting paragraph.
hasContactForm: true     # loads contact-form.js + Turnstile script
---
```

That's the whole page. Save it as `src/pages/my-page.md` and you have a new route.

### A landing page with markdown prose between sections

Use the special `body` sentinel in the sections list. The markdown body renders inline at that point:

```yaml
---
layout: layouts/landing.hbs
title: About
sections:
  - page-hero
  - body          # ← markdown renders here, wrapped in .prose
  - about-values
  - cta-block
---

## The story

Write markdown here. Headings, links, lists — anything Markdown supports.
```

### A pure prose page (no composed sections)

Use `layouts/page.hbs` — it provides a hero from your frontmatter and renders the markdown body as a `.prose` block, then a closing CTA.

```yaml
---
layout: layouts/page.hbs
title: Privacy policy
description: How we handle your data.
---

## Markdown body goes here
```

### A blog post

Drop a `.md` file in `src/pages/blog/`. The blog directory data file applies `layout: layouts/post.hbs` and the `post` tag automatically:

```yaml
---
title: Post title
description: One-line summary, shown on the index card.
date: 2026-05-17
author: Eureka team
---

Post body in Markdown.
```

It'll appear on `/blog/` (most recent first) and at `/blog/<slug>/`.

## Available sections

Every name below is a partial under `src/_includes/partials/<name>.hbs` — reference it directly in any page's `sections:` array.

| Section | What it renders | Data source |
|---|---|---|
| `hero` | Home hero with proof strip + health card visual | `_data/hero.json` |
| `page-hero` | Generic interior page hero | page frontmatter `pageHero` |
| `pitch` | Three-column intro band | `_data/pitch.json` |
| `services-grid` | Service cards (4-up or 2-up wide) | `_data/services.json` |
| `differentiator` | Methodology block with numbered list | `_data/differentiator.json` |
| `process-steps` | Three-step horizontal stepper | `_data/process.json` |
| `industries-chips` | Industry chip cloud | `_data/industries.json` |
| `widget-slot` | Section wrapper around any widget | page frontmatter `widget`, `widgetEyebrow`, etc. |
| `testimonials` | Three-card testimonial grid | `_data/testimonials.json` |
| `cta-block` | Final CTA section with mini contact form | `_data/finalCta.json` |
| `about-values` | Two-by-two values grid | `_data/about.json` |
| `service-areas-grid` | Service-area cards | `_data/serviceAreas.json` |
| `blog-listing` | Reverse-chronological post list | `collections.post` |
| `contact-info-form` | Full contact form with three contact methods | `_data/site.json` |
| `error-404` | 404 page body | — |
| `body` | Special sentinel — renders the page's markdown body | the page itself |

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
:root, [data-theme="dark"] { /* dark bindings */ }
[data-theme="light"]       { /* light bindings */ }
```

Legacy aliases (`--paper`, `--ink`, `--teal`, etc.) match the original design-reference names so any markup you copy from `design-reference/` still works.

### Theming a site

```json
// src/_data/site.json
{ "theme": "dark" }     // or "light"
```

To override per-section, wrap with `data-theme="light"` on any element.

### Per-brand accent override

A new portfolio brand only needs to override the four accent semantic tokens:

```css
/* in src/assets/css/tokens.css */
[data-brand="brand-b"] {
  --accent-default:  #C2410C;
  --accent-hover:    #EA580C;
  --accent-contrast: var(--color-neutral-0);
  --accent-glow:     rgba(194, 65, 12, 0.20);
}
```

Then set `"brand": "brand-b"` in `site.json`. The whole site re-accents.

## Handlebars conventions

11ty v3 doesn't ship Handlebars natively, so we register it as a custom extension in `eleventy.config.mjs`. Every `.hbs` file under `src/_includes/` is automatically registered as a partial, named by its path relative to `_includes/` (without extension):

- `_includes/partials/nav.hbs` → `{{> partials/nav}}`
- `_includes/widgets/pagespeed-checker.hbs` → `{{> widgets/pagespeed-checker}}`

The dynamic partial syntax in `landing.hbs` looks up partials by section name:

```hbs
{{#each sections}}
  {{> (section this) @root}}
{{/each}}
```

The `section` helper just prepends `partials/`; passing `@root` ensures each partial sees the full page scope rather than the current loop's string value.

### Custom helpers

Defined in `eleventy.config.mjs`:

| Helper | Use |
|---|---|
| `{{section "name"}}` | `"partials/name"` — used for dynamic partials |
| `{{#if (eq a b)}}` | Equality |
| `{{#if (gt a b)}}` / `(lte a b)` | Number comparisons |
| `{{add @index 1}}` | Numeric add |
| `{{currentYear}}` | The current year (footer) |
| `{{readableDate date}}` | "May 17, 2026" |
| `{{isoDate date}}` | ISO 8601 string |
| `{{slug "Some Title"}}` | URL-safe slug |
| `{{{raw value}}}` | Output unescaped (alias for triple-stash) |

## Forms

Home page and contact page both ship a form with:

- **Honeypot field** (`.hp-field` + `name="hp-field"`) — hidden via CSS, dropped on submit if filled
- **Cloudflare Turnstile placeholder** — div with `class="cf-turnstile"` and `data-sitekey="{{site.turnstileSiteKey}}"`. Set the key in `site.json` to enable; the script tag loads conditionally on pages with `hasContactForm: true`.
- **Client-side honeypot check** in `src/assets/js/contact-form.js`
- **Submit target**: not wired yet. Bind to `/api/contact` (a Cloudflare Worker is the natural fit) before going live.

## Adding a new widget

1. Drop a new `.hbs` file in `src/_includes/widgets/your-widget.hbs` (markup only, scoped under `.eureka-widget`).
2. Add the matching branch in `src/_includes/partials/widget-slot.hbs`:
   ```hbs
   {{else if (eq widget "your-widget")}}
     {{> widgets/your-widget}}
   ```
3. If the widget needs JS, drop it in `src/assets/js/your-widget.js` and add a conditional script tag in `src/_includes/layouts/base.hbs`.
4. On a page, set `widget: your-widget` in frontmatter and add `widget-slot` to the sections list.

## TinaCMS

Content is edited through [TinaCMS](https://tina.io) at `/admin/`. The editor reads/writes the same Git-tracked files Eleventy builds from — no separate database. Blocks (Tina's term for sections) appear as a drag-to-reorder list with a visual selector showing previews. Each block maps to a Handlebars partial under `src/_includes/partials/`.

### Tina Cloud setup

1. Sign in at [app.tina.io](https://app.tina.io) with GitHub
2. Create a new project, connect this repo
3. Copy the **Client ID** and a **Read-Only Token** from project settings
4. Locally: copy `.env.example` to `.env`, paste in the values
5. In Sevalla (or your host): add `TINA_CLIENT_ID` and `TINA_TOKEN` as build env vars
6. Trigger a fresh build — Tina's admin bundle is generated into `src/admin/` and passed through to `/admin/` on the live site

Until those credentials are set, `npm run build` skips the Tina admin build and just runs Eleventy. The site works; the editor doesn't.

### Schema

Edit `tina/config.ts` to add/modify collections or block templates. Common changes:

- **Add a new block template** — append to the `blocks` array. Each block's `name` (and `nameOverride` for kebab-case) must match a partial filename in `src/_includes/partials/`.
- **Add a new collection** — append a new entry to `schema.collections`. Use `path` + `match.include` for singletons, plain `path` for folder collections.
- **Add an image upload field** — set `type: "image"` on any field; Tina handles upload to `src/static/uploads/`.

### Local development

```bash
npm run serve
```

Runs `tinacms dev` alongside `eleventy --serve`. Open `http://localhost:4001/admin/` to access the editor (works in local mode without Tina Cloud credentials — content edits commit straight to your working tree, no auth required).

## Deploying to GitHub Pages

The workflow is already wired (`.github/workflows/deploy.yml`):

1. Push to `main`.
2. **Settings → Pages → Source → GitHub Actions**.
3. Site builds with `PATH_PREFIX=/<repo-name>/` and publishes.

Custom domain? Drop a `CNAME` file in `src/static/` and unset `PATH_PREFIX` in the workflow.

## Spinning up a new client site

1. Click **Use this template** on GitHub (or `gh repo create my-client --template devinegger/eureka-starter`).
2. Edit `src/_data/site.json` — name, brand mark, contact info, address, theme.
3. Replace content in `src/_data/services.json`, `serviceAreas.json`, `testimonials.json`, `industries.json`, and the section files (`hero.json`, `pitch.json`, `differentiator.json`, `finalCta.json`, `about.json`).
4. Add 2-3 starter blog posts as `.md` in `src/pages/blog/`.
5. If the client wants a different accent, add a `[data-brand="client-name"]` block to `tokens.css` and set `brand` in `site.json`.
6. Run `npm run build`, push, enable Pages.

About 30 minutes if the client has their copy ready.

## Notes

- Lighthouse target: 95+ on mobile out of the box. No web fonts, system font stack, lazy-loaded responsive images.
- Reduced-motion respected in `base.css`.
- Skip-to-main link, ARIA labels, semantic landmarks throughout.
- The `design-reference/` folder is the canonical source of truth for the visual language. It's git-tracked and ignored by 11ty (see `.eleventyignore`). Don't delete it — future template work compares against it for consistency.
- `AGENTS.md` is the longer-form notes for keeping this template coherent over time.
