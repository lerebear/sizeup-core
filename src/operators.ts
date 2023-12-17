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
    apply: (a: number, b: number) => a + b
  },
  {
    symbol: "-",
    arity: 2,
    apply: (a: number, b: number) => a - b
  },
  {
    symbol: "*",
    arity: 2,
    apply: (a: number, b: number) => a * b
  },
  {
    symbol: "/",
    arity: 2,
    apply: (a: number, b: number): number => {
      if (b == 0) {
        throw new Error("Cannot divide by zero")
      }

      return a / b
    }
  },
  {
    symbol: "^",
    arity: 2,
    apply: (a: number, b: number) => a ** b
  },
  {
    symbol: "?",
    arity: 3,
    apply: (expression: number, trueBranch: number, falseBranch: number) => {
      return expression > 0 ? trueBranch : falseBranch
    }
  },
  {
    symbol: ">",
    arity: 2,
    apply: (a: number, b: number) => a > b ? 1 : 0
  },
  {
    symbol: "<",
    arity: 2,
    apply: (a: number, b: number) => a < b ? 1 : 0
  },
  {
    symbol: "==",
    arity: 2,
    apply: (a: number, b: number) => a == b ? 1 : 0
  },
  {
    symbol: "!=",
    arity: 2,
    apply: (a: number, b: number) => a !== b ? 1 : 0
  },
  {
    symbol: ">=",
    arity: 2,
    apply: (a: number, b: number) => a >= b ? 1 : 0
  },
  {
    symbol: "<=",
    arity: 2,
    apply: (a: number, b: number) => a <= b ? 1 : 0
  },
  {
    symbol: "&",
    arity: 2,
    apply: (a: number, b: number) => a > 0 && b > 0 ? 1 : 0
  },
  {
    symbol: "|",
    arity: 2,
    apply: (a: number, b: number) => a > 0 || b > 0 ? 1 : 0
  },
  {
    symbol: "!",
    arity: 1,
    apply: (a: number) => a > 0 ? 0 : 1
  },
]
