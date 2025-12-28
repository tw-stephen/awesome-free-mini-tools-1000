import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'

export default function HashGenerator() {
  const { t } = useTranslation()
  const { copy } = useClipboard()
  const [input, setInput] = useState('')
  const [inputType, setInputType] = useState<'text' | 'file'>('text')
  const [hashes, setHashes] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [copiedHash, setCopiedHash] = useState('')

  const hashAlgorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']

  const generateHashes = useCallback(async () => {
    if (!input) return

    setLoading(true)
    const encoder = new TextEncoder()
    const data = encoder.encode(input)
    const results: Record<string, string> = {}

    for (const algo of hashAlgorithms) {
      try {
        const hashBuffer = await crypto.subtle.digest(algo, data)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
        results[algo] = hashHex
      } catch (e) {
        results[algo] = 'Error generating hash'
      }
    }

    // Simple MD5-like hash (not real MD5, just for demo)
    let hash = 0
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    results['Simple Hash'] = Math.abs(hash).toString(16).padStart(8, '0')

    setHashes(results)
    setLoading(false)
  }, [input])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    const reader = new FileReader()
    reader.onload = async (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer
      const results: Record<string, string> = {}

      for (const algo of hashAlgorithms) {
        try {
          const hashBuffer = await crypto.subtle.digest(algo, arrayBuffer)
          const hashArray = Array.from(new Uint8Array(hashBuffer))
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
          results[algo] = hashHex
        } catch (e) {
          results[algo] = 'Error generating hash'
        }
      }

      setHashes(results)
      setLoading(false)
    }
    reader.readAsArrayBuffer(file)
  }

  const copyHash = (algo: string, hash: string) => {
    copy(hash)
    setCopiedHash(algo)
    setTimeout(() => setCopiedHash(''), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setInputType('text')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium ${
              inputType === 'text' ? 'bg-blue-500 text-white' : 'bg-slate-200'
            }`}
          >
            {t('tools.hashGenerator.text')}
          </button>
          <button
            onClick={() => setInputType('file')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium ${
              inputType === 'file' ? 'bg-blue-500 text-white' : 'bg-slate-200'
            }`}
          >
            {t('tools.hashGenerator.file')}
          </button>
        </div>

        {inputType === 'text' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.hashGenerator.inputText')}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('tools.hashGenerator.placeholder')}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
              />
            </div>
            <button
              onClick={generateHashes}
              disabled={!input || loading}
              className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? t('tools.hashGenerator.generating') : t('tools.hashGenerator.generate')}
            </button>
          </div>
        ) : (
          <div>
            <label className="block">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500">
                <div className="text-4xl mb-2">📁</div>
                <div className="text-slate-600">{t('tools.hashGenerator.dropFile')}</div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </label>
          </div>
        )}
      </div>

      {Object.keys(hashes).length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-4">
            {t('tools.hashGenerator.results')}
          </h3>

          <div className="space-y-3">
            {Object.entries(hashes).map(([algo, hash]) => (
              <div key={algo} className="p-3 bg-slate-50 rounded">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">{algo}</span>
                  <button
                    onClick={() => copyHash(algo, hash)}
                    className="text-xs text-blue-500 hover:text-blue-700"
                  >
                    {copiedHash === algo ? t('common.copied') : t('common.copy')}
                  </button>
                </div>
                <div className="font-mono text-xs text-slate-600 break-all">
                  {hash}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.hashGenerator.algorithms')}
        </h3>
        <div className="space-y-2 text-sm text-slate-600">
          <div className="p-2 bg-slate-50 rounded">
            <strong>SHA-256:</strong> {t('tools.hashGenerator.sha256Desc')}
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <strong>SHA-512:</strong> {t('tools.hashGenerator.sha512Desc')}
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <strong>SHA-1:</strong> {t('tools.hashGenerator.sha1Desc')}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.hashGenerator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.hashGenerator.tip1')}</li>
          <li>{t('tools.hashGenerator.tip2')}</li>
          <li>{t('tools.hashGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
