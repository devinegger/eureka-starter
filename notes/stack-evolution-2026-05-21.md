# Stack Evolution Notes — 2026-05-21

A working doc capturing an exploration of where the eureka-starter / client-site
stack should evolve. Started from "is MDX in 11ty a middle ground between my
current setup and Astro+Tina?" and broadened into a full ecosystem question.

---

## The MDX-in-11ty question (resolved)

The instinct that MDX-in-11ty is a middle ground between 11ty and Astro+Tina
turns out to be a mirage.

What actually makes Astro+Tina (and Next+Tina) feel better isn't `.mdx` as a
file extension — it's:

1. **Live component rendering in Tina's visual editor.** Real component runtime
   means the preview iframe shows the actual `<Hero>`, `<CTA>`, etc. as you edit.
2. **Block-based content models.** Tina `object`/`list` fields that map 1:1
   to components. Editors pick "add a Hero block," fill fields, see it render.
3. **HMR / dev server speed.** Edits round-trip fast.

11ty's MDX support renders MDX → HTML **at build time**. No client React
runtime, so Tina's visual editor still can't render components live in the
preview. You'd inherit MDX's tooling weight without the payoff.

**Verdict:** MDX in 11ty is a niche feature for static authoring with JSX-flavored
prose. It does *not* unlock the Tina editing experience that motivated the question.

---

## The "leanness" question — what does Astro actually buy you over Next?

All three stacks (11ty, Astro, Next) can hit Lighthouse 95+ on a content site
with basic care. The measurable differences:

| Metric | 11ty | Astro | Next.js |
|---|---|---|---|
| Baseline JS shipped (before your code) | 0 KB | 0 KB | ~85–110 KB gzipped |
| Lighthouse 100 (mobile, slow 4G) | trivial | trivial | achievable w/ care |
| TTI vs FCP gap | identical | identical (unhydrated) | TTI lags (React hydration) |
| Build, 100 pages | ~3–8s | ~8–15s | ~25–60s |
| Build, 1000 pages | ~30s | ~60–90s | 3–10 min |
| HMR / dev reload | fast | very fast (Vite) | medium |
| Hosting cost shape | static, anywhere | static, anywhere | pulls toward Vercel-style compute |

### Where Next's JS payload actually bites

- **Mobile / slow networks.** ~100 KB framework JS = ~1 cache-miss roundtrip
  to download + 200–400ms to parse on midrange Android. Shows up in Core Web
  Vitals (INP, slightly LCP) on slow devices.
- **Build time, compounded.** Across many client sites: 30s vs 5min adds up.
- **Cost per visit.** Vercel-style pricing for Next can be 5–20× a static deploy.
  Invisible at low traffic, visible if a site takes off.

### Where leanness doesn't matter

- 500 visits/day on broadband — nobody notices.
- Google Search Console will read "Good" CWV on all three.
- If you rarely add interactivity, Next's runtime is just sitting there.

**Verdict:** For most NA small-business client sites, all three are functionally
equivalent on perceived speed. The choice collapses to editor experience,
ecosystem fit, DX preferences — not perf.

---

## Migration lift: eureka-starter (11ty) → Next.js + Tina

Eureka-starter is more substantial than a typical "small marketing site":
- 6 Handlebars layouts
- ~20 partials (widgets, hero, CTA, testimonials, nav, footer, etc.)
- Widget slot system for editor-driven block content
- Multiple collections: pages, services, service-areas, blog
- Custom CLI scripts: `new-page`, `new-folder`, `convert-page`, `build`, `sync-tina`

### What ports cleanly

- Markdown content in `src/pages/` — drag-and-drop, frontmatter mostly portable.
- `tina/config.ts` — Tina is framework-agnostic; schema transfers with light edits
  (mainly the `ui` properties / preview routing).
- Static assets (`src/assets/`, `src/images/`, `src/static/`).
- CSS / Tailwind config.
- `.env` and Tina Cloud connection.

### What needs a real rewrite

- 6 Handlebars layouts → React/JSX + Next.js `layout.tsx`/`page.tsx`.
- ~20 partials → React components (editor-aware ones must be wired to Tina visual editing).
- Widget composition pattern → Tina template blocks + React component switch.
- Custom scripts → some drop (Next has its own build); page scaffolders need rewriting or replacement.
- Routing (11ty permalinks/collections → Next App Router conventions).
- Image pipeline (`@11ty/eleventy-img` → `next/image`).
- Admin route — stops being baked-in HTML; becomes part of the Next app.

### Time estimate (focused work, reasonable React/Next comfort)

| Phase | Time |
|---|---|
| Scaffold new project, connect Tina | 2–3 hrs |
| Port + adapt Tina schema | 4–8 hrs |
| Rewrite layouts as React components | 1–2 days |
| Rewrite partials/widgets as React components | 2–3 days |
| Wire visual editor (block components matched to schema) | 1–2 days |
| Replace/port custom scripts | 0.5–1 day |
| QA, deploy setup, parity check | 1–2 days |
| **Total** | **~1.5–2.5 weeks** |

