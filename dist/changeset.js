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
     * @param diff code changes in the .diff format
     * @param ignoredFilePatterns a list of glob expressions matching files to ignore
     * @param testFilePatterns a list of glob expressions matching files that should be considered as
     *   tests
     */
    constructor({ diff, ignoredFilePatterns, testFilePatterns }) {
        this.files = [];
        for (const file of difflib(diff)) {
            const filename = (file.to || file.from);
            if (this.matchesGlob(filename, ignoredFilePatterns)) {
                continue;
            }
            this.files.push({
                ...file,
                filename,
                language: linguist_1.Linguist.detect(filename),
                isTestFile: this.matchesGlob(filename, testFilePatterns),
            });
        }
    }
    matchesGlob(filename, globs) {
        for (const glob of (globs || [])) {
            if ((0, minimatch_1.minimatch)(filename, glob)) {
                return true;
            }
        }
        return false;
    }
}
exports.default = Changeset;
