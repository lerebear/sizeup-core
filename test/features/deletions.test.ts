import { expect } from "chai"
import Changeset from "../../src/changeset"
import Deletions from "../../src/features/deletions"
import { loadFixture } from "../helpers/diff"

describe("Deletions", () => {
  const feature = new Deletions(new Changeset({ diff: loadFixture("deletions") }))

  describe(".variableName", () => {
    it("should return the kebab-cased named of the class", () => {
      expect(Deletions.variableName()).to.equal("deletions")
    })
  })

  describe("#evaluate", () => {
    it("should sum the number of lines added across all files in the changeset", () => {
      expect(feature.evaluate()).to.equal(1)
    })
  })
})
