import { HtmlBasePlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import Handlebars from "handlebars";
import { readFile, readdir } from "node:fs/promises";
import { join, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

// ----------------------------------------------------------------------------
// Handlebars setup
//
// 11ty v3 removed Handlebars as a built-in engine. We register it as a custom
// template engine via addExtension, register all .hbs files in _includes/ as
// partials, and add a few helpers used by layouts and partials.
// ----------------------------------------------------------------------------

const INCLUDES_DIR = fileURLToPath(new URL("./src/_includes/", import.meta.url));

/**
 * Walk a directory and yield every file path (absolute).
 */
async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

/**
 * Register every .hbs file under src/_includes/ as a Handlebars partial.
 * Partial name = path relative to _includes/, without extension, using
 * forward slashes. So src/_includes/partials/nav.hbs → "partials/nav".
 */
async function registerPartials() {
  for await (const file of walk(INCLUDES_DIR)) {
    if (extname(file) !== ".hbs") continue;
    const name = relative(INCLUDES_DIR, file)
      .replace(/\\/g, "/")
      .replace(/\.hbs$/, "");
    const source = await readFile(file, "utf8");
    Handlebars.registerPartial(name, source);
  }
}

// ----------------------------------------------------------------------------
// Helpers — kept small and orthogonal.
// ----------------------------------------------------------------------------

// {{section "hero"}} → "partials/hero" — used with dynamic partials:
//   {{#each sections}}{{> (section this)}}{{/each}}
Handlebars.registerHelper("section", (name) => `partials/${name}`);

// {{#if (eq foo "bar")}} ... {{/if}}
Handlebars.registerHelper("eq", (a, b) => a === b);

// {{#if (gt loop.index 2)}} etc.
Handlebars.registerHelper("gt",  (a, b) => a > b);
Handlebars.registerHelper("lte", (a, b) => a <= b);

// Numeric add: {{add @index 1}}
Handlebars.registerHelper("add", (a, b) => Number(a) + Number(b));

// {{currentYear}} — used by the footer.
Handlebars.registerHelper("currentYear", () => new Date().getFullYear());

// {{readableDate page.date}}
Handlebars.registerHelper("readableDate", (d) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
);
Handlebars.registerHelper("isoDate", (d) => new Date(d).toISOString());

// {{slug "Some Title"}} for URL fragments.
Handlebars.registerHelper("slug", (s) =>
  String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
);

// {{{raw value}}} — output a string without HTML-escaping. Handlebars already
// does this with triple-stash, so this is a convenience alias for clarity.
Handlebars.registerHelper("raw", (s) => new Handlebars.SafeString(s ?? ""));

// {{sectionName item}} — resolves a section list entry to a partial name.
// Supports both formats so existing pages keep working and Decap can emit
// the structured form:
//   sections: [hero, pitch]                  → strings, returned as-is
//   sections: [{name: hero}, {name: pitch}]  → objects, returns .name
// This lets the editor schema use a list-of-objects (Decap's natural shape
// when each list item has a select widget) without forcing a content
// migration on existing markdown files.
Handlebars.registerHelper("sectionName", (item) =>
  typeof item === "string" ? item : item?.name
);

// ----------------------------------------------------------------------------
// 11ty config
// ----------------------------------------------------------------------------

export default async function (eleventyConfig) {
  // Register partials before any template compiles.
  await registerPartials();

  // Custom template engine for .hbs files. Front-matter is parsed by 11ty
  // before reaching this compile() function — `data` contains the merged
  // page/global/data-file scope, and `str` is the template body.
  eleventyConfig.addExtension("hbs", {
    outputFileExtension: "html",
    compile: function (str) {
      const template = Handlebars.compile(str);
      return function (data) {
        return template(data);
      };
    },
  });

  // Responsive image transform on output HTML.
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    extensions: "html",
    formats: ["avif", "webp", "auto"],
    widths: ["auto", 400, 800, 1280],
    defaultAttributes: {
      loading: "lazy",
      decoding: "async",
      sizes: "100vw",
    },
  });

  // pathPrefix rewriter — must run after the image plugin.
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // Passthroughs (paths relative to project root).
  eleventyConfig.addPassthroughCopy({ "src/static": "static" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });

  // Watch CSS so the dev server reloads on style changes.
  eleventyConfig.addWatchTarget("./src/assets/");

  // Filter equivalents for Markdown — exposed so .md frontmatter can call
  // {{ page.date | readableDate }} if needed. We mirror the helpers above.
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString());
  eleventyConfig.addFilter("readableDate", (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["hbs", "md", "html"],
    markdownTemplateEngine: "hbs",
    htmlTemplateEngine: "hbs",
    pathPrefix: process.env.PATH_PREFIX || "/",
  };
}
