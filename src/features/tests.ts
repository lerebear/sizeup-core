import Feature from '../feature'

export default class Tests extends Feature {
  evaluate(): number {
    return this.changeset.files.reduce((sum, f) => sum + (f.isTestFile ? f.additions + f.deletions : 0), 0)
  }
}
