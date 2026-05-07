# 11ty Site Spec

## Goal

Create a dead-simple static site over a folder tree of Markdown files using standard 11ty behavior, with no custom scripting required for v1.

The main use case is browsing project and conversation folders locally in a clean HTML site, while also keeping the site publishable later as a normal static website.

## Core Decision

Use Eleventy (11ty) in its standard model:

- Markdown files are source content
- Liquid can be used inside Markdown/templates
- folders map naturally to URLs
- layouts define shared page structure
- ignored content is excluded using normal 11ty ignore behavior via `.gitignore`

No custom content stitching, synthetic page generation, or custom build logic is required for v1.

## Content Model

### Page model

Each folder that should have a page contains an `index.md`.

Examples:

- site root `index.md` -> `/`
- `dangerous-goods-rollout/index.md` -> `/dangerous-goods-rollout/`
- `dangerous-goods-rollout/email/index.md` -> `/dangerous-goods-rollout/email/`

This keeps the URL structure aligned with the folder structure.

### Subfolders

Subfolders are handled naturally by 11ty.

If a subfolder contains an `index.md`, it becomes its own nested page. This is the standard way to create subpages in this site.

### Other Markdown files

Other `.md` files may still become pages if they are included in the 11ty input and not ignored. That is acceptable in v1.

There is no special rule in v1 that only `index.md` files are allowed to publish.

## Layout Model

Use a shared base layout for all pages.

That layout is responsible for the common site shell:

- header
- footer
- title handling
- optional breadcrumbs
- optional nav/listing areas

Each Markdown page provides the page content, and the layout wraps it.

This keeps presentation centralized while letting users keep editing plain Markdown.

## Navigation Model

V1 should stay simple:

- root page acts as the main starting point
- links between pages are normal Markdown or Liquid-generated links
- nested sections come from nested folders

If needed, 11ty collections or simple manual links can be added later, but they are not required for the first version.

## Ignore Model

Use standard 11ty ignore behavior only.

### Primary mechanism

Use `.gitignore` to exclude folders or files that should not become part of the site.

This is the main answer for folders that are really code projects, scratch work, or anything not meant to publish.

This keeps the ignore convention familiar and avoids introducing a second ignore file in v1 unless a later version truly needs it.

## Editing Workflow

Editors work directly in Markdown files on disk.

V1 does not include a browser-based editor or any CMS admin interface.

Typical workflow:

1. Create or edit a folder
2. Add or update `index.md`
3. Add subfolders with their own `index.md` when a nested page is needed
4. Rebuild or run the local 11ty dev server to preview changes

## Build Model

Use standard 11ty local development and build behavior:

- local dev server for preview
- static output folder for generated HTML

The Markdown-to-HTML conversion happens at build time, not in the browser.

This means the published site is plain static HTML, CSS, and optional JS.

## Publishing Model

The site should be publishable in two ways:

### Local-only use

Run 11ty locally and browse the generated site or dev server output.

### GitHub Pages

Publish the generated static site to GitHub Pages.

For 11ty, the normal model is:

- GitHub Actions builds the site
- GitHub Pages serves the generated static output

This is different from Jekyll's built-in Pages integration, but it is still a normal and well-supported deployment approach.

## Non-Goals For V1

The following are explicitly out of scope for the first version:

- custom scripting to stitch sibling Markdown files together
- a custom CMS or web editor
- special routing rules beyond normal folder-based URLs
- automatic metadata extraction from arbitrary folders
- advanced search
- custom plugins unless clearly needed

## Recommended V1 Shape

Use a simple structure like this:

```text
site-root/
  index.md
  package.json
  .gitignore
  AGENTS.md
  styles.css.liquid
  _includes/
    base.liquid
  demo-project/
    index.md
    meeting-notes/
      index.md
```

This is intentionally close to normal 11ty conventions.

## Why This Works

This approach keeps the system easy to explain:

- content lives in Markdown
- structure lives in folders
- layout lives in 11ty templates
- build output is static HTML
- ignored folders stay out through `.gitignore`, which 11ty respects by default

It is simple enough for local browsing, but still cleanly publishable later.

## Later Options

If the v1 proves useful, later versions could add:

- stronger navigation
- collections
- breadcrumbs
- better home page summaries
- a consistent front matter convention
- GitHub Actions deployment automation
- a reusable starter/template version of this setup

None of those are required to validate the idea.
