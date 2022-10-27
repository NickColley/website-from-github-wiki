const { dirname, basename } = require("node:path");
const { execFileSync, execFile } = require("node:child_process");
const { promisify } = require("node:util");
const execFileAsync = promisify(execFile);

function getRepoName() {
  const { CI, GITHUB_REPOSITORY } = process.env;
  if (CI) {
    return GITHUB_REPOSITORY;
  } else {
    const remoteUrl = execFileSync("./scripts/get-remote-url.sh").toString();
    return remoteUrl
      .replace("git@github.com:", "")
      .replace("https://github.com/", "")
      .replace(".git", "");
  }
}

async function getHistory(filePath) {
  const fileName = basename(filePath);
  const fileDirectory = dirname(filePath);
  const { stdout: json } = await execFileAsync("./scripts/get-history.sh", [
    fileDirectory,
    fileName,
  ]);
  if (!json) {
    console.log(`[git:log] no history for ${filePath}`);
    return {};
  }
  try {
    return JSON.parse(json);
  } catch (error) {
    console.log(`[git:log] failed to parse history for ${filePath}`);
    return {};
  }
}

module.exports = {
  getHistory,
  getRepoName,
};
