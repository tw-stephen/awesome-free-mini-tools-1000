import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

type BadgeType = 'conference' | 'employee' | 'event' | 'visitor' | 'vip'
type Size = 'small' | 'medium' | 'large'

interface Badge {
  id: string
  name: string
  title: string
  company: string
  type: BadgeType
}

export default function BadgeGenerator() {
  const { t } = useTranslation()
  const [badgeType, setBadgeType] = useState<BadgeType>('conference')
  const [size, setSize] = useState<Size>('medium')
  const [badges, setBadges] = useState<Badge[]>([])
  const [eventName, setEventName] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [form, setForm] = useState({
    name: '',
    title: '',
    company: ''
  })

  const typeStyles: Record<BadgeType, { primary: string; secondary: string; accent: string }> = {
    conference: { primary: '#3b82f6', secondary: '#eff6ff', accent: '#1d4ed8' },
    employee: { primary: '#10b981', secondary: '#ecfdf5', accent: '#059669' },
    event: { primary: '#8b5cf6', secondary: '#f5f3ff', accent: '#7c3aed' },
    visitor: { primary: '#f59e0b', secondary: '#fffbeb', accent: '#d97706' },
    vip: { primary: '#1a1a1a', secondary: '#f5f5f5', accent: '#c9a959' }
  }

  const sizes: Record<Size, { width: number; height: number }> = {
    small: { width: 280, height: 180 },
    medium: { width: 340, height: 220 },
    large: { width: 400, height: 260 }
  }

  const addBadge = () => {
    if (!form.name) return
    const badge: Badge = {
      id: Date.now().toString(),
      ...form,
      type: badgeType
    }
    setBadges([...badges, badge])
    setForm({ name: '', title: '', company: '' })
  }

  const deleteBadge = (id: string) => {
    setBadges(badges.filter(b => b.id !== id))
  }

  const downloadBadge = (badge: Badge) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const style = typeStyles[badge.type]
    const { width, height } = sizes[size]

    canvas.width = width
    canvas.height = height

    // Background
    ctx.fillStyle = style.secondary
    ctx.fillRect(0, 0, width, height)

    // Header stripe
    ctx.fillStyle = style.primary
    ctx.fillRect(0, 0, width, 50)

    // Event name in header
    if (eventName) {
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.font = 'bold 16px sans-serif'
      ctx.fillText(eventName, width / 2, 32)
    }

    // Badge type indicator
    ctx.fillStyle = style.accent
    ctx.fillRect(0, 50, 8, height - 50)

    // VIP gold corners
    if (badge.type === 'vip') {
      ctx.fillStyle = style.accent
      ctx.beginPath()
      ctx.moveTo(width - 40, 50)
      ctx.lineTo(width, 50)
      ctx.lineTo(width, 90)
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(width - 40, height)
      ctx.lineTo(width, height)
      ctx.lineTo(width, height - 40)
      ctx.fill()
    }

    // Name
    ctx.fillStyle = '#1a1a1a'
    ctx.textAlign = 'center'
    ctx.font = 'bold 28px sans-serif'
    ctx.fillText(badge.name, width / 2, height / 2 + 10)

    // Title
    if (badge.title) {
      ctx.font = '16px sans-serif'
      ctx.fillStyle = '#64748b'
      ctx.fillText(badge.title, width / 2, height / 2 + 40)
    }

    // Company
    if (badge.company) {
      ctx.font = 'bold 14px sans-serif'
      ctx.fillStyle = style.primary
      ctx.fillText(badge.company, width / 2, height / 2 + 65)
    }

    // Badge type label
    ctx.fillStyle = style.primary
    ctx.fillRect(width / 2 - 40, height - 30, 80, 20)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 10px sans-serif'
    ctx.fillText(badge.type.toUpperCase(), width / 2, height - 16)

    // Download
    const link = document.createElement('a')
    link.download = `badge-${badge.name.replace(/\s+/g, '-')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const downloadAll = () => {
    badges.forEach((badge, index) => {
      setTimeout(() => downloadBadge(badge), index * 500)
    })
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.badgeGenerator.eventName')}
        </label>
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder={t('tools.badgeGenerator.eventPlaceholder')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.badgeGenerator.badgeType')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['conference', 'employee', 'event', 'visitor', 'vip'] as const).map(type => (
            <button
              key={type}
              onClick={() => setBadgeType(type)}
              className={`px-3 py-1.5 rounded text-sm capitalize ${
                badgeType === type ? 'text-white' : 'bg-slate-100'
              }`}
              style={badgeType === type ? { backgroundColor: typeStyles[type].primary } : {}}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.badgeGenerator.size')}
        </label>
        <div className="flex gap-2">
          {(['small', 'medium', 'large'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`flex-1 py-2 rounded text-sm capitalize ${
                size === s ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {s} ({sizes[s].width}x{sizes[s].height})
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <h3 className="text-sm font-medium text-slate-700">
          {t('tools.badgeGenerator.addBadge')}
        </h3>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder={t('tools.badgeGenerator.name')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder={t('tools.badgeGenerator.title')}
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder={t('tools.badgeGenerator.company')}
            className="px-3 py-2 border border-slate-300 rounded"
          />
        </div>
        <button
          onClick={addBadge}
          disabled={!form.name}
          className="w-full py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {t('tools.badgeGenerator.add')}
        </button>
      </div>

      {badges.length > 0 && (
        <>
          <div className="card p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-slate-700">
                {t('tools.badgeGenerator.badges')} ({badges.length})
              </h3>
              <button
                onClick={downloadAll}
                className="text-sm text-blue-500"
              >
                {t('tools.badgeGenerator.downloadAll')}
              </button>
            </div>
            <div className="space-y-2">
              {badges.map(badge => (
                <div
                  key={badge.id}
                  className="p-3 rounded flex items-center justify-between"
                  style={{
                    backgroundColor: typeStyles[badge.type].secondary,
                    borderLeft: `4px solid ${typeStyles[badge.type].primary}`
                  }}
                >
                  <div>
                    <div className="font-bold">{badge.name}</div>
                    <div className="text-sm text-slate-600">
                      {badge.title}{badge.title && badge.company && ' • '}{badge.company}
                    </div>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded text-white mt-1 inline-block"
                      style={{ backgroundColor: typeStyles[badge.type].primary }}
                    >
                      {badge.type}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadBadge(badge)}
                      className="text-sm text-blue-500"
                    >
                      {t('tools.badgeGenerator.download')}
                    </button>
                    <button
                      onClick={() => deleteBadge(badge.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setBadges([])}
            className="w-full py-2 bg-red-100 text-red-600 rounded"
          >
            {t('tools.badgeGenerator.clearAll')}
          </button>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
