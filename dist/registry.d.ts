import Feature from "./feature";
import Changeset from "./changeset";
/** The collection of features that are available for use in an evaluation formula. */
export declare const FeatureRegistry: Map<string, FeatureClass>;
type FeatureClass = new (changeset: Changeset) => Feature;
export {};
