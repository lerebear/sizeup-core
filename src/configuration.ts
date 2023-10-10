/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * YAML configuration accepted by sizeup
 */
export interface Configuration {
  /**
   * category that will be assigned to a pull request depending on its score
   *
   * @minItems 1
   */
  categories?: {
    /**
     * human-friendly name of the category
     */
    name: string;
    /**
     * A visual label that should be used to represent this category
     */
    label?: {
      /**
       * name of the label that should be used to represent this category
       */
      name: string;
      /**
       * describes the meaning of the label that will be used to represent this category
       */
      description?: string;
      /**
       * preferred CSS hex color label that should be used to represent this category
       */
      color?: string;
    };
    /**
     * inclusive upper bound on the score that a pull request must have to be assigned this category
     */
    lte?: number;
  }[];
  scoring?: {
    /**
     * an expression, written in prefix-notation, that describes how to combine features to produce a score
     */
    formula: string;
  };
  /**
   * glob expressions matching file patterns that should be considered as tests during the scoring process
   */
  testFilePatterns?: string[];
  /**
   * glob expressions matching file patterns that are ignored in the scoring process
   */
  ignoredFilePatterns?: string[];
}
