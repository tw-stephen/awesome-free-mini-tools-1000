import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function HashGenerator() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState<Record<string, string>>({})
  const [isHashing, setIsHashing] = useState(false)

  const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']

  const generateHashes = async () => {
    if (!input) return

    setIsHashing(true)
    const encoder = new TextEncoder()
    const data = encoder.encode(input)
    const newHashes: Record<string, string> = {}

    for (const algo of algorithms) {
      try {
        const hashBuffer = await crypto.subtle.digest(algo, data)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
        newHashes[algo] = hashHex
      } catch {
        newHashes[algo] = 'Error generating hash'
      }
    }

    // Simple MD5-like hash (not cryptographic, for demonstration)
    const simpleHash = (str: string): string => {
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
      }
      return Math.abs(hash).toString(16).padStart(8, '0')
    }
    newHashes['Simple'] = simpleHash(input)

    setHashes(newHashes)
    setIsHashing(false)
  }

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
  }

  const clearAll = () => {
    setInput('')
    setHashes({})
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-1">{t('tools.hashGenerator.input')}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          rows={4}
          className="w-full px-3 py-2 border border-slate-300 rounded resize-none font-mono"
        />
        <div className="flex gap-2 mt-3">
          <button
            onClick={generateHashes}
            disabled={!input || isHashing}
            className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
          >
            {isHashing ? 'Generating...' : t('tools.hashGenerator.generate')}
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
          >
            Clear
          </button>
        </div>
      </div>

      {Object.keys(hashes).length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.hashGenerator.results')}</h3>
          <div className="space-y-3">
            {Object.entries(hashes).map(([algo, hash]) => (
              <div key={algo} className="p-3 bg-slate-50 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-slate-600">{algo}</span>
                  <button
                    onClick={() => copyHash(hash)}
                    className="text-sm text-blue-500 hover:text-blue-600"
                  >
                    Copy
                  </button>
                </div>
                <code className="text-xs text-slate-700 break-all block bg-white p-2 rounded border border-slate-200">
                  {hash}
                </code>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4 bg-yellow-50">
        <h4 className="font-medium mb-2">{t('tools.hashGenerator.info')}</h4>
        <div className="text-sm text-slate-600 space-y-2">
          <p><strong>SHA-256:</strong> Most commonly used, good balance of security and speed</p>
          <p><strong>SHA-512:</strong> Higher security, larger output</p>
          <p><strong>SHA-1:</strong> Legacy, not recommended for security purposes</p>
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">Common Use Cases</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• File integrity verification</li>
          <li>• Password storage (with salt)</li>
          <li>• Digital signatures</li>
          <li>• Data deduplication</li>
        </ul>
      </div>
    </div>
  )
}
