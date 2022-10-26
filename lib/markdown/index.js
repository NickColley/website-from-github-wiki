import { unified } from "unified";
import parse from "remark-parse";
import rehype from "remark-rehype";
import format from "rehype-format";
import stringify from "rehype-stringify";

import importPlugins from "./import-plugins.js";

export default async function (markdown, { plugins = [] }, page) {
  const output = await unified()
    // Turn Markdown text into Markdown syntax tree
    .use(parse)
    // Apply Markdown transforms
    .use(await importPlugins(plugins))
    // Turn Markdown into HTML syntax tree
    .use(rehype, {
      fragment: true,
    })
    // Apply HTML specific transforms
    .use(format, { indent: "\t" })
    // Turn HTML syntax tree into HTML text
    .use(stringify)
    .data({
      page,
    })
    .process(markdown);

  return String(output);
}
