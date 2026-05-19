import { HtmlBasePlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default function (eleventyConfig) {
  // Responsive image transform on output HTML. Source paths resolve from
  // project root so /images/foo.jpg → src/images/foo.jpg works.
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

  // pathPrefix rewriter — added after image plugin so it sees final URLs.
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // Passthroughs (paths relative to project root).
  eleventyConfig.addPassthroughCopy({ "src/static": "static" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });

  // Treat .md files as Nunjucks so we can use partials in Markdown too.
  eleventyConfig.setTemplateFormats(["njk", "md", "html"]);

  // Watch CSS so the dev server reloads on style changes.
  eleventyConfig.addWatchTarget("./src/assets/");

  // Date helper used by templates.
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString());
  eleventyConfig.addFilter("readableDate", (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );

  // Slug helper for paginated URLs.
  eleventyConfig.addFilter("slug", (s) =>
    String(s)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    pathPrefix: process.env.PATH_PREFIX || "/",
  };
}
