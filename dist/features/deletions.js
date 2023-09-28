"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("../feature");
const registry_1 = require("../registry");
class Deletions extends feature_1.default {
    evaluate() {
        return this.changeset.files.reduce((sum, f) => sum + f.deletions, 0);
    }
}
exports.default = Deletions;
registry_1.FeatureRegistry.set(Deletions.variableName(), Deletions);
