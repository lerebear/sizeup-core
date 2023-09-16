import { expect } from "chai"
import Changeset from "../../src/changeset"
import WhitespaceLines from "../../src/features/whitespace-lines"

const changeset = new Changeset(
  `
diff --git a/README.md b/README.md
index 8aa27aa..fc65469 100644
--- a/README.md
+++ b/README.md
@@ -1,5 +1,12 @@
  # Create a JavaScript Action Using TypeScript

+Make a new thing
+Try
+
+it
+
+now
+
`
)

describe("WhitespaceLines", () => {
  const feature = new WhitespaceLines(changeset)

  describe("#id", () => {
    it("should return the kebab-cased named of the class", () => {
      expect(feature.id()).to.equal("whitespace-lines")
    })
  })

  describe("#evaluate", () => {
    it("should sum the number of lines added across all files in the changeset", () => {
      expect(feature.evaluate()).to.equal(3)
    })
  })
})
