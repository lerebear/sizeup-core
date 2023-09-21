"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("../feature");
const registry_1 = require("../registry");
class AddedLines extends feature_1.default {
    evaluate() {
        return this.changeset.files.reduce((sum, f) => sum + f.additions, 0);
    }
}
exports.default = AddedLines;
registry_1.FeatureRegistry.set(AddedLines.variableName(), AddedLines);
