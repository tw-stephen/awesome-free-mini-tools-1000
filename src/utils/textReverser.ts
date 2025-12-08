export type ReverseMode = 'text' | 'words' | 'lines'

export const reverseText = (text: string, mode: ReverseMode): string => {
  switch (mode) {
    case 'text':
      return Array.from(text).reverse().join('')
    case 'words':
      // Split by whitespace but keep the whitespace? Or just reverse words array?
      // Usually "Reverse Words" means "Hello World" -> "World Hello"
      // Let's split by spaces for simplicity for now, or use regex to preserve delimiters.
      // But typically it's just words reversing.
      // If we want to preserve lines, we should process line by line.
      return text.split('\n').map(line => line.split(/\s+/).reverse().join(' ')).join('\n')
    case 'lines':
      return text.split('\n').reverse().join('\n')
    default:
      return text
  }
}
