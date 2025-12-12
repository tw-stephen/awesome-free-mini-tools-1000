
export function toFullWidth(text: string): string {
  let result = ''
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i)
    if (code === 32) {
      result += String.fromCharCode(12288) // Space
    } else if (code >= 33 && code <= 126) {
      result += String.fromCharCode(code + 65248)
    } else {
      result += text.charAt(i)
    }
  }
  return result
}

export function toHalfWidth(text: string): string {
  let result = ''
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i)
    if (code === 12288) {
      result += String.fromCharCode(32) // Space
    } else if (code >= 65281 && code <= 65374) {
      result += String.fromCharCode(code - 65248)
    } else {
      result += text.charAt(i)
    }
  }
  return result
}
