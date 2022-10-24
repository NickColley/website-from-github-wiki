// [href="./path"] => [href="/path"]
function relativeLinks() {
  function plugin(tree) {
    tree.match({ tag: "a" }, (node) => {
      const href = node?.attrs?.href;
      if (href && href.startsWith("./")) {
        node.attrs.href = href.substring(1);
      }
      return node;
    });
  }

  return plugin;
}

module.exports = { relativeLinks };
