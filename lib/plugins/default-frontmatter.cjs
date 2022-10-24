const { TemplatePath } = require("@11ty/eleventy-utils");
const { join, normalize, getExtension } = TemplatePath;

module.exports = function DefaultFrontmatterPlugin(
  eleventyConfig,
  pluginConfig = {}
) {
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
