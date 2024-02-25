import { Categories } from "./category-configuration"
import { ArrayElement } from "./array-element"
import { Context } from "./context"

/** Reports the result of evaluating a Changeset for reviewability. */
export class Score {
  /**
   * The expression used to compute this score.
   * This comes from the `scoring.formula` configuration entry.
   */
  expression: string
  /**
   * The numeric result of formula.
   */
  result: number
  /**
   * The evaluation context that was used to compute the score.
   */
  context: Context

  constructor(expression: string, result: number, context: Context) {
    this.expression = expression

    // Round to two decimal places: https://stackoverflow.com/a/11832950
    this.result = Math.round((result + Number.EPSILON) * 100) / 100,

    this.context = context
  }

  get category(): ArrayElement<Categories> | undefined {
    return this.context.categories?.categorize(this.result)
  }

  toString({ spacing }: { spacing?: string | number } = { spacing: 2 }): string {
    return JSON.stringify(
      {
        expression: this.expression,
        result: this.result,
        category: this.category,
        substitutions: Object.fromEntries(this.context.cache.entries()),
      },
      undefined,
      spacing
    )
  }
}
