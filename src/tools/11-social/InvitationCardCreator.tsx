import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

type EventType = 'birthday' | 'wedding' | 'party' | 'babyShower' | 'graduation' | 'holiday'

export default function InvitationCardCreator() {
  const { t } = useTranslation()
  const [eventType, setEventType] = useState<EventType>('party')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [host, setHost] = useState('')
  const [message, setMessage] = useState('')
  const [bgColor, setBgColor] = useState('#f8fafc')
  const [textColor, setTextColor] = useState('#1e293b')
  const [accentColor, setAccentColor] = useState('#3b82f6')
  const cardRef = useRef<HTMLDivElement>(null)

  const eventEmojis: Record<EventType, string> = {
    birthday: '🎂',
    wedding: '💒',
    party: '🎉',
    babyShower: '👶',
    graduation: '🎓',
    holiday: '🎄'
  }

  const eventDefaults: Record<EventType, string> = {
    birthday: "You're Invited to a Birthday Party!",
    wedding: "You're Invited to Our Wedding",
    party: "You're Invited!",
    babyShower: "Baby Shower Invitation",
    graduation: "Graduation Celebration",
    holiday: "Holiday Party Invitation"
  }

  const downloadCard = () => {
    if (!cardRef.current) return

    // Create a simple text representation for download
    const cardContent = `
${eventEmojis[eventType]} ${title || eventDefaults[eventType]}

📅 ${date}
🕐 ${time}
📍 ${location}
${host ? `👤 Hosted by: ${host}` : ''}

${message}
    `.trim()

    const blob = new Blob([cardContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'invitation.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  const copyText = () => {
    const cardContent = `
${eventEmojis[eventType]} ${title || eventDefaults[eventType]}

📅 ${date}
🕐 ${time}
📍 ${location}
${host ? `👤 Hosted by: ${host}` : ''}

${message}
    `.trim()

    navigator.clipboard.writeText(cardContent)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.invitationCardCreator.eventType')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(eventEmojis) as EventType[]).map(type => (
            <button
              key={type}
              onClick={() => setEventType(type)}
              className={`px-3 py-1.5 rounded text-sm ${
                eventType === type ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {eventEmojis[type]} {t(`tools.invitationCardCreator.${type}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">
            {t('tools.invitationCardCreator.title')}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={eventDefaults[eventType]}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.invitationCardCreator.date')}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.invitationCardCreator.time')}
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">
            {t('tools.invitationCardCreator.location')}
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t('tools.invitationCardCreator.locationPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">
            {t('tools.invitationCardCreator.host')}
          </label>
          <input
            type="text"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder={t('tools.invitationCardCreator.hostPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">
            {t('tools.invitationCardCreator.message')}
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('tools.invitationCardCreator.messagePlaceholder')}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.invitationCardCreator.customize')}
        </label>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.invitationCardCreator.background')}
            </label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full h-8 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.invitationCardCreator.text')}
            </label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-full h-8 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.invitationCardCreator.accent')}
            </label>
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-full h-8 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.invitationCardCreator.preview')}
        </h3>
        <div
          ref={cardRef}
          className="p-6 rounded-lg border text-center"
          style={{ backgroundColor: bgColor, color: textColor, borderColor: accentColor }}
        >
          <div className="text-4xl mb-4">{eventEmojis[eventType]}</div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: accentColor }}>
            {title || eventDefaults[eventType]}
          </h2>

          <div className="space-y-2 mb-4">
            {date && (
              <div className="flex items-center justify-center gap-2">
                <span>📅</span>
                <span>{new Date(date).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            )}
            {time && (
              <div className="flex items-center justify-center gap-2">
                <span>🕐</span>
                <span>{time}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center justify-center gap-2">
                <span>📍</span>
                <span>{location}</span>
              </div>
            )}
          </div>

          {message && (
            <p className="text-sm opacity-80 italic mb-4">{message}</p>
          )}

          {host && (
            <p className="text-sm">
              {t('tools.invitationCardCreator.hostedBy')} <span className="font-medium">{host}</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={copyText}
          className="flex-1 py-3 bg-slate-100 text-slate-700 rounded font-medium"
        >
          {t('tools.invitationCardCreator.copyText')}
        </button>
        <button
          onClick={downloadCard}
          className="flex-1 py-3 bg-blue-500 text-white rounded font-medium"
        >
          {t('tools.invitationCardCreator.download')}
        </button>
      </div>
    </div>
  )
}
