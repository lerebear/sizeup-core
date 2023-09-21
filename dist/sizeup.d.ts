import { Octokit } from "octokit";
import { Score } from "./formula";
export default class SizeUp {
    /**
     * Evaluates some code (identified either by diff or a pull request URL) for reviewability.
     *
     * @param diff_or_url Either a diff or a GitHub pull request URL denoting the code to evaluate.
     * @param client Authenticated Octokit client that we should use to communicate with the GitHub
     *   API. This must be provided if a URL is passed via the `diff_or_url` parameter.
     * @param configFile Path to a configuration file containing options for how to evaluate the pull
     *   request.
     */
    static evaluate(diff_or_url: string, client?: Octokit, configFile?: string): Promise<Score>;
}
