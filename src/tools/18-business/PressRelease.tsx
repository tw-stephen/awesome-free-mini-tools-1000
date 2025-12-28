import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function PressRelease() {
  const { t } = useTranslation()
  const [release, setRelease] = useState({
    type: 'product',
    headline: '',
    subheadline: '',
    city: '',
    state: '',
    date: new Date().toISOString().split('T')[0],
    leadParagraph: '',
    body: '',
    quote: '',
    quoteName: '',
    quoteTitle: '',
    boilerplate: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
  })

  const releaseTypes = [
    { id: 'product', name: 'Product Launch' },
    { id: 'funding', name: 'Funding Announcement' },
    { id: 'partnership', name: 'Partnership' },
    { id: 'event', name: 'Event' },
    { id: 'award', name: 'Award/Recognition' },
    { id: 'executive', name: 'Executive Hire' },
    { id: 'milestone', name: 'Company Milestone' },
    { id: 'general', name: 'General News' },
  ]

  const generatePressRelease = (): string => {
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    }

    let doc = `FOR IMMEDIATE RELEASE\n\n`
    doc += `${release.headline || '[HEADLINE]'}\n`
    if (release.subheadline) doc += `${release.subheadline}\n`
    doc += '\n'

    const location = [release.city, release.state].filter(Boolean).join(', ')
    doc += `${location || '[CITY, STATE]'} – ${formatDate(release.date)} – `
    doc += `${release.leadParagraph || '[Lead paragraph summarizing the news...]'}\n\n`

    if (release.body) {
      doc += `${release.body}\n\n`
    }

    if (release.quote) {
      doc += `"${release.quote}"\n`
      if (release.quoteName) {
        doc += `– ${release.quoteName}`
        if (release.quoteTitle) doc += `, ${release.quoteTitle}`
        doc += '\n'
      }
      doc += '\n'
    }

    if (release.boilerplate) {
      doc += `About ${release.boilerplate.split(' ')[0] || '[Company Name]'}\n`
      doc += `${release.boilerplate}\n\n`
    }

    doc += `###\n\n`

    doc += `MEDIA CONTACT:\n`
    doc += `${release.contactName || '[Contact Name]'}\n`
    if (release.contactEmail) doc += `Email: ${release.contactEmail}\n`
    if (release.contactPhone) doc += `Phone: ${release.contactPhone}\n`
    if (release.website) doc += `Website: ${release.website}\n`

    return doc
  }

  const copyRelease = () => {
    navigator.clipboard.writeText(generatePressRelease())
  }

  const wordCount = (release.leadParagraph + ' ' + release.body).split(/\s+/).filter(Boolean).length

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.pressRelease.type')}</h3>
        <div className="flex flex-wrap gap-2">
          {releaseTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setRelease({ ...release, type: type.id })}
              className={`px-3 py-2 rounded text-sm ${release.type === type.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.pressRelease.headline')}</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={release.headline}
            onChange={(e) => setRelease({ ...release, headline: e.target.value })}
            placeholder="Main Headline (compelling, newsworthy)"
            className="w-full px-3 py-2 border border-slate-300 rounded font-medium"
          />
          <input
            type="text"
            value={release.subheadline}
            onChange={(e) => setRelease({ ...release, subheadline: e.target.value })}
            placeholder="Subheadline (optional, adds context)"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.pressRelease.dateline')}</h3>
        <div className="grid grid-cols-3 gap-3">
          <input
            type="text"
            value={release.city}
            onChange={(e) => setRelease({ ...release, city: e.target.value })}
            placeholder="City"
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            value={release.state}
            onChange={(e) => setRelease({ ...release, state: e.target.value })}
            placeholder="State/Country"
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="date"
            value={release.date}
            onChange={(e) => setRelease({ ...release, date: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.pressRelease.content')}</h3>
          <span className="text-sm text-slate-500">{wordCount} words</span>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">Lead Paragraph (Who, What, When, Where, Why)</label>
            <textarea
              value={release.leadParagraph}
              onChange={(e) => setRelease({ ...release, leadParagraph: e.target.value })}
              placeholder="Summarize the most important information..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Body (Supporting details, background)</label>
            <textarea
              value={release.body}
              onChange={(e) => setRelease({ ...release, body: e.target.value })}
              placeholder="Provide additional context, features, benefits..."
              rows={5}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.pressRelease.quote')}</h3>
        <div className="space-y-3">
          <textarea
            value={release.quote}
            onChange={(e) => setRelease({ ...release, quote: e.target.value })}
            placeholder="Quote from key spokesperson..."
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={release.quoteName}
              onChange={(e) => setRelease({ ...release, quoteName: e.target.value })}
              placeholder="Person's Name"
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={release.quoteTitle}
              onChange={(e) => setRelease({ ...release, quoteTitle: e.target.value })}
              placeholder="Title/Position"
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.pressRelease.boilerplate')}</h3>
        <textarea
          value={release.boilerplate}
          onChange={(e) => setRelease({ ...release, boilerplate: e.target.value })}
          placeholder="Company description (standard 'About' paragraph used in all press releases)..."
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.pressRelease.contact')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={release.contactName}
            onChange={(e) => setRelease({ ...release, contactName: e.target.value })}
            placeholder="Contact Name"
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="email"
            value={release.contactEmail}
            onChange={(e) => setRelease({ ...release, contactEmail: e.target.value })}
            placeholder="Email"
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="tel"
            value={release.contactPhone}
            onChange={(e) => setRelease({ ...release, contactPhone: e.target.value })}
            placeholder="Phone"
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            value={release.website}
            onChange={(e) => setRelease({ ...release, website: e.target.value })}
            placeholder="Website"
            className="px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.pressRelease.preview')}</h4>
        <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono bg-white p-4 rounded border border-slate-200 max-h-64 overflow-y-auto">
          {generatePressRelease()}
        </pre>
      </div>

      <button
        onClick={copyRelease}
        className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
      >
        {t('tools.pressRelease.copy')}
      </button>
    </div>
  )
}
