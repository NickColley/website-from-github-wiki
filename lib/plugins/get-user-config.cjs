const { join } = require("node:path");
const { readFileSync } = require("node:fs");
const matter = require("gray-matter");

module.exports = function (inputDirectory, options) {
  const configFileName = "_config.md";
  try {
    const file = readFileSync(join(inputDirectory, configFileName));
    const { data } = matter(file.toString(), options);
    return data;
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw error;
  }
};
