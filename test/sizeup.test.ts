import { expect } from "chai"
import SizeUp from "../src/sizeup"
import { loadFixture } from "./helpers/diff"

describe("Sizeup", () => {
  describe("#evaluate", () => {
    it("should evaluate a diff with the default config", () => {
      const result = SizeUp.evaluate(loadFixture("formula"))

      expect(result.error, result.error?.message).to.be.undefined
      expect(result.value).to.equal(7)
      expect(result.category!.name).to.equal("extra small")
    })
  })
})
