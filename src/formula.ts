import { CategoryConfiguration } from "./category-configuration"
import Changeset from "./changeset"
import Feature from "./feature"
import { Operator, SUPPORTED_OPERATORS } from "./operators"
import { FeatureRegistry } from "./registry"
import { Score } from "./score"

const NUMERIC_CONSTANT_RE = /-?\d+(\.\d+)?/

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
  evaluate(changeset: Changeset, categories?: CategoryConfiguration): Score  {
    const result = new Score(this.expression)
    const stack: number[] = []
    const tokens = this.expression.split(/\s+/)

    while (tokens.length) {
      const tokenPosition = tokens.length
      const token = tokens.pop()!
      const operator = this.toOperator(token)

      if (!this.isSupportedToken(token)) {
        result.addError({
          message: (`Formula contains unsupported token: ${token}`),
          tokenPosition
        })
        return result
      }

      if (this.isFeature(token)) {
        const FeatureClass = FeatureRegistry.get(token)!
        const feature = new FeatureClass(changeset)
        const value = feature.evaluate()
        result.recordVariableSubstitution((FeatureClass as unknown as typeof Feature).variableName(), value)
        stack.push(value)
      } else if (this.isNumericConstant(token)) {
        stack.push(parseFloat(token))
      } else if (operator && stack.length >= operator.arity) {
        const operands = stack.splice(stack.length - operator.arity, operator.arity).reverse()
        stack.push(operator.apply(...operands))
      } else if (operator) {
        result.addError({
          message: (`Not enough operands for operator: ${operator.symbol}`),
          tokenPosition
        })
        return result
      }
    }

    if (stack.length != 1) {
      result.addError({ message: `Formula contains too many operands`, tokenPosition: 1 })
      return result
    }

    result.addValue(
      // Round to two decimal places: https://stackoverflow.com/a/11832950
      Math.round((stack[0]! + Number.EPSILON) * 100) / 100,
      categories
    )

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
}
