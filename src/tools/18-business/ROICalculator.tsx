import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Investment {
  id: number
  name: string
  cost: number
  expectedReturn: number
  timeframe: number
}

export default function ROICalculator() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'simple' | 'compare'>('simple')
  const [simple, setSimple] = useState({ investment: 0, returnAmount: 0, timeframe: 12 })
  const [investments, setInvestments] = useState<Investment[]>([])
  const [showForm, setShowForm] = useState(false)

  const calculateROI = (investment: number, returnAmount: number): number => {
    if (investment === 0) return 0
    return ((returnAmount - investment) / investment) * 100
  }

  const calculateAnnualizedROI = (roi: number, months: number): number => {
    if (months === 0) return 0
    return roi * (12 / months)
  }

  const simpleROI = calculateROI(simple.investment, simple.returnAmount)
  const annualizedROI = calculateAnnualizedROI(simpleROI, simple.timeframe)

  const addInvestment = (inv: Omit<Investment, 'id'>) => {
    setInvestments([...investments, { ...inv, id: Date.now() }])
    setShowForm(false)
  }

  const removeInvestment = (id: number) => {
    setInvestments(investments.filter(i => i.id !== id))
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
  }

  const formatPercent = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const InvestmentForm = () => {
    const [form, setForm] = useState({ name: '', cost: 0, expectedReturn: 0, timeframe: 12 })

    return (
      <div className="card p-4 border-2 border-blue-300">
        <h3 className="font-medium mb-3">{t('tools.roiCalculator.addInvestment')}</h3>
        <div className="space-y-3">
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Investment name" className="w-full px-3 py-2 border border-slate-300 rounded" />
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-slate-500">Cost ($)</label>
              <input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded" min="0" />
            </div>
            <div>
              <label className="text-sm text-slate-500">Expected Return ($)</label>
              <input type="number" value={form.expectedReturn} onChange={(e) => setForm({ ...form, expectedReturn: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded" min="0" />
            </div>
            <div>
              <label className="text-sm text-slate-500">Timeframe (months)</label>
              <input type="number" value={form.timeframe} onChange={(e) => setForm({ ...form, timeframe: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded" min="1" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => addInvestment(form)} disabled={!form.name || form.cost === 0} className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300">Add</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300">Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2">
          <button onClick={() => setMode('simple')} className={`flex-1 py-2 rounded ${mode === 'simple' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>Simple Calculator</button>
          <button onClick={() => setMode('compare')} className={`flex-1 py-2 rounded ${mode === 'compare' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>Compare Investments</button>
        </div>
      </div>

      {mode === 'simple' && (
        <>
          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.roiCalculator.simple')}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-500 block mb-1">Initial Investment ($)</label>
                <input type="number" value={simple.investment} onChange={(e) => setSimple({ ...simple, investment: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded" min="0" />
              </div>
              <div>
                <label className="text-sm text-slate-500 block mb-1">Total Return ($)</label>
                <input type="number" value={simple.returnAmount} onChange={(e) => setSimple({ ...simple, returnAmount: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded" min="0" />
              </div>
              <div>
                <label className="text-sm text-slate-500 block mb-1">Timeframe (months)</label>
                <input type="number" value={simple.timeframe} onChange={(e) => setSimple({ ...simple, timeframe: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded" min="1" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="card p-4 text-center">
              <div className="text-sm text-slate-500">Net Profit</div>
              <div className={`text-2xl font-bold ${simple.returnAmount - simple.investment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(simple.returnAmount - simple.investment)}
              </div>
            </div>
            <div className={`card p-4 text-center ${simpleROI >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="text-sm text-slate-500">ROI</div>
              <div className={`text-2xl font-bold ${simpleROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercent(simpleROI)}
              </div>
            </div>
            <div className="card p-4 text-center bg-blue-50">
              <div className="text-sm text-slate-500">Annualized ROI</div>
              <div className={`text-2xl font-bold ${annualizedROI >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatPercent(annualizedROI)}
              </div>
            </div>
          </div>
        </>
      )}

      {mode === 'compare' && (
        <>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
              + {t('tools.roiCalculator.addInvestment')}
            </button>
          )}

          {showForm && <InvestmentForm />}

          {investments.length > 0 && (
            <div className="space-y-2">
              {investments.sort((a, b) => {
                const roiA = calculateROI(a.cost, a.expectedReturn)
                const roiB = calculateROI(b.cost, b.expectedReturn)
                return roiB - roiA
              }).map((inv, index) => {
                const roi = calculateROI(inv.cost, inv.expectedReturn)
                const annualized = calculateAnnualizedROI(roi, inv.timeframe)
                return (
                  <div key={inv.id} className={`card p-4 ${index === 0 ? 'border-2 border-green-500' : ''}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          {index === 0 && <span className="px-2 py-0.5 bg-green-500 text-white rounded text-xs">Best</span>}
                          <span className="font-medium">{inv.name}</span>
                        </div>
                        <div className="text-sm text-slate-500">
                          Cost: {formatCurrency(inv.cost)} • Return: {formatCurrency(inv.expectedReturn)} • {inv.timeframe} months
                        </div>
                      </div>
                      <button onClick={() => removeInvestment(inv.id)} className="text-red-500 hover:text-red-600 text-sm">Remove</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2 bg-slate-50 rounded">
                        <div className="text-xs text-slate-500">ROI</div>
                        <div className={`font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatPercent(roi)}</div>
                      </div>
                      <div className="p-2 bg-slate-50 rounded">
                        <div className="text-xs text-slate-500">Annualized</div>
                        <div className={`font-bold ${annualized >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{formatPercent(annualized)}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {investments.length === 0 && !showForm && (
            <div className="card p-8 text-center text-slate-500">
              Add investments to compare their ROI
            </div>
          )}
        </>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.roiCalculator.formula')}</h4>
        <p className="text-sm text-slate-600 font-mono">
          ROI = ((Return - Investment) / Investment) × 100
        </p>
      </div>
    </div>
  )
}
