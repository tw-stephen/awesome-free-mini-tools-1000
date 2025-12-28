import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Feature {
  id: number
  title: string
  description: string
  category: 'feature' | 'improvement' | 'bugfix'
}

export default function ReleaseNotesBuilder() {
  const { t } = useTranslation()
  const [productName, setProductName] = useState('')
  const [version, setVersion] = useState('')
  const [releaseDate, setReleaseDate] = useState(new Date().toISOString().split('T')[0])
  const [headline, setHeadline] = useState('')
  const [features, setFeatures] = useState<Feature[]>([])
  const [knownIssues, setKnownIssues] = useState('')
  const [upgradeNotes, setUpgradeNotes] = useState('')
  const [format, setFormat] = useState<'technical' | 'marketing' | 'internal'>('marketing')

  const addFeature = () => {
    setFeatures([...features, {
      id: Date.now(),
      title: '',
      description: '',
      category: 'feature'
    }])
  }

  const updateFeature = (id: number, field: keyof Feature, value: string) => {
    setFeatures(features.map(f => f.id === id ? { ...f, [field]: value } : f))
  }

  const removeFeature = (id: number) => {
    setFeatures(features.filter(f => f.id !== id))
  }

  const categoryLabels: Record<string, { label: string; color: string; emoji: string }> = {
    'feature': { label: 'New Feature', color: 'bg-green-100 text-green-700', emoji: '✨' },
    'improvement': { label: 'Improvement', color: 'bg-blue-100 text-blue-700', emoji: '⚡' },
    'bugfix': { label: 'Bug Fix', color: 'bg-purple-100 text-purple-700', emoji: '🐛' },
  }

  const generateNotes = (): string => {
    const product = productName || '[Product Name]'
    const ver = version || '[Version]'

    if (format === 'marketing') {
      let text = `🎉 ${product} ${ver} is here!\\n\\n`
      text += `${headline || 'We are excited to announce our latest release!'}\\n\\n`

      const newFeatures = features.filter(f => f.category === 'feature' && f.title)
      const improvements = features.filter(f => f.category === 'improvement' && f.title)
      const bugfixes = features.filter(f => f.category === 'bugfix' && f.title)

      if (newFeatures.length > 0) {
        text += `✨ What's New\\n${'─'.repeat(30)}\\n`
        newFeatures.forEach(f => {
          text += `• ${f.title}\\n`
          if (f.description) text += `  ${f.description}\\n`
        })
        text += '\\n'
      }

      if (improvements.length > 0) {
        text += `⚡ Improvements\\n${'─'.repeat(30)}\\n`
        improvements.forEach(f => {
          text += `• ${f.title}\\n`
        })
        text += '\\n'
      }

      if (bugfixes.length > 0) {
        text += `🐛 Bug Fixes\\n${'─'.repeat(30)}\\n`
        bugfixes.forEach(f => {
          text += `• ${f.title}\\n`
        })
        text += '\\n'
      }

      text += `\\nDownload now and enjoy the new features! 🚀`
      return text
    }

    if (format === 'technical') {
      let text = `RELEASE NOTES\\n${'='.repeat(50)}\\n\\n`
      text += `Product: ${product}\\n`
      text += `Version: ${ver}\\n`
      text += `Release Date: ${releaseDate}\\n\\n`

      features.forEach(f => {
        if (f.title) {
          text += `[${categoryLabels[f.category].label.toUpperCase()}] ${f.title}\\n`
          if (f.description) text += `  Description: ${f.description}\\n`
          text += '\\n'
        }
      })

      if (knownIssues) {
        text += `KNOWN ISSUES\\n${'─'.repeat(30)}\\n${knownIssues}\\n\\n`
      }

      if (upgradeNotes) {
        text += `UPGRADE NOTES\\n${'─'.repeat(30)}\\n${upgradeNotes}\\n`
      }

      return text
    }

    // Internal format
    let text = `INTERNAL RELEASE NOTES\\n${'='.repeat(50)}\\n\\n`
    text += `Product: ${product} | Version: ${ver} | Date: ${releaseDate}\\n\\n`

    text += `Summary: ${headline || 'No headline provided'}\\n\\n`

    text += `Changes (${features.length} items):\\n${'─'.repeat(30)}\\n`
    features.forEach((f, i) => {
      if (f.title) {
        text += `${i + 1}. [${f.category.toUpperCase()}] ${f.title}\\n`
        if (f.description) text += `   ${f.description}\\n`
      }
    })

    if (knownIssues) text += `\\nKnown Issues:\\n${knownIssues}\\n`
    if (upgradeNotes) text += `\\nUpgrade Notes:\\n${upgradeNotes}\\n`

    return text
  }

  const copyNotes = () => {
    navigator.clipboard.writeText(generateNotes())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.releaseNotesBuilder.product')}</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Product name"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.releaseNotesBuilder.version')}</label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="e.g., 2.0.0"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.releaseNotesBuilder.date')}</label>
            <input
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-1">{t('tools.releaseNotesBuilder.headline')}</label>
        <input
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="Main headline for this release..."
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.releaseNotesBuilder.format')}</h3>
        <div className="flex gap-2">
          {(['marketing', 'technical', 'internal'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`flex-1 py-2 rounded capitalize ${
                format === f ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.releaseNotesBuilder.features')}</h3>
          <button
            onClick={addFeature}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            + Add Item
          </button>
        </div>
        <div className="space-y-3">
          {features.length === 0 ? (
            <p className="text-slate-500 text-center py-4">No items yet. Add your first feature or fix!</p>
          ) : (
            features.map((feature) => (
              <div key={feature.id} className="p-3 bg-slate-50 rounded">
                <div className="flex gap-2 mb-2">
                  <select
                    value={feature.category}
                    onChange={(e) => updateFeature(feature.id, 'category', e.target.value)}
                    className={`px-3 py-2 rounded ${categoryLabels[feature.category].color}`}
                  >
                    {Object.entries(categoryLabels).map(([cat, { label, emoji }]) => (
                      <option key={cat} value={cat}>{emoji} {label}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={feature.title}
                    onChange={(e) => updateFeature(feature.id, 'title', e.target.value)}
                    placeholder="Title"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded"
                  />
                  <button
                    onClick={() => removeFeature(feature.id)}
                    className="px-2 text-red-500"
                  >
                    ✕
                  </button>
                </div>
                <textarea
                  value={feature.description}
                  onChange={(e) => updateFeature(feature.id, 'description', e.target.value)}
                  placeholder="Description (optional)"
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded resize-none text-sm"
                />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card p-4 space-y-4">
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.releaseNotesBuilder.knownIssues')}</label>
          <textarea
            value={knownIssues}
            onChange={(e) => setKnownIssues(e.target.value)}
            placeholder="List any known issues..."
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.releaseNotesBuilder.upgradeNotes')}</label>
          <textarea
            value={upgradeNotes}
            onChange={(e) => setUpgradeNotes(e.target.value)}
            placeholder="Upgrade instructions or breaking changes..."
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.releaseNotesBuilder.preview')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
          {generateNotes()}
        </pre>
        <button
          onClick={copyNotes}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.releaseNotesBuilder.copy')}
        </button>
      </div>
    </div>
  )
}
