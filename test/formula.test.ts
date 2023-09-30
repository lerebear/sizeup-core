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
    it("should return the correct result for the default formula", () => {
      const formula = new Formula("- - + additions deletions comments whitespace")
      const result = formula.evaluate(changeset, categories)

      expect(result.error, result.error?.message).to.be.undefined
      expect(result.value).to.equal(7)
      expect(result.category!.name).to.equal("extra small")
    })

    it("should complain if the formula contains an unsupported token", () => {
      const formula = new Formula("+ additions an-unimplemented-feature")
      const result = formula.evaluate(changeset, categories)

      expect(result.error?.message).to.satisfy(
        (msg: string) => msg.startsWith("Formula contains unsupported token: an-unimplemented-feature")
      )
      expect(result.value).to.be.undefined
      expect(result.category).to.be.undefined
    })
  })
})
