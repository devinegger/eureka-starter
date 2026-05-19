# AGENTS.md

## What this is

`eureka-starter` is a markdown-first 11ty agency template. Every routable page is a `.md` file. Layouts and partials are Handlebars. The content author edits markdown frontmatter; templates render.

It's the baseline every portfolio brand starts from. Clone, edit JSON in `_data/`, swap accent colors in tokens.css, ship.

## Architecture rules

1. **Pages are markdown.** Frontmatter declares the layout and which sections compose the page. The body is optional Markdown that renders inline via the `body` sentinel in the sections list. If you find yourself creating a new `.hbs` page template, ask whether the page can be expressed as a section composition instead.

2. **Data files drive everything.** Section partials read from `src/_data/*.json`. A new client site needs only JSON edits.

3. **Components reference semantic tokens only.** Never use raw color hex, never use primitive tokens (`--color-teal-500`) inside components. Always semantic (`--accent-default`). This is what makes theming work.

4. **Handlebars is logic-less.** Use `{{#if}}` / `{{#each}}` / `{{#unless}}` and the small helper set in `eleventy.config.mjs`. If you reach for complex logic, push it into a data file or a helper.

5. **System fonts only.** No Google Fonts, no web font shipping. Instant first paint, Lighthouse headroom.

6. **No CSS framework.** No Tailwind, no Bootstrap. Handwritten CSS organized as tokens / base / components / utilities.

7. **No build step beyond 11ty.** No PostCSS, no esbuild, no Vite.

8. **Vanilla JS only on the client.** Small, scoped, namespaced files in `src/assets/js/`.

9. **One concern per file.** A partial covers one section. A widget is one self-contained interactive element.

## How sections compose

A page declares a list of section partials in frontmatter:

```yaml
sections:
  - page-hero
  - body
  - about-values
  - cta-block
```

The `landing.hbs` layout iterates the list. For each entry:

- `body` → renders the page's markdown body inside `.prose`
- anything else → looks up `src/_includes/partials/<name>.hbs` and renders it with the full page context (so partials can read `site`, the matching data file like `about`, page frontmatter like `pageHero`, etc.)

To add a new composable section: drop a `.hbs` file in `partials/`, reference it by filename in any page's `sections:` array. Done.

## Folder map

- `design-reference/` — canonical design source from claude.ai/design. Don't delete; future visual decisions reference it. Ignored by 11ty.
- `eleventy.config.mjs` — ESM config. Registers Handlebars as a custom extension; auto-registers every `.hbs` in `_includes/` as a partial; defines helpers; sets `input: src`, passthroughs for `assets/`, `static/`, `admin/`.
- `src/_data/` — global config + section content. Naming convention: one JSON per concept. 11ty exposes each as `{{ <basename> }}` in the page scope.
- `src/_includes/layouts/` — `base.hbs` (HTML shell), `landing.hbs` (sections iterator), `page.hbs` (interior page), `post.hbs` (blog), `service.hbs` + `area.hbs` (paginated detail pages).
- `src/_includes/partials/` — section components. Each is composable into any landing-layout page.
- `src/_includes/widgets/` — drop-in interactive widgets. Used inside `widget-slot`.
- `src/assets/css/` — token system. `main.css` imports the four layers in cascade order. Don't @import elsewhere.
- `src/assets/js/` — vanilla JS, no bundler. Loaded conditionally from `base.hbs` based on frontmatter flags (`hasPagespeedWidget`, `hasContactForm`).
- `src/admin/` — Decap CMS shell + config. Edit collections in `config.yml` when adding new data files.
- `src/pages/` — every routable URL. Use `pagination` in frontmatter for dynamic pages over a data file.

## Common operations

### Add a new content page

```bash
npm run new-page services/diagnostics "Free Diagnostics"
```

Creates `src/pages/services/diagnostics.md` with a sensible stub. Edit the sections list and frontmatter. Add to `src/_data/nav.json` if you want it in the menu.

### Add a new service

Append to `src/_data/services.json`. New `/services/<slug>/` page generates automatically; new card appears on home and services index.

### Add a new section partial

1. Create `src/_includes/partials/your-section.hbs`.
2. Optionally add `src/_data/your-section.json` for its content.
3. Reference it from any page's `sections:` array.
4. Add component styles to `src/assets/css/components.css`.

### Add a new widget

1. `src/_includes/widgets/your-widget.hbs` — markup, scoped to `.eureka-widget`.
2. Add an `{{else if (eq widget "your-widget")}}` branch in `src/_includes/partials/widget-slot.hbs`.
3. If interactive: `src/assets/js/your-widget.js` + a `has<Widget>` flag in `base.hbs`.
4. On a page: `widget: your-widget` in frontmatter, include `widget-slot` in sections.

### Add a new portfolio brand

```css
/* in src/assets/css/tokens.css */
[data-brand="brand-x"] {
  --accent-default:  #...;
  --accent-hover:    #...;
  --accent-contrast: var(--color-neutral-0);
  --accent-glow:     rgba(..., 0.18);
}
```

Then `"brand": "brand-x"` in `site.json`. Don't override anything else — surfaces, text, borders stay theme-bound.

### Switch a site to light theme

`"theme": "light"` in `site.json`. Per-section: add `data-theme="light"` to a wrapping element.

## What not to do

- Don't hardcode colors, sizes, or radii anywhere except `tokens.css`.
- Don't put content copy in templates. Use a data file or page frontmatter.
- Don't add a JS framework.
- Don't add dependencies without thinking hard. Current: `@11ty/eleventy`, `@11ty/eleventy-img`, `handlebars`. All earn their keep.
- Don't write a page as a `.hbs` template when it could be a `.md` with composed sections. The whole point is that content authors don't touch templates.
- Don't delete `design-reference/`.

## Setup

```bash
npm install
npm run serve     # dev with watch
npm run build     # static build → _site/
npm run clean     # rm _site
```

## Per-client checklist

1. `package.json` `name`.
2. `src/_data/site.json` — brand name, mark, tagline, theme, brand variant, contact info, address, Turnstile sitekey if available.
3. `src/_data/services.json` — replace with the client's actual services.
4. `src/_data/serviceAreas.json` — actual markets.
5. `src/_data/testimonials.json` — real testimonials.
6. `src/_data/industries.json` — relevant industries.
7. `src/_data/hero.json`, `pitch.json`, `differentiator.json`, `finalCta.json`, `about.json` — rewrite for client voice.
8. Drop favicons in `src/static/`; replace `favicon.svg`.
9. New accent color? Add `[data-brand="<client>"]` block in `tokens.css`, set `brand` in `site.json`.
10. Add 2-3 starter blog posts in `src/pages/blog/`.
11. Update `README.md` and this `AGENTS.md` to match the client.
