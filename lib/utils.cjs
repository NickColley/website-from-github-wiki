const { execSync } = require("node:child_process");
const execFile = (path) => {
  try {
    const stdout = execSync(path);
    return stdout.toString();
  } catch (error) {
    if (error.stderr) {
      throw new Error(error.stderr.toString());
    }
    throw error;
  }
};

function getRepoName() {
  const { CI, GITHUB_REPOSITORY } = process.env;
  if (CI) {
    return GITHUB_REPOSITORY;
  } else {
    const remoteUrl = execFile("./bin/get-remote-url.sh");
    return remoteUrl
      .replace("git@github.com:", "")
      .replace("https://github.com/", "")
      .replace(".git", "");
  }
}

module.exports = {
  getRepoName,
};
