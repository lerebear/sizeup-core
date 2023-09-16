import Feature from '../feature'

export default class RemovedLines extends Feature {
  evaluate(): number {
    return this.changeset.files.reduce((sum, f) => sum + f.deletions, 0)
  }
}
