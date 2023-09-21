import { Score } from "./formula";
export default class SizeUp {
    /**
     * Evaluates a diff for reviewability.
     *
     * @param diff A .diff formatted string containing the code to evaluate
     * @param client Authenticated Octokit client that we should use to communicate with the GitHub
     *   API. This must be provided if a URL is passed via the `diff_or_url` parameter.
     * @param configFile Path to a configuration file containing options for how to evaluate the pull
     *   request.
     */
    static evaluate(diff: string, configFile?: string): Promise<Score>;
}
