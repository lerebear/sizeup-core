"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const changeset_1 = require("./changeset");
const formula_1 = require("./formula");
const YAML = require("yaml");
const fs = require("fs");
const default_1 = require("./config/default");
const GITHUB_PULL_REQUEST_URL_RE = /https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/;
class SizeUp {
    /**
     * Evaluates some code (identified either by diff or a pull request URL) for reviewability.
     *
     * @param diff_or_url Either a diff or a GitHub pull request URL denoting the code to evaluate.
     * @param client Authenticated Octokit client that we should use to communicate with the GitHub
     *   API. This must be provided if a URL is passed via the `diff_or_url` parameter.
     * @param configFile Path to a configuration file containing options for how to evaluate the pull
     *   request.
     */
    static async evaluate(diff_or_url, client, configFile) {
        var _a;
        const wasGivenUrl = diff_or_url.match(GITHUB_PULL_REQUEST_URL_RE);
        if (!client && wasGivenUrl) {
            throw new Error("`client` parameter must be provided with a URL");
        }
        const config = configFile ? YAML.parse(fs.readFileSync(configFile, "utf8")) : {};
        const defaultConfig = default_1.DefaultConfiguration;
        const ignored = config.ignored || defaultConfig.ignored;
        const expression = ((_a = config.scoring) === null || _a === void 0 ? void 0 : _a.formula) || defaultConfig.scoring.formula;
        const categories = config.categories || defaultConfig.categories;
        let changeset;
        if (client && wasGivenUrl) {
            changeset = await changeset_1.default.fetch(diff_or_url, ignored, client);
        }
        else {
            changeset = new changeset_1.default(diff_or_url, ignored);
        }
        const formula = new formula_1.Formula(expression);
        return formula.evaluate(changeset, categories);
    }
}
exports.default = SizeUp;
