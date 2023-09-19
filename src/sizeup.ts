import { Octokit } from "octokit";
import Changeset from "./changeset";
import { Configuration } from "./configuration"
import { Formula, Score } from "./formula"
import * as YAML from "yaml"
import * as fs from "fs"

export default class SizeUp {
  /**
   * Evaluates a pull request for reviewability.
   *
   * @param url GitHub pull request URL denoting the pull request to evaluate
   * @param config configuration options for how to evaluate the pull request
   * @param token GitHub API token that can read the given URL
   */
  static async evaluate(url: string, config: Configuration, token: string): Promise<Score> {
      const client = new Octokit({auth: token})
    const defaultConfig = YAML.parse(fs.readFileSync("./config/default.yml", "utf8"))

    const changeset = await Changeset.fetch(url, client, config.ignored || defaultConfig.ignored)
    const formula = new Formula(config.scoring?.formula || defaultConfig.scoring!.formula)

    return formula.evaluate(changeset, config.categories || defaultConfig.categories)
  }
}
