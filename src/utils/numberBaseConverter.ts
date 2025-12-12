
export type Base = 2 | 8 | 10 | 16

/**
 * Convert number from one base to another
 */
export function convertBase(
  value: string,
  fromBase: Base,
  toBase: Base
): string {
  try {
    // Remove whitespace and handle potential prefixes
    let cleanValue = value.trim().toLowerCase()

    // Remove prefixes if present
    if (fromBase === 16 && cleanValue.startsWith('0x')) cleanValue = cleanValue.slice(2)
    if (fromBase === 8 && cleanValue.startsWith('0o')) cleanValue = cleanValue.slice(2)
    if (fromBase === 2 && cleanValue.startsWith('0b')) cleanValue = cleanValue.slice(2)

    if (!cleanValue) return ''

    // Parse to decimal first
    const decimal = parseInt(cleanValue, fromBase)

    if (isNaN(decimal)) {
      return 'Error: Invalid input'
    }

    // Convert to target base
    let result = decimal.toString(toBase)

    // Add prefixes for clarity (optional, maybe controlled by UI)
    // For now we return raw string as is common in converters

    return toBase === 16 ? result.toUpperCase() : result
  } catch (e) {
    return 'Error'
  }
}

/**
 * Validate input for specific base
 */
export function isValidInput(value: string, base: Base): boolean {
  if (!value) return true
  try {
    // Strict check because parseInt parses "12z" as 12
    // We want to ensure all characters are valid for the base
    const chars = value.toLowerCase().replace(/^0[xob]/, '')

    const validChars = {
      2: /^[01]+$/,
      8: /^[0-7]+$/,
      10: /^[0-9]+$/,
      16: /^[0-9a-f]+$/
    }

    return validChars[base].test(chars)
  } catch {
    return false
  }
}
