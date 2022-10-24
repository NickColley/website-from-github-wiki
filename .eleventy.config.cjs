const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

const { BASE_HREF } = require("./lib/constants.cjs");

const { access } = require("node:fs/promises");
const { parse } = require("node:path");
const execSync = require("node:child_process").execSync;
const exec = (command) => {
  return new Promise((resolve, reject) => {
    console.log(`[exec]: ${command}`);
    try {
      const stdout = execSync(command, { stdio: ["pipe"] });
      const trimmedOutput = stdout.toString().trim();
      resolve(trimmedOutput);
    } catch (stderr) {
      reject(stderr);
    }
  });
};

async function getGitHubWiki(cloneDirectory) {
  if (!cloneDirectory) {
    throw new Error("No input directory to output to supplied");
  }
  try {
    await access(cloneDirectory);
  } catch (error) {
    console.log("Getting source files...");
    const remoteName = await exec(
      'git branch --list "$(git branch --show-current)" "--format=%(upstream:remotename)"'
    );
    const remoteUrl = await exec(`git remote get-url ${remoteName}`);
    const { dir, ext, name } = parse(remoteUrl);
    const wikiRepositoryUrl = join(dir, `${name}.wiki${ext}`);
    await exec(`git clone ${wikiRepositoryUrl} ${cloneDirectory}`);
  }
}

const GitHubWikiPlugin = (eleventyConfig) => {
  eleventyConfig.on("eleventy.before", async ({ dir }) => {
    const { input } = dir;
    await getGitHubWiki(input);
  });
};

const {
  TemplatePath: { join, normalize, getExtension },
} = require("@11ty/eleventy-utils");
const DefaultFrontmatterPlugin = (eleventyConfig, pluginConfig = {}) => {
  const { all, ...files } = pluginConfig;
  const inputDirectory = eleventyConfig?.dir?.input || ".";
  let frontmatterStore = new Map();
  let extensionStore = new Map();

  if (all) {
    Object.keys(all).forEach((key) => {
      return eleventyConfig.addGlobalData(key, all[key]);
    });
  }
  if (files) {
    Object.keys(files).forEach((fileName) => {
      const frontmatter = files[fileName];
      const filePath = join(inputDirectory, fileName);
      if (!filePath) {
        return;
      }
      frontmatterStore.set(filePath, frontmatter);
      const fileExtension = getExtension(filePath);
      if (!fileExtension) {
        return;
      }
      extensionStore.set(fileExtension);
    });
  }

  const fileExtensions = Array.from(extensionStore.keys()).join(", ");
  if (!fileExtensions) {
    return;
  }
  eleventyConfig.addDataExtension(fileExtensions, {
    parser: (filePath) => {
      const normalisedPath = normalize(filePath);
      const frontmatter = frontmatterStore.get(normalisedPath);
      if (frontmatter) {
        return frontmatter;
      }
    },
    read: false, // return file name instead of content
  });
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin, {
    baseHref: BASE_HREF,
  });

  // Set default frontmatter
  eleventyConfig.addPlugin(DefaultFrontmatterPlugin, {
    "Home.md": {
      permalink: "/",
    },
  });

  eleventyConfig.addPlugin(GitHubWikiPlugin);

  // Use HTML comments to define frontmatter to keep wiki content cleaner.
  eleventyConfig.setFrontMatterParsingOptions({
    delims: ["<!---", "--->"],
  });

  // Ensure our untracked _wiki input can be used as an input.
  eleventyConfig.setUseGitIgnore(false);

  return {
    dir: {
      input: "_wiki",
    },
  };
};
