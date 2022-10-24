function capitalise(word = "") {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function deslug(slug = "") {
  return slug.replace(/-/g, " ");
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
  filterBy,
  textLength,
  print,
};
