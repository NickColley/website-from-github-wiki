const {
  EleventyHtmlBasePlugin,
  EleventyRenderPlugin,
} = require("@11ty/eleventy");

const {
  DefaultFrontmatterPlugin,
  RemarkPlugin,
} = require("./lib/plugins/index.cjs");

const {
  capitalise,
  deslug,
  filterBy,
  textLength,
  print,
} = require("./lib/filters.cjs");

const { renderFileIfExists } = require("./lib/shortcodes.cjs");

const constants = require("./lib/constants.cjs");
const { BASE_HREF, GITHUB_REPOSITORY_NAME } = constants;

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");

  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin, {
    baseHref: BASE_HREF,
  });
  eleventyConfig.addPlugin(RemarkPlugin, {
    plugins: ["./lib/markdown/relative-links.js"],
  });

  eleventyConfig.addPlugin(DefaultFrontmatterPlugin, {
    all: {
      constants,
      layout: "page.njk",
      siteTitle: GITHUB_REPOSITORY_NAME ? GITHUB_REPOSITORY_NAME : "website",
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

  // Shortcodes
  eleventyConfig.addAsyncShortcode(
    "renderFileIfExists",
    renderFileIfExists(eleventyConfig)
  );

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
