import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function PasswordGenerator() {
  const { t } = useTranslation()
  const [length, setLength] = useState(16)
  const [includeUpper, setIncludeUpper] = useState(true)
  const [includeLower, setIncludeLower] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)
  const [password, setPassword] = useState('')
  const [history, setHistory] = useState<string[]>([])

  const generate = () => {
    let chars = ''
    if (includeUpper) chars += excludeAmbiguous ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (includeLower) chars += excludeAmbiguous ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz'
    if (includeNumbers) chars += excludeAmbiguous ? '23456789' : '0123456789'
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'

    if (chars.length === 0) {
      setPassword('Select at least one option')
      return
    }

    let result = ''
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length]
    }
    setPassword(result)
    setHistory([result, ...history.slice(0, 9)])
  }

  const getStrength = (): { label: string; color: string; percent: number } => {
    if (!password) return { label: 'None', color: 'bg-slate-200', percent: 0 }

    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (password.length >= 16) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++

    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', percent: 25 }
    if (score <= 4) return { label: 'Fair', color: 'bg-yellow-500', percent: 50 }
    if (score <= 5) return { label: 'Good', color: 'bg-blue-500', percent: 75 }
    return { label: 'Strong', color: 'bg-green-500', percent: 100 }
  }

  const strength = getStrength()

  const copy = () => {
    navigator.clipboard.writeText(password)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.passwordGenerator.options')}</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm text-slate-500">{t('tools.passwordGenerator.length')}</label>
              <span className="font-mono">{length}</span>
            </div>
            <input
              type="range"
              min="4"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 p-2 bg-slate-50 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={includeUpper}
                onChange={(e) => setIncludeUpper(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Uppercase (A-Z)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-50 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={includeLower}
                onChange={(e) => setIncludeLower(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Lowercase (a-z)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-50 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Numbers (0-9)</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-slate-50 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Symbols (!@#$%)</span>
            </label>
          </div>

          <label className="flex items-center gap-2 p-2 bg-slate-50 rounded cursor-pointer">
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={(e) => setExcludeAmbiguous(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Exclude ambiguous characters (0, O, l, 1, I)</span>
          </label>
        </div>
      </div>

      <div className="card p-4">
        <button
          onClick={generate}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
        >
          {t('tools.passwordGenerator.generate')}
        </button>
      </div>

      {password && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.passwordGenerator.result')}</h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={password}
              readOnly
              className="flex-1 px-4 py-3 bg-slate-100 rounded font-mono text-lg"
            />
            <button
              onClick={copy}
              className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
            >
              Copy
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-slate-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${strength.color}`}
                style={{ width: `${strength.percent}%` }}
              />
            </div>
            <span className={`text-sm font-medium ${
              strength.label === 'Strong' ? 'text-green-600' :
              strength.label === 'Good' ? 'text-blue-600' :
              strength.label === 'Fair' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {strength.label}
            </span>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.passwordGenerator.history')}</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {history.map((pw, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                <span className="flex-1 font-mono text-sm truncate">{pw}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(pw)}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
