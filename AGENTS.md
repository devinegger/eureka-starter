# AGENTS.md

## What This Is

This directory contains the planning artifacts for a very simple Eleventy (11ty) site.

The idea is to use standard 11ty behavior to turn a folder tree of Markdown files into a browsable static site:

- each folder can become a URL
- each `index.md` becomes the main page for that folder
- nested folders become nested sections
- layouts provide the shared page shell
- `.gitignore` is used to keep non-site content out of the build

This is intentionally not a CMS in the traditional sense. The content source is the file system and the editing workflow is direct Markdown editing.

## Current Intent

The initial use case is a local and later-publishable site that helps browse project or conversation folders at a glance.

The v1 approach should stay very close to stock 11ty:

- no custom content stitching
- no browser-based editor
- no custom scripting unless clearly necessary
- no special routing model beyond normal folder-based URLs

## Status

This workspace now contains a minimal stock 11ty starter for local testing.

The current starter includes:

- a shared Liquid layout in `_includes/base.liquid`
- a root `index.md`
- a small nested demo content tree
- a stylesheet template at `styles.css.liquid`
- ignore rules in `.gitignore` to keep project notes out of generated site output

## How To Keep This Updated

When working on this project in future Codex sessions:

1. Keep the architecture aligned with standard 11ty behavior unless the user explicitly wants to go beyond it.
2. Prefer `index.md` for folder landing pages and use subfolders for nested sections.
3. If new pages or sections are added, update the relevant parent `index.md` so it links to those pages clearly.
4. Keep the root `index.md` current as the main entry point to important sections.
5. Use `.gitignore` for folders or files that should not be included in the generated site.
6. Keep implementation notes and specs in sync when the project direction changes.

## Content Maintenance Notes

Helpful conventions for this project:

- if a folder should be a visible page, give it an `index.md`
- if a folder is only source material and should not publish, ignore it in `.gitignore`
- if a folder becomes too busy, split it into subfolders instead of inventing a custom routing rule
- if navigation gets confusing, improve links in `index.md` pages before adding heavier features
- if a new child page is added, add a link to it from the relevant parent `index.md`

## Roadmap

### Near-term

- test local builds against the included demo content tree
- refine the base layout with the minimum additional polish needed for real use
- decide whether root navigation should stay manual or move to a standard 11ty collection pattern

### Next

- add a clean default navigation pattern for parent and child pages
- document the expected folder and page conventions with examples
- add one more real-looking section and then wire up GitHub Pages publishing
- add GitHub Pages publishing through GitHub Actions

### Later

- turn this base into a reusable template or starter
- make it easy to create a new site instance with a single command
- decide whether that command should come from a repo template, an npm initializer, or another lightweight scaffold path
- explore a client handoff model where Obsidian becomes the website content manager
- document an Obsidian-friendly workflow using Markdown folders, local preview, and simple publishing steps
- evaluate useful companion tools for that workflow, including a browser preview plugin, terminal access, and Git-based publishing
- define the minimum client-safe setup so non-technical editors can update content without needing to understand 11ty internals
- create new page templates that include the expected front matter by default so editors start from a valid page shape
- explore using Obsidian Bases so front matter properties can be viewed and edited more easily in table form

## Ignore Note

This file should be listed in `.gitignore` for the site project so that 11ty does not treat it as site content. The current setup also ignores the planning docs for the same reason.
