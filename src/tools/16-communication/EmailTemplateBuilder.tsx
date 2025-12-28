import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function EmailTemplateBuilder() {
  const { t } = useTranslation()
  const [template, setTemplate] = useState<'professional' | 'friendly' | 'formal' | 'followup'>('professional')
  const [senderName, setSenderName] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [subject, setSubject] = useState('')
  const [mainContent, setMainContent] = useState('')
  const [callToAction, setCallToAction] = useState('')

  const templates = {
    professional: {
      greeting: `Dear ${recipientName || '[Recipient]'},`,
      closing: `Best regards,\n${senderName || '[Your Name]'}`,
    },
    friendly: {
      greeting: `Hi ${recipientName || '[Recipient]'}!`,
      closing: `Cheers,\n${senderName || '[Your Name]'}`,
    },
    formal: {
      greeting: `Dear ${recipientName || 'Sir/Madam'},`,
      closing: `Yours sincerely,\n${senderName || '[Your Name]'}`,
    },
    followup: {
      greeting: `Hi ${recipientName || '[Recipient]'},`,
      closing: `Looking forward to hearing from you.\n\nBest,\n${senderName || '[Your Name]'}`,
    },
  }

  const generateEmail = (): string => {
    const tmpl = templates[template]
    let email = `Subject: ${subject || '[Subject Line]'}\n\n`
    email += `${tmpl.greeting}\n\n`
    email += `${mainContent || '[Your message here]'}\n\n`
    if (callToAction) {
      email += `${callToAction}\n\n`
    }
    email += tmpl.closing
    return email
  }

  const copyEmail = () => {
    navigator.clipboard.writeText(generateEmail())
  }

  const templateOptions = [
    { id: 'professional', name: 'Professional' },
    { id: 'friendly', name: 'Friendly' },
    { id: 'formal', name: 'Formal' },
    { id: 'followup', name: 'Follow-up' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.emailTemplateBuilder.template')}</h3>
        <div className="flex gap-2 flex-wrap">
          {templateOptions.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => setTemplate(tmpl.id as typeof template)}
              className={`px-4 py-2 rounded ${
                template === tmpl.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {tmpl.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.emailTemplateBuilder.yourName')}</label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.emailTemplateBuilder.recipientName')}</label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Recipient name"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.emailTemplateBuilder.subject')}</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.emailTemplateBuilder.content')}</label>
          <textarea
            value={mainContent}
            onChange={(e) => setMainContent(e.target.value)}
            placeholder="Main email content"
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.emailTemplateBuilder.cta')}</label>
          <input
            type="text"
            value={callToAction}
            onChange={(e) => setCallToAction(e.target.value)}
            placeholder="e.g., Please let me know if you have any questions."
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.emailTemplateBuilder.preview')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap">
          {generateEmail()}
        </pre>
        <button
          onClick={copyEmail}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.emailTemplateBuilder.copy')}
        </button>
      </div>
    </div>
  )
}
