function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function filterBy(items, propertyName, value) {
  return items.find((item) => item[propertyName] === value);
}

function slugToTitle(slug) {
  return capitalize(slug.replace(/-/g, " "));
}

function textLength(htmlContent) {
  const textContent = htmlContent.replace(/(<([^>]+)>)/gi, "");
  const trimmedContent = textContent.replace(/\s/g, "").trim();
  return trimmedContent.length;
}

function print(content) {
  const { dump, safe } = this.env.filters;
  return safe(`<pre><code>${dump(content, 2)}</code></pre>`);
}

module.exports = {
  capitalize,
  filterBy,
  slugToTitle,
  textLength,
  print,
};
