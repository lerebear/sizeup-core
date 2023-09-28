import Changeset from "./changeset";
import { Formula } from "./formula"
import * as YAML from "yaml"
import * as fs from "fs"
import { DefaultConfiguration } from "./config/default";
import { CategoryConfiguration } from "./category-configuration";
import { Score } from "./score";

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

    const ignoredFilePatterns = config.ignored || DefaultConfiguration.ignored
    const testFilePatterns = config.tests || DefaultConfiguration.tests
    const changeset = new Changeset({ diff, ignoredFilePatterns, testFilePatterns })

    const categories = new CategoryConfiguration(config.categories || DefaultConfiguration.categories)
    const formula = new Formula(config.scoring?.formula || DefaultConfiguration.scoring!.formula)

    return formula.evaluate(changeset, categories)
  }
}
