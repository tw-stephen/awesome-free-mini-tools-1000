import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function TextToBinary() {
  const { t } = useTranslation()
  const [text, setText] = useState('Hello World!')
  const [separator, setSeparator] = useState(' ')
  const [encoding, setEncoding] = useState<'utf8' | 'ascii'>('utf8')
  const { copy, copied } = useClipboard()

  const textToBinary = useCallback(
    (input: string): string => {
      if (!input) return ''

      if (encoding === 'ascii') {
        return input
          .split('')
          .map((char) => {
            const code = char.charCodeAt(0)
            if (code > 127) return '????????' // Non-ASCII
            return code.toString(2).padStart(8, '0')
          })
          .join(separator)
      }

      // UTF-8 encoding
      const encoder = new TextEncoder()
      const bytes = encoder.encode(input)
      return Array.from(bytes)
        .map((byte) => byte.toString(2).padStart(8, '0'))
        .join(separator)
    },
    [separator, encoding]
  )

  const binaryToText = useCallback(
    (binary: string): string => {
      if (!binary.trim()) return ''

      try {
        // Split by separator or by 8-character groups
        let bytes: string[]
        if (separator) {
          bytes = binary.split(separator).filter(Boolean)
        } else {
          bytes = binary.match(/.{1,8}/g) || []
        }

        const byteArray = bytes.map((b) => {
          const num = parseInt(b.trim(), 2)
          if (isNaN(num)) throw new Error('Invalid binary')
          return num
        })

        if (encoding === 'ascii') {
          return byteArray.map((b) => String.fromCharCode(b)).join('')
        }

        // UTF-8 decoding
        const decoder = new TextDecoder('utf-8')
        return decoder.decode(new Uint8Array(byteArray))
      } catch {
        return ''
      }
    },
    [separator, encoding]
  )

  const binaryOutput = textToBinary(text)

  const stats = {
    characters: text.length,
    bytes: new TextEncoder().encode(text).length,
    bits: new TextEncoder().encode(text).length * 8,
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.textToBinary.input')}
          </h3>
          <div className="flex gap-2">
            <select
              value={encoding}
              onChange={(e) => setEncoding(e.target.value as typeof encoding)}
              className="px-2 py-1 text-sm border border-slate-300 rounded"
            >
              <option value="utf8">UTF-8</option>
              <option value="ascii">ASCII</option>
            </select>
            <select
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              className="px-2 py-1 text-sm border border-slate-300 rounded"
            >
              <option value=" ">{t('tools.textToBinary.space')}</option>
              <option value="">{t('tools.textToBinary.none')}</option>
              <option value="\n">{t('tools.textToBinary.newline')}</option>
            </select>
            <Button variant="secondary" onClick={() => setText('')}>
              {t('common.clear')}
            </Button>
          </div>
        </div>
        <TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('tools.textToBinary.inputPlaceholder')}
          rows={4}
          className="font-mono"
        />
      </div>

      <div className="card p-4 bg-blue-50 border border-blue-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-mono text-blue-600">{stats.characters}</p>
            <p className="text-xs text-blue-700">{t('tools.textToBinary.characters')}</p>
          </div>
          <div>
            <p className="text-2xl font-mono text-blue-600">{stats.bytes}</p>
            <p className="text-xs text-blue-700">{t('tools.textToBinary.bytes')}</p>
          </div>
          <div>
            <p className="text-2xl font-mono text-blue-600">{stats.bits}</p>
            <p className="text-xs text-blue-700">{t('tools.textToBinary.bits')}</p>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.textToBinary.binaryOutput')}
          </h3>
          <Button variant="secondary" onClick={() => copy(binaryOutput)}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>
        <TextArea
          value={binaryOutput}
          readOnly
          rows={6}
          className="font-mono text-sm bg-slate-50"
        />
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.textToBinary.binaryToText')}
        </h3>
        <TextArea
          placeholder="01001000 01100101 01101100 01101100 01101111"
          rows={4}
          className="font-mono text-sm"
          onChange={(e) => {
            const decoded = binaryToText(e.target.value)
            if (decoded) setText(decoded)
          }}
        />
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.textToBinary.asciiTable')}
        </h3>

        <div className="grid grid-cols-8 gap-1 text-xs">
          {Array.from({ length: 95 }, (_, i) => {
            const code = i + 32
            const char = String.fromCharCode(code)
            const binary = code.toString(2).padStart(8, '0')
            return (
              <button
                key={code}
                onClick={() => setText(text + char)}
                className="p-1 bg-slate-50 rounded hover:bg-slate-100 text-center"
                title={`${code}: ${binary}`}
              >
                <div className="font-mono">{char === ' ' ? '␣' : char}</div>
                <div className="text-slate-400 text-[10px]">{binary.slice(-4)}</div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
