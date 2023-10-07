import * as YAML from "yaml"
import * as fs from "fs"
import { expect } from "chai"
import Changeset from "../src/changeset"
import { Formula } from "../src/formula"
import { loadFixture } from "./helpers/diff"
import { CategoryConfiguration } from "../src/category-configuration"
import { Configuration } from "../src/configuration"

describe("Formula", () => {
  const changeset = new Changeset({ diff: loadFixture("formula") })
  const defaultConfig: Configuration = YAML.parse(fs.readFileSync("./src/config/default.yaml", "utf8"))
  const categories = new CategoryConfiguration(defaultConfig.categories!)

  describe("#evaluate", () => {
    it("returns the correct score for the default formula", () => {
      const formula = new Formula("- - + additions deletions comments whitespace")
      const score = formula.evaluate(changeset, categories)

      expect(score.error, score.error?.message).to.be.undefined
      expect(score.result).to.equal(7)
      expect(score.category!.name).to.equal("extra small")
    })

    it("allows a formula that includes a numeric constant", () => {
      const formula = new Formula("+ * deletions 0.5 additions")
      const score = formula.evaluate(changeset)

      expect(score.error, score.error?.message).to.be.undefined
      expect(score.result).to.equal(12.5)
    })

    it("allows a formula that consists of just a feature", () => {
      const formula = new Formula("additions")
      const score = formula.evaluate(changeset)

      expect(score.error, score.error?.message).to.be.undefined
      expect(score.result).to.equal(11)
    })

    it("allows a formula that consists of just a constant", () => {
      const formula = new Formula("100")
      const score = formula.evaluate(changeset)

      expect(score.error, score.error?.message).to.be.undefined
      expect(score.result).to.equal(100)
    })

    it("complains if the formula contains an unsupported token", () => {
      const formula = new Formula("+ additions an-unimplemented-feature")
      const score = formula.evaluate(changeset)

      expect(score.error?.message).to.equal("Formula contains unsupported token: an-unimplemented-feature")
      expect(score.result).to.be.undefined
    })

    it("complains if an operator does not have enough operands", () => {
      const formula = new Formula("+ additions")
      const score = formula.evaluate(changeset)

      expect(score.error?.message).to.equal("Not enough operands for operator: +")
      expect(score.result).to.be.undefined
    })

    it("complains if the formula contains too many operands", () => {
      const formula = new Formula("+ additions 10 20")
      const score = formula.evaluate(changeset)

      expect(score.error?.message).to.equal("Formula contains too many operands")
      expect(score.result).to.be.undefined
    })

    it("records the variable substitutions it makes", () => {
      const formula = new Formula("- - + additions deletions comments whitespace")
      const score = formula.evaluate(changeset, categories)

      expect(score.variableSubstitutions.get('additions')).to.equal(11)
      expect(score.variableSubstitutions.get('deletions')).to.equal(3)
      expect(score.variableSubstitutions.get('comments')).to.equal(6)
      expect(score.variableSubstitutions.get('whitespace')).to.equal(1)
    })
  })
})
