export const addLineNumbers = (
  text: string,
  start: number = 1,
  separator: string = '. '
): string => {
  if (!text) return ''
  return text
    .split('\n')
    .map((line, index) => `${start + index}${separator}${line}`)
    .join('\n')
}
