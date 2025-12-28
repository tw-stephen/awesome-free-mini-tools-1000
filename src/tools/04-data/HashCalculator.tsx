import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

interface HashResult {
  algorithm: string
  hash: string
}

export default function HashCalculator() {
  const { t } = useTranslation()
  const [input, setInput] = useState('Hello World')
  const [inputType, setInputType] = useState<'text' | 'file'>('text')
  const [hashes, setHashes] = useState<HashResult[]>([])
  const [isCalculating, setIsCalculating] = useState(false)
  const { copy, copied } = useClipboard()

  const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']

  const arrayBufferToHex = (buffer: ArrayBuffer): string => {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }

  const calculateHash = useCallback(async (data: ArrayBuffer, algorithm: string): Promise<string> => {
    const hashBuffer = await crypto.subtle.digest(algorithm, data)
    return arrayBufferToHex(hashBuffer)
  }, [])

  const calculateAllHashes = useCallback(async () => {
    setIsCalculating(true)
    setHashes([])

    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(input)

      const results: HashResult[] = []

      for (const algo of algorithms) {
        const hash = await calculateHash(data.buffer as ArrayBuffer, algo)
        results.push({ algorithm: algo, hash })
      }

      // Add MD5 simulation (note: crypto.subtle doesn't support MD5)
      // For demonstration, we'll show a message about MD5

      setHashes(results)
    } catch (error) {
      console.error('Hash calculation failed:', error)
    }

    setIsCalculating(false)
  }, [input, calculateHash])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsCalculating(true)
    setHashes([])

    try {
      const buffer = await file.arrayBuffer()

      const results: HashResult[] = []

      for (const algo of algorithms) {
        const hash = await calculateHash(buffer, algo)
        results.push({ algorithm: algo, hash })
      }

      setHashes(results)
    } catch (error) {
      console.error('Hash calculation failed:', error)
    }

    setIsCalculating(false)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center gap-4 mb-3">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.hashCalculator.input')}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setInputType('text')}
              className={`px-3 py-1 text-sm rounded ${
                inputType === 'text'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {t('tools.hashCalculator.text')}
            </button>
            <button
              onClick={() => setInputType('file')}
              className={`px-3 py-1 text-sm rounded ${
                inputType === 'file'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {t('tools.hashCalculator.file')}
            </button>
          </div>
        </div>

        {inputType === 'text' ? (
          <>
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('tools.hashCalculator.inputPlaceholder')}
              rows={4}
              className="font-mono text-sm mb-3"
            />
            <Button
              variant="primary"
              onClick={calculateAllHashes}
              disabled={isCalculating}
            >
              {isCalculating
                ? t('tools.hashCalculator.calculating')
                : t('tools.hashCalculator.calculate')}
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            <input
              type="file"
              onChange={handleFileUpload}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {isCalculating && (
              <p className="text-sm text-slate-600">
                {t('tools.hashCalculator.calculating')}...
              </p>
            )}
          </div>
        )}
      </div>

      {hashes.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.hashCalculator.results')}
          </h3>

          <div className="space-y-3">
            {hashes.map((result) => (
              <div
                key={result.algorithm}
                className="p-3 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-600">
                    {result.algorithm}
                  </span>
                  <Button
                    variant="secondary"
                    onClick={() => copy(result.hash)}
                  >
                    {copied ? t('common.copied') : t('common.copy')}
                  </Button>
                </div>
                <p className="font-mono text-sm text-slate-800 break-all">
                  {result.hash}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {result.hash.length * 4} bits ({result.hash.length} hex chars)
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.hashCalculator.about')}
        </h3>

        <div className="space-y-2 text-sm text-slate-600">
          <p>
            <strong>SHA-1:</strong> 160-bit hash, {t('tools.hashCalculator.sha1Desc')}
          </p>
          <p>
            <strong>SHA-256:</strong> 256-bit hash, {t('tools.hashCalculator.sha256Desc')}
          </p>
          <p>
            <strong>SHA-384:</strong> 384-bit hash, {t('tools.hashCalculator.sha384Desc')}
          </p>
          <p>
            <strong>SHA-512:</strong> 512-bit hash, {t('tools.hashCalculator.sha512Desc')}
          </p>
        </div>
      </div>

      <div className="card p-4 bg-yellow-50 border border-yellow-200">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">
          {t('tools.hashCalculator.note')}
        </h3>
        <p className="text-sm text-yellow-700">
          {t('tools.hashCalculator.noteText')}
        </p>
      </div>
    </div>
  )
}
