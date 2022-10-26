const { basename } = require("node:path");
const { access } = require("node:fs/promises");
const simpleGit = require("simple-git");
const { format } = require("date-fns");
const { INPUT } = require("./constants.cjs");

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

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return `${format(date, "do MMMM yyyy")} at ${format(date, "h:mmaaa")}`;
}

let cachedGitInstance;
async function gitHistory(filePath) {
  cachedGitInstance = cachedGitInstance || simpleGit({ baseDir: INPUT });
  const file = basename(filePath);
  const log = await cachedGitInstance.log({ file });
  const oldest = log.all[log.total - 1];
  const latest = log.latest;
  return { latest, oldest };
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
  formatDate,
  gitHistory,
  textLength,
  print,
};
