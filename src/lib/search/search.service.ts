/**
 * Main Search Service
 * Coordinates all search components to provide intelligent search results
 * Enhanced with caching and dynamic indexing for world-class performance
 */

import { MenuItem } from '@/types/menu';
import { normalize, tokenize } from './normalizer';
import { correctSpelling, expandQuery } from './synonyms';
import { detectIntent, matchesIntent, SearchIntent } from './intent-mapper';
import { vocabularyService } from './vocabulary.service';
import { similarityScore } from './levenshtein';
import { searchIndexService } from './index.service';
import { cacheService } from './cache.service';

export interface SearchResult {
  hits: MenuItem[];
  totalHits: number;
  query: string;
  processingTimeMs: number;
  message?: string;
  intent?: SearchIntent;
  fromCache?: boolean;
}

export interface ScoredItem {
  item: MenuItem;
  score: number;
  matchedFields: string[];
}

export class SearchService {
  private initialized = false;

  /**
   * Initialize the search service with menu items
   * This builds the vocabulary and search index
   */
  initialize(menuItems: MenuItem[]): void {
    if (!this.initialized) {
      console.log('🚀 Initializing world-class search system...');
      
      // Build vocabulary for relevance checking
      vocabularyService.buildVocabulary(menuItems);
      
      // Build search index for fast lookups
      searchIndexService.buildIndex(menuItems);
      
      this.initialized = true;
      console.log('✅ Search system ready!', searchIndexService.getStats());
    }
  }

  /**
   * Rebuild index (call when DB items change)
   */
  rebuildIndex(menuItems: MenuItem[]): void {
    console.log('🔄 Rebuilding search index...');
    vocabularyService.buildVocabulary(menuItems);
    searchIndexService.buildIndex(menuItems);
    cacheService.invalidateAll();
  }

  /**
   * Update single item in index
   */
  updateItem(item: MenuItem): void {
    searchIndexService.updateItem(item);
  }

  /**
   * Remove item from index
   */
  removeItem(itemId: string): void {
    searchIndexService.removeItem(itemId);
  }

  /**
   * Main search method - ENHANCED with caching
   */
  search(query: string, items: MenuItem[]): SearchResult {
    const startTime = performance.now();

    // Initialize if not done
    if (!this.initialized) {
      this.initialize(items);
    }

    // Validate query
    if (!query || query.trim().length === 0) {
      return this.emptyResult('', startTime);
    }

    // Check cache first
    const cached = cacheService.getQueryResult<SearchResult>(query);
    if (cached) {
      console.log(`⚡ Cache hit for "${query}"`);
      return {
        ...cached,
        processingTimeMs: performance.now() - startTime,
        fromCache: true,
      };
    }

    // Check relevance using vocabulary service
    if (!vocabularyService.isRelevant(query)) {
      console.log(`❌ Query "${query}" rejected as irrelevant`);
      return {
        hits: [],
        totalHits: 0,
        query,
        processingTimeMs: performance.now() - startTime,
        message: 'No matching items found',
      };
    }

    // Detect intent
    const intent = detectIntent(query);

    // Normalize and expand query
    const normalizedQuery = normalize(query);
    const expandedQueries = expandQuery(normalizedQuery);
    
    // DYNAMIC SPELL CORRECTION (ML-like)
    // If we rely only on static expandedQueries, we fail for unknown typos.
    // Now we check each token against vocabulary for suggestions.
    const queryTokens = tokenize(normalizedQuery, true);
    queryTokens.forEach(token => {
      const correction = vocabularyService.getSuggestedCorrection(token);
      if (correction && correction !== token) {
        console.log(`✨ Smart Correction: "${token}" -> "${correction}"`);
        expandedQueries.push(correction);
      }
    });

    // Use inverted index for fast candidate selection
    // Pass expanded queries too!
    const candidateItems = this.getCandidateItems(normalizedQuery, items, expandedQueries);
    
    // Score only candidate items (much faster!)
    const scoredItems = this.scoreItems(candidateItems, normalizedQuery, expandedQueries, intent);

    // Filter by intent if needed
    let filteredItems = intent.shouldFilterByIntent
      ? scoredItems.filter(si => matchesIntent(si.item, intent))
      : scoredItems;

    // Sort by score (highest first)
    filteredItems.sort((a, b) => b.score - a.score);

    // Filter items with score > 0
    const results = filteredItems.filter(si => si.score > 0).map(si => si.item);

    const endTime = performance.now();

    const searchResult: SearchResult = {
      hits: results,
      totalHits: results.length,
      query,
      processingTimeMs: endTime - startTime,
      intent,
      fromCache: false,
    };

    // Cache the result
    cacheService.setQueryResult(query, searchResult);

    return searchResult;
  }

