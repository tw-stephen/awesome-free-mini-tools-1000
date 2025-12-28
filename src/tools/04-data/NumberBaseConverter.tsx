import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function NumberBaseConverter() {
  const { t } = useTranslation()
  const [input, setInput] = useState('255')
  const [fromBase, setFromBase] = useState(10)
  const [error, setError] = useState('')
  const { copy, copied } = useClipboard()

  const bases = [
    { value: 2, label: t('tools.numberBaseConverter.binary') + ' (2)' },
    { value: 8, label: t('tools.numberBaseConverter.octal') + ' (8)' },
    { value: 10, label: t('tools.numberBaseConverter.decimal') + ' (10)' },
    { value: 16, label: t('tools.numberBaseConverter.hexadecimal') + ' (16)' },
  ]

  const convert = useCallback(
    (toBase: number): string => {
      if (!input.trim()) return ''

      try {
        // Parse input from specified base
        const decimal = parseInt(input.replace(/\s/g, ''), fromBase)
        if (isNaN(decimal)) {
          setError(t('tools.numberBaseConverter.invalidNumber'))
          return ''
        }
        setError('')
        return decimal.toString(toBase).toUpperCase()
      } catch {
        setError(t('tools.numberBaseConverter.invalidNumber'))
        return ''
      }
    },
    [input, fromBase, t]
  )

  const formatBinary = (binary: string): string => {
    // Add spaces every 4 digits for readability
    return binary.replace(/(.{4})/g, '$1 ').trim()
  }

  const formatHex = (hex: string): string => {
    // Add spaces every 2 digits for readability
    return hex.replace(/(.{2})/g, '$1 ').trim()
  }

  const conversions = [
    {
      base: 2,
      label: t('tools.numberBaseConverter.binary'),
      value: convert(2),
      format: formatBinary,
    },
    {
      base: 8,
      label: t('tools.numberBaseConverter.octal'),
      value: convert(8),
      format: (v: string) => v,
    },
    {
      base: 10,
      label: t('tools.numberBaseConverter.decimal'),
      value: convert(10),
      format: (v: string) => parseInt(v).toLocaleString(),
    },
    {
      base: 16,
      label: t('tools.numberBaseConverter.hexadecimal'),
      value: convert(16),
      format: formatHex,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.numberBaseConverter.input')}
        </h3>

        <div className="flex gap-4 items-end mb-4">
          <div className="flex-1">
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.numberBaseConverter.number')}
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              placeholder="255"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-lg"
            />
          </div>
          <div className="w-48">
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.numberBaseConverter.fromBase')}
            </label>
            <select
              value={fromBase}
              onChange={(e) => setFromBase(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              {bases.map((base) => (
                <option key={base.value} value={base.value}>
                  {base.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.numberBaseConverter.results')}
        </h3>

        <div className="space-y-4">
          {conversions.map((conv) => (
            <div
              key={conv.base}
              className={`p-3 rounded-lg ${
                conv.base === fromBase ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-600">
                  {conv.label} (base {conv.base})
                </span>
                <Button variant="secondary" onClick={() => copy(conv.value)}>
                  {copied ? t('common.copied') : t('common.copy')}
                </Button>
              </div>
              <div className="font-mono text-lg text-slate-800 break-all">
                {conv.value ? conv.format(conv.value) : '-'}
              </div>
              {conv.base === 2 && conv.value && (
                <div className="text-xs text-slate-500 mt-1">
                  {conv.value.length} bits
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.numberBaseConverter.customBase')}
        </h3>

        <div className="grid grid-cols-4 gap-2">
          {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16, 32, 36].map((base) => {
            const result = (() => {
              try {
                const decimal = parseInt(input.replace(/\s/g, ''), fromBase)
                if (isNaN(decimal)) return '-'
                return decimal.toString(base).toUpperCase()
              } catch {
                return '-'
              }
            })()

            return (
              <div key={base} className="bg-slate-50 p-2 rounded text-center">
                <div className="text-xs text-slate-500">base {base}</div>
                <div className="font-mono text-sm text-slate-800 truncate">{result}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.numberBaseConverter.commonValues')}
        </h3>

        <div className="grid grid-cols-3 gap-2 text-sm">
          {[
            { dec: 0, desc: 'Zero' },
            { dec: 1, desc: 'One' },
            { dec: 127, desc: 'Max signed 8-bit' },
            { dec: 255, desc: 'Max unsigned 8-bit' },
            { dec: 32767, desc: 'Max signed 16-bit' },
            { dec: 65535, desc: 'Max unsigned 16-bit' },
            { dec: 2147483647, desc: 'Max signed 32-bit' },
            { dec: 4294967295, desc: 'Max unsigned 32-bit' },
          ].map((item) => (
            <button
              key={item.dec}
              onClick={() => {
                setInput(item.dec.toString())
                setFromBase(10)
              }}
              className="flex flex-col items-center p-2 bg-slate-50 rounded hover:bg-slate-100"
            >
              <span className="font-mono text-slate-800">{item.dec}</span>
              <span className="text-xs text-slate-500">{item.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
