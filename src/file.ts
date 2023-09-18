import * as difflib from 'parse-diff'
import { Language } from './linguist'

export default interface File extends difflib.File {
  filename: string
  language?: Language
}
