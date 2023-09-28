import Feature from '../feature'
import { FeatureRegistry } from '../registry'

export default class TestLines extends Feature {
  evaluate(): number {
    return this.changeset.files.reduce((sum, f) => sum + (f.isTestFile ? f.additions : 0), 0)
  }
}

FeatureRegistry.set(TestLines.variableName(), TestLines)
