import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface FileHashResult {
  name: string
  size: number
  hashes: Record<string, string>
}

export default function FileHashChecker() {
  const { t } = useTranslation()
  const [results, setResults] = useState<FileHashResult[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [compareHash, setCompareHash] = useState('')
  const [matchResult, setMatchResult] = useState<'match' | 'mismatch' | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  const hashFile = async (file: File): Promise<FileHashResult> => {
    const arrayBuffer = await file.arrayBuffer()
    const hashes: Record<string, string> = {}

    for (const algo of algorithms) {
      const hashBuffer = await crypto.subtle.digest(algo, arrayBuffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      hashes[algo] = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    }

    return {
      name: file.name,
      size: file.size,
      hashes,
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsProcessing(true)
    setResults([])
    setMatchResult(null)

    const newResults: FileHashResult[] = []

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await hashFile(files[i])
        newResults.push(result)
      } catch (err) {
        console.error('Error hashing file:', err)
      }
    }

    setResults(newResults)
    setIsProcessing(false)
  }

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
  }

  const compareHashes = () => {
    if (!compareHash || results.length === 0) return

    const normalizedCompare = compareHash.toLowerCase().trim()
    let found = false

    for (const result of results) {
      for (const hash of Object.values(result.hashes)) {
        if (hash.toLowerCase() === normalizedCompare) {
          found = true
          break
        }
      }
    }

    setMatchResult(found ? 'match' : 'mismatch')
  }

  const clear = () => {
    setResults([])
    setCompareHash('')
    setMatchResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.fileHashChecker.select')}</h3>
        <div
          className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-4xl mb-2">📁</div>
          <p className="text-slate-600">Click to select files or drag and drop</p>
          <p className="text-sm text-slate-400 mt-1">Supports multiple files</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {isProcessing && (
        <div className="card p-8 text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-slate-600">Calculating file hashes...</p>
        </div>
      )}

      {results.length > 0 && (
        <>
          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.fileHashChecker.compare')}</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={compareHash}
                onChange={(e) => { setCompareHash(e.target.value); setMatchResult(null) }}
                placeholder="Paste expected hash to compare..."
                className="flex-1 px-3 py-2 border border-slate-300 rounded font-mono text-sm"
              />
              <button
                onClick={compareHashes}
                disabled={!compareHash}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
              >
                Compare
              </button>
            </div>
            {matchResult && (
              <div className={`mt-2 p-2 rounded text-sm ${
                matchResult === 'match' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {matchResult === 'match' ? '✓ Hash matches!' : '✗ Hash does not match!'}
              </div>
            )}
          </div>

          {results.map((result, index) => (
            <div key={index} className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium">{result.name}</h3>
                  <span className="text-sm text-slate-500">{formatSize(result.size)}</span>
                </div>
              </div>
              <div className="space-y-2">
                {Object.entries(result.hashes).map(([algo, hash]) => (
                  <div key={algo} className="p-2 bg-slate-50 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-600">{algo}</span>
                      <button
                        onClick={() => copyHash(hash)}
                        className="text-xs text-blue-500 hover:text-blue-600"
                      >
                        Copy
                      </button>
                    </div>
                    <code className={`text-xs break-all block ${
                      matchResult === 'match' && compareHash.toLowerCase() === hash.toLowerCase()
                        ? 'bg-green-100 text-green-700 p-1 rounded'
                        : ''
                    }`}>
                      {hash}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={clear}
            className="w-full py-2 bg-slate-200 rounded hover:bg-slate-300"
          >
            Clear All
          </button>
        </>
      )}

      <div className="card p-4 bg-blue-50">
        <h4 className="font-medium mb-2">{t('tools.fileHashChecker.info')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• <strong>SHA-256:</strong> Most commonly used for file verification</li>
          <li>• Verify downloaded files match the publisher's hash</li>
          <li>• All processing happens locally in your browser</li>
          <li>• Files are not uploaded anywhere</li>
        </ul>
      </div>
    </div>
  )
}
