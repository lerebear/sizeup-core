import { expect } from "chai"
import Changeset from "../../src/changeset"
import Whitespace from "../../src/features/whitespace"
import { loadFixture } from "../helpers/diff"

describe("Whitespace", () => {
  const feature = new Whitespace(new Changeset({ diff: loadFixture("whitespace") }))

  describe(".variableName", () => {
    it("should return the kebab-cased named of the class", () => {
      expect(Whitespace.variableName()).to.equal("whitespace")
    })
  })

  describe("#evaluate", () => {
    it("should sum the number of lines added across all files in the changeset", () => {
      expect(feature.evaluate()).to.equal(3)
    })
  })
})
