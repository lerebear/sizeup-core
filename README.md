# SizeUp

SizeUp is a library for estimating how easy a pull request will be to review.

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

As shown above `SizeUp.evaluate` accepts a YAML configuration file that can be used to customize the evaluation process. Here's an example:

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
