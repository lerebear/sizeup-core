import { expect } from "chai"
import { Score, SizeUp } from "../src/sizeup"
import { loadFixture } from "./helpers/diff"
import * as YAML from 'yaml'
import * as fs from 'fs'
import * as path from 'path'
import { Configuration } from "../src/configuration"

describe("Sizeup", () => {
  describe("#evaluate", () => {
    it("should evaluate a diff with the default config", () => {
      const score = SizeUp.evaluate(loadFixture("formula"))

      expect(score.result).to.equal(7)
      expect(score.category!.name).to.equal("extra small")
    })

    it("should evaluate a diff with a user-supplied config", () => {
      let score: Score
      const config: Configuration = {scoring: {formula: "deletions"}}
      const configPath = path.resolve(__dirname, '/tmp/sizeup.yaml')

      try {
        fs.writeFileSync(configPath, YAML.stringify(config))
        score = SizeUp.evaluate(loadFixture("formula"), configPath)
      } finally {
        fs.rmSync(configPath, { force: true })
      }

      expect(score.result).to.equal(3)
      expect(score.category!.name).to.equal("extra small")
    })

    it("should evaluate a diff with a user-supplied config in sizeup-action format", () => {
      let score: Score
      const config = {sizeup: {scoring: {formula: "deletions"}}}
      const configPath = path.resolve(__dirname, '/tmp/sizeup.yaml')

      try {
        fs.writeFileSync(configPath, YAML.stringify(config))
        score = SizeUp.evaluate(loadFixture("formula"), configPath)
      } finally {
        fs.rmSync(configPath, { force: true })
      }

      expect(score.result).to.equal(3)
      expect(score.category!.name).to.equal("extra small")
    })
  })
})
