export const cleanWhitespace = (
  text: string,
  options: {
    trimLines: boolean
    removeEmptyLines: boolean
    removeExtraSpaces: boolean
    trimText: boolean
  }
): string => {
  let result = text

  if (options.trimLines) {
    result = result
      .split('\n')
      .map((line) => line.trim())
      .join('\n')
  }

  if (options.removeEmptyLines) {
    result = result
      .split('\n')
      .filter((line) => line.trim() !== '')
      .join('\n')
  }

  if (options.removeExtraSpaces) {
    result = result.replace(/[ \t]+/g, ' ')
  }

  if (options.trimText) {
    result = result.trim()
  }

  return result
}
