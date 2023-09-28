/** A mathematical operator that we can use in a formula. */
export interface Operator {
    /** The character(s) used to denote the operator in the formula. */
    symbol: string;
    /** The number of arguments that the operator takes. */
    arity: number;
    /**
     * Computes the result of applying this operator to the given operands.
     * The number of operands provided will match the declared `arity` of the
     * operator.
     */
    apply: (...operands: number[]) => number;
}
export declare const SUPPORTED_OPERATORS: Operator[];
