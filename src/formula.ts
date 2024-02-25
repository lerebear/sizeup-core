import { Score } from "./score"
import {  Node } from "./node"
import { Context } from "./context"

/** Represents a mathematical expression that we use to evaluate a Changeset. */
export class Formula {
  expression: string

  constructor(expression: string) {
    this.expression = expression
  }

  evaluate(context: Context): Score {
    const ast = Node.build_ast(this.expression, context)
    return new Score(this.expression, ast.evaluate(context), context)
  }
}
