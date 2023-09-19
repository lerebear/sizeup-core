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
  ignored: [
    "*.rbi",
    "CODEOWNERS",
    "SERVICEOWNERS"
  ],
  scoring: {
    formula: "- - + added-lines removed-lines comment-lines whitespace-lines"
  }
}
