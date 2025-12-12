import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { convertBase, Base, isValidInput } from '../../utils/numberBaseConverter'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

interface BaseInputProps {
  base: Base
  value: string
  onChange: (value: string) => void
  label: string
}

function BaseInput({ base, value, onChange, label }: BaseInputProps) {
  const { copied, copy } = useClipboard()
  const { t } = useTranslation()
  const isValid = isValidInput(value, base)

  return (
    <div className="card p-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-slate-700">
          {label} (Base {base})
        </label>
        <Button variant="secondary" onClick={() => copy(value)} disabled={!value} className="px-2 py-1 text-xs">
          {copied ? t('common.copied') : t('common.copy')}
        </Button>
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`font-mono ${!isValid && value ? 'border-red-500 focus:ring-red-500' : ''}`}
        placeholder={`Enter Base ${base} number...`}
      />
      {!isValid && value && (
        <p className="text-xs text-red-500 mt-1">{t('tools.numberBaseConverter.invalidInput')}</p>
      )}
    </div>
  )
}

export default function NumberBaseConverter() {
  const { t } = useTranslation()
  // Store all values in state
  const [binary, setBinary] = useState('')
  const [octal, setOctal] = useState('')
  const [decimal, setDecimal] = useState('')
  const [hex, setHex] = useState('')

  // When one input changes, update others
  const updateValues = (value: string, fromBase: Base) => {
    // Update the source immediately
    switch (fromBase) {
      case 2: setBinary(value); break
      case 8: setOctal(value); break
      case 10: setDecimal(value); break
      case 16: setHex(value); break
    }

    if (!value) {
      setBinary('')
      setOctal('')
      setDecimal('')
      setHex('')
      return
    }

    if (!isValidInput(value, fromBase)) {
      // If invalid, don't update others, just let the source show error
      return
    }

    // Convert to others
    if (fromBase !== 2) setBinary(convertBase(value, fromBase, 2))
    if (fromBase !== 8) setOctal(convertBase(value, fromBase, 8))
    if (fromBase !== 10) setDecimal(convertBase(value, fromBase, 10))
    if (fromBase !== 16) setHex(convertBase(value, fromBase, 16))
  }

  const handleClear = () => {
    setBinary('')
    setOctal('')
    setDecimal('')
    setHex('')
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <BaseInput
          base={10}
          label={t('tools.numberBaseConverter.decimal')}
          value={decimal}
          onChange={(v) => updateValues(v, 10)}
        />
        <BaseInput
          base={16}
          label={t('tools.numberBaseConverter.hex')}
          value={hex}
          onChange={(v) => updateValues(v, 16)}
        />
        <BaseInput
          base={8}
          label={t('tools.numberBaseConverter.octal')}
          value={octal}
          onChange={(v) => updateValues(v, 8)}
        />
        <BaseInput
          base={2}
          label={t('tools.numberBaseConverter.binary')}
          value={binary}
          onChange={(v) => updateValues(v, 2)}
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleClear} variant="secondary">
          {t('common.clear')}
        </Button>
      </div>

      {/* Privacy Notice */}
      <div className="text-center text-xs text-slate-500 bg-slate-100 rounded-lg py-3 px-4">
        <svg
          className="inline-block w-4 h-4 mr-1 -mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        {t('common.footer.privacy')}
      </div>
    </div>
  )
}
