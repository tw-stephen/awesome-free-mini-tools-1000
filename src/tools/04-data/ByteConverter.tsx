import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

type ByteFormat = 'hex' | 'decimal' | 'binary' | 'base64' | 'text'

export default function ByteConverter() {
  const { t } = useTranslation()
  const [input, setInput] = useState('48 65 6C 6C 6F')
  const [inputFormat, setInputFormat] = useState<ByteFormat>('hex')
  const [error, setError] = useState('')
  const { copy, copied } = useClipboard()

  const parseInput = useCallback((): Uint8Array | null => {
    try {
      setError('')

      switch (inputFormat) {
        case 'hex': {
          const cleaned = input.replace(/\s+/g, '').replace(/0x/gi, '')
          if (!/^[0-9a-fA-F]*$/.test(cleaned)) {
            setError(t('tools.byteConverter.invalidHex'))
            return null
          }
          const bytes = []
          for (let i = 0; i < cleaned.length; i += 2) {
            bytes.push(parseInt(cleaned.slice(i, i + 2), 16))
          }
          return new Uint8Array(bytes)
        }

        case 'decimal': {
          const nums = input.split(/[\s,]+/).filter(Boolean)
          const bytes = nums.map((n) => {
            const num = parseInt(n, 10)
            if (isNaN(num) || num < 0 || num > 255) {
              throw new Error('Invalid decimal')
            }
            return num
          })
          return new Uint8Array(bytes)
        }

        case 'binary': {
          const bins = input.split(/\s+/).filter(Boolean)
          const bytes = bins.map((b) => {
            if (!/^[01]+$/.test(b)) {
              throw new Error('Invalid binary')
            }
            const num = parseInt(b, 2)
            if (num > 255) {
              throw new Error('Binary value too large')
            }
            return num
          })
          return new Uint8Array(bytes)
        }

        case 'base64': {
          try {
            const decoded = atob(input.trim())
            const bytes = new Uint8Array(decoded.length)
            for (let i = 0; i < decoded.length; i++) {
              bytes[i] = decoded.charCodeAt(i)
            }
            return bytes
          } catch {
            setError(t('tools.byteConverter.invalidBase64'))
            return null
          }
        }

        case 'text': {
          const encoder = new TextEncoder()
          return encoder.encode(input)
        }
      }
    } catch (e) {
      setError(t('tools.byteConverter.parseError'))
      return null
    }
  }, [input, inputFormat, t])

  const convertTo = useCallback(
    (bytes: Uint8Array, format: ByteFormat): string => {
      switch (format) {
        case 'hex':
          return Array.from(bytes)
            .map((b) => b.toString(16).toUpperCase().padStart(2, '0'))
            .join(' ')

        case 'decimal':
          return Array.from(bytes).join(' ')

        case 'binary':
          return Array.from(bytes)
            .map((b) => b.toString(2).padStart(8, '0'))
            .join(' ')

        case 'base64':
          return btoa(String.fromCharCode(...bytes))

        case 'text':
          const decoder = new TextDecoder('utf-8', { fatal: false })
          return decoder.decode(bytes)
      }
    },
    []
  )

  const bytes = parseInput()
  const outputFormats: ByteFormat[] = ['hex', 'decimal', 'binary', 'base64', 'text']

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.byteConverter.input')}
          </h3>
          <div className="flex gap-2">
            <select
              value={inputFormat}
              onChange={(e) => setInputFormat(e.target.value as ByteFormat)}
              className="px-2 py-1 text-sm border border-slate-300 rounded"
            >
              <option value="hex">{t('tools.byteConverter.hex')}</option>
              <option value="decimal">{t('tools.byteConverter.decimal')}</option>
              <option value="binary">{t('tools.byteConverter.binary')}</option>
              <option value="base64">{t('tools.byteConverter.base64')}</option>
              <option value="text">{t('tools.byteConverter.text')}</option>
            </select>
            <Button variant="secondary" onClick={() => setInput('')}>
              {t('common.clear')}
            </Button>
          </div>
        </div>

        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            inputFormat === 'hex'
              ? '48 65 6C 6C 6F'
              : inputFormat === 'decimal'
                ? '72 101 108 108 111'
                : inputFormat === 'binary'
                  ? '01001000 01100101 01101100 01101100 01101111'
                  : inputFormat === 'base64'
                    ? 'SGVsbG8='
                    : 'Hello'
          }
          rows={4}
          className="font-mono text-sm"
        />

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {bytes && (
        <>
          <div className="card p-4 bg-blue-50 border border-blue-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-mono text-blue-600">{bytes.length}</p>
                <p className="text-xs text-blue-700">{t('tools.byteConverter.bytes')}</p>
              </div>
              <div>
                <p className="text-2xl font-mono text-blue-600">{bytes.length * 8}</p>
                <p className="text-xs text-blue-700">{t('tools.byteConverter.bits')}</p>
              </div>
              <div>
                <p className="text-2xl font-mono text-blue-600">
                  {bytes.length >= 1024
                    ? (bytes.length / 1024).toFixed(2)
                    : bytes.length}
                </p>
                <p className="text-xs text-blue-700">
                  {bytes.length >= 1024 ? 'KB' : 'B'}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.byteConverter.outputs')}
            </h3>

            <div className="space-y-4">
              {outputFormats.map((format) => {
                const output = convertTo(bytes, format)
                return (
                  <div key={format} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-600">
                        {t(`tools.byteConverter.${format}`)}
                      </span>
                      <Button variant="secondary" onClick={() => copy(output)}>
                        {copied ? t('common.copied') : t('common.copy')}
                      </Button>
                    </div>
                    <p className="font-mono text-sm text-slate-800 break-all whitespace-pre-wrap">
                      {output}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.byteConverter.byteView')}
            </h3>

            <div className="overflow-x-auto">
              <div className="flex gap-1 flex-wrap">
                {Array.from(bytes).map((byte, i) => (
                  <div
                    key={i}
                    className="p-2 bg-slate-100 rounded text-center min-w-[60px]"
                    title={`Index ${i}: Dec ${byte}, Hex ${byte.toString(16).toUpperCase().padStart(2, '0')}, Bin ${byte.toString(2).padStart(8, '0')}`}
                  >
                    <div className="font-mono text-xs text-slate-500">#{i}</div>
                    <div className="font-mono text-sm text-slate-800">
                      {byte.toString(16).toUpperCase().padStart(2, '0')}
                    </div>
                    <div className="font-mono text-xs text-slate-600">{byte}</div>
                    <div className="text-lg">
                      {byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : '·'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.byteConverter.formatHelp')}
        </h3>

        <div className="space-y-2 text-sm text-slate-600">
          <p>
            <strong>Hex:</strong> {t('tools.byteConverter.hexHelp')}
          </p>
          <p>
            <strong>Decimal:</strong> {t('tools.byteConverter.decimalHelp')}
          </p>
          <p>
            <strong>Binary:</strong> {t('tools.byteConverter.binaryHelp')}
          </p>
          <p>
            <strong>Base64:</strong> {t('tools.byteConverter.base64Help')}
          </p>
          <p>
            <strong>Text:</strong> {t('tools.byteConverter.textHelp')}
          </p>
        </div>
      </div>
    </div>
  )
}
