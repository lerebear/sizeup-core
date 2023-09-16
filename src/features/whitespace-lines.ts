import Feature from '../feature'

export default class WhitespaceLines extends Feature {
  evaluate(): number {
    return this.changeset.files.reduce((sum, file) => {
      for (const chunk of file.chunks) {
        for (const change of chunk.changes) {
          if (change.type == "add") {
            sum += (
              change
                .content
                .split("\n")
                // A line containing only a "+" in the diff is a whitespace-only line.
                .filter((line) => line.trim() == "+")
                .length
            )
          }
        }
      }
      return sum
    }, 0)
  }
}
