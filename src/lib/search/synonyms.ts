/**
 * Synonym and Spelling Correction Mappings
 * Maps common misspellings and synonyms to correct terms
 */

/**
 * Common misspellings mapped to correct spelling
 */
export const SPELLING_CORRECTIONS: Record<string, string> = {
  // Coffee misspellings
  'cofee': 'coffee',
  'coffe': 'coffee',
  'coffie': 'coffee',
  'koffee': 'coffee',
  'kofee': 'coffee',
  
  // Latte misspellings
  'latay': 'latte',
  'late': 'latte',
  'latt': 'latte',
  'lattee': 'latte',
  'latté': 'latte',
  
  // Frappe misspellings
  'frape': 'frappe',
  'frappee': 'frappe',
  'frapee': 'frappe',
  'frappé': 'frappe',
  
  // Cappuccino misspellings
  'cappucino': 'cappuccino',
  'capuccino': 'cappuccino',
  'capuchino': 'cappuccino',
  'capucino': 'cappuccino',
  'capachino': 'cappuccino',
  'cappachino': 'cappuccino',
  'capaccino': 'cappuccino',
  
  // Americano misspellings
  'ameriacno': 'americano',
  'americano': 'americano',
  'americanno': 'americano',
  
  // Espresso misspellings
  'expresso': 'espresso',
  'esspresso': 'espresso',
  'espreso': 'espresso',
  
  // Mocha misspellings
  'moca': 'mocha',
  'mokka': 'mocha',
  'moka': 'mocha',
  
  // Macchiato misspellings
  'machato': 'macchiato',
  'machiato': 'macchiato',
  'macchiatto': 'macchiato',
  
  // Other common misspellings
  'carmel': 'caramel',
  'caramell': 'caramel',
  'hazelnut': 'hazelnut',
  'hazelnutt': 'hazelnut',
};

/**
 * Synonym mappings for search expansion
 * Maps user intent to relevant search terms
 */
export const SYNONYMS: Record<string, string[]> = {
  // Black coffee synonyms
  'black': ['americano', 'espresso', 'black coffee'],
  'strong': ['espresso', 'robusta', 'double shot'],
  
  // Iced/cold synonyms
  'iced': ['cold', 'chilled', 'ice'],
  'cold': ['iced', 'chilled', 'cold brew'],
  'chilled': ['cold', 'iced'],
  
  // Hot synonyms
  'hot': ['warm', 'heated'],
  'warm': ['hot'],
  
  // Milk preferences
  'milk': ['latte', 'cappuccino', 'flat white'],
  'creamy': ['latte', 'cappuccino'],
  
  // Brew methods
  'brew': ['cold brew', 'manual brew', 'v60', 'pour over'],
  'manual': ['manual brew', 'cold brew', 'v60'],
  'pour': ['pour over', 'v60'],
  
  // Coffee types
  'robusta': ['robusta specialty', 'robusta blend'],
  'blend': ['house blend', 'signature blend'],
  'peaberry': ['premium', 'specialty'],
  
  // Sweetness
  'sweet': ['caramel', 'vanilla', 'mocha', 'hazelnut', 'biscoff'],
  'chocolate': ['mocha', 'cocoa', 'biscoff'],
  
  // Food
  'snack': ['fries', 'nuggets', 'wedges'],
  'pastry': ['croissant', 'bagel'],
  'bread': ['bagel', 'croissant'],
};

/**
 * Intent keywords that should trigger special filtering
 */
export const INTENT_KEYWORDS = {
  // Temperature intents
  temperature: {
    hot: ['hot', 'warm', 'heated'],
    cold: ['iced', 'cold', 'chilled', 'ice'],
    manual: ['brew', 'manual', 'cold brew', 'pour over', 'v60'],
  },
  
  // Milk preference intents
  milk: {
    withMilk: ['milk', 'latte', 'cappuccino', 'creamy'],
    withoutMilk: ['black', 'non', 'no', 'without'],
  },
  
  // Category intents
  category: {
    coffee: ['coffee', 'espresso', 'latte', 'cappuccino'],
    tea: ['tea', 'iced tea'],
    shakes: ['shake', 'milkshake', 'blended'],
    food: ['food', 'snack', 'pastry', 'fries', 'bagel', 'croissant'],
  },
};

/**
 * Get corrected spelling for a word
 */
export function correctSpelling(word: string): string {
  const normalized = word.toLowerCase();
  return SPELLING_CORRECTIONS[normalized] || word;
}

/**
 * Get synonyms for a word
 */
export function getSynonyms(word: string): string[] {
  const normalized = word.toLowerCase();
  return SYNONYMS[normalized] || [];
}

/**
 * Expand query with synonyms and corrections
 */
export function expandQuery(query: string): string[] {
  const words = query.toLowerCase().split(/\s+/);
  const expanded = new Set<string>([query.toLowerCase()]);

  words.forEach(word => {
    // Add corrected spelling
    const corrected = correctSpelling(word);
    if (corrected !== word) {
      expanded.add(corrected);
    }

    // Add synonyms
    const synonyms = getSynonyms(word);
    synonyms.forEach(syn => expanded.add(syn));
  });

  return Array.from(expanded);
}
