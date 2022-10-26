const { access } = require("node:fs/promises");

function capitalise(word = "") {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function deslug(slug = "") {
  return slug.replace(/-/g, " ");
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

function filterBy(items = [], propertyName, value) {
  return items.find((item) => item[propertyName] === value);
}

function textLength(htmlContent = "") {
  const textContent = htmlContent.replace(/(<([^>]+)>)/gi, "");
  const trimmedContent = textContent.replace(/\s/g, "").trim();
  return trimmedContent.length;
}

function print(content = {}) {
  const { dump, safe } = this.env.filters;
  return safe(`<pre><code>${dump(content, 2)}</code></pre>`);
}

module.exports = {
  capitalise,
  deslug,
  fileExists,
  filterBy,
  textLength,
  print,
};
