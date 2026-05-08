---
title: Eureka Starter
description: A minimal Eleventy starter where folders become sections and index.md files become pages.
layout: base.liquid
---

This starter keeps everything close to default 11ty behavior:

- each visible section lives in a folder with an `index.md`
- nested folders become nested URLs
- shared page chrome lives in `_includes/base.liquid`
- non-site project notes stay out of the build through `.gitignore`

## Example section

<ul class="section-list">
  <li>
    <a href="/demo-project/">
      <strong>Demo Project</strong>
      A small project page with one nested child page.
    </a>
  </li>
</ul>

## Update workflow

When you add a new folder page:

1. Create the folder.
2. Add an `index.md`.
3. Link to it from the relevant parent `index.md`.

That keeps the site structure obvious without any custom page-generation logic.
