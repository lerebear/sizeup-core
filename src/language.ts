import * as difflib from 'parse-diff'

export interface Language {
  name: string
  fileExtensions: string[]
  lineCommentStyle: LineCommentStyle
  blockCommentStyle?: BlockCommentStyle
}

interface CommentStyle {
  start: string
}

interface LineCommentStyle {
  start: string
}

interface BlockCommentStyle extends CommentStyle {
  continuation: string
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

export class Linguist {
  static detect(file: difflib.File): Language | undefined {
    const filename = file.to || file.from

    for (const language of SUPPORTED_LANGUAGES) {
      if (language.fileExtensions.filter((ext) => filename!.endsWith(`.${ext}`)).length > 0) {
        return language
      }
    }
  }
}
