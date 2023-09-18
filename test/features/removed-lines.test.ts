import { expect } from "chai"
import Changeset from "../../src/changeset"
import RemovedLines from "../../src/features/removed-lines"

const changeset = new Changeset(
  `
diff --git a/package.json b/package.json
index c40f464..f548cfa 100644
--- a/package.json
+++ b/package.json
@@ -22,7 +22,8 @@
    "@oclif/plugin-plugins": "^3.6.1",
    "@types/diff": "^5.0.3",
    "diff": "^5.1.0",
-    "octokit": "^3.1.0"
+    "octokit": "^3.1.0",
+    "yaml": "^2.3.2"
  },
  "devDependencies": {
    "@oclif/test": "^2.5.3",
`,
)

describe("RemovedLines", () => {
  const feature = new RemovedLines(changeset)

  describe(".variableName", () => {
    it("should return the kebab-cased named of the class", () => {
      expect(RemovedLines.variableName()).to.equal("removed-lines")
    })
  })

  describe("#evaluate", () => {
    it("should sum the number of lines added across all files in the changeset", () => {
      expect(feature.evaluate()).to.equal(1)
    })
  })
})
