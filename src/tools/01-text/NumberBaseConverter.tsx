import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'

interface BaseValue {
  binary: string
  octal: string
  decimal: string
  hex: string
}

const convertFromDecimal = (decimal: string): BaseValue => {
  if (!decimal || isNaN(Number(decimal))) {
    return { binary: '', octal: '', decimal: '', hex: '' }
  }
  const num = parseInt(decimal, 10)
  return {
    binary: num.toString(2),
    octal: num.toString(8),
    decimal: decimal,
    hex: num.toString(16).toUpperCase(),
  }
}

const convertToDecimal = (value: string, base: number): string => {
  if (!value) return ''
  try {
    const num = parseInt(value, base)
    if (isNaN(num)) return ''
    return num.toString(10)
  } catch {
    return ''
  }
}

export default function NumberBaseConverter() {
  const { t } = useTranslation()
  const [values, setValues] = useState<BaseValue>({
    binary: '',
    octal: '',
    decimal: '',
    hex: '',
  })
  const { copied: binCopied, copy: copyBin } = useClipboard()
  const { copied: octCopied, copy: copyOct } = useClipboard()
  const { copied: decCopied, copy: copyDec } = useClipboard()
  const { copied: hexCopied, copy: copyHex } = useClipboard()

  const handleChange = (value: string, base: 'binary' | 'octal' | 'decimal' | 'hex') => {
    let decimal = ''
    switch (base) {
      case 'binary':
        decimal = convertToDecimal(value, 2)
        break
      case 'octal':
        decimal = convertToDecimal(value, 8)
        break
      case 'decimal':
        decimal = value
        break
      case 'hex':
        decimal = convertToDecimal(value, 16)
        break
    }

    if (decimal) {
      const newValues = convertFromDecimal(decimal)
      setValues({ ...newValues, [base]: value })
    } else {
      setValues({ binary: '', octal: '', decimal: '', hex: '', [base]: value })
    }
  }

  const clearAll = () => {
    setValues({ binary: '', octal: '', decimal: '', hex: '' })
  }

  const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="card p-4">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">
                {t('tools.numberBaseConverter.binary')} (Base 2)
              </label>
              <Button
                variant="secondary"
                onClick={() => copyBin(values.binary)}
                disabled={!values.binary}
                className="text-xs px-2 py-1"
              >
                {binCopied ? t('common.copied') : t('common.copy')}
              </Button>
            </div>
            <input
              type="text"
              value={values.binary}
              onChange={(e) => handleChange(e.target.value.replace(/[^01]/g, ''), 'binary')}
              placeholder="0, 1"
              className={inputClass}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">
                {t('tools.numberBaseConverter.octal')} (Base 8)
              </label>
              <Button
                variant="secondary"
                onClick={() => copyOct(values.octal)}
                disabled={!values.octal}
                className="text-xs px-2 py-1"
              >
                {octCopied ? t('common.copied') : t('common.copy')}
              </Button>
            </div>
            <input
              type="text"
              value={values.octal}
              onChange={(e) => handleChange(e.target.value.replace(/[^0-7]/g, ''), 'octal')}
              placeholder="0-7"
              className={inputClass}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">
                {t('tools.numberBaseConverter.decimal')} (Base 10)
              </label>
              <Button
                variant="secondary"
                onClick={() => copyDec(values.decimal)}
                disabled={!values.decimal}
                className="text-xs px-2 py-1"
              >
                {decCopied ? t('common.copied') : t('common.copy')}
              </Button>
            </div>
            <input
              type="text"
              value={values.decimal}
              onChange={(e) => handleChange(e.target.value.replace(/[^0-9]/g, ''), 'decimal')}
              placeholder="0-9"
              className={inputClass}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">
                {t('tools.numberBaseConverter.hex')} (Base 16)
              </label>
              <Button
                variant="secondary"
                onClick={() => copyHex(values.hex)}
                disabled={!values.hex}
                className="text-xs px-2 py-1"
              >
                {hexCopied ? t('common.copied') : t('common.copy')}
              </Button>
            </div>
            <input
              type="text"
              value={values.hex}
              onChange={(e) => handleChange(e.target.value.replace(/[^0-9A-Fa-f]/g, '').toUpperCase(), 'hex')}
              placeholder="0-9, A-F"
              className={inputClass}
            />
          </div>

          <div className="pt-2">
            <Button
              variant="secondary"
              onClick={clearAll}
              className="w-full"
            >
              {t('common.clear')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
