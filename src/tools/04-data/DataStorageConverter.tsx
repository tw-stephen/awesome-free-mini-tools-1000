import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'

type StorageUnit =
  | 'bit'
  | 'byte'
  | 'kilobyte'
  | 'megabyte'
  | 'gigabyte'
  | 'terabyte'
  | 'petabyte'
  | 'kibibyte'
  | 'mebibyte'
  | 'gibibyte'
  | 'tebibyte'
  | 'pebibyte'

export default function DataStorageConverter() {
  const { t } = useTranslation()
  const [value, setValue] = useState('1')
  const [fromUnit, setFromUnit] = useState<StorageUnit>('gigabyte')
  const { copy, copied } = useClipboard()

  // All values in bytes
  const unitFactors: Record<StorageUnit, number> = {
    bit: 0.125,
    byte: 1,
    kilobyte: 1000,
    megabyte: 1000000,
    gigabyte: 1000000000,
    terabyte: 1000000000000,
    petabyte: 1000000000000000,
    kibibyte: 1024,
    mebibyte: 1048576,
    gibibyte: 1073741824,
    tebibyte: 1099511627776,
    pebibyte: 1125899906842624,
  }

  const unitLabels: Record<StorageUnit, string> = {
    bit: 'b',
    byte: 'B',
    kilobyte: 'KB',
    megabyte: 'MB',
    gigabyte: 'GB',
    terabyte: 'TB',
    petabyte: 'PB',
    kibibyte: 'KiB',
    mebibyte: 'MiB',
    gibibyte: 'GiB',
    tebibyte: 'TiB',
    pebibyte: 'PiB',
  }

  const convert = useCallback(
    (val: number, from: StorageUnit, to: StorageUnit): number => {
      const bytes = val * unitFactors[from]
      return bytes / unitFactors[to]
    },
    []
  )

  const getConversions = useCallback(() => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return null

    const results: Record<StorageUnit, number> = {} as Record<StorageUnit, number>
    for (const unit of Object.keys(unitFactors) as StorageUnit[]) {
      results[unit] = convert(numValue, fromUnit, unit)
    }
    return results
  }, [value, fromUnit, convert])

  const conversions = getConversions()

  const formatNumber = (num: number): string => {
    if (Math.abs(num) < 0.000001 || Math.abs(num) >= 10000000000) {
      return num.toExponential(6)
    }
    if (Number.isInteger(num)) {
      return num.toLocaleString()
    }
    return num.toPrecision(10).replace(/\.?0+$/, '')
  }

  const unitGroups = {
    basic: ['bit', 'byte'] as StorageUnit[],
    decimal: ['kilobyte', 'megabyte', 'gigabyte', 'terabyte', 'petabyte'] as StorageUnit[],
    binary: ['kibibyte', 'mebibyte', 'gibibyte', 'tebibyte', 'pebibyte'] as StorageUnit[],
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.dataStorageConverter.input')}
        </h3>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.dataStorageConverter.value')}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-lg"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.dataStorageConverter.unit')}
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as StorageUnit)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <optgroup label={t('tools.dataStorageConverter.basic')}>
                {unitGroups.basic.map((unit) => (
                  <option key={unit} value={unit}>
                    {t(`tools.dataStorageConverter.${unit}`)} ({unitLabels[unit]})
                  </option>
                ))}
              </optgroup>
              <optgroup label={t('tools.dataStorageConverter.decimal')}>
                {unitGroups.decimal.map((unit) => (
                  <option key={unit} value={unit}>
                    {t(`tools.dataStorageConverter.${unit}`)} ({unitLabels[unit]})
                  </option>
                ))}
              </optgroup>
              <optgroup label={t('tools.dataStorageConverter.binary')}>
                {unitGroups.binary.map((unit) => (
                  <option key={unit} value={unit}>
                    {t(`tools.dataStorageConverter.${unit}`)} ({unitLabels[unit]})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {conversions && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.dataStorageConverter.basic')}
            </h3>
            <div className="space-y-2">
              {unitGroups.basic.map((unit) => (
                <div
                  key={unit}
                  className={`flex items-center justify-between p-2 rounded ${
                    unit === fromUnit ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
                  }`}
                >
                  <span className="text-sm text-slate-600">
                    {t(`tools.dataStorageConverter.${unit}`)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-800">
                      {formatNumber(conversions[unit])} {unitLabels[unit]}
                    </span>
                    <button
                      onClick={() =>
                        copy(`${formatNumber(conversions[unit])} ${unitLabels[unit]}`)
                      }
                      className="text-blue-500 hover:text-blue-700 text-xs"
                    >
                      {t('common.copy')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.dataStorageConverter.decimal')} (SI, 1000-based)
            </h3>
            <div className="space-y-2">
              {unitGroups.decimal.map((unit) => (
                <div
                  key={unit}
                  className={`flex items-center justify-between p-2 rounded ${
                    unit === fromUnit ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
                  }`}
                >
                  <span className="text-sm text-slate-600">
                    {t(`tools.dataStorageConverter.${unit}`)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-800">
                      {formatNumber(conversions[unit])} {unitLabels[unit]}
                    </span>
                    <button
                      onClick={() =>
                        copy(`${formatNumber(conversions[unit])} ${unitLabels[unit]}`)
                      }
                      className="text-blue-500 hover:text-blue-700 text-xs"
                    >
                      {t('common.copy')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.dataStorageConverter.binary')} (IEC, 1024-based)
            </h3>
            <div className="space-y-2">
              {unitGroups.binary.map((unit) => (
                <div
                  key={unit}
                  className={`flex items-center justify-between p-2 rounded ${
                    unit === fromUnit ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
                  }`}
                >
                  <span className="text-sm text-slate-600">
                    {t(`tools.dataStorageConverter.${unit}`)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-800">
                      {formatNumber(conversions[unit])} {unitLabels[unit]}
                    </span>
                    <button
                      onClick={() =>
                        copy(`${formatNumber(conversions[unit])} ${unitLabels[unit]}`)
                      }
                      className="text-blue-500 hover:text-blue-700 text-xs"
                    >
                      {t('common.copy')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="card p-4 bg-yellow-50 border border-yellow-200">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">
          {t('tools.dataStorageConverter.note')}
        </h3>
        <p className="text-sm text-yellow-700">
          {t('tools.dataStorageConverter.noteText')}
        </p>
      </div>

      {copied && (
        <div className="text-center text-sm text-green-600">{t('common.copied')}</div>
      )}
    </div>
  )
}
