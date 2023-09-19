import {Octokit} from 'octokit'
import File from './file'
import * as difflib from 'parse-diff'
import { Linguist } from './linguist'
import { minimatch } from 'minimatch'

/**
 * This class represents changes to code whose reviewability we will attempt to
 * estimate. A changest often comes from a pull request, but it might also come
 * from the files staged for commit in a local git repository.
 */
export default class Changeset {
  files: File[]

  /**
   * Fetches a set of changes from a GitHub pull request URL.
   *
   * @param url a GitHub pull request URL e.g. "https://github.com/lerebear/sizeup/pull/1"
   * @param ignored a list of glob expressions for files to ignore in the pull request
   * @param client an authenticated Octokit client
   * @returns a changeset
   */
  static async fetch(url: string, ignored: string[] = [], client: Octokit): Promise<Changeset> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_scheme, _blank, _domain, repoOwner, repoName, _path, pullRequestNumber] = url.split('/')

    const {data} = await client.rest.pulls.get({
      owner: repoOwner,
      repo: repoName,
      // eslint-disable-next-line camelcase
      pull_number: Number.parseInt(pullRequestNumber, 10),
      mediaType: {format: 'diff'},
    })

    return new Changeset(data as unknown as string, ignored)
  }

  /**
   * @param diff code changes in the .diff format
   * @param ignored a list of glob expressions describing files to ignore
   */
  constructor(diff: string, ignored: string[] = []) {
    this.files = []

    for (const file of difflib(diff)) {
      const filename = (file.to || file.from)!

      for (const glob of ignored) {
        if (minimatch(filename, glob)) {
          continue
        }
      }

      this.files.push({
        ...file,
        filename,
        language: Linguist.detect(filename)
      })
    }
  }
}
