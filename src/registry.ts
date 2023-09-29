import Feature from "./feature"
import Changeset from "./changeset"

import Additions from "./features/additions"
import Comments from "./features/comments"
import Deletions from "./features/deletions"
import SingleWords from "./features/single-words"
import Tests from "./features/tests"
import Whitespace from "./features/whitespace"

type FeatureClass = new (changeset: Changeset) => Feature

/** The collection of features that are available for use in an evaluation formula. */
export const FeatureRegistry: Map<string, FeatureClass> = new Map()

FeatureRegistry.set(Additions.variableName(), Additions)
FeatureRegistry.set(Comments.variableName(), Comments)
FeatureRegistry.set(Deletions.variableName(), Deletions)
FeatureRegistry.set(SingleWords.variableName(), SingleWords)
FeatureRegistry.set(Tests.variableName(), Tests)
FeatureRegistry.set(Whitespace.variableName(), Whitespace)
