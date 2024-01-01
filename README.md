# SizeUp

SizeUp is a library for estimating how difficult a diff will be to review.

## Installation

```
npm install sizeup-core
```

## Usage

The most common usage of this library is via one of these wrappers:

- [sizeup-action](https://github.com/lerebear/sizeup-action), which provides a GitHub Action to use this library to evaluate pull requests
- [sizeup-cli](https://github.com/lerebear/sizeup-cli), which provides a CLI to use this library to evaluate a diff locally, prior to openining a pull request

To use the library directly, you need to first retrieve a diff, and the pass it
to `SizeUp.evaluate` (optionally also providing a custom configuration file):

```ts
import { SizeUp } from "sizeup-core"

const diff = (
  await octokit
    .rest
    .pulls
    .get({
    "lerebear",
    "sizeup",
    pull_number: 1,

    // This is the easiest way to request a diff directly, but since Octokit
    // doesn't provide the correct result type when we use the `mediaType`
    // option, we must cast the result to a string later on
    mediaType: {format: 'diff'},
  })
).data as unknown as string

const score = SizeUp.evaluate(diff)
console.log(score.toString())
```

The final log statement in that snippet will output a serialized `Score`:

```jsonc
{
  // The expression (written in prefix notation) used to score the diff
  "formula": "- - + additions deletions comments whitespace",

  // The values that were substituted for each variable in the formula
  "variableSubstitutions": [
    [
      "additions",
      11
    ],
    [
      "deletions",
      3
    ],
    [
      "comments",
      6
    ],
    [
      "whitespace",
      1
    ]
  ],

  // The score the diff received when evaluated according to the formula
  "value": 7,

  // The category the diff was assigned based on its score
  "category": "xs"
}
```
