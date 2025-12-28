import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

const vowels = ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']

const toPigLatin = (word: string): string => {
  if (!word) return ''

  // If word starts with a vowel, add 'way' at the end
  if (vowels.includes(word[0])) {
    return word + 'way'
  }

  // Find the first vowel position
  let firstVowelIndex = -1
  for (let i = 0; i < word.length; i++) {
    if (vowels.includes(word[i])) {
      firstVowelIndex = i
      break
    }
  }

  // If no vowel found, just add 'ay'
  if (firstVowelIndex === -1) {
    return word + 'ay'
  }

  // Move consonants before first vowel to the end and add 'ay'
  const prefix = word.slice(0, firstVowelIndex)
  const rest = word.slice(firstVowelIndex)

  // Preserve capitalization
  if (word[0] === word[0].toUpperCase()) {
    return rest.charAt(0).toUpperCase() + rest.slice(1).toLowerCase() + prefix.toLowerCase() + 'ay'
  }

  return rest + prefix + 'ay'
}

const textToPigLatin = (text: string): string => {
  if (!text) return ''
  return text.replace(/\b([a-zA-Z]+)\b/g, (match) => toPigLatin(match))
}

const fromPigLatin = (word: string): string => {
  if (!word) return ''

  // Check if ends with 'way' (word started with vowel)
  if (word.toLowerCase().endsWith('way')) {
    const result = word.slice(0, -3)
    return result
  }

  // Check if ends with 'ay' (word started with consonant)
  if (word.toLowerCase().endsWith('ay')) {
    const base = word.slice(0, -2)
    // Find the consonant cluster at the end (moved from beginning)
    // This is tricky - we need to find where the original word started
    // For simplicity, we'll try to find the vowel that marks the start
    for (let i = base.length - 1; i >= 0; i--) {
      if (vowels.includes(base[i])) {
        const suffix = base.slice(i + 1)
        const prefix = base.slice(0, i + 1)
        const result = suffix + prefix

        // Preserve capitalization
        if (word[0] === word[0].toUpperCase()) {
          return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase()
        }
        return result
      }
    }
  }

  return word
}

const pigLatinToText = (text: string): string => {
  if (!text) return ''
  return text.replace(/\b([a-zA-Z]+)\b/g, (match) => fromPigLatin(match))
}

export default function PigLatinConverter() {
  const { t } = useTranslation()
  const [textInput, setTextInput] = useState('')
  const [pigLatinInput, setPigLatinInput] = useState('')
  const { copied: textCopied, copy: copyText } = useClipboard()
  const { copied: pigLatinCopied, copy: copyPigLatin } = useClipboard()

  const handleTextChange = (val: string) => {
    setTextInput(val)
    setPigLatinInput(textToPigLatin(val))
  }

  const handlePigLatinChange = (val: string) => {
    setPigLatinInput(val)
    setTextInput(pigLatinToText(val))
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700">
              {t('tools.pigLatinConverter.text')}
            </label>
          </div>
          <TextArea
            value={textInput}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={t('tools.pigLatinConverter.textPlaceholder')}
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
              {t('tools.pigLatinConverter.pigLatin')}
            </label>
          </div>
          <TextArea
            value={pigLatinInput}
            onChange={(e) => handlePigLatinChange(e.target.value)}
            placeholder={t('tools.pigLatinConverter.pigLatinPlaceholder')}
            rows={8}
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => handlePigLatinChange('')} disabled={!pigLatinInput}>
              {t('common.clear')}
            </Button>
            <Button onClick={() => copyPigLatin(pigLatinInput)} disabled={!pigLatinInput}>
              {pigLatinCopied ? t('common.copied') : t('common.copy')}
            </Button>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.pigLatinConverter.rules')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.pigLatinConverter.rule1')}</li>
          <li>{t('tools.pigLatinConverter.rule2')}</li>
        </ul>
      </div>
    </div>
  )
}
