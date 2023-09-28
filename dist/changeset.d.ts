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
     * @param ignored a list of glob expressions describing files to ignore
     * @param tests a list of glob expressions describing files that should be considered as tests
     */
    constructor(diff: string, ignored?: string[], tests?: string[]);
    private matchesGlob;
}
