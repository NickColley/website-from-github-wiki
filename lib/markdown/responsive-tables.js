import { visit } from "unist-util-visit";

// <table> => <responsive-wrapper><table></responsive-wrapper>
export default function responsiveTables() {
  return (tree) => {
    visit(tree, ["table"], (node, index, parent) => {
      if (parent.data && parent.data.isResponsive) {
        return;
      }
      // Clone the original node so we dont manipulate it when creating the new wrapper.
      const originalNode = Object.assign({}, node);
      node.type = "parent";
      node.children = [originalNode];

      node.data = node.data || {};
      node.data.isResponsive = true;
      node.data.hName = "div";
      node.data.hProperties = {
        ...node.data.hProperties,
        className: "table-responsive",
      };
    });
  };
}
