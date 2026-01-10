/**
 * Phonetic Matching Utilities
 * Implements simplified Double Metaphone-like algorithm for "sounds like" matching
 * Perfect for correcting "capachino" -> "cappuccino"
 */

export class Phonetics {
  /**
   * Calculate phonetic code for a word
   * This is a simplified version of Metaphone optimized for menu items
   */
  static getPhoneticCode(word: string): string {
    let code = word.toUpperCase();
    
    // 1. Remove non-alpha
    code = code.replace(/[^A-Z]/g, '');
    
    if (code.length === 0) return '';
    
    // 2. Handle specific starts
    if (code.startsWith('KN') || code.startsWith('GN') || code.startsWith('PN') || code.startsWith('AE') || code.startsWith('WR')) {
      code = code.substring(1);
    }
    
    // 3. Handle specific endings
    if (code.endsWith('MB')) {
      code = code.substring(0, code.length - 1);
    }
    
    // 4. Transformations (Order matters!)
    
    // SCH -> SK (School)
    code = code.replace(/SCH/g, 'SK');
    
    // C handling
    code = code.replace(/CIA/g, 'XA'); // Special case
    code = code.replace(/CH/g, 'X');   // Ch sounds like X (Lochness) or Tch (Chicken) -> X is good proxy
    code = code.replace(/CI/g, 'S');
    code = code.replace(/CE/g, 'S');
    code = code.replace(/CK/g, 'K');
    code = code.replace(/C/g, 'K');
    
    // PH -> F
    code = code.replace(/PH/g, 'F');
    
    // Q -> K
    code = code.replace(/Q/g, 'K');
    
    // X -> KS
    code = code.replace(/X/g, 'KS');
    
    // V -> F (Similar sound)
    code = code.replace(/V/g, 'F');
    
    // Z -> S
    code = code.replace(/Z/g, 'S');
    
    // Double letters -> Single
    code = code.replace(/([A-Z])\1+/g, '$1');
    
    // Remove vowels unless it's the first letter (simplified Soundex rule)
    const firstChar = code.charAt(0);
    const rest = code.substring(1).replace(/[AEIOUY]/g, '');
    
    return firstChar + rest;
  }

  /**
   * Check if two words sound similar
   */
  static soundsSimilar(word1: string, word2: string): boolean {
    const code1 = this.getPhoneticCode(word1);
    const code2 = this.getPhoneticCode(word2);
    
    // Exact phonetic match
    if (code1 === code2) return true;
    
    // Contains match (for longer codes)
    if (code1.length > 3 && code2.length > 3) {
      return code1.includes(code2) || code2.includes(code1);
    }
    
    return false;
  }
}
