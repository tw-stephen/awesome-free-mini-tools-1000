import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function NumberBaseConverter() {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState('255')
  const [inputBase, setInputBase] = useState(10)
  const [results, setResults] = useState<Record<number, string>>({})
  const [error, setError] = useState('')
  const [customBase, setCustomBase] = useState(16)
  const [customResult, setCustomResult] = useState('')

  const bases = [
    { value: 2, label: t('tools.numberBaseConverter.binary'), prefix: '0b' },
    { value: 8, label: t('tools.numberBaseConverter.octal'), prefix: '0o' },
    { value: 10, label: t('tools.numberBaseConverter.decimal'), prefix: '' },
    { value: 16, label: t('tools.numberBaseConverter.hexadecimal'), prefix: '0x' },
  ]

  const isValidDigit = (char: string, base: number): boolean => {
    const digits = '0123456789abcdefghijklmnopqrstuvwxyz'
    const index = digits.indexOf(char.toLowerCase())
    return index !== -1 && index < base
  }

  const isValidNumber = (value: string, base: number): boolean => {
    if (!value) return false
    const cleanValue = value.toLowerCase().replace(/^(0b|0o|0x)/, '')
    return [...cleanValue].every(char => isValidDigit(char, base))
  }

  const convert = () => {
    setError('')
    setResults({})

    let cleanInput = inputValue.trim().toLowerCase()
    cleanInput = cleanInput.replace(/^(0b|0o|0x)/, '')

    if (!cleanInput || !isValidNumber(cleanInput, inputBase)) {
      setError(t('tools.numberBaseConverter.invalidInput'))
      return
    }

    try {
      const decimal = parseInt(cleanInput, inputBase)
      if (isNaN(decimal) || decimal < 0) {
        setError(t('tools.numberBaseConverter.invalidInput'))
        return
      }

      const newResults: Record<number, string> = {}
      bases.forEach(base => {
        newResults[base.value] = decimal.toString(base.value).toUpperCase()
      })

      // Also add custom base result
      newResults[customBase] = decimal.toString(customBase).toUpperCase()

      setResults(newResults)
      setCustomResult(decimal.toString(customBase).toUpperCase())
    } catch {
      setError(t('tools.numberBaseConverter.conversionError'))
    }
  }

  const handleQuickConvert = (value: string, base: number) => {
    setInputValue(value)
    setInputBase(base)
    setTimeout(convert, 0)
  }

  const formatBinary = (binary: string): string => {
    // Group binary digits in sets of 4
    const padded = binary.padStart(Math.ceil(binary.length / 4) * 4, '0')
    return padded.match(/.{1,4}/g)?.join(' ') || binary
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('tools.numberBaseConverter.inputValue')}
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded font-mono"
              placeholder="Enter number..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('tools.numberBaseConverter.inputBase')}
            </label>
            <div className="flex gap-2">
              {bases.map(base => (
                <button
                  key={base.value}
                  onClick={() => setInputBase(base.value)}
                  className={`flex-1 py-2 rounded text-sm ${
                    inputBase === base.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {base.value}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={convert}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t('tools.numberBaseConverter.convert')}
        </button>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>

      {Object.keys(results).length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.numberBaseConverter.results')}</h3>
          <div className="space-y-3">
            {bases.map(base => (
              <div key={base.value} className="flex items-center gap-3 p-3 bg-slate-50 rounded">
                <div className="w-24 text-sm text-slate-600">
                  {base.label}
                </div>
                <div className="flex-1 font-mono text-lg break-all">
                  <span className="text-slate-400">{base.prefix}</span>
                  {base.value === 2 ? formatBinary(results[base.value] || '') : results[base.value]}
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(results[base.value] || '')}
                  className="px-2 py-1 bg-slate-200 rounded text-sm hover:bg-slate-300"
                >
                  {t('tools.numberBaseConverter.copy')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.numberBaseConverter.customBase')}</h3>
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-600">{t('tools.numberBaseConverter.base')}</label>
          <input
            type="number"
            min="2"
            max="36"
            value={customBase}
            onChange={(e) => {
              const base = Math.min(36, Math.max(2, parseInt(e.target.value) || 2))
              setCustomBase(base)
            }}
            className="w-20 px-2 py-1 border border-slate-300 rounded text-center"
          />
          <button
            onClick={convert}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            {t('tools.numberBaseConverter.convertToBase')}
          </button>
          {customResult && (
            <div className="font-mono text-lg font-bold text-green-600">
              {customResult}
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {t('tools.numberBaseConverter.baseRange')}
        </p>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-3">{t('tools.numberBaseConverter.quickExamples')}</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { value: '255', base: 10, label: '255 (dec)' },
            { value: 'FF', base: 16, label: 'FF (hex)' },
            { value: '11111111', base: 2, label: '11111111 (bin)' },
            { value: '377', base: 8, label: '377 (oct)' },
            { value: '100', base: 10, label: '100 (dec)' },
            { value: '64', base: 16, label: '64 (hex)' },
            { value: '1010', base: 2, label: '1010 (bin)' },
            { value: '42', base: 10, label: '42 (dec)' },
          ].map((example, i) => (
            <button
              key={i}
              onClick={() => handleQuickConvert(example.value, example.base)}
              className="p-2 bg-white rounded border hover:bg-slate-50 text-sm"
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.numberBaseConverter.info')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• <strong>Binary (Base 2):</strong> {t('tools.numberBaseConverter.infoBinary')}</li>
          <li>• <strong>Octal (Base 8):</strong> {t('tools.numberBaseConverter.infoOctal')}</li>
          <li>• <strong>Decimal (Base 10):</strong> {t('tools.numberBaseConverter.infoDecimal')}</li>
          <li>• <strong>Hexadecimal (Base 16):</strong> {t('tools.numberBaseConverter.infoHex')}</li>
        </ul>
      </div>
    </div>
  )
}
