"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const changeset_1 = require("./changeset");
const formula_1 = require("./formula");
const YAML = require("yaml");
const fs = require("fs");
const default_1 = require("./config/default");
class SizeUp {
    /**
     * Evaluates a diff for reviewability.
     *
     * @param diff A .diff formatted string containing the code to evaluate
     * @param client Authenticated Octokit client that we should use to communicate with the GitHub
     *   API. This must be provided if a URL is passed via the `diff_or_url` parameter.
     * @param configFile Path to a configuration file containing options for how to evaluate the pull
     *   request.
     */
    static async evaluate(diff, configFile) {
        var _a;
        const config = configFile ? YAML.parse(fs.readFileSync(configFile, "utf8")) : {};
        const defaultConfig = default_1.DefaultConfiguration;
        const ignored = config.ignored || defaultConfig.ignored;
        const tests = config.tests || defaultConfig.tests;
        const expression = ((_a = config.scoring) === null || _a === void 0 ? void 0 : _a.formula) || defaultConfig.scoring.formula;
        const categories = config.categories || defaultConfig.categories;
        const changeset = new changeset_1.default(diff, ignored, tests);
        const formula = new formula_1.Formula(expression);
        return formula.evaluate(changeset, categories);
    }
}
exports.default = SizeUp;
