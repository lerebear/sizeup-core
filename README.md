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

This section describes how to configure this library.

### Overview

As shown [above](#api), `SizeUp.evaluate` accepts a YAML configuration file that can be used to customize the evaluation process. Here's an example:

```yaml
categories:
  - name: xs
    lte: 10
  - name: s
    lte: 30
  - name: m
    lte: 100
    threshold: true
  - name: l
    lte: 500
  - name: xl
ignoredFilePatterns:
  - CODEOWNERS
  - SERVICEOWNERS
testFilePatterns:
  - "*_test.rb"
scoring:
  formula: "- - + additions deletions comments whitespace"
```

The default configuration that is used when no configuration file is provided can be found in [`src/config/examples/default.yaml`](./src/config/examples/default.yaml).

The full specification for the configuration file is provided by the JSON schema at [`src/config/schema.json`](./src/config/schema.json).

### Configuring a scoring formula

`sizeup` is designed to allow users to experiment with different ways to evaluate a diff. You can do this my writing a custom scoring formula that you provide to the libary via the `score.formula` key in the configuration file.

Each formula is written in [prefix notation](https://en.wikipedia.org/wiki/Polish_notation), which means that instead of writing a mathematical operator in between its operands (infix notation), you write it before its operands. For example:

| Traditional (infix notation) expression | Equivalent prefix notation expression |
| :--- | :--- |
| `1 + 2`| `+ 1 2` |
| `(2 + 3) / 10` | `/ + 2 3 10` |

At present, this tool supports only the four most basic mathematical operators: `+` (addition), `-` (subtraction), `/` (division), `*` (multiplication).

The operands in a formula can be either a numerical constant like `0.5` or `99`, or the name of a feature that can be computed from the diff. Here is a list of the features that we support:

| Feature | Description |
| :--- | :--- |
| `additions` | The number of lines that were added in a diff |
| `comments`  | The number of additions in a diff that are recognized as a programming language comment[^1] |
| `deletions` | The number of lines that were deleted in a diff |
| `single-words` | The number of additions in a diff that are made up of a single word on its own line |
| `tests` | The number of additions in a diff that were made in test files[^2] |
| `whitespace` | The number of additions in a diff that were pure whitespace |

[^1]: Comments are only detected in [supported languages](https://github.com/lerebear/sizeup/blob/2c7ce44eb8d8e6d8d02b46b8451bd06f40ed1abf/src/linguist.ts#L64-L69).
[^2]: Test additions are only detected in files that match the patterns in the `testFilePatterns` configuration value.

Putting all of that together, we can explain the default formula `- - + additions deletions comments whitespace` as one that sums all changes in the diff (whether additons or deletions), and then substracts each addition that was either a comment or whitespace.

## Development

This section contains notes for how to develop this library.

### Regenerating the Typescript interface for the configuration schema

We use a [JSON schema](./src/config/schema.json) to define the configuration options that this library supports. We then use the [`json-schema-to-typescript`](https://www.npmjs.com/package/json-schema-to-typescript) package to generate the [TypeScript `Configuration` interface](./src/configuration.ts) that we use in code..

[`json-schema-to-typescript`](https://www.npmjs.com/package/json-schema-to-typescript) has two notable shortcomings:

- It uses outdated type definitions which are incompatible with the latest version of [`minimatch`](https://www.npmjs.com/package/minimatch) that we use in this package. This creates build errors if `json-schema-to-typescript` is  added as a dependency of this package.
- It generates a type definition for the `categories` array this is difficult to work with (it wraps a category object in an array e.g. `[{name:}]` rather than using an array suffix e.g. `{name:}[]`).

To work around those issues, we use the following workflow to regenerate the `Configuration` interface after we've made a change to the schema:

1. Temporarily install `json-schema-to-typescript`:

```sh
npm install --save-dev json-schema-to-typescript
```

2. Regenerate the `Configuration` interface using this command:

```sh
npx \
  json2ts \
  --maxItems=-1 \
  --additionalProperties=false \
  src/config/schema.json \
  src/configuration.ts
```

3. Manually modify the `Configuration.categories` key to use an array suffix.

4. Remove `json-schema-to-typescript` so that we can again build this package without errors.

```sh
npm uninstall json-schema-to-typescript
```
