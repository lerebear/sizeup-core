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
   * @param ignoredFilePatterns a list of glob expressions matching files to ignore
   * @param testFilePatterns a list of glob expressions matching files that should be considered as
   *   tests
   */
  constructor(
    {
      diff,
      ignoredFilePatterns,
      testFilePatterns
    }: {
      diff: string,
      ignoredFilePatterns?: string[],
      testFilePatterns?: string[]
    }) {
    this.files = []

    for (const file of difflib(diff)) {
      const filename = (file.to || file.from)!

      if (this.matchesGlob(filename, ignoredFilePatterns)) {
        continue
      }

      this.files.push({
        ...file,
        filename,
        language: Linguist.detect(filename),
        isTestFile: this.matchesGlob(filename, testFilePatterns),
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
