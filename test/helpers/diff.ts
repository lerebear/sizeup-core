import * as fs from "fs"

export function loadFixture(name: string): string {
  return fs.readFileSync(`test/fixtures/diffs/${name}.diff`, "utf8")
}

export function loadPythonStyleCommentFixture(extension: string): string {
  return fs.readFileSync(`test/fixtures/diffs/python-style-comment.diff`, "utf8").replace(/lorem\.ext/g, `lorem.${extension}`)
}


export function loadCStyleCommentFixture(extension: string): string {
  return fs.readFileSync(`test/fixtures/diffs/c-style-comment.diff`, "utf8").replace(/lorem\.ext/g, `lorem.${extension}`)
}
