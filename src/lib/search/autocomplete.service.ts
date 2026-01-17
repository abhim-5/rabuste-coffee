/**
 * Autocomplete/Suggestion Service
 * Generates search suggestions based on menu items
 * Enhanced with caching for blazing-fast suggestions
 */

import { MenuItem } from '@/types/menu';
import { normalize, tokenize } from './normalizer';
import { correctSpelling } from './synonyms';
import { cacheService } from './cache.service';
import { searchIndexService } from './index.service';
import { vocabularyService } from './vocabulary.service';

export class AutocompleteService {
  private suggestions: Set<string> = new Set();
  private menuNames: string[] = [];

  /**
   * Build autocomplete suggestions from menu items
   */
  buildSuggestions(menuItems: MenuItem[]): void {
    this.suggestions.clear();
    this.menuNames = [];

    menuItems.forEach(item => {
      // Add full item name
      this.menuNames.push(item.name);
      this.suggestions.add(item.name.toLowerCase());
      
      // Add individual words from name
      const words = tokenize(item.name, false);
      words.forEach(word => {
        if (word.length > 2) {
          this.suggestions.add(word);
        }
      });
    });

    console.log(`✅ Autocomplete built: ${this.suggestions.size} suggestions`);
  }

  /**
   * Get autocomplete suggestions for a query - ENHANCED with caching
   */
  getSuggestions(query: string, limit: number = 5): string[] {
    if (!query || query.trim().length < 2) {
      return [];
    }

    // Check cache first
    const cached = cacheService.getAutocompleteSuggestions(query);
    if (cached) {
      return cached;
    }

    // Get suggestions from index if available
    const index = searchIndexService.getIndex();
    const itemNames = index ? index.itemNames : this.menuNames;

    const normalizedQuery = normalize(query);
    
    // SMART MATCHING: Check for corrections
    // If user types "latay", we find "latte" and use THAT for suggestions
    const correction = vocabularyService.getSuggestedCorrection(normalizedQuery);
    const queryToUse = correction || normalizedQuery;
    
    console.log(`💡 Autocomplete using: "${queryToUse}" (Input: "${query}")`);
    
    const matches: Array<{name: string; score: number}> = [];

    // Find matching menu items with enhanced scoring
    itemNames.forEach(name => {
      const normalizedName = normalize(name);
      
      let score = 0;
      
      // Exact match (highest priority)
      if (normalizedName === queryToUse) {
        score = 1000;
      }
      // Starts with query (high priority)
      else if (normalizedName.startsWith(queryToUse)) {
        score = 100;
        // Boost if starts with first word
        if (normalizedName.split(' ')[0].startsWith(queryToUse)) {
          score += 50;
        }
      }
      // Contains query (medium priority)
      else if (normalizedName.includes(queryToUse)) {
        score = 50;
        // Boost if word boundary match
        if (normalizedName.includes(' ' + queryToUse)) {
          score += 25;
        }
      }
      // Word in name starts with query (lower priority)
      else {
        const words = tokenize(name, false);
        for (const word of words) {
          if (normalize(word).startsWith(queryToUse)) {
            score = 25;
            break;
          }
        }
      }

      if (score > 0) {
        matches.push({ name, score });
      }
    });

    // Sort by score (highest first) and return top N
    const results = matches
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(m => m.name);

    // Cache the results
    cacheService.setAutocompleteSuggestions(query, results);

    return results;
  }

  /**
   * Get popular suggestions (trending items)
   * Can be used for empty search state
   */
  getPopularSuggestions(limit: number = 5): string[] {
    const index = searchIndexService.getIndex();
    const itemNames = index ? index.itemNames : this.menuNames;
    
    // For now, return first N items
    // TODO: Track popular searches and return those instead
    return itemNames.slice(0, limit);
  }
}

// Singleton instance
export const autocompleteService = new AutocompleteService();

