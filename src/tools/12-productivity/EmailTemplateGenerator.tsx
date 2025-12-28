import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type TemplateCategory = 'professional' | 'followUp' | 'apology' | 'request' | 'thankyou' | 'introduction'

interface EmailTemplate {
  id: string
  name: string
  category: TemplateCategory
  subject: string
  body: string
  isCustom: boolean
}

export default function EmailTemplateGenerator() {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('professional')
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [customTemplates, setCustomTemplates] = useState<EmailTemplate[]>([])
  const [variables, setVariables] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', subject: '', body: '' })

  const defaultTemplates: EmailTemplate[] = [
    {
      id: '1', name: 'Meeting Request', category: 'professional', isCustom: false,
      subject: 'Meeting Request: {{topic}}',
      body: `Dear {{recipientName}},

I hope this email finds you well. I am writing to request a meeting to discuss {{topic}}.

Would you be available on {{date}} at {{time}}? The meeting should take approximately {{duration}}.

Please let me know if this works for you or suggest an alternative time that would be more convenient.

Best regards,
{{senderName}}`
    },
    {
      id: '2', name: 'Follow Up', category: 'followUp', isCustom: false,
      subject: 'Following Up: {{topic}}',
      body: `Hi {{recipientName}},

I wanted to follow up on {{topic}} that we discussed on {{date}}.

Have you had a chance to {{action}}? I would appreciate any updates you might have.

Looking forward to hearing from you.

Best,
{{senderName}}`
    },
    {
      id: '3', name: 'Apology Email', category: 'apology', isCustom: false,
      subject: 'My Sincere Apology',
      body: `Dear {{recipientName}},

I want to sincerely apologize for {{issue}}. I understand this may have caused {{impact}}.

I take full responsibility and have taken steps to {{solution}}.

I value our relationship and hope we can move forward from this.

Sincerely,
{{senderName}}`
    },
    {
      id: '4', name: 'Resource Request', category: 'request', isCustom: false,
      subject: 'Request for {{resource}}',
      body: `Dear {{recipientName}},

I am writing to request {{resource}} for {{purpose}}.

{{details}}

I would greatly appreciate your assistance with this matter. Please let me know if you need any additional information.

Thank you for your consideration.

Best regards,
{{senderName}}`
    },
    {
      id: '5', name: 'Thank You Note', category: 'thankyou', isCustom: false,
      subject: 'Thank You for {{reason}}',
      body: `Dear {{recipientName}},

I wanted to take a moment to express my sincere gratitude for {{reason}}.

{{personalNote}}

Your {{quality}} is truly appreciated and made a significant difference.

Thank you again.

Warm regards,
{{senderName}}`
    },
    {
      id: '6', name: 'Self Introduction', category: 'introduction', isCustom: false,
      subject: 'Introduction: {{senderName}} - {{role}}',
      body: `Dear {{recipientName}},

I hope this email finds you well. My name is {{senderName}}, and I am the {{role}} at {{company}}.

{{introduction}}

I would love the opportunity to connect and discuss {{topic}}.

Please feel free to reach out at your convenience.

Best regards,
{{senderName}}
{{contactInfo}}`
    }
  ]

  useEffect(() => {
    const saved = localStorage.getItem('custom-email-templates')
    if (saved) setCustomTemplates(JSON.parse(saved))
  }, [])

  const saveCustomTemplates = (updated: EmailTemplate[]) => {
    setCustomTemplates(updated)
    localStorage.setItem('custom-email-templates', JSON.stringify(updated))
  }

  const allTemplates = [...defaultTemplates, ...customTemplates]
  const filteredTemplates = allTemplates.filter(t => t.category === selectedCategory)

  const extractVariables = (text: string): string[] => {
    const matches = text.match(/\{\{(\w+)\}\}/g) || []
    return [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '')))]
  }

  const fillTemplate = (text: string): string => {
    let result = text
    Object.entries(variables).forEach(([key, value]) => {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value || `{{${key}}}`)
    })
    return result
  }

  const handleSelectTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    const vars = extractVariables(template.subject + template.body)
    const newVariables: Record<string, string> = {}
    vars.forEach(v => { newVariables[v] = variables[v] || '' })
    setVariables(newVariables)
  }

  const copyEmail = () => {
    if (!selectedTemplate) return
    const text = `Subject: ${fillTemplate(selectedTemplate.subject)}\n\n${fillTemplate(selectedTemplate.body)}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const saveCustomTemplate = () => {
    if (!form.name || !form.body) return
    const template: EmailTemplate = {
      id: Date.now().toString(),
      name: form.name,
      category: selectedCategory,
      subject: form.subject,
      body: form.body,
      isCustom: true
    }
    saveCustomTemplates([...customTemplates, template])
    setForm({ name: '', subject: '', body: '' })
    setShowForm(false)
  }

  const deleteCustomTemplate = (id: string) => {
    saveCustomTemplates(customTemplates.filter(t => t.id !== id))
    if (selectedTemplate?.id === id) setSelectedTemplate(null)
  }

  const categories: TemplateCategory[] = ['professional', 'followUp', 'apology', 'request', 'thankyou', 'introduction']

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat)
              setSelectedTemplate(null)
            }}
            className={`px-3 py-1.5 rounded text-sm ${
              selectedCategory === cat ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t(`tools.emailTemplateGenerator.${cat}`)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            onClick={() => handleSelectTemplate(template)}
            className={`card p-3 cursor-pointer ${
              selectedTemplate?.id === template.id ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="font-medium text-sm">{template.name}</span>
              {template.isCustom && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteCustomTemplate(template.id)
                  }}
                  className="text-red-500 text-xs"
                >
                  ×
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 truncate">{template.subject}</p>
          </div>
        ))}
        <button
          onClick={() => setShowForm(!showForm)}
          className="card p-3 border-2 border-dashed border-slate-300 text-slate-500 text-sm"
        >
          + {t('tools.emailTemplateGenerator.createCustom')}
        </button>
      </div>

      {showForm && (
        <div className="card p-4 space-y-3">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={t('tools.emailTemplateGenerator.templateName')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder={t('tools.emailTemplateGenerator.subject')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <textarea
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder={t('tools.emailTemplateGenerator.body')}
            rows={6}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <p className="text-xs text-slate-500">{t('tools.emailTemplateGenerator.variableHint')}</p>
          <button
            onClick={saveCustomTemplate}
            disabled={!form.name || !form.body}
            className="w-full py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {t('tools.emailTemplateGenerator.save')}
          </button>
        </div>
      )}

      {selectedTemplate && (
        <>
          <div className="card p-4">
            <h3 className="font-medium text-slate-700 mb-3">{t('tools.emailTemplateGenerator.fillVariables')}</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(variables).map(key => (
                <div key={key}>
                  <label className="text-xs text-slate-500 capitalize">{key}</label>
                  <input
                    type="text"
                    value={variables[key]}
                    onChange={(e) => setVariables({ ...variables, [key]: e.target.value })}
                    placeholder={key}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium text-slate-700 mb-3">{t('tools.emailTemplateGenerator.preview')}</h3>
            <div className="bg-slate-50 p-4 rounded text-sm">
              <div className="font-medium mb-2">
                {t('tools.emailTemplateGenerator.subject')}: {fillTemplate(selectedTemplate.subject)}
              </div>
              <div className="whitespace-pre-wrap">{fillTemplate(selectedTemplate.body)}</div>
            </div>
          </div>

          <button
            onClick={copyEmail}
            className={`w-full py-3 rounded font-medium ${
              copied ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
            }`}
          >
            {copied ? '✓ ' + t('tools.emailTemplateGenerator.copied') : t('tools.emailTemplateGenerator.copy')}
          </button>
        </>
      )}
    </div>
  )
}
