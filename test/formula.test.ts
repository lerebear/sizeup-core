import { expect } from "chai"
import Changeset from "../src/changeset"
import { DefaultConfiguration } from "../src/config/default";
import { Formula } from "../src/formula"
import { loadFixture } from "./helpers/diff"
import { CategoryConfiguration } from "../src/category-configuration"

describe("Formula", () => {
  const changeset = new Changeset({ diff: loadFixture("formula") })
  const categories = new CategoryConfiguration(DefaultConfiguration.categories!)

  describe("#evaluate", () => {
    it("should return the correct result for a simple formula", () => {
      const formula = new Formula("- additions deletions")
      const result = formula.evaluate(changeset, categories)

      expect(result.error, result.error?.message).to.be.undefined
      expect(result.value).to.equal(8)
      expect(result.category).to.equal("xs")
    })

    it("should return the correct result for the default formula", () => {
      const formula = new Formula("- - + additions deletions comments whitespace")
      const result = formula.evaluate(changeset, categories)

      expect(result.error, result.error?.message).to.be.undefined
      expect(result.value).to.equal(7)
      expect(result.category).to.equal("xs")
    })
  })
})
