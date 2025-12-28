import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface BreachInfo {
  name: string
  domain: string
  date: string
  count: number
  description: string
  dataTypes: string[]
}

export default function DataBreachChecker() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [checked, setChecked] = useState(false)
  const [breaches, setBreaches] = useState<BreachInfo[]>([])

  // Simulated breach check (in production, would use HaveIBeenPwned API or similar)
  const checkBreaches = () => {
    if (!email) return

    setIsChecking(true)

    // Simulate API call delay
    setTimeout(() => {
      // Demo data - in production, this would come from an API
      const demoBreaches: BreachInfo[] = [
        {
          name: 'Example Service',
          domain: 'example.com',
          date: '2023-05-15',
          count: 2500000,
          description: 'User data was exposed due to a misconfigured database.',
          dataTypes: ['Email addresses', 'Passwords', 'Names']
        },
        {
          name: 'Demo Platform',
          domain: 'demo-platform.io',
          date: '2022-11-20',
          count: 500000,
          description: 'Credentials were leaked following a phishing attack.',
          dataTypes: ['Email addresses', 'Password hashes', 'IP addresses']
        }
      ]

      // Randomly show 0-2 breaches for demo
      const numBreaches = Math.floor(Math.random() * 3)
      setBreaches(demoBreaches.slice(0, numBreaches))
      setIsChecking(false)
      setChecked(true)
    }, 2000)
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return num.toString()
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.dataBreachChecker.check')}</h3>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setChecked(false) }}
            placeholder="Enter your email address..."
            className="flex-1 px-4 py-3 border border-slate-300 rounded"
          />
          <button
            onClick={checkBreaches}
            disabled={!email || isChecking}
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
          >
            {isChecking ? 'Checking...' : 'Check'}
          </button>
        </div>
        <p className="text-sm text-slate-500 mt-2">
          We'll check if your email appears in known data breaches.
        </p>
      </div>

      {isChecking && (
        <div className="card p-8 text-center">
          <div className="animate-spin text-4xl mb-4">🔍</div>
          <p className="text-slate-600">Checking breach databases...</p>
        </div>
      )}

      {checked && !isChecking && (
        <>
          {breaches.length === 0 ? (
            <div className="card p-8 text-center bg-green-50">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-green-700 mb-2">{t('tools.dataBreachChecker.noBreaches')}</h3>
              <p className="text-slate-600">
                Good news! Your email was not found in any known data breaches.
              </p>
            </div>
          ) : (
            <div className="card p-4 bg-red-50">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">⚠️</span>
                <div>
                  <h3 className="font-bold text-red-700">{t('tools.dataBreachChecker.found')}</h3>
                  <p className="text-sm text-red-600">
                    Your email was found in {breaches.length} data breach{breaches.length > 1 ? 'es' : ''}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {breaches.map((breach, i) => (
                  <div key={i} className="bg-white p-4 rounded border border-red-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold">{breach.name}</h4>
                        <p className="text-sm text-slate-500">{breach.domain}</p>
                      </div>
                      <span className="text-sm text-slate-500">{breach.date}</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{breach.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {breach.dataTypes.map((type, j) => (
                          <span key={j} className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                            {type}
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-slate-500">
                        {formatNumber(breach.count)} accounts affected
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.dataBreachChecker.recommendations')}</h3>
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 rounded">
                <h4 className="font-medium text-blue-700">Change Your Passwords</h4>
                <p className="text-sm text-slate-600">
                  If your data was exposed, change passwords for affected accounts immediately.
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <h4 className="font-medium text-green-700">Enable Two-Factor Authentication</h4>
                <p className="text-sm text-slate-600">
                  Add an extra layer of security to your accounts.
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded">
                <h4 className="font-medium text-yellow-700">Use Unique Passwords</h4>
                <p className="text-sm text-slate-600">
                  Never reuse passwords across different services.
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <h4 className="font-medium text-purple-700">Consider a Password Manager</h4>
                <p className="text-sm text-slate-600">
                  Use a password manager to generate and store strong, unique passwords.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.dataBreachChecker.info')}</h4>
        <p className="text-sm text-slate-600 mb-2">
          This is a demonstration tool. For real breach checking, we recommend:
        </p>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• <strong>Have I Been Pwned</strong> - haveibeenpwned.com</li>
          <li>• <strong>Firefox Monitor</strong> - monitor.firefox.com</li>
          <li>• <strong>Google Password Checkup</strong> - passwords.google.com</li>
        </ul>
      </div>
    </div>
  )
}
