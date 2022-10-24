const posthtml = require("posthtml");

module.exports = function HtmlTransformsPlugin(
  eleventyConfig,
  pluginConfig = {}
) {
  const transforms = pluginConfig.transforms || [];
  eleventyConfig.addTransform(
    "HtmlTransformsPlugin",
    async function (content, outputPath) {
      if (outputPath && outputPath.endsWith(".html")) {
        const pipeline = posthtml();
        transforms.forEach((transform) => pipeline.use(transform()));
        const { html: transformedContent } = await pipeline.process(content);
        return transformedContent;
      }
      return content;
    }
  );
};
