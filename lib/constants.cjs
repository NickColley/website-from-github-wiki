let { GITHUB_REPOSITORY, CI } = process.env;

const DEPLOYED = !!CI;

const [GITHUB_REPOSITORY_OWNER, GITHUB_REPOSITORY_NAME] = GITHUB_REPOSITORY
  ? GITHUB_REPOSITORY.split("/")
  : "";

const BASE_HREF = DEPLOYED ? `${GITHUB_REPOSITORY_NAME}/` : "/";

module.exports = {
  BASE_HREF,
  DEPLOYED,
  GITHUB_REPOSITORY,
  GITHUB_REPOSITORY_OWNER,
  GITHUB_REPOSITORY_NAME,
};
