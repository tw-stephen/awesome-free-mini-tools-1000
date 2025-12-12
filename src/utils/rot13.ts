
export function rot13(text: string): string {
  return text.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97
    return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base)
  })
}

export function rot47(text: string): string {
  return text.replace(/[!-~]/g, (char) => {
    const code = char.charCodeAt(0)
    if (code >= 33 && code <= 126) {
      return String.fromCharCode(33 + ((code - 33 + 47) % 94))
    }
    return char
  })
}
