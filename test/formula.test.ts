import { expect } from "chai"
import Changeset from "../src/changeset"
import { Formula } from "../src/formula"
import { loadFixture } from "./helpers/diff"

describe("Formula", () => {
  const changeset = new Changeset({ diff: loadFixture("formula") })

  describe("#evaluate", () => {
    it("should return the correct result for a simple formula", () => {
      const formula = new Formula("- additions deletions")
      const result = formula.evaluate(changeset)

      expect(result.error, result.error?.message).to.be.undefined
      expect(result.value).to.equal(8)
    })

    it("should return the correct result for the default formula", () => {
      const formula = new Formula("- - + additions deletions comments whitespace")
      const result = formula.evaluate(changeset)

      expect(result.error, result.error?.message).to.be.undefined
      expect(result.value).to.equal(7)
    })
  })
})
