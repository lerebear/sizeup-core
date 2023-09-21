import { Octokit } from 'octokit';
import File from './file';
/**
 * This class represents changes to code whose reviewability we will attempt to
 * estimate. A changest comes either from a pull request, or from the files
 * staged for commit in a local git repository.
 */
export default class Changeset {
    files: File[];
    /**
     * Fetches a set of changes from a GitHub pull request URL.
     *
     * @param url a GitHub pull request URL e.g. "https://github.com/lerebear/sizeup/pull/1"
     * @param ignored a list of glob expressions for files to ignore in the pull request
     * @param client an authenticated Octokit client
     * @returns a changeset
     */
    static fetch(url: string, ignored: string[] | undefined, client: Octokit): Promise<Changeset>;
    /**
     * @param diff code changes in the .diff format
     * @param ignored a list of glob expressions describing files to ignore
     */
    constructor(diff: string, ignored?: string[]);
}
