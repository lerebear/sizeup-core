"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formula = exports.Score = void 0;
const registry_1 = require("./registry");
const NUMERIC_CONSTANT_RE = /-?\d+(\.\d+)?/;
const SUPPORTED_OPERATORS = [
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
/** Reports the result of evaluating a Changeset for reviewability. */
class Score {
    constructor(formula) {
        this.formula = formula;
        this.variableSubstitutions = new Map();
    }
    /**
     * Records the error that we encountered when evaluating the formula.
     *
     * @param error
     */
    addError(error) {
        this.error = error;
        this.value = undefined;
        this.category = undefined;
    }
    /**
     * Records the result of evaluating the formula.
     *
     * @param value Score that we computed
     * @param categories The full set of possible categories to assign. This should have at least one
     *   entry, and should also have at least one catchall entry (an entry without an `lt` value).
     */
    addValue(value, categories) {
        this.error = undefined;
        this.value = value;
        this.category = Score.categorize(value, categories);
    }
    /**
     * Records that we used a particular value for a variable during evaluation.
     *
     * @param variableName The name of the variable we substituted
     * @param value The value we used for the variable
     */
    recordVariableSubstitution(variableName, value) {
        this.variableSubstitutions.set(variableName, value);
    }
    /**
     *
     * @param score The numeric value that we should categorize
     * @param categories The set of all categories to choose from
     * @returns The name of the chosen category, or undefined if we couldn't find an appropriate one
     */
    static categorize(score, categories) {
        var _a;
        if (!categories) {
            return;
        }
        const sortedCategories = categories.sort((a, b) => {
            if (a.lt && b.lt) {
                return a.lt - b.lt;
            }
            else if (a.lt) {
                return -1;
            }
            else if (b.lt) {
                return 1;
            }
            else {
                return 0;
            }
        });
        for (const category of sortedCategories) {
            if (category.lt && score < category.lt) {
                return category.name;
            }
        }
        return (_a = sortedCategories[sortedCategories.length - 1]) === null || _a === void 0 ? void 0 : _a.name;
    }
}
exports.Score = Score;
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
        const result = new Score(this.expression);
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
        for (const op of SUPPORTED_OPERATORS) {
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
