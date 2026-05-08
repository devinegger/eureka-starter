# Eureka Starter

A minimal [Eleventy (11ty)](https://www.11ty.dev/) starter for a Markdown-first site.

Use this as a GitHub template to spin up new 11ty sites with a consistent shape:

- folders become sections
- `index.md` files become pages
- nested folders become nested URLs
- a shared Liquid layout provides the site shell
- content stays in Markdown — no traditional CMS

This stays intentionally close to stock 11ty so it's easy to read, easy to edit, and easy to extend.

## Use This Template

Click **Use this template → Create a new repository** on GitHub, or:

```bash
gh repo create my-new-site --template devinegger/eureka-starter --public --clone
cd my-new-site
npm install
npm run serve
```

## What's Included

- shared layout at `_includes/base.liquid`
- root page at `index.md`
- worked example at `demo-project/` (a folder landing page with one nested child)
- stylesheet template at `styles.css.liquid`
- `static/` for raw assets (favicons, OG images, downloads — kept as-is)
- `images/` for content images that should be optimized into responsive `<picture>` elements
- GitHub Pages deploy workflow at `.github/workflows/deploy.yml`

## Local Development

Install dependencies:

```bash
npm install
```

Start the local dev server (watches and rebuilds on change):

```bash
npm run serve
```

Then open <http://localhost:8080/>.

To run a one-time static build:

```bash
npm run build
```

Generated output is written to `_site/`.

## Content Conventions

- Give any folder that should be a page an `index.md`.
- Use subfolders when a page needs its own nested URL.
- Add links to new child pages from the relevant parent `index.md`.
- Use front matter for page metadata (`title`, `description`, `layout`).

Example:

```md
---
title: Example Page
description: Short summary for the page hero area.
layout: base.liquid
---

# Example Page

Page content goes here.
```

## Project Structure

```text
.
|-- .github/workflows/deploy.yml
|-- _includes/
|   `-- base.liquid
|-- demo-project/
|   |-- index.md
|   |-- meeting-notes/
|   |   `-- index.md
|   `-- newpage.md
|-- images/
|-- static/
|-- eleventy.config.mjs
|-- index.md
|-- styles.css.liquid
`-- package.json
```

## Deploying To GitHub Pages

Every site cloned from this template ships with a Pages deploy workflow. To turn it on for a new site:

1. Push to `main`.
2. Go to **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
3. The next push (or a manual run of the workflow) will build with Eleventy and publish `_site/` to Pages.

## Notes

- `AGENTS.md` contains the conventions and guardrails to keep this starter coherent over time.
- After cloning, replace `demo-project/` with your real content and update the root `index.md` to link to your sections.
- Drop favicons, OG images, and other raw assets into `static/`. Reference them as `/static/foo.png`. They are passed through unchanged.
- Drop content images (hero photos, inline figures) into `images/`. Reference them in markdown the normal way: `![alt text](/images/hero.jpg)`. They get auto-transformed at build time into responsive `<picture>` elements with AVIF/WebP/fallback at 400/800/1280 widths via [`@11ty/eleventy-img`](https://www.11ty.dev/docs/plugins/image/).
