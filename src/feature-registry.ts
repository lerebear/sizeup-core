import Feature from "./feature"
import Changeset from "./changeset"

import Additions from "./features/additions"
import Comments from "./features/comments"
import Deletions from "./features/deletions"
import SingleWords from "./features/single-words"
import Tests from "./features/tests"
import Whitespace from "./features/whitespace"

type FeatureConstructor = new (changeset: Changeset) => Feature

/** The collection of features that are available for use in an evaluation formula. */
export const FeatureRegistry: Map<string, FeatureConstructor> = new Map(
  [
    [Additions.variableName(), Additions],
    [Comments.variableName(), Comments],
    [Deletions.variableName(), Deletions],
    [SingleWords.variableName(), SingleWords],
    [Tests.variableName(), Tests],
    [Whitespace.variableName(), Whitespace],
  ]
)
