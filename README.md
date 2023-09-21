# SizeUp

SizeUp is a library for estimating how easy a pull request will be to review.

## Installation

```
npm install sizeup
```

## Basic usage

```ts
const score = Sizeup.evaluate("https://github.com/lerebear/sizeup/pull/1", octokit)
console.log(score.value) // 800
console.log(score.category) // "xl"
```
