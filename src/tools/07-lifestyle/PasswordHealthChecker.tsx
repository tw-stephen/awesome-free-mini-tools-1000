import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface PasswordCheck {
  label: string
  passed: boolean
  weight: number
}

export default function PasswordHealthChecker() {
  const { t } = useTranslation()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const analysis = useMemo(() => {
    if (!password) return null

    const checks: PasswordCheck[] = [
      {
        label: t('tools.passwordHealth.minLength'),
        passed: password.length >= 8,
        weight: 15,
      },
      {
        label: t('tools.passwordHealth.goodLength'),
        passed: password.length >= 12,
        weight: 10,
      },
      {
        label: t('tools.passwordHealth.lowercase'),
        passed: /[a-z]/.test(password),
        weight: 15,
      },
      {
        label: t('tools.passwordHealth.uppercase'),
        passed: /[A-Z]/.test(password),
        weight: 15,
      },
      {
        label: t('tools.passwordHealth.numbers'),
        passed: /[0-9]/.test(password),
        weight: 15,
      },
      {
        label: t('tools.passwordHealth.special'),
        passed: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
        weight: 15,
      },
      {
        label: t('tools.passwordHealth.noCommon'),
        passed: !['password', '123456', 'qwerty', 'abc123', 'admin', 'letmein', 'welcome'].some(
          common => password.toLowerCase().includes(common)
        ),
        weight: 10,
      },
      {
        label: t('tools.passwordHealth.noRepeating'),
        passed: !/(.)\1{2,}/.test(password),
        weight: 5,
      },
    ]

    const score = checks.reduce((sum, check) => sum + (check.passed ? check.weight : 0), 0)

    let strength: string
    let color: string
    if (score < 30) {
      strength = t('tools.passwordHealth.veryWeak')
      color = 'text-red-600'
    } else if (score < 50) {
      strength = t('tools.passwordHealth.weak')
      color = 'text-orange-600'
    } else if (score < 70) {
      strength = t('tools.passwordHealth.fair')
      color = 'text-yellow-600'
    } else if (score < 90) {
      strength = t('tools.passwordHealth.strong')
      color = 'text-green-600'
    } else {
      strength = t('tools.passwordHealth.veryStrong')
      color = 'text-green-700'
    }

    // Estimate crack time
    const charset =
      (/[a-z]/.test(password) ? 26 : 0) +
      (/[A-Z]/.test(password) ? 26 : 0) +
      (/[0-9]/.test(password) ? 10 : 0) +
      (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 32 : 0)

    const combinations = Math.pow(charset || 1, password.length)
    const guessesPerSecond = 1e10 // 10 billion (powerful attacker)
    const seconds = combinations / guessesPerSecond

    let crackTime: string
    if (seconds < 1) {
      crackTime = t('tools.passwordHealth.instantly')
    } else if (seconds < 60) {
      crackTime = `${Math.round(seconds)} ${t('tools.passwordHealth.seconds')}`
    } else if (seconds < 3600) {
      crackTime = `${Math.round(seconds / 60)} ${t('tools.passwordHealth.minutes')}`
    } else if (seconds < 86400) {
      crackTime = `${Math.round(seconds / 3600)} ${t('tools.passwordHealth.hours')}`
    } else if (seconds < 31536000) {
      crackTime = `${Math.round(seconds / 86400)} ${t('tools.passwordHealth.days')}`
    } else if (seconds < 31536000 * 1000) {
      crackTime = `${Math.round(seconds / 31536000)} ${t('tools.passwordHealth.years')}`
    } else {
      crackTime = t('tools.passwordHealth.centuries')
    }

    return { checks, score, strength, color, crackTime }
  }, [password, t])

  const generatePassword = (length: number = 16) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-='
    let result = ''
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length]
    }
    setPassword(result)
  }

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(password)
    } catch (e) {
      console.error('Failed to copy')
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.passwordHealth.enterPassword')}
        </h3>
        <div className="relative mb-3">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('tools.passwordHealth.placeholder')}
            className="w-full px-3 py-2 pr-20 border border-slate-300 rounded text-sm font-mono"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
          {password && (
            <button
              onClick={copyPassword}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              📋
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => generatePassword(12)}
            className="flex-1 py-2 bg-slate-100 rounded text-sm hover:bg-slate-200"
          >
            {t('tools.passwordHealth.generate12')}
          </button>
          <button
            onClick={() => generatePassword(16)}
            className="flex-1 py-2 bg-slate-100 rounded text-sm hover:bg-slate-200"
          >
            {t('tools.passwordHealth.generate16')}
          </button>
          <button
            onClick={() => generatePassword(24)}
            className="flex-1 py-2 bg-slate-100 rounded text-sm hover:bg-slate-200"
          >
            {t('tools.passwordHealth.generate24')}
          </button>
        </div>
      </div>

      {analysis && (
        <>
          <div className="card p-4">
            <div className="text-center mb-4">
              <div className={`text-3xl font-bold ${analysis.color}`}>
                {analysis.strength}
              </div>
              <div className="text-sm text-slate-500">
                {t('tools.passwordHealth.score')}: {analysis.score}/100
              </div>
            </div>

            <div className="h-4 bg-slate-200 rounded-full overflow-hidden mb-4">
              <div
                className={`h-full ${
                  analysis.score < 30 ? 'bg-red-500' :
                  analysis.score < 50 ? 'bg-orange-500' :
                  analysis.score < 70 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${analysis.score}%` }}
              />
            </div>

            <div className="text-center p-3 bg-slate-50 rounded">
              <div className="text-sm text-slate-500">
                {t('tools.passwordHealth.crackTime')}
              </div>
              <div className="text-lg font-medium">{analysis.crackTime}</div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.passwordHealth.checks')}
            </h3>
            <div className="space-y-2">
              {analysis.checks.map((check, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className={check.passed ? 'text-green-500' : 'text-red-500'}>
                    {check.passed ? '✓' : '✗'}
                  </span>
                  <span className={`text-sm ${check.passed ? '' : 'text-slate-500'}`}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.passwordHealth.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.passwordHealth.tip1')}</li>
          <li>{t('tools.passwordHealth.tip2')}</li>
          <li>{t('tools.passwordHealth.tip3')}</li>
        </ul>
      </div>

      <div className="card p-4 bg-yellow-50">
        <p className="text-sm text-yellow-700">
          ⚠️ {t('tools.passwordHealth.warning')}
        </p>
      </div>
    </div>
  )
}
