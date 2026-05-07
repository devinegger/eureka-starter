---
title: Codex Exploration
description: Start here to browse the demo sections and see how a plain folder tree turns into a simple 11ty site.
layout: base.liquid
---

This starter keeps everything close to default 11ty behavior:

- each visible section lives in a folder with an `index.md`
- nested folders become nested URLs
- shared page chrome lives in `_includes/base.liquid`
- non-site project notes stay out of the build through `.gitignore`

## Demo sections

<ul class="section-list">
  <li>
    <a href="/demo-project/">
      <strong>Demo Project</strong>
      A small project page with one nested section.
    </a>
  </li>
  <li>
    <a href="/weekly-notes/">
      <strong>Weekly Notes</strong>
      A simple top-level page that reads like a lightweight running log.
    </a>
  </li>
</ul>

## Update workflow

When you add a new folder page later:

1. Create the folder.
2. Add an `index.md`.
3. Link to it from the relevant parent `index.md`.

That keeps the site structure obvious without any custom page-generation logic.
