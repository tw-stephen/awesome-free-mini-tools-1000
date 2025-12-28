import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'

// Simple block font - each character is 5 lines tall
const blockFont: Record<string, string[]> = {
  'A': ['  █  ', ' █ █ ', '█████', '█   █', '█   █'],
  'B': ['████ ', '█   █', '████ ', '█   █', '████ '],
  'C': [' ████', '█    ', '█    ', '█    ', ' ████'],
  'D': ['████ ', '█   █', '█   █', '█   █', '████ '],
  'E': ['█████', '█    ', '████ ', '█    ', '█████'],
  'F': ['█████', '█    ', '████ ', '█    ', '█    '],
  'G': [' ████', '█    ', '█  ██', '█   █', ' ████'],
  'H': ['█   █', '█   █', '█████', '█   █', '█   █'],
  'I': ['█████', '  █  ', '  █  ', '  █  ', '█████'],
  'J': ['█████', '    █', '    █', '█   █', ' ███ '],
  'K': ['█   █', '█  █ ', '███  ', '█  █ ', '█   █'],
  'L': ['█    ', '█    ', '█    ', '█    ', '█████'],
  'M': ['█   █', '██ ██', '█ █ █', '█   █', '█   █'],
  'N': ['█   █', '██  █', '█ █ █', '█  ██', '█   █'],
  'O': [' ███ ', '█   █', '█   █', '█   █', ' ███ '],
  'P': ['████ ', '█   █', '████ ', '█    ', '█    '],
  'Q': [' ███ ', '█   █', '█   █', '█  █ ', ' ██ █'],
  'R': ['████ ', '█   █', '████ ', '█  █ ', '█   █'],
  'S': [' ████', '█    ', ' ███ ', '    █', '████ '],
  'T': ['█████', '  █  ', '  █  ', '  █  ', '  █  '],
  'U': ['█   █', '█   █', '█   █', '█   █', ' ███ '],
  'V': ['█   █', '█   █', '█   █', ' █ █ ', '  █  '],
  'W': ['█   █', '█   █', '█ █ █', '██ ██', '█   █'],
  'X': ['█   █', ' █ █ ', '  █  ', ' █ █ ', '█   █'],
  'Y': ['█   █', ' █ █ ', '  █  ', '  █  ', '  █  '],
  'Z': ['█████', '   █ ', '  █  ', ' █   ', '█████'],
  '0': [' ███ ', '█  ██', '█ █ █', '██  █', ' ███ '],
  '1': ['  █  ', ' ██  ', '  █  ', '  █  ', '█████'],
  '2': [' ███ ', '█   █', '  ██ ', ' █   ', '█████'],
  '3': ['█████', '   █ ', '  ██ ', '    █', '████ '],
  '4': ['█   █', '█   █', '█████', '    █', '    █'],
  '5': ['█████', '█    ', '████ ', '    █', '████ '],
  '6': [' ████', '█    ', '████ ', '█   █', ' ███ '],
  '7': ['█████', '    █', '   █ ', '  █  ', '  █  '],
  '8': [' ███ ', '█   █', ' ███ ', '█   █', ' ███ '],
  '9': [' ███ ', '█   █', ' ████', '    █', '████ '],
  ' ': ['     ', '     ', '     ', '     ', '     '],
  '!': ['  █  ', '  █  ', '  █  ', '     ', '  █  '],
  '?': [' ███ ', '█   █', '  ██ ', '     ', '  █  '],
  '.': ['     ', '     ', '     ', '     ', '  █  '],
  ',': ['     ', '     ', '     ', '  █  ', ' █   '],
  '-': ['     ', '     ', '█████', '     ', '     '],
  '+': ['     ', '  █  ', '█████', '  █  ', '     '],
  '=': ['     ', '█████', '     ', '█████', '     '],
  '/': ['    █', '   █ ', '  █  ', ' █   ', '█    '],
  '\\': ['█    ', ' █   ', '  █  ', '   █ ', '    █'],
  '@': [' ███ ', '█ █ █', '█ ██ ', '█    ', ' ███ '],
  '#': [' █ █ ', '█████', ' █ █ ', '█████', ' █ █ '],
  ':': ['     ', '  █  ', '     ', '  █  ', '     '],
  ';': ['     ', '  █  ', '     ', '  █  ', ' █   '],
  '(': ['  █  ', ' █   ', ' █   ', ' █   ', '  █  '],
  ')': ['  █  ', '   █ ', '   █ ', '   █ ', '  █  '],
  '[': [' ██  ', ' █   ', ' █   ', ' █   ', ' ██  '],
  ']': ['  ██ ', '   █ ', '   █ ', '   █ ', '  ██ '],
  '<': ['   █ ', '  █  ', ' █   ', '  █  ', '   █ '],
  '>': [' █   ', '  █  ', '   █ ', '  █  ', ' █   '],
  '*': ['     ', '█ █ █', ' ███ ', '█ █ █', '     '],
  '&': [' ██  ', '█  █ ', ' ██ █', '█  █ ', ' ██ █'],
  '%': ['█   █', '   █ ', '  █  ', ' █   ', '█   █'],
  '$': [' ████', '█ █  ', ' ███ ', '  █ █', '████ '],
  '_': ['     ', '     ', '     ', '     ', '█████'],
  "'": ['  █  ', '  █  ', '     ', '     ', '     '],
  '"': [' █ █ ', ' █ █ ', '     ', '     ', '     '],
}

const generateAsciiArt = (text: string): string => {
  if (!text) return ''

  const upperText = text.toUpperCase()
  const lines: string[] = ['', '', '', '', '']

  for (const char of upperText) {
    const charArt = blockFont[char] || blockFont[' ']
    for (let i = 0; i < 5; i++) {
      lines[i] += charArt[i] + ' '
    }
  }

  return lines.join('\n')
}

export default function AsciiArtGenerator() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const { copied, copy } = useClipboard()

  const output = useMemo(() => generateAsciiArt(input), [input])

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-700">
            {t('tools.asciiArtGenerator.input')}
          </label>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('tools.asciiArtGenerator.inputPlaceholder')}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={20}
        />
        <p className="mt-2 text-xs text-slate-500">
          {t('tools.asciiArtGenerator.hint')}
        </p>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-700">
            {t('tools.asciiArtGenerator.output')}
          </label>
          <Button onClick={() => copy(output)} disabled={!output}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>
        <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs font-mono min-h-[150px]">
          {output || t('tools.asciiArtGenerator.placeholder')}
        </pre>
      </div>
    </div>
  )
}
