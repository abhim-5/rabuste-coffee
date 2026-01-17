/**
 * Search Index Service
 * Manages search index building and updates for dynamic database items
 */

import { MenuItem } from '@/types/menu';
import { normalize, tokenize } from './normalizer';
import { cacheService } from './cache.service';

export interface SearchIndex {
  // Inverted index: token -> item IDs that contain it
  invertedIndex: Map<string, Set<string>>;
  
  // Direct access to items by ID
  itemsById: Map<string, MenuItem>;
  
  // All item names for autocomplete
  itemNames: string[];
  
  // Metadata
  lastBuilt: number;
  itemCount: number;
}

export class SearchIndexService {
  private index: SearchIndex | null = null;
  private isBuilding = false;

  /**
   * Build a fresh search index from menu items
   */
  buildIndex(menuItems: MenuItem[]): SearchIndex {
    console.log('🔨 Building search index...');
    this.isBuilding = true;
    const startTime = performance.now();

    const invertedIndex = new Map<string, Set<string>>();
    const itemsById = new Map<string, MenuItem>();
    const itemNames: string[] = [];

    menuItems.forEach(item => {
      // Store item by ID
      itemsById.set(item.id, item);
      itemNames.push(item.name);

      // Index all searchable fields
      this.indexField(item.id, item.name, invertedIndex);
      if (item.description) {
        this.indexField(item.id, item.description, invertedIndex);
      }
      this.indexField(item.id, item.category, invertedIndex);
    });

    this.index = {
      invertedIndex,
      itemsById,
      itemNames,
      lastBuilt: Date.now(),
      itemCount: menuItems.length,
    };

    this.isBuilding = false;
    const endTime = performance.now();
    
    console.log(`✅ Index built: ${menuItems.length} items, ${invertedIndex.size} tokens in ${(endTime - startTime).toFixed(2)}ms`);
    
    return this.index;
  }

  /**
   * Index a single field - add tokens to inverted index
   */
  private indexField(itemId: string, fieldValue: string, invertedIndex: Map<string, Set<string>>): void {
    const tokens = tokenize(fieldValue, false); // Keep all words
    
    tokens.forEach(token => {
      const normalizedToken = normalize(token);
      
      if (!invertedIndex.has(normalizedToken)) {
        invertedIndex.set(normalizedToken, new Set());
      }
      
      invertedIndex.get(normalizedToken)!.add(itemId);
    });
  }

  /**
   * Update index when item is added or modified
   */
  updateItem(item: MenuItem): void {
    if (!this.index) return;

    console.log(`🔄 Updating index for item: ${item.id}`);
    
    // Remove old entries if item exists
    this.removeItem(item.id);
    
    // Add new entries
    this.index.itemsById.set(item.id, item);
    
    // Update item names list
    const existingIndex = this.index.itemNames.findIndex(name => 
      this.index!.itemsById.get(item.id)?.name === name
    );
    
    if (existingIndex >= 0) {
      this.index.itemNames[existingIndex] = item.name;
    } else {
      this.index.itemNames.push(item.name);
    }
    
    // Re-index the item
    this.indexField(item.id, item.name, this.index.invertedIndex);
    if (item.description) {
      this.indexField(item.id, item.description, this.index.invertedIndex);
    }
    this.indexField(item.id, item.category, this.index.invertedIndex);
    
    this.index.lastBuilt = Date.now();
    this.index.itemCount = this.index.itemsById.size;
    
    // Invalidate caches
    cacheService.invalidateAll();
  }

  /**
   * Remove item from index
   */
  removeItem(itemId: string): void {
    if (!this.index) return;

    console.log(`🗑️ Removing item from index: ${itemId}`);
    
    const item = this.index.itemsById.get(itemId);
    if (!item) return;
    
    // Remove from inverted index
    this.index.invertedIndex.forEach((itemIds, token) => {
      itemIds.delete(itemId);
      if (itemIds.size === 0) {
        this.index!.invertedIndex.delete(token);
      }
    });
    
    // Remove from items map
    this.index.itemsById.delete(itemId);
    
    // Remove from item names
    this.index.itemNames = this.index.itemNames.filter(name => name !== item.name);
    
    this.index.lastBuilt = Date.now();
    this.index.itemCount = this.index.itemsById.size;
    
    // Invalidate caches
    cacheService.invalidateAll();
  }

  /**
   * Get the current index
   */
  getIndex(): SearchIndex | null {
    return this.index;
  }

  /**
   * Get items by IDs using the index
   */
  getItemsByIds(itemIds: Set<string>): MenuItem[] {
    if (!this.index) return [];
    
    const items: MenuItem[] = [];
    itemIds.forEach(id => {
      const item = this.index!.itemsById.get(id);
      if (item) items.push(item);
    });
    
    return items;
  }

  /**
   * Fast lookup: Get item IDs containing a token
   */
  getItemIdsForToken(token: string): Set<string> {
    if (!this.index) return new Set();
    
    const normalizedToken = normalize(token);
    return this.index.invertedIndex.get(normalizedToken) || new Set();
  }

  /**
   * Prefix lookup: Get item IDs for tokens starting with prefix
   * Useful for partial matches like "fri" -> "fries"
   */
  getItemIdsForPrefix(prefix: string): Set<string> {
    if (!this.index || prefix.length < 3) return new Set();
    
    const normalizedPrefix = normalize(prefix);
    const ids = new Set<string>();
    
    // Scan all keys to find matches
    // Note: With a Trie this would be O(k), here it's O(n) but n (vocab size) is small (<5000)
    for (const key of this.index.invertedIndex.keys()) {
      if (key.startsWith(normalizedPrefix)) {
         const tokenIds = this.index.invertedIndex.get(key);
         tokenIds?.forEach(id => ids.add(id));
      }
    }
    
    return ids;
  }


  /**
   * Check if index is ready
   */
  isReady(): boolean {
    return this.index !== null && !this.isBuilding;
  }

  /**
   * Get index statistics
   */
  getStats() {
    if (!this.index) {
      return {
        ready: false,
        itemCount: 0,
        tokenCount: 0,
        lastBuilt: null,
      };
    }
    
    return {
      ready: true,
      itemCount: this.index.itemCount,
      tokenCount: this.index.invertedIndex.size,
      lastBuilt: new Date(this.index.lastBuilt).toISOString(),
      itemNamesCount: this.index.itemNames.length,
    };
  }
}

// Singleton instance
export const searchIndexService = new SearchIndexService();
