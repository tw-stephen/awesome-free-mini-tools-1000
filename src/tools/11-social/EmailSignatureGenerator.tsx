import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function EmailSignatureGenerator() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [twitter, setTwitter] = useState('')
  const [template, setTemplate] = useState<'simple' | 'professional' | 'modern' | 'minimal'>('professional')
  const [primaryColor, setPrimaryColor] = useState('#2563eb')
  const [copied, setCopied] = useState(false)

  const generateSignature = () => {
    const styles = {
      simple: `
        <table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif;">
          <tr>
            <td style="padding: 10px 0;">
              <p style="margin: 0; font-size: 16px; font-weight: bold; color: #333;">${name}</p>
              ${title ? `<p style="margin: 4px 0 0 0; font-size: 14px; color: #666;">${title}</p>` : ''}
              ${company ? `<p style="margin: 2px 0 0 0; font-size: 14px; color: #666;">${company}</p>` : ''}
              <p style="margin: 10px 0 0 0; font-size: 13px; color: #666;">
                ${email ? `<a href="mailto:${email}" style="color: ${primaryColor}; text-decoration: none;">${email}</a>` : ''}
                ${phone ? `<br/>${phone}` : ''}
              </p>
            </td>
          </tr>
        </table>
      `,
      professional: `
        <table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif;">
          <tr>
            <td style="border-left: 3px solid ${primaryColor}; padding-left: 12px;">
              <p style="margin: 0; font-size: 18px; font-weight: bold; color: ${primaryColor};">${name}</p>
              ${title ? `<p style="margin: 4px 0 0 0; font-size: 14px; color: #333;">${title}${company ? ` | ${company}` : ''}</p>` : ''}
              <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 10px;">
                ${email ? `<tr><td style="font-size: 13px; color: #666; padding: 2px 0;"><a href="mailto:${email}" style="color: ${primaryColor}; text-decoration: none;">${email}</a></td></tr>` : ''}
                ${phone ? `<tr><td style="font-size: 13px; color: #666; padding: 2px 0;">${phone}</td></tr>` : ''}
                ${website ? `<tr><td style="font-size: 13px; padding: 2px 0;"><a href="${website}" style="color: ${primaryColor}; text-decoration: none;">${website}</a></td></tr>` : ''}
              </table>
              ${linkedin || twitter ? `
                <p style="margin: 10px 0 0 0;">
                  ${linkedin ? `<a href="${linkedin}" style="color: ${primaryColor}; text-decoration: none; font-size: 13px;">LinkedIn</a>` : ''}
                  ${linkedin && twitter ? ' | ' : ''}
                  ${twitter ? `<a href="https://twitter.com/${twitter.replace('@', '')}" style="color: ${primaryColor}; text-decoration: none; font-size: 13px;">Twitter</a>` : ''}
                </p>
              ` : ''}
            </td>
          </tr>
        </table>
      `,
      modern: `
        <table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, ${primaryColor}10, ${primaryColor}05); padding: 15px; border-radius: 8px;">
          <tr>
            <td>
              <p style="margin: 0; font-size: 20px; font-weight: 600; color: ${primaryColor};">${name}</p>
              ${title ? `<p style="margin: 5px 0 0 0; font-size: 14px; color: #555;">${title}</p>` : ''}
              ${company ? `<p style="margin: 2px 0 0 0; font-size: 14px; color: #777;">${company}</p>` : ''}
              <hr style="border: none; border-top: 1px solid ${primaryColor}33; margin: 12px 0;"/>
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  ${email ? `<td style="padding-right: 15px;"><a href="mailto:${email}" style="color: ${primaryColor}; text-decoration: none; font-size: 13px;">${email}</a></td>` : ''}
                  ${phone ? `<td style="padding-right: 15px;"><span style="color: #555; font-size: 13px;">${phone}</span></td>` : ''}
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `,
      minimal: `
        <p style="font-family: Arial, sans-serif; margin: 0; font-size: 14px; color: #333;">
          <strong>${name}</strong>${title ? ` — ${title}` : ''}${company ? ` @ ${company}` : ''}<br/>
          ${email ? `<a href="mailto:${email}" style="color: ${primaryColor};">${email}</a>` : ''}
          ${phone ? ` | ${phone}` : ''}
        </p>
      `
    }

    return styles[template].trim().replace(/\s+/g, ' ')
  }

  const copyHtml = () => {
    navigator.clipboard.writeText(generateSignature())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.emailSignatureGenerator.name')} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.emailSignatureGenerator.title')}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Software Engineer"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">
            {t('tools.emailSignatureGenerator.company')}
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme Inc."
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.emailSignatureGenerator.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@acme.com"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.emailSignatureGenerator.phone')}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 234 567 8900"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">
            {t('tools.emailSignatureGenerator.website')}
          </label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://acme.com"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">LinkedIn</label>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Twitter</label>
            <input
              type="text"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="@username"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.emailSignatureGenerator.template')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['simple', 'professional', 'modern', 'minimal'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTemplate(t)}
              className={`px-3 py-1.5 rounded text-sm capitalize ${
                template === t ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-3">
          <label className="block text-xs text-slate-500 mb-1">
            {t('tools.emailSignatureGenerator.color')}
          </label>
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="w-20 h-8 rounded cursor-pointer"
          />
        </div>
      </div>

      {name && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.emailSignatureGenerator.preview')}
          </h3>
          <div
            className="p-4 bg-white border border-slate-200 rounded"
            dangerouslySetInnerHTML={{ __html: generateSignature() }}
          />
        </div>
      )}

      <button
        onClick={copyHtml}
        disabled={!name}
        className="w-full py-3 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
      >
        {copied ? t('tools.emailSignatureGenerator.copied') : t('tools.emailSignatureGenerator.copyHtml')}
      </button>

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium text-slate-700 mb-2">{t('tools.emailSignatureGenerator.howToUse')}</h3>
        <ol className="text-sm text-slate-600 space-y-1 list-decimal list-inside">
          <li>{t('tools.emailSignatureGenerator.step1')}</li>
          <li>{t('tools.emailSignatureGenerator.step2')}</li>
          <li>{t('tools.emailSignatureGenerator.step3')}</li>
        </ol>
      </div>
    </div>
  )
}
