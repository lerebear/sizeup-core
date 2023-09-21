"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("../feature");
const registry_1 = require("../registry");
class RemovedLines extends feature_1.default {
    evaluate() {
        return this.changeset.files.reduce((sum, f) => sum + f.deletions, 0);
    }
}
exports.default = RemovedLines;
registry_1.FeatureRegistry.set(RemovedLines.variableName(), RemovedLines);
