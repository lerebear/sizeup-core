"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const difflib = require("parse-diff");
const linguist_1 = require("./linguist");
const minimatch_1 = require("minimatch");
/**
 * This class represents changes to code whose reviewability we will attempt to
 * estimate. A changest comes either from a pull request, or from the files
 * staged for commit in a local git repository.
 */
class Changeset {
    /**
     * Fetches a set of changes from a GitHub pull request URL.
     *
     * @param url a GitHub pull request URL e.g. "https://github.com/lerebear/sizeup/pull/1"
     * @param ignored a list of glob expressions for files to ignore in the pull request
     * @param client an authenticated Octokit client
     * @returns a changeset
     */
    static async fetch(url, ignored = [], client) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_scheme, _blank, _domain, repoOwner, repoName, _path, pullRequestNumber] = url.split('/');
        const { data } = await client.rest.pulls.get({
            owner: repoOwner,
            repo: repoName,
            // eslint-disable-next-line camelcase
            pull_number: Number.parseInt(pullRequestNumber, 10),
            mediaType: { format: 'diff' },
        });
        return new Changeset(data, ignored);
    }
    /**
     * @param diff code changes in the .diff format
     * @param ignored a list of glob expressions describing files to ignore
     */
    constructor(diff, ignored = []) {
        this.files = [];
        for (const file of difflib(diff)) {
            const filename = (file.to || file.from);
            for (const glob of ignored) {
                if ((0, minimatch_1.minimatch)(filename, glob)) {
                    continue;
                }
            }
            this.files.push({
                ...file,
                filename,
                language: linguist_1.Linguist.detect(filename)
            });
        }
    }
}
exports.default = Changeset;
