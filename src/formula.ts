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