### Per-client-site math

- After the starter is migrated, each new client site = a few hours to a day.
- If you migrate per-client *without* migrating the starter, you pay ~80% of the
  starter cost every single time. This is the worst path.

---

## The three strategic options (post-exploration)

### Option 1 — Migrate the starter once, re-flow new client sites from it

- High up-front cost (1.5–2.5 weeks).
- Low marginal cost going forward.
- Existing 11ty client sites stay on 11ty (don't migrate unless a redesign is
  already on the table).
- Best long-term ROI **if** the editor experience is genuinely worth the investment.

### Option 2 — Two starters, two tiers

- Keep eureka-starter on 11ty for cheap/simple sites.
- Build a separate Next+Tina (or Astro+Tina) starter for premium clients.
- Lower commitment than option 1; but you carry two stacks.

### Option 3 — Don't migrate. Improve the existing 11ty Tina schema

- Most of the perceived editor gap is **schema design**, not framework choice.
- Reshape `tina/config.ts` to be more block-based: richer field types, better
  labels, better organization, clearer block names.
- Cost: 1–3 days.
- Probably closes 60–70% of the editor gap without changing frameworks.
- **Worth genuinely trying before committing to a rewrite.**

---

## Current direction (Devin's read)

Leaning toward Option 3 as an exploratory effort. The insight that surprised
me: the editor experience can probably be meaningfully improved without
switching frameworks — by treating Tina schema design as the primary lever.

### Emerging tier model for client work

1. **11ty** — minimal core sites, less custom marketing, no client editing.
   Easy for me or my wife to edit locally and push. Personal / family /
   no-handoff projects.
2. **Astro** — more complex, with client handoff for editing. Pretty much
   where the current Eureka site sits. Pair with well-organized Tina schema
   (the Option 3 work).
3. **Next.js** — full client handoff, bigger clients with more budget.
   Performance tradeoffs don't matter at that scale. Best for sites with
   advanced custom widgets or heavy 3rd-party integrations.

---

## Open questions / things to come back to

- [ ] Actually try Option 3: reshape `tina/config.ts` for a single existing
      collection (e.g. `services`) into clean block-based fields and see how
      much the editor improves.
- [ ] Run the `npx create-tina-app@latest` eval (prompt below) in a sandbox
      to feel the canonical Next+Tina editor experience firsthand before
      committing to or ruling out option 1.
- [ ] Decide whether the Astro experiment from the other session becomes
      the "tier 2" starter, or whether to consolidate around one framework.
- [ ] Re-examine the tier-3 boundary: "advanced custom widgets and 3rd party
      integrations" is often achievable in Astro too. The real Next.js
      justifications are closer to:
        - Server-side data fetching at request time (e-commerce, gated content)
        - Heavy app-like interactivity (this is becoming an app, not a site)
        - Specific Next/Vercel ecosystem requirements
        - ISR for content needing freshness without rebuilds
        - Auth, dashboards, SaaS-shaped products

---

## Sandbox eval prompt for create-tina-app

To run in a new Claude Code session outside the eureka-starter directory:

```
I want to evaluate Tina's canonical stack as a potential replacement for my
11ty + Tina starter that I use to spin up client sites.

Please do the following:

1. Create a new directory called `tina-eval` in the current working directory.
2. Inside it, run `npx create-tina-app@latest` and walk me through the prompts.
   I want the default/recommended option — the Next.js starter that the Tina
   team treats as canonical. If there's a choice between "barebones" and a
   fuller starter (like tina-cloud-starter or the Next.js block-based starter),
   pick the one that best demonstrates Tina's visual editor with block-based
   content modeling.
3. After install, give me a tour:
   - What's the directory structure and what does each top-level folder do?
   - Where does Tina's schema live and how are blocks defined?
   - How does the visual editor get wired to the actual rendered components?
   - What's the dev workflow — what command starts everything, what URLs?
   - What does deployment look like (Vercel default, or can it deploy static elsewhere)?
4. Start the dev server and open it so I can poke the editor in a browser.
5. Don't modify my existing eureka-starter project or any sibling project —
   this is a sandbox evaluation only.

Context: I'm a freelancer/agency building marketing sites for small businesses.
My current stack is 11ty + Tina, which works but the editor experience is
mediocre. I've also tried Astro + Tina (better editor, lighter output). I want
to see the "default" Tina experience before deciding whether to migrate my
starter template.
```

---

## Big-picture frame

The MD-files-as-content idea has matured into a spectrum of tools that share a
common content layer but offer different rendering/editing UX. Not "one wins" —
**these are 2–3 different tools for different jobs**, and a mature agency
practice probably tiers offerings accordingly. That's the real takeaway from
this exploration.
