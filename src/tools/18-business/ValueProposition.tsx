import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ValueProposition() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    product: '',
    targetCustomer: '',
    problem: '',
    solution: '',
    uniqueBenefit: '',
    competitors: '',
    differentiator: '',
  })

  const [generated, setGenerated] = useState('')

  const generateProposition = () => {
    const templates = [
      `For ${formData.targetCustomer || '[target customers]'} who ${formData.problem || '[have this problem]'}, ${formData.product || '[product name]'} is a ${formData.solution || '[solution category]'} that ${formData.uniqueBenefit || '[provides key benefit]'}. Unlike ${formData.competitors || '[alternatives]'}, we ${formData.differentiator || '[key differentiator]'}.`,
      `${formData.product || '[Product Name]'} helps ${formData.targetCustomer || '[target customers]'} ${formData.uniqueBenefit || '[achieve outcome]'} by ${formData.solution || '[how it works]'}.`,
      `We help ${formData.targetCustomer || '[who]'} ${formData.uniqueBenefit || '[do what]'} so they can ${formData.solution || '[achieve this]'}.`,
    ]
    setGenerated(templates.join('\n\n---\n\n'))
  }

  const copyProposition = () => {
    navigator.clipboard.writeText(generated)
  }

  const fields = [
    { key: 'product', label: 'Product/Service Name', placeholder: 'Your product or service...' },
    { key: 'targetCustomer', label: 'Target Customer', placeholder: 'Who is your ideal customer?' },
    { key: 'problem', label: 'Problem', placeholder: 'What problem do they have?' },
    { key: 'solution', label: 'Solution Category', placeholder: 'How would you categorize your solution?' },
    { key: 'uniqueBenefit', label: 'Key Benefit', placeholder: 'What main benefit do you provide?' },
    { key: 'competitors', label: 'Competitors/Alternatives', placeholder: 'What alternatives exist?' },
    { key: 'differentiator', label: 'Key Differentiator', placeholder: 'What makes you unique?' },
  ]

  const completedFields = Object.values(formData).filter(v => v.trim()).length
  const progress = Math.round((completedFields / fields.length) * 100)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.valueProposition.progress')}</h3>
          <span className="text-sm text-slate-500">{completedFields}/{fields.length} completed</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.valueProposition.inputs')}</h3>
        <div className="space-y-3">
          {fields.map(field => (
            <div key={field.key}>
              <label className="text-sm text-slate-500 block mb-1">{field.label}</label>
              <input
                type="text"
                value={formData[field.key as keyof typeof formData]}
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={generateProposition}
        className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
      >
        {t('tools.valueProposition.generate')}
      </button>

      {generated && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">{t('tools.valueProposition.result')}</h3>
            <button
              onClick={copyProposition}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            >
              Copy
            </button>
          </div>
          <div className="space-y-4">
            {generated.split('---').map((template, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded">
                <div className="text-xs text-slate-400 mb-2">Template {i + 1}</div>
                <p className="text-lg">{template.trim()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4 bg-blue-50">
        <h4 className="font-medium mb-2">{t('tools.valueProposition.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Focus on benefits, not features</li>
          <li>• Be specific about your target customer</li>
          <li>• Quantify your value when possible</li>
          <li>• Keep it clear and concise</li>
        </ul>
      </div>
    </div>
  )
}
