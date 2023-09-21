"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("../feature");
const registry_1 = require("../registry");
class WhitespaceLines extends feature_1.default {
    evaluate() {
        return this.changeset.files.reduce((sum, file) => {
            for (const chunk of file.chunks) {
                for (const change of chunk.changes) {
                    if (change.type == "add") {
                        sum += (change
                            .content
                            .split("\n")
                            // A line containing only a "+" in the diff is a whitespace-only line.
                            .filter((line) => line.trim() == "+")
                            .length);
                    }
                }
            }
            return sum;
        }, 0);
    }
}
exports.default = WhitespaceLines;
registry_1.FeatureRegistry.set(WhitespaceLines.variableName(), WhitespaceLines);
