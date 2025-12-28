import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

const morseCode: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.', ' ': '/'
}

const reverseMorseCode: Record<string, string> = Object.entries(morseCode).reduce(
  (acc, [char, code]) => ({ ...acc, [code]: char }),
  {}
)

const textToMorse = (text: string): string => {
  if (!text) return ''
  return text
    .toUpperCase()
    .split('')
    .map(char => morseCode[char] || char)
    .join(' ')
}

const morseToText = (morse: string): string => {
  if (!morse) return ''
  return morse
    .split(' ')
    .map(code => {
      if (code === '/') return ' '
      return reverseMorseCode[code] || code
    })
    .join('')
}

export default function MorseCodeConverter() {
  const { t } = useTranslation()
  const [textInput, setTextInput] = useState('')
  const [morseInput, setMorseInput] = useState('')
  const { copied: textCopied, copy: copyText } = useClipboard()
  const { copied: morseCopied, copy: copyMorse } = useClipboard()

  const handleTextChange = (val: string) => {
    setTextInput(val)
    setMorseInput(textToMorse(val))
  }

  const handleMorseChange = (val: string) => {
    setMorseInput(val)
    setTextInput(morseToText(val))
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700">
              {t('tools.morseCodeConverter.text')}
            </label>
          </div>
          <TextArea
            value={textInput}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={t('tools.morseCodeConverter.textPlaceholder')}
            rows={8}
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => handleTextChange('')} disabled={!textInput}>
              {t('common.clear')}
            </Button>
            <Button onClick={() => copyText(textInput)} disabled={!textInput}>
              {textCopied ? t('common.copied') : t('common.copy')}
            </Button>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700">
              {t('tools.morseCodeConverter.morse')}
            </label>
          </div>
          <TextArea
            value={morseInput}
            onChange={(e) => handleMorseChange(e.target.value)}
            placeholder={t('tools.morseCodeConverter.morsePlaceholder')}
            rows={8}
            className="font-mono"
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => handleMorseChange('')} disabled={!morseInput}>
              {t('common.clear')}
            </Button>
            <Button onClick={() => copyMorse(morseInput)} disabled={!morseInput}>
              {morseCopied ? t('common.copied') : t('common.copy')}
            </Button>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.morseCodeConverter.reference')}
        </h3>
        <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-2 text-xs">
          {Object.entries(morseCode).slice(0, 36).map(([char, code]) => (
            <div key={char} className="bg-slate-100 p-2 rounded text-center">
              <div className="font-bold">{char === ' ' ? '␣' : char}</div>
              <div className="text-slate-500 font-mono">{code}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