  /**
   * Get candidate items using inverted index (FAST!)
   * Instead of searching all items, we only search items that contain query tokens OR expanded tokens
   */
  private getCandidateItems(normalizedQuery: string, allItems: MenuItem[], expandedQueries: string[] = []): MenuItem[] {
    const index = searchIndexService.getIndex();
    
    // If no index, use all items (fallback)
    if (!index) {
      return allItems;
    }

    const queryTokens = tokenize(normalizedQuery, true);
    const candidateIds = new Set<string>();

    // 1. Search original tokens
    queryTokens.forEach(token => {
      let itemIds = searchIndexService.getItemIdsForToken(token);
      
      // God-Tier Recall: Always include prefix matches for finding "fri" -> "fries"
      // Don't just rely on exact matches failing. Merge them!
      if (token.length >= 3) {
        const prefixIds = searchIndexService.getItemIdsForPrefix(token);
        
        // Merge prefix results (manual merge for Sets)
        prefixIds.forEach(pid => itemIds.add(pid));
      }
      
      itemIds.forEach(id => candidateIds.add(id));
    });
    
    // 2. Search expanded/corrected tokens (Crucial for typos!)
    expandedQueries.forEach(expanded => {
       // Expanded terms might be multi-word ("cold brew"), so tokenize them
       const expandedTokens = tokenize(expanded, true);
       expandedTokens.forEach(token => {
         const itemIds = searchIndexService.getItemIdsForToken(token);
         itemIds.forEach(id => candidateIds.add(id));
       });
    });

    // If no candidates found, try without stop word removal
    if (candidateIds.size === 0) {
      const allTokens = tokenize(normalizedQuery, false);
      allTokens.forEach(token => {
        const itemIds = searchIndexService.getItemIdsForToken(token);
        itemIds.forEach(id => candidateIds.add(id));
      });
    }

    // Convert IDs to items
    return searchIndexService.getItemsByIds(candidateIds);
  }

  /**
   * Score and rank items using BM25-inspired algorithm
   */
  private scoreItems(
    items: MenuItem[],
    query: string,
    expandedQueries: string[],
    intent: SearchIntent
  ): ScoredItem[] {
    const queryTokens = tokenize(query, true); // Remove stop words

    return items.map(item => {
      let score = 0;
      const matchedFields: string[] = [];

      // Score name matches (highest priority)
      const nameScore = this.calculateFieldScore(
        item.name,
        query,
        queryTokens,
        expandedQueries,
        3.0 // Name boost
      );
      if (nameScore > 0) {
        score += nameScore;
        matchedFields.push('name');
      }

      // Score description matches (medium priority)
      if (item.description) {
        const descScore = this.calculateFieldScore(
          item.description,
          query,
          queryTokens,
          expandedQueries,
          1.5 // Description boost
        );
        if (descScore > 0) {
          score += descScore;
          matchedFields.push('description');
        }
      }

      // Score category matches (lower priority)
      const categoryScore = this.calculateFieldScore(
        item.category,
        query,
        queryTokens,
        expandedQueries,
        1.0 // Category boost
      );
      if (categoryScore > 0) {
        score += categoryScore;
        matchedFields.push('category');
      }

      // Bonus for exact matches
      if (item.name.toLowerCase() === query.toLowerCase()) {
        score *= 2.0;
      }

      // Bonus for partial exact matches
      if (item.name.toLowerCase().includes(query.toLowerCase())) {
        score *= 1.5;
      }

      // Bonus if matches intent
      if (intent.shouldFilterByIntent && matchesIntent(item, intent)) {
        score *= 1.3;
      }

      // NEW: Popularity boost (if dealPercentage exists, it's popular)
      if ((item as any).dealPercentage && (item as any).dealPercentage > 0) {
        score *= 1.2;
      }

      return {
        item,
        score,
        matchedFields,
      };
    });
  }

  /**
   * Calculate score for a specific field
   */
  private calculateFieldScore(
    fieldValue: string,
    query: string,
    queryTokens: string[],
    expandedQueries: string[],
    boost: number
  ): number {
    let score = 0;
    const normalizedField = normalize(fieldValue);
    const fieldTokens = tokenize(fieldValue, true);

    // Exact match (highest score)
    if (normalizedField === normalize(query)) {
      return 100 * boost;
    }

    // Contains match
    if (normalizedField.includes(normalize(query))) {
      score += 50 * boost;
    }

    // Token matching with spelling correction
    queryTokens.forEach(queryToken => {
      const corrected = correctSpelling(queryToken);
      
      fieldTokens.forEach(fieldToken => {
        // Exact token match
        if (fieldToken === corrected || fieldToken === queryToken) {
          score += 20 * boost;
        }
        // Prefix match (New: Handle "fri" matching "fries")
        else if (fieldToken.startsWith(queryToken) && queryToken.length >= 3) {
           score += 15 * boost;
        }
        // Fuzzy match using similarity score
        else {
          const similarity = similarityScore(queryToken, fieldToken);
          if (similarity > 0.7) { // 70% similarity threshold
            score += similarity * 15 * boost;
          }
        }
      });
    });

    // Expanded query matching (synonyms)
    expandedQueries.forEach(expanded => {
      if (normalizedField.includes(normalize(expanded))) {
        score += 10 * boost;
      }
    });

    return score;
  }

  /**
   * Return empty result
   */
  private emptyResult(query: string, startTime: number): SearchResult {
    return {
      hits: [],
      totalHits: 0,
      query,
      processingTimeMs: performance.now() - startTime,
    };
  }

  /**
   * Get search statistics
   */
  getStats() {
    return {
      ...searchIndexService.getStats(),
      cache: cacheService.getStats(),
    };
  }
}

// Export singleton instance
export const searchService = new SearchService();

