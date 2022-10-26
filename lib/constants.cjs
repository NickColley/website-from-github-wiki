const { getRepoName } = require("./utils.cjs");

const { CI } = process.env;

const GITHUB_REPOSITORY = getRepoName();

const DEPLOYED = !!CI;

const [GITHUB_REPOSITORY_OWNER, GITHUB_REPOSITORY_NAME] = GITHUB_REPOSITORY
  ? GITHUB_REPOSITORY.split("/")
  : "";

const BASE_HREF = DEPLOYED ? `/${GITHUB_REPOSITORY_NAME}/` : "/";
const INPUT = "_wiki";

module.exports = {
  INPUT,
  BASE_HREF,
  DEPLOYED,
  GITHUB_REPOSITORY,
  GITHUB_REPOSITORY_OWNER,
  GITHUB_REPOSITORY_NAME,
};
