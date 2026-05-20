// ============================================================================
// EUREKA — TinaCMS configuration
// ----------------------------------------------------------------------------
// Schema strategy for v1:
//
// - Pages use a `blocks` array (Tina's block-based composition). Each block
//   is a section that appears on the page; drag to reorder.
// - Most blocks are MARKERS without fields — they just say "render the foo
//   section here." Content for those sections lives in the shared singleton
//   data files (hero.json, pitch.json, etc.) or in collections (services,
//   testimonials, …) and the existing Handlebars partials read from there.
// - Only `page-hero` and `widget-slot` have inline fields, because those
//   are genuinely per-page (different eyebrow/title per interior page,
//   different widget choice per page).
//
// In v2 we can pull hero/pitch/differentiator content into their block
// fields and have partials read from block context — that's the fully
// "shadcn-style component with its own content" model. But it requires
// rewriting those partials and migrating the singleton data. v1 keeps
// things working with zero partial / data file changes.
//
// Auth: Tina Cloud. Set TINA_CLIENT_ID and TINA_TOKEN env vars locally
// (.env) and in the Sevalla build. The branch field controls which Git
// branch Tina commits to — `main` for production.
// ============================================================================

import { defineConfig } from "tinacms";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.HEAD ||
  process.env.SEVALLA_GIT_BRANCH ||
  "main";

// ----- Block templates -----------------------------------------------------
// Tina requires template names to be alphanumeric + underscores. We use
// nameOverride so the value stored in markdown still matches the partial
// filename (kebab-case) under src/_includes/partials/.

const blocks = [
  // Per-page content blocks (have inline fields)
  {
    name: "page_hero",
    nameOverride: "page-hero",
    label: "Interior page hero",
    fields: [
      { type: "string" as const, name: "eyebrow", label: "Eyebrow" },
      { type: "string" as const, name: "title",   label: "Headline (HTML allowed)", ui: { component: "textarea" } },
      { type: "string" as const, name: "sub",     label: "Sub-headline",            ui: { component: "textarea" } },
    ],
  },
  {
    name: "widget_slot",
    nameOverride: "widget-slot",
    label: "Widget slot",
    fields: [
      {
        type: "string" as const,
        name: "widget",
        label: "Widget to load",
        options: [
          { value: "pagespeed-checker", label: "PageSpeed checker" },
          { value: "roi-calculator",   label: "ROI calculator (stub)" },
        ],
      },
      { type: "string" as const, name: "widgetEyebrow", label: "Eyebrow" },
      { type: "string" as const, name: "widgetTitle",   label: "Heading" },
      { type: "string" as const, name: "widgetLede",    label: "Lede", ui: { component: "textarea" } },
      { type: "string" as const, name: "widgetMeta",    label: "Meta (right-aligned)" },
    ],
  },

  // Services grid optionally overrides its title/lede
  {
    name: "services_grid",
    nameOverride: "services-grid",
    label: "Services grid",
    fields: [
      { type: "string"  as const, name: "servicesEyebrow", label: "Eyebrow (override)" },
      { type: "string"  as const, name: "servicesTitle",   label: "Heading (override)" },
      { type: "string"  as const, name: "servicesLede",    label: "Lede (override)", ui: { component: "textarea" } },
      { type: "boolean" as const, name: "expandedGrid",    label: "Wider 2-up layout" },
    ],
  },

  // Marker blocks — content comes from shared singleton data files.
  // GraphQL requires at least one field per type, so each has an optional
  // `note` annotation field. It's never read by Handlebars partials.
  { name: "hero",                nameOverride: undefined,             label: "Hero (home)",                fields: [{ type: "string" as const, name: "note", label: "Editor note" }] },
  { name: "pitch",               nameOverride: undefined,             label: "Three-column pitch",         fields: [{ type: "string" as const, name: "note", label: "Editor note" }] },
  { name: "differentiator",      nameOverride: undefined,             label: "Differentiator",             fields: [{ type: "string" as const, name: "note", label: "Editor note" }] },
  { name: "process_steps",       nameOverride: "process-steps",       label: "Process steps",              fields: [{ type: "string" as const, name: "note", label: "Editor note" }] },
  { name: "industries_chips",    nameOverride: "industries-chips",    label: "Industries chip cloud",      fields: [{ type: "string" as const, name: "note", label: "Editor note" }] },
  { name: "testimonials",        nameOverride: undefined,             label: "Testimonials",               fields: [{ type: "string" as const, name: "note", label: "Editor note" }] },
  { name: "cta_block",           nameOverride: "cta-block",           label: "Final CTA + mini form",      fields: [{ type: "string" as const, name: "note", label: "Editor note" }] },
  { name: "about_values",        nameOverride: "about-values",        label: "About values grid",          fields: [{ type: "string" as const, name: "note", label: "Editor note" }] },
  { name: "service_areas_grid",  nameOverride: "service-areas-grid",  label: "Service-areas grid",         fields: [{ type: "string" as const, name: "note", label: "Editor note" }] },
  { name: "blog_listing",        nameOverride: "blog-listing",        label: "Blog post list",             fields: [{ type: "string" as const, name: "note", label: "Editor note" }] },
  { name: "contact_info_form",   nameOverride: "contact-info-form",   label: "Contact info + full form",   fields: [{ type: "string" as const, name: "note", label: "Editor note" }] },
  { name: "error_404",           nameOverride: "error-404",           label: "404 error page",             fields: [{ type: "string" as const, name: "note", label: "Editor note" }] },
  { name: "body",                nameOverride: undefined,             label: "Markdown body of this page", fields: [{ type: "string" as const, name: "note", label: "Editor note" }] },
];

