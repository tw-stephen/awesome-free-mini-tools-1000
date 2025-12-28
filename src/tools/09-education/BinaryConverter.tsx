import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type Base = 'binary' | 'decimal' | 'octal' | 'hex'

export default function BinaryConverter() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [fromBase, setFromBase] = useState<Base>('decimal')

  const bases: { id: Base; name: string; prefix: string; radix: number }[] = [
    { id: 'binary', name: t('tools.binaryConverter.binary'), prefix: '0b', radix: 2 },
    { id: 'octal', name: t('tools.binaryConverter.octal'), prefix: '0o', radix: 8 },
    { id: 'decimal', name: t('tools.binaryConverter.decimal'), prefix: '', radix: 10 },
    { id: 'hex', name: t('tools.binaryConverter.hex'), prefix: '0x', radix: 16 },
  ]

  const conversions = useMemo(() => {
    if (!input.trim()) return null

    const baseInfo = bases.find(b => b.id === fromBase)!
    const cleanInput = input.replace(/^(0b|0o|0x)/i, '').trim()
    const decimal = parseInt(cleanInput, baseInfo.radix)

    if (isNaN(decimal)) return null

    return bases.map(base => ({
      ...base,
      value: decimal.toString(base.radix).toUpperCase(),
    }))
  }, [input, fromBase])

  const textToBinary = (text: string) => {
    return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ')
  }

  const binaryToText = (binary: string) => {
    const bytes = binary.split(/\s+/)
    return bytes.map(byte => String.fromCharCode(parseInt(byte, 2))).join('')
  }

  const [textInput, setTextInput] = useState('')
  const [binaryInput, setBinaryInput] = useState('')

  const textResult = useMemo(() => textToBinary(textInput), [textInput])
  const binaryResult = useMemo(() => {
    try {
      return binaryToText(binaryInput)
    } catch {
      return ''
    }
  }, [binaryInput])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.binaryConverter.numberConversion')}
        </h3>
        <div className="flex gap-2 mb-3">
          {bases.map(base => (
            <button
              key={base.id}
              onClick={() => { setFromBase(base.id); setInput('') }}
              className={`flex-1 py-2 rounded text-sm ${fromBase === base.id ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
            >
              {base.name}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`${t('tools.binaryConverter.enter')} ${bases.find(b => b.id === fromBase)?.name}`}
          className="w-full px-3 py-2 border border-slate-300 rounded font-mono"
        />
      </div>

      {conversions && (
        <div className="card p-4 bg-blue-50">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.binaryConverter.results')}
          </h3>
          <div className="space-y-2">
            {conversions.map(conv => (
              <div key={conv.id} className="flex justify-between items-center p-2 bg-white rounded">
                <span className="text-sm text-slate-600">{conv.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium">
                    <span className="text-slate-400">{conv.prefix}</span>
                    {conv.value}
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(conv.prefix + conv.value)}
                    className="text-xs text-blue-500"
                  >
                    {t('common.copy')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.binaryConverter.textToBinary')}
        </h3>
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder={t('tools.binaryConverter.enterText')}
          className="w-full px-3 py-2 border border-slate-300 rounded mb-2"
        />
        {textResult && (
          <div className="p-2 bg-slate-50 rounded font-mono text-sm break-all">
            {textResult}
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.binaryConverter.binaryToText')}
        </h3>
        <input
          type="text"
          value={binaryInput}
          onChange={(e) => setBinaryInput(e.target.value)}
          placeholder="01001000 01101001"
          className="w-full px-3 py-2 border border-slate-300 rounded font-mono mb-2"
        />
        {binaryResult && (
          <div className="p-2 bg-slate-50 rounded text-lg">
            {binaryResult}
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.binaryConverter.reference')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-slate-500">
                <th className="text-left p-1">Dec</th>
                <th className="text-left p-1">Bin</th>
                <th className="text-left p-1">Oct</th>
                <th className="text-left p-1">Hex</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(n => (
                <tr key={n} className="border-t border-slate-100">
                  <td className="p-1">{n}</td>
                  <td className="p-1">{n.toString(2).padStart(4, '0')}</td>
                  <td className="p-1">{n.toString(8)}</td>
                  <td className="p-1">{n.toString(16).toUpperCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
