import { expect } from "chai"
import Changeset from "../../src/changeset"
import SingleWords from "../../src/features/single-words"
import { loadFixture } from "../helpers/diff"

describe("SingleWords", () => {
  const feature = new SingleWords(new Changeset({ diff: loadFixture("single-words") }))

  describe(".variableName", () => {
    it("should return the kebab-cased named of the class", () => {
      expect(SingleWords.variableName()).to.equal("single-words")
    })
  })

  describe("#evaluate", () => {
    it("should sum the number of lines containing just a single word across all files in the changeset", () => {
      expect(feature.evaluate()).to.equal(8)
    })
  })
})
