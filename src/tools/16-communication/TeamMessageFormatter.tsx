import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function TeamMessageFormatter() {
  const { t } = useTranslation()
  const [messageType, setMessageType] = useState<'update' | 'announcement' | 'request' | 'reminder'>('update')
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium')
  const [recipient, setRecipient] = useState('Team')

  const generateMessage = (): string => {
    const urgencyIcons = { low: '', medium: '!', high: '!!' }
    const typeEmojis = {
      update: 'Update',
      announcement: 'Announcement',
      request: 'Request',
      reminder: 'Reminder'
    }

    let message = `[${typeEmojis[messageType]}]${urgencyIcons[urgency]} `
    if (subject) message += `${subject}\n\n`
    if (recipient) message += `To: ${recipient}\n\n`
    message += content
    message += `\n\n---\nSent via Team Message Formatter`

    return message
  }

  const copyMessage = () => {
    navigator.clipboard.writeText(generateMessage())
  }

  const messageTypes = [
    { id: 'update', name: 'Update' },
    { id: 'announcement', name: 'Announcement' },
    { id: 'request', name: 'Request' },
    { id: 'reminder', name: 'Reminder' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.teamMessageFormatter.type')}</h3>
        <div className="flex gap-2 flex-wrap">
          {messageTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setMessageType(type.id as typeof messageType)}
              className={`px-4 py-2 rounded ${
                messageType === type.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.teamMessageFormatter.urgency')}</h3>
        <div className="flex gap-2">
          {(['low', 'medium', 'high'] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUrgency(u)}
              className={`flex-1 py-2 rounded capitalize ${
                urgency === u ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.teamMessageFormatter.recipient')}</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Team, @channel, etc."
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.teamMessageFormatter.subject')}</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Message subject"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.teamMessageFormatter.content')}</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Your message content..."
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.teamMessageFormatter.preview')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono">
          {generateMessage()}
        </pre>
        <button
          onClick={copyMessage}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.teamMessageFormatter.copy')}
        </button>
      </div>
    </div>
  )
}
