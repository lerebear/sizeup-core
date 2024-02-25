import { Node } from "./node"
import { Context } from "./context"

/**
 * Represents an operator that can be used in an scoring expression
 */
export interface Operator {
  /**
   * The symbol that represent the operator
   */
  symbol: string

  /**
   * The number of operands that the operator accepts
   */
  arity: number

  /**
   * Computes the result of applying the operator to some operands
   *
   * @param context The current evaluation context
   * @param operands The operands to supply to the operator
   * @returns The result of the operation
   */
  apply: (context: Context, ...operands: Node[]) => number
}

const Plus = {
  symbol: "+",
  arity: 2,
  apply: (context: Context, a: Node, b: Node): number => {
    return a.evaluate(context) + b.evaluate(context)
  }
}

const Minus = {
  symbol: "-",
  arity: 2,
  apply: (context: Context, a: Node, b: Node): number => {
    return a.evaluate(context) - b.evaluate(context)
  }
}

const Times = {
  symbol: "*",
  arity: 2,
  apply: (context: Context, a: Node, b: Node): number => {
    return a.evaluate(context) * b.evaluate(context)
  }
}

const Division = {
  symbol: "/",
  arity: 2,
  apply: (context: Context, a: Node, b: Node): number => {
    const divisor = b.evaluate(context)
    if (divisor == 0) {
      throw new Error(`"${b.token}" evaluated to zero, so it cannot be used as a divisor`)
    }
    return a.evaluate(context) / b.evaluate(context)
  }
}

const Exponent = {
  symbol: "^",
  arity: 2,
  apply: (context: Context, a: Node, b: Node): number => {
    return a.evaluate(context) ** b.evaluate(context)
  }
}

const GreaterThan = {
  symbol: ">",
  arity: 2,
  apply: (context: Context, a: Node, b: Node): number => {
    return a.evaluate(context) > b.evaluate(context) ? 1 : 0
  }
}

const GreaterThanOrEqual = {
  symbol: ">=",
  arity: 2,
  apply: (context: Context, a: Node, b: Node): number => {
    return a.evaluate(context) >= b.evaluate(context) ? 1 : 0
  }
}

const LessThan = {
  symbol: "<",
  arity: 2,
  apply: (context: Context, a: Node, b: Node): number => {
    return a.evaluate(context) < b.evaluate(context) ? 1 : 0
  }
}

const LessThanOrEqual = {
  symbol: "<=",
  arity: 2,
  apply: (context: Context, a: Node, b: Node): number => {
    return a.evaluate(context) <= b.evaluate(context) ? 1 : 0
  }
}

const Equals = {
  symbol: "==",
  arity: 2,
  apply: (context: Context, a: Node, b: Node): number => {
    return a.evaluate(context) === b.evaluate(context) ? 1 : 0
  }
}

const NotEquals = {
  symbol: "!=",
  arity: 2,
  apply: (context: Context, a: Node, b: Node): number => {
    return a.evaluate(context) !== b.evaluate(context) ? 1 : 0
  }
}

const And = {
  symbol: "&",
  arity: 2,
  apply: (context: Context, a: Node, b: Node): number => {
    return a.evaluate(context) > 0 && b.evaluate(context) > 0 ? 1 : 0
  }
}

const Or = {
  symbol: "|",
  arity: 2,
  apply: (context: Context, a: Node, b: Node): number => {
    return a.evaluate(context) > 0 || b.evaluate(context) > 0 ? 1 : 0
  }
}

const Not = {
  symbol: "!",
  arity: 1,
  apply: (context: Context, a: Node): number => {
    return a.evaluate(context) > 0 ? 0 : 1
  }
}

const IfElse = {
  symbol: "?",
  arity: 3,
  apply: (context: Context, condition: Node, trueBranch: Node, falseBranch: Node): number => {
    if (condition.evaluate(context) > 0) {
      return trueBranch.evaluate(context)
    } else {
      return falseBranch.evaluate(context)
    }
  }
}

/** The collection of features that are available for use in an evaluation formula. */
export const OperatorRegistry: Map<string, Operator> = new Map(
  [
    [Plus.symbol, Plus],
    [Minus.symbol, Minus],
    [Times.symbol, Times],
    [Division.symbol, Division],
    [Exponent.symbol, Exponent],
    [GreaterThan.symbol, GreaterThan],
    [GreaterThanOrEqual.symbol, GreaterThanOrEqual],
    [LessThan.symbol, LessThan],
    [LessThanOrEqual.symbol, LessThanOrEqual],
    [Equals.symbol, Equals],
    [NotEquals.symbol, NotEquals],
    [And.symbol, And],
    [Or.symbol, Or],
    [Not.symbol, Not],
    [IfElse.symbol, IfElse],
  ]
)
