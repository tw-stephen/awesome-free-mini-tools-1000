import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'

export default function NumberBaseConverter() {
  const { t } = useTranslation()
  const { copy } = useClipboard()
  const [input, setInput] = useState('')
  const [fromBase, setFromBase] = useState(10)
  const [copiedBase, setCopiedBase] = useState<number | null>(null)

  const bases = [
    { value: 2, name: 'Binary', prefix: '0b' },
    { value: 8, name: 'Octal', prefix: '0o' },
    { value: 10, name: 'Decimal', prefix: '' },
    { value: 16, name: 'Hexadecimal', prefix: '0x' },
  ]

  const conversions = useMemo(() => {
    if (!input.trim()) return null

    try {
      // Parse input as the selected base
      const decimal = parseInt(input, fromBase)
      if (isNaN(decimal)) return null

      return {
        decimal,
        binary: decimal.toString(2),
        octal: decimal.toString(8),
        hex: decimal.toString(16).toUpperCase(),
      }
    } catch {
      return null
    }
  }, [input, fromBase])

  const handleCopy = (value: string, base: number) => {
    copy(value)
    setCopiedBase(base)
    setTimeout(() => setCopiedBase(null), 2000)
  }

  const formatBinary = (binary: string) => {
    // Add spaces every 4 digits for readability
    const padded = binary.padStart(Math.ceil(binary.length / 4) * 4, '0')
    return padded.match(/.{1,4}/g)?.join(' ') || binary
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.numberBaseConverter.inputNumber')}
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              placeholder={fromBase === 16 ? 'FF' : fromBase === 2 ? '1010' : '42'}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.numberBaseConverter.fromBase')}
            </label>
            <div className="flex gap-2">
              {bases.map((base) => (
                <button
                  key={base.value}
                  onClick={() => setFromBase(base.value)}
                  className={`flex-1 py-2 rounded text-sm font-medium ${
                    fromBase === base.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                >
                  {base.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {conversions && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-4">
            {t('tools.numberBaseConverter.results')}
          </h3>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">Binary (Base 2)</span>
                <button
                  onClick={() => handleCopy(conversions.binary, 2)}
                  className="text-xs text-blue-500 hover:text-blue-700"
                >
                  {copiedBase === 2 ? t('common.copied') : t('common.copy')}
                </button>
              </div>
              <div className="font-mono text-lg break-all">
                0b{formatBinary(conversions.binary)}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">Octal (Base 8)</span>
                <button
                  onClick={() => handleCopy(conversions.octal, 8)}
                  className="text-xs text-blue-500 hover:text-blue-700"
                >
                  {copiedBase === 8 ? t('common.copied') : t('common.copy')}
                </button>
              </div>
              <div className="font-mono text-lg">0o{conversions.octal}</div>
            </div>

            <div className="p-3 bg-blue-50 rounded">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">Decimal (Base 10)</span>
                <button
                  onClick={() => handleCopy(String(conversions.decimal), 10)}
                  className="text-xs text-blue-500 hover:text-blue-700"
                >
                  {copiedBase === 10 ? t('common.copied') : t('common.copy')}
                </button>
              </div>
              <div className="font-mono text-lg font-bold text-blue-600">
                {conversions.decimal.toLocaleString()}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">Hexadecimal (Base 16)</span>
                <button
                  onClick={() => handleCopy(conversions.hex, 16)}
                  className="text-xs text-blue-500 hover:text-blue-700"
                >
                  {copiedBase === 16 ? t('common.copied') : t('common.copy')}
                </button>
              </div>
              <div className="font-mono text-lg">0x{conversions.hex}</div>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.numberBaseConverter.quickReference')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-slate-500">Dec</th>
                <th className="text-left py-2 text-slate-500">Bin</th>
                <th className="text-left py-2 text-slate-500">Oct</th>
                <th className="text-left py-2 text-slate-500">Hex</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((n) => (
                <tr key={n} className="border-b border-slate-100">
                  <td className="py-1">{n}</td>
                  <td className="py-1">{n.toString(2).padStart(4, '0')}</td>
                  <td className="py-1">{n.toString(8)}</td>
                  <td className="py-1">{n.toString(16).toUpperCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.numberBaseConverter.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.numberBaseConverter.tip1')}</li>
          <li>{t('tools.numberBaseConverter.tip2')}</li>
          <li>{t('tools.numberBaseConverter.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
