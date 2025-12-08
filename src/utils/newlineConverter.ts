export const convertNewlines = (text: string, type: 'windows' | 'unix' | 'mac'): string => {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  switch (type) {
    case 'windows':
      return normalized.replace(/\n/g, '\r\n')
    case 'unix':
      return normalized
    case 'mac':
      return normalized.replace(/\n/g, '\r')
    default:
      return text
  }
}
