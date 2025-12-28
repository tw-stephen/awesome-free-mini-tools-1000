import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function SecureNotepad() {
  const { t } = useTranslation()
  const [notes, setNotes] = useState('')
  const [password, setPassword] = useState('')
  const [isLocked, setIsLocked] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [encryptedData, setEncryptedData] = useState('')
  const [error, setError] = useState('')
  const [autoLockMinutes, setAutoLockMinutes] = useState(5)
  const [lastActivity, setLastActivity] = useState(Date.now())

  useEffect(() => {
    const checkAutoLock = setInterval(() => {
      if (!isLocked && notes && password && Date.now() - lastActivity > autoLockMinutes * 60 * 1000) {
        handleLock()
      }
    }, 10000)
    return () => clearInterval(checkAutoLock)
  }, [isLocked, notes, password, lastActivity, autoLockMinutes])

  const updateActivity = () => {
    setLastActivity(Date.now())
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

  const handleLock = async () => {
    if (!password) {
      setError('Set a password first')
      return
    }

    try {
      const encoder = new TextEncoder()
      const salt = crypto.getRandomValues(new Uint8Array(16))
      const iv = crypto.getRandomValues(new Uint8Array(12))
      const key = await deriveKey(password, salt)

      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoder.encode(notes)
      )

      const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength)
      combined.set(salt, 0)
      combined.set(iv, salt.length)
      combined.set(new Uint8Array(encrypted), salt.length + iv.length)

      setEncryptedData(btoa(String.fromCharCode(...combined)))
      setNotes('')
      setIsLocked(true)
      setError('')
    } catch {
      setError('Failed to lock notes')
    }
  }

  const handleUnlock = async () => {
    if (!password) {
      setError('Enter password to unlock')
      return
    }

    try {
      const combined = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)))
      const salt = combined.slice(0, 16)
      const iv = combined.slice(16, 28)
      const encrypted = combined.slice(28)

      const key = await deriveKey(password, salt)

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      )

      const decoder = new TextDecoder()
      setNotes(decoder.decode(decrypted))
      setIsLocked(false)
      setError('')
      setLastActivity(Date.now())
    } catch {
      setError('Wrong password or corrupted data')
    }
  }

  const clearAll = () => {
    setNotes('')
    setPassword('')
    setEncryptedData('')
    setIsLocked(false)
    setError('')
  }

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0
  const charCount = notes.length

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.secureNotepad.password')}</h3>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-500">Auto-lock:</label>
            <select
              value={autoLockMinutes}
              onChange={(e) => setAutoLockMinutes(parseInt(e.target.value))}
              className="px-2 py-1 border border-slate-300 rounded text-sm"
              disabled={isLocked}
            >
              <option value={1}>1 min</option>
              <option value={5}>5 min</option>
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
            </select>
          </div>
        </div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password..."
            className="w-full px-3 py-2 border border-slate-300 rounded pr-16"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-500"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded text-sm">
          {error}
        </div>
      )}

      {isLocked ? (
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="font-medium text-xl mb-2">{t('tools.secureNotepad.locked')}</h3>
          <p className="text-slate-500 mb-4">Your notes are encrypted and locked</p>
          <button
            onClick={handleUnlock}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('tools.secureNotepad.unlock')}
          </button>
        </div>
      ) : (
        <>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-slate-500">{t('tools.secureNotepad.notes')}</label>
              <span className="text-xs text-slate-400">{wordCount} words, {charCount} chars</span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => { setNotes(e.target.value); updateActivity() }}
              onKeyDown={updateActivity}
              placeholder="Write your secure notes here..."
              rows={12}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none font-mono"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleLock}
              disabled={!notes || !password}
              className="flex-1 py-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-slate-300 font-medium"
            >
              🔒 {t('tools.secureNotepad.lock')}
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-3 bg-red-100 text-red-600 rounded hover:bg-red-200"
            >
              Clear All
            </button>
          </div>
        </>
      )}

      <div className="card p-4 bg-blue-50">
        <h4 className="font-medium mb-2">{t('tools.secureNotepad.security')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• AES-256-GCM encryption</li>
          <li>• Notes encrypted locally in your browser</li>
          <li>• Nothing is stored on any server</li>
          <li>• Auto-lock after inactivity</li>
          <li>• Closing the page deletes all data</li>
        </ul>
      </div>
    </div>
  )
}
