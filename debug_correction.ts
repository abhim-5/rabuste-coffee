
import { vocabularyService } from './src/lib/search/vocabulary.service';
import { Phonetics } from './src/lib/search/phonetics';
import { MenuItem } from './src/types/menu';

// Mock Items to build vocab
const items: MenuItem[] = [
    { id: '1', name: 'Cappuccino', category: 'hot-coffee', price: 100, description: 'Hot coffee', dietary: [], imageUrl: '', rating: 5, reviews: 10, isDealOfTheDay: false },
    { id: '2', name: 'Latte', category: 'hot-coffee', price: 100, description: 'Milky coffee', dietary: [], imageUrl: '', rating: 5, reviews: 10, isDealOfTheDay: false },
    { id: '3', name: 'Kit Kat Shake', category: 'shakes', price: 150, description: 'Chocolate shake', dietary: [], imageUrl: '', rating: 5, reviews: 10, isDealOfTheDay: false },
    { id: '4', name: 'Cold Coffee', category: 'cold-coffee', price: 120, description: 'Iced coffee', dietary: [], imageUrl: '', rating: 5, reviews: 10, isDealOfTheDay: false }
];

console.log("Building vocabulary...");
vocabularyService.buildVocabulary(items);

const badWord = "kutta";
const phonetic = Phonetics.getPhoneticCode(badWord);
console.log(`Testing word: '${badWord}' (Phonetic: ${phonetic})`);

const correction = vocabularyService.getSuggestedCorrection(badWord);
console.log(`Suggested Correction: ${correction}`);

if (correction) {
    const correctionPhonetic = Phonetics.getPhoneticCode(correction);
    console.log(`Correction Phonetic: ${correctionPhonetic}`);
}
