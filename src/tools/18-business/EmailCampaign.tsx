import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Email {
  id: number
  subject: string
  sendTime: string
  delayDays: number
  content: string
  status: 'draft' | 'scheduled' | 'sent'
}

export default function EmailCampaign() {
  const { t } = useTranslation()
  const [campaign, setCampaign] = useState({
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    audience: '',
    goal: '',
  })
  const [emails, setEmails] = useState<Email[]>([])
  const [showForm, setShowForm] = useState(false)

  const templates = [
    { id: 'welcome', name: 'Welcome', subject: 'Welcome to [Company]!', content: 'Hi [Name],\n\nWelcome aboard! We\'re excited to have you...' },
    { id: 'nurture', name: 'Nurture', subject: 'Here\'s something valuable for you', content: 'Hi [Name],\n\nWe thought you might find this useful...' },
    { id: 'promo', name: 'Promotion', subject: 'Special offer just for you', content: 'Hi [Name],\n\nWe have an exclusive offer...' },
    { id: 'followup', name: 'Follow-up', subject: 'Just checking in', content: 'Hi [Name],\n\nWe wanted to follow up on...' },
    { id: 'winback', name: 'Win-back', subject: 'We miss you!', content: 'Hi [Name],\n\nIt\'s been a while since we\'ve seen you...' },
  ]

  const addEmail = (email: Omit<Email, 'id' | 'status'>) => {
    const newEmails = [...emails, { ...email, id: Date.now(), status: 'draft' as const }]
    setEmails(newEmails.sort((a, b) => a.delayDays - b.delayDays))
    setShowForm(false)
  }

  const updateEmail = (id: number, field: keyof Email, value: string | number) => {
    setEmails(emails.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  const removeEmail = (id: number) => {
    setEmails(emails.filter(e => e.id !== id))
  }

  const moveEmail = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= emails.length) return
    const newEmails = [...emails]
    ;[newEmails[index], newEmails[newIndex]] = [newEmails[newIndex], newEmails[index]]
    setEmails(newEmails)
  }

  const calculateSendDate = (delayDays: number): string => {
    const startDate = new Date(campaign.startDate)
    startDate.setDate(startDate.getDate() + delayDays)
    return startDate.toISOString().split('T')[0]
  }

  const generateSequence = (): string => {
    let doc = `EMAIL CAMPAIGN: ${campaign.name || '[Campaign Name]'}\n${'═'.repeat(50)}\n\n`
    doc += `Start Date: ${campaign.startDate}\n`
    doc += `Audience: ${campaign.audience || '[Target Audience]'}\n`
    doc += `Goal: ${campaign.goal || '[Campaign Goal]'}\n`
    doc += `Total Emails: ${emails.length}\n\n`

    doc += `EMAIL SEQUENCE\n${'─'.repeat(40)}\n`
    emails.forEach((email, index) => {
      doc += `\n${index + 1}. [Day ${email.delayDays}] ${email.subject}\n`
      doc += `   Send Date: ${calculateSendDate(email.delayDays)} at ${email.sendTime}\n`
      doc += `   Status: ${email.status}\n`
      doc += `   Content Preview:\n   ${email.content.split('\n')[0]}...\n`
    })

    return doc
  }

  const copySequence = () => {
    navigator.clipboard.writeText(generateSequence())
  }

  const EmailForm = () => {
    const [form, setForm] = useState({
      subject: '',
      sendTime: '09:00',
      delayDays: emails.length > 0 ? emails[emails.length - 1].delayDays + 3 : 0,
      content: '',
    })

    const applyTemplate = (templateId: string) => {
      const template = templates.find(t => t.id === templateId)
      if (template) {
        setForm({ ...form, subject: template.subject, content: template.content })
      }
    }

    return (
      <div className="card p-4 border-2 border-blue-300">
        <h3 className="font-medium mb-3">{t('tools.emailCampaign.addEmail')}</h3>
        <div className="space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {templates.map(template => (
              <button
                key={template.id}
                onClick={() => applyTemplate(template.id)}
                className="px-3 py-1 bg-slate-100 rounded text-sm whitespace-nowrap hover:bg-slate-200"
              >
                {template.name}
              </button>
            ))}
          </div>
          <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Email Subject" className="w-full px-3 py-2 border border-slate-300 rounded" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-500 block mb-1">Send after (days)</label>
              <input type="number" value={form.delayDays} onChange={(e) => setForm({ ...form, delayDays: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded" min="0" />
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">Send time</label>
              <input type="time" value={form.sendTime} onChange={(e) => setForm({ ...form, sendTime: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded" />
            </div>
          </div>
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Email content..." rows={4} className="w-full px-3 py-2 border border-slate-300 rounded resize-none" />
          <div className="flex gap-2">
            <button onClick={() => addEmail(form)} disabled={!form.subject} className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300">Add Email</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300">Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.emailCampaign.details')}</h3>
        <div className="space-y-3">
          <input type="text" value={campaign.name} onChange={(e) => setCampaign({ ...campaign, name: e.target.value })} placeholder="Campaign Name" className="w-full px-3 py-2 border border-slate-300 rounded" />
          <div className="grid grid-cols-3 gap-3">
            <input type="date" value={campaign.startDate} onChange={(e) => setCampaign({ ...campaign, startDate: e.target.value })} className="px-3 py-2 border border-slate-300 rounded" />
            <input type="text" value={campaign.audience} onChange={(e) => setCampaign({ ...campaign, audience: e.target.value })} placeholder="Target Audience" className="px-3 py-2 border border-slate-300 rounded" />
            <input type="text" value={campaign.goal} onChange={(e) => setCampaign({ ...campaign, goal: e.target.value })} placeholder="Campaign Goal" className="px-3 py-2 border border-slate-300 rounded" />
          </div>
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Campaign Duration</span>
          <span className="font-medium">
            {emails.length > 0 ? `${emails[emails.length - 1].delayDays} days` : '0 days'} ({emails.length} emails)
          </span>
        </div>
      </div>

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
          + {t('tools.emailCampaign.addEmail')}
        </button>
      )}

      {showForm && <EmailForm />}

      <div className="space-y-2">
        {emails.map((email, index) => (
          <div key={email.id} className="card p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm font-medium">Day {email.delayDays}</span>
                <span className="text-sm text-slate-500">{calculateSendDate(email.delayDays)} at {email.sendTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => moveEmail(index, 'up')} disabled={index === 0} className="px-2 py-1 text-slate-400 hover:text-slate-600 disabled:opacity-30">↑</button>
                <button onClick={() => moveEmail(index, 'down')} disabled={index === emails.length - 1} className="px-2 py-1 text-slate-400 hover:text-slate-600 disabled:opacity-30">↓</button>
                <button onClick={() => removeEmail(email.id)} className="text-red-400 hover:text-red-600 px-2 py-1">×</button>
              </div>
            </div>
            <input type="text" value={email.subject} onChange={(e) => updateEmail(email.id, 'subject', e.target.value)} className="w-full font-medium bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-1 mb-2" />
            <textarea value={email.content} onChange={(e) => updateEmail(email.id, 'content', e.target.value)} rows={3} className="w-full text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded p-2 resize-none" />
            <div className="flex gap-2 mt-2">
              {(['draft', 'scheduled', 'sent'] as const).map(status => (
                <button key={status} onClick={() => updateEmail(email.id, 'status', status)} className={`px-2 py-1 rounded text-xs ${email.status === status ? (status === 'sent' ? 'bg-green-500 text-white' : status === 'scheduled' ? 'bg-blue-500 text-white' : 'bg-slate-500 text-white') : 'bg-slate-100 hover:bg-slate-200'}`}>
                  {status}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {emails.length === 0 && !showForm && (
        <div className="card p-8 text-center text-slate-500">
          Add emails to build your campaign sequence
        </div>
      )}

      {emails.length > 0 && (
        <button onClick={copySequence} className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium">
          {t('tools.emailCampaign.export')}
        </button>
      )}
    </div>
  )
}
