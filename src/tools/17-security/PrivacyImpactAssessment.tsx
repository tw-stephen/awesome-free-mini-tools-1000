import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface PIAQuestion {
  id: string
  category: string
  question: string
  answer: 'yes' | 'no' | 'partial' | 'na' | null
  impact: 'high' | 'medium' | 'low'
  notes: string
}

export default function PrivacyImpactAssessment() {
  const { t } = useTranslation()
  const [projectName, setProjectName] = useState('')
  const [assessor, setAssessor] = useState('')
  const [questions, setQuestions] = useState<PIAQuestion[]>([
    { id: '1', category: 'Data Collection', question: 'Does the project collect personal data?', answer: null, impact: 'high', notes: '' },
    { id: '2', category: 'Data Collection', question: 'Is data collection minimized to what is necessary?', answer: null, impact: 'medium', notes: '' },
    { id: '3', category: 'Data Collection', question: 'Are users informed about data collection?', answer: null, impact: 'high', notes: '' },
    { id: '4', category: 'Consent', question: 'Is explicit consent obtained before data collection?', answer: null, impact: 'high', notes: '' },
    { id: '5', category: 'Consent', question: 'Can users easily withdraw consent?', answer: null, impact: 'medium', notes: '' },
    { id: '6', category: 'Data Storage', question: 'Is personal data encrypted at rest?', answer: null, impact: 'high', notes: '' },
    { id: '7', category: 'Data Storage', question: 'Is there a data retention policy?', answer: null, impact: 'medium', notes: '' },
    { id: '8', category: 'Data Storage', question: 'Is data stored in compliant jurisdictions?', answer: null, impact: 'high', notes: '' },
    { id: '9', category: 'Data Access', question: 'Is access to personal data role-based?', answer: null, impact: 'high', notes: '' },
    { id: '10', category: 'Data Access', question: 'Is access to data logged and auditable?', answer: null, impact: 'medium', notes: '' },
    { id: '11', category: 'Third Parties', question: 'Is data shared with third parties?', answer: null, impact: 'high', notes: '' },
    { id: '12', category: 'Third Parties', question: 'Are data processing agreements in place?', answer: null, impact: 'high', notes: '' },
    { id: '13', category: 'User Rights', question: 'Can users access their data?', answer: null, impact: 'high', notes: '' },
    { id: '14', category: 'User Rights', question: 'Can users request data deletion?', answer: null, impact: 'high', notes: '' },
    { id: '15', category: 'Security', question: 'Is data transmitted securely (TLS)?', answer: null, impact: 'high', notes: '' },
    { id: '16', category: 'Security', question: 'Is there an incident response plan?', answer: null, impact: 'medium', notes: '' },
  ])

  const updateAnswer = (id: string, answer: PIAQuestion['answer']) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, answer } : q))
  }

  const updateNotes = (id: string, notes: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, notes } : q))
  }

  const getScore = (): { score: number; level: string; color: string } => {
    const answered = questions.filter(q => q.answer && q.answer !== 'na')
    if (answered.length === 0) return { score: 0, level: 'Not Assessed', color: 'text-slate-500' }

    const scores = { yes: 1, partial: 0.5, no: 0 }
    const total = answered.reduce((sum, q) => sum + (scores[q.answer as 'yes' | 'partial' | 'no'] || 0), 0)
    const percentage = Math.round((total / answered.length) * 100)

    if (percentage >= 80) return { score: percentage, level: 'Low Risk', color: 'text-green-600' }
    if (percentage >= 60) return { score: percentage, level: 'Medium Risk', color: 'text-yellow-600' }
    return { score: percentage, level: 'High Risk', color: 'text-red-600' }
  }

  const categories = [...new Set(questions.map(q => q.category))]
  const result = getScore()

  const generateReport = (): string => {
    let report = `PRIVACY IMPACT ASSESSMENT\n${'='.repeat(60)}\n\n`
    report += `Project: ${projectName || '[Project Name]'}\n`
    report += `Assessor: ${assessor || '[Assessor]'}\n`
    report += `Date: ${new Date().toLocaleDateString()}\n`
    report += `Risk Level: ${result.level} (${result.score}%)\n\n`

    categories.forEach(cat => {
      report += `${cat.toUpperCase()}\n${'─'.repeat(40)}\n`
      questions.filter(q => q.category === cat).forEach(q => {
        const answerText = q.answer ? q.answer.toUpperCase() : 'NOT ANSWERED'
        report += `Q: ${q.question}\n`
        report += `A: ${answerText}${q.notes ? ` - ${q.notes}` : ''}\n\n`
      })
    })

    return report
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.privacyImpactAssessment.info')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name..."
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Assessor</label>
            <input
              type="text"
              value={assessor}
              onChange={(e) => setAssessor(e.target.value)}
              placeholder="Your name..."
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className={`card p-4 ${result.score >= 80 ? 'bg-green-50' : result.score >= 60 ? 'bg-yellow-50' : 'bg-red-50'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">{t('tools.privacyImpactAssessment.score')}</h3>
            <p className={`text-2xl font-bold ${result.color}`}>{result.level}</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold">{result.score}%</span>
            <p className="text-sm text-slate-500">compliance</p>
          </div>
        </div>
      </div>

      {categories.map(category => (
        <div key={category} className="card p-4">
          <h3 className="font-medium mb-3">{category}</h3>
          <div className="space-y-4">
            {questions.filter(q => q.category === category).map(q => (
              <div key={q.id} className="p-3 bg-slate-50 rounded">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <p className="text-sm">{q.question}</p>
                  <span className={`text-xs px-2 py-0.5 rounded shrink-0 ${
                    q.impact === 'high' ? 'bg-red-100 text-red-700' :
                    q.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {q.impact}
                  </span>
                </div>
                <div className="flex gap-2 mb-2">
                  {(['yes', 'partial', 'no', 'na'] as const).map(ans => (
                    <button
                      key={ans}
                      onClick={() => updateAnswer(q.id, ans)}
                      className={`px-3 py-1 rounded text-sm ${
                        q.answer === ans
                          ? ans === 'yes' ? 'bg-green-500 text-white' :
                            ans === 'partial' ? 'bg-yellow-500 text-white' :
                            ans === 'no' ? 'bg-red-500 text-white' :
                            'bg-slate-500 text-white'
                          : 'bg-white border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {ans === 'na' ? 'N/A' : ans.charAt(0).toUpperCase() + ans.slice(1)}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={q.notes}
                  onChange={(e) => updateNotes(q.id, e.target.value)}
                  placeholder="Notes (optional)..."
                  className="w-full px-2 py-1 border border-slate-200 rounded text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={copyReport}
        className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
      >
        {t('tools.privacyImpactAssessment.export')}
      </button>

      <div className="card p-4 bg-blue-50">
        <h4 className="font-medium mb-2">{t('tools.privacyImpactAssessment.about')}</h4>
        <p className="text-sm text-slate-600">
          A Privacy Impact Assessment (PIA) helps identify and minimize privacy risks
          in projects that process personal data. Required under GDPR and many other
          privacy regulations.
        </p>
      </div>
    </div>
  )
}
