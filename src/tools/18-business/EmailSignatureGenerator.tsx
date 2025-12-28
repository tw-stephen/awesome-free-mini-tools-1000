import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function EmailSignatureGenerator() {
  const { t } = useTranslation()
  const [signature, setSignature] = useState({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    website: '',
    linkedin: '',
    twitter: '',
    address: '',
    pronouns: '',
    tagline: '',
  })
  const [style, setStyle] = useState({
    layout: 'vertical',
    primaryColor: '#2563eb',
    fontSize: 14,
    fontFamily: 'Arial, sans-serif',
    showDivider: true,
  })

  const generateHTML = (): string => {
    const { name, title, company, email, phone, website, linkedin, twitter, address, pronouns, tagline } = signature
    const { primaryColor, fontSize, fontFamily, showDivider, layout } = style

    const isHorizontal = layout === 'horizontal'
    const divider = showDivider ? `<tr><td colspan="2" style="border-top: 2px solid ${primaryColor}; padding-top: 10px; margin-top: 10px;"></td></tr>` : ''

    let html = `<table cellpadding="0" cellspacing="0" border="0" style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: #333;">`

    if (isHorizontal) {
      html += `<tr><td style="vertical-align: top; padding-right: 15px; border-right: 2px solid ${primaryColor};">`
      html += `<strong style="font-size: ${fontSize + 2}px; color: ${primaryColor};">${name || 'Your Name'}</strong>`
      if (pronouns) html += `<span style="color: #666; font-size: ${fontSize - 2}px;"> (${pronouns})</span>`
      html += `<br><span style="color: #666;">${title || 'Title'}${company ? ` | ${company}` : ''}</span></td>`
      html += `<td style="vertical-align: top; padding-left: 15px;">`
    } else {
      html += `<tr><td><strong style="font-size: ${fontSize + 2}px; color: ${primaryColor};">${name || 'Your Name'}</strong>`
      if (pronouns) html += `<span style="color: #666; font-size: ${fontSize - 2}px;"> (${pronouns})</span>`
      html += `</td></tr>`
      html += `<tr><td style="color: #666;">${title || 'Title'}${company ? ` | ${company}` : ''}</td></tr>`
      html += divider
      html += `<tr><td>`
    }

    const contacts = []
    if (email) contacts.push(`<a href="mailto:${email}" style="color: ${primaryColor}; text-decoration: none;">📧 ${email}</a>`)
    if (phone) contacts.push(`<a href="tel:${phone}" style="color: ${primaryColor}; text-decoration: none;">📱 ${phone}</a>`)
    if (website) contacts.push(`<a href="${website.startsWith('http') ? website : 'https://' + website}" style="color: ${primaryColor}; text-decoration: none;">🌐 ${website.replace(/^https?:\/\//, '')}</a>`)

    html += contacts.join(isHorizontal ? '<br>' : ' | ')

    const socials = []
    if (linkedin) socials.push(`<a href="${linkedin.startsWith('http') ? linkedin : 'https://linkedin.com/in/' + linkedin}" style="color: ${primaryColor}; text-decoration: none;">LinkedIn</a>`)
    if (twitter) socials.push(`<a href="${twitter.startsWith('http') ? twitter : 'https://twitter.com/' + twitter}" style="color: ${primaryColor}; text-decoration: none;">Twitter</a>`)

    if (socials.length > 0) {
      html += `<br>${socials.join(' | ')}`
    }

    if (address) html += `<br><span style="color: #666;">📍 ${address}</span>`
    if (tagline) html += `<br><em style="color: #888; font-size: ${fontSize - 2}px;">${tagline}</em>`

    html += `</td></tr></table>`

    return html
  }

  const copyHTML = () => {
    navigator.clipboard.writeText(generateHTML())
  }

  const copyText = () => {
    const { name, title, company, email, phone, website, pronouns, tagline } = signature
    let text = `${name}${pronouns ? ` (${pronouns})` : ''}\n`
    text += `${title}${company ? ` | ${company}` : ''}\n`
    if (email) text += `Email: ${email}\n`
    if (phone) text += `Phone: ${phone}\n`
    if (website) text += `Web: ${website}\n`
    if (tagline) text += `\n"${tagline}"`
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.emailSignatureGenerator.info')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <input type="text" value={signature.name} onChange={(e) => setSignature({ ...signature, name: e.target.value })} placeholder="Full Name" className="px-3 py-2 border border-slate-300 rounded" />
          <input type="text" value={signature.pronouns} onChange={(e) => setSignature({ ...signature, pronouns: e.target.value })} placeholder="Pronouns (optional)" className="px-3 py-2 border border-slate-300 rounded" />
          <input type="text" value={signature.title} onChange={(e) => setSignature({ ...signature, title: e.target.value })} placeholder="Job Title" className="px-3 py-2 border border-slate-300 rounded" />
          <input type="text" value={signature.company} onChange={(e) => setSignature({ ...signature, company: e.target.value })} placeholder="Company" className="px-3 py-2 border border-slate-300 rounded" />
          <input type="email" value={signature.email} onChange={(e) => setSignature({ ...signature, email: e.target.value })} placeholder="Email" className="px-3 py-2 border border-slate-300 rounded" />
          <input type="tel" value={signature.phone} onChange={(e) => setSignature({ ...signature, phone: e.target.value })} placeholder="Phone" className="px-3 py-2 border border-slate-300 rounded" />
          <input type="text" value={signature.website} onChange={(e) => setSignature({ ...signature, website: e.target.value })} placeholder="Website" className="px-3 py-2 border border-slate-300 rounded" />
          <input type="text" value={signature.address} onChange={(e) => setSignature({ ...signature, address: e.target.value })} placeholder="Address (optional)" className="px-3 py-2 border border-slate-300 rounded" />
          <input type="text" value={signature.linkedin} onChange={(e) => setSignature({ ...signature, linkedin: e.target.value })} placeholder="LinkedIn URL or username" className="px-3 py-2 border border-slate-300 rounded" />
          <input type="text" value={signature.twitter} onChange={(e) => setSignature({ ...signature, twitter: e.target.value })} placeholder="Twitter handle" className="px-3 py-2 border border-slate-300 rounded" />
        </div>
        <input type="text" value={signature.tagline} onChange={(e) => setSignature({ ...signature, tagline: e.target.value })} placeholder="Tagline or quote (optional)" className="w-full mt-3 px-3 py-2 border border-slate-300 rounded" />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.emailSignatureGenerator.style')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-500">Layout</label>
            <select value={style.layout} onChange={(e) => setStyle({ ...style, layout: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded">
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-500">Primary Color</label>
            <input type="color" value={style.primaryColor} onChange={(e) => setStyle({ ...style, primaryColor: e.target.value })} className="w-full h-10 border border-slate-300 rounded cursor-pointer" />
          </div>
          <div>
            <label className="text-sm text-slate-500">Font Size</label>
            <input type="range" value={style.fontSize} onChange={(e) => setStyle({ ...style, fontSize: Number(e.target.value) })} min="12" max="18" className="w-full" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={style.showDivider} onChange={(e) => setStyle({ ...style, showDivider: e.target.checked })} className="rounded" />
            <label className="text-sm">Show divider line</label>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.emailSignatureGenerator.preview')}</h3>
        <div className="p-4 bg-white border border-slate-200 rounded" dangerouslySetInnerHTML={{ __html: generateHTML() }} />
      </div>

      <div className="flex gap-2">
        <button onClick={copyHTML} className="flex-1 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
          Copy HTML
        </button>
        <button onClick={copyText} className="flex-1 py-3 bg-slate-200 rounded hover:bg-slate-300 font-medium">
          Copy Plain Text
        </button>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.emailSignatureGenerator.howto')}</h4>
        <ol className="text-sm text-slate-600 space-y-1 list-decimal list-inside">
          <li>Fill in your information and customize the style</li>
          <li>Click "Copy HTML" to copy the signature</li>
          <li>Paste in your email client's signature settings</li>
        </ol>
      </div>
    </div>
  )
}
