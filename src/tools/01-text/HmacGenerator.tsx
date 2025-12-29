import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type Algorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'

export default function HmacGenerator() {
  const { t } = useTranslation()
  const [message, setMessage] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [algorithm, setAlgorithm] = useState<Algorithm>('SHA-256')
  const [hmac, setHmac] = useState('')
  const [encoding, setEncoding] = useState<'hex' | 'base64'>('hex')
  const [showKey, setShowKey] = useState(false)

  useEffect(() => {
    if (!message || !secretKey) {
      setHmac('')
      return
    }

    const computeHmac = async () => {
      try {
        const encoder = new TextEncoder()
        const keyData = encoder.encode(secretKey)
        const messageData = encoder.encode(message)

        const cryptoKey = await crypto.subtle.importKey(
          'raw',
          keyData,
          { name: 'HMAC', hash: algorithm },
          false,
          ['sign']
        )

        const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
        const hashArray = Array.from(new Uint8Array(signature))

        if (encoding === 'hex') {
          setHmac(hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''))
        } else {
          setHmac(btoa(String.fromCharCode(...hashArray)))
        }
      } catch (err) {
        setHmac('Error computing HMAC')
      }
    }

    computeHmac()
  }, [message, secretKey, algorithm, encoding])

  const copyHmac = () => {
    if (hmac) {
      navigator.clipboard.writeText(hmac)
    }
  }

  const generateRandomKey = () => {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    const key = Array.from(array)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    setSecretKey(key)
  }

  const algorithms: Algorithm[] = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.hmacGenerator.message')}</h3>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter the message to authenticate..."
          rows={4}
          className="w-full px-3 py-2 border border-slate-300 rounded resize-none font-mono text-sm"
        />
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.hmacGenerator.secretKey')}</h3>
          <button
            onClick={generateRandomKey}
            className="px-3 py-1 text-sm bg-slate-100 rounded hover:bg-slate-200"
          >
            {t('tools.hmacGenerator.generateKey')}
          </button>
        </div>
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="Enter secret key..."
            className="w-full px-3 py-2 pr-20 border border-slate-300 rounded font-mono text-sm"
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-slate-500 hover:text-slate-700"
          >
            {showKey ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.hmacGenerator.options')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-2">{t('tools.hmacGenerator.algorithm')}</label>
            <div className="flex flex-wrap gap-2">
              {algorithms.map((algo) => (
                <button
                  key={algo}
                  onClick={() => setAlgorithm(algo)}
                  className={`px-3 py-1 rounded text-sm ${
                    algorithm === algo ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {algo}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-2">{t('tools.hmacGenerator.encoding')}</label>
            <div className="flex gap-2">
              {(['hex', 'base64'] as const).map((enc) => (
                <button
                  key={enc}
                  onClick={() => setEncoding(enc)}
                  className={`px-3 py-1 rounded text-sm uppercase ${
                    encoding === enc ? 'bg-green-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {enc}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{t('tools.hmacGenerator.result')}</h3>
          <button
            onClick={copyHmac}
            disabled={!hmac}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
          >
            {t('common.copy')}
          </button>
        </div>
        <div className="p-3 bg-slate-100 rounded font-mono text-sm break-all min-h-[48px]">
          {hmac || <span className="text-slate-400">HMAC will appear here...</span>}
        </div>
        {hmac && !hmac.startsWith('Error') && (
          <div className="mt-2 text-sm text-slate-500">
            Length: {hmac.length} characters
          </div>
        )}
      </div>

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium text-blue-700 mb-2">{t('tools.hmacGenerator.about')}</h3>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• HMAC (Hash-based Message Authentication Code)</li>
          <li>• Provides data integrity and authentication</li>
          <li>• Uses a secret key combined with a hash function</li>
          <li>• Commonly used in API authentication</li>
        </ul>
      </div>
    </div>
  )
}
