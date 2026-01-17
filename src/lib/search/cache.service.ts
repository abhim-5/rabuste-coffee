/**
 * Search Cache Service
 * Multi-layer caching for blazing-fast search performance
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export class CacheService {
  private queryCache = new Map<string, CacheEntry<any>>();
  private autocompleteCache = new Map<string, CacheEntry<string[]>>();
  
  // TTL in milliseconds
  private readonly QUERY_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly AUTOCOMPLETE_TTL = 10 * 60 * 1000; // 10 minutes

  /**
   * Get cached search results
   */
  getQueryResult<T>(query: string): T | null {
    const entry = this.queryCache.get(this.normalizeKey(query));
    
    if (!entry) return null;
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.queryCache.delete(this.normalizeKey(query));
      return null;
    }
    
    return entry.data as T;
  }

  /**
   * Cache search results
   */
  setQueryResult<T>(query: string, data: T): void {
    const now = Date.now();
    this.queryCache.set(this.normalizeKey(query), {
      data,
      timestamp: now,
      expiresAt: now + this.QUERY_TTL,
    });
  }

  /**
   * Get cached autocomplete suggestions
   */
  getAutocompleteSuggestions(query: string): string[] | null {
    const entry = this.autocompleteCache.get(this.normalizeKey(query));
    
    if (!entry) return null;
    
    if (Date.now() > entry.expiresAt) {
      this.autocompleteCache.delete(this.normalizeKey(query));
      return null;
    }
    
    return entry.data;
  }

  /**
   * Cache autocomplete suggestions
   */
  setAutocompleteSuggestions(query: string, suggestions: string[]): void {
    const now = Date.now();
    this.autocompleteCache.set(this.normalizeKey(query), {
      data: suggestions,
      timestamp: now,
      expiresAt: now + this.AUTOCOMPLETE_TTL,
    });
  }

  /**
   * Invalidate all caches (called when DB changes)
   */
  invalidateAll(): void {
    this.queryCache.clear();
    this.autocompleteCache.clear();
    console.log('🔄 Search cache invalidated');
  }

  /**
   * Invalidate specific query
   */
  invalidateQuery(query: string): void {
    this.queryCache.delete(this.normalizeKey(query));
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      queryCacheSize: this.queryCache.size,
      autocompleteCacheSize: this.autocompleteCache.size,
      totalMemoryEntries: this.queryCache.size + this.autocompleteCache.size,
    };
  }

  /**
   * Normalize cache key
   */
  private normalizeKey(key: string): string {
    return key.toLowerCase().trim();
  }

  /**
   * Cleanup expired entries (run periodically)
   */
  cleanup(): void {
    const now = Date.now();
    
    // Clean query cache
    for (const [key, entry] of this.queryCache.entries()) {
      if (now > entry.expiresAt) {
        this.queryCache.delete(key);
      }
    }
    
    // Clean autocomplete cache
    for (const [key, entry] of this.autocompleteCache.entries()) {
      if (now > entry.expiresAt) {
        this.autocompleteCache.delete(key);
      }
    }
  }
}

// Singleton instance
export const cacheService = new CacheService();

// Cleanup expired entries every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => cacheService.cleanup(), 5 * 60 * 1000);
}
