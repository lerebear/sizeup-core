import * as fs from "fs"
import { CommentStyleFamily } from "../../src/linguist"

export function loadFixture(name: string): string {
  return fs.readFileSync(`test/fixtures/diffs/${name}.diff`, "utf8")
}

export function loadCommentFixture(style: CommentStyleFamily, extension: string) {
  return fs.readFileSync(`test/fixtures/diffs/${style.toString().toLowerCase()}-style-comment.diff`, "utf8").replace(/lorem\.ext/g, `lorem.${extension}`)

}
