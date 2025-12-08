export const truncateText = (
  text: string,
  limit: number,
  mode: 'chars' | 'bytes',
  suffix: string = '...'
): string => {
  if (limit <= 0) return ''

  if (mode === 'chars') {
    if (text.length <= limit) return text
    return text.slice(0, limit) + suffix
  } else {
    // Bytes mode
    const encoder = new TextEncoder()
    const encoded = encoder.encode(text)
    if (encoded.length <= limit) return text

    // Binary search or iterative approach to find the cut point
    // A simple approach:
    let low = 0
    let high = text.length
    let result = ''

    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      const substring = text.slice(0, mid)
      if (encoder.encode(substring).length <= limit) {
        result = substring
        low = mid + 1
      } else {
        high = mid - 1
      }
    }
    return result + suffix
  }
}
