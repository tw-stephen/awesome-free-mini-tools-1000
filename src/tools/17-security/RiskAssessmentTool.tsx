import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Risk {
  id: number
  name: string
  description: string
  likelihood: 1 | 2 | 3 | 4 | 5
  impact: 1 | 2 | 3 | 4 | 5
  category: string
  mitigation: string
}

export default function RiskAssessmentTool() {
  const { t } = useTranslation()
  const [risks, setRisks] = useState<Risk[]>([
    {
      id: 1,
      name: 'Data Breach',
      description: 'Unauthorized access to sensitive customer data',
      likelihood: 3,
      impact: 5,
      category: 'Security',
      mitigation: 'Implement encryption and access controls',
    },
    {
      id: 2,
      name: 'System Downtime',
      description: 'Critical system unavailability',
      likelihood: 2,
      impact: 4,
      category: 'Operational',
      mitigation: 'Implement redundancy and backup systems',
    },
  ])
  const [showForm, setShowForm] = useState(false)
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null)

  const categories = ['Security', 'Operational', 'Financial', 'Legal', 'Reputational', 'Strategic']

  const getRiskScore = (likelihood: number, impact: number): number => likelihood * impact

  const getRiskLevel = (score: number): { label: string; color: string } => {
    if (score >= 20) return { label: 'Critical', color: 'bg-red-500' }
    if (score >= 12) return { label: 'High', color: 'bg-orange-500' }
    if (score >= 6) return { label: 'Medium', color: 'bg-yellow-500' }
    return { label: 'Low', color: 'bg-green-500' }
  }

  const addOrUpdateRisk = (risk: Omit<Risk, 'id'>) => {
    if (editingRisk) {
      setRisks(risks.map(r => r.id === editingRisk.id ? { ...risk, id: editingRisk.id } : r))
    } else {
      setRisks([...risks, { ...risk, id: Date.now() }])
    }
    setShowForm(false)
    setEditingRisk(null)
  }

  const deleteRisk = (id: number) => {
    setRisks(risks.filter(r => r.id !== id))
  }

  const editRisk = (risk: Risk) => {
    setEditingRisk(risk)
    setShowForm(true)
  }

  const sortedRisks = [...risks].sort((a, b) =>
    getRiskScore(b.likelihood, b.impact) - getRiskScore(a.likelihood, a.impact)
  )

  const RiskForm = () => {
    const [form, setForm] = useState<Omit<Risk, 'id'>>(
      editingRisk || {
        name: '',
        description: '',
        likelihood: 3,
        impact: 3,
        category: 'Security',
        mitigation: '',
      }
    )

    return (
      <div className="card p-4 border-2 border-blue-300">
        <h3 className="font-medium mb-3">{editingRisk ? 'Edit Risk' : 'Add New Risk'}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">Risk Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Data Breach"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the risk..."
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-slate-500 block mb-1">Likelihood (1-5)</label>
              <select
                value={form.likelihood}
                onChange={(e) => setForm({ ...form, likelihood: parseInt(e.target.value) as 1|2|3|4|5 })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                <option value={1}>1 - Rare</option>
                <option value={2}>2 - Unlikely</option>
                <option value={3}>3 - Possible</option>
                <option value={4}>4 - Likely</option>
                <option value={5}>5 - Almost Certain</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">Impact (1-5)</label>
              <select
                value={form.impact}
                onChange={(e) => setForm({ ...form, impact: parseInt(e.target.value) as 1|2|3|4|5 })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                <option value={1}>1 - Negligible</option>
                <option value={2}>2 - Minor</option>
                <option value={3}>3 - Moderate</option>
                <option value={4}>4 - Major</option>
                <option value={5}>5 - Catastrophic</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Mitigation Strategy</label>
            <textarea
              value={form.mitigation}
              onChange={(e) => setForm({ ...form, mitigation: e.target.value })}
              placeholder="How to mitigate this risk..."
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => addOrUpdateRisk(form)}
              disabled={!form.name}
              className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
            >
              {editingRisk ? 'Update Risk' : 'Add Risk'}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditingRisk(null) }}
              className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
        >
          + {t('tools.riskAssessmentTool.addRisk')}
        </button>
      )}

      {showForm && <RiskForm />}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.riskAssessmentTool.matrix')}</h3>
        <div className="grid grid-cols-6 gap-1 text-xs">
          <div className="p-2 text-center font-medium">Impact →</div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="p-2 text-center font-medium">{i}</div>
          ))}
          {[5, 4, 3, 2, 1].map(l => (
            <>
              <div key={`l-${l}`} className="p-2 text-center font-medium">L:{l}</div>
              {[1, 2, 3, 4, 5].map(i => {
                const score = l * i
                const level = getRiskLevel(score)
                const risksHere = risks.filter(r => r.likelihood === l && r.impact === i)
                return (
                  <div
                    key={`${l}-${i}`}
                    className={`p-2 text-center ${level.color} text-white rounded relative`}
                    title={risksHere.map(r => r.name).join(', ')}
                  >
                    {score}
                    {risksHere.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-slate-700 rounded-full text-xs flex items-center justify-center">
                        {risksHere.length}
                      </span>
                    )}
                  </div>
                )
              })}
            </>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">L = Likelihood</p>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.riskAssessmentTool.risks')} ({risks.length})</h3>
        <div className="space-y-2">
          {sortedRisks.map(risk => {
            const score = getRiskScore(risk.likelihood, risk.impact)
            const level = getRiskLevel(score)
            return (
              <div key={risk.id} className="p-3 bg-slate-50 rounded">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 ${level.color} text-white rounded text-xs`}>
                      {level.label} ({score})
                    </span>
                    <span className="font-medium">{risk.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => editRisk(risk)} className="text-xs text-blue-500 hover:text-blue-600">
                      Edit
                    </button>
                    <button onClick={() => deleteRisk(risk.id)} className="text-xs text-red-500 hover:text-red-600">
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-2">{risk.description}</p>
                <div className="flex gap-4 text-xs text-slate-500">
                  <span>Category: {risk.category}</span>
                  <span>L: {risk.likelihood}</span>
                  <span>I: {risk.impact}</span>
                </div>
                {risk.mitigation && (
                  <p className="text-sm mt-2 p-2 bg-green-50 text-green-700 rounded">
                    Mitigation: {risk.mitigation}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-4 bg-blue-50">
        <h4 className="font-medium mb-2">{t('tools.riskAssessmentTool.info')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Score = Likelihood × Impact (1-25 scale)</li>
          <li>• Critical (20-25), High (12-19), Medium (6-11), Low (1-5)</li>
          <li>• Review and update risks regularly</li>
        </ul>
      </div>
    </div>
  )
}
