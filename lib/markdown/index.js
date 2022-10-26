import { join, parse } from "node:path";

import { unified } from "unified";
import parseMarkdown from "remark-parse";
import rehype from "remark-rehype";
import format from "rehype-format";
import stringify from "rehype-stringify";

export default async function (markdown, { plugins = [] }, page) {
  const importedPlugins = await Promise.all(
    plugins.map(async (plugin) => {
      let options = {};
      let name = plugin;
      // ["plugin-name", { options }]
      if (typeof plugin === "object") {
        [name, options] = plugin;
      }
      const { dir } = parse(name);
      const importPath = dir ? join(process.cwd(), name) : name;
      const { default: pluginFunction } = await import(importPath);
      return [pluginFunction, options];
    })
  );
  const output = await unified()
    // Turn Markdown text into Markdown syntax tree
    .use(parseMarkdown)
    // Apply Markdown transforms
    .use(importedPlugins)
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
