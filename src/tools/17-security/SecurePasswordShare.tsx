import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface SharedSecret {
  id: string
  encryptedData: string
  expiresAt: number
  maxViews: number
  currentViews: number
}

export default function SecurePasswordShare() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'create' | 'view'>('create')
  const [secret, setSecret] = useState('')
  const [expiry, setExpiry] = useState('1h')
  const [maxViews, setMaxViews] = useState(1)
  const [password, setPassword] = useState('')
  const [shareLink, setShareLink] = useState('')
  const [viewId, setViewId] = useState('')
  const [viewPassword, setViewPassword] = useState('')
  const [revealedSecret, setRevealedSecret] = useState('')
  const [error, setError] = useState('')
  const [sharedSecrets] = useState<Map<string, SharedSecret>>(new Map())

  const generateId = (): string => {
    const bytes = crypto.getRandomValues(new Uint8Array(16))
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
  }

  const deriveKey = async (pwd: string, salt: Uint8Array): Promise<CryptoKey> => {
    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(pwd),
      'PBKDF2',
      false,
      ['deriveKey']
    )
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )
  }

  const createShare = async () => {
    if (!secret) {
      setError('Please enter a secret to share')
      return
    }
    if (!password) {
      setError('Please set a password')
      return
    }

    setError('')

    try {
      const id = generateId()
      const salt = crypto.getRandomValues(new Uint8Array(16))
      const iv = crypto.getRandomValues(new Uint8Array(12))
      const key = await deriveKey(password, salt)

      const encoder = new TextEncoder()
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoder.encode(secret)
      )

      const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength)
      combined.set(salt, 0)
      combined.set(iv, salt.length)
      combined.set(new Uint8Array(encrypted), salt.length + iv.length)

      const expiryMs = {
        '1h': 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
      }[expiry] || 60 * 60 * 1000

      const sharedSecret: SharedSecret = {
        id,
        encryptedData: btoa(String.fromCharCode(...combined)),
        expiresAt: Date.now() + expiryMs,
        maxViews: maxViews,
        currentViews: 0,
      }

      sharedSecrets.set(id, sharedSecret)

      // In a real app, this would be stored on a server
      // For demo, we encode in the URL
      const data = btoa(JSON.stringify(sharedSecret))
      setShareLink(`${window.location.origin}#secret=${id}&data=${data}`)
    } catch {
      setError('Failed to create share')
    }
  }

  const viewShare = async () => {
    if (!viewId || !viewPassword) {
      setError('Please enter the share ID and password')
      return
    }

    setError('')
    setRevealedSecret('')

    try {
      // In real app, fetch from server. For demo, parse from stored data
      const stored = sharedSecrets.get(viewId)
      if (!stored) {
        setError('Share not found or expired')
        return
      }

      if (Date.now() > stored.expiresAt) {
        sharedSecrets.delete(viewId)
        setError('This share has expired')
        return
      }

      if (stored.currentViews >= stored.maxViews) {
        setError('Maximum views reached')
        return
      }

      const combined = new Uint8Array(atob(stored.encryptedData).split('').map(c => c.charCodeAt(0)))
      const salt = combined.slice(0, 16)
      const iv = combined.slice(16, 28)
      const encrypted = combined.slice(28)

      const key = await deriveKey(viewPassword, salt)

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      )

      const decoder = new TextDecoder()
      setRevealedSecret(decoder.decode(decrypted))

      stored.currentViews++
      if (stored.currentViews >= stored.maxViews) {
        sharedSecrets.delete(viewId)
      }
    } catch {
      setError('Failed to decrypt. Wrong password?')
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 p-1 bg-slate-100 rounded">
          <button
            onClick={() => { setMode('create'); setError('') }}
            className={`flex-1 py-2 rounded ${mode === 'create' ? 'bg-white shadow' : ''}`}
          >
            {t('tools.securePasswordShare.create')}
          </button>
          <button
            onClick={() => { setMode('view'); setError('') }}
            className={`flex-1 py-2 rounded ${mode === 'view' ? 'bg-white shadow' : ''}`}
          >
            {t('tools.securePasswordShare.view')}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded text-sm">
          {error}
        </div>
      )}

      {mode === 'create' ? (
        <>
          <div className="card p-4">
            <label className="text-sm text-slate-500 block mb-1">{t('tools.securePasswordShare.secret')}</label>
            <textarea
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter password, API key, or secret..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none font-mono"
            />
          </div>

          <div className="card p-4">
            <label className="text-sm text-slate-500 block mb-1">{t('tools.securePasswordShare.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password to decrypt..."
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <p className="text-xs text-slate-400 mt-1">Share this password separately (phone, in person, etc.)</p>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.securePasswordShare.options')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-500 block mb-1">Expires after</label>
                <select
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                >
                  <option value="1h">1 hour</option>
                  <option value="24h">24 hours</option>
                  <option value="7d">7 days</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-500 block mb-1">Max views</label>
                <select
                  value={maxViews}
                  onChange={(e) => setMaxViews(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                >
                  <option value={1}>1 view</option>
                  <option value={3}>3 views</option>
                  <option value={5}>5 views</option>
                  <option value={10}>10 views</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={createShare}
            className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
          >
            {t('tools.securePasswordShare.createLink')}
          </button>

          {shareLink && (
            <div className="card p-4 bg-green-50">
              <h3 className="font-medium mb-2">{t('tools.securePasswordShare.shareLink')}</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-green-200 rounded text-sm font-mono"
                />
                <button
                  onClick={copyLink}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Copy
                </button>
              </div>
              <p className="text-sm text-green-700 mt-2">
                Share this link with the recipient. Send the password separately!
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="card p-4">
            <label className="text-sm text-slate-500 block mb-1">{t('tools.securePasswordShare.shareId')}</label>
            <input
              type="text"
              value={viewId}
              onChange={(e) => setViewId(e.target.value)}
              placeholder="Share ID from link..."
              className="w-full px-3 py-2 border border-slate-300 rounded font-mono"
            />
          </div>

          <div className="card p-4">
            <label className="text-sm text-slate-500 block mb-1">{t('tools.securePasswordShare.decryptPassword')}</label>
            <input
              type="password"
              value={viewPassword}
              onChange={(e) => setViewPassword(e.target.value)}
              placeholder="Password provided by sender..."
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <button
            onClick={viewShare}
            className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
          >
            {t('tools.securePasswordShare.reveal')}
          </button>

          {revealedSecret && (
            <div className="card p-4 bg-blue-50">
              <h3 className="font-medium mb-2">{t('tools.securePasswordShare.revealed')}</h3>
              <div className="p-3 bg-white rounded border border-blue-200 font-mono">
                {revealedSecret}
              </div>
            </div>
          )}
        </>
      )}

      <div className="card p-4 bg-yellow-50">
        <h4 className="font-medium mb-2">{t('tools.securePasswordShare.warning')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• This is a demo - data is stored locally only</li>
          <li>• In production, use services like OneTimeSecret or Bitwarden Send</li>
          <li>• Never send password in same channel as link</li>
          <li>• Use expiry and view limits for sensitive data</li>
        </ul>
      </div>
    </div>
  )
}
