import Changeset from "./changeset"
import Feature from "./feature"
import { FeatureRegistry } from "./registry"

interface Operator {
  symbol: string
  arity: number
  apply: (...operands: number[]) => number
}

export interface ParsingError {
  message: string
  tokenIndex: number
}

const NUMERIC_CONSTANT_RE = /-?\d+(\.\d+)?/
const OPERATORS: Operator[] = [
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

export class Result {
  expression: string
  score?: number
  error?: ParsingError
  substitutions: Map<string, number>

  constructor(expression: string) {
    this.expression = expression
    this.score = undefined
    this.error = undefined
    this.substitutions = new Map()
  }

  addError(error: ParsingError): void {
    this.error = error
  }

  addScore(score: number): void {
    this.score = score
  }

  addSubstitution(variableName: string, value: number): void {
    this.substitutions.set(variableName, value)
  }
}

export class Formula {
  expression: string

  constructor(expression: string) {
    this.expression = expression
  }

  evaluate(changeset: Changeset): Result  {
    const result = new Result(this.expression)
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

    result.addScore(parseFloat(stack[0]))
    return result
  }

  private isSupportedToken(token: string): boolean {
    return this.isOperator(token) || this.isOperand(token)
  }

  private isOperator(token: string): boolean {
    return !!this.toOperator(token)
  }

  private toOperator(token: string): Operator | undefined {
    for (const op of OPERATORS) {
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

  private applyOperator(result: Result, stack: string[], changeset: Changeset): void {
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

        result.addSubstitution((FeatureClass as unknown as typeof Feature).variableName(), value)
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
