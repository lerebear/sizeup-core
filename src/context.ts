import Changeset from "./changeset"
import { CategoryConfiguration } from "./category-configuration"

/**
 * Defines the context in which a particular expression will be evaluated.
 */
export class Context {
  /**
   * The diff that will be evaluated.
   */
  changeset: Changeset | undefined

  /**
   * The aliases defined under the `scoring.aliases` key in the configuration file.
   */
  aliases: Map<string, string> | undefined

  /**
   * The score categories defined under the `categories` key in the configuration file.
   */
  categories: CategoryConfiguration | undefined

  /**
   * A cache of sub-expressions that have already been computed. This is used to speed up repeated
   * evaluation of common sub-expressions. It can also be used to debug or inspect the evaluation
   * process.
   */
  cache: Map<string, number> = new Map()

  /**
   * @param param0 Configuration for this evaluation context
   */
  constructor({ changeset, aliases, categories }: { changeset?: Changeset, aliases?: Map<string, string>, categories?: CategoryConfiguration}) {
    this.changeset = changeset
    this.categories = categories
    this.aliases = aliases
  }
}
