/**
 * Natural Language Processor (Semantic Search)
 * Understands queries like "Cheap coffee", "Best rated", "Under $5"
 */

import { SearchIntent } from './intent-mapper';

export interface SemanticQuery {
  originalQuery: string;
  cleanedQuery: string; // Query with modifiers removed
  filters: {
    priceRange?: { min?: number; max?: number };
    sortBy?: 'priceAsc' | 'priceDesc' | 'rating' | 'popularity';
    category?: string;
  };
}

export class NLPService {
  
  /**
   * Parse a natural language query into structured filters
   */
  parseQuery(query: string): SemanticQuery {
    let cleaned = query.toLowerCase();
    const result: SemanticQuery = {
      originalQuery: query,
      cleanedQuery: '',
      filters: {}
    };

    // 1. Detect Price Constraints
    // "Under $5", "Under 5", "< 5", "cheap", "expensive"
    
    if (cleaned.includes('under ') || cleaned.includes('below ') || cleaned.includes('less than ')) {
      const match = cleaned.match(/(?:under|below|less than)\s?\$?(\d+)/);
      if (match) {
        result.filters.priceRange = { max: parseInt(match[1]) };
        cleaned = cleaned.replace(match[0], '');
      }
    }
    
    if (cleaned.includes('cheap') || cleaned.includes('budget') || cleaned.includes('lowest price')) {
      result.filters.sortBy = 'priceAsc';
      cleaned = cleaned.replace(/cheap|budget|lowest price/g, '');
    }
    
    if (cleaned.includes('expensive') || cleaned.includes('premium') || cleaned.includes('luxury')) {
      result.filters.sortBy = 'priceDesc';
      cleaned = cleaned.replace(/expensive|premium|luxury/g, '');
    }

    // 2. Detect Sorting Intents
    if (cleaned.includes('best') || cleaned.includes('top rated') || cleaned.includes('popular')) {
       // "Best" usually means highest rated or most popular
       result.filters.sortBy = 'popularity'; // or 'rating' if we had it
       cleaned = cleaned.replace(/best|top rated|popular/g, '');
    }

    // 3. Detect Categories (Semantic)
    if (cleaned.includes('drink') || cleaned.includes('beverage')) {
       // Broad category
       cleaned = cleaned.replace(/drink|beverage/g, '');
    }
    if (cleaned.includes('food') || cleaned.includes('eat')) {
      result.filters.category = 'Food';
      cleaned = cleaned.replace(/food|eat/g, '');
    }

    result.cleanedQuery = cleaned.trim();
    return result;
  }
}

export const nlpService = new NLPService();
