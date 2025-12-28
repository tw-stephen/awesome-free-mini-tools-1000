import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function DevPasswordGenerator() {
  const { t } = useTranslation()
  const [length, setLength] = useState(16)
  const [includeUpper, setIncludeUpper] = useState(true)
  const [includeLower, setIncludeLower] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)
  const [passwords, setPasswords] = useState<string[]>([])
  const [count, setCount] = useState(5)
  const { copy, copied } = useClipboard()

  const generate = useCallback(() => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    const ambiguous = 'Il1O0'

    let chars = ''
    if (includeUpper) chars += uppercase
    if (includeLower) chars += lowercase
    if (includeNumbers) chars += numbers
    if (includeSymbols) chars += symbols

    if (excludeAmbiguous) {
      chars = chars.split('').filter(c => !ambiguous.includes(c)).join('')
    }

    if (chars.length === 0) {
      setPasswords([])
      return
    }

    const newPasswords: string[] = []
    for (let i = 0; i < count; i++) {
      let password = ''
      const array = new Uint32Array(length)
      crypto.getRandomValues(array)
      for (let j = 0; j < length; j++) {
        password += chars[array[j] % chars.length]
      }
      newPasswords.push(password)
    }

    setPasswords(newPasswords)
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous, count])

  const getStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0

    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (password.length >= 16) score++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++

    if (score <= 2) return { score, label: t('tools.devPasswordGenerator.weak'), color: 'bg-red-500' }
    if (score <= 4) return { score, label: t('tools.devPasswordGenerator.medium'), color: 'bg-yellow-500' }
    return { score, label: t('tools.devPasswordGenerator.strong'), color: 'bg-green-500' }
  }

  const presets = [
    { name: t('tools.devPasswordGenerator.presetPin'), length: 4, upper: false, lower: false, numbers: true, symbols: false },
    { name: t('tools.devPasswordGenerator.presetSimple'), length: 8, upper: true, lower: true, numbers: true, symbols: false },
    { name: t('tools.devPasswordGenerator.presetStrong'), length: 16, upper: true, lower: true, numbers: true, symbols: true },
    { name: t('tools.devPasswordGenerator.presetApi'), length: 32, upper: true, lower: true, numbers: true, symbols: false },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.devPasswordGenerator.options')}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-2">
              {t('tools.devPasswordGenerator.length')}: {length}
            </label>
            <input
              type="range"
              min="4"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">
              {t('tools.devPasswordGenerator.count')}: {count}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={includeUpper}
                onChange={(e) => setIncludeUpper(e.target.checked)}
              />
              {t('tools.devPasswordGenerator.uppercase')} (A-Z)
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={includeLower}
                onChange={(e) => setIncludeLower(e.target.checked)}
              />
              {t('tools.devPasswordGenerator.lowercase')} (a-z)
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
              />
              {t('tools.devPasswordGenerator.numbers')} (0-9)
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
              />
              {t('tools.devPasswordGenerator.symbols')} (!@#$...)
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={(e) => setExcludeAmbiguous(e.target.checked)}
            />
            {t('tools.devPasswordGenerator.excludeAmbiguous')} (Il1O0)
          </label>
        </div>

        <Button variant="primary" onClick={generate} className="mt-4">
          {t('tools.devPasswordGenerator.generate')}
        </Button>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.devPasswordGenerator.presets')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.name}
              variant="secondary"
              onClick={() => {
                setLength(preset.length)
                setIncludeUpper(preset.upper)
                setIncludeLower(preset.lower)
                setIncludeNumbers(preset.numbers)
                setIncludeSymbols(preset.symbols)
              }}
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </div>

      {passwords.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.devPasswordGenerator.generated')} ({passwords.length})
          </h3>

          <div className="space-y-2">
            {passwords.map((password, i) => {
              const strength = getStrength(password)
              return (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <code className="flex-1 font-mono text-sm text-slate-800 break-all">
                    {password}
                  </code>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${strength.color}`} title={strength.label} />
                    <Button variant="secondary" onClick={() => copy(password)}>
                      {copied ? t('common.copied') : t('common.copy')}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">
              {t('tools.devPasswordGenerator.entropy')}: ~{Math.floor(Math.log2(
                (includeUpper ? 26 : 0) +
                (includeLower ? 26 : 0) +
                (includeNumbers ? 10 : 0) +
                (includeSymbols ? 26 : 0)
              ) * length)} bits
            </p>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.devPasswordGenerator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.devPasswordGenerator.tip1')}</li>
          <li>{t('tools.devPasswordGenerator.tip2')}</li>
          <li>{t('tools.devPasswordGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
