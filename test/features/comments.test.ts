import { expect } from "chai"
import Changeset from "../../src/changeset"
import Comments from "../../src/features/comments"
import { loadFixture } from "../helpers/diff"

describe("Comments", () => {
  const rubyFeature = new Comments(new Changeset({ diff: loadFixture("ruby-comment") }))
  const typescriptFeature = new Comments(new Changeset({ diff: loadFixture("typescript-comment") }))
  const javascriptFeature = new Comments(new Changeset({ diff: loadFixture("javascript-comment") }))

  describe(".variableName", () => {
    it("should return the kebab-cased named of the class", () => {
      expect(Comments.variableName()).to.equal("comments")
    })
  })

  describe("#evaluate", () => {
    it("should sum the number of Ruby comments in added or modified lines in the changeset", () => {
      expect(rubyFeature.evaluate()).to.equal(4)
    })

    it("should sum the number of TypeScript comments in added or modified lines in the changeset", () => {
      expect(typescriptFeature.evaluate()).to.equal(6)
    })

    it("should sum the number of JavaScript comments in added or modified lines in the changeset", () => {
      expect(javascriptFeature.evaluate()).to.equal(6)
    })
  })
})
