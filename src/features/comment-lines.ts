import Feature from '../feature'
import File from '../file'
import { FeatureRegistry } from '../registry'

export default class CommentLines extends Feature {
  evaluate(): number {
    return this.changeset.files.reduce((sum, file) => sum + this.countCommentLines(file), 0)
  }

  private countCommentLines(file: File): number {
    if (!file.language) {
      return 0
    }

    let sum = 0

    for (const chunk of file.chunks) {

      let blockCommentLines = 0

      for (const change of chunk.changes) {
        if (["del", "normal"].includes(change.type)) {
          continue
        }

        const line = change.content.substring(1).trimStart()
        if (line.startsWith(file.language.lineCommentStyle.start)) {
          sum++
          blockCommentLines = 0
        } else if (file.language.blockCommentStyle && line.startsWith(file.language.blockCommentStyle.start) && line.endsWith(file.language.blockCommentStyle.end)) {
          sum++
          blockCommentLines = 0
        } else if (file.language.blockCommentStyle && line.startsWith(file.language.blockCommentStyle.start)) {
          blockCommentLines++
        } else if (file.language.blockCommentStyle && blockCommentLines > 0 && line.startsWith(file.language.blockCommentStyle.end)) {
          // We must check for block comment end _before_ we check for block comment continuation,
          // because the block comment continuation is frequently a substring of the block comment
          // end (e.g. in languages with C-style comments, "*" is a substring of "*/")
          blockCommentLines++
          sum += blockCommentLines
          blockCommentLines = 0
        } else if (file.language.blockCommentStyle && blockCommentLines > 0 && line.startsWith(file.language.blockCommentStyle.continuation)) {
          blockCommentLines++
        } else {
          blockCommentLines = 0
        }
      }
    }

    return sum
  }
}

FeatureRegistry.set(CommentLines.variableName(), CommentLines)
