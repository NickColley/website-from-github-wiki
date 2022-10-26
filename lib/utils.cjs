const { execSync } = require("node:child_process");
const execFile = (path) => {
  try {
    const stdout = execSync(path);
    return stdout.toString().trim();
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
    return execFile("./bin/get-remote-github-name.sh");
  }
}

module.exports = {
  getRepoName,
};
