import { expect } from "chai"
import Changeset from "../../src/changeset"
import Comments from "../../src/features/comments"
import { TypeScript, JavaScript, Go, CSharp, Java, Rust, Swift, Python, Ruby, Kotlin, YAML, XML, HTML, CommentStyleFamily, Language} from "../../src/linguist"
import { loadCommentFixture } from "../helpers/diff"

describe("Comments", () => {
  describe(".variableName", () => {
    it("should return the kebab-cased named of the class", () => {
      expect(Comments.variableName()).to.equal("comments")
    })
  })

  describe("#evaluate", () => {
    const languageMatrix: [Language, CommentStyleFamily][] = [
      [CSharp, CommentStyleFamily.C],
      [Go, CommentStyleFamily.C],
      [HTML, CommentStyleFamily.HTML],
      [Java, CommentStyleFamily.C],
      [JavaScript, CommentStyleFamily.C],
      [Kotlin, CommentStyleFamily.C],
      [Python, CommentStyleFamily.Python],
      [Ruby, CommentStyleFamily.Python],
      [Rust, CommentStyleFamily.C],
      [Swift, CommentStyleFamily.C],
      [TypeScript, CommentStyleFamily.C],
      [XML, CommentStyleFamily.HTML],
      [YAML, CommentStyleFamily.Python],
    ]

    for (const spec of languageMatrix) {
      const lang = spec[0];
      const commentFamily = spec[1];

      let numExpectedComments = 0;
      switch(commentFamily) {
        case CommentStyleFamily.C: {
          numExpectedComments = 6;
          break
        }
        case CommentStyleFamily.HTML: {
          numExpectedComments = 7;
          break
        }
        case CommentStyleFamily.Python: {
          numExpectedComments = 4;
          break
        }
      }

      it(`should sum the number of comments in modified lines of a ${lang.name} file`, () => {
        for (const ext of lang.fileExtensions) {
          const feature = new Comments(new Changeset({ diff: loadCommentFixture(commentFamily, ext) }))
          expect(feature.evaluate()).to.equal(
            numExpectedComments,
            `expected comments to be recognized correctly for ${lang.name} in file extension ${ext}`
          )
        }
      })
    }
  })
})
