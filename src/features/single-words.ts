import Feature from '../feature'

export default class SingleWords extends Feature {
  evaluate(): number {
    return this.changeset.files.reduce((sum, file) => {
      for (const chunk of file.chunks) {
        for (const change of chunk.changes) {
          if (change.type == "add") {
            sum += (
              change
                .content
                .split("\n")
                .filter((line) => line.trim().match(/^\+\s*(["'`]?)\b[\w-]+\b\1\S?$/))
                .length
            )
          }
        }
      }
      return sum
    }, 0)
  }
}
