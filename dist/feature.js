"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents an attribute of a changeset to which we assign a numerical score
 * that can figure in the formula we use to evaluate how difficult a changeset
 * will beto review.
 */
class Feature {
    constructor(changeset) {
        this.changeset = changeset;
    }
    /**
     * @returns the name of this feature that can be used as a variable in scoring
     *   formulas
     */
    static variableName() {
        return this.name.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase();
    }
}
exports.default = Feature;
