import {simpleGit, SimpleGit} from 'simple-git'

export class Git {
  private client: SimpleGit
  private baseDirectory: string

  constructor(token: string, baseDirectory: string = '.') {
    const basicCredential = Buffer.from(
      `x-access-token:${token}`,
      'utf8'
    ).toString('base64')
    const authorizationHeader = `AUTHORIZATION: basic ${basicCredential}`

    this.baseDirectory = baseDirectory
    this.client = simpleGit(baseDirectory, {
      trimmed: true,
      config: [`http.extraheader=${authorizationHeader}`]
    })
  }

  /**
   * Clones the repository from which this workflow was triggered.
   *
   * @param repo The repository to clone in the format "<owner>/<name>"
   * @param headRef The single branch to clone, which should correspond to the
   *   head ref of the pull request that triggered this workflow. This is
   *   required for efficiency.
   * @param targetDirectory The directory in which to clone the repository.
   */
  async clone(
    repo: string,
    headRef: string,
  ): Promise<void> {
    await this.client.clone(`https://github.com/${repo}`, this.baseDirectory, [
      `--branch=${headRef}`,
      '--filter=tree:0',
      '--no-tags',
      '--single-branch'
    ])
  }

  /**
   * Retrieves the diff of the pull request that triggered this workflow which we
   * will use for evaluation.
   *
   * @param baseRef The base branch relative to which we should produce a diff. This method assumes
   *   that the head ref containing changes relative to this base ref has already been fetched using
   *   the `headRef` argument to the `clone` method.
   * @returns The diff of the given pull request or `undefined` if we failed to retrieve it.
   */
  async diff(baseRef: string, gitDiffOptions: string[]): Promise<string> {
    await this.client.fetch([
      'origin',
      `+${baseRef}:${baseRef}`,
      `--filter=tree:0`,
      '--no-tags',
      '--prune',
      '--no-recurse-submodules'
    ])

    return this.client.diff(['--merge-base', baseRef].concat(gitDiffOptions))
  }
}
