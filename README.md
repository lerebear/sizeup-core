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
const {data} = await octokit.rest.pulls.get({
  "lerebear",
  "sizeup",
  pull_number: 1,
  mediaType: {format: 'diff'}, // Require diff format directly, then cast to result to string
}) as unknown as string
const score = SizeUp.evaluate(diff)
console.log(score.toString({ spacing: 2}))
```

The final log statement in that snippet will output a serialized `Score`:

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

## API

The public API for this library consists of a single `SizeUp` class that has
a single static method called `evaluate`:

```ts
class SizeUp {
  /**
   * Evaluates a diff for reviewability.
   *
   * @param diff A .diff formatted string containing the code to evaluate
   * @param client Authenticated Octokit client that we should use to communicate with the GitHub
   *   API. This must be provided if a URL is passed via the `diff_or_url` parameter.
   * @param configFile Path to a configuration file containing options for how to evaluate the pull
   *   request.
   */
  static evaluate(diff: string, configFile?: string): Score
}
```

## Configuration

As shown above `SizeUp.evaluate` accepts a YAML configuration file that can be used to customize the evaluation process. Here's an example:

```yaml
categories:
  - name: xs
    lt: 10
  - name: s
    lt: 30
  - name: m
    lt: 100
  - name: l
    lt: 500
  - name: xl
ignoredFilePatterns:
  - CODEOWNERS
  - SERVICEOWNERS
testFilePatterns:
  - "*_test.rb"
scoring:
  formula: "- - + additions deletions comments whitespace"
```

The full specification for the configuration file is provided by the JSON schema at [`src/config/schema.json`](./src/config/schema.json).
