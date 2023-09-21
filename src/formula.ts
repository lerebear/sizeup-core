import Changeset from "./changeset"
import Feature from "./feature"
import { FeatureRegistry } from "./registry"

/** A mathematical operator that we can use in a formula. */
interface Operator {
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

/** Returned when we encounter an invalid formula. */
export interface ParsingError {
  /** An error message. */
  message: string
  /** The 0-based index of the whitespace-separated token where we encountered the error. */
  tokenIndex: number
}

const NUMERIC_CONSTANT_RE = /-?\d+(\.\d+)?/
const SUPPORTED_OPERATORS: Operator[] = [
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

/** A category assigned to a changeset based on its computed score. */
interface Category {
  /** Friendly name of the category. */
  name: string
  /**
   * Upper bound on the score that a changeset can receive in order for this category to apply.
   * If this value is omitted, then this is assumed to represent the largest category (a catchall
   * for every changeset to which another category does not apply).
   */
  lt?: number
}

/** Reports the result of evaluating a Changeset for reviewability. */
export class Score {
  /**
   * The expression used to compute this score.
   * This comes from the `scoring.formula` configuration entry.
   */
  formula: string
  /**
   * The numeric result of formula.
   * If this value is undefined, then we encountered an error when evaluating the formula.
   */
  value?: number
  /**
   * The category that the changeset falls into based on its score.
   * If this value is undefined, then either we encountered an error when evaluating the formula
   * or no applicable category was provided when the `addValue` method was called.
   */
  category?: string
  /**
   * An error that we encountered when evaluating the formula on the changeset.
   * If this value is undefined, then no error was encountered during evaluation.
   */
  error?: ParsingError
  /**
   * Maps variable names from the formula to the value substituted in for that variable during
   * formula evaluation. This can be used to understand why the changeset received the score that
   * it did.
   */
  variableSubstitutions: Map<string, number>

  constructor(formula: string) {
    this.formula = formula
    this.variableSubstitutions = new Map()
  }

  /**
   * Records the error that we encountered when evaluating the formula.
   *
   * @param error
   */
  addError(error: ParsingError): void {
    this.error = error
    this.value = undefined
    this.category = undefined
  }

  /**
   * Records the result of evaluating the formula.
   *
   * @param value Score that we computed
   * @param categories The full set of possible categories to assign. This should have at least one
   *   entry, and should also have at least one catchall entry (an entry without an `lt` value).
   */
  addValue(value: number, categories?: Category[]): void {
    this.error = undefined
    this.value = value
    this.category = Score.categorize(value, categories)
  }

  /**
   * Records that we used a particular value for a variable during evaluation.
   *
   * @param variableName The name of the variable we substituted
   * @param value The value we used for the variable
   */
  recordVariableSubstitution(variableName: string, value: number): void {
    this.variableSubstitutions.set(variableName, value)
  }

  /**
   *
   * @param score The numeric value that we should categorize
   * @param categories The set of all categories to choose from
   * @returns The name of the chosen category, or undefined if we couldn't find an appropriate one
   */
  static categorize(score: number, categories?: Category[]): string | undefined {
    if (!categories) {
      return
    }

    const sortedCategories = categories.sort((a, b) => {
      if (a.lt && b.lt) {
        return a.lt - b.lt
      } else if (a.lt) {
        return -1
      } else if (b.lt) {
        return 1
      } else {
        return 0
      }
    })

    for (const category of sortedCategories) {
      if (category.lt && score < category.lt) {
        return category.name
      }
    }

    return sortedCategories[sortedCategories.length - 1]?.name
  }
}

/** Represents a mathematical expression that we use to evaluate a Changeset. */
export class Formula {
  expression: string

  constructor(expression: string) {
    this.expression = expression
  }

  /**
   *
   * @param changeset The code to evaluate
   * @param categories The set of all available score categories to choose from
   * @returns The compute score of the Changeset according to this formula
   */
  evaluate(changeset: Changeset, categories?: Category[]): Score  {
    const result = new Score(this.expression)
    const stack: string[] = []

    for (const { token, index } of this.expression.split(/\s+/).map((token, index) => ({token, index}))) {
      if (!this.isSupportedToken(token)) {
        result.addError({ message: `Formula contains unsupported token: ${token}`, tokenIndex: index })
        return result
      }

      if (stack.length == 0 && !this.isOperator(token)) {
        result.addError({ message: `Formula starts with a non-operator: ${token}`, tokenIndex: index })
        return result
      }

      stack.push(token)
      this.applyOperator(result, stack, changeset)
    }

    if (stack.length != 1) {
      result.addError({ message: `Formula contains the wrong number of operands`, tokenIndex: 0 })
      return result
    }

    result.addValue(parseFloat(stack[0]), categories)
    return result
  }

  private isSupportedToken(token: string): boolean {
    return this.isOperator(token) || this.isOperand(token)
  }

  private isOperator(token: string): boolean {
    return !!this.toOperator(token)
  }

  private toOperator(token: string): Operator | undefined {
    for (const op of SUPPORTED_OPERATORS) {
      if (op.symbol == token) {
        return op
      }
    }
  }

  private isOperand(token: string): boolean {
    return this.isFeature(token) || this.isNumericConstant(token)
  }

  private isFeature(token: string): boolean {
    return FeatureRegistry.has(token)
  }

  private isNumericConstant(token: string): boolean {
    return !!token.match(NUMERIC_CONSTANT_RE)
  }

  private applyOperator(result: Score, stack: string[], changeset: Changeset): void {
    let operator: Operator | undefined = undefined
    let operatorIndex: number | undefined = undefined

    for (let i = stack.length - 1; i >= 0; i--) {
      operator = this.toOperator(stack[i])
      if (operator) {
        operatorIndex = i
        break
      }
    }

    if (!operator || operatorIndex == undefined) {
      return
    }

    const operands = (
      stack
      .slice(operatorIndex + 1, operatorIndex + operator.arity + 1)
      .filter((o) => this.isOperand(o))
    )
    if (operands.length != operator.arity) {
      return
    }

    const numericOperands: number[] = []
    for (const operand of operands) {
      if (this.isFeature(operand)) {
        const FeatureClass = FeatureRegistry.get(operand)!
        const feature = new FeatureClass(changeset)
        const value = feature.evaluate()

        result.recordVariableSubstitution((FeatureClass as unknown as typeof Feature).variableName(), value)
        numericOperands.push(value)
        continue
      }

      if (this.isNumericConstant(operand)) {
        numericOperands.push(parseFloat(operand))
        continue
      }

      throw new Error(`Unsupported operand: ${operand}`)
    }

    stack.splice(operatorIndex, operator.arity + 1)
    stack.push(`${operator.apply(...numericOperands)}`)
  }
}
