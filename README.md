# SizeUp

SizeUp is a library for estimating how easy a pull request will be to review.

## Installation

For now, `sizeup` must be installed directly from GitHub:

```
npm install git+https://github.com/lerebear/sizeup.git
```

## Basic usage

Load a diff from GitHub pull request, then pass it to `SizeUp.evaluate` like so:

```ts
const {data} = await octokit.rest.pulls.get({
  "lerebear",
  "sizeup",
  pull_number: 1,
  mediaType: {format: 'diff'}, // Require diff format directly, then cast to result to string
}) as unknown as string
const score = Sizeup.evaluate(diff)
console.log(score.toString({ spacing: 2}))
```

That will output a serialized `Score`:

```jsonc
{
  // The mathematical expression used to score the diff
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
