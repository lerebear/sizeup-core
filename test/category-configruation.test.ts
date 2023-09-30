import { expect } from "chai"
import { CategoryConfiguration } from "../src/category-configuration"

describe("CategoryConfiguration", () => {
  describe("constructor", () => {
    it("should error when given an empty list", () => {
      expect(() => new CategoryConfiguration([])).to.throw(Error, "You must provide at least one category")
    })

    it("should error when it finds a non-positive `lt` value", () => {
      const categories = [{ name: "smol", lt: 0 }]
      expect(() => new CategoryConfiguration(categories)).to.throw(
        Error,
        "Each `category.lt` value must be positive, but \"smol\" has an `lt` value of 0"
      )
    })

    it("should error when it does not find a properly configured largest category", () => {
      const categories = [{ name: "smol", lt: 10 }]
      expect(() => new CategoryConfiguration(categories)).to.throw(
        Error,
        "You must provide one category without an `lt` value to act as the largest category"
      )
    })

    it("should error when it finds more than one category configured as the largest", () => {
      const categories = [{ name: "smol", lt: 10 }, { name: "large" }, { name: "xxl" }]
      expect(() => new CategoryConfiguration(categories)).to.throw(
        Error,
        "You can only specify one category without an `lt` value, but we found at least two: large,xxl"
      )
    })

    it("should error when it does not find a properly configured threshold category", () => {
      const categories = [{ name: "smol" }]
      expect(() => new CategoryConfiguration(categories)).to.throw(
        Error,
        "You must provide one category with a `threshold` value to act as the warning threshold"
      )
    })

    it("should error when it finds more than one category configured as the threshold", () => {
      const categories = [{ name: "smol", lt: 10, threshold: true }, { name: "large", threshold: true }]
      expect(() => new CategoryConfiguration(categories)).to.throw(
        Error,
        "You can only specify one category with a `threshold` value, but we found at least two: smol,large"
      )
    })
  })
})
