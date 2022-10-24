const { access } = require("node:fs/promises");

function renderFileIfExists(eleventyConfig) {
  return async (filePath) => {
    const renderFile = eleventyConfig?.javascriptFunctions?.renderFile;
    try {
      await access(filePath);
      return renderFile(filePath);
    } catch (error) {
      console.log(error);
      if (error.code === "ENOENT") {
        return "";
      }
      throw error;
    }
  };
}

module.exports = {
  renderFileIfExists,
};
