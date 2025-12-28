import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

const generatePassword = (
  length: number,
  useLowercase: boolean,
  useUppercase: boolean,
  useNumbers: boolean,
  useSymbols: boolean,
  excludeAmbiguous: boolean
): string => {
  let chars = ''
  if (useLowercase) chars += LOWERCASE
  if (useUppercase) chars += UPPERCASE
  if (useNumbers) chars += NUMBERS
  if (useSymbols) chars += SYMBOLS

  if (!chars) return ''

  // Exclude ambiguous characters
  if (excludeAmbiguous) {
    chars = chars.replace(/[0O1lI|]/g, '')
  }

  let password = ''
  const array = new Uint32Array(length)
  crypto.getRandomValues(array)

  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length]
  }

  return password
}

const calculateStrength = (password: string): { score: number; label: string; color: string } => {
  if (!password) return { score: 0, label: 'none', color: 'bg-slate-200' }

  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (password.length >= 16) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^a-zA-Z0-9]/.test(password)) score += 1

  if (score <= 2) return { score, label: 'weak', color: 'bg-red-500' }
  if (score <= 4) return { score, label: 'fair', color: 'bg-yellow-500' }
  if (score <= 5) return { score, label: 'good', color: 'bg-blue-500' }
  return { score, label: 'strong', color: 'bg-green-500' }
}

export default function PasswordGenerator() {
  const { t } = useTranslation()
  const [length, setLength] = useState(16)
  const [useLowercase, setUseLowercase] = useState(true)
  const [useUppercase, setUseUppercase] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)
  const [password, setPassword] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const { copied, copy } = useClipboard()

  const generate = useCallback(() => {
    const newPassword = generatePassword(
      length,
      useLowercase,
      useUppercase,
      useNumbers,
      useSymbols,
      excludeAmbiguous
    )
    setPassword(newPassword)
    if (newPassword) {
      setHistory((prev) => [newPassword, ...prev.slice(0, 9)])
    }
  }, [length, useLowercase, useUppercase, useNumbers, useSymbols, excludeAmbiguous])

  const strength = calculateStrength(password)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center gap-4 mb-4">
          <input
            type="text"
            value={password}
            readOnly
            placeholder={t('tools.passwordGenerator.placeholder')}
            className="flex-1 px-4 py-3 font-mono text-lg border border-slate-200 rounded-lg focus:outline-none"
          />
          <Button onClick={() => copy(password)} disabled={!password}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
          <Button onClick={generate} variant="primary">
            {t('tools.passwordGenerator.generate')}
          </Button>
        </div>

        {password && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-slate-600">{t('tools.passwordGenerator.strength')}:</span>
              <span className={`text-sm font-medium ${strength.color.replace('bg-', 'text-')}`}>
                {t(`tools.passwordGenerator.${strength.label}`)}
              </span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${strength.color} transition-all`}
                style={{ width: `${(strength.score / 7) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">{t('tools.passwordGenerator.settings')}</h3>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-slate-600">{t('tools.passwordGenerator.length')}</label>
              <span className="text-sm font-medium text-slate-700">{length}</span>
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

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useLowercase}
                onChange={(e) => setUseLowercase(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300"
              />
              <span className="text-sm text-slate-700">{t('tools.passwordGenerator.lowercase')}</span>
              <span className="text-xs text-slate-400">(a-z)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useUppercase}
                onChange={(e) => setUseUppercase(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300"
              />
              <span className="text-sm text-slate-700">{t('tools.passwordGenerator.uppercase')}</span>
              <span className="text-xs text-slate-400">(A-Z)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useNumbers}
                onChange={(e) => setUseNumbers(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300"
              />
              <span className="text-sm text-slate-700">{t('tools.passwordGenerator.numbers')}</span>
              <span className="text-xs text-slate-400">(0-9)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useSymbols}
                onChange={(e) => setUseSymbols(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300"
              />
              <span className="text-sm text-slate-700">{t('tools.passwordGenerator.symbols')}</span>
              <span className="text-xs text-slate-400">(!@#$)</span>
            </label>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={(e) => setExcludeAmbiguous(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300"
            />
            <span className="text-sm text-slate-700">{t('tools.passwordGenerator.excludeAmbiguous')}</span>
            <span className="text-xs text-slate-400">(0O1lI|)</span>
          </label>
        </div>
      </div>

      {history.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.passwordGenerator.history')}</h3>
          <div className="space-y-2">
            {history.map((pwd, i) => (
              <div key={i} className="flex items-center gap-2">
                <code className="flex-1 px-3 py-1 text-sm bg-slate-50 rounded font-mono truncate">
                  {pwd}
                </code>
                <button
                  onClick={() => copy(pwd)}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  {t('common.copy')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
