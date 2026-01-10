/**
 * Search Service Exports
 * Central export point for all search functionality
 */

// Core search services
export { searchService, type SearchResult, type ScoredItem } from './search.service';
export { autocompleteService } from './autocomplete.service';

// New enhanced services
export { cacheService } from './cache.service';
export { searchIndexService } from './index.service';
export { analyticsService } from './analytics.service';
export { nlpService } from './nlp.service';
export { Phonetics } from './phonetics';

// Utilities
export { normalize, tokenize } from './normalizer';
export { correctSpelling, expandQuery } from './synonyms';
export { detectIntent, matchesIntent, type SearchIntent } from './intent-mapper';
export { vocabularyService } from './vocabulary.service';
export { similarityScore } from './levenshtein';
