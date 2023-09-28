"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPPORTED_OPERATORS = void 0;
exports.SUPPORTED_OPERATORS = [
    {
        symbol: "+",
        arity: 2,
        apply: (...operands) => operands[0] + operands[1]
    },
    {
        symbol: "-",
        arity: 2,
        apply: (...operands) => operands[0] - operands[1]
    },
    {
        symbol: "*",
        arity: 2,
        apply: (...operands) => operands[0] * operands[1]
    },
    {
        symbol: "/",
        arity: 2,
        apply: (...operands) => operands[0] / operands[1]
    },
];
