import { expect } from "chai"
import Changeset from "../src/changeset"
import { Formula } from "../src/formula"

const changeset = new Changeset(
  `
diff --git a/lorem.ts b/lorem.ts
index 47d94f5..68f175a 100644
--- a/lorem.ts
+++ b/lorem.ts
@@ -1,9 +1,17 @@
-"Lorem ipsum dolor sit amet, consectetur adipiscing elit."
+// "Lorem ipsum dolor sit amet, consectetur adipiscing elit."

  "Sed laoreet rhoncus ligula a finibus."
-// In eu mi in mi semper tincidunt vel nec urna.
  "Pellentesque nec viverra leo. Aenean rhoncus sapien at varius vulputate."

+"Nunc urna orci, tincidunt rhoncus vulputate nec, malesuada eu nibh."
+/*
+ * Aliquam quis est sit amet urna dapibus porta.
+ * Etiam sit amet sollicitudin odio. In blandit porta.
+ */
+"Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
+/* Suspendisse vitae blandit libero. */
+"Proin vulputate semper tellus, at imperdiet ligula mattis quis."
+
  "Nam et dignissim ex."
-"Integer volutpat, ante eu porttitor suscipit, felis erat pellentesque quam, sit amet efficitur libero magna porttitor purus."
+"Integer volutpat, ante eu porttitor suscipit " // , felis erat pellentesque quam, sit amet efficitur libero magna porttitor purus.
  "Nulla leo libero, volutpat fringilla neque nec, bibendum placerat ex."
`
)

describe("Formula", () => {
  describe("#evaluate", () => {
    it("should return the correct result for a simple formula", () => {
      const formula = new Formula("- added-lines removed-lines")
      const result = formula.evaluate(changeset)

      expect(result.error, result.error?.message).to.be.undefined
      expect(result.score).to.equal(8)
    })

    it("should return the correct result for the default formula", () => {
      const formula = new Formula("- - + added-lines removed-lines comment-lines whitespace-lines")
      const result = formula.evaluate(changeset)

      expect(result.error, result.error?.message).to.be.undefined
      expect(result.score).to.equal(7)
    })
  })
})
