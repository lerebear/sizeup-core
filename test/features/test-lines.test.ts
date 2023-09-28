import { expect } from "chai"
import Changeset from "../../src/changeset"
import TestLines from "../../src/features/test-lines"

const changeset = new Changeset(
  `
diff --git a/lorem.test.ts b/lorem.test.ts
index 47d94f5..629dacb 100644
--- a/lorem.test.ts
+++ b/lorem.test.ts
@@ -1,9 +1,8 @@
-"Lorem ipsum dolor sit amet, consectetur adipiscing elit."
+//"Lorem ipsum dolor sit amet, consectetur adipiscing elit."
+"Curabitur ut dictum quam, eget efficitur risus."
  
  "Sed laoreet rhoncus ligula a finibus."
  // In eu mi in mi semper tincidunt vel nec urna.
  "Pellentesque nec viverra leo. Aenean rhoncus sapien at varius vulputate."
  
  "Nam et dignissim ex."
-"Integer volutpat, ante eu porttitor suscipit, felis erat pellentesque quam, sit amet efficitur libero magna porttitor purus."
-"Nulla leo libero, volutpat fringilla neque nec, bibendum placerat ex."
diff --git a/lorem.ts b/lorem.ts
index 47d94f5..bbd3a31 100644
--- a/lorem.ts
+++ b/lorem.ts
@@ -2,8 +2,7 @@
  
  "Sed laoreet rhoncus ligula a finibus."
  // In eu mi in mi semper tincidunt vel nec urna.
-"Pellentesque nec viverra leo. Aenean rhoncus sapien at varius vulputate."
+//"Pellentesque nec viverra leo. Aenean rhoncus sapien at varius vulputate."
  
-"Nam et dignissim ex."
  "Integer volutpat, ante eu porttitor suscipit, felis erat pellentesque quam, sit amet efficitur libero magna porttitor purus."
  "Nulla leo libero, volutpat fringilla neque nec, bibendum placerat ex."  
`,
undefined,
["*.test.ts"]
)

describe("TestLines", () => {
  const feature = new TestLines(changeset)

  describe(".variableName", () => {
    it("should return the kebab-cased named of the class", () => {
      expect(TestLines.variableName()).to.equal("test-lines")
    })
  })

  describe("#evaluate", () => {
    it("should sum the number of lines added across all test files in the changeset", () => {
      expect(feature.evaluate()).to.equal(2)
    })
  })
})
