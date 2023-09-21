import Changeset from './changeset';
/**
 * Represents an attribute of a changeset to which we assign a numerical score
 * that can figure in the formula we use to evaluate how difficult a changeset
 * will beto review.
 */
export default abstract class Feature {
    protected changeset: Changeset;
    /**
     * Computes a charateristic of the changeset and returns a numerical score to
     * represent it.
     */
    abstract evaluate(): number;
    constructor(changeset: Changeset);
    /**
     * @returns the name of this feature that can be used as a variable in scoring
     *   formulas
     */
    static variableName(): string;
}
