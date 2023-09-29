import Feature from "./feature"
import Changeset from "./changeset"

/** The collection of features that are available for use in an evaluation formula. */
export const FeatureRegistry: Map<string, FeatureClass> = new Map()

type FeatureClass = new (changeset: Changeset) => Feature

// Actually load all the features so that they register themselves
import * as _RegisteredFeatures from "./features" // eslint-disable-line @typescript-eslint/no-unused-vars
