import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Metric {
  id: number
  label: string
  before: string
  after: string
  improvement: string
}

export default function CaseStudyTemplate() {
  const { t } = useTranslation()
  const [caseStudy, setCaseStudy] = useState({
    title: '',
    client: '',
    industry: '',
    duration: '',
    summary: '',
    challenge: '',
    solution: '',
    implementation: '',
    results: '',
    testimonial: '',
    testimonialAuthor: '',
    testimonialTitle: '',
    callToAction: '',
  })

  const [metrics, setMetrics] = useState<Metric[]>([
    { id: 1, label: '', before: '', after: '', improvement: '' },
  ])

  const addMetric = () => {
    setMetrics([...metrics, { id: Date.now(), label: '', before: '', after: '', improvement: '' }])
  }

  const updateMetric = (id: number, field: keyof Metric, value: string) => {
    setMetrics(metrics.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  const removeMetric = (id: number) => {
    if (metrics.length > 1) {
      setMetrics(metrics.filter(m => m.id !== id))
    }
  }

  const generateCaseStudy = (): string => {
    let doc = `${'═'.repeat(60)}\n`
    doc += `CASE STUDY\n`
    doc += `${caseStudy.title || '[Case Study Title]'}\n`
    doc += `${'═'.repeat(60)}\n\n`

    doc += `CLIENT: ${caseStudy.client || '[Client Name]'}\n`
    doc += `INDUSTRY: ${caseStudy.industry || '[Industry]'}\n`
    if (caseStudy.duration) doc += `DURATION: ${caseStudy.duration}\n`
    doc += '\n'

    if (caseStudy.summary) {
      doc += `EXECUTIVE SUMMARY\n${'─'.repeat(40)}\n`
      doc += `${caseStudy.summary}\n\n`
    }

    doc += `THE CHALLENGE\n${'─'.repeat(40)}\n`
    doc += `${caseStudy.challenge || '[Describe the client\'s challenge or problem...]'}\n\n`

    doc += `THE SOLUTION\n${'─'.repeat(40)}\n`
    doc += `${caseStudy.solution || '[Describe your solution approach...]'}\n\n`

    if (caseStudy.implementation) {
      doc += `IMPLEMENTATION\n${'─'.repeat(40)}\n`
      doc += `${caseStudy.implementation}\n\n`
    }

    const filledMetrics = metrics.filter(m => m.label && (m.before || m.after || m.improvement))
    if (filledMetrics.length > 0) {
      doc += `KEY RESULTS\n${'─'.repeat(40)}\n`
      filledMetrics.forEach(m => {
        doc += `• ${m.label}\n`
        if (m.before && m.after) {
          doc += `  Before: ${m.before} → After: ${m.after}`
          if (m.improvement) doc += ` (${m.improvement})`
          doc += '\n'
        } else if (m.improvement) {
          doc += `  ${m.improvement}\n`
        }
      })
      doc += '\n'
    }

    if (caseStudy.results) {
      doc += `ADDITIONAL RESULTS\n${'─'.repeat(40)}\n`
      doc += `${caseStudy.results}\n\n`
    }

    if (caseStudy.testimonial) {
      doc += `CLIENT TESTIMONIAL\n${'─'.repeat(40)}\n`
      doc += `"${caseStudy.testimonial}"\n`
      if (caseStudy.testimonialAuthor) {
        doc += `— ${caseStudy.testimonialAuthor}`
        if (caseStudy.testimonialTitle) doc += `, ${caseStudy.testimonialTitle}`
        doc += '\n'
      }
      doc += '\n'
    }

    if (caseStudy.callToAction) {
      doc += `${'═'.repeat(40)}\n`
      doc += `${caseStudy.callToAction}\n`
    }

    return doc
  }

  const copyCaseStudy = () => {
    navigator.clipboard.writeText(generateCaseStudy())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.caseStudyTemplate.overview')}</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={caseStudy.title}
            onChange={(e) => setCaseStudy({ ...caseStudy, title: e.target.value })}
            placeholder="Case Study Title (e.g., How [Client] Achieved [Result])"
            className="w-full px-3 py-2 border border-slate-300 rounded font-medium"
          />
          <div className="grid grid-cols-3 gap-3">
            <input
              type="text"
              value={caseStudy.client}
              onChange={(e) => setCaseStudy({ ...caseStudy, client: e.target.value })}
              placeholder="Client Name"
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={caseStudy.industry}
              onChange={(e) => setCaseStudy({ ...caseStudy, industry: e.target.value })}
              placeholder="Industry"
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={caseStudy.duration}
              onChange={(e) => setCaseStudy({ ...caseStudy, duration: e.target.value })}
              placeholder="Project Duration"
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <textarea
            value={caseStudy.summary}
            onChange={(e) => setCaseStudy({ ...caseStudy, summary: e.target.value })}
            placeholder="Executive Summary (2-3 sentences)"
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.caseStudyTemplate.challenge')}</h3>
        <textarea
          value={caseStudy.challenge}
          onChange={(e) => setCaseStudy({ ...caseStudy, challenge: e.target.value })}
          placeholder="Describe the client's challenge, pain points, or goals..."
          rows={4}
          className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.caseStudyTemplate.solution')}</h3>
        <div className="space-y-3">
          <textarea
            value={caseStudy.solution}
            onChange={(e) => setCaseStudy({ ...caseStudy, solution: e.target.value })}
            placeholder="Describe your solution and approach..."
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <textarea
            value={caseStudy.implementation}
            onChange={(e) => setCaseStudy({ ...caseStudy, implementation: e.target.value })}
            placeholder="Implementation details (optional)"
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.caseStudyTemplate.metrics')}</h3>
          <button onClick={addMetric} className="text-blue-500 hover:text-blue-600 text-sm">+ Add Metric</button>
        </div>
        <div className="space-y-3">
          {metrics.map(metric => (
            <div key={metric.id} className="p-3 bg-slate-50 rounded border border-slate-200">
              <div className="grid grid-cols-4 gap-2">
                <input
                  type="text"
                  value={metric.label}
                  onChange={(e) => updateMetric(metric.id, 'label', e.target.value)}
                  placeholder="Metric Name"
                  className="px-2 py-1 border border-slate-300 rounded text-sm"
                />
                <input
                  type="text"
                  value={metric.before}
                  onChange={(e) => updateMetric(metric.id, 'before', e.target.value)}
                  placeholder="Before"
                  className="px-2 py-1 border border-slate-300 rounded text-sm"
                />
                <input
                  type="text"
                  value={metric.after}
                  onChange={(e) => updateMetric(metric.id, 'after', e.target.value)}
                  placeholder="After"
                  className="px-2 py-1 border border-slate-300 rounded text-sm"
                />
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={metric.improvement}
                    onChange={(e) => updateMetric(metric.id, 'improvement', e.target.value)}
                    placeholder="% Improvement"
                    className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                  />
                  <button
                    onClick={() => removeMetric(metric.id)}
                    disabled={metrics.length === 1}
                    className="text-red-400 hover:text-red-600 disabled:opacity-30"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <textarea
          value={caseStudy.results}
          onChange={(e) => setCaseStudy({ ...caseStudy, results: e.target.value })}
          placeholder="Additional results or qualitative outcomes..."
          rows={2}
          className="w-full mt-3 px-3 py-2 border border-slate-300 rounded resize-none"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.caseStudyTemplate.testimonial')}</h3>
        <div className="space-y-3">
          <textarea
            value={caseStudy.testimonial}
            onChange={(e) => setCaseStudy({ ...caseStudy, testimonial: e.target.value })}
            placeholder="Client quote about working with you..."
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={caseStudy.testimonialAuthor}
              onChange={(e) => setCaseStudy({ ...caseStudy, testimonialAuthor: e.target.value })}
              placeholder="Author Name"
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={caseStudy.testimonialTitle}
              onChange={(e) => setCaseStudy({ ...caseStudy, testimonialTitle: e.target.value })}
              placeholder="Author Title"
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.caseStudyTemplate.cta')}</h3>
        <input
          type="text"
          value={caseStudy.callToAction}
          onChange={(e) => setCaseStudy({ ...caseStudy, callToAction: e.target.value })}
          placeholder="Call to action (e.g., Ready to achieve similar results? Contact us today!)"
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <button
        onClick={copyCaseStudy}
        className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
      >
        {t('tools.caseStudyTemplate.export')}
      </button>
    </div>
  )
}
