const { TemplatePath } = require("@11ty/eleventy-utils");
const { join, normalize, getExtension } = TemplatePath;

const getUserConfig = require("./get-user-config.cjs");

module.exports = function DefaultFrontmatterPlugin(
  eleventyConfig,
  pluginConfig = {}
) {
  const { all, ...files } = pluginConfig;
  const inputDirectory = eleventyConfig?.dir?.input || ".";
  let frontmatterStore = new Map();
  let extensionStore = new Map();

  const computedConfig = getUserConfig(
    inputDirectory,
    eleventyConfig?.frontMatterParsingOptions
  );
  const mergedGlobalDefaults = {
    ...all,
    ...computedConfig,
  };

  if (mergedGlobalDefaults) {
    Object.keys(mergedGlobalDefaults).forEach((key) => {
      return eleventyConfig.addGlobalData(key, mergedGlobalDefaults[key]);
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
