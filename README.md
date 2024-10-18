# SizeUp

SizeUp is a library for estimating how difficult a diff will be to review.

## Installation

```
npm install sizeup-core
```

## Usage

The most common usage of this library is via one of these wrappers:

- [sizeup-action](https://github.com/lerebear/sizeup-action), which provides a GitHub Action to use this library to evaluate pull requests
- [sizeup-cli](https://github.com/lerebear/sizeup-cli), which provides a CLI to use this library to evaluate a diff locally, prior to opening a pull request

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

## API

The public API for this library consists of the single, static `SizeUp.evaluate` method:

```ts
export class SizeUp {
  /**
   * Evaluates a diff for reviewability.
   *
   * @param diff A .diff formatted string containing the code to evaluate
   * @param configPath Path to a YAML configuration file containing options for how to evaluate the
   *   pull request. The YAML file should conform to the JSON schema in src/config/schema.json.
   */
  static evaluate(diff: string, configPath?: string): Score
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

The default configuration that is used when no configuration file is provided can be found in [`src/config/default.yaml`](./src/config/default.yaml).

The full specification for the configuration file is provided by the JSON schema at [`src/config/schema.json`](./src/config/schema.json).

### Configuring a scoring formula

`sizeup` is designed to allow users to experiment with different ways to evaluate a diff. You can do this my writing a custom scoring formula that you provide to the libary via the `score.formula` key in the configuration file.

The elements of a formula are described in more detail in each of the following sections:

- [Prefix notation](#prefix-notation)
- [Operators](#operators)
- [Features](#features)
- [Aliases](#aliases)

#### Prefix notation

Each formula is written in [prefix notation](https://en.wikipedia.org/wiki/Polish_notation), which means that instead of writing a mathematical operator in between its operands (infix notation), you write it before its operands. For example:

| Traditional (infix notation) expression | Equivalent prefix notation expression |
| :--- | :--- |
| `1 + 2`| `+ 1 2` |
| `(2 + 3) / 10` | `/ + 2 3 10` |

#### Operators

Operators are used to evaluate numerical or logical sub-expressions in a formula. This tool supports the following operators:

| Symbol | Meaning | Example |
| :--- | :--- | :--- |
| `+` | addition | `+ 1 2` evaluates to `3` |
| `-` | subtraction | `- 2 1` evaluates to `1` |
| `*` | multiplication | `* 1 2` evaluates to `2` |
| `\` | division | `/ 4 2` evaluates to `2` |
| `^` | exponentiation | `^ 2 3` evaluates to `8` |
| `?` | conditional evaluation | `? 0 2 4` evaluates to 4 because `0` is considered `false`[^1] |
| `>` | greater than | `> 1 2` evaluates to `false` |
| `<` | less than | `< 1 2` evaluates to `true` |
| `>=` | greater than or equal to | `>= 1 2` evaluates to `false` |
| `<=` | less than or equal to | `<= 1 1` evaluates to `true` |
| `==` | equals | `== 1 1` evaluates to `true` |
| `!=` | not equal | `!= 1 1` evaluates to `false` |
| `&` | logical and | `& 0 1` evaluates to `false`[^1] |
| `\|` | logical or | `\| 0 1` evaluates to `true`[^1] |
| `!` | logical not | `! 1` evaluates to `false`[^1] |


[^1]: All positive numbers are considered truthy; `0` and all negative numbers are considered falsey.

Each operand can be one of three things:

1. A numerical constant like `0.5` or `99`
2. The name of a [feature](#features)
3. The name of an [alias](#aliases)

#### Features

Features describe aspects of a diff that can be computed from it automatically. This tool support the following features:

| Feature | Description |
| :--- | :--- |
| `additions` | The number of lines that were added in a diff |
| `comments`  | The number of additions in a diff that match the syntax of a comment in a [supported programming language](https://github.com/lerebear/sizeup-core/blob/6d1ba961131e32731312937cbf3e9945e4d41afe/src/linguist.ts#L154-L170). |
| `deletions` | The number of lines that were deleted in a diff |
| `single-words` | The number of additions in a diff that are made up of a single word on its own line |
| `tests` | The number of additions in a diff that were made in files that match a pattern from the `testFilePatterns` configuration value. |
| `whitespace` | The number of additions in a diff that were pure whitespace |

If you have an idea for a new feature, please [suggest an enhancement](https://github.com/lerebear/sizeup-core/issues?q=is%3Aissue%20state%3Aopen%20label%3Aenhancement).

#### Aliases

Aliases, which are configured under the `scoring.aliases` key, allow you to define a shorthand for a longer expression:

```yaml
scoring:
  formula: "- changes non-functional-changes"
  aliases:
    changes: "+ additions deletions"
    non-functional-changes: "+ comments whitespace"
```

## Development

This section contains notes for how to develop this library.

### Regenerating the Typescript interface for the configuration schema

We use a [JSON schema](./src/config/schema.json) to define the configuration options that this library supports. We then use the [`json-schema-to-typescript`](https://www.npmjs.com/package/json-schema-to-typescript) package to generate the [TypeScript `Configuration` interface](./src/configuration.ts) that we use in code.

[`json-schema-to-typescript`](https://www.npmjs.com/package/json-schema-to-typescript) uses outdated type definitions which are incompatible with the latest version of [`minimatch`](https://www.npmjs.com/package/minimatch) that we use in this package. This creates build errors if `json-schema-to-typescript` is  added as a dependency of this package.

To work around those issues, we use the following workflow to regenerate the `Configuration` interface after we've made a change to the schema:

1. Temporarily install `json-schema-to-typescript`:

```sh
npm install --save-dev json-schema-to-typescript
```

2. Regenerate the `Configuration` interface using this command:

```sh
npm run generate:config
```

3. Remove `json-schema-to-typescript` so that we can again build this package without errors.

```sh
npm uninstall json-schema-to-typescript
```
