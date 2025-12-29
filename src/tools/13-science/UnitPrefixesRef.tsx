import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function UnitPrefixesRef() {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState(1)
  const [inputPrefix, setInputPrefix] = useState('k')
  const [outputPrefix, setOutputPrefix] = useState('m')

  const prefixes = [
    { symbol: 'Y', name: 'yotta', power: 24 },
    { symbol: 'Z', name: 'zetta', power: 21 },
    { symbol: 'E', name: 'exa', power: 18 },
    { symbol: 'P', name: 'peta', power: 15 },
    { symbol: 'T', name: 'tera', power: 12 },
    { symbol: 'G', name: 'giga', power: 9 },
    { symbol: 'M', name: 'mega', power: 6 },
    { symbol: 'k', name: 'kilo', power: 3 },
    { symbol: 'h', name: 'hecto', power: 2 },
    { symbol: 'da', name: 'deca', power: 1 },
    { symbol: '-', name: 'base', power: 0 },
    { symbol: 'd', name: 'deci', power: -1 },
    { symbol: 'c', name: 'centi', power: -2 },
    { symbol: 'm', name: 'milli', power: -3 },
    { symbol: 'u', name: 'micro', power: -6 },
    { symbol: 'n', name: 'nano', power: -9 },
    { symbol: 'p', name: 'pico', power: -12 },
    { symbol: 'f', name: 'femto', power: -15 },
    { symbol: 'a', name: 'atto', power: -18 },
    { symbol: 'z', name: 'zepto', power: -21 },
    { symbol: 'y', name: 'yocto', power: -24 },
  ]

  const convert = () => {
    const fromPower = prefixes.find(p => p.symbol === inputPrefix)?.power || 0
    const toPower = prefixes.find(p => p.symbol === outputPrefix)?.power || 0
    const diff = fromPower - toPower
    return inputValue * Math.pow(10, diff)
  }

  const result = convert()

  const formatResult = (num: number): string => {
    if (Math.abs(num) >= 1e10 || (Math.abs(num) < 1e-6 && num !== 0)) {
      return num.toExponential(6)
    }
    return num.toLocaleString(undefined, { maximumSignificantDigits: 10 })
  }

  return (
    <div className="space-y-4">
      {/* Converter */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.unitPrefixesRef.converter')}</h3>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
            className="w-24 px-3 py-2 border border-slate-300 rounded text-center font-mono"
          />
          <select
            value={inputPrefix}
            onChange={(e) => setInputPrefix(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded"
          >
            {prefixes.map(p => (
              <option key={p.symbol} value={p.symbol}>
                {p.symbol === '-' ? '(base)' : p.symbol} - {p.name}
              </option>
            ))}
          </select>
          <span className="text-xl">=</span>
          <span className="text-xl font-bold text-blue-600 font-mono">
            {formatResult(result)}
          </span>
          <select
            value={outputPrefix}
            onChange={(e) => setOutputPrefix(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded"
          >
            {prefixes.map(p => (
              <option key={p.symbol} value={p.symbol}>
                {p.symbol === '-' ? '(base)' : p.symbol} - {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reference Table */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.unitPrefixesRef.referenceTable')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left py-2 px-2">{t('tools.unitPrefixesRef.symbol')}</th>
                <th className="text-left py-2 px-2">{t('tools.unitPrefixesRef.prefix')}</th>
                <th className="text-center py-2 px-2">{t('tools.unitPrefixesRef.power')}</th>
                <th className="text-right py-2 px-2">{t('tools.unitPrefixesRef.decimal')}</th>
              </tr>
            </thead>
            <tbody>
              {prefixes.map(p => (
                <tr
                  key={p.symbol}
                  className={`border-b ${p.power === 0 ? 'bg-yellow-50' : ''}`}
                >
                  <td className="py-2 px-2 font-mono font-bold text-blue-600">
                    {p.symbol === '-' ? '-' : p.symbol}
                  </td>
                  <td className="py-2 px-2 capitalize">{p.name}</td>
                  <td className="text-center py-2 px-2 font-mono">10^{p.power}</td>
                  <td className="text-right py-2 px-2 font-mono text-xs">
                    {Math.pow(10, p.power).toExponential(0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Common Examples */}
      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium mb-3">{t('tools.unitPrefixesRef.commonExamples')}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-white rounded">
            <div className="font-bold">km (kilometer)</div>
            <div className="text-slate-500">1000 meters</div>
          </div>
          <div className="p-2 bg-white rounded">
            <div className="font-bold">GB (gigabyte)</div>
            <div className="text-slate-500">10^9 bytes</div>
          </div>
          <div className="p-2 bg-white rounded">
            <div className="font-bold">MHz (megahertz)</div>
            <div className="text-slate-500">10^6 hertz</div>
          </div>
          <div className="p-2 bg-white rounded">
            <div className="font-bold">nm (nanometer)</div>
            <div className="text-slate-500">10^-9 meters</div>
          </div>
          <div className="p-2 bg-white rounded">
            <div className="font-bold">mA (milliampere)</div>
            <div className="text-slate-500">10^-3 amperes</div>
          </div>
          <div className="p-2 bg-white rounded">
            <div className="font-bold">uF (microfarad)</div>
            <div className="text-slate-500">10^-6 farads</div>
          </div>
        </div>
      </div>

      {/* Binary Prefixes */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.unitPrefixesRef.binaryPrefixes')}</h3>
        <div className="text-sm text-slate-600 mb-2">
          {t('tools.unitPrefixesRef.binaryNote')}
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-slate-50 rounded flex justify-between">
            <span>Ki (kibi)</span>
            <span className="font-mono">2^10 = 1024</span>
          </div>
          <div className="p-2 bg-slate-50 rounded flex justify-between">
            <span>Mi (mebi)</span>
            <span className="font-mono">2^20</span>
          </div>
          <div className="p-2 bg-slate-50 rounded flex justify-between">
            <span>Gi (gibi)</span>
            <span className="font-mono">2^30</span>
          </div>
          <div className="p-2 bg-slate-50 rounded flex justify-between">
            <span>Ti (tebi)</span>
            <span className="font-mono">2^40</span>
          </div>
        </div>
      </div>
    </div>
  )
}
