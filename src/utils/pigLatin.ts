
export function toPigLatin(text: string): string {
  return text.replace(/\b(\w+)\b/g, (word) => {
    // Only convert if it contains letters
    if (!/[a-zA-Z]/.test(word)) return word

    const vowels = /[aeiouAEIOU]/
    const firstVowel = word.search(vowels)

    let result = ''
    if (firstVowel === 0) {
      result = word + 'way'
    } else if (firstVowel > 0) {
      result = word.slice(firstVowel) + word.slice(0, firstVowel) + 'ay'
    } else {
      // No vowels (e.g. "try" -> "y" sometimes considered vowel but simple rule here)
      // If no vowels, usually treat whole word as consonant cluster?
      // Or maybe "try" -> "rytay"?
      // Common rule: if no vowels, keep as is or treat 'y' as vowel if not at start.
      // Let's stick to a simple rule: if no vowels, just append ay?
      // Actually standard rule for "my" is "ymay".
      // Let's try to find 'y' if no other vowels
      const yIndex = word.indexOf('y')
      if (yIndex > 0) {
         result = word.slice(yIndex) + word.slice(0, yIndex) + 'ay'
      } else {
         result = word + 'ay'
      }
    }

    // Preserve case (simple)
    if (word[0] === word[0].toUpperCase()) {
      return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase()
    }
    return result.toLowerCase()
  })
}
