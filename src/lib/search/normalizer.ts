/**
 * Text Normalization Utilities
 * Cleans and standardizes search queries for better matching
 */

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'with', 'without', 'and', 'or', 'of', 'in', 'on', 'at'
]);

/**
 * Normalize text for search
 * - Converts to lowercase
 * - Removes punctuation
 * - Collapses spaces
 * - Trims whitespace
 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' '); // Collapse multiple spaces
}

/**
 * Tokenize text into words
 * - Splits on whitespace
 * - Filters empty strings
 * - Optionally removes stop words
 */
export function tokenize(text: string, removeStopWords: boolean = false): string[] {
  const tokens = normalize(text)
    .split(/\s+/)
    .filter(token => token.length > 0);

  if (removeStopWords) {
    return tokens.filter(token => !STOP_WORDS.has(token));
  }

  return tokens;
}

/**
 * Check if a word is a stop word
 */
export function isStopWord(word: string): boolean {
  return STOP_WORDS.has(word.toLowerCase());
}

/**
 * Remove stop words from a text string
 */
export function removeStopWords(text: string): string {
  const tokens = tokenize(text, false);
  return tokens.filter(token => !STOP_WORDS.has(token)).join(' ');
}

/**
 * Create n-grams from text for partial matching
 * Example: "latte" → ["lat", "att", "tte", "la", "at", "tt", "te"]
 */
export function generateNGrams(text: string, minSize: number = 2, maxSize: number = 3): string[] {
  const normalized = normalize(text);
  const ngrams: string[] = [];

  for (let size = minSize; size <= maxSize; size++) {
    for (let i = 0; i <= normalized.length - size; i++) {
      ngrams.push(normalized.substring(i, i + size));
    }
  }

  return ngrams;
}
