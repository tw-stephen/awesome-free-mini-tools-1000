import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

interface FlipResult {
  result: 'heads' | 'tails'
  timestamp: Date
}

export default function CoinFlipper() {
  const { t } = useTranslation()
  const [flipping, setFlipping] = useState(false)
  const [result, setResult] = useState<'heads' | 'tails' | null>(null)
  const [flipCount, setFlipCount] = useState(1)
  const [history, setHistory] = useState<FlipResult[]>([])
  const [multiResults, setMultiResults] = useState<('heads' | 'tails')[]>([])

  const flip = useCallback(() => {
    setFlipping(true)
    setMultiResults([])

    setTimeout(() => {
      const results: ('heads' | 'tails')[] = []

      for (let i = 0; i < flipCount; i++) {
        const array = new Uint32Array(1)
        crypto.getRandomValues(array)
        const isHeads = array[0] % 2 === 0
        results.push(isHeads ? 'heads' : 'tails')
      }

      if (flipCount === 1) {
        setResult(results[0])
        setHistory((prev) => [
          { result: results[0], timestamp: new Date() },
          ...prev.slice(0, 99),
        ])
      } else {
        setMultiResults(results)
        results.forEach((r) => {
          setHistory((prev) => [
            { result: r, timestamp: new Date() },
            ...prev.slice(0, 99),
          ])
        })
      }

      setFlipping(false)
    }, 500)
  }, [flipCount])

  const headsCount = history.filter((h) => h.result === 'heads').length
  const tailsCount = history.filter((h) => h.result === 'tails').length
  const headsPercent = history.length > 0 ? ((headsCount / history.length) * 100).toFixed(1) : '0'
  const tailsPercent = history.length > 0 ? ((tailsCount / history.length) * 100).toFixed(1) : '0'

  const multiHeadsCount = multiResults.filter((r) => r === 'heads').length
  const multiTailsCount = multiResults.filter((r) => r === 'tails').length

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="flex justify-center mb-6">
          <div
            className={`w-40 h-40 rounded-full flex items-center justify-center text-6xl shadow-lg transition-transform duration-500 ${
              flipping ? 'animate-spin' : ''
            } ${
              result === 'heads'
                ? 'bg-yellow-400 text-yellow-800'
                : result === 'tails'
                ? 'bg-slate-400 text-slate-700'
                : 'bg-slate-200 text-slate-400'
            }`}
          >
            {result === 'heads' ? '👑' : result === 'tails' ? '🪙' : '?'}
          </div>
        </div>

        {result && flipCount === 1 && !flipping && (
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-slate-800">
              {result === 'heads'
                ? t('tools.coinFlipper.heads')
                : t('tools.coinFlipper.tails')
              }
            </div>
          </div>
        )}

        {multiResults.length > 1 && !flipping && (
          <div className="text-center mb-6">
            <div className="flex justify-center gap-2 flex-wrap mb-4">
              {multiResults.map((r, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    r === 'heads'
                      ? 'bg-yellow-400 text-yellow-800'
                      : 'bg-slate-400 text-slate-700'
                  }`}
                >
                  {r === 'heads' ? 'H' : 'T'}
                </div>
              ))}
            </div>
            <div className="text-lg font-medium text-slate-700">
              {t('tools.coinFlipper.heads')}: {multiHeadsCount} | {t('tools.coinFlipper.tails')}: {multiTailsCount}
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-xs text-slate-500 mb-1 text-center">
            {t('tools.coinFlipper.flipCount')}
          </label>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setFlipCount(Math.max(1, flipCount - 1))}
              className="w-10 h-10 bg-slate-200 rounded text-lg font-medium hover:bg-slate-300"
            >
              -
            </button>
            <input
              type="number"
              value={flipCount}
              onChange={(e) => setFlipCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              min="1"
              max="100"
              className="w-20 text-center px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <button
              onClick={() => setFlipCount(Math.min(100, flipCount + 1))}
              className="w-10 h-10 bg-slate-200 rounded text-lg font-medium hover:bg-slate-300"
            >
              +
            </button>
          </div>
          <div className="flex justify-center gap-2 mt-2">
            {[1, 5, 10, 20, 50].map((n) => (
              <button
                key={n}
                onClick={() => setFlipCount(n)}
                className={`px-3 py-1 rounded text-sm ${
                  flipCount === n ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={flip}
          disabled={flipping}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
        >
          {flipping ? t('tools.coinFlipper.flipping') : t('tools.coinFlipper.flip')}
        </button>
      </div>

      {history.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.coinFlipper.statistics')}
            </h3>
            <button
              onClick={() => setHistory([])}
              className="text-xs text-red-500 hover:text-red-700"
            >
              {t('common.clear')}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-yellow-50 rounded text-center">
              <div className="text-2xl font-bold text-yellow-600">{headsCount}</div>
              <div className="text-xs text-slate-500">{t('tools.coinFlipper.heads')} ({headsPercent}%)</div>
            </div>
            <div className="p-3 bg-slate-50 rounded text-center">
              <div className="text-2xl font-bold text-slate-600">{tailsCount}</div>
              <div className="text-xs text-slate-500">{t('tools.coinFlipper.tails')} ({tailsPercent}%)</div>
            </div>
          </div>

          <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 transition-all"
              style={{ width: `${headsPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>{t('tools.coinFlipper.heads')}</span>
            <span>{history.length} {t('tools.coinFlipper.totalFlips')}</span>
            <span>{t('tools.coinFlipper.tails')}</span>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-2">
            {t('tools.coinFlipper.recentFlips')}
          </h3>
          <div className="flex flex-wrap gap-1">
            {history.slice(0, 50).map((h, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full text-xs flex items-center justify-center ${
                  h.result === 'heads'
                    ? 'bg-yellow-400 text-yellow-800'
                    : 'bg-slate-400 text-white'
                }`}
                title={h.timestamp.toLocaleTimeString()}
              >
                {h.result === 'heads' ? 'H' : 'T'}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.coinFlipper.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.coinFlipper.tip1')}</li>
          <li>{t('tools.coinFlipper.tip2')}</li>
          <li>{t('tools.coinFlipper.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
