import { expect } from "chai"
import { OperatorRegistry } from "../src/operator-registry"
import { Context } from "../src/context"
import { ConstantNode } from "../src/node"

describe("Operators", () => {
  const context = new Context({})
  const apply = (operator: string, ...operands: number[]): number => {
    const nodes = operands.map((o) => new ConstantNode(`${o}`, 1, o))
    return OperatorRegistry.get(operator)!.apply(context, ...nodes)
  }


  describe("+", () => {
    it("sums operands", () => {
      expect(apply("+", 1, 2)).to.equal(3)
      expect(apply("+", -1, 2)).to.equal(1)
    })
  })

  describe("-", () => {
    it("subtracts operands", () => {
      expect(apply("-", 2, 1)).to.equal(1)
      expect(apply("-", 2, -1)).to.equal(3)
    })
  })

  describe("*", () => {
    it("multiplies operands", () => {
      expect(apply("*", 1, 2)).to.equal(2)
      expect(apply("*", -1, 2)).to.equal(-2)
      expect(apply("*", -1, 0)).to.equal(0)
    })
  })

  describe("/", () => {
    it("divides operands", () => {
      expect(apply("/", 1, 2)).to.equal(0.5)
      expect(apply("/", -1, 2)).to.equal(-0.5)
      expect(() => apply("/", 1, 0)).to.throw('"0" evaluated to zero, so it cannot be used as a divisor')
    })
  })

  describe("^", () => {
    it("exponentiates operaands", () => {
      expect(apply("^", 10, 0)).to.equal(1)
      expect(apply("^", 10, 2)).to.equal(100)
      expect(apply("^", 10, -2)).to.equal(0.01)
    })
  })

  describe("?", () => {
    it("evaluates a condition", () => {
      expect(apply("?", 1, 10, 20)).to.equal(10)
      expect(apply("?", 5, 10, 20)).to.equal(10)
      expect(apply("?", 0, 10, 20)).to.equal(20)
      expect(apply("?", -5, 10, 20)).to.equal(20)
    })
  })

  describe(">", () => {
    it("compares greater than", () => {
      expect(apply(">", 1, 1)).to.equal(0)
      expect(apply(">", 1, 2)).to.equal(0)
      expect(apply(">", 2, 1)).to.equal(1)
      expect(apply(">", 2, -1)).to.equal(1)
    })
  })

  describe("<", () => {
    it("compares less than", () => {
      expect(apply("<", 1, 1)).to.equal(0)
      expect(apply("<", 2, 1)).to.equal(0)
      expect(apply("<", 1, 2)).to.equal(1)
      expect(apply("<", -2, -1)).to.equal(1)
    })
  })

  describe("==", () => {
    it("compares equal", () => {
      expect(apply("==", 1, 1)).to.equal(1)
      expect(apply("==", 1, -1)).to.equal(0)
      expect(apply("==", 1, 2)).to.equal(0)
    })
  })

  describe("!=", () => {
    it("compares not equal", () => {
      expect(apply("!=", 1, 1)).to.equal(0)
      expect(apply("!=", 1, -1)).to.equal(1)
      expect(apply("!=", 1, 2)).to.equal(1)
    })
  })

  describe(">=", () => {
    it("compares greater than or equal", () => {
      expect(apply(">=", 1, 1)).to.equal(1)
      expect(apply(">=", 1, -1)).to.equal(1)
      expect(apply(">=", 1, 2)).to.equal(0)
    })
  })

  describe("<=", () => {
    it("compares greater than or equal", () => {
      expect(apply("<=", 1, 1)).to.equal(1)
      expect(apply("<=", -1, 1)).to.equal(1)
      expect(apply("<=", 2, 1)).to.equal(0)
    })
  })

  describe("&", () => {
    it("evaluates logical and", () => {
      expect(apply("&", 1, 1)).to.equal(1)
      expect(apply("&", 2, 4)).to.equal(1)
      expect(apply("&", -1, 1)).to.equal(0)
      expect(apply("&", 1, -1)).to.equal(0)
      expect(apply("&", 1, 0)).to.equal(0)
    })
  })

  describe("|", () => {
    it("evaluates logical or", () => {
      expect(apply("|", -1, 1)).to.equal(1)
      expect(apply("|", 1, -1)).to.equal(1)
      expect(apply("|", 1, 0)).to.equal(1)
      expect(apply("|", 0, 0)).to.equal(0)
      expect(apply("|", -1, -2)).to.equal(0)
    })
  })

  describe("!", () => {
    it("evaluates logical not", () => {
      expect(apply("!", 1)).to.equal(0)
      expect(apply("!", 10)).to.equal(0)
      expect(apply("!", 0)).to.equal(1)
      expect(apply("!", -10)).to.equal(1)
    })
  })
})
