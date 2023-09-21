"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Linguist = void 0;
/** A utility class for language-specific behaviour. */
class Linguist {
    /** Tries to match the given filename to a supported language based on its file extension. */
    static detect(filename) {
        for (const language of SUPPORTED_LANGUAGES) {
            if (language.fileExtensions.filter((ext) => filename.endsWith(`.${ext}`)).length > 0) {
                return language;
            }
        }
    }
}
exports.Linguist = Linguist;
const Ruby = {
    name: "Ruby",
    fileExtensions: ["rb"],
    lineCommentStyle: { start: "#" }
};
const TypeScript = {
    name: "TypeScript",
    fileExtensions: ["ts", "tsx"],
    lineCommentStyle: { start: "//" },
    blockCommentStyle: { start: "/*", continuation: "*", end: "*/" }
};
const JavaScript = {
    name: "JavaScript",
    fileExtensions: ["js", "jsx"],
    lineCommentStyle: { start: "//" },
    blockCommentStyle: { start: "/*", continuation: "*", end: "*/" },
};
const SUPPORTED_LANGUAGES = [
    Ruby,
    TypeScript,
    JavaScript,
];
