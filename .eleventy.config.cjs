const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const {
  DefaultFrontmatterPlugin,
} = require("./lib/plugin/default-frontmatter.cjs");

const {
  capitalise,
  deslug,
  filterBy,
  textLength,
  print,
} = require("./lib/filters.cjs");
const constants = require("./lib/constants.cjs");
const { BASE_HREF, GITHUB_REPOSITORY_NAME } = constants;

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");

  eleventyConfig.addPlugin(EleventyHtmlBasePlugin, {
    baseHref: BASE_HREF,
  });

  // Set default frontmatter
  eleventyConfig.addPlugin(DefaultFrontmatterPlugin, {
    all: {
      constants,
      layout: "page.njk",
      siteTitle: GITHUB_REPOSITORY_NAME
        ? GITHUB_REPOSITORY_NAME
        : "website-from-github-wiki",
    },
    "Home.md": {
      permalink: "/",
    },
  });

  // Use HTML comments to define frontmatter to keep wiki content cleaner.
  eleventyConfig.setFrontMatterParsingOptions({
    delims: ["<!---", "--->"],
  });

  // Filters
  eleventyConfig.addFilter("capitalise", capitalise);
  eleventyConfig.addFilter("deslug", deslug);
  eleventyConfig.addFilter("filterBy", filterBy);
  eleventyConfig.addFilter("textLength", textLength);
  eleventyConfig.addFilter("print", print);

  // Ensure our untracked _wiki input can be used as an input.
  eleventyConfig.setUseGitIgnore(false);

  // Resolve relative links
  eleventyConfig.addTransform("relative-links", function (content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      const transformedContent = content.replace(/href=['|"]\.\//g, `href="/`);
      return transformedContent;
    }
    return content;
  });

  return {
    dir: {
      includes: "../_includes",
      input: "_wiki",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
