import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface StorageUnit {
  id: string
  name: string
  bytes: number
}

const binaryUnits: StorageUnit[] = [
  { id: 'bit', name: 'bits', bytes: 1 / 8 },
  { id: 'byte', name: 'Bytes (B)', bytes: 1 },
  { id: 'kib', name: 'Kibibytes (KiB)', bytes: 1024 },
  { id: 'mib', name: 'Mebibytes (MiB)', bytes: Math.pow(1024, 2) },
  { id: 'gib', name: 'Gibibytes (GiB)', bytes: Math.pow(1024, 3) },
  { id: 'tib', name: 'Tebibytes (TiB)', bytes: Math.pow(1024, 4) },
  { id: 'pib', name: 'Pebibytes (PiB)', bytes: Math.pow(1024, 5) },
]

const decimalUnits: StorageUnit[] = [
  { id: 'bit', name: 'bits', bytes: 1 / 8 },
  { id: 'byte', name: 'Bytes (B)', bytes: 1 },
  { id: 'kb', name: 'Kilobytes (KB)', bytes: 1000 },
  { id: 'mb', name: 'Megabytes (MB)', bytes: Math.pow(1000, 2) },
  { id: 'gb', name: 'Gigabytes (GB)', bytes: Math.pow(1000, 3) },
  { id: 'tb', name: 'Terabytes (TB)', bytes: Math.pow(1000, 4) },
  { id: 'pb', name: 'Petabytes (PB)', bytes: Math.pow(1000, 5) },
]

export default function DataStorageConverter() {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState('1')
  const [inputUnit, setInputUnit] = useState('gib')
  const [unitSystem, setUnitSystem] = useState<'binary' | 'decimal'>('binary')
  const [conversions, setConversions] = useState<Record<string, number>>({})

  const currentUnits = unitSystem === 'binary' ? binaryUnits : decimalUnits

  const convert = () => {
    const value = parseFloat(inputValue)
    if (isNaN(value)) {
      setConversions({})
      return
    }

    const inputUnitDef = currentUnits.find(u => u.id === inputUnit)
    if (!inputUnitDef) return

    const bytes = value * inputUnitDef.bytes
    const results: Record<string, number> = {}

    currentUnits.forEach(unit => {
      results[unit.id] = bytes / unit.bytes
    })

    // Also add cross-system conversions
    if (unitSystem === 'binary') {
      results['gb_decimal'] = bytes / Math.pow(1000, 3)
      results['tb_decimal'] = bytes / Math.pow(1000, 4)
    } else {
      results['gib_binary'] = bytes / Math.pow(1024, 3)
      results['tib_binary'] = bytes / Math.pow(1024, 4)
    }

    setConversions(results)
  }

  useEffect(() => {
    convert()
  }, [inputValue, inputUnit, unitSystem])

  const formatNumber = (num: number): string => {
    if (num === 0) return '0'
    if (Math.abs(num) < 0.001) return num.toExponential(4)
    if (Math.abs(num) >= 1000000000) return num.toExponential(4)
    return num.toLocaleString(undefined, { maximumFractionDigits: 4 })
  }

  const commonSizes = [
    { name: t('tools.dataStorageConverter.floppy'), size: '1.44', unit: 'mib' },
    { name: t('tools.dataStorageConverter.cd'), size: '700', unit: 'mib' },
    { name: t('tools.dataStorageConverter.dvd'), size: '4.7', unit: 'gib' },
    { name: t('tools.dataStorageConverter.bluray'), size: '25', unit: 'gib' },
    { name: t('tools.dataStorageConverter.usbDrive'), size: '32', unit: 'gib' },
    { name: t('tools.dataStorageConverter.ssd'), size: '1', unit: 'tib' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => { setUnitSystem('binary'); setInputUnit('gib') }}
          className={`flex-1 py-2 rounded ${unitSystem === 'binary' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.dataStorageConverter.binary')} (1024)
        </button>
        <button
          onClick={() => { setUnitSystem('decimal'); setInputUnit('gb') }}
          className={`flex-1 py-2 rounded ${unitSystem === 'decimal' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.dataStorageConverter.decimal')} (1000)
        </button>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium mb-2">
          {t('tools.dataStorageConverter.enterSize')}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            step="any"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-lg"
          />
          <select
            value={inputUnit}
            onChange={(e) => setInputUnit(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded"
          >
            {currentUnits.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>

      {Object.keys(conversions).length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.dataStorageConverter.conversions')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {currentUnits.map(unit => (
              <div
                key={unit.id}
                className={`p-3 rounded ${unit.id === inputUnit ? 'bg-blue-50 border-2 border-blue-300' : 'bg-slate-50'}`}
              >
                <div className="text-sm text-slate-600">{unit.name}</div>
                <div className="text-lg font-bold font-mono">
                  {formatNumber(conversions[unit.id])}
                </div>
              </div>
            ))}
          </div>

          {unitSystem === 'binary' && conversions['gb_decimal'] && (
            <div className="mt-4 p-3 bg-orange-50 rounded">
              <div className="text-sm text-orange-600">{t('tools.dataStorageConverter.alsoEquals')}</div>
              <div className="font-mono">
                {formatNumber(conversions['gb_decimal'])} GB ({t('tools.dataStorageConverter.decimal')})
              </div>
            </div>
          )}

          {unitSystem === 'decimal' && conversions['gib_binary'] && (
            <div className="mt-4 p-3 bg-orange-50 rounded">
              <div className="text-sm text-orange-600">{t('tools.dataStorageConverter.alsoEquals')}</div>
              <div className="font-mono">
                {formatNumber(conversions['gib_binary'])} GiB ({t('tools.dataStorageConverter.binary')})
              </div>
            </div>
          )}
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.dataStorageConverter.commonSizes')}</h3>
        <div className="grid grid-cols-2 gap-2">
          {commonSizes.map((item, i) => (
            <button
              key={i}
              onClick={() => { setInputValue(item.size); setInputUnit(item.unit); setUnitSystem('binary') }}
              className="p-2 bg-slate-50 rounded text-left hover:bg-slate-100"
            >
              <div className="text-sm font-medium">{item.name}</div>
              <div className="text-xs text-slate-500 font-mono">{item.size} {item.unit.toUpperCase()}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.dataStorageConverter.difference')}</h4>
        <div className="text-sm text-slate-600 space-y-2">
          <p><strong>{t('tools.dataStorageConverter.binary')}:</strong> 1 KiB = 1024 bytes, 1 MiB = 1024 KiB</p>
          <p><strong>{t('tools.dataStorageConverter.decimal')}:</strong> 1 KB = 1000 bytes, 1 MB = 1000 KB</p>
          <p className="text-xs mt-2 p-2 bg-white rounded">
            {t('tools.dataStorageConverter.note')}
          </p>
        </div>
      </div>
    </div>
  )
}
