import { MenuItem } from '@/types/menu';
import { tokenize, normalize } from './normalizer';
import { findBestMatch, levenshteinDistance } from './levenshtein';
import { SYNONYMS, SPELLING_CORRECTIONS } from './synonyms';
import { Phonetics } from './phonetics';

export class VocabularyService {
  private vocabulary: Set<string> = new Set();
  private readonly RELEVANCE_THRESHOLD = 0.3; // 30% of tokens must match

  /**
   * Build vocabulary from menu items
   */
  buildVocabulary(menuItems: MenuItem[]): void {
    this.vocabulary.clear();

    menuItems.forEach(item => {
      this.addTokens(item.name);
      if (item.description) {
        this.addTokens(item.description);
      }
      this.addTokens(item.category);
    });

    this.addCommonKeywords();
    console.log(`✅ Vocabulary built: ${this.vocabulary.size} unique terms`);
  }

  /**
   * Find the best correction for a possibly misspelled word
   * Uses Hybrid Strategy: Levenshtein + Phonetics
   */
  getSuggestedCorrection(word: string): string | null {
    const normalized = normalize(word);
    
    // 1. Check known static corrections first (fastest)
    if (SPELLING_CORRECTIONS[normalized]) {
      return SPELLING_CORRECTIONS[normalized];
    }
    
    // 2. Check strict vocabulary match
    if (this.vocabulary.has(normalized)) {
      return normalized;
    }
    
    // 3. Dynamic Search in Vocabulary
    let bestMatch: string | null = null;
    let minDistance = Infinity;
    const wordPhonetic = Phonetics.getPhoneticCode(normalized);
    
    // Iterate vocabulary (fast enough for <5000 terms)
    for (const vocabWord of this.vocabulary) {
      // Opt: Skip words with very different lengths
      if (Math.abs(vocabWord.length - normalized.length) > 3) continue;
      
      // A. Check Edit Distance
      const dist = levenshteinDistance(normalized, vocabWord);
      
      // Threshold depends on word length
      // Short words (<=4) need strict match (dist 1)
      // Long words (>4) can be looser (dist 2)
      const threshold = normalized.length <= 4 ? 1 : 2;

      // OPTIMIZATION: First Phonetic Character MUST Match for any fuzzy logic
      // This prevents "Friend" (F) matching "Dried" (D) or "Kutta" (K) matching "Latte" (L)
      // Exception: Very short words where edit distance is 1 (e.g. "x" -> "y" typo)
      if (normalized.length > 3) {
          const wP = wordPhonetic.charAt(0);
          const vP = Phonetics.getPhoneticCode(vocabWord).charAt(0);
          if (wP !== vP) continue;
      }
      
      // 0. Strict Match
      if (dist <= 1) {
        if (dist < minDistance) {
          minDistance = dist;
          bestMatch = vocabWord;
        }
      }
      // 1. Loose Match (requires Phonetic backup)
      else if (dist <= threshold) { 
         // Check if they sound similar enough (Phonetic Edit Distance <= 1)
         const vocabPhonetic = Phonetics.getPhoneticCode(vocabWord);
         const phoneticDist = levenshteinDistance(wordPhonetic, vocabPhonetic);
         
         if (phoneticDist <= 1) {
           if (dist < minDistance) {
            minDistance = dist;
            bestMatch = vocabWord;
           }
         }
      }
      
      // 2. Fallback: Pure Phonetic Match (for very bad typos)
      // "capachino" (dist 3) -> "cappuccino"
      else if (dist <= 4) {
         const vocabPhonetic = Phonetics.getPhoneticCode(vocabWord);
         if (vocabPhonetic === wordPhonetic && vocabPhonetic.length > 2) {
           // Only accept if very strong phonetic match
           bestMatch = vocabWord;
           // Break immediately on strong phonetic match
           break;
         }
      }
    }
    
    return bestMatch;
  }

  /**
   * Add tokens from text to vocabulary
   */
  private addTokens(text: string): void {
    const tokens = tokenize(text, false);
    tokens.forEach(token => {
      if (token.length > 1) { // Ignore single characters
        this.vocabulary.add(token.toLowerCase());
      }
    });
  }

  /**
   * Add common coffee/menu-related keywords
   */
  private addCommonKeywords(): void {
    const keywords = [
      'coffee', 'latte', 'espresso', 'americano', 'cappuccino',
      'mocha', 'macchiato', 'frappe', 'affogato',
      'hot', 'cold', 'iced', 'warm', 'chilled',
      'brew', 'manual', 'cold brew', 'pour over', 'v60',
      'robusta', 'blend', 'peaberry',
      'milk', 'cream', 'black', 'non', 'without',
      'caramel', 'vanilla', 'hazelnut', 'chocolate', 'biscoff',
      'nutella', 'pesto',
      'tea', 'shake', 'tonic', 'fizz',
      'food', 'fries', 'nuggets', 'wedges', 'pizza',
      'bagel', 'croissant', 'pastry',
      'special', 'signature', 'premium', 'classic',
    ];

    keywords.forEach(keyword => {
      this.vocabulary.add(normalize(keyword));
    });

    Object.values(SYNONYMS).forEach(synonymList => {
      synonymList.forEach(synonym => {
        tokenize(synonym, false).forEach(token => {
          if (token.length > 1) {
            this.vocabulary.add(token);
          }
        });
      });
    });

    Object.values(SPELLING_CORRECTIONS).forEach(corrected => {
      this.addTokens(corrected);
    });
  }

  /**
   * Check if query is relevant to menu
   */
  isRelevant(query: string): boolean {
    if (!query || query.trim().length === 0) return false;

    const tokens = tokenize(query, false);
    if (tokens.length === 0) return false;

    let matchCount = 0;
    let irrelevantCount = 0;
    
    tokens.forEach(token => {
      if (this.isTokenRelevant(token)) {
        matchCount++;
      } else {
        const correction = this.getSuggestedCorrection(token);
        if (correction) {
          matchCount++;
        } else {
          irrelevantCount++;
        }
      }
    });

    if (irrelevantCount > 0 && tokens.length > 1) {
      console.log(`❌ Rejecting "${query}" - contains irrelevant words`);
      return false;
    }

    const relevanceScore = matchCount / tokens.length;
    return relevanceScore >= this.RELEVANCE_THRESHOLD;
  }

  /**
   * Check if a single token is relevant
   */
  private isTokenRelevant(token: string): boolean {
    const normalized = normalize(token);
    
    // 0. Short circuit
    if (normalized.length < 2) return false;

    // 1. Exact & Corrections
    if (this.vocabulary.has(normalized)) return true;
    if (SPELLING_CORRECTIONS[normalized]) return true;
    
    // 2. Prefix Match (must be 3+ chars)
    // "fri" -> "fries" (OK)
    if (normalized.length >= 3) {
      for (const word of this.vocabulary) {
        if (word.startsWith(normalized)) return true;
      }
    }
    
    // 3. Dynamic Correction
    // Only allow if we find a GOOD correction
    const correction = this.getSuggestedCorrection(normalized);
    return correction !== null;
  }

  getVocabularySize(): number {
    return this.vocabulary.size;
  }

  getVocabulary(): string[] {
    return Array.from(this.vocabulary).sort();
  }
}

// Singleton instance
export const vocabularyService = new VocabularyService();
