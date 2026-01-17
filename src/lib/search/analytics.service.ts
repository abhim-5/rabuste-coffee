/**
 * Search Analytics & History Service
 * Tracks user behavior to provide personalized and trending experiences
 */

export interface SearchEvent {
  query: string;
  timestamp: number;
  resultCount: number;
  clickedItemId?: string;
  source: 'start' | 'click' | 'voice';
}

export class AnalyticsService {
  private readonly HISTORY_KEY = 'rabuste_search_history';
  private readonly MAX_HISTORY = 8;
  
  // Simulated trending data (would eventually come from backend)
  private readonly TRENDING_BASE = [
    'Cappuccino', 'Latte', 'Croissant', 'Cold Brew', 'Hazelnut'
  ];

  /**
   * Save search query to local history
   */
  addToHistory(query: string): void {
    if (!query || query.trim().length === 0) return;
    
    if (typeof window === 'undefined') return;

    const history = this.getHistory();
    const normalizedQuery = query.toLowerCase().trim();
    
    // Remove if exists (to move to top)
    const filtered = history.filter(q => q.toLowerCase() !== normalizedQuery);
    
    // Add to top
    filtered.unshift(query);
    
    // Keep max limit
    const trimmed = filtered.slice(0, this.MAX_HISTORY);
    
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(trimmed));
  }

  /**
   * Get recent search history
   */
  getHistory(): string[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to parse search history', e);
      return [];
    }
  }

  /**
   * Remove single item from history
   */
  removeFromHistory(query: string): void {
    if (typeof window === 'undefined') return;

    const history = this.getHistory();
    const normalizedQuery = query.toLowerCase().trim();
    
    // Filter out the specific item
    const filtered = history.filter(q => q.toLowerCase() !== normalizedQuery);
    
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(filtered));
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.HISTORY_KEY);
  }

  /**
   * Get trending searches (Mix of static + simulated dynamic)
   */
  getTrending(): string[] {
    // In a real app, this would fetch from an API
    // For now, we return our curated list + randomize order slightly
    return [...this.TRENDING_BASE].sort(() => Math.random() - 0.5);
  }

  /**
   * Track a search event (for analytics)
   */
  trackSearch(query: string, resultCount: number): void {
    const event: SearchEvent = {
      query,
      timestamp: Date.now(),
      resultCount,
      source: 'start'
    };
    
    // In real app: send to analytics server (Google Analytics, Mixpanel, etc.)
    console.log('📊 Analytics Search:', event);
    this.addToHistory(query);
  }

  /**
   * Track result click
   */
  trackClick(query: string, itemId: string): void {
    const event: SearchEvent = {
      query,
      timestamp: Date.now(),
      resultCount: 1, // clicked one
      clickedItemId: itemId,
      source: 'click'
    };
    
    console.log('📊 Analytics Click:', event);
  }
}

// Singleton
export const analyticsService = new AnalyticsService();
