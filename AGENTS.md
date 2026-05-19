# AGENTS.md

## What this is

`eureka-starter` is a complete 11ty agency template. It produces a marketing site (home, services, service-areas, blog, contact, 404) entirely from data files, with a token-based design system that supports dark/light themes and per-brand accent colors.

It's the baseline every portfolio brand starts from. The user clones it, edits a handful of JSON files, and ships a client site in about 30 minutes.

## Architecture rules

1. **Data files drive everything.** Templates pull from `src/_data/*.json`. The only edits a new client site needs are JSON. If a template requires editing the `.njk` file to change copy, that's a bug — make it data-driven.

2. **Components reference semantic tokens only.** Never use raw color hex, never use primitive tokens (`--color-teal-500`) inside components. Always semantic (`--accent-default`). This is what makes theming work.

3. **System fonts only.** No Google Fonts, no web font shipping. The design uses the system stack on purpose — instant first paint, Lighthouse headroom.

4. **No CSS framework.** No Tailwind, no Bootstrap. Handwritten CSS organized as tokens / base / components / utilities.

5. **No build step beyond 11ty.** No PostCSS, no esbuild, no Vite. If a feature needs tooling, the cost-benefit needs to clear a high bar.

6. **Vanilla JS only on the client.** No React, no Vue, no frameworks. Small, scoped, namespaced files in `src/assets/js/`.

7. **One concern per file.** A partial covers one section. A widget is one self-contained interactive element. Don't mix.

## Folder map (cliff notes)

- `design-reference/` — canonical design source from claude.ai/design. Don't delete; future visual decisions reference it. Ignored by 11ty.
- `eleventy.config.mjs` — ESM config. Sets `input: "src"`, registers image plugin + HtmlBasePlugin, passthroughs for `assets/`, `static/`, `admin/`. Path prefix from `PATH_PREFIX` env.
- `src/_data/` — global config + section content. Naming convention: one JSON per concept (`hero.json`, `pitch.json`, `services.json`). 11ty exposes each as `{{ <basename> }}` in templates.
- `src/_includes/layouts/` — `base.njk` (full HTML shell), `landing.njk` (passes content through, no chrome), `page.njk` (generic interior with hero + prose), `post.njk` (blog).
- `src/_includes/partials/` — section components. Each maps to a section of the home page or interior page.
- `src/_includes/widgets/` — drop-in interactive widgets. Used inside `partials/widget-slot.njk`.
- `src/assets/css/` — token system. `main.css` imports the four layers in cascade order. Don't @import elsewhere.
- `src/assets/js/` — vanilla JS, no bundler. Each file is independently loadable. Loaded conditionally from `base.njk` based on front matter flags (`hasPagespeedWidget`, `hasContactForm`).
- `src/admin/` — Decap CMS shell + config. Edit collections in `config.yml` when adding new data files.
- `src/pages/` — every routable URL. Use `pagination` in front matter for dynamic pages over a data file.

## Common operations

### Add a new service

Append an object to `src/_data/services.json`. Done — paginated detail page generates automatically, card appears on home + services index.

### Add a new section to the home page

1. Create `src/_includes/partials/your-section.njk`.
2. Optionally add `src/_data/your-section.json` for its content.
3. Include in `src/pages/index.njk` at the right position.
4. Add styles to `src/assets/css/components.css`.

### Add a new widget

1. `src/_includes/widgets/your-widget.njk` — markup.
2. Add a branch in `src/_includes/partials/widget-slot.njk`.
3. If interactive: `src/assets/js/your-widget.js` + a `has<Widget>` flag in `base.njk`.

### Add a new portfolio brand

```css
/* in src/assets/css/tokens.css */
[data-brand="brand-x"] {
  --accent-default: #...;
  --accent-hover:   #...;
  --accent-contrast: var(--color-neutral-0);
  --accent-glow:    rgba(..., 0.18);
}
```

Then `"brand": "brand-x"` in `site.json`. Don't override anything else — surfaces, text, borders all stay theme-bound.

### Switch a site to light theme

`"theme": "light"` in `site.json`. To switch per-section, add `data-theme="light"` to a wrapping element.

## What not to do

- Don't hardcode colors, sizes, or radii anywhere except `tokens.css`.
- Don't put content copy in templates. Use a data file.
- Don't add a JS framework. The whole point of this template is that it doesn't have one.
- Don't add dependencies without thinking hard. Current footprint is `@11ty/eleventy` + `@11ty/eleventy-img`. Both earn their keep.
- Don't fork the design-reference structure. If the visual language needs to change, update it in `tokens.css` and the partials; keep the reference intact for diffing against.
- Don't delete `design-reference/`. It's a permanent source of truth.

## Setup

```bash
npm install
npm run serve     # dev with watch
npm run build     # static build → _site/
npm run clean     # rm _site
```

## Per-client checklist

When forking for a new client:

1. `package.json` `name`.
2. `src/_data/site.json` — brand name, mark, tagline, theme, brand variant, contact info, address.
3. `src/_data/services.json` — replace with the client's actual services.
4. `src/_data/serviceAreas.json` — replace with the client's actual markets.
5. `src/_data/testimonials.json` — real testimonials.
6. `src/_data/industries.json` — relevant industries (chip cloud on home).
7. `src/_data/hero.json`, `pitch.json`, `differentiator.json`, `finalCta.json` — rewrite for the client voice.
8. Drop favicons in `src/static/`.
9. If the client wants a new accent color, add `[data-brand="<client>"]` block to `tokens.css` and reference in `site.json`.
10. Add 2-3 starter blog posts in `src/pages/blog/`.
11. Update `README.md` and this `AGENTS.md` to reflect the client site's name and any client-specific customization.
