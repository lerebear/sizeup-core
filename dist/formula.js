"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formula = void 0;
const operators_1 = require("./operators");
const registry_1 = require("./registry");
const score_1 = require("./score");
const NUMERIC_CONSTANT_RE = /-?\d+(\.\d+)?/;
/** Represents a mathematical expression that we use to evaluate a Changeset. */
class Formula {
    constructor(expression) {
        this.expression = expression;
    }
    /**
     *
     * @param changeset The code to evaluate
     * @param categories The set of all available score categories to choose from
     * @returns The compute score of the Changeset according to this formula
     */
    evaluate(changeset, categories) {
        const result = new score_1.Score(this.expression);
        const stack = [];
        for (const { token, index } of this.expression.split(/\s+/).map((token, index) => ({ token, index }))) {
            if (!this.isSupportedToken(token)) {
                result.addError({ message: `Formula contains unsupported token: ${token}`, tokenIndex: index });
                return result;
            }
            if (stack.length == 0 && !this.isOperator(token)) {
                result.addError({ message: `Formula starts with a non-operator: ${token}`, tokenIndex: index });
                return result;
            }
            stack.push(token);
            this.applyOperator(result, stack, changeset);
        }
        if (stack.length != 1) {
            result.addError({ message: `Formula contains the wrong number of operands`, tokenIndex: 0 });
            return result;
        }
        result.addValue(parseFloat(stack[0]), categories);
        return result;
    }
    isSupportedToken(token) {
        return this.isOperator(token) || this.isOperand(token);
    }
    isOperator(token) {
        return !!this.toOperator(token);
    }
    toOperator(token) {
        for (const op of operators_1.SUPPORTED_OPERATORS) {
            if (op.symbol == token) {
                return op;
            }
        }
    }
    isOperand(token) {
        return this.isFeature(token) || this.isNumericConstant(token);
    }
    isFeature(token) {
        return registry_1.FeatureRegistry.has(token);
    }
    isNumericConstant(token) {
        return !!token.match(NUMERIC_CONSTANT_RE);
    }
    applyOperator(result, stack, changeset) {
        let operator = undefined;
        let operatorIndex = undefined;
        for (let i = stack.length - 1; i >= 0; i--) {
            operator = this.toOperator(stack[i]);
            if (operator) {
                operatorIndex = i;
                break;
            }
        }
        if (!operator || operatorIndex == undefined) {
            return;
        }
        const operands = (stack
            .slice(operatorIndex + 1, operatorIndex + operator.arity + 1)
            .filter((o) => this.isOperand(o)));
        if (operands.length != operator.arity) {
            return;
        }
        const numericOperands = [];
        for (const operand of operands) {
            if (this.isFeature(operand)) {
                const FeatureClass = registry_1.FeatureRegistry.get(operand);
                const feature = new FeatureClass(changeset);
                const value = feature.evaluate();
                result.recordVariableSubstitution(FeatureClass.variableName(), value);
                numericOperands.push(value);
                continue;
            }
            if (this.isNumericConstant(operand)) {
                numericOperands.push(parseFloat(operand));
                continue;
            }
            throw new Error(`Unsupported operand: ${operand}`);
        }
        stack.splice(operatorIndex, operator.arity + 1);
        stack.push(`${operator.apply(...numericOperands)}`);
    }
}
exports.Formula = Formula;
