export const splitText = (
  text: string,
  separator: string,
  ignoreEmpty: boolean = true,
  trimItems: boolean = true
): string[] => {
  if (!text) return []
  if (separator === '') return text.split('')

  let items = text.split(separator)

  if (trimItems) {
    items = items.map((item) => item.trim())
  }

  if (ignoreEmpty) {
    items = items.filter((item) => item !== '')
  }

  return items
}
