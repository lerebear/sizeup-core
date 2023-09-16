import Feature from '../feature'

export default class AddedLines extends Feature {
  evaluate(): number {
    return this.changeset.files.reduce((sum, f) => sum + f.additions, 0)
  }
}
