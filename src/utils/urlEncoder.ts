
/**
 * Encode text to URL encoded format
 */
export function encodeUrl(text: string): string {
  try {
    return encodeURIComponent(text)
  } catch (e) {
    return 'Error: Invalid input'
  }
}

/**
 * Decode URL encoded text
 */
export function decodeUrl(text: string): string {
  try {
    return decodeURIComponent(text)
  } catch (e) {
    return 'Error: Invalid URL encoded text'
  }
}

/**
 * Encode full URL (preserves protocol, etc.)
 */
export function encodeFullUrl(text: string): string {
  try {
    return encodeURI(text)
  } catch (e) {
    return 'Error: Invalid input'
  }
}

/**
 * Decode full URL
 */
export function decodeFullUrl(text: string): string {
  try {
    return decodeURI(text)
  } catch (e) {
    return 'Error: Invalid URL'
  }
}
