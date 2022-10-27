module.exports = function MarkdownRemarkPlugin(
  eleventyConfig,
  pluginData = {}
) {
  eleventyConfig.setLibrary("md", {
    disable: () => {}, // https://github.com/11ty/eleventy/issues/2613
    render: async (content, context) => {
      // Eleventy does not support async/await in the configuration file yet.
      // This allows us to bring a ESM module into CommonJS.
      const { default: render } = await import("../markdown/index.js");
      return render(content, pluginData, context, eleventyConfig);
    },
  });
};
