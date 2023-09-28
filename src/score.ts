import { CategoryConfiguration } from "./category-configuration"
import { ParsingError } from "./parsing-error"

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
   * @param categories The set of possible categories to assign.
   */
  addValue(value: number, categories?: CategoryConfiguration): void {
    this.error = undefined
    this.value = value
    this.category = categories?.categorize(value)
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
}
