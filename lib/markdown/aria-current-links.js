import { join } from "node:path";
import { visit } from "unist-util-visit";

export default function ariaCurrentLinks() {
  const { page } = this.data();
  return (tree) => {
    visit(tree, ["link", "linkReference"], (node) => {
      if (typeof node.url !== "string") {
        return;
      }
      if (join(page.filePathStem) !== join(node.url)) {
        return;
      }
      node.data = node.data || {};
      node.data.hProperties = {
        ...node.data.hProperties,
        "aria-current": "true",
      };
    });
  };
}
