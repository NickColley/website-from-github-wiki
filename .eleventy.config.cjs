const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const {
  DefaultFrontmatterPlugin,
} = require("./lib/plugin/default-frontmatter.cjs");

const {
  filterBy,
  slugToTitle,
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
        ? slugToTitle(GITHUB_REPOSITORY_NAME)
        : "Website from GitHub Wiki",
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
  eleventyConfig.addFilter("capitalize", slugToTitle);
  eleventyConfig.addFilter("filterBy", filterBy);
  eleventyConfig.addFilter("slugToTitle", slugToTitle);
  eleventyConfig.addFilter("textLength", textLength);
  eleventyConfig.addFilter("print", print);

  // Ensure our untracked _wiki input can be used as an input.
  eleventyConfig.setUseGitIgnore(false);

  return {
    dir: {
      includes: "../_includes",
      input: "_wiki",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
