import Feature from '../feature'

export default class Deletions extends Feature {
  evaluate(): number {
    return this.changeset.files.reduce((sum, f) => sum + f.deletions, 0)
  }
}
