import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface KPI {
  id: number
  name: string
  value: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  category: string
}

export default function KPIDashboard() {
  const { t } = useTranslation()
  const [period, setPeriod] = useState('monthly')
  const [showForm, setShowForm] = useState(false)
  const [kpis, setKpis] = useState<KPI[]>([])

  const categories = ['Revenue', 'Growth', 'Customer', 'Operations', 'Marketing', 'Product']
  const periods = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly']

  const addKPI = (kpi: Omit<KPI, 'id'>) => {
    setKpis([...kpis, { ...kpi, id: Date.now() }])
    setShowForm(false)
  }

  const updateKPI = (id: number, field: keyof KPI, value: string | number) => {
    setKpis(kpis.map(k => k.id === id ? { ...k, [field]: value } : k))
  }

  const removeKPI = (id: number) => {
    setKpis(kpis.filter(k => k.id !== id))
  }

  const getPerformance = (kpi: KPI): { percentage: number; status: string; color: string } => {
    if (kpi.target === 0) return { percentage: 0, status: 'No Target', color: 'slate' }
    const percentage = Math.round((kpi.value / kpi.target) * 100)
    if (percentage >= 100) return { percentage, status: 'On Track', color: 'green' }
    if (percentage >= 80) return { percentage, status: 'Near Target', color: 'yellow' }
    return { percentage, status: 'Needs Attention', color: 'red' }
  }

  const groupedKPIs = categories.reduce((acc, category) => {
    const categoryKPIs = kpis.filter(k => k.category === category)
    if (categoryKPIs.length > 0) acc[category] = categoryKPIs
    return acc
  }, {} as Record<string, KPI[]>)

  const overallHealth = kpis.length > 0
    ? Math.round(kpis.reduce((sum, k) => sum + (k.target > 0 ? Math.min((k.value / k.target) * 100, 100) : 0), 0) / kpis.length)
    : 0

  const generateReport = (): string => {
    let doc = `KPI DASHBOARD - ${period.toUpperCase()} REPORT\n${'═'.repeat(50)}\n\n`
    doc += `Overall Health: ${overallHealth}%\n`
    doc += `Total KPIs: ${kpis.length}\n\n`

    Object.entries(groupedKPIs).forEach(([category, categoryKPIs]) => {
      doc += `${category.toUpperCase()}\n${'─'.repeat(40)}\n`
      categoryKPIs.forEach(kpi => {
        const perf = getPerformance(kpi)
        const trend = kpi.trend === 'up' ? '↑' : kpi.trend === 'down' ? '↓' : '→'
        doc += `${kpi.name}: ${kpi.value}${kpi.unit} / ${kpi.target}${kpi.unit} (${perf.percentage}%) ${trend}\n`
      })
      doc += '\n'
    })

    return doc
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  const KPIForm = () => {
    const [form, setForm] = useState({
      name: '',
      value: 0,
      target: 0,
      unit: '',
      trend: 'stable' as KPI['trend'],
      category: categories[0],
    })

    return (
      <div className="card p-4 border-2 border-blue-300">
        <h3 className="font-medium mb-3">{t('tools.kpiDashboard.addKPI')}</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="KPI Name"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div className="grid grid-cols-3 gap-3">
            <input
              type="number"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
              placeholder="Current Value"
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="number"
              value={form.target}
              onChange={(e) => setForm({ ...form, target: Number(e.target.value) })}
              placeholder="Target"
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              placeholder="Unit (%, $, etc.)"
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="flex gap-2">
              {(['up', 'stable', 'down'] as const).map(trend => (
                <button
                  key={trend}
                  onClick={() => setForm({ ...form, trend })}
                  className={`flex-1 py-2 rounded ${form.trend === trend ? (trend === 'up' ? 'bg-green-500 text-white' : trend === 'down' ? 'bg-red-500 text-white' : 'bg-slate-500 text-white') : 'bg-slate-100 hover:bg-slate-200'}`}
                >
                  {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => addKPI(form)}
              disabled={!form.name}
              className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
            >
              Add KPI
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300">
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.kpiDashboard.overview')}</h3>
          <div className="flex gap-2">
            {periods.map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2 py-1 rounded text-xs capitalize ${period === p ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-slate-50 rounded">
            <div className="text-3xl font-bold">{kpis.length}</div>
            <div className="text-sm text-slate-500">Total KPIs</div>
          </div>
          <div className={`text-center p-3 rounded ${overallHealth >= 80 ? 'bg-green-50' : overallHealth >= 60 ? 'bg-yellow-50' : 'bg-red-50'}`}>
            <div className={`text-3xl font-bold ${overallHealth >= 80 ? 'text-green-600' : overallHealth >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>{overallHealth}%</div>
            <div className="text-sm text-slate-500">Health Score</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded">
            <div className="text-3xl font-bold text-green-600">{kpis.filter(k => getPerformance(k).percentage >= 100).length}</div>
            <div className="text-sm text-slate-500">On Track</div>
          </div>
        </div>
      </div>

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
          + {t('tools.kpiDashboard.addKPI')}
        </button>
      )}

      {showForm && <KPIForm />}

      {Object.entries(groupedKPIs).map(([category, categoryKPIs]) => (
        <div key={category} className="card p-4">
          <h3 className="font-medium mb-3">{category}</h3>
          <div className="space-y-2">
            {categoryKPIs.map(kpi => {
              const perf = getPerformance(kpi)
              return (
                <div key={kpi.id} className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`${kpi.trend === 'up' ? 'text-green-500' : kpi.trend === 'down' ? 'text-red-500' : 'text-slate-400'}`}>
                        {kpi.trend === 'up' ? '↑' : kpi.trend === 'down' ? '↓' : '→'}
                      </span>
                      <span className="font-medium">{kpi.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${perf.color === 'green' ? 'bg-green-100 text-green-600' : perf.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' : perf.color === 'red' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                        {perf.status}
                      </span>
                      <button onClick={() => removeKPI(kpi.id)} className="text-red-400 hover:text-red-600 text-sm">×</button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={kpi.value}
                      onChange={(e) => updateKPI(kpi.id, 'value', Number(e.target.value))}
                      className="w-24 px-2 py-1 border border-slate-300 rounded text-sm text-center"
                    />
                    <span className="text-slate-400">/</span>
                    <span className="text-sm text-slate-500">{kpi.target}{kpi.unit}</span>
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${perf.color === 'green' ? 'bg-green-500' : perf.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${Math.min(perf.percentage, 100)}%` }} />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{perf.percentage}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {kpis.length === 0 && !showForm && (
        <div className="card p-8 text-center text-slate-500">
          Add KPIs to build your dashboard
        </div>
      )}

      {kpis.length > 0 && (
        <button onClick={copyReport} className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium">
          {t('tools.kpiDashboard.export')}
        </button>
      )}
    </div>
  )
}
