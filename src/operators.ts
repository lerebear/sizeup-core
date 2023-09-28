/** A mathematical operator that we can use in a formula. */
export interface Operator {
  /** The character(s) used to denote the operator in the formula. */
  symbol: string
  /** The number of arguments that the operator takes. */
  arity: number
  /**
   * Computes the result of applying this operator to the given operands.
   * The number of operands provided will match the declared `arity` of the
   * operator.
   */
  apply: (...operands: number[]) => number
}

export const SUPPORTED_OPERATORS: Operator[] = [
  {
    symbol: "+",
    arity: 2,
    apply: (...operands: number[]) => operands[0] + operands[1]
  },
  {
    symbol: "-",
    arity: 2,
    apply: (...operands: number[]) => operands[0] - operands[1]
  },
  {
    symbol: "*",
    arity: 2,
    apply: (...operands: number[]) => operands[0] * operands[1]
  },
  {
    symbol: "/",
    arity: 2,
    apply: (...operands: number[]) => operands[0] / operands[1]
  },
]
