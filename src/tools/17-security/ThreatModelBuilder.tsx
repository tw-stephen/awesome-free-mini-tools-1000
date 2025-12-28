import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Threat {
  id: number
  category: string
  threat: string
  attacker: string
  asset: string
  impact: 'critical' | 'high' | 'medium' | 'low'
  likelihood: 'certain' | 'likely' | 'possible' | 'unlikely'
  mitigations: string[]
}

export default function ThreatModelBuilder() {
  const { t } = useTranslation()
  const [systemName, setSystemName] = useState('')
  const [description, setDescription] = useState('')
  const [threats, setThreats] = useState<Threat[]>([])
  const [showForm, setShowForm] = useState(false)

  // STRIDE categories
  const categories = [
    { id: 'S', name: 'Spoofing', description: 'Pretending to be someone else' },
    { id: 'T', name: 'Tampering', description: 'Modifying data or code' },
    { id: 'R', name: 'Repudiation', description: 'Denying an action' },
    { id: 'I', name: 'Information Disclosure', description: 'Exposing information' },
    { id: 'D', name: 'Denial of Service', description: 'Making system unavailable' },
    { id: 'E', name: 'Elevation of Privilege', description: 'Gaining unauthorized access' },
  ]

  const attackers = ['External Attacker', 'Insider Threat', 'Nation State', 'Automated Bot', 'Competitor', 'Script Kiddie']

  const addThreat = (threat: Omit<Threat, 'id'>) => {
    setThreats([...threats, { ...threat, id: Date.now() }])
    setShowForm(false)
  }

  const removeThreat = (id: number) => {
    setThreats(threats.filter(t => t.id !== id))
  }

  const calculateRisk = (impact: Threat['impact'], likelihood: Threat['likelihood']): string => {
    const impactScore = { critical: 4, high: 3, medium: 2, low: 1 }
    const likelihoodScore = { certain: 4, likely: 3, possible: 2, unlikely: 1 }
    const score = impactScore[impact] * likelihoodScore[likelihood]

    if (score >= 12) return 'Critical'
    if (score >= 8) return 'High'
    if (score >= 4) return 'Medium'
    return 'Low'
  }

  const getRiskColor = (risk: string): string => {
    switch (risk) {
      case 'Critical': return 'bg-red-100 text-red-700'
      case 'High': return 'bg-orange-100 text-orange-700'
      case 'Medium': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-green-100 text-green-700'
    }
  }

  const generateReport = (): string => {
    let report = `THREAT MODEL REPORT\n${'='.repeat(60)}\n\n`
    report += `System: ${systemName || '[System Name]'}\n`
    report += `Date: ${new Date().toLocaleDateString()}\n`
    if (description) report += `Description: ${description}\n`
    report += `\nTotal Threats Identified: ${threats.length}\n\n`

    categories.forEach(cat => {
      const catThreats = threats.filter(t => t.category === cat.name)
      if (catThreats.length > 0) {
        report += `${cat.id} - ${cat.name.toUpperCase()}\n${'─'.repeat(40)}\n`
        catThreats.forEach((threat, i) => {
          const risk = calculateRisk(threat.impact, threat.likelihood)
          report += `${i + 1}. ${threat.threat}\n`
          report += `   Asset: ${threat.asset}\n`
          report += `   Attacker: ${threat.attacker}\n`
          report += `   Risk: ${risk} (Impact: ${threat.impact}, Likelihood: ${threat.likelihood})\n`
          if (threat.mitigations.length > 0) {
            report += `   Mitigations:\n`
            threat.mitigations.forEach(m => {
              report += `     - ${m}\n`
            })
          }
          report += '\n'
        })
      }
    })

    return report
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  const ThreatForm = () => {
    const [form, setForm] = useState({
      category: 'Spoofing',
      threat: '',
      attacker: attackers[0],
      asset: '',
      impact: 'medium' as Threat['impact'],
      likelihood: 'possible' as Threat['likelihood'],
      mitigations: [''],
    })

    const addMitigation = () => {
      setForm({ ...form, mitigations: [...form.mitigations, ''] })
    }

    const updateMitigation = (index: number, value: string) => {
      const newMits = [...form.mitigations]
      newMits[index] = value
      setForm({ ...form, mitigations: newMits })
    }

    return (
      <div className="card p-4 border-2 border-blue-300">
        <h3 className="font-medium mb-3">{t('tools.threatModelBuilder.addThreat')}</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-500 block mb-1">Category (STRIDE)</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                {categories.map(c => <option key={c.id} value={c.name}>{c.id} - {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">Attacker</label>
              <select
                value={form.attacker}
                onChange={(e) => setForm({ ...form, attacker: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                {attackers.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Threat Description</label>
            <textarea
              value={form.threat}
              onChange={(e) => setForm({ ...form, threat: e.target.value })}
              placeholder="Describe the threat..."
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Target Asset</label>
            <input
              type="text"
              value={form.asset}
              onChange={(e) => setForm({ ...form, asset: e.target.value })}
              placeholder="e.g., User database, API endpoint"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-500 block mb-1">Impact</label>
              <select
                value={form.impact}
                onChange={(e) => setForm({ ...form, impact: e.target.value as Threat['impact'] })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">Likelihood</label>
              <select
                value={form.likelihood}
                onChange={(e) => setForm({ ...form, likelihood: e.target.value as Threat['likelihood'] })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                <option value="certain">Certain</option>
                <option value="likely">Likely</option>
                <option value="possible">Possible</option>
                <option value="unlikely">Unlikely</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Mitigations</label>
            {form.mitigations.map((m, i) => (
              <input
                key={i}
                type="text"
                value={m}
                onChange={(e) => updateMitigation(i, e.target.value)}
                placeholder="Mitigation strategy..."
                className="w-full px-3 py-2 border border-slate-300 rounded mb-1"
              />
            ))}
            <button onClick={addMitigation} className="text-sm text-blue-500 hover:text-blue-600">
              + Add Mitigation
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => addThreat({
                ...form,
                mitigations: form.mitigations.filter(m => m.trim()),
              })}
              disabled={!form.threat || !form.asset}
              className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
            >
              Add Threat
            </button>
            <button
              onClick={() => setShowForm(false)}
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
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.threatModelBuilder.system')}</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={systemName}
            onChange={(e) => setSystemName(e.target.value)}
            placeholder="System name..."
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="System description..."
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">STRIDE Categories</h3>
        <div className="grid grid-cols-2 gap-2">
          {categories.map(c => (
            <div key={c.id} className="p-2 bg-slate-50 rounded">
              <span className="font-bold text-blue-600">{c.id}</span> - <span className="font-medium">{c.name}</span>
              <p className="text-xs text-slate-500">{c.description}</p>
            </div>
          ))}
        </div>
      </div>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
        >
          + {t('tools.threatModelBuilder.addThreat')}
        </button>
      )}

      {showForm && <ThreatForm />}

      {threats.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">{t('tools.threatModelBuilder.threats')} ({threats.length})</h3>
            <button onClick={copyReport} className="text-sm text-blue-500 hover:text-blue-600">
              Export Report
            </button>
          </div>
          <div className="space-y-2">
            {threats.map(threat => {
              const risk = calculateRisk(threat.impact, threat.likelihood)
              return (
                <div key={threat.id} className="p-3 bg-slate-50 rounded">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded mr-2">
                        {threat.category}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${getRiskColor(risk)}`}>
                        {risk}
                      </span>
                    </div>
                    <button
                      onClick={() => removeThreat(threat.id)}
                      className="text-red-500 hover:text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="font-medium">{threat.threat}</p>
                  <p className="text-sm text-slate-500">
                    Asset: {threat.asset} • Attacker: {threat.attacker}
                  </p>
                  {threat.mitigations.length > 0 && (
                    <div className="mt-2 text-sm">
                      <span className="text-slate-500">Mitigations:</span>
                      <ul className="list-disc list-inside text-green-600">
                        {threat.mitigations.map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
