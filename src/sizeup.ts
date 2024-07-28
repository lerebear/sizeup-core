import Changeset from "./changeset";
import { Formula } from "./formula"
import * as YAML from "yaml"
import * as fs from "fs"
import * as path from "path"
import { CategoryConfiguration } from "./category-configuration";
import { Score } from "./score";
import { Configuration } from "./configuration";
import { Context } from "./context";
import { Git } from "./git";

export class SizeUp {
  /**
   * Evaluates a diff that is generated with `git diff` locally after cloning the given remote.
   *
   * @param remote Object describing the Git repository and branches to diff
   * @param configPath Path to a YAML configuration file containing options for how to evaluate the
   *   diff. The YAML file should conform to the JSON schema in src/config/schema.json.
   * @returns
   */
  static async evaluate(remote: Remote, configPath?: string): Promise<Score>;

  /**
   * Evaluates a diff for reviewability.
   *
   * @param diff A .diff formatted string containing the code to evaluate
   * @param configPath Path to a YAML configuration file containing options for how to evaluate the
   *   diff. The YAML file should conform to the JSON schema in src/config/schema.json.
   */
  static async evaluate(diff: string, configPath?: string): Promise<Score>;

  static async evaluate(diffOrRemote: string | Remote, configPath?: string): Promise<Score> {
    const userSuppliedConfig = this.config(configPath)
    const defaultConfig: Configuration = YAML.parse(
      fs.readFileSync(path.resolve(__dirname, "./config/default.yaml"), "utf8")
    )

    const formula = new Formula(userSuppliedConfig.scoring?.formula || defaultConfig.scoring!.formula)
    const context = await this.context(diffOrRemote, userSuppliedConfig, defaultConfig)

    return formula.evaluate(context)
  }

  private static config(configPath?: string): Configuration {
    if (!configPath) return {}
    const parsed = YAML.parse(fs.readFileSync(configPath, "utf8"))
    return ('sizeup' in parsed) ? parsed.sizeup : parsed
  }

  private static async context(diffOrRemote: string | Remote, userSuppliedConfig: Configuration, defaultConfig: Configuration): Promise<Context> {
    const ignoredFilePatterns = userSuppliedConfig.ignoredFilePatterns || defaultConfig.ignoredFilePatterns
    const testFilePatterns = userSuppliedConfig.testFilePatterns || defaultConfig.testFilePatterns

    let diff: string
    if (typeof diffOrRemote === "string") {
      diff = diffOrRemote
    } else {
      const git = new Git(diffOrRemote.token)
      await git.clone(diffOrRemote.repo, diffOrRemote.headRef, diffOrRemote.cloneDirectory)
      diff = await git.diff(diffOrRemote.baseRef, diffOrRemote.diffOptions || [], diffOrRemote.cloneDirectory)
    }

    return new Context(
      {
        changeset: new Changeset({ diff, ignoredFilePatterns, testFilePatterns }),
        aliases: new Map(Object.entries(userSuppliedConfig.scoring?.aliases || defaultConfig.scoring!.aliases || {})),
        categories: new CategoryConfiguration(userSuppliedConfig.categories || defaultConfig.categories!)
      }
    )
  }
}

/** Describes the head and base branches on GitHub to use to generate a diff. */
export interface Remote {
  /** The full name of the repository containing the branches to evaluate e.g. lerebear/sizeup-core */
  repo: string,
  /** The branch name that forms the base of the comparison e.g. main */
  baseRef: string,
  /** The branch name that contains changes relative to the base e.g my-topic-branch */
  headRef: string,
  /** Options to forward to `git diff` e.g. ['--ignore-space-change'] */
  diffOptions?: string[],
  /** A GitHub token with permissions to clone the given repository */
  token: string,
  /** The target directory on the local filesystem into which to clone the repository. */
  cloneDirectory?: string,
}

export { Score } from "./score";
export { Context } from "./context";
export { CategoryConfiguration } from "./category-configuration"
