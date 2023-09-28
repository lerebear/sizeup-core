/** A category assigned to a changeset based on its computed score. */
export interface Category {
    /** Friendly name of the category. */
    name: string;
    /**
     * Upper bound on the score that a changeset can receive in order for this category to apply.
     * If this value is omitted, then this is assumed to represent the largest category (a catchall
     * for every changeset to which another category does not apply).
     */
    lt?: number;
}
/** Validates a group of categories and provides a categorization method. */
export declare class CategoryConfiguration {
    private categories;
    constructor(categories: Category[]);
    /**
     *
     * @param score The numeric value that we should categorize
     * @returns The name of the chosen category
     */
    categorize(score: number): string;
}
