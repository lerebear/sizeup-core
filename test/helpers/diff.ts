import * as fs from "fs"

export function loadFixture(name: string): string {
  return fs.readFileSync(`test/fixtures/diffs/${name}.diff`, "utf8")
}
