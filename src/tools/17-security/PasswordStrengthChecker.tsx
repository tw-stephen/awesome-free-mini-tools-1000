import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface StrengthCriteria {
  label: string
  met: boolean
  weight: number
}

export default function PasswordStrengthChecker() {
  const { t } = useTranslation()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [criteria, setCriteria] = useState<StrengthCriteria[]>([])
  const [score, setScore] = useState(0)
  const [crackTime, setCrackTime] = useState('')

  useEffect(() => {
    analyzePassword(password)
  }, [password])

  const analyzePassword = (pwd: string) => {
    const newCriteria: StrengthCriteria[] = [
      { label: 'At least 8 characters', met: pwd.length >= 8, weight: 1 },
      { label: 'At least 12 characters', met: pwd.length >= 12, weight: 1 },
      { label: 'At least 16 characters', met: pwd.length >= 16, weight: 1 },
      { label: 'Contains uppercase letters', met: /[A-Z]/.test(pwd), weight: 1 },
      { label: 'Contains lowercase letters', met: /[a-z]/.test(pwd), weight: 1 },
      { label: 'Contains numbers', met: /[0-9]/.test(pwd), weight: 1 },
      { label: 'Contains special characters', met: /[^A-Za-z0-9]/.test(pwd), weight: 2 },
      { label: 'No common patterns (123, abc)', met: !/(123|abc|qwerty|password)/i.test(pwd), weight: 1 },
      { label: 'No repeated characters (aaa)', met: !/(.)\1{2,}/.test(pwd), weight: 1 },
    ]

    setCriteria(newCriteria)

    const totalScore = newCriteria.reduce((acc, c) => acc + (c.met ? c.weight : 0), 0)
    const maxScore = newCriteria.reduce((acc, c) => acc + c.weight, 0)
    setScore(Math.round((totalScore / maxScore) * 100))

    // Estimate crack time
    if (pwd.length === 0) {
      setCrackTime('')
    } else {
      const charsetSize =
        (/[a-z]/.test(pwd) ? 26 : 0) +
        (/[A-Z]/.test(pwd) ? 26 : 0) +
        (/[0-9]/.test(pwd) ? 10 : 0) +
        (/[^A-Za-z0-9]/.test(pwd) ? 32 : 0)

      const combinations = Math.pow(charsetSize || 1, pwd.length)
      const guessesPerSecond = 1e10 // 10 billion guesses/sec
      const seconds = combinations / guessesPerSecond / 2

      if (seconds < 1) setCrackTime('Instantly')
      else if (seconds < 60) setCrackTime(`${Math.round(seconds)} seconds`)
      else if (seconds < 3600) setCrackTime(`${Math.round(seconds / 60)} minutes`)
      else if (seconds < 86400) setCrackTime(`${Math.round(seconds / 3600)} hours`)
      else if (seconds < 31536000) setCrackTime(`${Math.round(seconds / 86400)} days`)
      else if (seconds < 31536000 * 100) setCrackTime(`${Math.round(seconds / 31536000)} years`)
      else if (seconds < 31536000 * 1000000) setCrackTime(`${Math.round(seconds / 31536000 / 1000)} thousand years`)
      else setCrackTime('Millions of years+')
    }
  }

  const getStrengthLabel = (): { label: string; color: string } => {
    if (score === 0) return { label: 'None', color: 'text-slate-400' }
    if (score < 30) return { label: 'Very Weak', color: 'text-red-600' }
    if (score < 50) return { label: 'Weak', color: 'text-orange-500' }
    if (score < 70) return { label: 'Fair', color: 'text-yellow-600' }
    if (score < 90) return { label: 'Strong', color: 'text-blue-600' }
    return { label: 'Very Strong', color: 'text-green-600' }
  }

  const strength = getStrengthLabel()

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-1">{t('tools.passwordStrengthChecker.enter')}</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password to check..."
            className="w-full px-4 py-3 border border-slate-300 rounded pr-20 font-mono"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-slate-500 hover:text-slate-700"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      {password && (
        <>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">{t('tools.passwordStrengthChecker.strength')}</h3>
              <span className={`font-bold ${strength.color}`}>{strength.label}</span>
            </div>
            <div className="bg-slate-200 rounded-full h-3 mb-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  score < 30 ? 'bg-red-500' :
                  score < 50 ? 'bg-orange-500' :
                  score < 70 ? 'bg-yellow-500' :
                  score < 90 ? 'bg-blue-500' : 'bg-green-500'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
            <div className="text-center">
              <span className="text-3xl font-bold">{score}</span>
              <span className="text-slate-500">/100</span>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.passwordStrengthChecker.crackTime')}</h3>
            <div className="text-center py-4 bg-slate-50 rounded">
              <p className="text-2xl font-bold text-slate-700">{crackTime}</p>
              <p className="text-sm text-slate-500 mt-1">Estimated time to crack (10B guesses/sec)</p>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.passwordStrengthChecker.criteria')}</h3>
            <div className="space-y-2">
              {criteria.map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-slate-50 rounded">
                  <span className={`text-lg ${c.met ? 'text-green-500' : 'text-red-400'}`}>
                    {c.met ? '✓' : '✗'}
                  </span>
                  <span className={c.met ? 'text-slate-700' : 'text-slate-400'}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4 bg-blue-50">
            <h4 className="font-medium mb-2">{t('tools.passwordStrengthChecker.tips')}</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Use a mix of uppercase, lowercase, numbers, and symbols</li>
              <li>• Avoid dictionary words and common patterns</li>
              <li>• Use at least 12-16 characters for better security</li>
              <li>• Consider using a password manager</li>
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
