import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function MarketSizeCalculator() {
  const { t } = useTranslation()
  const [approach, setApproach] = useState<'topdown' | 'bottomup'>('topdown')

  // Top-down approach
  const [topDown, setTopDown] = useState({
    totalMarket: 0,
    targetPercent: 10,
    reachablePercent: 20,
  })

  // Bottom-up approach
  const [bottomUp, setBottomUp] = useState({
    targetCustomers: 0,
    avgDealSize: 0,
    purchaseFrequency: 1,
    reachablePercent: 10,
  })

  const calculateTopDown = () => {
    const tam = topDown.totalMarket
    const sam = tam * (topDown.targetPercent / 100)
    const som = sam * (topDown.reachablePercent / 100)
    return { tam, sam, som }
  }

  const calculateBottomUp = () => {
    const tam = bottomUp.targetCustomers * bottomUp.avgDealSize * bottomUp.purchaseFrequency
    const sam = tam * 0.5 // Assume 50% is serviceable
    const som = sam * (bottomUp.reachablePercent / 100)
    return { tam, sam, som }
  }

  const result = approach === 'topdown' ? calculateTopDown() : calculateBottomUp()

  const formatCurrency = (value: number): string => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`
    return `$${value.toFixed(0)}`
  }

  const copyReport = () => {
    let report = `MARKET SIZE ANALYSIS\n${'='.repeat(50)}\n\n`
    report += `Approach: ${approach === 'topdown' ? 'Top-Down' : 'Bottom-Up'}\n\n`
    report += `TAM (Total Addressable Market): ${formatCurrency(result.tam)}\n`
    report += `SAM (Serviceable Addressable Market): ${formatCurrency(result.sam)}\n`
    report += `SOM (Serviceable Obtainable Market): ${formatCurrency(result.som)}\n`
    navigator.clipboard.writeText(report)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.marketSizeCalculator.approach')}</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setApproach('topdown')}
            className={`p-3 rounded ${approach === 'topdown' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
          >
            <div className="font-medium">Top-Down</div>
            <div className={`text-xs ${approach === 'topdown' ? 'text-blue-100' : 'text-slate-500'}`}>
              Start from total market
            </div>
          </button>
          <button
            onClick={() => setApproach('bottomup')}
            className={`p-3 rounded ${approach === 'bottomup' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
          >
            <div className="font-medium">Bottom-Up</div>
            <div className={`text-xs ${approach === 'bottomup' ? 'text-blue-100' : 'text-slate-500'}`}>
              Build from customer data
            </div>
          </button>
        </div>
      </div>

      {approach === 'topdown' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.marketSizeCalculator.topdown')}</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-slate-500 block mb-1">Total Market Size ($)</label>
              <input
                type="number"
                value={topDown.totalMarket}
                onChange={(e) => setTopDown({ ...topDown, totalMarket: Number(e.target.value) })}
                placeholder="e.g., 1000000000"
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">
                Target Segment (% of total): {topDown.targetPercent}%
              </label>
              <input
                type="range"
                value={topDown.targetPercent}
                onChange={(e) => setTopDown({ ...topDown, targetPercent: Number(e.target.value) })}
                min="1"
                max="100"
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">
                Reachable Market (% of segment): {topDown.reachablePercent}%
              </label>
              <input
                type="range"
                value={topDown.reachablePercent}
                onChange={(e) => setTopDown({ ...topDown, reachablePercent: Number(e.target.value) })}
                min="1"
                max="100"
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {approach === 'bottomup' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.marketSizeCalculator.bottomup')}</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-slate-500 block mb-1">Number of Target Customers</label>
              <input
                type="number"
                value={bottomUp.targetCustomers}
                onChange={(e) => setBottomUp({ ...bottomUp, targetCustomers: Number(e.target.value) })}
                placeholder="e.g., 100000"
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">Average Deal Size ($)</label>
              <input
                type="number"
                value={bottomUp.avgDealSize}
                onChange={(e) => setBottomUp({ ...bottomUp, avgDealSize: Number(e.target.value) })}
                placeholder="e.g., 1000"
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">Purchase Frequency (per year)</label>
              <input
                type="number"
                value={bottomUp.purchaseFrequency}
                onChange={(e) => setBottomUp({ ...bottomUp, purchaseFrequency: Number(e.target.value) })}
                min="1"
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">
                Reachable Market (%): {bottomUp.reachablePercent}%
              </label>
              <input
                type="range"
                value={bottomUp.reachablePercent}
                onChange={(e) => setBottomUp({ ...bottomUp, reachablePercent: Number(e.target.value) })}
                min="1"
                max="50"
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium mb-4">{t('tools.marketSizeCalculator.result')}</h3>
        <div className="space-y-3">
          <div className="p-4 bg-white rounded">
            <div className="text-sm text-slate-500 mb-1">TAM (Total Addressable Market)</div>
            <div className="text-3xl font-bold text-blue-600">{formatCurrency(result.tam)}</div>
            <div className="text-xs text-slate-400">Maximum possible market if you had 100% share</div>
          </div>
          <div className="p-4 bg-white rounded">
            <div className="text-sm text-slate-500 mb-1">SAM (Serviceable Addressable Market)</div>
            <div className="text-3xl font-bold text-green-600">{formatCurrency(result.sam)}</div>
            <div className="text-xs text-slate-400">Market you can actually reach with your product</div>
          </div>
          <div className="p-4 bg-white rounded">
            <div className="text-sm text-slate-500 mb-1">SOM (Serviceable Obtainable Market)</div>
            <div className="text-3xl font-bold text-orange-600">{formatCurrency(result.som)}</div>
            <div className="text-xs text-slate-400">Realistic market share you can capture</div>
          </div>
        </div>
      </div>

      <button
        onClick={copyReport}
        className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
      >
        {t('tools.marketSizeCalculator.export')}
      </button>
    </div>
  )
}
