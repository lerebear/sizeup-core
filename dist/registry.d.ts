import Feature from "./feature";
import Changeset from "./changeset";
type FeatureClass = new (changeset: Changeset) => Feature;
export declare const FeatureRegistry: Map<string, FeatureClass>;
export {};
