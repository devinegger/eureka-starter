# AGENTS.md

## What This Is

`eureka-starter` is a minimal Eleventy (11ty) template that turns a folder tree of Markdown files into a static site. It is meant to be used as a GitHub template — every new 11ty site starts here.

The shape:

- each folder can become a URL
- each `index.md` becomes the main page for that folder
- nested folders become nested sections
- `_includes/base.liquid` provides the shared shell
- `.gitignore` keeps non-site content out of the build

This is intentionally not a CMS. The content source is the file system; the editing workflow is direct Markdown editing.

## Guardrails

Keep this starter close to stock 11ty unless there is a clear reason not to.

- no custom content stitching
- no browser-based editor
- no custom scripting unless clearly necessary
- no special routing model beyond folder-based URLs
- no dependencies beyond `@11ty/eleventy` without explicit reason

If a feature only matters to one downstream site, it belongs in that site, not in this template.

## Contents

- `_includes/base.liquid` — shared Liquid layout
- `index.md` — root landing page
- `demo-project/` — a worked example showing a folder landing page with one nested child page
- `styles.css.liquid` — stylesheet template
- `package.json` — Eleventy as the only runtime dependency
- `.gitignore` — keeps `_site/`, `node_modules/`, and editor noise out of git

## Conventions

- if a folder should be a visible page, give it an `index.md`
- if a folder is only source material and should not publish, ignore it in `.gitignore`
- if a folder becomes too busy, split it into subfolders instead of inventing custom routing
- if navigation gets confusing, improve links in `index.md` pages before adding heavier features
- if a new child page is added, link to it from the relevant parent `index.md`
- prefer front matter (`title`, `description`, `layout`) over implicit conventions

## Setup

1. Open a terminal in the project root.
2. Install dependencies with `npm install`.
3. Start the local dev server with `npm run serve`.
4. Open <http://localhost:8080/>.
5. Edit Markdown or layout files; 11ty rebuilds in watch mode.

For a one-time static build: `npm run build`. Output goes to `_site/`.

## When Adapting This Template For A New Site

1. Update `package.json` `name`.
2. Replace `demo-project/` with real content sections.
3. Rewrite the root `index.md` to link to the real sections.
4. Update `README.md` and this `AGENTS.md` to match the new site's purpose.
5. Adjust `_includes/base.liquid` and `styles.css.liquid` as needed.

## Roadmap

Open ideas, not commitments:

- a clean default navigation pattern for parent and child pages
- GitHub Pages publishing through GitHub Actions
- a one-command scaffold path (template, npm initializer, or similar)
- page templates that include expected front matter by default

Anything more elaborate (Obsidian-based editing, client handoff workflows, Bases-style metadata views) is explored in the upstream `crispy-eureka` repo and will be backported here once stable.
