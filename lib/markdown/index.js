import { join } from "node:path";

import { unified } from "unified";
import parse from "remark-parse";
import rehype from "remark-rehype";
import stringify from "rehype-stringify";

export default async function (markdown, { plugins = [] }) {
  const importedPlugins = await Promise.all(
    plugins.map(async (plugin) => {
      if (typeof plugin === "function") {
        return plugin;
      }
      const importPath = join(process.cwd(), plugin);
      const { default: pluginFunction } = await import(importPath);
      return pluginFunction;
    })
  );
  const output = await unified()
    // Turn Markdown text into Markdown syntax tree
    .use(parse)
    // Apply Markdown transforms
    .use(importedPlugins)
    // Turn Markdown into HTML syntax tree
    .use(rehype, {
      fragment: true,
    })
    // Turn HTML syntax tree into HTML text
    .use(stringify)
    .process(markdown);

  return String(output);
}
