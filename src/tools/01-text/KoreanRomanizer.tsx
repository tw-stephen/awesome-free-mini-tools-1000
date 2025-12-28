import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

// Korean Hangul components
const INITIALS = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
const MEDIALS = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ']
const FINALS = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']

// Romanization (Revised Romanization of Korean)
const INITIAL_ROMAN: Record<string, string> = {
  'ㄱ': 'g', 'ㄲ': 'kk', 'ㄴ': 'n', 'ㄷ': 'd', 'ㄸ': 'tt',
  'ㄹ': 'r', 'ㅁ': 'm', 'ㅂ': 'b', 'ㅃ': 'pp', 'ㅅ': 's',
  'ㅆ': 'ss', 'ㅇ': '', 'ㅈ': 'j', 'ㅉ': 'jj', 'ㅊ': 'ch',
  'ㅋ': 'k', 'ㅌ': 't', 'ㅍ': 'p', 'ㅎ': 'h'
}

const MEDIAL_ROMAN: Record<string, string> = {
  'ㅏ': 'a', 'ㅐ': 'ae', 'ㅑ': 'ya', 'ㅒ': 'yae', 'ㅓ': 'eo',
  'ㅔ': 'e', 'ㅕ': 'yeo', 'ㅖ': 'ye', 'ㅗ': 'o', 'ㅘ': 'wa',
  'ㅙ': 'wae', 'ㅚ': 'oe', 'ㅛ': 'yo', 'ㅜ': 'u', 'ㅝ': 'wo',
  'ㅞ': 'we', 'ㅟ': 'wi', 'ㅠ': 'yu', 'ㅡ': 'eu', 'ㅢ': 'ui',
  'ㅣ': 'i'
}

const FINAL_ROMAN: Record<string, string> = {
  '': '', 'ㄱ': 'k', 'ㄲ': 'k', 'ㄳ': 'k', 'ㄴ': 'n',
  'ㄵ': 'n', 'ㄶ': 'n', 'ㄷ': 't', 'ㄹ': 'l', 'ㄺ': 'k',
  'ㄻ': 'm', 'ㄼ': 'l', 'ㄽ': 'l', 'ㄾ': 'l', 'ㄿ': 'p',
  'ㅀ': 'l', 'ㅁ': 'm', 'ㅂ': 'p', 'ㅄ': 'p', 'ㅅ': 't',
  'ㅆ': 't', 'ㅇ': 'ng', 'ㅈ': 't', 'ㅊ': 't', 'ㅋ': 'k',
  'ㅌ': 't', 'ㅍ': 'p', 'ㅎ': 't'
}

// Decompose a Hangul syllable into its components
const decomposeHangul = (char: string): { initial: string; medial: string; final: string } | null => {
  const code = char.charCodeAt(0)

  // Check if it's a Hangul syllable (가-힣)
  if (code < 0xAC00 || code > 0xD7A3) {
    return null
  }

  const syllableIndex = code - 0xAC00
  const initialIndex = Math.floor(syllableIndex / (21 * 28))
  const medialIndex = Math.floor((syllableIndex % (21 * 28)) / 28)
  const finalIndex = syllableIndex % 28

  return {
    initial: INITIALS[initialIndex],
    medial: MEDIALS[medialIndex],
    final: FINALS[finalIndex]
  }
}

// Convert Korean text to Romanization
const koreanToRoman = (text: string): string => {
  if (!text) return ''

  let result = ''
  for (const char of text) {
    const decomposed = decomposeHangul(char)
    if (decomposed) {
      result += INITIAL_ROMAN[decomposed.initial] || ''
      result += MEDIAL_ROMAN[decomposed.medial] || ''
      result += FINAL_ROMAN[decomposed.final] || ''
    } else {
      result += char
    }
  }
  return result
}

// Simple Jamo display
const getJamo = (text: string): string => {
  if (!text) return ''

  let result = ''
  for (const char of text) {
    const decomposed = decomposeHangul(char)
    if (decomposed) {
      result += decomposed.initial + decomposed.medial + decomposed.final
    } else {
      result += char
    }
  }
  return result
}

export default function KoreanRomanizer() {
  const { t } = useTranslation()
  const [koreanInput, setKoreanInput] = useState('')
  const { copied: romanCopied, copy: copyRoman } = useClipboard()
  const { copied: jamoCopied, copy: copyJamo } = useClipboard()

  const romanOutput = koreanToRoman(koreanInput)
  const jamoOutput = getJamo(koreanInput)

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-700">
            {t('tools.koreanRomanizer.korean')}
          </label>
        </div>
        <TextArea
          value={koreanInput}
          onChange={(e) => setKoreanInput(e.target.value)}
          placeholder={t('tools.koreanRomanizer.koreanPlaceholder')}
          rows={6}
          className="font-mono text-lg"
        />
        <div className="mt-3 flex justify-end">
          <Button variant="secondary" onClick={() => setKoreanInput('')} disabled={!koreanInput}>
            {t('common.clear')}
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700">
              {t('tools.koreanRomanizer.romanization')}
            </label>
          </div>
          <TextArea
            value={romanOutput}
            readOnly
            placeholder={t('tools.koreanRomanizer.romanPlaceholder')}
            rows={6}
            className="font-mono"
          />
          <div className="mt-3 flex justify-end">
            <Button onClick={() => copyRoman(romanOutput)} disabled={!romanOutput}>
              {romanCopied ? t('common.copied') : t('common.copy')}
            </Button>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700">
              {t('tools.koreanRomanizer.jamo')}
            </label>
          </div>
          <TextArea
            value={jamoOutput}
            readOnly
            placeholder={t('tools.koreanRomanizer.jamoPlaceholder')}
            rows={6}
            className="font-mono text-lg"
          />
          <div className="mt-3 flex justify-end">
            <Button onClick={() => copyJamo(jamoOutput)} disabled={!jamoOutput}>
              {jamoCopied ? t('common.copied') : t('common.copy')}
            </Button>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.koreanRomanizer.reference')}</h3>
        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {[
            ['ㄱ', 'g/k'], ['ㄴ', 'n'], ['ㄷ', 'd/t'], ['ㄹ', 'r/l'], ['ㅁ', 'm'], ['ㅂ', 'b/p'], ['ㅅ', 's/t'],
            ['ㅇ', '-/ng'], ['ㅈ', 'j'], ['ㅊ', 'ch'], ['ㅋ', 'k'], ['ㅌ', 't'], ['ㅍ', 'p'], ['ㅎ', 'h'],
          ].map(([jamo, roman], i) => (
            <div key={i} className="bg-slate-50 p-2 rounded">
              <div className="text-lg">{jamo}</div>
              <div className="text-slate-500 text-xs">{roman}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-7 gap-2 text-center text-sm">
          {[
            ['ㅏ', 'a'], ['ㅓ', 'eo'], ['ㅗ', 'o'], ['ㅜ', 'u'], ['ㅡ', 'eu'], ['ㅣ', 'i'], ['ㅐ', 'ae'],
            ['ㅔ', 'e'], ['ㅑ', 'ya'], ['ㅕ', 'yeo'], ['ㅛ', 'yo'], ['ㅠ', 'yu'], ['ㅘ', 'wa'], ['ㅚ', 'oe'],
          ].map(([jamo, roman], i) => (
            <div key={i} className="bg-slate-50 p-2 rounded">
              <div className="text-lg">{jamo}</div>
              <div className="text-slate-500 text-xs">{roman}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
