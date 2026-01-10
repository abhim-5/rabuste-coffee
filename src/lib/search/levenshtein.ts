/**
 * Levenshtein Distance Algorithm
 * Calculates character-level edit distance for typo tolerance
 */

/**
 * Calculate Levenshtein distance between two strings
 * Returns the minimum number of edits (insertions, deletions, substitutions) needed
 * 
 * @param a - First string
 * @param b - Second string
 * @returns Edit distance (0 = identical, higher = more different)
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  // Initialize first column (0, 1, 2, 3, ...)
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // Initialize first row (0, 1, 2, 3, ...)
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        // Characters match, no edit needed
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        // Characters don't match, take minimum of:
        // - Substitution: matrix[i-1][j-1] + 1
        // - Insertion: matrix[i][j-1] + 1
        // - Deletion: matrix[i-1][j] + 1
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Find the best match for a word from a list of candidates
 * Returns null if no match within maxDistance
 * 
 * @param word - Word to match
 * @param candidates - List of candidate words
 * @param maxDistance - Maximum acceptable edit distance (default: 2)
 * @returns Best matching word or null
 */
export function findBestMatch(
  word: string,
  candidates: string[],
  maxDistance: number = 2
): string | null {
  let bestMatch: string | null = null;
  let bestDistance = maxDistance + 1;

  for (const candidate of candidates) {
    const distance = levenshteinDistance(word.toLowerCase(), candidate.toLowerCase());
    
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = candidate;
    }
  }

  return bestDistance <= maxDistance ? bestMatch : null;
}

/**
 * Check if two strings are similar within a threshold
 * 
 * @param a - First string
 * @param b - Second string
 * @param maxDistance - Maximum acceptable edit distance (default: 2)
 * @returns true if strings are similar
 */
export function isSimilar(a: string, b: string, maxDistance: number = 2): boolean {
  return levenshteinDistance(a.toLowerCase(), b.toLowerCase()) <= maxDistance;
}

/**
 * Calculate similarity score (0-1) between two strings
 * 1.0 = identical, 0.0 = completely different
 * 
 * @param a - First string
 * @param b - Second string
 * @returns Similarity score between 0 and 1
 */
export function similarityScore(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1.0;
  
  const distance = levenshteinDistance(a.toLowerCase(), b.toLowerCase());
  return 1.0 - (distance / maxLen);
}
