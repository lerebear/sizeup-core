import Feature from '../feature'
import { FeatureRegistry } from '../registry'

export default class Additions extends Feature {
  evaluate(): number {
    return this.changeset.files.reduce((sum, f) => sum + f.additions, 0)
  }
}

FeatureRegistry.set(Additions.variableName(), Additions)
