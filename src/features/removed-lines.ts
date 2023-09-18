import Feature from '../feature'
import { FeatureRegistry } from '../registry'

export default class RemovedLines extends Feature {
  evaluate(): number {
    return this.changeset.files.reduce((sum, f) => sum + f.deletions, 0)
  }
}

FeatureRegistry.set(RemovedLines.variableName(), RemovedLines)
