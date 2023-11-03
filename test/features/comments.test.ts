import { expect } from "chai"
import Changeset from "../../src/changeset"
import Comments from "../../src/features/comments"
import { TypeScript, JavaScript, Go, CSharp, Java, Rust, Swift, Python, Ruby} from "../../src/linguist"
import { loadCStyleCommentFixture, loadPythonStyleCommentFixture } from "../helpers/diff"

describe("Comments", () => {
  describe(".variableName", () => {
    it("should return the kebab-cased named of the class", () => {
      expect(Comments.variableName()).to.equal("comments")
    })
  })

  describe("#evaluate", () => {
    it("should sum the number of Python-style comments in added or modified lines in the changeset", () => {
      const pythonStyleCommentLanguages = [
        Ruby,
        Python,
      ]

      for (const lang of pythonStyleCommentLanguages) {
        for (const ext of lang.fileExtensions) {
          const feature = new Comments(new Changeset({ diff: loadPythonStyleCommentFixture(ext) }))
          expect(feature.evaluate()).to.equal(
            4,
            `expected comments to be recognized correctly for ${lang.name} in file extension ${ext}`
          )
        }
      }
    })

    it("should sum the number of C-style comments in added or modified lines in the changeset", () => {
      const cStyleCommentLanguages = [
        CSharp,
        Go,
        Java,
        JavaScript,
        Rust,
        Swift,
        TypeScript,
      ]

      for (const lang of cStyleCommentLanguages) {
        for (const ext of lang.fileExtensions) {
          const feature = new Comments(new Changeset({ diff: loadCStyleCommentFixture(ext) }))
          expect(feature.evaluate()).to.equal(
            6,
            `expected comments to be recognized correctly for ${lang.name} in file extension ${ext}`
          )
        }
      }
    })
  })
})
