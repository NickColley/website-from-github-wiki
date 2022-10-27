import { visit, SKIP } from "unist-util-visit";
import merge from "deepmerge";

// <table> => <responsive-wrapper><table></responsive-wrapper>
export default function responsiveTables() {
  return (tree) => {
    visit(tree, ["table"], (node, index) => {
      node.children = [{ ...node }];
      node.type = "parent";
      node.data = merge(node.data, {
        hProperties: {
          className: "table-responsive",
        },
      });
      return [SKIP, index + 1];
    });
  };
}
