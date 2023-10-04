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
    it("should return the correct score for the default formula", () => {
      const formula = new Formula("- - + additions deletions comments whitespace")
      const score = formula.evaluate(changeset, categories)

      expect(score.error, score.error?.message).to.be.undefined
      expect(score.result).to.equal(7)
      expect(score.category!.name).to.equal("extra small")
    })

    it("should complain if the formula contains an unsupported token", () => {
      const formula = new Formula("+ additions an-unimplemented-feature")
      const score = formula.evaluate(changeset, categories)

      expect(score.error?.message).to.satisfy(
        (msg: string) => msg.startsWith("Formula contains unsupported token: an-unimplemented-feature")
      )
      expect(score.result).to.be.undefined
      expect(score.category).to.be.undefined
    })
  })
})
