import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

// Zero-width characters for encoding
const ZERO_WIDTH_CHARS = {
  SPACE: '\u200B', // Zero-width space (0)
  JOINER: '\u200D', // Zero-width joiner (1)
  NON_JOINER: '\u200C', // Zero-width non-joiner (separator)
}

// Encode text to binary using zero-width characters
const encodeToZeroWidth = (secret: string): string => {
  let result = ''

  for (const char of secret) {
    const binary = char.charCodeAt(0).toString(2).padStart(16, '0')
    for (const bit of binary) {
      result += bit === '0' ? ZERO_WIDTH_CHARS.SPACE : ZERO_WIDTH_CHARS.JOINER
    }
    result += ZERO_WIDTH_CHARS.NON_JOINER
  }

  return result
}

// Decode zero-width characters back to text
const decodeFromZeroWidth = (encoded: string): string => {
  let result = ''
  let binary = ''

  for (const char of encoded) {
    if (char === ZERO_WIDTH_CHARS.SPACE) {
      binary += '0'
    } else if (char === ZERO_WIDTH_CHARS.JOINER) {
      binary += '1'
    } else if (char === ZERO_WIDTH_CHARS.NON_JOINER) {
      if (binary.length > 0) {
        const charCode = parseInt(binary, 2)
        if (charCode > 0) {
          result += String.fromCharCode(charCode)
        }
        binary = ''
      }
    }
  }

  // Handle remaining binary
  if (binary.length > 0) {
    const charCode = parseInt(binary, 2)
    if (charCode > 0) {
      result += String.fromCharCode(charCode)
    }
  }

  return result
}

// Hide secret message in cover text
const hideMessage = (cover: string, secret: string): string => {
  if (!cover || !secret) return cover

  const encoded = encodeToZeroWidth(secret)
  // Insert encoded message after the first character
  if (cover.length >= 1) {
    return cover[0] + encoded + cover.slice(1)
  }
  return encoded + cover
}

// Extract hidden message from text
const extractMessage = (text: string): string => {
  // Filter only zero-width characters
  let encoded = ''
  for (const char of text) {
    if (
      char === ZERO_WIDTH_CHARS.SPACE ||
      char === ZERO_WIDTH_CHARS.JOINER ||
      char === ZERO_WIDTH_CHARS.NON_JOINER
    ) {
      encoded += char
    }
  }
  return decodeFromZeroWidth(encoded)
}

// Count zero-width characters in text
const countZeroWidth = (text: string): number => {
  let count = 0
  for (const char of text) {
    if (
      char === ZERO_WIDTH_CHARS.SPACE ||
      char === ZERO_WIDTH_CHARS.JOINER ||
      char === ZERO_WIDTH_CHARS.NON_JOINER
    ) {
      count++
    }
  }
  return count
}

export default function TextSteganography() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'hide' | 'extract'>('hide')
  const [coverText, setCoverText] = useState('')
  const [secretMessage, setSecretMessage] = useState('')
  const [resultText, setResultText] = useState('')
  const [extractedMessage, setExtractedMessage] = useState('')
  const { copied, copy } = useClipboard()

  const handleHide = useCallback(() => {
    if (!coverText.trim() || !secretMessage.trim()) {
      return
    }
    const result = hideMessage(coverText, secretMessage)
    setResultText(result)
  }, [coverText, secretMessage])

  const handleExtract = useCallback(() => {
    if (!resultText.trim()) {
      setExtractedMessage('')
      return
    }
    const extracted = extractMessage(resultText)
    setExtractedMessage(extracted)
  }, [resultText])

  const handleClear = () => {
    setCoverText('')
    setSecretMessage('')
    setResultText('')
    setExtractedMessage('')
  }

  const zeroWidthCount = countZeroWidth(resultText)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          <Button
            variant={mode === 'hide' ? 'primary' : 'secondary'}
            onClick={() => setMode('hide')}
          >
            {t('tools.textSteganography.hide')}
          </Button>
          <Button
            variant={mode === 'extract' ? 'primary' : 'secondary'}
            onClick={() => setMode('extract')}
          >
            {t('tools.textSteganography.extract')}
          </Button>
        </div>

        {mode === 'hide' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('tools.textSteganography.coverText')}
              </label>
              <TextArea
                value={coverText}
                onChange={(e) => setCoverText(e.target.value)}
                placeholder={t('tools.textSteganography.coverPlaceholder')}
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('tools.textSteganography.secretMessage')}
              </label>
              <TextArea
                value={secretMessage}
                onChange={(e) => setSecretMessage(e.target.value)}
                placeholder={t('tools.textSteganography.secretPlaceholder')}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="primary" onClick={handleHide} disabled={!coverText || !secretMessage}>
                {t('tools.textSteganography.hideButton')}
              </Button>
              <Button variant="secondary" onClick={handleClear}>
                {t('common.clear')}
              </Button>
            </div>

            {resultText && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    {t('tools.textSteganography.result')}
                  </label>
                  <span className="text-sm text-slate-500">
                    {t('tools.textSteganography.hiddenChars')}: {zeroWidthCount}
                  </span>
                </div>
                <TextArea value={resultText} readOnly rows={4} className="bg-slate-50" />
                <div className="mt-2 flex gap-2">
                  <Button onClick={() => copy(resultText)}>
                    {copied ? t('common.copied') : t('common.copy')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('tools.textSteganography.textWithHidden')}
              </label>
              <TextArea
                value={resultText}
                onChange={(e) => setResultText(e.target.value)}
                placeholder={t('tools.textSteganography.extractPlaceholder')}
                rows={4}
              />
              {resultText && (
                <p className="mt-1 text-sm text-slate-500">
                  {t('tools.textSteganography.hiddenChars')}: {zeroWidthCount}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="primary" onClick={handleExtract} disabled={!resultText}>
                {t('tools.textSteganography.extractButton')}
              </Button>
              <Button variant="secondary" onClick={() => setResultText('')}>
                {t('common.clear')}
              </Button>
            </div>

            {extractedMessage && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('tools.textSteganography.extractedMessage')}
                </label>
                <TextArea value={extractedMessage} readOnly rows={3} className="bg-green-50" />
                <div className="mt-2">
                  <Button onClick={() => copy(extractedMessage)}>
                    {copied ? t('common.copied') : t('common.copy')}
                  </Button>
                </div>
              </div>
            )}

            {resultText && !extractedMessage && zeroWidthCount === 0 && (
              <div className="p-3 text-sm text-amber-600 bg-amber-50 rounded-lg">
                {t('tools.textSteganography.noHiddenMessage')}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.textSteganography.howItWorks')}
        </h3>
        <p className="text-sm text-slate-500">{t('tools.textSteganography.explanation')}</p>
      </div>
    </div>
  )
}
