import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function KeyPairGenerator() {
  const { t } = useTranslation()
  const [algorithm, setAlgorithm] = useState<'RSA-OAEP' | 'ECDSA' | 'ECDH'>('RSA-OAEP')
  const [rsaModulus, setRsaModulus] = useState(2048)
  const [ecCurve, setEcCurve] = useState<'P-256' | 'P-384' | 'P-521'>('P-256')
  const [publicKey, setPublicKey] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const generateKeyPair = async () => {
    setIsGenerating(true)
    setError('')
    setPublicKey('')
    setPrivateKey('')

    try {
      let keyPair: CryptoKeyPair

      if (algorithm === 'RSA-OAEP') {
        keyPair = await crypto.subtle.generateKey(
          {
            name: 'RSA-OAEP',
            modulusLength: rsaModulus,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: 'SHA-256',
          },
          true,
          ['encrypt', 'decrypt']
        )
      } else if (algorithm === 'ECDSA') {
        keyPair = await crypto.subtle.generateKey(
          {
            name: 'ECDSA',
            namedCurve: ecCurve,
          },
          true,
          ['sign', 'verify']
        )
      } else {
        keyPair = await crypto.subtle.generateKey(
          {
            name: 'ECDH',
            namedCurve: ecCurve,
          },
          true,
          ['deriveKey', 'deriveBits']
        )
      }

      // Export public key
      const publicKeyExport = await crypto.subtle.exportKey('spki', keyPair.publicKey)
      const publicKeyB64 = btoa(String.fromCharCode(...new Uint8Array(publicKeyExport)))
      const publicKeyPem = `-----BEGIN PUBLIC KEY-----\n${publicKeyB64.match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`

      // Export private key
      const privateKeyExport = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey)
      const privateKeyB64 = btoa(String.fromCharCode(...new Uint8Array(privateKeyExport)))
      const privateKeyPem = `-----BEGIN PRIVATE KEY-----\n${privateKeyB64.match(/.{1,64}/g)?.join('\n')}\n-----END PRIVATE KEY-----`

      setPublicKey(publicKeyPem)
      setPrivateKey(privateKeyPem)
    } catch (err) {
      setError('Failed to generate key pair: ' + (err as Error).message)
    }

    setIsGenerating(false)
  }

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key)
  }

  const downloadKey = (key: string, filename: string) => {
    const blob = new Blob([key], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.keyPairGenerator.algorithm')}</h3>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {(['RSA-OAEP', 'ECDSA', 'ECDH'] as const).map((algo) => (
            <button
              key={algo}
              onClick={() => setAlgorithm(algo)}
              className={`py-2 rounded ${
                algorithm === algo ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {algo}
            </button>
          ))}
        </div>

        {algorithm === 'RSA-OAEP' ? (
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.keyPairGenerator.keySize')}</label>
            <select
              value={rsaModulus}
              onChange={(e) => setRsaModulus(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              <option value={1024}>1024 bits (not recommended)</option>
              <option value={2048}>2048 bits (standard)</option>
              <option value={4096}>4096 bits (high security)</option>
            </select>
          </div>
        ) : (
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.keyPairGenerator.curve')}</label>
            <select
              value={ecCurve}
              onChange={(e) => setEcCurve(e.target.value as 'P-256' | 'P-384' | 'P-521')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              <option value="P-256">P-256 (recommended)</option>
              <option value="P-384">P-384</option>
              <option value="P-521">P-521 (highest security)</option>
            </select>
          </div>
        )}
      </div>

      <div className="card p-4">
        <button
          onClick={generateKeyPair}
          disabled={isGenerating}
          className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-slate-300 font-medium"
        >
          {isGenerating ? 'Generating...' : t('tools.keyPairGenerator.generate')}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded">
          {error}
        </div>
      )}

      {publicKey && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">{t('tools.keyPairGenerator.publicKey')}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => copyKey(publicKey)}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                Copy
              </button>
              <button
                onClick={() => downloadKey(publicKey, 'public_key.pem')}
                className="text-sm text-green-500 hover:text-green-600"
              >
                Download
              </button>
            </div>
          </div>
          <textarea
            value={publicKey}
            readOnly
            rows={8}
            className="w-full px-3 py-2 bg-slate-100 rounded font-mono text-xs resize-none"
          />
        </div>
      )}

      {privateKey && (
        <div className="card p-4 bg-red-50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-red-700">{t('tools.keyPairGenerator.privateKey')}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => copyKey(privateKey)}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                Copy
              </button>
              <button
                onClick={() => downloadKey(privateKey, 'private_key.pem')}
                className="text-sm text-green-500 hover:text-green-600"
              >
                Download
              </button>
            </div>
          </div>
          <textarea
            value={privateKey}
            readOnly
            rows={10}
            className="w-full px-3 py-2 bg-white rounded font-mono text-xs resize-none"
          />
          <p className="text-xs text-red-600 mt-2">
            ⚠️ Keep your private key secure! Never share it publicly.
          </p>
        </div>
      )}

      <div className="card p-4 bg-blue-50">
        <h4 className="font-medium mb-2">{t('tools.keyPairGenerator.info')}</h4>
        <div className="text-sm text-slate-600 space-y-2">
          <p><strong>RSA-OAEP:</strong> Encryption/decryption. Good for securing data.</p>
          <p><strong>ECDSA:</strong> Digital signatures. Smaller keys, fast operations.</p>
          <p><strong>ECDH:</strong> Key exchange. For establishing shared secrets.</p>
        </div>
      </div>

      <div className="card p-4 bg-yellow-50">
        <h4 className="font-medium mb-2">{t('tools.keyPairGenerator.security')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Keys are generated locally in your browser</li>
          <li>• Nothing is sent to any server</li>
          <li>• Closing this page will clear all keys</li>
          <li>• Store private keys securely offline</li>
        </ul>
      </div>
    </div>
  )
}
