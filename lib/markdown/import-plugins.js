import { join, parse } from "node:path";

export default async function importPlugins(plugins) {
  return await Promise.all(
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
}
