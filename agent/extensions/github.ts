import githubExtension from "@github-tools/eve-extension";
import { GITHUB_CONNECTOR } from "#lib/constants.ts";

/**
 * Read the code and its history; the one write is a comment on the pull request that shipped a
 * bad release, carrying the evidence. Every write asks a person to approve it first.
 */
export default githubExtension({
  connector: GITHUB_CONNECTOR,
  exclude: ["getGist", "listGists", "listGistComments"],
  include: ["addPullRequestComment"],
  preset: "repo-explorer",
});
