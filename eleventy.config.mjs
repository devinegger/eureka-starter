import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPassthroughCopy("static");

  return {
    pathPrefix: process.env.PATH_PREFIX || "/",
  };
}
