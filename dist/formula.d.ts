import { CategoryConfiguration } from "./category-configuration";
import Changeset from "./changeset";
import { Score } from "./score";
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
    evaluate(changeset: Changeset, categories?: CategoryConfiguration): Score;
    private isSupportedToken;
    private isOperator;
    private toOperator;
    private isOperand;
    private isFeature;
    private isNumericConstant;
    private applyOperator;
}
