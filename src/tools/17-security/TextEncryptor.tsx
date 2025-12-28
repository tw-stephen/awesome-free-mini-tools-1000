import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function TextEncryptor() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt')
  const [input, setInput] = useState('')
  const [password, setPassword] = useState('')
  const [output, setOutput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const deriveKey = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    )
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )
  }

  const encrypt = async () => {
    if (!input || !password) {
      setError('Please enter text and password')
      return
    }

    try {
      setError('')
      const encoder = new TextEncoder()
      const salt = crypto.getRandomValues(new Uint8Array(16))
      const iv = crypto.getRandomValues(new Uint8Array(12))
      const key = await deriveKey(password, salt)

      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoder.encode(input)
      )

      // Combine salt + iv + encrypted data and encode as base64
      const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength)
      combined.set(salt, 0)
      combined.set(iv, salt.length)
      combined.set(new Uint8Array(encrypted), salt.length + iv.length)

      setOutput(btoa(String.fromCharCode(...combined)))
    } catch {
      setError('Encryption failed')
    }
  }

  const decrypt = async () => {
    if (!input || !password) {
      setError('Please enter encrypted text and password')
      return
    }

    try {
      setError('')
      // Decode base64
      const combined = new Uint8Array(atob(input).split('').map(c => c.charCodeAt(0)))

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
      setOutput(decoder.decode(decrypted))
    } catch {
      setError('Decryption failed. Wrong password or corrupted data.')
    }
  }

  const handleProcess = () => {
    if (mode === 'encrypt') {
      encrypt()
    } else {
      decrypt()
    }
  }

  const copyOutput = () => {
    navigator.clipboard.writeText(output)
  }

  const clearAll = () => {
    setInput('')
    setPassword('')
    setOutput('')
    setError('')
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 p-1 bg-slate-100 rounded">
          <button
            onClick={() => { setMode('encrypt'); setOutput(''); setError('') }}
            className={`flex-1 py-2 rounded ${mode === 'encrypt' ? 'bg-white shadow' : ''}`}
          >
            {t('tools.textEncryptor.encrypt')}
          </button>
          <button
            onClick={() => { setMode('decrypt'); setOutput(''); setError('') }}
            className={`flex-1 py-2 rounded ${mode === 'decrypt' ? 'bg-white shadow' : ''}`}
          >
            {t('tools.textEncryptor.decrypt')}
          </button>
        </div>
      </div>

      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-1">
          {mode === 'encrypt' ? t('tools.textEncryptor.plaintext') : t('tools.textEncryptor.ciphertext')}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Paste encrypted text...'}
          rows={4}
          className="w-full px-3 py-2 border border-slate-300 rounded resize-none font-mono text-sm"
        />
      </div>

      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-1">{t('tools.textEncryptor.password')}</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter encryption password..."
            className="w-full px-3 py-2 border border-slate-300 rounded pr-16"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-500 hover:text-slate-700"
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

      <div className="flex gap-2">
        <button
          onClick={handleProcess}
          className="flex-1 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
        >
          {mode === 'encrypt' ? 'Encrypt Text' : 'Decrypt Text'}
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-3 bg-slate-200 rounded hover:bg-slate-300"
        >
          Clear
        </button>
      </div>

      {output && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">{t('tools.textEncryptor.result')}</h3>
            <button onClick={copyOutput} className="text-sm text-blue-500 hover:text-blue-600">
              Copy
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            rows={4}
            className="w-full px-3 py-2 bg-slate-100 rounded font-mono text-sm resize-none"
          />
        </div>
      )}

      <div className="card p-4 bg-green-50">
        <h4 className="font-medium mb-2">{t('tools.textEncryptor.security')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Uses AES-256-GCM encryption</li>
          <li>• PBKDF2 key derivation with 100,000 iterations</li>
          <li>• Random salt and IV for each encryption</li>
          <li>• All processing happens in your browser</li>
        </ul>
      </div>
    </div>
  )
}
