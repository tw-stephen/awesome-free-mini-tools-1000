import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function TwoFactorSetup() {
  const { t } = useTranslation()
  const [accountName, setAccountName] = useState('')
  const [issuer, setIssuer] = useState('')
  const [secret, setSecret] = useState('')
  const [algorithm, setAlgorithm] = useState('SHA1')
  const [digits, setDigits] = useState(6)
  const [period, setPeriod] = useState(30)

  const generateSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    let result = ''
    const array = new Uint32Array(32)
    crypto.getRandomValues(array)
    for (let i = 0; i < 32; i++) {
      result += chars[array[i] % chars.length]
    }
    setSecret(result)
  }

  const getOTPAuthURL = (): string => {
    if (!secret || !accountName) return ''
    const label = issuer ? `${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}` : encodeURIComponent(accountName)
    let url = `otpauth://totp/${label}?secret=${secret}`
    if (issuer) url += `&issuer=${encodeURIComponent(issuer)}`
    url += `&algorithm=${algorithm}&digits=${digits}&period=${period}`
    return url
  }

  const otpauthURL = getOTPAuthURL()

  const copySecret = () => {
    navigator.clipboard.writeText(secret)
  }

  const copyURL = () => {
    navigator.clipboard.writeText(otpauthURL)
  }

  const formatSecret = (s: string): string => {
    return s.match(/.{1,4}/g)?.join(' ') || s
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.twoFactorSetup.setup')}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.twoFactorSetup.issuer')}</label>
            <input
              type="text"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="Company or service name"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.twoFactorSetup.account')}</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.twoFactorSetup.secret')}</h3>
          <button
            onClick={generateSecret}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
          >
            Generate New
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={secret}
            onChange={(e) => setSecret(e.target.value.toUpperCase().replace(/[^A-Z2-7]/g, ''))}
            placeholder="Base32 secret key..."
            className="flex-1 px-3 py-2 border border-slate-300 rounded font-mono"
          />
          <button
            onClick={copySecret}
            disabled={!secret}
            className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300 disabled:opacity-50"
          >
            Copy
          </button>
        </div>
        {secret && (
          <p className="mt-2 text-sm text-slate-500 font-mono tracking-wider">
            Formatted: {formatSecret(secret)}
          </p>
        )}
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.twoFactorSetup.options')}</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              <option value="SHA1">SHA-1</option>
              <option value="SHA256">SHA-256</option>
              <option value="SHA512">SHA-512</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Digits</label>
            <select
              value={digits}
              onChange={(e) => setDigits(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              <option value={6}>6</option>
              <option value={8}>8</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Period (sec)</label>
            <select
              value={period}
              onChange={(e) => setPeriod(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              <option value={30}>30</option>
              <option value={60}>60</option>
            </select>
          </div>
        </div>
      </div>

      {otpauthURL && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.twoFactorSetup.result')}</h3>
          <div className="p-4 bg-white border-2 border-dashed border-slate-300 rounded text-center mb-3">
            <p className="text-slate-500 text-sm mb-2">QR Code would appear here</p>
            <p className="text-xs text-slate-400">(Use a QR code generator with the URL below)</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-500">OTPAuth URL:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={otpauthURL}
                readOnly
                className="flex-1 px-3 py-2 bg-slate-100 rounded text-sm font-mono"
              />
              <button
                onClick={copyURL}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4 bg-yellow-50">
        <h4 className="font-medium mb-2">{t('tools.twoFactorSetup.warning')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Store your secret key securely - it cannot be recovered</li>
          <li>• Use a trusted authenticator app (Google Authenticator, Authy, etc.)</li>
          <li>• Keep backup codes in a safe place</li>
          <li>• The secret is generated locally and never sent anywhere</li>
        </ul>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">Compatible Apps</h4>
        <div className="flex flex-wrap gap-2">
          {['Google Authenticator', 'Authy', 'Microsoft Authenticator', '1Password', 'Bitwarden'].map((app) => (
            <span key={app} className="px-3 py-1 bg-white rounded text-sm border border-slate-200">
              {app}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
