import { expect } from "chai"
import Changeset from "../../src/changeset"
import Comments from "../../src/features/comments"

const rubyChangeset = new Changeset(
  `
diff --git a/lorem.rb b/lorem.rb
index 70714bc..f0253cf 100644
--- a/lorem.rb
+++ b/lorem.rb
@@ -1,9 +1,15 @@
-Lorem ipsum dolor sit amet, consectetur adipiscing elit.
+# Lorem ipsum dolor sit amet, consectetur adipiscing elit.

  Sed laoreet rhoncus ligula a finibus.
-# In eu mi in mi semper tincidunt vel nec urna.
  Pellentesque nec viverra leo. Aenean rhoncus sapien at varius vulputate.

+Nunc urna orci, tincidunt rhoncus vulputate nec, malesuada eu nibh.
+# Aliquam quis est sit amet urna dapibus porta.
+# Etiam sit amet sollicitudin odio. In blandit porta.
+Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
+# Suspendisse vitae blandit libero.
+Proin vulputate semper tellus, at imperdiet ligula mattis quis.
+
  Nam et dignissim ex.
-Integer volutpat, ante eu porttitor suscipit, felis erat pellentesque quam, sit amet efficitur libero magna porttitor purus.
+Integer volutpat, ante eu porttitor suscipit # , felis erat pellentesque quam, sit amet efficitur libero magna porttitor purus.
  Nulla leo libero, volutpat fringilla neque nec, bibendum placerat ex.
`
)

const typescriptChangeset = new Changeset(
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

const javascriptChangeset = new Changeset(
  `
diff --git a/lorem.js b/lorem.js
index 47d94f5..68f175a 100644
--- a/lorem.js
+++ b/lorem.js
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

describe("Comments", () => {
  const rubyFeature = new Comments(rubyChangeset)
  const typescriptFeature = new Comments(typescriptChangeset)
  const javascriptFeature = new Comments(javascriptChangeset)

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
