import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface PasswordHistory {
  password: string
  strength: number
  createdAt: string
}

export default function PasswordGeneratorPro() {
  const { t } = useTranslation()
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: true,
    excludeAmbiguous: false
  })
  const [history, setHistory] = useState<PasswordHistory[]>([])
  const [copied, setCopied] = useState(false)

  const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  }

  const similarChars = 'il1Lo0O'
  const ambiguousChars = '{}[]()/\\\'"`~,;:.<>'

  useEffect(() => {
    const saved = localStorage.getItem('password-history')
    if (saved) setHistory(JSON.parse(saved))
    generatePassword()
  }, [])

  useEffect(() => {
    generatePassword()
  }, [length, options])

  const generatePassword = () => {
    let chars = ''

    if (options.uppercase) chars += charSets.uppercase
    if (options.lowercase) chars += charSets.lowercase
    if (options.numbers) chars += charSets.numbers
    if (options.symbols) chars += charSets.symbols

    if (options.excludeSimilar) {
      chars = chars.split('').filter(c => !similarChars.includes(c)).join('')
    }
    if (options.excludeAmbiguous) {
      chars = chars.split('').filter(c => !ambiguousChars.includes(c)).join('')
    }

    if (chars.length === 0) {
      chars = charSets.lowercase
    }

    let pwd = ''
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)
    for (let i = 0; i < length; i++) {
      pwd += chars[array[i] % chars.length]
    }

    setPassword(pwd)
  }

  const calculateStrength = (pwd: string): number => {
    let score = 0

    if (pwd.length >= 8) score += 1
    if (pwd.length >= 12) score += 1
    if (pwd.length >= 16) score += 1
    if (/[a-z]/.test(pwd)) score += 1
    if (/[A-Z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd)) score += 1
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1
    if (pwd.length >= 20) score += 1

    return Math.min(score, 8)
  }

  const getStrengthInfo = (score: number) => {
    if (score <= 2) return { label: t('tools.passwordGeneratorPro.weak'), color: 'bg-red-500', textColor: 'text-red-500' }
    if (score <= 4) return { label: t('tools.passwordGeneratorPro.fair'), color: 'bg-yellow-500', textColor: 'text-yellow-500' }
    if (score <= 6) return { label: t('tools.passwordGeneratorPro.good'), color: 'bg-blue-500', textColor: 'text-blue-500' }
    return { label: t('tools.passwordGeneratorPro.strong'), color: 'bg-green-500', textColor: 'text-green-500' }
  }

  const strength = calculateStrength(password)
  const strengthInfo = getStrengthInfo(strength)

  const copyPassword = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    const entry: PasswordHistory = {
      password,
      strength,
      createdAt: new Date().toISOString()
    }
    const updated = [entry, ...history.slice(0, 9)]
    setHistory(updated)
    localStorage.setItem('password-history', JSON.stringify(updated))
  }

  const calculateEntropy = () => {
    let poolSize = 0
    if (options.uppercase) poolSize += 26
    if (options.lowercase) poolSize += 26
    if (options.numbers) poolSize += 10
    if (options.symbols) poolSize += 32

    if (options.excludeSimilar) poolSize -= 7
    if (options.excludeAmbiguous) poolSize -= 18

    const entropy = Math.log2(Math.pow(Math.max(poolSize, 1), length))
    return Math.round(entropy)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="mb-4">
          <div className="flex items-center gap-2 p-3 bg-slate-100 rounded font-mono text-lg break-all">
            <span className="flex-1">{password}</span>
            <button
              onClick={generatePassword}
              className="shrink-0 px-2 py-1 bg-slate-200 rounded text-sm"
              title={t('tools.passwordGeneratorPro.regenerate')}
            >
              🔄
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>{t('tools.passwordGeneratorPro.strength')}</span>
            <span className={strengthInfo.textColor}>{strengthInfo.label}</span>
          </div>
          <div className="h-2 bg-slate-200 rounded overflow-hidden">
            <div
              className={`h-full ${strengthInfo.color}`}
              style={{ width: `${(strength / 8) * 100}%` }}
            />
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {t('tools.passwordGeneratorPro.entropy')}: {calculateEntropy()} bits
          </div>
        </div>

        <button
          onClick={copyPassword}
          className={`w-full py-3 rounded font-medium ${
            copied ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
          }`}
        >
          {copied ? '✓ ' + t('tools.passwordGeneratorPro.copied') : t('tools.passwordGeneratorPro.copy')}
        </button>
      </div>

      <div className="card p-4">
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <label className="text-sm text-slate-700">{t('tools.passwordGeneratorPro.length')}</label>
            <span className="font-medium">{length}</span>
          </div>
          <input
            type="range"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            min="4"
            max="64"
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>4</span>
            <span>64</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-sm text-slate-700 mb-2">{t('tools.passwordGeneratorPro.characters')}</h3>
          {[
            { key: 'uppercase', label: t('tools.passwordGeneratorPro.uppercase'), sample: 'ABCDEFG' },
            { key: 'lowercase', label: t('tools.passwordGeneratorPro.lowercase'), sample: 'abcdefg' },
            { key: 'numbers', label: t('tools.passwordGeneratorPro.numbers'), sample: '0123456' },
            { key: 'symbols', label: t('tools.passwordGeneratorPro.symbols'), sample: '!@#$%^&' }
          ].map(({ key, label, sample }) => (
            <label key={key} className="flex items-center justify-between p-2 bg-slate-50 rounded cursor-pointer">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options[key as keyof typeof options]}
                  onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                />
                <span className="text-sm">{label}</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">{sample}</span>
            </label>
          ))}
        </div>

        <div className="space-y-2 mt-4">
          <h3 className="font-medium text-sm text-slate-700 mb-2">{t('tools.passwordGeneratorPro.exclusions')}</h3>
          <label className="flex items-center gap-2 p-2 bg-slate-50 rounded cursor-pointer">
            <input
              type="checkbox"
              checked={options.excludeSimilar}
              onChange={(e) => setOptions({ ...options, excludeSimilar: e.target.checked })}
            />
            <div>
              <span className="text-sm">{t('tools.passwordGeneratorPro.excludeSimilar')}</span>
              <span className="text-xs text-slate-400 ml-2 font-mono">(i, l, 1, L, o, 0, O)</span>
            </div>
          </label>
          <label className="flex items-center gap-2 p-2 bg-slate-50 rounded cursor-pointer">
            <input
              type="checkbox"
              checked={options.excludeAmbiguous}
              onChange={(e) => setOptions({ ...options, excludeAmbiguous: e.target.checked })}
            />
            <div>
              <span className="text-sm">{t('tools.passwordGeneratorPro.excludeAmbiguous')}</span>
              <span className="text-xs text-slate-400 ml-2 font-mono">{'({ } [ ] ( ) / \\ \' " ` ~)'}</span>
            </div>
          </label>
        </div>
      </div>

      {history.length > 0 && (
        <div className="card p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-slate-700">{t('tools.passwordGeneratorPro.history')}</h3>
            <button
              onClick={() => {
                setHistory([])
                localStorage.removeItem('password-history')
              }}
              className="text-xs text-red-500"
            >
              {t('tools.passwordGeneratorPro.clearHistory')}
            </button>
          </div>
          <div className="space-y-2">
            {history.map((entry, i) => {
              const info = getStrengthInfo(entry.strength)
              return (
                <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded text-sm">
                  <span className={`w-2 h-2 rounded-full ${info.color}`} />
                  <span className="flex-1 font-mono truncate">{entry.password}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(entry.password)
                    }}
                    className="text-blue-500 shrink-0"
                  >
                    {t('tools.passwordGeneratorPro.copy')}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium text-slate-700 mb-2">{t('tools.passwordGeneratorPro.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.passwordGeneratorPro.tip1')}</li>
          <li>• {t('tools.passwordGeneratorPro.tip2')}</li>
          <li>• {t('tools.passwordGeneratorPro.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
