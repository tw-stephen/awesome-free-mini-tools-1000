import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ColorPalette {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

export default function BrandingKit() {
  const { t } = useTranslation()
  const [brand, setBrand] = useState({
    name: '',
    tagline: '',
    mission: '',
    values: '',
    tone: 'professional',
    industry: '',
  })

  const [colors, setColors] = useState<ColorPalette>({
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#f59e0b',
    background: '#ffffff',
    text: '#1e293b',
  })

  const [fonts, setFonts] = useState({
    heading: 'Inter',
    body: 'Open Sans',
  })

  const toneOptions = [
    { id: 'professional', name: 'Professional' },
    { id: 'friendly', name: 'Friendly' },
    { id: 'bold', name: 'Bold & Edgy' },
    { id: 'elegant', name: 'Elegant' },
    { id: 'playful', name: 'Playful' },
    { id: 'minimal', name: 'Minimal' },
  ]

  const fontOptions = [
    'Inter', 'Open Sans', 'Roboto', 'Lato', 'Poppins', 'Montserrat',
    'Playfair Display', 'Merriweather', 'Raleway', 'Oswald', 'Work Sans'
  ]

  const generateGuidelines = (): string => {
    let doc = `${'═'.repeat(60)}\n`
    doc += `BRAND GUIDELINES\n`
    doc += `${brand.name || '[Brand Name]'}\n`
    doc += `${'═'.repeat(60)}\n\n`

    doc += `BRAND IDENTITY\n${'─'.repeat(40)}\n`
    doc += `Name: ${brand.name || '[Brand Name]'}\n`
    doc += `Tagline: ${brand.tagline || '[Tagline]'}\n`
    doc += `Industry: ${brand.industry || '[Industry]'}\n\n`

    if (brand.mission) {
      doc += `MISSION STATEMENT\n${'─'.repeat(40)}\n`
      doc += `${brand.mission}\n\n`
    }

    if (brand.values) {
      doc += `CORE VALUES\n${'─'.repeat(40)}\n`
      doc += `${brand.values}\n\n`
    }

    doc += `BRAND VOICE & TONE\n${'─'.repeat(40)}\n`
    doc += `Primary Tone: ${toneOptions.find(t => t.id === brand.tone)?.name}\n\n`

    doc += `COLOR PALETTE\n${'─'.repeat(40)}\n`
    doc += `Primary: ${colors.primary}\n`
    doc += `Secondary: ${colors.secondary}\n`
    doc += `Accent: ${colors.accent}\n`
    doc += `Background: ${colors.background}\n`
    doc += `Text: ${colors.text}\n\n`

    doc += `TYPOGRAPHY\n${'─'.repeat(40)}\n`
    doc += `Headings: ${fonts.heading}\n`
    doc += `Body Text: ${fonts.body}\n\n`

    doc += `${'═'.repeat(60)}\n`
    doc += `Generated ${new Date().toLocaleDateString()}\n`

    return doc
  }

  const copyGuidelines = () => {
    navigator.clipboard.writeText(generateGuidelines())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.brandingKit.identity')}</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={brand.name}
              onChange={(e) => setBrand({ ...brand, name: e.target.value })}
              placeholder="Brand Name"
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="text"
              value={brand.industry}
              onChange={(e) => setBrand({ ...brand, industry: e.target.value })}
              placeholder="Industry"
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <input
            type="text"
            value={brand.tagline}
            onChange={(e) => setBrand({ ...brand, tagline: e.target.value })}
            placeholder="Tagline"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <textarea
            value={brand.mission}
            onChange={(e) => setBrand({ ...brand, mission: e.target.value })}
            placeholder="Mission Statement"
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <textarea
            value={brand.values}
            onChange={(e) => setBrand({ ...brand, values: e.target.value })}
            placeholder="Core Values (comma-separated)"
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.brandingKit.tone')}</h3>
        <div className="flex flex-wrap gap-2">
          {toneOptions.map(tone => (
            <button
              key={tone.id}
              onClick={() => setBrand({ ...brand, tone: tone.id })}
              className={`px-3 py-2 rounded text-sm ${brand.tone === tone.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
            >
              {tone.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.brandingKit.colors')}</h3>
        <div className="grid grid-cols-5 gap-3">
          {Object.entries(colors).map(([key, value]) => (
            <div key={key}>
              <label className="text-xs text-slate-500 capitalize block mb-1">{key}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={value}
                  onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                  className="flex-1 px-2 py-1 text-xs border border-slate-300 rounded font-mono"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.brandingKit.typography')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">Heading Font</label>
            <select
              value={fonts.heading}
              onChange={(e) => setFonts({ ...fonts, heading: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              {fontOptions.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Body Font</label>
            <select
              value={fonts.body}
              onChange={(e) => setFonts({ ...fonts, body: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              {fontOptions.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.brandingKit.preview')}</h3>
        <div className="p-4 rounded border" style={{ backgroundColor: colors.background }}>
          <h1 style={{ color: colors.primary, fontFamily: fonts.heading, fontSize: '24px', fontWeight: 'bold' }}>
            {brand.name || 'Brand Name'}
          </h1>
          <p style={{ color: colors.secondary, fontFamily: fonts.body, fontSize: '16px', marginTop: '8px' }}>
            {brand.tagline || 'Your tagline here'}
          </p>
          <button
            style={{
              backgroundColor: colors.primary,
              color: colors.background,
              padding: '8px 16px',
              borderRadius: '4px',
              marginTop: '16px',
              fontFamily: fonts.body,
            }}
          >
            Call to Action
          </button>
          <span
            style={{
              backgroundColor: colors.accent,
              color: colors.background,
              padding: '4px 8px',
              borderRadius: '4px',
              marginLeft: '8px',
              fontSize: '14px',
            }}
          >
            Accent
          </span>
        </div>
      </div>

      <button
        onClick={copyGuidelines}
        className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
      >
        {t('tools.brandingKit.export')}
      </button>
    </div>
  )
}
