/**
 * Intent Detection and Mapping
 * Detects user intent from search queries and applies appropriate filters
 */

import { MenuCategory } from '@/types/menu';
import { tokenize } from './normalizer';
import { INTENT_KEYWORDS } from './synonyms';

export interface SearchIntent {
  filters: {
    category?: MenuCategory | MenuCategory[];
    temperature?: 'hot' | 'cold' | 'manual';
    milk?: boolean;
  };
  synonyms: string[];
  correctedTerms: Map<string, string>;
  shouldFilterByIntent: boolean;
}

/**
 * Detect user intent from query tokens
 */
export function detectIntent(query: string): SearchIntent {
  const tokens = tokenize(query.toLowerCase(), false);
  
  const intent: SearchIntent = {
    filters: {},
    synonyms: [],
    correctedTerms: new Map(),
    shouldFilterByIntent: false,
  };

  // Detect temperature intent
  detectTemperatureIntent(tokens, intent);
  
  // Detect milk preference intent
  detectMilkIntent(tokens, intent);
  
  // Detect category intent
  detectCategoryIntent(tokens, intent);
  
  // Detect special combinations
  detectSpecialCombinations(tokens, intent);

  return intent;
}

/**
 * Detect temperature-related intent
 */
function detectTemperatureIntent(tokens: string[], intent: SearchIntent): void {
  // Check for hot
  if (tokens.some(t => INTENT_KEYWORDS.temperature.hot.includes(t))) {
    intent.filters.temperature = 'hot';
    intent.synonyms.push('hot');
    intent.shouldFilterByIntent = true;
  }
  
  // Check for cold/iced
  if (tokens.some(t => INTENT_KEYWORDS.temperature.cold.includes(t))) {
    intent.filters.temperature = 'cold';
    intent.synonyms.push('cold', 'iced');
    intent.shouldFilterByIntent = true;
  }
  
  // Check for manual brew
  if (tokens.some(t => INTENT_KEYWORDS.temperature.manual.includes(t))) {
    intent.filters.temperature = 'manual';
    intent.synonyms.push('brew', 'manual brew', 'cold brew');
    intent.shouldFilterByIntent = true;
  }
}

/**
 * Detect milk preference intent
 */
function detectMilkIntent(tokens: string[], intent: SearchIntent): void {
  const hasBlackKeyword = tokens.includes('black');
  const hasNonKeyword = tokens.some(t => ['non', 'no', 'without'].includes(t));
  const hasMilkKeyword = tokens.includes('milk');
  
  // "black coffee" or "non milk" or "no milk" or "without milk"
  if (hasBlackKeyword || (hasNonKeyword && hasMilkKeyword)) {
    intent.filters.milk = false;
    intent.synonyms.push('americano', 'espresso', 'black coffee');
    intent.shouldFilterByIntent = true;
  }
}

/**
 * Detect category intent
 */
function detectCategoryIntent(tokens: string[], intent: SearchIntent): void {
  const categories: MenuCategory[] = [];
  
  // Check for coffee keywords
  if (tokens.some(t => INTENT_KEYWORDS.category.coffee.includes(t))) {
    categories.push('robusta-cold', 'robusta-hot', 'blend-cold', 'blend-hot');
  }
  
  // Check for food keywords
  if (tokens.some(t => INTENT_KEYWORDS.category.food.includes(t))) {
    categories.push('food');
    intent.shouldFilterByIntent = true;
  }
  
  // Check for tea keywords
  if (tokens.some(t => INTENT_KEYWORDS.category.tea.includes(t))) {
    categories.push('shakes-tea');
    intent.shouldFilterByIntent = true;
  }
  
  // Check for shake keywords
  if (tokens.some(t => INTENT_KEYWORDS.category.shakes.includes(t))) {
    categories.push('shakes-tea');
    intent.shouldFilterByIntent = true;
  }
  
  if (categories.length > 0) {
    intent.filters.category = categories.length === 1 ? categories[0] : categories;
  }
}

/**
 * Detect special query combinations
 */
function detectSpecialCombinations(tokens: string[], intent: SearchIntent): void {
  const query = tokens.join(' ');
  
  // "black coffee"
  if (query.includes('black coffee') || query.includes('black') && query.includes('coffee')) {
    intent.filters.milk = false;
    intent.synonyms.push('americano', 'espresso');
    intent.shouldFilterByIntent = true;
  }
  
  // "iced americano"
  if (query.includes('iced americano') || (query.includes('iced') && query.includes('americano'))) {
    intent.filters.temperature = 'cold';
    intent.synonyms.push('iced americano', 'cold americano');
    intent.shouldFilterByIntent = true;
  }
  
  // "hot cappuccino"
  if (query.includes('hot cappuccino') || (query.includes('hot') && query.includes('cappuccino'))) {
    intent.filters.temperature = 'hot';
    intent.synonyms.push('hot cappuccino', 'cappuccino');
    intent.shouldFilterByIntent = true;
  }
  
  // "cold brew"
  if (query.includes('cold brew')) {
    intent.filters.temperature = 'manual';
    intent.synonyms.push('cold brew', 'manual brew');
    intent.shouldFilterByIntent = true;
  }
  
  // "cold coffee" (should include cold brew + iced items)
  if (query.includes('cold coffee')) {
    intent.filters.temperature = 'cold';
    intent.synonyms.push('cold brew', 'iced coffee', 'cold');
  }
}

/**
 * Check if query matches intent filters
 */
export function matchesIntent(
  item: { category: MenuCategory; name: string; description?: string },
  intent: SearchIntent
): boolean {
  // If no filters, everything matches
  if (!intent.shouldFilterByIntent) {
    return true;
  }

  // Apply category filter
  if (intent.filters.category) {
    const categories = Array.isArray(intent.filters.category) 
      ? intent.filters.category 
      : [intent.filters.category];
    
    if (!categories.includes(item.category)) {
      return false;
    }
  }

  // Apply temperature filter (check name for hot/cold/iced keywords)
  if (intent.filters.temperature) {
    const itemName = item.name.toLowerCase();
    
    if (intent.filters.temperature === 'hot') {
      // Must have "hot" in name or be in hot category
      if (!itemName.includes('hot') && !item.category.includes('hot')) {
        return false;
      }
    }
    
    if (intent.filters.temperature === 'cold') {
      // Must have "iced" or "cold" in name or be in cold category
      if (!itemName.includes('iced') && !itemName.includes('cold') && !item.category.includes('cold')) {
        return false;
      }
    }
    
    if (intent.filters.temperature === 'manual') {
      // Must be manual-brew category or have "brew" in name
      if (item.category !== 'manual-brew' && !itemName.includes('brew')) {
        return false;
      }
    }
  }

  // Apply milk filter (check name for milk-based drinks)
  if (typeof intent.filters.milk === 'boolean') {
    const itemName = item.name.toLowerCase();
    const milkDrinks = ['latte', 'cappuccino', 'flat white', 'mocha', 'frappe', 'shake'];
    const hasMilk = milkDrinks.some(drink => itemName.includes(drink));
    
    // If user wants no milk, exclude milk-based drinks
    if (intent.filters.milk === false && hasMilk) {
      return false;
    }
  }

  return true;
}
