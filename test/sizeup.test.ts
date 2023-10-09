import { expect } from "chai"
import { SizeUp } from "../src/sizeup"
import { loadFixture } from "./helpers/diff"

describe("Sizeup", () => {
  describe("#evaluate", () => {
    it("should evaluate a diff with the default config", () => {
      const score = SizeUp.evaluate(loadFixture("formula"))

      expect(score.error, score.error?.message).to.be.undefined
      expect(score.result).to.equal(7)
      expect(score.category!.name).to.equal("extra small")
    })
  })
})
