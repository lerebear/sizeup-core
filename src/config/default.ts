import { Configuration } from "../configuration";

export const DefaultConfiguration: Configuration = {
  "categories": [
    {
      "name": "extra small",
      "label": {
        "name": "xs",
        "color": "3cbf00"
      },
      "lt": 10
    },
    {
      "name": "small",
      "label": {
        "name": "s",
        "color": "5d9801"
      },
      "lt": 30
    },
    {
      "name": "medium",
      "label": {
        "name": "m",
        "color": "7f7203"
      },
      "lt": 100
    },
    {
      "name": "large",
      "label": {
        "name": "l",
        "color": "a14c05"
      },
      "lt": 500,
      "threshold": true
    },
    {
      "name": "extra large",
      "label": {
        "name": "sl",
        "color": "c32607"
      }
    }
  ],
  "ignoredFilePatterns": [
    "*.rbi",
    "CODEOWNERS",
    "SERVICEOWNERS"
  ],
  "testFilePatterns": [
    "*_test.rb",
    "*-test.js",
    "*-test.jsx",
    "*-test.ts",
    "*-test.tsx",
    "test/*.yml",
    "test/*.yaml"
  ],
  "scoring": {
    "formula": "- - + additions deletions comments whitespace"
  }
}
