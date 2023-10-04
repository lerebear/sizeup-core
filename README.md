# SizeUp

SizeUp is a library for estimating how easy a pull request will be to review.

## Installation

For now, `sizeup` must be installed directly from GitHub:

```
npm install https://github.com/lerebear/sizeup.git
```

## Usage

Load a diff from GitHub pull request, then pass it to `SizeUp.evaluate` like so:

```ts
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
