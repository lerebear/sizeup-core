import Feature from "./feature"
import Changeset from "./changeset"

type FeatureClass = new (changeset: Changeset) => Feature
export const FeatureRegistry: Map<string, FeatureClass> = new Map()
