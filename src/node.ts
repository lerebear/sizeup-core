import Feature from "./feature"
import { Operator, OperatorRegistry } from "./operator-registry"
import { FeatureRegistry } from "./feature-registry"
import { Context } from "./context"

const NUMERIC_CONSTANT_RE = /-?\d+(\.\d+)?/
const ALIAS_RE = /^[\w][\w-]*$/

/**
 * Represents a node in an abstract syntax tree. The tree as a whole is
 * typically identified by an instance of this class that represents the root
 * node.
 */
export abstract class Node {
  /**
   * The string written by the end-user (in a formula or alias configuration)
   * that defines this node.
   *
   */
  token: string

  /**
   * The 1-based index of the token in the formula written by the end-user.
   */
  position: number

  /**
   * The children of this node e.g. the operands of an operator node.
   */
  children: Node[]

  /**
   * Computes the result of the (sub-)expression represented by this node.
   *
   * @param context The current evaluation context
   * @returns The value of the expression represented by this node.
   */
  abstract evaluate(context: Context): number

  /**
   * Constructs an abstract syntax tree from the given expression
   *
   * @param expression The string written by the end-user in a formula e.g. "+ additions deletions"
   * @param context The current evaluation context
   * @returns The root node of the new tree
   */
  static build_ast(expression: string, context: Context): Node {
    const tokens = expression.split(/\s+/)
    const result = Node._build(tokens, 1, context)

    if (tokens.length) {
      throw new Error(
        `Expression "${expression}" contains an unreachable suffix: "${tokens.join(" ")}"`
      )
    }

    return result
  }

  /**
   * @param token A single space-delimited string in an expression
   * @param position The 1-based position of the token in the overall expression
   */
  constructor(token: string, position: number) {
    this.token = token
    this.position = position
    this.children = []
  }

  /**
   * @returns Human-readable representation of the node
   */
  toString(): string {
    return this.token
  }

  private static _build(remainingTokens: string[], position: number, context: Context): Node {
    const token = remainingTokens.shift()

    if (!token) {
      throw new Error(
        "The provided scoring formula is invalid. " +
        "Please check that the formula and any aliases are each valid prefix-notation expressions."
      )
    }

    const node = Node.from(token, position, context)

    if (node instanceof OperatorNode && remainingTokens.length < node.operator.arity) {
      throw new Error(`Not enough operands for operator ${token} at position ${position}`)
    }

    if (node instanceof OperatorNode) {
      for (let i = 0; i < node.operator.arity; i++) {
        node.children.push(Node._build(remainingTokens, position + i + 1, context))
      }
    }

    return node
  }

  private static from(token: string, position: number, context: Context): Node {
    const operator = OperatorRegistry.get(token)

    if (context.aliases?.has(token)) {
      if (FeatureRegistry.has(token)) throw new Error(`Alias must not share a name with a feature: ${token}`)
      if (!token.match(ALIAS_RE)) throw new Error(`Alias does not match ${ALIAS_RE}: ${token}`)
      return new AliasNode(token, position, context.aliases.get(token)!)
    } else if (token.match(NUMERIC_CONSTANT_RE)) {
      return new ConstantNode(token, position, parseFloat(token))
    } else if (FeatureRegistry.has(token)) {
      if (!context.changeset) throw new Error(`A changeset is required to evaluate a Feature`)
      const FeatureConstructor = FeatureRegistry.get(token)!
      return new FeatureNode(token, position, new FeatureConstructor(context.changeset))
    } else if (operator) {
      return new OperatorNode(token, position, operator)
    }

    throw new Error(`Invalid token at position ${position}: ${token}`)
  }
}

/**
 * A node that represents an alias (from the `scoring.aliases` configuration).
 */
class AliasNode extends Node {
  expansion: string

  /**
   *
   * @param token The name of the alias (the left hand side of a key in the `scoring.aliases` configuration)
   * @param position The 1-based position in which the alias appears in the `scoring.formula` configuration
   * @param expansion The value of the alias (the right hand side of a key in the `scoring.aliases` configuration)
   */
  constructor(token: string, position: number, expansion: string) {
    super(token, position)
    this.expansion = expansion
  }

  evaluate(context: Context): number {
    if (context.cache.has(this.token)) return context.cache.get(this.token)!

    const result = Node.build_ast(this.expansion, context).evaluate(context)
    context.cache.set(this.token, result)
    return result
  }
}

/**
 * A node that represents a numeric constant.
 */
export class ConstantNode extends Node {
  value: number

  /**
   *
   * @param token The string that the end-user wrote in a formula or alias
   * @param position The 1-based position in which the constant appears in the `scoring.formula` configuration
   * @param value The numeric value of the constant
   */
  constructor(token: string, position: number, value: number) {
    super(token, position)
    this.value = value
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  evaluate(context: Context): number {
    return this.value
  }
}

/**
 * A node that represents a feature to evaluate on the diff.
 */
class FeatureNode extends Node {
  feature: Feature

  /**
   *
   * @param token The name of the feature
   * @param position The 1-based position in which the feature appears in the `scoring.formula` configuration
   * @param feature An instance of the class that implements the relevant feature
   */
  constructor(token: string, position: number, feature: Feature) {
    super(token, position)
    this.feature = feature
  }

  evaluate(context: Context): number {
    if (context.cache.has(this.token)) return context.cache.get(this.token)!

    const result = this.feature.evaluate()
    context.cache.set(this.token, result)
    return result
  }
}

/**
 * A node that represents an operator.
 */
class OperatorNode extends Node {
  operator: Operator

  /**
   *
   * @param token The symbol that represents the operator
   * @param position The 1-based position of the operator in the `scoring.formula` configuration
   * @param operator An instance of the class that implements the operator
   */
  constructor(token: string, position: number, operator: Operator) {
    super(token, position)
    this.operator = operator
  }

  evaluate(context: Context): number {
    return this.operator.apply(context, ...this.children)
  }

  toString(): string {
    return [this.token, ...this.children.map((c) => c.toString())].join(" ")
  }
}
