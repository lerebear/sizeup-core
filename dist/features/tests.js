"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("../feature");
const registry_1 = require("../registry");
class Tests extends feature_1.default {
    evaluate() {
        return this.changeset.files.reduce((sum, f) => sum + (f.isTestFile ? f.additions : 0), 0);
    }
}
exports.default = Tests;
registry_1.FeatureRegistry.set(Tests.variableName(), Tests);
