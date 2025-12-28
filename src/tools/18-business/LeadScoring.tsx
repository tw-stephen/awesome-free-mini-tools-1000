import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Lead {
  id: number
  name: string
  company: string
  email: string
  scores: Record<string, number>
  notes: string
}

interface Criterion {
  id: string
  name: string
  weight: number
  options: { label: string; value: number }[]
}

export default function LeadScoring() {
  const { t } = useTranslation()
  const [leads, setLeads] = useState<Lead[]>([])
  const [showForm, setShowForm] = useState(false)

  const defaultCriteria: Criterion[] = [
    { id: 'budget', name: 'Budget', weight: 25, options: [
      { label: 'Unknown', value: 0 }, { label: 'Low ($0-$1K)', value: 1 }, { label: 'Medium ($1K-$10K)', value: 2 }, { label: 'High ($10K+)', value: 3 }
    ]},
    { id: 'authority', name: 'Decision Authority', weight: 25, options: [
      { label: 'Unknown', value: 0 }, { label: 'No authority', value: 1 }, { label: 'Influencer', value: 2 }, { label: 'Decision maker', value: 3 }
    ]},
    { id: 'need', name: 'Need Level', weight: 25, options: [
      { label: 'Unknown', value: 0 }, { label: 'Nice to have', value: 1 }, { label: 'Important', value: 2 }, { label: 'Critical', value: 3 }
    ]},
    { id: 'timeline', name: 'Timeline', weight: 15, options: [
      { label: 'Unknown', value: 0 }, { label: '6+ months', value: 1 }, { label: '1-6 months', value: 2 }, { label: 'Immediate', value: 3 }
    ]},
    { id: 'engagement', name: 'Engagement', weight: 10, options: [
      { label: 'Cold', value: 0 }, { label: 'Low', value: 1 }, { label: 'Medium', value: 2 }, { label: 'High', value: 3 }
    ]},
  ]

  const [criteria, setCriteria] = useState<Criterion[]>(defaultCriteria)

  const calculateScore = (scores: Record<string, number>): number => {
    let totalScore = 0
    let totalWeight = 0

    criteria.forEach(c => {
      const score = scores[c.id] || 0
      const maxScore = Math.max(...c.options.map(o => o.value))
      const normalizedScore = maxScore > 0 ? (score / maxScore) * c.weight : 0
      totalScore += normalizedScore
      totalWeight += c.weight
    })

    return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0
  }

  const getScoreColor = (score: number): { bg: string; text: string; label: string } => {
    if (score >= 80) return { bg: 'bg-green-100', text: 'text-green-600', label: 'Hot' }
    if (score >= 60) return { bg: 'bg-yellow-100', text: 'text-yellow-600', label: 'Warm' }
    if (score >= 40) return { bg: 'bg-orange-100', text: 'text-orange-600', label: 'Cool' }
    return { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Cold' }
  }

  const addLead = (lead: Omit<Lead, 'id'>) => {
    setLeads([...leads, { ...lead, id: Date.now() }])
    setShowForm(false)
  }

  const updateLeadScore = (leadId: number, criterionId: string, value: number) => {
    setLeads(leads.map(l => {
      if (l.id === leadId) {
        return { ...l, scores: { ...l.scores, [criterionId]: value } }
      }
      return l
    }))
  }

  const removeLead = (id: number) => {
    setLeads(leads.filter(l => l.id !== id))
  }

  const sortedLeads = [...leads].sort((a, b) => calculateScore(b.scores) - calculateScore(a.scores))

  const generateReport = (): string => {
    let doc = `LEAD SCORING REPORT\n${'═'.repeat(50)}\n\n`
    doc += `Total Leads: ${leads.length}\n`
    doc += `Hot Leads: ${leads.filter(l => calculateScore(l.scores) >= 80).length}\n`
    doc += `Warm Leads: ${leads.filter(l => calculateScore(l.scores) >= 60 && calculateScore(l.scores) < 80).length}\n\n`

    doc += `LEADS (Sorted by Score)\n${'─'.repeat(40)}\n`
    sortedLeads.forEach((lead, index) => {
      const score = calculateScore(lead.scores)
      const status = getScoreColor(score)
      doc += `${index + 1}. ${lead.name} (${lead.company})\n`
      doc += `   Email: ${lead.email}\n`
      doc += `   Score: ${score}% - ${status.label}\n`
      if (lead.notes) doc += `   Notes: ${lead.notes}\n`
      doc += '\n'
    })

    return doc
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  const LeadForm = () => {
    const [form, setForm] = useState({
      name: '',
      company: '',
      email: '',
      scores: {} as Record<string, number>,
      notes: '',
    })

    return (
      <div className="card p-4 border-2 border-blue-300">
        <h3 className="font-medium mb-3">{t('tools.leadScoring.addLead')}</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Contact Name" className="px-3 py-2 border border-slate-300 rounded" />
            <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company" className="px-3 py-2 border border-slate-300 rounded" />
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="px-3 py-2 border border-slate-300 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {criteria.map(c => (
              <div key={c.id}>
                <label className="text-sm text-slate-500">{c.name} ({c.weight}%)</label>
                <select value={form.scores[c.id] || 0} onChange={(e) => setForm({ ...form, scores: { ...form.scores, [c.id]: Number(e.target.value) } })} className="w-full px-3 py-2 border border-slate-300 rounded">
                  {c.options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" rows={2} className="w-full px-3 py-2 border border-slate-300 rounded resize-none" />
          <div className="flex gap-2">
            <button onClick={() => addLead(form)} disabled={!form.name || !form.email} className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300">Add Lead</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300">Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.leadScoring.overview')}</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-slate-50 rounded">
            <div className="text-2xl font-bold">{leads.length}</div>
            <div className="text-xs text-slate-500">Total Leads</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{leads.filter(l => calculateScore(l.scores) >= 80).length}</div>
            <div className="text-xs text-slate-500">Hot</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded">
            <div className="text-2xl font-bold text-yellow-600">{leads.filter(l => calculateScore(l.scores) >= 60 && calculateScore(l.scores) < 80).length}</div>
            <div className="text-xs text-slate-500">Warm</div>
          </div>
          <div className="p-3 bg-orange-50 rounded">
            <div className="text-2xl font-bold text-orange-600">{leads.filter(l => calculateScore(l.scores) < 60).length}</div>
            <div className="text-xs text-slate-500">Cool/Cold</div>
          </div>
        </div>
      </div>

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
          + {t('tools.leadScoring.addLead')}
        </button>
      )}

      {showForm && <LeadForm />}

      {sortedLeads.map(lead => {
        const score = calculateScore(lead.scores)
        const status = getScoreColor(score)
        return (
          <div key={lead.id} className={`card p-4 ${status.bg}`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{lead.name}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${status.bg} ${status.text} border border-current`}>{status.label}</span>
                </div>
                <div className="text-sm text-slate-500">{lead.company}</div>
                <div className="text-sm text-slate-500">{lead.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`text-2xl font-bold ${status.text}`}>{score}%</div>
                <button onClick={() => removeLead(lead.id)} className="text-red-400 hover:text-red-600">×</button>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2 mt-3">
              {criteria.map(c => (
                <div key={c.id}>
                  <label className="text-xs text-slate-500">{c.name}</label>
                  <select value={lead.scores[c.id] || 0} onChange={(e) => updateLeadScore(lead.id, c.id, Number(e.target.value))} className="w-full px-2 py-1 border border-slate-300 rounded text-sm">
                    {c.options.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            {lead.notes && <p className="text-sm text-slate-600 mt-2">{lead.notes}</p>}
          </div>
        )
      })}

      {leads.length === 0 && !showForm && (
        <div className="card p-8 text-center text-slate-500">
          Add leads to start scoring and prioritizing
        </div>
      )}

      {leads.length > 0 && (
        <button onClick={copyReport} className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium">
          {t('tools.leadScoring.export')}
        </button>
      )}
    </div>
  )
}
