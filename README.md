# Codex Exploration 11ty Starter

A minimal [Eleventy (11ty)](https://www.11ty.dev/) starter for a Markdown-first site.

This project is designed around a simple idea:

- folders become sections
- `index.md` files become pages
- nested folders become nested URLs
- a shared Liquid layout provides the site shell
- content stays in Markdown instead of a traditional CMS

The current version is intentionally close to stock 11ty behavior. It is meant to be easy to understand, easy to edit, and easy to evolve into a reusable template later.

## What It Includes

- a shared layout at `_includes/base.liquid`
- a root page at `index.md`
- a small demo section at `demo-project/`
- another top-level example at `weekly-notes/`
- a stylesheet template at `styles.css.liquid`

## Local Development

Install dependencies:

```powershell
npm install
```

Start the local dev server:

```powershell
npm run serve
```

Then open:

- [http://localhost:8080/](http://localhost:8080/)

The dev server watches for changes and rebuilds automatically.

To run a one-time static build:

```powershell
npm run build
```

Generated output is written to `_site/`.

## Content Conventions

- Give any folder that should be a page an `index.md`.
- Use subfolders when a page needs its own nested URL.
- Add links to new child pages from the relevant parent `index.md`.
- Use front matter for page metadata such as `title`, `description`, and `layout`.

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
|-- _includes/
|   `-- base.liquid
|-- demo-project/
|   |-- index.md
|   `-- meeting-notes/
|       `-- index.md
|-- weekly-notes/
|   `-- index.md
|-- index.md
|-- styles.css.liquid
`-- package.json
```

## Notes For Handoff

- `AGENTS.md` contains maintenance guidance and the working roadmap.
- `11ty-site-spec.md` contains the original v1 spec and design decisions.
- `docs/` contains implementation planning notes.

## Future Direction

Planned next steps include:

- refining navigation
- adding GitHub Pages publishing
- turning this into a reusable starter/template
- exploring an Obsidian-based editing workflow for client handoff
