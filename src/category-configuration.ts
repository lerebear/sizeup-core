/** A category assigned to a changeset based on its computed score. */
export interface Category {
  /** Friendly name of the category. */
  name: string
  /** A visual label that should be used to represent this category. */
  label?: {
    /** The name of the label that should be used to represent this category. */
    name: string,
    /** The CSS hex color that should be used to represent this category. */
    color?: string
  }
  /**
   * Upper bound on the score that a changeset can receive in order for this category to apply.
   * If this value is omitted, then this is assumed to represent the largest category (a catchall
   * for every changeset to which another category does not apply).
   */
  lt?: number
  /**
   * Whether or not this category represents the threshold at which we shoudl warn diff authors
   * that their code will be difficult to review.
   */
  threshold?: boolean
}

/** Validates a group of categories and provides a categorization method. */
export class CategoryConfiguration {
  private categories: Category[]

  constructor(categories: Category[]) {
    if (!categories.length) {
      throw new Error("You must provide at least one category")
    }

    const sorted = categories.sort((a, b) => {
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

    for (const category of sorted) {
      if (category.lt !== undefined && category.lt < 1) {
        throw new Error(
          `Each \`category.lt\` value must be positive, but "${category.name}" has an \`lt\` ` +
          `value of ${category.lt}`
        )
      }
    }

    const catchAllCategories = sorted.filter((category) => !category.lt)

    if (!catchAllCategories.length) {
      throw new Error(
        "You must provide one category without an `lt` value to act as the largest category"
      )
    }

    if (catchAllCategories.length > 1) {
      throw new Error(
        "You can only specify one category without an `lt` value, but we found at least two: " +
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
  }

  /**
   *
   * @param score The numeric value that we should categorize
   * @returns The name of the chosen category
   */
  categorize(score: number): Category {
    for (const category of this.categories) {
      if (category.lt && score < category.lt) {
        return category
      }
    }

    return this.categories[this.categories.length - 1]
  }
}
