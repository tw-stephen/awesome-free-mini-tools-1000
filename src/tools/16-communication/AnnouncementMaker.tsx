import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function AnnouncementMaker() {
  const { t } = useTranslation()
  const [type, setType] = useState<'general' | 'urgent' | 'event' | 'update'>('general')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [date, setDate] = useState('')
  const [author, setAuthor] = useState('')

  const typeStyles = {
    general: { emoji: '', label: 'Announcement' },
    urgent: { emoji: '!', label: 'URGENT' },
    event: { emoji: '*', label: 'Event' },
    update: { emoji: '>', label: 'Update' },
  }

  const generateAnnouncement = (): string => {
    const style = typeStyles[type]
    let announcement = `${style.emoji} ${style.label}: ${title || '[Title]'}\n`
    announcement += `${'='.repeat(50)}\n\n`
    announcement += body || '[Announcement content]'
    announcement += '\n\n'
    if (date) announcement += `Date: ${date}\n`
    if (author) announcement += `From: ${author}\n`
    announcement += `${'='.repeat(50)}`
    return announcement
  }

  const copyAnnouncement = () => {
    navigator.clipboard.writeText(generateAnnouncement())
  }

  const types = [
    { id: 'general', name: 'General' },
    { id: 'urgent', name: 'Urgent' },
    { id: 'event', name: 'Event' },
    { id: 'update', name: 'Update' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.announcementMaker.type')}</h3>
        <div className="flex gap-2 flex-wrap">
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id as typeof type)}
              className={`px-4 py-2 rounded ${
                type === t.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.announcementMaker.title')}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Announcement title"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.announcementMaker.body')}</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Announcement content..."
            rows={5}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.announcementMaker.date')}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.announcementMaker.author')}</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.announcementMaker.preview')}</h3>
        <pre className="bg-slate-800 text-white p-4 rounded text-sm whitespace-pre-wrap font-mono">
          {generateAnnouncement()}
        </pre>
        <button
          onClick={copyAnnouncement}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.announcementMaker.copy')}
        </button>
      </div>
    </div>
  )
}
