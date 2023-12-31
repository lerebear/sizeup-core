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
  lineCommentStyle?: LineCommentStyle
  /** The style used for multi-line comments. */
  blockCommentStyle?: BlockCommentStyle
}

/** Identifies the characters used to denote comments in a language. */
interface CommentStyle {
  /** The characters used to mark the start of a comment. */
  start: string
}

/** Describes single-line comments in a programming language. */
interface LineCommentStyle extends CommentStyle {
  start: string
}

/** Describes multi-line comments in a programming language. */
interface BlockCommentStyle extends CommentStyle {
  /** The characters used to extend a comment over several lines. */
  continuation: string
  /** The characters used to mark the end of a multi-line comment. */
  end: string
}

export enum CommentStyleFamily {
  C = "c",
  HTML = "html",
  Python = "python",
}

const cStyleComments = {
  lineCommentStyle: { start: "//" },
  blockCommentStyle: { start: "/*", continuation: "*", end: "*/"},
}

const htmlStyleComments = {
  blockCommentStyle: { start: "<!--", continuation: "", end: "-->"},
}

const pythonStyleComments = {
  lineCommentStyle: { start: "#" },
}

export const CSharp: Language = {
  name: "C#",
  fileExtensions: ["cs", "csx"],
  ...cStyleComments,
}

export const Go: Language = {
  name: "Go",
  fileExtensions: ["go"],
  ...cStyleComments,
}

export const HTML: Language = {
  name: "HTML",
  fileExtensions: ["htm", "html"],
  ...htmlStyleComments,
}

export const Java: Language = {
  name: "Java",
  fileExtensions: ["java"],
  ...cStyleComments,
}

export const JavaScript: Language = {
  name: "JavaScript",
  fileExtensions: ["js", "jsx"],
  ...cStyleComments,
}

export const Kotlin: Language = {
  name: "Kotlin",
  fileExtensions: ["kt", "kts"],
  ...cStyleComments,
}

export const Python: Language = {
  name: "Python",
  fileExtensions: ["py"],
  ...pythonStyleComments,
}

export const Ruby: Language = {
  name: "Ruby",
  fileExtensions: ["rb"],
  ...pythonStyleComments,
}

export const Rust: Language = {
  name: "Rust",
  fileExtensions: ["rs"],
  ...cStyleComments,
}

export const Strings: Language = {
  name: "Strings",
  fileExtensions: ["strings"],
  ...cStyleComments,
}

export const StringsDict: Language = {
  name: "StringsDict",
  fileExtensions: ["stringsdict"],
  ...htmlStyleComments,
}

export const Swift: Language = {
  name: "Swift",
  fileExtensions: ["swift"],
  ...cStyleComments,
}

export const TypeScript: Language = {
  name: "TypeScript",
  fileExtensions: ["ts", "tsx"],
  ...cStyleComments,
}

export const XML: Language = {
  name: "XML",
  fileExtensions: ["xml"],
  ...htmlStyleComments,
}

export const YAML: Language = {
  name: "YAML",
  fileExtensions: ["yml", "yaml"],
  ...pythonStyleComments,
}


export const SUPPORTED_LANGUAGES: Language[] = [
  CSharp,
  Go,
  HTML,
  Java,
  JavaScript,
  Kotlin,
  Python,
  Ruby,
  Rust,
  Strings,
  StringsDict,
  Swift,
  TypeScript,
  XML,
  YAML,
];
