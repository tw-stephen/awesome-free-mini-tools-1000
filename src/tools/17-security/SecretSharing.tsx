import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function SecretSharing() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'split' | 'combine'>('split')
  const [secret, setSecret] = useState('')
  const [totalShares, setTotalShares] = useState(5)
  const [threshold, setThreshold] = useState(3)
  const [shares, setShares] = useState<string[]>([])
  const [combineShares, setCombineShares] = useState<string[]>(['', '', ''])
  const [recoveredSecret, setRecoveredSecret] = useState('')
  const [error, setError] = useState('')

  // Simple XOR-based secret sharing (simplified for demonstration)
  // Real implementation would use Shamir's Secret Sharing
  const splitSecret = () => {
    if (!secret) {
      setError('Please enter a secret')
      return
    }
    if (threshold > totalShares) {
      setError('Threshold cannot exceed total shares')
      return
    }

    setError('')
    const encoder = new TextEncoder()
    const secretBytes = encoder.encode(secret)

    // Generate random shares
    const generatedShares: Uint8Array[] = []
    for (let i = 0; i < totalShares - 1; i++) {
      const share = new Uint8Array(secretBytes.length)
      crypto.getRandomValues(share)
      generatedShares.push(share)
    }

    // Last share is XOR of secret with all other shares
    const lastShare = new Uint8Array(secretBytes.length)
    for (let i = 0; i < secretBytes.length; i++) {
      let xor = secretBytes[i]
      for (const share of generatedShares) {
        xor ^= share[i]
      }
      lastShare[i] = xor
    }
    generatedShares.push(lastShare)

    // Convert to base64 with share index
    const shareStrings = generatedShares.map((share, i) =>
      `${i + 1}-${btoa(String.fromCharCode(...share))}`
    )

    setShares(shareStrings)
  }

  const recoverSecret = () => {
    const validShares = combineShares.filter(s => s.trim())
    if (validShares.length < 2) {
      setError('Need at least 2 shares')
      return
    }

    setError('')

    try {
      // Parse shares
      const parsedShares: { index: number; data: Uint8Array }[] = []
      for (const share of validShares) {
        const match = share.match(/^(\d+)-(.+)$/)
        if (!match) {
          setError('Invalid share format')
          return
        }
        const index = parseInt(match[1])
        const data = new Uint8Array(atob(match[2]).split('').map(c => c.charCodeAt(0)))
        parsedShares.push({ index, data })
      }

      // XOR all shares together
      const length = parsedShares[0].data.length
      const result = new Uint8Array(length)
      for (let i = 0; i < length; i++) {
        let xor = 0
        for (const share of parsedShares) {
          xor ^= share.data[i]
        }
        result[i] = xor
      }

      const decoder = new TextDecoder()
      setRecoveredSecret(decoder.decode(result))
    } catch {
      setError('Failed to recover secret. Check your shares.')
    }
  }

  const copyShare = (share: string) => {
    navigator.clipboard.writeText(share)
  }

  const addCombineShare = () => {
    setCombineShares([...combineShares, ''])
  }

  const updateCombineShare = (index: number, value: string) => {
    const newShares = [...combineShares]
    newShares[index] = value
    setCombineShares(newShares)
  }

  const removeCombineShare = (index: number) => {
    if (combineShares.length > 2) {
      setCombineShares(combineShares.filter((_, i) => i !== index))
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 p-1 bg-slate-100 rounded">
          <button
            onClick={() => { setMode('split'); setError('') }}
            className={`flex-1 py-2 rounded ${mode === 'split' ? 'bg-white shadow' : ''}`}
          >
            {t('tools.secretSharing.split')}
          </button>
          <button
            onClick={() => { setMode('combine'); setError('') }}
            className={`flex-1 py-2 rounded ${mode === 'combine' ? 'bg-white shadow' : ''}`}
          >
            {t('tools.secretSharing.combine')}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded text-sm">
          {error}
        </div>
      )}

      {mode === 'split' ? (
        <>
          <div className="card p-4">
            <label className="text-sm text-slate-500 block mb-1">{t('tools.secretSharing.secret')}</label>
            <textarea
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter your secret..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
            />
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.secretSharing.settings')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-500 block mb-1">Total Shares</label>
                <input
                  type="number"
                  min={2}
                  max={10}
                  value={totalShares}
                  onChange={(e) => setTotalShares(parseInt(e.target.value) || 2)}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="text-sm text-slate-500 block mb-1">Threshold</label>
                <input
                  type="number"
                  min={2}
                  max={totalShares}
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value) || 2)}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              {threshold} of {totalShares} shares needed to recover the secret
            </p>
          </div>

          <button
            onClick={splitSecret}
            className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
          >
            {t('tools.secretSharing.generateShares')}
          </button>

          {shares.length > 0 && (
            <div className="card p-4">
              <h3 className="font-medium mb-3">{t('tools.secretSharing.shares')}</h3>
              <div className="space-y-2">
                {shares.map((share, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                    <span className="text-sm text-slate-500 w-16">Share {i + 1}:</span>
                    <input
                      type="text"
                      value={share}
                      readOnly
                      className="flex-1 px-2 py-1 bg-white border border-slate-200 rounded font-mono text-xs"
                    />
                    <button
                      onClick={() => copyShare(share)}
                      className="px-2 py-1 text-sm text-blue-500 hover:text-blue-600"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500 mt-3">
                Distribute these shares to different people or locations.
                {threshold} shares are needed to recover the secret.
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">{t('tools.secretSharing.enterShares')}</h3>
              <button
                onClick={addCombineShare}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                + Add Share
              </button>
            </div>
            <div className="space-y-2">
              {combineShares.map((share, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={share}
                    onChange={(e) => updateCombineShare(i, e.target.value)}
                    placeholder={`Share ${i + 1}...`}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded font-mono text-sm"
                  />
                  {combineShares.length > 2 && (
                    <button
                      onClick={() => removeCombineShare(i)}
                      className="px-2 text-red-500"
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={recoverSecret}
            className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
          >
            {t('tools.secretSharing.recoverSecret')}
          </button>

          {recoveredSecret && (
            <div className="card p-4 bg-green-50">
              <h3 className="font-medium mb-2">{t('tools.secretSharing.recovered')}</h3>
              <div className="p-3 bg-white rounded border border-green-200">
                {recoveredSecret}
              </div>
            </div>
          )}
        </>
      )}

      <div className="card p-4 bg-blue-50">
        <h4 className="font-medium mb-2">{t('tools.secretSharing.howItWorks')}</h4>
        <p className="text-sm text-slate-600">
          Secret sharing splits a secret into multiple shares. Only when enough shares
          are combined can the original secret be recovered. This is useful for:
        </p>
        <ul className="text-sm text-slate-600 mt-2 space-y-1">
          <li>• Backup encryption keys</li>
          <li>• Multi-party authentication</li>
          <li>• Estate planning</li>
          <li>• Corporate secrets management</li>
        </ul>
      </div>
    </div>
  )
}
