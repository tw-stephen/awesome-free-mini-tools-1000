import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Stat {
  id: number
  label: string
  value: string
  platform: string
}

export default function MediaKit() {
  const { t } = useTranslation()
  const [kit, setKit] = useState({
    name: '',
    tagline: '',
    bio: '',
    niche: '',
    location: '',
    email: '',
    website: '',
    demographics: '',
    targetAudience: '',
    brandsWorkedWith: '',
    services: '',
    rates: '',
  })

  const [stats, setStats] = useState<Stat[]>([
    { id: 1, label: 'Instagram Followers', value: '', platform: 'instagram' },
    { id: 2, label: 'TikTok Followers', value: '', platform: 'tiktok' },
  ])

  const platformOptions = ['instagram', 'tiktok', 'youtube', 'twitter', 'linkedin', 'facebook', 'podcast', 'blog', 'newsletter']

  const addStat = () => {
    setStats([...stats, { id: Date.now(), label: '', value: '', platform: 'instagram' }])
  }

  const updateStat = (id: number, field: keyof Stat, value: string) => {
    setStats(stats.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const removeStat = (id: number) => {
    if (stats.length > 1) {
      setStats(stats.filter(s => s.id !== id))
    }
  }

  const generateMediaKit = (): string => {
    let doc = `${'═'.repeat(60)}\n`
    doc += `MEDIA KIT\n`
    doc += `${kit.name || '[Your Name/Brand]'}\n`
    doc += `${'═'.repeat(60)}\n\n`

    if (kit.tagline) doc += `"${kit.tagline}"\n\n`

    doc += `ABOUT\n${'─'.repeat(40)}\n`
    doc += `${kit.bio || '[Brief bio about yourself or brand]'}\n\n`

    if (kit.niche) doc += `Niche: ${kit.niche}\n`
    if (kit.location) doc += `Location: ${kit.location}\n`
    doc += '\n'

    doc += `AUDIENCE & REACH\n${'─'.repeat(40)}\n`
    stats.forEach(stat => {
      if (stat.value) {
        doc += `${stat.label || stat.platform}: ${stat.value}\n`
      }
    })
    doc += '\n'

    if (kit.demographics) {
      doc += `Demographics:\n${kit.demographics}\n\n`
    }

    if (kit.targetAudience) {
      doc += `Target Audience:\n${kit.targetAudience}\n\n`
    }

    if (kit.brandsWorkedWith) {
      doc += `PREVIOUS COLLABORATIONS\n${'─'.repeat(40)}\n`
      doc += `${kit.brandsWorkedWith}\n\n`
    }

    if (kit.services) {
      doc += `SERVICES OFFERED\n${'─'.repeat(40)}\n`
      doc += `${kit.services}\n\n`
    }

    if (kit.rates) {
      doc += `RATES\n${'─'.repeat(40)}\n`
      doc += `${kit.rates}\n\n`
    }

    doc += `CONTACT\n${'─'.repeat(40)}\n`
    if (kit.email) doc += `Email: ${kit.email}\n`
    if (kit.website) doc += `Website: ${kit.website}\n`

    return doc
  }

  const copyMediaKit = () => {
    navigator.clipboard.writeText(generateMediaKit())
  }

  const totalFollowers = stats.reduce((sum, s) => {
    const num = parseInt(s.value.replace(/[^0-9]/g, '')) || 0
    return sum + num
  }, 0)

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.mediaKit.profile')}</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={kit.name}
            onChange={(e) => setKit({ ...kit, name: e.target.value })}
            placeholder="Your Name / Brand Name"
            className="w-full px-3 py-2 border border-slate-300 rounded font-medium"
          />
          <input
            type="text"
            value={kit.tagline}
            onChange={(e) => setKit({ ...kit, tagline: e.target.value })}
            placeholder="Tagline or signature phrase"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <textarea
            value={kit.bio}
            onChange={(e) => setKit({ ...kit, bio: e.target.value })}
            placeholder="Short bio (2-3 sentences about you and your content)"
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={kit.niche}
              onChange={(e) => setKit({ ...kit, niche: e.target.value })}
              placeholder="Niche (e.g., Lifestyle, Tech)"
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={kit.location}
              onChange={(e) => setKit({ ...kit, location: e.target.value })}
              placeholder="Location"
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.mediaKit.stats')}</h3>
          <span className="text-sm text-slate-500">Total: {formatNumber(totalFollowers)}</span>
        </div>
        <div className="space-y-2">
          {stats.map(stat => (
            <div key={stat.id} className="flex items-center gap-2">
              <select
                value={stat.platform}
                onChange={(e) => updateStat(stat.id, 'platform', e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded capitalize"
              >
                {platformOptions.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <input
                type="text"
                value={stat.label}
                onChange={(e) => updateStat(stat.id, 'label', e.target.value)}
                placeholder="Label (e.g., Instagram Followers)"
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
              />
              <input
                type="text"
                value={stat.value}
                onChange={(e) => updateStat(stat.id, 'value', e.target.value)}
                placeholder="Value (e.g., 50K)"
                className="w-24 px-3 py-2 border border-slate-300 rounded"
              />
              <button
                onClick={() => removeStat(stat.id)}
                disabled={stats.length === 1}
                className="text-red-400 hover:text-red-600 disabled:opacity-30"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button onClick={addStat} className="mt-3 text-blue-500 hover:text-blue-600 text-sm">
          + Add Platform
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.mediaKit.audience')}</h3>
        <div className="space-y-3">
          <textarea
            value={kit.demographics}
            onChange={(e) => setKit({ ...kit, demographics: e.target.value })}
            placeholder="Demographics (Age: 25-34, Gender: 60% Female, Location: US)"
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <textarea
            value={kit.targetAudience}
            onChange={(e) => setKit({ ...kit, targetAudience: e.target.value })}
            placeholder="Target audience description"
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.mediaKit.collaborations')}</h3>
        <textarea
          value={kit.brandsWorkedWith}
          onChange={(e) => setKit({ ...kit, brandsWorkedWith: e.target.value })}
          placeholder="Previous brand collaborations (comma-separated)"
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.mediaKit.services')}</h3>
        <div className="space-y-3">
          <textarea
            value={kit.services}
            onChange={(e) => setKit({ ...kit, services: e.target.value })}
            placeholder="Services offered (Sponsored Posts, Product Reviews, etc.)"
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <textarea
            value={kit.rates}
            onChange={(e) => setKit({ ...kit, rates: e.target.value })}
            placeholder="Rate card (optional, or 'Rates upon request')"
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.mediaKit.contact')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="email"
            value={kit.email}
            onChange={(e) => setKit({ ...kit, email: e.target.value })}
            placeholder="Email for inquiries"
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            value={kit.website}
            onChange={(e) => setKit({ ...kit, website: e.target.value })}
            placeholder="Website / Link in Bio"
            className="px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      <button
        onClick={copyMediaKit}
        className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
      >
        {t('tools.mediaKit.export')}
      </button>
    </div>
  )
}
