import { Configuration } from "../configuration";

export const DefaultConfiguration: Configuration = {
  categories: [
    {
      name: "xs",
      lt: 10,
    },
    {
      name: "s",
      lt: 30,
    },
    {
      name: "m",
      lt: 100,
    },
    {
      name: "l",
      lt: 500,
    },
    {
      name: "xl",
    },
  ],
  ignoredFilePatterns: [
    "*.rbi",
    "CODEOWNERS",
    "SERVICEOWNERS",
  ],
  testFilePatterns: [
    "*_test.rb",
    "*-test.js",
    "*-test.jsx",
    "*-test.ts",
    "*-test.tsx",
    "test/*.yml",
    "test/*.yaml",
  ],
  scoring: {
    formula: "- - + additions deletions comments whitespace",
  },
}
