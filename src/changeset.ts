import {Octokit} from 'octokit'
import * as difflib from 'parse-diff'

/**
 * This class represents changes to code whose reviewability we will attempt to
 * estimate. A changest often comes from a pull request, but it might also come
 * from the files staged for commit in a local git repository.
 */
export default class Changeset {
  files: difflib.File[]

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

  constructor(diff: string) {
    this.files = difflib(diff)
  }
}