// Small helper for repeated string field shapes.
function s(name: string, label: string, opts: { textarea?: boolean; options?: { value: string; label: string }[] } = {}) {
  const f: any = { type: "string" as const, name, label };
  if (opts.textarea) f.ui = { component: "textarea" };
  if (opts.options)  f.options = opts.options;
  return f;
}

export default defineConfig({
  branch,
  // Set in .env (and Sevalla env vars) after registering at tina.io.
  // Until then `tinacms dev` runs in local mode.
  clientId: process.env.TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",

  build: {
    outputFolder: "admin",
    publicFolder: "src",
  },

  media: {
    tina: {
      mediaRoot: "static/uploads",
      publicFolder: "src",
    },
  },

  schema: {
    collections: [
      // ----- PAGES — folder collection with blocks -----------------------
      {
        name: "page",
        label: "Pages",
        path: "src/pages",
        format: "md",
        // No router — keeps Tina in standard form-editing mode.
        // A router function would trigger visual editing mode (split panel)
        // which requires Tina's React client on the site to bind fields.
        // Our Handlebars site doesn't have that integration, so without a
        // router the sidebar shows the full form editor as expected.
        fields: [
          s("title", "Page title"),
          s("description", "Meta description", { textarea: true }),
          s("permalink", "URL path (start and end with /)"),
          s("layout", "Layout", {
            options: [
              { value: "layouts/landing.hbs", label: "Landing (blocks-based)" },
              { value: "layouts/page.hbs",    label: "Page (interior prose)" },
              { value: "layouts/post.hbs",    label: "Blog post" },
              { value: "layouts/service.hbs", label: "Service detail (paginated)" },
              { value: "layouts/area.hbs",    label: "Area detail (paginated)" },
            ],
          }),
          { type: "boolean" as const, name: "hasContactForm",     label: "Loads a contact form" },
          { type: "boolean" as const, name: "hasPagespeedWidget", label: "Loads PageSpeed widget JS" },
          {
            type: "object" as const,
            name: "blocks",
            label: "Sections (drag to reorder)",
            list: true,
            ui: {
              visualSelector: true,
              itemProps: (item: { _template?: string }) => ({
                label:
                  blocks.find(
                    (b) =>
                      ((b as { nameOverride?: string }).nameOverride ?? b.name) ===
                      item?._template,
                  )?.label ??
                  item?._template ??
                  "(empty)",
              }),
            },
            templates: blocks,
          },
          { type: "rich-text" as const, name: "body", label: "Page body (markdown)", isBody: true },
        ],
      },

      // ----- FREQUENTLY EDITED CONTENT ------------------------------------
      // Testimonials, services, areas, industries, nav — clients touch these
      // regularly. Brand & contact is set once. Section copy is set-and-forget.

      {
        name: "testimonials",
        label: "Testimonials",
        path: "src/_data",
        match: { include: "testimonials" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object" as const,
            name: "items",
            label: "Testimonials",
            list: true,
            ui: { itemProps: (i: { name?: string }) => ({ label: i?.name ?? "—" }) },
            fields: [s("quote", "Quote", { textarea: true }), s("name", "Name"), s("role", "Role / company"), s("initials", "Avatar initials")],
          },
        ],
      },

      {
        name: "services",
        label: "Services",
        path: "src/_data",
        match: { include: "services" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object" as const,
            name: "items",
            label: "Services",
            list: true,
            ui: { itemProps: (i: { title?: string }) => ({ label: i?.title ?? "—" }) },
            fields: [
              s("slug", "URL slug"),
              s("index", "Index (01, 02…)"),
              s("title", "Service title"),
              s("shortName", "Short name"),
              s("summary", "One-line summary", { textarea: true }),
              s("hero", "Detail page headline"),
              s("lede", "Detail page lede", { textarea: true }),
              { type: "string" as const, name: "includes", label: "What's included", list: true },
              {
                type: "object" as const,
                name: "pricing",
                label: "Pricing",
                fields: [s("label", "Label"), s("amount", "Amount"), s("note", "Note", { textarea: true })],
              },
              {
                type: "object" as const,
                name: "faq",
                label: "FAQ",
                list: true,
                ui: { itemProps: (i: { q?: string }) => ({ label: i?.q ?? "—" }) },
                fields: [s("q", "Question"), s("a", "Answer", { textarea: true })],
              },
            ],
          },
        ],
      },

      {
        name: "serviceAreas",
        label: "Service areas",
        path: "src/_data",
        match: { include: "serviceAreas" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object" as const,
            name: "items",
            label: "Areas",
            list: true,
            ui: { itemProps: (i: { city?: string; state?: string }) => ({ label: i?.city ? `${i.city}, ${i.state ?? ""}` : "—" }) },
            fields: [
              s("slug", "URL slug"),
              s("city", "City"),
              s("state", "State (2-letter)"),
              s("tagline", "Tagline"),
              s("intro", "Intro paragraph", { textarea: true }),
              { type: "string" as const, name: "highlights", label: "Highlights", list: true },
            ],
          },
        ],
      },

      {
        name: "industries",
        label: "Industries",
        path: "src/_data",
        match: { include: "industries" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object" as const,
            name: "items",
            label: "Industries",
            list: true,
            ui: { itemProps: (i: { label?: string }) => ({ label: i?.label ?? "—" }) },
            fields: [s("label", "Display label"), s("slug", "URL slug")],
          },
        ],
      },

      {
        name: "nav",
        label: "Navigation & menus",
        path: "src/_data",
        match: { include: "nav" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object" as const,
            name: "primary",
            label: "Primary nav (header)",
            list: true,
            ui: { itemProps: (i: { label?: string }) => ({ label: i?.label ?? "—" }) },
            fields: [s("label", "Label"), s("url", "URL")],
          },
          {
            type: "object" as const,
            name: "footer",
            label: "Footer columns",
            fields: [
              {
                type: "object" as const,
                name: "explore",
                label: "Explore column",
                list: true,
                ui: { itemProps: (i: { label?: string }) => ({ label: i?.label ?? "—" }) },
                fields: [s("label", "Label"), s("url", "URL")],
              },
              {
                type: "object" as const,
                name: "legal",
                label: "Legal column",
                list: true,
                ui: { itemProps: (i: { label?: string }) => ({ label: i?.label ?? "—" }) },
                fields: [s("label", "Label"), s("url", "URL")],
              },
            ],
          },
        ],
      },

      // ----- BRAND & SITE SETTINGS ----------------------------------------

      {
        name: "siteSettings",
        label: "Brand & contact",
        path: "src/_data",
        match: { include: "site" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          s("name", "Site name"),
          s("brandMark", "Brand mark (1–2 chars)"),
          s("tagline", "Tagline"),
          s("description", "Meta description", { textarea: true }),
          s("theme", "Default theme", { options: [{ value: "dark", label: "Dark" }, { value: "light", label: "Light" }] }),
          s("brand", "Brand variant slug"),
          s("url", "Canonical site URL"),
          s("phone", "Display phone"),
          s("phoneTel", "tel: link (E.164)"),
          s("email", "Email"),
          {
            type: "object" as const,
            name: "address",
            label: "Office address",
            fields: [s("street", "Street"), s("city", "City"), s("state", "State"), s("zip", "ZIP")],
          },
          s("tagline_footer", "Footer tagline"),
          s("turnstileSiteKey", "Cloudflare Turnstile site key"),
          s("psiApiKey", "PageSpeed Insights API key"),
        ],
      },

      {
        name: "heroData",
        label: "Home — hero",
        path: "src/_data",
        match: { include: "hero" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          s("signal", "Signal pill text"),
          s("title", "Headline (HTML allowed)", { textarea: true }),
          s("sub", "Sub-headline", { textarea: true }),
          { type: "object" as const, name: "primaryCta", label: "Primary CTA", fields: [s("label", "Label"), s("url", "URL")] },
          { type: "object" as const, name: "ghostCta", label: "Secondary CTA", fields: [s("label", "Label"), s("url", "URL")] },
          {
            type: "object" as const,
            name: "proof",
            label: "Proof points",
            list: true,
            ui: { itemProps: (i: { num?: string }) => ({ label: i?.num ?? "—" }) },
            fields: [s("num", "Number"), s("label", "Caption")],
          },
          {
            type: "object" as const,
            name: "healthCard",
            label: "Health card",
            fields: [
              s("url", "Pretend domain"),
              s("time", "Timestamp text"),
              {
                type: "object" as const,
                name: "rows",
                label: "Score rows",
                list: true,
                ui: { itemProps: (i: { label?: string }) => ({ label: i?.label ?? "—" }) },
                fields: [
                  s("label", "Row label"),
                  { type: "number" as const, name: "value", label: "Score (0–100)" },
                  s("grade", "Grade", { options: [{ value: "good", label: "Good" }, { value: "warn", label: "Warning" }, { value: "bad", label: "Bad" }] }),
                ],
              },
              s("note", "Note (HTML allowed)", { textarea: true }),
            ],
          },
        ],
      },

      {
        name: "pitchData",
        label: "Home — intro columns",
        path: "src/_data",
        match: { include: "pitch" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          s("eyebrow", "Eyebrow"),
          s("title", "Heading"),
          s("lede", "Lede", { textarea: true }),
          {
            type: "object" as const,
            name: "items",
            label: "Columns",
            list: true,
            ui: { itemProps: (i: { title?: string }) => ({ label: i?.title ?? "—" }) },
            fields: [s("num", "Eyebrow label"), s("title", "Title"), s("body", "Body", { textarea: true })],
          },
        ],
      },

      {
        name: "differentiatorData",
        label: "Home — methodology",
        path: "src/_data",
        match: { include: "differentiator" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          s("eyebrow", "Eyebrow"),
          s("title", "Heading"),
          s("lede", "Lede", { textarea: true }),
          s("ctaLabel", "CTA button label"),
          s("ctaUrl", "CTA button URL"),
          {
            type: "object" as const,
            name: "items",
            label: "Numbered points",
            list: true,
            ui: { itemProps: (i: { head?: string }) => ({ label: i?.head ?? "—" }) },
            fields: [s("head", "Point headline"), s("body", "Point body", { textarea: true })],
          },
        ],
      },

      {
        name: "processData",
        label: "Our process",
        path: "src/_data",
        match: { include: "process" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          s("eyebrow", "Eyebrow"),
          s("title", "Heading"),
          s("lede", "Lede", { textarea: true }),
          {
            type: "object" as const,
            name: "steps",
            label: "Steps",
            list: true,
            ui: { itemProps: (i: { title?: string }) => ({ label: i?.title ?? "—" }) },
            fields: [
              s("num", "Step number"),
              s("title", "Step title"),
              s("body", "Step body", { textarea: true }),
              { type: "boolean" as const, name: "active", label: "Highlighted" },
            ],
          },
        ],
      },

      {
        name: "finalCtaData",
        label: "Footer call to action",
        path: "src/_data",
        match: { include: "finalCta" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          s("eyebrow", "Eyebrow"),
          s("title", "Headline (HTML allowed)", { textarea: true }),
          s("body", "Body paragraph", { textarea: true }),
          {
            type: "object" as const,
            name: "buttons",
            label: "Buttons",
            list: true,
            ui: { itemProps: (i: { label?: string }) => ({ label: i?.label ?? "—" }) },
            fields: [
              s("label", "Label"),
              s("url", "URL"),
              s("style", "Style", { options: [{ value: "primary", label: "Primary" }, { value: "ghost", label: "Ghost" }] }),
            ],
          },
          { type: "object" as const, name: "form", label: "Mini form", fields: [s("title", "Form title")] },
        ],
      },

      {
        name: "aboutData",
        label: "About — story & values",
        path: "src/_data",
        match: { include: "about" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object" as const,
            name: "story",
            label: "Story header",
            fields: [s("eyebrow", "Eyebrow"), s("title", "Heading"), s("sub", "Sub-heading", { textarea: true })],
          },
          {
            type: "object" as const,
            name: "values",
            label: "Values grid",
            fields: [
              s("title", "Section title"),
              {
                type: "object" as const,
                name: "items",
                label: "Values",
                list: true,
                ui: { itemProps: (i: { title?: string }) => ({ label: i?.title ?? "—" }) },
                fields: [s("title", "Value title"), s("body", "Value body", { textarea: true })],
              },
            ],
          },
        ],
      },

      // ----- SECTION COPY — set once, rarely changed -----------------------
      // These drive the shared section partials (hero, pitch, etc.).
      // Clients editing page content generally don't need to touch these.

    ],
  },
});
