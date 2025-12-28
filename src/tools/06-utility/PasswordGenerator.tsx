import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'

export default function PasswordGenerator() {
  const { t } = useTranslation()
  const { copy, copied } = useClipboard()
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  const generatePassword = useCallback(() => {
    let chars = ''

    if (includeUppercase) {
      chars += excludeAmbiguous ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    }
    if (includeLowercase) {
      chars += excludeAmbiguous ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz'
    }
    if (includeNumbers) {
      chars += excludeAmbiguous ? '23456789' : '0123456789'
    }
    if (includeSymbols) {
      chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'
    }

    if (chars.length === 0) {
      chars = 'abcdefghijklmnopqrstuvwxyz'
    }

    const array = new Uint32Array(length)
    crypto.getRandomValues(array)

    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length]
    }

    setPassword(result)
    setHistory((prev) => [result, ...prev.slice(0, 9)])
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeAmbiguous])

  const getStrength = (pwd: string) => {
    if (!pwd) return { level: 0, label: '', color: '' }

    let score = 0

    // Length
    if (pwd.length >= 8) score += 1
    if (pwd.length >= 12) score += 1
    if (pwd.length >= 16) score += 1

    // Complexity
    if (/[a-z]/.test(pwd)) score += 1
    if (/[A-Z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd)) score += 1
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1

    if (score <= 2) return { level: 1, label: t('tools.passwordGenerator.weak'), color: 'bg-red-500' }
    if (score <= 4) return { level: 2, label: t('tools.passwordGenerator.fair'), color: 'bg-yellow-500' }
    if (score <= 5) return { level: 3, label: t('tools.passwordGenerator.good'), color: 'bg-blue-500' }
    return { level: 4, label: t('tools.passwordGenerator.strong'), color: 'bg-green-500' }
  }

  const strength = getStrength(password)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={password}
              readOnly
              placeholder={t('tools.passwordGenerator.clickGenerate')}
              className="w-full px-3 py-3 pr-24 bg-slate-100 border border-slate-300 rounded font-mono text-lg"
            />
            <button
              onClick={() => copy(password)}
              disabled={!password}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              {copied ? t('common.copied') : t('common.copy')}
            </button>
          </div>

          {password && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${strength.color}`}
                    style={{ width: `${strength.level * 25}%` }}
                  />
                </div>
                <span className={`text-sm font-medium ${
                  strength.level === 1 ? 'text-red-500' :
                  strength.level === 2 ? 'text-yellow-500' :
                  strength.level === 3 ? 'text-blue-500' : 'text-green-500'
                }`}>
                  {strength.label}
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={generatePassword}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
        >
          {t('tools.passwordGenerator.generate')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.passwordGenerator.options')}
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-slate-600">
                {t('tools.passwordGenerator.length')}: {length}
              </label>
            </div>
            <input
              type="range"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              min="4"
              max="64"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>4</span>
              <span>64</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-slate-600">
                {t('tools.passwordGenerator.uppercase')} (A-Z)
              </span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-slate-600">
                {t('tools.passwordGenerator.lowercase')} (a-z)
              </span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-slate-600">
                {t('tools.passwordGenerator.numbers')} (0-9)
              </span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-slate-600">
                {t('tools.passwordGenerator.symbols')} (!@#$%...)
              </span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={excludeAmbiguous}
                onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-slate-600">
                {t('tools.passwordGenerator.excludeAmbiguous')} (0, O, l, 1, I)
              </span>
            </label>
          </div>
        </div>
      </div>

      {history.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.passwordGenerator.history')}
            </h3>
            <button
              onClick={() => setHistory([])}
              className="text-xs text-red-500 hover:text-red-700"
            >
              {t('common.clear')}
            </button>
          </div>
          <div className="space-y-1">
            {history.map((pwd, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 bg-slate-50 rounded text-sm"
              >
                <span className="font-mono truncate flex-1">{pwd}</span>
                <button
                  onClick={() => copy(pwd)}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  {t('common.copy')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.passwordGenerator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.passwordGenerator.tip1')}</li>
          <li>{t('tools.passwordGenerator.tip2')}</li>
          <li>{t('tools.passwordGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
