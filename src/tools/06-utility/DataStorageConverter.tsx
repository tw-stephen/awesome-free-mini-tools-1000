import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function DataStorageConverter() {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const [fromUnit, setFromUnit] = useState('gigabyte')

  const units = [
    { id: 'bit', label: 'Bit', symbol: 'b', toByte: 0.125 },
    { id: 'byte', label: 'Byte', symbol: 'B', toByte: 1 },
    { id: 'kilobyte', label: 'Kilobyte', symbol: 'KB', toByte: 1024 },
    { id: 'megabyte', label: 'Megabyte', symbol: 'MB', toByte: 1048576 },
    { id: 'gigabyte', label: 'Gigabyte', symbol: 'GB', toByte: 1073741824 },
    { id: 'terabyte', label: 'Terabyte', symbol: 'TB', toByte: 1099511627776 },
    { id: 'petabyte', label: 'Petabyte', symbol: 'PB', toByte: 1125899906842624 },
    { id: 'kibibyte', label: 'Kibibyte', symbol: 'KiB', toByte: 1024 },
    { id: 'mebibyte', label: 'Mebibyte', symbol: 'MiB', toByte: 1048576 },
    { id: 'gibibyte', label: 'Gibibyte', symbol: 'GiB', toByte: 1073741824 },
  ]

  const conversions = useMemo(() => {
    const val = parseFloat(value)
    if (isNaN(val)) return null

    const fromUnitData = units.find(u => u.id === fromUnit)
    if (!fromUnitData) return null

    const bytes = val * fromUnitData.toByte

    return units.reduce((acc, unit) => {
      acc[unit.id] = bytes / unit.toByte
      return acc
    }, {} as Record<string, number>)
  }, [value, fromUnit])

  const formatNumber = (num: number) => {
    if (num === 0) return '0'
    if (Math.abs(num) < 0.0001 || Math.abs(num) >= 1e15) {
      return num.toExponential(4)
    }
    return num.toLocaleString(undefined, { maximumFractionDigits: 6 })
  }

  const quickConversions = [
    { from: '1 KB', equals: '1,024 Bytes' },
    { from: '1 MB', equals: '1,024 KB' },
    { from: '1 GB', equals: '1,024 MB' },
    { from: '1 TB', equals: '1,024 GB' },
    { from: '1 Byte', equals: '8 bits' },
  ]

  const storageExamples = [
    { item: t('tools.dataStorageConverter.textFile'), size: '10 KB' },
    { item: t('tools.dataStorageConverter.mp3Song'), size: '5 MB' },
    { item: t('tools.dataStorageConverter.hdPhoto'), size: '10 MB' },
    { item: t('tools.dataStorageConverter.hdMovie'), size: '5 GB' },
    { item: t('tools.dataStorageConverter.gameInstall'), size: '50-100 GB' },
    { item: t('tools.dataStorageConverter.smartphone'), size: '128-512 GB' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.dataStorageConverter.enterValue')}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0"
                className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              >
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {['1', '10', '100', '1024'].map((v) => (
              <button
                key={v}
                onClick={() => setValue(v)}
                className="px-3 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200"
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {conversions && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-4">
            {t('tools.dataStorageConverter.results')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {units.map((unit) => (
              <div
                key={unit.id}
                className={`p-3 rounded ${
                  unit.id === fromUnit ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{unit.label}</span>
                  <span className="text-sm font-bold text-slate-800">
                    {formatNumber(conversions[unit.id])} {unit.symbol}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.dataStorageConverter.quickReference')}
        </h3>
        <div className="space-y-2">
          {quickConversions.map((conv, i) => (
            <div key={i} className="p-2 bg-slate-50 rounded text-sm">
              <span className="text-slate-600">{conv.from}</span>
              <span className="text-slate-400"> = </span>
              <span className="font-medium">{conv.equals}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.dataStorageConverter.examples')}
        </h3>
        <div className="space-y-2">
          {storageExamples.map((item, i) => (
            <div key={i} className="flex justify-between p-2 bg-slate-50 rounded text-sm">
              <span className="text-slate-600">{item.item}</span>
              <span className="font-medium">{item.size}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.dataStorageConverter.note')}
        </h3>
        <p className="text-sm text-slate-600">
          {t('tools.dataStorageConverter.noteText')}
        </p>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.dataStorageConverter.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.dataStorageConverter.tip1')}</li>
          <li>{t('tools.dataStorageConverter.tip2')}</li>
          <li>{t('tools.dataStorageConverter.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
