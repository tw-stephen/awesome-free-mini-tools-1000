import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function ChecksumValidator() {
  const { t } = useTranslation()
  const [file, setFile] = useState<File | null>(null)
  const [expectedChecksum, setExpectedChecksum] = useState('')
  const [algorithm, setAlgorithm] = useState<'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'>('SHA-256')
  const [calculatedHash, setCalculatedHash] = useState('')
  const [isCalculating, setIsCalculating] = useState(false)
  const [validationResult, setValidationResult] = useState<'match' | 'mismatch' | null>(null)
  const [progress, setProgress] = useState(0)

  const arrayBufferToHex = (buffer: ArrayBuffer): string => {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }

  const calculateFileHash = useCallback(async () => {
    if (!file) return

    setIsCalculating(true)
    setCalculatedHash('')
    setValidationResult(null)
    setProgress(0)

    try {
      const chunkSize = 1024 * 1024 // 1MB chunks
      const totalChunks = Math.ceil(file.size / chunkSize)

      // For small files, process directly
      if (file.size < chunkSize * 10) {
        const buffer = await file.arrayBuffer()
        const hashBuffer = await crypto.subtle.digest(algorithm, buffer)
        const hash = arrayBufferToHex(hashBuffer)
        setCalculatedHash(hash)

        // Validate against expected
        if (expectedChecksum.trim()) {
          const normalizedExpected = expectedChecksum.trim().toLowerCase().replace(/\s/g, '')
          const normalizedHash = hash.toLowerCase()
          setValidationResult(normalizedExpected === normalizedHash ? 'match' : 'mismatch')
        }
      } else {
        // For larger files, use streaming approach with progress
        const reader = file.stream().getReader()
        const chunks: Uint8Array[] = []
        let processedBytes = 0

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          chunks.push(value)
          processedBytes += value.length
          setProgress(Math.round((processedBytes / file.size) * 100))
        }

        // Combine all chunks
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
        const combined = new Uint8Array(totalLength)
        let offset = 0
        for (const chunk of chunks) {
          combined.set(chunk, offset)
          offset += chunk.length
        }

        const hashBuffer = await crypto.subtle.digest(algorithm, combined.buffer)
        const hash = arrayBufferToHex(hashBuffer)
        setCalculatedHash(hash)

        // Validate against expected
        if (expectedChecksum.trim()) {
          const normalizedExpected = expectedChecksum.trim().toLowerCase().replace(/\s/g, '')
          const normalizedHash = hash.toLowerCase()
          setValidationResult(normalizedExpected === normalizedHash ? 'match' : 'mismatch')
        }
      }
    } catch (error) {
      console.error('Hash calculation failed:', error)
    }

    setIsCalculating(false)
    setProgress(100)
  }, [file, algorithm, expectedChecksum])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setCalculatedHash('')
      setValidationResult(null)
      setProgress(0)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.checksumValidator.selectFile')}
        </h3>

        <input
          type="file"
          onChange={handleFileSelect}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-3"
        />

        {file && (
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-700">
              <strong>{t('tools.checksumValidator.fileName')}:</strong> {file.name}
            </p>
            <p className="text-sm text-slate-600">
              <strong>{t('tools.checksumValidator.fileSize')}:</strong> {formatFileSize(file.size)}
            </p>
            <p className="text-sm text-slate-600">
              <strong>{t('tools.checksumValidator.fileType')}:</strong> {file.type || 'Unknown'}
            </p>
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.checksumValidator.options')}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.checksumValidator.algorithm')}
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as typeof algorithm)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option value="SHA-1">SHA-1 (160-bit)</option>
              <option value="SHA-256">SHA-256 (256-bit)</option>
              <option value="SHA-384">SHA-384 (384-bit)</option>
              <option value="SHA-512">SHA-512 (512-bit)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">
              {t('tools.checksumValidator.expectedChecksum')}
            </label>
            <input
              type="text"
              value={expectedChecksum}
              onChange={(e) => setExpectedChecksum(e.target.value)}
              placeholder={t('tools.checksumValidator.expectedPlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm"
            />
          </div>
        </div>

        <Button
          variant="primary"
          onClick={calculateFileHash}
          disabled={!file || isCalculating}
          className="mt-4"
        >
          {isCalculating
            ? `${t('tools.checksumValidator.calculating')}... ${progress}%`
            : t('tools.checksumValidator.calculate')}
        </Button>
      </div>

      {isCalculating && (
        <div className="card p-4">
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-slate-600 mt-2 text-center">
            {t('tools.checksumValidator.processing')} {progress}%
          </p>
        </div>
      )}

      {calculatedHash && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-2">
            {t('tools.checksumValidator.result')}
          </h3>

          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">{algorithm}</p>
            <p className="font-mono text-sm text-slate-800 break-all">
              {calculatedHash}
            </p>
          </div>

          {validationResult && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                validationResult === 'match'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <p
                className={`text-lg font-semibold ${
                  validationResult === 'match' ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {validationResult === 'match'
                  ? `✓ ${t('tools.checksumValidator.match')}`
                  : `✗ ${t('tools.checksumValidator.mismatch')}`}
              </p>
              <p
                className={`text-sm mt-1 ${
                  validationResult === 'match' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {validationResult === 'match'
                  ? t('tools.checksumValidator.matchDesc')
                  : t('tools.checksumValidator.mismatchDesc')}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.checksumValidator.whatIsChecksum')}
        </h3>

        <div className="space-y-2 text-sm text-slate-600">
          <p>{t('tools.checksumValidator.checksumExplanation')}</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>{t('tools.checksumValidator.useCase1')}</li>
            <li>{t('tools.checksumValidator.useCase2')}</li>
            <li>{t('tools.checksumValidator.useCase3')}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
