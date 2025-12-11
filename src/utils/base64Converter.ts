
/**
 * Encode text to Base64
 */
export function toBase64(text: string): string {
  try {
    // Handle Unicode strings
    return btoa(
      encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_match, p1) => {
        return String.fromCharCode(parseInt(p1, 16))
      })
    )
  } catch (e) {
    return 'Error: Invalid input'
  }
}

/**
 * Decode Base64 to text
 */
export function fromBase64(text: string): string {
  try {
    // Handle Unicode strings
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(text), (c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )
  } catch (e) {
    return 'Error: Invalid Base64 string'
  }
}
