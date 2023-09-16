import Changeset from './changeset'

export default abstract class Feature {
  abstract evaluate(): number
  changeset: Changeset

  constructor(changeset: Changeset) {
    this.changeset = changeset
  }

  id(): string {
    return this.constructor.name.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase()
  }
}
