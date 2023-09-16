import { expect } from "chai"
import Changeset from "../../src/changeset"
import Additions from "../../src/features/additions"
import { loadFixture } from "../helpers/diff"

describe("Additions", () => {
  const feature = new Additions(new Changeset({ diff: loadFixture("additions") }))

  describe(".variableName", () => {
    it("should return the kebab-cased named of the class", () => {
      expect(Additions.variableName()).to.equal("additions")
    })
  })

  describe("#evaluate", () => {
    it("should sum the number of lines added across all files in the changeset", () => {
      expect(feature.evaluate()).to.equal(2)
    })
  })
})
