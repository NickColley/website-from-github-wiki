const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

const { BASE_HREF } = require("./lib/constants.cjs");

const {
  TemplatePath: { join, normalize, getExtension },
} = require("@11ty/eleventy-utils");
const DefaultFrontmatterPlugin = (eleventyConfig, pluginConfig = {}) => {
  const { all, ...files } = pluginConfig;
  const inputDirectory = eleventyConfig?.dir?.input || ".";
  let frontmatterStore = new Map();
  let extensionStore = new Map();

  if (all) {
    Object.keys(all).forEach((key) => {
      return eleventyConfig.addGlobalData(key, all[key]);
    });
  }
  if (files) {
    Object.keys(files).forEach((fileName) => {
      const frontmatter = files[fileName];
      const filePath = join(inputDirectory, fileName);
      if (!filePath) {
        return;
      }
      frontmatterStore.set(filePath, frontmatter);
      const fileExtension = getExtension(filePath);
      if (!fileExtension) {
        return;
      }
      extensionStore.set(fileExtension);
    });
  }

  const fileExtensions = Array.from(extensionStore.keys()).join(", ");
  if (!fileExtensions) {
    return;
  }
  eleventyConfig.addDataExtension(fileExtensions, {
    parser: (filePath) => {
      const normalisedPath = normalize(filePath);
      const frontmatter = frontmatterStore.get(normalisedPath);
      if (frontmatter) {
        return frontmatter;
      }
    },
    read: false, // return file name instead of content
  });
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin, {
    baseHref: BASE_HREF,
  });

  // Set default frontmatter
  eleventyConfig.addPlugin(DefaultFrontmatterPlugin, {
    "Home.md": {
      permalink: "/",
    },
  });

  // Use HTML comments to define frontmatter to keep wiki content cleaner.
  eleventyConfig.setFrontMatterParsingOptions({
    delims: ["<!---", "--->"],
  });

  // Ensure our untracked _wiki input can be used as an input.
  eleventyConfig.setUseGitIgnore(false);

  return {
    dir: {
      input: "_wiki",
    },
  };
};
