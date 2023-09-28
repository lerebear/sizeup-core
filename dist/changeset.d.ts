import File from './file';
/**
 * This class represents changes to code whose reviewability we will attempt to
 * estimate. A changest comes either from a pull request, or from the files
 * staged for commit in a local git repository.
 */
export default class Changeset {
    files: File[];
    /**
     * @param diff code changes in the .diff format
     * @param ignoredFilePatterns a list of glob expressions matching files to ignore
     * @param testFilePatterns a list of glob expressions matching files that should be considered as
     *   tests
     */
    constructor({ diff, ignoredFilePatterns, testFilePatterns }: {
        diff: string;
        ignoredFilePatterns?: string[];
        testFilePatterns?: string[];
    });
    private matchesGlob;
}
