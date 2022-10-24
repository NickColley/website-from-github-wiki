module.exports = function MarkdownRemarkPlugin(eleventyConfig, { plugins }) {
  eleventyConfig.setLibrary("md", {
    disable: () => {}, // https://github.com/11ty/eleventy/issues/2613
    render: async (content) => {
      // Eleventy does not support async/await in the configuration file yet.
      // This allows us to bring a ESM module into CommonJS.
      const { default: render } = await import("../markdown/index.js");
      return render(content, { plugins });
    },
  });
};
