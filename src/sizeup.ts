import Changeset from "./changeset";
import { Formula, Score } from "./formula"
import * as YAML from "yaml"
import * as fs from "fs"
import { DefaultConfiguration } from "./config/default";

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
  static async evaluate(diff: string, configFile?: string): Promise<Score> {
    const config = configFile ? YAML.parse(fs.readFileSync(configFile, "utf8")) : {}
    const defaultConfig = DefaultConfiguration
    const ignored = config.ignored || defaultConfig.ignored
    const tests = config.tests || defaultConfig.tests
    const expression = config.scoring?.formula || defaultConfig.scoring!.formula
    const categories = config.categories || defaultConfig.categories

    const changeset = new Changeset(diff, ignored, tests)
    const formula = new Formula(expression)

    return formula.evaluate(changeset, categories)
  }
}
