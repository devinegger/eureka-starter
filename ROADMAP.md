# Eureka — Roadmap

Living list of work that's identified but not yet scheduled. Items move from here into a PR when prioritized.

Each entry tries to capture: **what**, **why**, and **rough shape of the implementation** so it can be picked up cold months from now.

---

## Architecture

### Installable component registry (the shadcn-for-trades-marketing pattern)

**What:** The starter ships with the bare bones. A catalog of optional components (sections, widgets, full-page templates) lives in a registry. A CLI command copies a chosen component into a new client project, including its partial, CSS, data schema, Decap collection fragment, and any required JS.

**Why:** As of today, the starter is becoming the demo/portfolio site for the agency — bloated with sections that not every client needs. A real starter should be lean. The agency site should be "the starter with everything installed." Client sites should be "the starter with a curated install." Without this, every client site forks all the kitchen-sink content and editors delete what they don't want.

**Inspiration:** [shadcn/ui](https://ui.shadcn.com/) is the proven model. Components live in a central registry, a CLI copies them into your project (not as a dependency — you own the code after install), each component is self-contained.

**Rough shape:**

1. **Components directory** in the registry (could be this repo's `components/` folder for v1, separate repo `eureka-components` later):
   ```
   components/
     hero/
       component.json        # manifest: name, deps, files, install hooks
       partial.hbs           → installs to src/_includes/partials/hero.hbs
       data.json             → installs to src/_data/hero.json
       styles.css            → appended to src/assets/css/components.css OR new file
       decap-fragment.yml    → merged into src/admin/config.yml under collections
       README.md             # what this component does, screenshots, dependencies
   ```

2. **CLI command** (start with `npm run` scripts, graduate to a `bin/eureka` if it gets serious):
   ```
   npm run components:list             # show available components
   npm run components:add hero         # copy hero into the project
   npm run components:remove hero      # reverse it
   ```

3. **Each `add` does:**
   - Copy files into their target locations
   - Merge the Decap fragment into `config.yml` (the tricky part — YAML merge with key dedupe)
   - Append CSS to `components.css` (or create scoped files and import them)
   - Update an `eureka.lock.json` tracking what's installed
   - Print a "next steps" message (where to reference the component in a page's `sections` list)

4. **Each `remove` reverses it** using the lockfile as a manifest.

**Open questions to resolve before building:**

- Single `components.css` (merged) vs per-component CSS files (cleaner but more `@import`s)? Probably per-component with auto-import in `main.css`.
- Decap fragment merge: hand-rolled YAML merge or pull in a library (`yaml` package supports it)? Lean on the library.
- Versioning components — needed? Probably not for v1. Components are content templates, not code dependencies.
- Component dependencies (e.g. "hero requires the proof-points data schema")? Manifest declares them; CLI installs transitively.
- "Update" semantics — if a component evolves in the registry after install, how do you pull the change? In shadcn's world, you don't — you own the code. Same here. Updates are a manual diff.

**Effort estimate:** 1-2 days for v1 (one component manifest format, the install/remove scripts, three example components), maybe a week to feel polished.

**Pre-req:** decide whether `eureka-starter` becomes the lean starter (and a new `eureka-agency-site` repo holds the full-fat instance), or whether the starter stays bloated and we extract components later. Probably the former, but worth a deliberate decision.

---

## Decap CMS

### `/admin/pro/` — raw-power editor surface for developers

**What:** A second Decap entry point at `/admin/pro/` with its own `config.yml` that exposes raw, unstyled, unvalidated fields. Same DecapBridge auth, different schema.

**Why:** The main `/admin/` schema is tier-2 (friendly labels, validated, hint text, controlled vocabularies). That's right for non-technical editors. But occasionally an experienced editor (probably you) wants Decap's UI for speed but doesn't want the guardrails — e.g. add an experimental field to a JSON file without first updating the schema. Today the only way is to edit files locally in git.

**Rough shape:**
- New `src/admin/pro/index.html` (copy of the main one)
- New `src/admin/pro/config.yml` — flatter schema, fewer field types, no `pattern:` constraints, optional everything, raw YAML/JSON editor widgets where it makes sense
- Same backend block as the main config (PKCE, same site ID, same branch)
- Same auth, same DecapBridge site registration — just a different schema viewport
- Document who the audience is (internal team only) and that fields here can break the build if misused

**Effort estimate:** 2-3 hours. Mostly copy + simplify.

---

### Sevalla preview deploys

**What:** Flip `is_preview_enabled: true` on the Sevalla static site. Every PR then gets its own preview URL automatically (e.g. `eureka-starter-handlebars-woy47-pr-3.kinsta.page`); production stays pinned to `main`.

**Why:** Right now, pushing to a feature branch doesn't trigger any deploy — only merges to `main` do. That's correct production hygiene but makes it hard to see content changes before merging. Preview deploys close that loop: open a PR (or push a content edit), get a preview URL in the PR description, share it with stakeholders, merge when approved.

**Rough shape:**
- One PATCH call on the Sevalla site:
  ```
  PATCH /static-sites/9b09819c-0cc0-4016-8d38-1ae22f57116b
  body: { is_preview_enabled: true }
  ```
- Optionally configure preview URL hostname pattern via Sevalla dashboard
- Add a CI step (or just a manual habit) to drop the preview URL into PR descriptions
- Document the flow in `README.md` so non-developers understand "look at the preview URL on the PR before approving"

**Effort estimate:** 5 minutes for the flip, 20 minutes for the README update + first end-to-end verification.

**Note:** Preview deploys may count against the Sevalla plan's build minutes / site cap. Worth confirming pricing before enabling for a busy team.

---

## Not yet roadmapped (ideas captured but not detailed)

- **Custom domain via Cloudflare DNS** (parked — install Cloudflare MCP first)
- **Cloudflare Worker for contact form submission** (currently form posts go nowhere)
- **Self-hosted OAuth broker** to replace DecapBridge (when traffic justifies)
- **Image fields on existing collections** (testimonial avatars, hero visuals) — additive scope, nothing in current data references images
- **Per-page theme override** — the system supports `data-theme="light"` on any element, but no CMS field exposes it per-page yet
- **Blog post hero image rendering** — field exists on the collection (heroImage), not yet wired into `post.hbs`
- **A11y audit pass** — manual sweep of focus rings, contrast on light theme, screen-reader walk
- **Lighthouse budget in CI** — fail the build if scores regress below a threshold
