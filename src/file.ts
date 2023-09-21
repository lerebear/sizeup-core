import * as difflib from 'parse-diff'
import { Language } from './linguist'

/** The interface for files stored in a Changeset. */
export default interface File extends difflib.File {
  filename: string
  language?: Language
}
