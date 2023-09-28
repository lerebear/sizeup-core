"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Score = void 0;
/** Reports the result of evaluating a Changeset for reviewability. */
class Score {
    constructor(formula) {
        this.formula = formula;
        this.variableSubstitutions = new Map();
    }
    /**
     * Records the error that we encountered when evaluating the formula.
     *
     * @param error
     */
    addError(error) {
        this.error = error;
        this.value = undefined;
        this.category = undefined;
    }
    /**
     * Records the result of evaluating the formula.
     *
     * @param value Score that we computed
     * @param categories The set of possible categories to assign.
     */
    addValue(value, categories) {
        this.error = undefined;
        this.value = value;
        this.category = categories === null || categories === void 0 ? void 0 : categories.categorize(value);
    }
    /**
     * Records that we used a particular value for a variable during evaluation.
     *
     * @param variableName The name of the variable we substituted
     * @param value The value we used for the variable
     */
    recordVariableSubstitution(variableName, value) {
        this.variableSubstitutions.set(variableName, value);
    }
    toString({ spacing }) {
        return JSON.stringify(this, (key, value) => {
            if (value instanceof Map) {
                return [...value];
            }
            else {
                return value;
            }
        }, spacing);
    }
}
exports.Score = Score;
