import Hypher from 'hypher';
import englishPatterns from 'hyphenation.en-us';

const hypher = new Hypher(englishPatterns);
const LATIN_WORD = /[A-Za-z][A-Za-z'-]*/g;

/**
 * Inserts soft hyphens (U+00AD) at English hyphenation points so that
 * mid-word line breaks render a visible hyphen. Chromium on Windows does
 * not support `hyphens: auto`, so this is done at build time instead.
 */
export function hyphenateText(value: string): string {
  return value.replace(LATIN_WORD, (word) => (word.length > 6 ? hypher.hyphenateText(word) : word));
}
