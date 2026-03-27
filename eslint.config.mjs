import { defineConfig, globalIgnores } from "eslint/config";

import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import path from "node:path";
import tsParser from "@typescript-eslint/parser";
import typescriptEslint from "@typescript-eslint/eslint-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
    globalIgnores(["**/dist", "**/node_modules"]),
    {
        extends: compat.extends(
            "eslint:recommended",
            "plugin:@typescript-eslint/eslint-recommended",
            "plugin:@typescript-eslint/recommended",
        ),

        plugins: {
            "@typescript-eslint": typescriptEslint,
        },

        languageOptions: {
            parser: tsParser,
        },
    },
    {

        files: ["test/*.test.ts"],
        rules: {
            "@typescript-eslint/no-unused-expressions": "off"
        }
    }
]);
