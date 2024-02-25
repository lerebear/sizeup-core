import { expect } from "chai"
import { FeatureRegistry } from "../src/feature-registry"

describe("FeatureRegistry", () => {
  describe("get", () => {
    it("should contain the features used in the default formula", () => {
      expect(FeatureRegistry.get("additions")).to.exist
      expect(FeatureRegistry.get("deletions")).to.exist
      expect(FeatureRegistry.get("comments")).to.exist
      expect(FeatureRegistry.get("whitespace")).to.exist
    })
  })
})
