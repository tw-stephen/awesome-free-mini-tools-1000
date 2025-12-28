import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function AsciiConverter() {
  const { t } = useTranslation()
  const [text, setText] = useState('Hello')
  const [format, setFormat] = useState<'decimal' | 'hex' | 'binary' | 'octal'>('decimal')
  const [separator, setSeparator] = useState(' ')
  const { copy, copied } = useClipboard()

  const textToAscii = useCallback(
    (input: string): string => {
      return input
        .split('')
        .map((char) => {
          const code = char.charCodeAt(0)
          switch (format) {
            case 'decimal':
              return code.toString()
            case 'hex':
              return code.toString(16).toUpperCase().padStart(2, '0')
            case 'binary':
              return code.toString(2).padStart(8, '0')
            case 'octal':
              return code.toString(8).padStart(3, '0')
          }
        })
        .join(separator)
    },
    [format, separator]
  )

  const asciiToText = useCallback(
    (input: string): string => {
      const sep = separator || ' '
      const parts = input.split(sep).filter(Boolean)

      return parts
        .map((part) => {
          let code: number
          switch (format) {
            case 'decimal':
              code = parseInt(part, 10)
              break
            case 'hex':
              code = parseInt(part, 16)
              break
            case 'binary':
              code = parseInt(part, 2)
              break
            case 'octal':
              code = parseInt(part, 8)
              break
          }
          if (isNaN(code) || code < 0 || code > 127) return ''
          return String.fromCharCode(code)
        })
        .join('')
    },
    [format, separator]
  )

  const asciiOutput = textToAscii(text)

  const printableAscii = Array.from({ length: 95 }, (_, i) => {
    const code = i + 32
    return {
      char: String.fromCharCode(code),
      code,
      hex: code.toString(16).toUpperCase().padStart(2, '0'),
      binary: code.toString(2).padStart(8, '0'),
    }
  })

  const controlChars = Array.from({ length: 32 }, (_, i) => {
    const names = [
      'NUL', 'SOH', 'STX', 'ETX', 'EOT', 'ENQ', 'ACK', 'BEL',
      'BS', 'HT', 'LF', 'VT', 'FF', 'CR', 'SO', 'SI',
      'DLE', 'DC1', 'DC2', 'DC3', 'DC4', 'NAK', 'SYN', 'ETB',
      'CAN', 'EM', 'SUB', 'ESC', 'FS', 'GS', 'RS', 'US',
    ]
    return {
      name: names[i],
      code: i,
      hex: i.toString(16).toUpperCase().padStart(2, '0'),
    }
  })

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.asciiConverter.textToAscii')}
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.asciiConverter.text')}
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Hello"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
            />
          </div>

          <div className="flex gap-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.asciiConverter.format')}
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as typeof format)}
                className="px-3 py-2 border border-slate-300 rounded-lg"
              >
                <option value="decimal">{t('tools.asciiConverter.decimal')}</option>
                <option value="hex">{t('tools.asciiConverter.hex')}</option>
                <option value="binary">{t('tools.asciiConverter.binary')}</option>
                <option value="octal">{t('tools.asciiConverter.octal')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.asciiConverter.separator')}
              </label>
              <select
                value={separator}
                onChange={(e) => setSeparator(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg"
              >
                <option value=" ">{t('tools.asciiConverter.space')}</option>
                <option value=",">{t('tools.asciiConverter.comma')}</option>
                <option value="">{t('tools.asciiConverter.none')}</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">
                {t('tools.asciiConverter.output')}
              </span>
              <Button variant="secondary" onClick={() => copy(asciiOutput)}>
                {copied ? t('common.copied') : t('common.copy')}
              </Button>
            </div>
            <p className="font-mono text-slate-800 break-all">{asciiOutput || '-'}</p>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.asciiConverter.asciiToText')}
        </h3>

        <div className="space-y-3">
          <TextArea
            placeholder={
              format === 'decimal'
                ? '72 101 108 108 111'
                : format === 'hex'
                  ? '48 65 6C 6C 6F'
                  : format === 'binary'
                    ? '01001000 01100101 01101100 01101100 01101111'
                    : '110 145 154 154 157'
            }
            rows={3}
            className="font-mono text-sm"
            onChange={(e) => {
              const decoded = asciiToText(e.target.value)
              if (decoded) setText(decoded)
            }}
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.asciiConverter.printableChars')}
        </h3>

        <div className="grid grid-cols-8 gap-1 text-xs">
          {printableAscii.map((item) => (
            <button
              key={item.code}
              onClick={() => setText(text + item.char)}
              className="p-2 bg-slate-50 rounded hover:bg-slate-100 text-center"
              title={`Dec: ${item.code}, Hex: ${item.hex}`}
            >
              <div className="font-mono text-lg">{item.char === ' ' ? '␣' : item.char}</div>
              <div className="text-slate-500">{item.code}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.asciiConverter.controlChars')}
        </h3>

        <div className="grid grid-cols-8 gap-1 text-xs">
          {controlChars.map((item) => (
            <div
              key={item.code}
              className="p-2 bg-slate-50 rounded text-center"
              title={`Hex: ${item.hex}`}
            >
              <div className="font-mono text-sm text-slate-600">{item.name}</div>
              <div className="text-slate-500">{item.code}</div>
            </div>
          ))}
          <div className="p-2 bg-slate-50 rounded text-center">
            <div className="font-mono text-sm text-slate-600">DEL</div>
            <div className="text-slate-500">127</div>
          </div>
        </div>
      </div>
    </div>
  )
}
