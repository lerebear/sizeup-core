import * as YAML from "yaml"
import * as fs from "fs"
import { expect } from "chai"
import Changeset from "../src/changeset"
import { Formula } from "../src/formula"
import { loadFixture } from "./helpers/diff"
import { CategoryConfiguration } from "../src/category-configuration"
import { Configuration } from "../src/configuration"
import { Context } from "../src/context"

describe("Formula", () => {
  const changeset = new Changeset({ diff: loadFixture("formula") })
  const defaultConfig: Configuration = YAML.parse(fs.readFileSync("./src/config/default.yaml", "utf8"))
  const categories = new CategoryConfiguration(defaultConfig.categories!)
  const context = new Context({ changeset, categories })

  describe("#evaluate", () => {
    it("returns the correct score for the default formula", () => {
      const formula = new Formula("- - + additions deletions comments whitespace")
      const score = formula.evaluate(context)

      expect(score.result).to.equal(7)
      expect(score.category!.name).to.equal("extra small")
    })

    it("allows a formula that includes a numeric constant", () => {
      const formula = new Formula("+ * deletions 0.5 additions")
      const score = formula.evaluate(context)

      expect(score.result).to.equal(12.5)
    })

    it("allows a formula that consists of just a feature", () => {
      const formula = new Formula("additions")
      const score = formula.evaluate(context)

      expect(score.result).to.equal(11)
    })

    it("allows a formula that consists of just a constant", () => {
      const formula = new Formula("100")
      const score = formula.evaluate(context)

      expect(score.result).to.equal(100)
    })

    it("supports conditional expressions", () => {
      const formula = new Formula("? >= / deletions + additions deletions 0.9 additions 1000")
      const changeset = new Changeset({ diff: loadFixture("mostly-deletions") })
      const context = new Context({ changeset })
      const score = formula.evaluate(context)

      expect(score.result).to.equal(1)
    })

    it("supports aliases", () => {
      const formula = new Formula("- boosted-deletions boosted-additions")
      const aliases = new Map([["boosted-deletions", "* deletions 2"], ["boosted-additions", "+ additions 17"]])
      const changeset = new Changeset({ diff: loadFixture("mostly-deletions") })
      const context = new Context({ changeset, aliases })
      const score = formula.evaluate(context)

      expect(score.result).to.equal(0)
      expect(score.context.cache.get('deletions')).to.equal(9)
      expect(score.context.cache.get('additions')).to.equal(1)
      expect(score.context.cache.get('boosted-deletions')).to.equal(18)
      expect(score.context.cache.get('boosted-additions')).to.equal(18)
    })

    it("complains if the formula contains an unsupported token", () => {
      const formula = new Formula("+ additions an-unimplemented-feature")

      expect(() => formula.evaluate(context)).to.throw("Invalid token at position 3: an-unimplemented-feature")
    })

    it("complains if an operator does not have enough operands", () => {
      const formula = new Formula("+ additions")

      expect(() => formula.evaluate(context)).to.throw("Not enough operands for operator + at position 1")
    })

    it("complains if the formula contains too many operands", () => {
      const formula = new Formula("+ additions 10 20")

      expect(() => formula.evaluate(context)).to.throw('Expression "+ additions 10 20" contains an unreachable suffix: "20"')
    })

    it("complains if an alias has the same name as a feature", () => {
      const formula = new Formula("+ additions 9")
      const aliases = new Map([["additions", "1"]])
      const context = new Context({ changeset, aliases})

      expect(() => formula.evaluate(context)).to.throw("Alias must not share a name with a feature: additions")
    })

    it("complains if the name of an alias does not match the allowed pattern", () => {
      const formula = new Formula("+ -one 9")
      const aliases = new Map([["-one", "1"]])
      const context = new Context({ changeset, aliases})

      expect(() => formula.evaluate(context)).to.throw("Alias does not match /^[\\w][\\w-]*$/: -one")
    })

    it("records the variable substitutions it makes", () => {
      const formula = new Formula("- - + additions deletions comments whitespace")
      const score = formula.evaluate(context)

      expect(score.context.cache.get('additions')).to.equal(11)
      expect(score.context.cache.get('deletions')).to.equal(3)
      expect(score.context.cache.get('comments')).to.equal(6)
      expect(score.context.cache.get('whitespace')).to.equal(1)
    })

    it("raises a helpful exception when dividing by zero", () => {
      const formula = new Formula("/ additions comments")
      const changeset = new Changeset({ diff: loadFixture("additions") })
      const context = new Context({ changeset })

      expect(() => formula.evaluate(context)).to.throw('"comments" evaluated to zero, so it cannot be used as a divisor')
    })

    it("does not raise an exception when dividing by zero on a conditional branch that does not need to be evaluated", () => {
      const formula = new Formula("? > comments 0 / additions comments additions")
      const changeset = new Changeset({ diff: loadFixture("additions") })
      const context = new Context({ changeset })
      const score = formula.evaluate(context)

      expect(score.result).to.equal(2)
    })
  })
})
