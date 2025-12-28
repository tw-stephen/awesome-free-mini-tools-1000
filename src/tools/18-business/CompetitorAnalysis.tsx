import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Competitor {
  id: number
  name: string
  website: string
  strengths: string
  weaknesses: string
  pricing: string
  marketShare: number
  rating: number
}

export default function CompetitorAnalysis() {
  const { t } = useTranslation()
  const [companyName, setCompanyName] = useState('')
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [showForm, setShowForm] = useState(false)

  const addCompetitor = (competitor: Omit<Competitor, 'id'>) => {
    setCompetitors([...competitors, { ...competitor, id: Date.now() }])
    setShowForm(false)
  }

  const removeCompetitor = (id: number) => {
    setCompetitors(competitors.filter(c => c.id !== id))
  }

  const updateRating = (id: number, rating: number) => {
    setCompetitors(competitors.map(c =>
      c.id === id ? { ...c, rating } : c
    ))
  }

  const generateReport = (): string => {
    let report = `COMPETITOR ANALYSIS REPORT\n${'='.repeat(50)}\n`
    report += `Company: ${companyName || '[Your Company]'}\n`
    report += `Date: ${new Date().toLocaleDateString()}\n`
    report += `Competitors Analyzed: ${competitors.length}\n\n`

    competitors.forEach((comp, i) => {
      report += `${'─'.repeat(40)}\n`
      report += `${i + 1}. ${comp.name}\n`
      if (comp.website) report += `   Website: ${comp.website}\n`
      report += `   Rating: ${comp.rating}/5\n`
      report += `   Market Share: ${comp.marketShare}%\n`
      if (comp.pricing) report += `   Pricing: ${comp.pricing}\n`
      if (comp.strengths) report += `   Strengths: ${comp.strengths}\n`
      if (comp.weaknesses) report += `   Weaknesses: ${comp.weaknesses}\n`
      report += '\n'
    })

    return report
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  const CompetitorForm = () => {
    const [form, setForm] = useState({
      name: '',
      website: '',
      strengths: '',
      weaknesses: '',
      pricing: '',
      marketShare: 0,
      rating: 3,
    })

    return (
      <div className="card p-4 border-2 border-blue-300">
        <h3 className="font-medium mb-3">{t('tools.competitorAnalysis.addCompetitor')}</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Competitor name"
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="Website URL"
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <textarea
            value={form.strengths}
            onChange={(e) => setForm({ ...form, strengths: e.target.value })}
            placeholder="Strengths..."
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <textarea
            value={form.weaknesses}
            onChange={(e) => setForm({ ...form, weaknesses: e.target.value })}
            placeholder="Weaknesses..."
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-slate-500">Pricing</label>
              <input
                type="text"
                value={form.pricing}
                onChange={(e) => setForm({ ...form, pricing: e.target.value })}
                placeholder="e.g., $99/mo"
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="text-sm text-slate-500">Market Share %</label>
              <input
                type="number"
                value={form.marketShare}
                onChange={(e) => setForm({ ...form, marketShare: Number(e.target.value) })}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="text-sm text-slate-500">Rating (1-5)</label>
              <input
                type="number"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                min="1"
                max="5"
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => addCompetitor(form)}
              disabled={!form.name}
              className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
            >
              Add Competitor
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
        <h3 className="font-medium mb-3">{t('tools.competitorAnalysis.yourCompany')}</h3>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Your company name..."
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
        >
          + {t('tools.competitorAnalysis.addCompetitor')}
        </button>
      )}

      {showForm && <CompetitorForm />}

      {competitors.length > 0 && (
        <div className="space-y-2">
          {competitors.map(comp => (
            <div key={comp.id} className="card p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium">{comp.name}</h4>
                  {comp.website && (
                    <span className="text-sm text-blue-500">{comp.website}</span>
                  )}
                </div>
                <button
                  onClick={() => removeCompetitor(comp.id)}
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="flex items-center gap-4 mb-2 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">Rating:</span>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => updateRating(comp.id, star)}
                      className={star <= comp.rating ? 'text-yellow-500' : 'text-slate-300'}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                  {comp.marketShare}% market
                </span>
                {comp.pricing && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">
                    {comp.pricing}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {comp.strengths && (
                  <div className="p-2 bg-green-50 rounded">
                    <span className="text-green-600 font-medium">Strengths: </span>
                    {comp.strengths}
                  </div>
                )}
                {comp.weaknesses && (
                  <div className="p-2 bg-red-50 rounded">
                    <span className="text-red-600 font-medium">Weaknesses: </span>
                    {comp.weaknesses}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {competitors.length > 0 && (
        <button
          onClick={copyReport}
          className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
        >
          {t('tools.competitorAnalysis.export')}
        </button>
      )}

      {competitors.length === 0 && !showForm && (
        <div className="card p-8 text-center text-slate-500">
          Add competitors to start your analysis
        </div>
      )}
    </div>
  )
}
