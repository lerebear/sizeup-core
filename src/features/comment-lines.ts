import Feature from '../feature'
import {  Language } from '../linguist'
import * as difflib from 'parse-diff'
import { FeatureRegistry } from '../registry'

export default class CommentLines extends Feature {
  evaluate(): number {
    return this.changeset.files.reduce((sum, file) => {
      for (const chunk of file.chunks) {
        sum += this.countCommentLines(file.language, chunk)
      }
      return sum
    }, 0)
  }

  private countCommentLines(language: Language | undefined, chunk: difflib.Chunk): number {
    if (!language) {
      return 0
    }

    let sum = 0
    let blockCommentLines = 0

    for (const change of chunk.changes) {
      if (["del", "normal"].includes(change.type)) {
        continue
      }

      const line = change.content.substring(1).trimStart()
      if (line.startsWith(language.lineCommentStyle.start)) {
        sum++
        blockCommentLines = 0
      } else if (language.blockCommentStyle && line.startsWith(language.blockCommentStyle.start) && line.endsWith(language.blockCommentStyle.end)) {
        sum++
        blockCommentLines = 0
      } else if (language.blockCommentStyle && line.startsWith(language.blockCommentStyle.start)) {
        blockCommentLines++
      } else if (language.blockCommentStyle && blockCommentLines > 0 && line.startsWith(language.blockCommentStyle.end)) {
        // We must check for block comment end _before_ we check for block comment continuation,
        // because the block comment continuation is frequently a substring of the block comment
        // end (e.g. in languages with C-style comments, "*" is a substring of "*/")
        blockCommentLines++
        sum += blockCommentLines
        blockCommentLines = 0
      } else if (language.blockCommentStyle && blockCommentLines > 0 && line.startsWith(language.blockCommentStyle.continuation)) {
        blockCommentLines++
      } else {
        blockCommentLines = 0
      }
    }

    return sum
  }
}

FeatureRegistry.set(CommentLines.variableName(), CommentLines)
