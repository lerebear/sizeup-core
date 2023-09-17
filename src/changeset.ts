import {Octokit} from 'octokit'
import File from './file'
import * as difflib from 'parse-diff'
import { Linguist } from './language'

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
   * @param url a pull request URL on GitHub e.g. "https://github.com/lerebear/sizeup/pull/1"
   * @param client an authenticated Octokit client
   * @returns a changeset
   */
  static async fetch(url: string, client: Octokit): Promise<Changeset> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_scheme, _blank, _domain, repoOwner, repoName, _path, pullRequestNumber] = url.split('/')

    const {data} = await client.rest.pulls.get({
      owner: repoOwner,
      repo: repoName,
      // eslint-disable-next-line camelcase
      pull_number: Number.parseInt(pullRequestNumber, 10),
      mediaType: {format: 'diff'},
    })

    return new Changeset(data as unknown as string)
  }

  /**
   * @param diff code changes in the .diff format
   */
  constructor(diff: string) {
    this.files = difflib(diff).map((file) => {
      return {
        ...file,
        filename: (file.to || file.from)!,
        language: Linguist.detect(file)
      }
    })
  }
}
