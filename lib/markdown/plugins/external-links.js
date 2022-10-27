import { visit } from "unist-util-visit";
import merge from "deepmerge";

export default function externalLinks() {
  return (tree) => {
    visit(tree, ["link", "linkReference"], (node) => {
      const { url } = node;
      if (typeof url !== "string") {
        return;
      }
      const isExternal =
        url.startsWith("http://") || url.startsWith("https://");
      if (!isExternal) {
        return;
      }
      // Additional privacy for users leaving the site.
      const rel = "nofollow noopener";
      node.data = merge(node.data, {
        hProperties: { rel },
      });
    });
  };
}
