import { Octokit } from "octokit";
import Changeset from "./changeset";
import { Formula, Score } from "./formula"
import * as YAML from "yaml"
import * as fs from "fs"
import { DefaultConfiguration } from "./config/default";

export default class SizeUp {
  /**
   * Evaluates a diff for reviewability.
   *
   * @param diff a diff to evaluate
   * @param configFile path to a configuration file containing options for how to evaluate the pull request
   * @param client authenticated Octokit client that we should use to communicate with the GitHub API
   */
  static async evaluate(diff: string, configFile: string): Promise<Score>;

  /**
   * Evaluates a pull request for reviewability.
   *
   * @param url GitHub pull request URL denoting the pull request to evaluate
   * @param configFile path to a configuration file containing options for how to evaluate the pull request
   * @param client authenticated Octokit client that we should use to communicate with the GitHub API
   */
  static async evaluate(url: string, configFile: string, client: Octokit): Promise<Score>;

  /**
   * Evaluates some code (identified either by diff or a pull request URL) for reviewability.
   *
   * @param diff_or_url Either a diff or a GitHub pull request URL denoting the code to evaluate
   * @param configFile path to a configuration file containing options for how to evaluate the pull request
   * @param client authenticated Octokit client that we should use to communicate with the GitHub API
   */
  static async evaluate(diff_or_url: string, configFile: string, client?: Octokit): Promise<Score> {
    const config = configFile ? YAML.parse(fs.readFileSync(configFile, "utf8")) : {}
    const defaultConfig = DefaultConfiguration
    const ignored = config.ignored || defaultConfig.ignored
    const expression = config.scoring?.formula || defaultConfig.scoring!.formula
    const categories = config.categories || defaultConfig.categories

    let changeset: Changeset
    if (client) {
      changeset = await Changeset.fetch(diff_or_url, ignored, client)
    } else {
      changeset = new Changeset(diff_or_url, ignored)
    }

    const formula = new Formula(expression)

    return formula.evaluate(changeset, categories)
  }
}
