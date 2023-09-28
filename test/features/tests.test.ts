import { expect } from "chai"
import Changeset from "../../src/changeset"
import Tests from "../../src/features/tests"
import { loadFixture } from "../helpers/diff"

describe("Tests", () => {
  const feature = new Tests(
    new Changeset({
      diff: loadFixture("tests"),
      testFilePatterns: ["*.test.ts"]
    })
  )

  describe(".variableName", () => {
    it("should return the kebab-cased named of the class", () => {
      expect(Tests.variableName()).to.equal("tests")
    })
  })

  describe("#evaluate", () => {
    it("should sum the number of lines added across all test files in the changeset", () => {
      expect(feature.evaluate()).to.equal(2)
    })
  })
})
