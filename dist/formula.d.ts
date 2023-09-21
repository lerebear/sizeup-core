import Changeset from "./changeset";
/** Returned when we encounter an invalid formula. */
export interface ParsingError {
    /** An error message. */
    message: string;
    /** The 0-based index of the whitespace-separated token where we encountered the error. */
    tokenIndex: number;
}
/** A category assigned to a changeset based on its computed score. */
interface Category {
    /** Friendly name of the category. */
    name: string;
    /**
     * Upper bound on the score that a changeset can receive in order for this category to apply.
     * If this value is omitted, then this is assumed to represent the largest category (a catchall
     * for every changeset to which another category does not apply).
     */
    lt?: number;
}
/** Reports the result of evaluating a Changeset for reviewability. */
export declare class Score {
    /**
     * The expression used to compute this score.
     * This comes from the `scoring.formula` configuration entry.
     */
    formula: string;
    /**
     * The numeric result of formula.
     * If this value is undefined, then we encountered an error when evaluating the formula.
     */
    value?: number;
    /**
     * The category that the changeset falls into based on its score.
     * If this value is undefined, then either we encountered an error when evaluating the formula
     * or no applicable category was provided when the `addValue` method was called.
     */
    category?: string;
    /**
     * An error that we encountered when evaluating the formula on the changeset.
     * If this value is undefined, then no error was encountered during evaluation.
     */
    error?: ParsingError;
    /**
     * Maps variable names from the formula to the value substituted in for that variable during
     * formula evaluation. This can be used to understand why the changeset received the score that
     * it did.
     */
    variableSubstitutions: Map<string, number>;
    constructor(formula: string);
    /**
     * Records the error that we encountered when evaluating the formula.
     *
     * @param error
     */
    addError(error: ParsingError): void;
    /**
     * Records the result of evaluating the formula.
     *
     * @param value Score that we computed
     * @param categories The full set of possible categories to assign. This should have at least one
     *   entry, and should also have at least one catchall entry (an entry without an `lt` value).
     */
    addValue(value: number, categories?: Category[]): void;
    /**
     * Records that we used a particular value for a variable during evaluation.
     *
     * @param variableName The name of the variable we substituted
     * @param value The value we used for the variable
     */
    recordVariableSubstitution(variableName: string, value: number): void;
    /**
     *
     * @param score The numeric value that we should categorize
     * @param categories The set of all categories to choose from
     * @returns The name of the chosen category, or undefined if we couldn't find an appropriate one
     */
    static categorize(score: number, categories?: Category[]): string | undefined;
}
/** Represents a mathematical expression that we use to evaluate a Changeset. */
export declare class Formula {
    expression: string;
    constructor(expression: string);
    /**
     *
     * @param changeset The code to evaluate
     * @param categories The set of all available score categories to choose from
     * @returns The compute score of the Changeset according to this formula
     */
    evaluate(changeset: Changeset, categories?: Category[]): Score;
    private isSupportedToken;
    private isOperator;
    private toOperator;
    private isOperand;
    private isFeature;
    private isNumericConstant;
    private applyOperator;
}
export {};
