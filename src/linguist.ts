/** A utility class for language-specific behaviour. */
export class Linguist {
  /** Tries to match the given filename to a supported language based on its file extension. */
  static detect(filename: string): Language | undefined {
    for (const language of SUPPORTED_LANGUAGES) {
      if (language.fileExtensions.filter((ext) => filename!.endsWith(`.${ext}`)).length > 0) {
        return language
      }
    }
  }
}

/** Represents a programming language. */
export interface Language {
  /** The name of the programming language. */
  name: string
  /** The extensions used by files written in the language. */
  fileExtensions: string[]
  /** The style used for single-line comments. */
  lineCommentStyle: LineCommentStyle
  /** The style used for multi-line comments. */
  blockCommentStyle?: BlockCommentStyle
}

/** Identifies the characters used to denote comments in a language. */
interface CommentStyle {
  /** The characters used to mark the start of a comment. */
  start: string
}

/** Describes single-line comments in a programming language. */
interface LineCommentStyle {
  start: string
}

/** Describes multi-line comments in a programming language. */
interface BlockCommentStyle extends CommentStyle {
  /** The characters used to extend a comment over several lines. */
  continuation: string
  /** The characters used to mark the end of a multi-line comment. */
  end: string
}

const Ruby: Language = {
  name: "Ruby",
  fileExtensions: ["rb"],
  lineCommentStyle: { start: "#" }
}

const TypeScript: Language = {
  name: "TypeScript",
  fileExtensions: ["ts", "tsx"],
  lineCommentStyle: { start: "//" },
  blockCommentStyle: { start: "/*", continuation: "*", end: "*/"}
}

const JavaScript: Language = {
  name: "JavaScript",
  fileExtensions: ["js", "jsx"],
  lineCommentStyle: { start: "//" },
  blockCommentStyle: { start: "/*", continuation: "*", end: "*/"},
}

const SUPPORTED_LANGUAGES: Language[] = [
  Ruby,
  TypeScript,
  JavaScript,
];
