
import { Phonetics } from './src/lib/search/phonetics';

const levenshteinDistance = (s: string, t: string): number => {
    if (!s.length) return t.length;
    if (!t.length) return s.length;
    const arr = [];
    for (let i = 0; i <= t.length; i++) {
        arr[i] = [i];
        for (let j = 1; j <= s.length; j++) {
            arr[i][j] =
                i === 0
                    ? j
                    : Math.min(
                        arr[i - 1][j] + 1,
                        arr[i][j - 1] + 1,
                        arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
                    );
        }
    }
    return arr[t.length][s.length];
};

const vocab = ["latte", "coffee", "tea", "mocha", "hot", "cold", "brew", "cake", "food"];
const badWord = "kutta";
const badPhonetic = Phonetics.getPhoneticCode(badWord);

console.log(`Analyzing '${badWord}' (${badPhonetic}) against vocabulary:`);

vocab.forEach(word => {
    const wordPhonetic = Phonetics.getPhoneticCode(word);
    const dist = levenshteinDistance(badWord, word);
    const phoneticDist = levenshteinDistance(badPhonetic, wordPhonetic);
    
    // Logic from Service
    const threshold = badWord.length <= 4 ? 1 : 2;
    let matchType = "NONE";
    
    if (dist <= 1) matchType = "STRICT";
    else if (dist <= threshold && phoneticDist <= 1) matchType = "LOOSE_PHONETIC";
    else if (dist <= 4 && wordPhonetic === badPhonetic && wordPhonetic.length > 2) matchType = "PURE_PHONETIC";
    
    if (matchType !== "NONE") {
        console.log(`MATCH FOUND: ${word} (${wordPhonetic}) - Type: ${matchType} (Dist: ${dist}, P-Dist: ${phoneticDist})`);
    }
});
