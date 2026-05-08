import { HtmlBasePlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default function (eleventyConfig) {
  // Auto-transform <img src="..."> in output HTML into responsive <picture>
  // tags with AVIF/WebP/fallback at multiple widths. Source images can live
  // anywhere the path resolves (e.g. images/, static/).
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

  // Rewrites absolute URLs in output (incl. <img>, <source srcset>, <link>,
  // <a href>) to include pathPrefix. Must be added AFTER the image plugin so
  // it sees the final image URLs.
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // Raw passthrough for assets that should keep their exact filenames
  // (favicons, OG images, downloads). Responsive content images should go
  // somewhere else (e.g. images/) and be referenced normally.
  eleventyConfig.addPassthroughCopy("static");

  return {
    pathPrefix: process.env.PATH_PREFIX || "/",
  };
}
