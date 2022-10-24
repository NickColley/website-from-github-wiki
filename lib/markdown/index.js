import { unified } from "unified";
import parse from "remark-parse";
import rehype from "remark-rehype";
import stringify from "rehype-stringify";

import relativeLinks from "./relative-links.js";

export default async function (markdown) {
  const output = await unified()
    // Turn Markdown text into Markdown syntax tree
    .use(parse)
    // Apply Markdown transforms
    .use(relativeLinks)
    // Turn Markdown into HTML syntax tree
    .use(rehype, {
      fragment: true,
    })
    // Turn HTML syntax tree into HTML text
    .use(stringify)
    .process(markdown);

  return String(output);
}
