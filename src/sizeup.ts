import { Octokit } from "octokit";
import Changeset from "./changeset";
import { Formula, Score } from "./formula"
import * as YAML from "yaml"
import * as fs from "fs"
import { DefaultConfiguration } from "./config/default";

const GITHUB_PULL_REQUEST_URL_RE = /https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/

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
  static async evaluate(diff_or_url: string, client?: Octokit, configFile?: string): Promise<Score> {
    const wasGivenUrl = diff_or_url.match(GITHUB_PULL_REQUEST_URL_RE)

    if (!client && wasGivenUrl) {
      throw new Error("`client` parameter must be provided with a URL")
    }

    const config = configFile ? YAML.parse(fs.readFileSync(configFile, "utf8")) : {}
    const defaultConfig = DefaultConfiguration
    const ignored = config.ignored || defaultConfig.ignored
    const expression = config.scoring?.formula || defaultConfig.scoring!.formula
    const categories = config.categories || defaultConfig.categories

    let changeset: Changeset
    if (client && wasGivenUrl) {
      changeset = await Changeset.fetch(diff_or_url, ignored, client)
    } else {
      changeset = new Changeset(diff_or_url, ignored)
    }

    const formula = new Formula(expression)

    return formula.evaluate(changeset, categories)
  }
}
