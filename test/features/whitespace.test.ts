import { expect } from "chai"
import Changeset from "../../src/changeset"
import Whitespace from "../../src/features/whitespace"

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

describe("Whitespace", () => {
  const feature = new Whitespace(changeset)

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
