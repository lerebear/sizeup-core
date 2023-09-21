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
