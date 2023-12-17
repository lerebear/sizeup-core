import { expect } from "chai"
import { Operator, SUPPORTED_OPERATORS } from "../src/operators"

describe("Operators", () => {
  const Op = (symbol: string): Operator => SUPPORTED_OPERATORS.find((o) => o.symbol == symbol)!

  describe("+", () => {
    it("sums operands", () => {
      expect(Op("+").apply(1, 2)).to.equal(3)
      expect(Op("+").apply(-1, 2)).to.equal(1)
    })
  })

  describe("-", () => {
    it("subtracts operands", () => {
      expect(Op("-").apply(2, 1)).to.equal(1)
      expect(Op("-").apply(2, -1)).to.equal(3)
    })
  })

  describe("*", () => {
    it("multiplies operands", () => {
      expect(Op("*").apply(1, 2)).to.equal(2)
      expect(Op("*").apply(-1, 2)).to.equal(-2)
      expect(Op("*").apply(-1, 0)).to.equal(0)
    })
  })

  describe("/", () => {
    it("divides operands", () => {
      expect(Op("/").apply(1, 2)).to.equal(0.5)
      expect(Op("/").apply(-1, 2)).to.equal(-0.5)
      expect(() => Op("/").apply(1, 0)).to.throw()
    })
  })

  describe("^", () => {
    it("exponentiates operaands", () => {
      expect(Op("^").apply(10, 0)).to.equal(1)
      expect(Op("^").apply(10, 2)).to.equal(100)
      expect(Op("^").apply(10, -2)).to.equal(0.01)
    })
  })

  describe("?", () => {
    it("evaluates a condition", () => {
      expect(Op("?").apply(1, 10, 20)).to.equal(10)
      expect(Op("?").apply(5, 10, 20)).to.equal(10)
      expect(Op("?").apply(0, 10, 20)).to.equal(20)
      expect(Op("?").apply(-5, 10, 20)).to.equal(20)
    })
  })

  describe(">", () => {
    it("compares greater than", () => {
      expect(Op(">").apply(1, 1)).to.equal(0)
      expect(Op(">").apply(1, 2)).to.equal(0)
      expect(Op(">").apply(2, 1)).to.equal(1)
      expect(Op(">").apply(2, -1)).to.equal(1)
    })
  })

  describe("<", () => {
    it("compares less than", () => {
      expect(Op("<").apply(1, 1)).to.equal(0)
      expect(Op("<").apply(2, 1)).to.equal(0)
      expect(Op("<").apply(1, 2)).to.equal(1)
      expect(Op("<").apply(-2, -1)).to.equal(1)
    })
  })

  describe("==", () => {
    it("compares equal", () => {
      expect(Op("==").apply(1, 1)).to.equal(1)
      expect(Op("==").apply(1, -1)).to.equal(0)
      expect(Op("==").apply(1, 2)).to.equal(0)
    })
  })

  describe("!=", () => {
    it("compares not equal", () => {
      expect(Op("!=").apply(1, 1)).to.equal(0)
      expect(Op("!=").apply(1, -1)).to.equal(1)
      expect(Op("!=").apply(1, 2)).to.equal(1)
    })
  })

  describe(">=", () => {
    it("compares greater than or equal", () => {
      expect(Op(">=").apply(1, 1)).to.equal(1)
      expect(Op(">=").apply(1, -1)).to.equal(1)
      expect(Op(">=").apply(1, 2)).to.equal(0)
    })
  })

  describe("<=", () => {
    it("compares greater than or equal", () => {
      expect(Op("<=").apply(1, 1)).to.equal(1)
      expect(Op("<=").apply(-1, 1)).to.equal(1)
      expect(Op("<=").apply(2, 1)).to.equal(0)
    })
  })

  describe("&", () => {
    it("evaluates logical and", () => {
      expect(Op("&").apply(1, 1)).to.equal(1)
      expect(Op("&").apply(2, 4)).to.equal(1)
      expect(Op("&").apply(-1, 1)).to.equal(0)
      expect(Op("&").apply(1, -1)).to.equal(0)
      expect(Op("&").apply(1, 0)).to.equal(0)
    })
  })

  describe("|", () => {
    it("evaluates logical or", () => {
      expect(Op("|").apply(-1, 1)).to.equal(1)
      expect(Op("|").apply(1, -1)).to.equal(1)
      expect(Op("|").apply(1, 0)).to.equal(1)
      expect(Op("|").apply(0, 0)).to.equal(0)
      expect(Op("|").apply(-1, -2)).to.equal(0)
    })
  })

  describe("!", () => {
    it("evaluates logical not", () => {
      expect(Op("!").apply(1)).to.equal(0)
      expect(Op("!").apply(10)).to.equal(0)
      expect(Op("!").apply(0)).to.equal(1)
      expect(Op("!").apply(-10)).to.equal(1)
    })
  })
})
