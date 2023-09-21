/** A utility class for language-specific behaviour. */
export declare class Linguist {
    /** Tries to match the given filename to a supported language based on its file extension. */
    static detect(filename: string): Language | undefined;
}
/** Represents a programming language. */
export interface Language {
    /** The name of the programming language. */
    name: string;
    /** The extensions used by files written in the language. */
    fileExtensions: string[];
    /** The style used for single-line comments. */
    lineCommentStyle: LineCommentStyle;
    /** The style used for multi-line comments. */
    blockCommentStyle?: BlockCommentStyle;
}
/** Identifies the characters used to denote comments in a language. */
interface CommentStyle {
    /** The characters used to mark the start of a comment. */
    start: string;
}
/** Describes single-line comments in a programming language. */
interface LineCommentStyle {
    start: string;
}
/** Describes multi-line comments in a programming language. */
interface BlockCommentStyle extends CommentStyle {
    /** The characters used to extend a comment over several lines. */
    continuation: string;
    /** The characters used to mark the end of a multi-line comment. */
    end: string;
}
export {};
