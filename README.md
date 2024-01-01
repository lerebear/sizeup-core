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
