import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Variant {
  id: number
  name: string
  description: string
  hypothesis: string
  visitors: number
  conversions: number
}

export default function ABTestPlanner() {
  const { t } = useTranslation()
  const [test, setTest] = useState({
    name: '',
    element: '',
    metric: 'conversion',
    duration: 14,
    confidence: 95,
    status: 'planning' as 'planning' | 'running' | 'completed',
  })

  const [variants, setVariants] = useState<Variant[]>([
    { id: 1, name: 'Control (A)', description: '', hypothesis: 'Current version', visitors: 0, conversions: 0 },
    { id: 2, name: 'Variant (B)', description: '', hypothesis: '', visitors: 0, conversions: 0 },
  ])

  const metrics = [
    { id: 'conversion', name: 'Conversion Rate' },
    { id: 'clicks', name: 'Click-through Rate' },
    { id: 'revenue', name: 'Revenue per Visitor' },
    { id: 'engagement', name: 'Engagement Rate' },
    { id: 'bounce', name: 'Bounce Rate' },
  ]

  const addVariant = () => {
    const letter = String.fromCharCode(65 + variants.length)
    setVariants([...variants, { id: Date.now(), name: `Variant (${letter})`, description: '', hypothesis: '', visitors: 0, conversions: 0 }])
  }

  const updateVariant = (id: number, field: keyof Variant, value: string | number) => {
    setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v))
  }

  const removeVariant = (id: number) => {
    if (variants.length > 2) {
      setVariants(variants.filter(v => v.id !== id))
    }
  }

  const getConversionRate = (variant: Variant): number => {
    return variant.visitors > 0 ? (variant.conversions / variant.visitors) * 100 : 0
  }

  const calculateSignificance = (): { winner: Variant | null; isSignificant: boolean; lift: number } => {
    if (variants.length < 2) return { winner: null, isSignificant: false, lift: 0 }

    const control = variants[0]
    const controlRate = getConversionRate(control)

    let bestVariant: Variant | null = null
    let bestLift = 0

    variants.slice(1).forEach(variant => {
      const variantRate = getConversionRate(variant)
      const lift = controlRate > 0 ? ((variantRate - controlRate) / controlRate) * 100 : 0

      if (lift > bestLift) {
        bestLift = lift
        bestVariant = variant
      }
    })

    // Simplified significance check (would use proper statistical test in production)
    const totalVisitors = variants.reduce((sum, v) => sum + v.visitors, 0)
    const minSampleSize = 100 * variants.length
    const isSignificant = totalVisitors >= minSampleSize && Math.abs(bestLift) > 10

    return { winner: bestVariant, isSignificant, lift: bestLift }
  }

  const result = calculateSignificance()

  const calculateSampleSize = (): number => {
    const baselineRate = 5 // 5% baseline conversion
    const minimumEffect = 20 // 20% minimum detectable effect
    // Alpha value for reference: (100 - test.confidence) / 100

    // Simplified sample size calculation
    const z = test.confidence === 99 ? 2.576 : test.confidence === 95 ? 1.96 : 1.645
    const p = baselineRate / 100
    const d = p * (minimumEffect / 100)

    const n = Math.ceil((2 * Math.pow(z, 2) * p * (1 - p)) / Math.pow(d, 2))
    return n * variants.length
  }

  const generateReport = (): string => {
    let doc = `A/B TEST PLAN\n${'═'.repeat(50)}\n\n`
    doc += `Test Name: ${test.name || '[Test Name]'}\n`
    doc += `Element: ${test.element || '[Element Being Tested]'}\n`
    doc += `Primary Metric: ${metrics.find(m => m.id === test.metric)?.name}\n`
    doc += `Duration: ${test.duration} days\n`
    doc += `Confidence Level: ${test.confidence}%\n`
    doc += `Status: ${test.status}\n`
    doc += `Required Sample Size: ~${calculateSampleSize().toLocaleString()} visitors\n\n`

    doc += `VARIANTS\n${'─'.repeat(40)}\n`
    variants.forEach((v, i) => {
      const rate = getConversionRate(v)
      doc += `\n${i + 1}. ${v.name}\n`
      doc += `   Description: ${v.description || '-'}\n`
      doc += `   Hypothesis: ${v.hypothesis || '-'}\n`
      doc += `   Visitors: ${v.visitors.toLocaleString()}\n`
      doc += `   Conversions: ${v.conversions.toLocaleString()}\n`
      doc += `   Conversion Rate: ${rate.toFixed(2)}%\n`
    })

    if (result.winner) {
      doc += `\nRESULTS\n${'─'.repeat(40)}\n`
      doc += `Winner: ${result.winner.name}\n`
      doc += `Lift: ${result.lift >= 0 ? '+' : ''}${result.lift.toFixed(1)}%\n`
      doc += `Statistical Significance: ${result.isSignificant ? 'Yes' : 'Not yet'}\n`
    }

    return doc
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.abTestPlanner.setup')}</h3>
        <div className="space-y-3">
          <input type="text" value={test.name} onChange={(e) => setTest({ ...test, name: e.target.value })} placeholder="Test Name (e.g., Homepage CTA Color)" className="w-full px-3 py-2 border border-slate-300 rounded" />
          <input type="text" value={test.element} onChange={(e) => setTest({ ...test, element: e.target.value })} placeholder="Element Being Tested (e.g., Sign Up Button)" className="w-full px-3 py-2 border border-slate-300 rounded" />
          <div className="grid grid-cols-3 gap-3">
            <select value={test.metric} onChange={(e) => setTest({ ...test, metric: e.target.value })} className="px-3 py-2 border border-slate-300 rounded">
              {metrics.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <input type="number" value={test.duration} onChange={(e) => setTest({ ...test, duration: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded" min="1" />
              <span className="text-sm text-slate-500">days</span>
            </div>
            <select value={test.confidence} onChange={(e) => setTest({ ...test, confidence: Number(e.target.value) })} className="px-3 py-2 border border-slate-300 rounded">
              <option value={90}>90% confidence</option>
              <option value={95}>95% confidence</option>
              <option value={99}>99% confidence</option>
            </select>
          </div>
          <div className="flex gap-2">
            {(['planning', 'running', 'completed'] as const).map(status => (
              <button key={status} onClick={() => setTest({ ...test, status })} className={`flex-1 py-2 rounded capitalize ${test.status === status ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-4 bg-blue-50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Estimated Sample Size Needed</span>
          <span className="font-bold text-blue-600">~{calculateSampleSize().toLocaleString()} visitors</span>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.abTestPlanner.variants')}</h3>
          <button onClick={addVariant} className="text-blue-500 hover:text-blue-600 text-sm">+ Add Variant</button>
        </div>
        <div className="space-y-3">
          {variants.map((variant, index) => {
            const rate = getConversionRate(variant)
            const isControl = index === 0
            const controlRate = getConversionRate(variants[0])
            const lift = !isControl && controlRate > 0 ? ((rate - controlRate) / controlRate) * 100 : 0

            return (
              <div key={variant.id} className={`p-3 rounded border ${isControl ? 'border-slate-300 bg-slate-50' : 'border-blue-300 bg-blue-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <input type="text" value={variant.name} onChange={(e) => updateVariant(variant.id, 'name', e.target.value)} className="font-medium bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-1" />
                  {!isControl && variants.length > 2 && (
                    <button onClick={() => removeVariant(variant.id)} className="text-red-400 hover:text-red-600">×</button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input type="text" value={variant.description} onChange={(e) => updateVariant(variant.id, 'description', e.target.value)} placeholder="Description" className="px-2 py-1 border border-slate-300 rounded text-sm" />
                  <input type="text" value={variant.hypothesis} onChange={(e) => updateVariant(variant.id, 'hypothesis', e.target.value)} placeholder="Hypothesis" className="px-2 py-1 border border-slate-300 rounded text-sm" />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="text-xs text-slate-500">Visitors</label>
                    <input type="number" value={variant.visitors} onChange={(e) => updateVariant(variant.id, 'visitors', Number(e.target.value))} className="w-full px-2 py-1 border border-slate-300 rounded text-sm" min="0" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Conversions</label>
                    <input type="number" value={variant.conversions} onChange={(e) => updateVariant(variant.id, 'conversions', Number(e.target.value))} className="w-full px-2 py-1 border border-slate-300 rounded text-sm" min="0" />
                  </div>
                  <div className="text-center">
                    <label className="text-xs text-slate-500">Conv. Rate</label>
                    <div className="text-lg font-bold">{rate.toFixed(2)}%</div>
                  </div>
                  {!isControl && (
                    <div className="text-center">
                      <label className="text-xs text-slate-500">Lift</label>
                      <div className={`text-lg font-bold ${lift >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {lift >= 0 ? '+' : ''}{lift.toFixed(1)}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {test.status === 'completed' && result.winner && (
        <div className={`card p-4 ${result.isSignificant ? 'bg-green-50 border-2 border-green-400' : 'bg-yellow-50 border-2 border-yellow-400'}`}>
          <h3 className="font-medium mb-2">{t('tools.abTestPlanner.results')}</h3>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-slate-500">Winner: </span>
              <span className="font-bold">{result.winner.name}</span>
              <span className={`ml-2 ${result.lift >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ({result.lift >= 0 ? '+' : ''}{result.lift.toFixed(1)}%)
              </span>
            </div>
            <span className={`px-2 py-1 rounded text-sm ${result.isSignificant ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
              {result.isSignificant ? 'Significant' : 'Not Significant'}
            </span>
          </div>
        </div>
      )}

      <button onClick={copyReport} className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium">
        {t('tools.abTestPlanner.export')}
      </button>
    </div>
  )
}
