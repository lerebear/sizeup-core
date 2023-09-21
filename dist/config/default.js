"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultConfiguration = void 0;
exports.DefaultConfiguration = {
    categories: [
        {
            name: "xs",
            lt: 10,
        },
        {
            name: "s",
            lt: 30,
        },
        {
            name: "m",
            lt: 100,
        },
        {
            name: "l",
            lt: 500,
        },
        {
            name: "xl",
        },
    ],
    ignored: [
        "*.rbi",
        "CODEOWNERS",
        "SERVICEOWNERS"
    ],
    scoring: {
        formula: "- - + added-lines removed-lines comment-lines whitespace-lines"
    }
};
