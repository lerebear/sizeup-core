import { ArrayElement } from "./array-element"
import { Configuration } from "./configuration"

export type Categories = Required<Pick<Configuration, 'categories'>>["categories"]

/** Validates a group of categories and provides a categorization method. */
export class CategoryConfiguration {
  threshold: number
  private categories: Categories

  constructor(categories: Categories) {
    if (!categories.length) {
      throw new Error("You must provide at least one category")
    }

    const sorted = categories.sort((a, b) => {
      if (a.lte && b.lte) {
        return a.lte - b.lte
      } else if (a.lte) {
        return -1
      } else if (b.lte) {
        return 1
      } else {
        return 0
      }
    })

    for (const category of sorted) {
      if (category.lte !== undefined && category.lte < 0) {
        throw new Error(
          `Each \`category.lte\` value must be non-negative, but "${category.name}" has an \`lte\` ` +
          `value of ${category.lte}`
        )
      }
    }

    const catchAllCategories = sorted.filter((category) => !category.lte)

    if (!catchAllCategories.length) {
      throw new Error(
        "You must provide one category without an `lte` value to act as the largest category"
      )
    }

    if (catchAllCategories.length > 1) {
      throw new Error(
        "You can only specify one category without an `lte` value, but we found at least two: " +
        catchAllCategories.map((c) => c.name)
      )
    }

    const thresholdCategories = sorted.filter((category) => category.threshold)
    if (!thresholdCategories.length){
      throw new Error(
        "You must provide one category with a `threshold` value to act as the warning threshold"
      )
    }

    if (thresholdCategories.length > 1) {
      throw new Error(
        "You can only specify one category with a `threshold` value, but we found at least two: " +
        thresholdCategories.map((c) => c.name)
      )
    }

    this.categories = sorted
    this.threshold = thresholdCategories[0].lte!
  }

  /**
   *
   * @param score The numeric value that we should categorize
   * @returns The name of the chosen category
   */
  categorize(score: number): ArrayElement<Categories> {
    for (const category of this.categories) {
      if (category.lte && score < category.lte) {
        return category
      }
    }

    return this.categories[this.categories.length - 1]
  }
}
