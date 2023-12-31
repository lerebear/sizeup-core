/** Returned when we encounter an invalid formula. */
export interface ParsingError {
  /** An error message. */
  message: string
  /** The 1-based index of the whitespace-separated token where we encountered the error. */
  tokenPosition: number
}
