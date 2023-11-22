import { expect } from "chai"
import Changeset from "../../src/changeset"
import Comments from "../../src/features/comments"
import { TypeScript, JavaScript, Go, CSharp, Java, Rust, Swift, Python, Ruby, Kotlin, YAML} from "../../src/linguist"
import { loadCStyleCommentFixture, loadPythonStyleCommentFixture } from "../helpers/diff"

describe("Comments", () => {
  describe(".variableName", () => {
    it("should return the kebab-cased named of the class", () => {
      expect(Comments.variableName()).to.equal("comments")
    })
  })

  describe("#evaluate", () => {
    const pythonStyleCommentLanguages = [
      Ruby,
      Python,
      YAML,
    ]

    const cStyleCommentLanguages = [
      CSharp,
      Go,
      Java,
      JavaScript,
      Kotlin,
      Rust,
      Swift,
      TypeScript,
    ]

    for (const lang of pythonStyleCommentLanguages) {
      it(`should sum the number of comments in modified lines of a ${lang.name} file`, () => {
        for (const ext of lang.fileExtensions) {
          const feature = new Comments(new Changeset({ diff: loadPythonStyleCommentFixture(ext) }))
          expect(feature.evaluate()).to.equal(
            4,
            `expected comments to be recognized correctly for ${lang.name} in file extension ${ext}`
          )
        }
      })
    }

    for (const lang of cStyleCommentLanguages) {
      it(`should sum the number of comments in modified lines of a ${lang.name} file`, () => {
        for (const ext of lang.fileExtensions) {
          const feature = new Comments(new Changeset({ diff: loadCStyleCommentFixture(ext) }))
          expect(feature.evaluate()).to.equal(
            6,
            `expected comments to be recognized correctly for ${lang.name} in file extension ${ext}`
          )
        }
      })
    }
  })
})
