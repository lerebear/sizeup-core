import File from './file'
import * as difflib from 'parse-diff'
import { Linguist } from './linguist'
import { minimatch } from 'minimatch'

/**
 * This class represents changes to code whose reviewability we will attempt to
 * estimate. A changest comes either from a pull request, or from the files
 * staged for commit in a local git repository.
 */
export default class Changeset {
  files: File[]

  /**
   * @param diff code changes in the .diff format
   * @param ignored a list of glob expressions describing files to ignore
   * @param tests a list of glob expressions describing files that should be considered as tests
   */
  constructor(diff: string, ignored?: string[], tests?: string[]) {
    this.files = []

    for (const file of difflib(diff)) {
      const filename = (file.to || file.from)!

      if (this.matchesGlob(filename, ignored)) {
        continue
      }

      this.files.push({
        ...file,
        filename,
        language: Linguist.detect(filename),
        isTestFile: this.matchesGlob(filename, tests),
      })
    }
  }

  private matchesGlob(filename: string, globs?: string[]): boolean {
    for (const glob of (globs || [])) {
      if (minimatch(filename, glob)) {
        return true
      }
    }
    return false
  }
}
