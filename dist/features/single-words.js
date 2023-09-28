"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feature_1 = require("../feature");
const registry_1 = require("../registry");
class SingleWords extends feature_1.default {
    evaluate() {
        return this.changeset.files.reduce((sum, file) => {
            for (const chunk of file.chunks) {
                for (const change of chunk.changes) {
                    if (change.type == "add") {
                        sum += (change
                            .content
                            .split("\n")
                            .filter((line) => line.trim().match(/^\+\s*["'`,\w-]+\s*$/))
                            .length);
                    }
                }
            }
            return sum;
        }, 0);
    }
}
exports.default = SingleWords;
registry_1.FeatureRegistry.set(SingleWords.variableName(), SingleWords);
