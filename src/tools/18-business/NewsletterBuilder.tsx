import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Section {
  id: number
  type: 'header' | 'text' | 'article' | 'cta' | 'divider' | 'footer'
  content: {
    title?: string
    body?: string
    link?: string
    buttonText?: string
  }
}

export default function NewsletterBuilder() {
  const { t } = useTranslation()
  const [newsletter, setNewsletter] = useState({
    name: '',
    subject: '',
    preheader: '',
    date: new Date().toISOString().split('T')[0],
  })

  const [sections, setSections] = useState<Section[]>([
    { id: 1, type: 'header', content: { title: '', body: '' } },
    { id: 2, type: 'text', content: { body: '' } },
    { id: 3, type: 'footer', content: { body: '' } },
  ])

  const sectionTypes = [
    { id: 'header', name: 'Header', icon: '📰' },
    { id: 'text', name: 'Text Block', icon: '📝' },
    { id: 'article', name: 'Article', icon: '📄' },
    { id: 'cta', name: 'Call to Action', icon: '🔘' },
    { id: 'divider', name: 'Divider', icon: '—' },
    { id: 'footer', name: 'Footer', icon: '📋' },
  ]

  const addSection = (type: Section['type']) => {
    setSections([...sections, { id: Date.now(), type, content: {} }])
  }

  const updateSection = (id: number, content: Section['content']) => {
    setSections(sections.map(s => s.id === id ? { ...s, content } : s))
  }

  const removeSection = (id: number) => {
    setSections(sections.filter(s => s.id !== id))
  }

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= sections.length) return
    const newSections = [...sections]
    ;[newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]]
    setSections(newSections)
  }

  const generateNewsletter = (): string => {
    let doc = ''

    sections.forEach(section => {
      switch (section.type) {
        case 'header':
          doc += `${'═'.repeat(50)}\n`
          doc += `${section.content.title || newsletter.name || '[Newsletter Name]'}\n`
          doc += `${newsletter.date}\n`
          doc += `${'═'.repeat(50)}\n\n`
          if (section.content.body) doc += `${section.content.body}\n\n`
          break
        case 'text':
          if (section.content.body) {
            doc += `${section.content.body}\n\n`
          }
          break
        case 'article':
          if (section.content.title) {
            doc += `▸ ${section.content.title}\n`
            doc += `${'─'.repeat(40)}\n`
          }
          if (section.content.body) doc += `${section.content.body}\n`
          if (section.content.link) doc += `Read more: ${section.content.link}\n`
          doc += '\n'
          break
        case 'cta':
          doc += `┌${'─'.repeat(48)}┐\n`
          doc += `│  ${(section.content.title || 'Take Action').padEnd(46)}│\n`
          if (section.content.body) {
            doc += `│  ${section.content.body.substring(0, 46).padEnd(46)}│\n`
          }
          doc += `│  [${(section.content.buttonText || 'Click Here').padEnd(44)}]│\n`
          doc += `└${'─'.repeat(48)}┘\n\n`
          break
        case 'divider':
          doc += `${'─'.repeat(50)}\n\n`
          break
        case 'footer':
          doc += `${'─'.repeat(50)}\n`
          doc += `${section.content.body || '[Unsubscribe] | [Preferences] | [View in Browser]'}\n`
          break
      }
    })

    return doc
  }

  const generateHTML = (): string => {
    let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${newsletter.subject || newsletter.name}</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
`

    sections.forEach(section => {
      switch (section.type) {
        case 'header':
          html += `<div style="text-align: center; padding: 20px; background: #f8f9fa; border-bottom: 3px solid #007bff;">
  <h1 style="margin: 0; color: #333;">${section.content.title || newsletter.name || 'Newsletter'}</h1>
  <p style="color: #666; margin: 10px 0 0;">${newsletter.date}</p>
  ${section.content.body ? `<p style="margin: 15px 0 0;">${section.content.body}</p>` : ''}
</div>\n`
          break
        case 'text':
          html += `<div style="padding: 20px;">
  <p style="line-height: 1.6; color: #333;">${section.content.body || ''}</p>
</div>\n`
          break
        case 'article':
          html += `<div style="padding: 20px; border-bottom: 1px solid #eee;">
  ${section.content.title ? `<h2 style="color: #333; margin: 0 0 10px;">${section.content.title}</h2>` : ''}
  ${section.content.body ? `<p style="color: #666; line-height: 1.6;">${section.content.body}</p>` : ''}
  ${section.content.link ? `<a href="${section.content.link}" style="color: #007bff;">Read more →</a>` : ''}
</div>\n`
          break
        case 'cta':
          html += `<div style="text-align: center; padding: 30px; background: #f8f9fa;">
  ${section.content.title ? `<h3 style="margin: 0 0 10px;">${section.content.title}</h3>` : ''}
  ${section.content.body ? `<p style="color: #666; margin: 0 0 20px;">${section.content.body}</p>` : ''}
  <a href="${section.content.link || '#'}" style="display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">${section.content.buttonText || 'Click Here'}</a>
</div>\n`
          break
        case 'divider':
          html += `<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">\n`
          break
        case 'footer':
          html += `<div style="text-align: center; padding: 20px; background: #f8f9fa; color: #666; font-size: 12px;">
  ${section.content.body || '<a href="#">Unsubscribe</a> | <a href="#">Preferences</a> | <a href="#">View in Browser</a>'}
</div>\n`
          break
      }
    })

    html += `</body>
</html>`
    return html
  }

  const copyText = () => {
    navigator.clipboard.writeText(generateNewsletter())
  }

  const copyHTML = () => {
    navigator.clipboard.writeText(generateHTML())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.newsletterBuilder.details')}</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={newsletter.name}
            onChange={(e) => setNewsletter({ ...newsletter, name: e.target.value })}
            placeholder="Newsletter Name"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={newsletter.subject}
              onChange={(e) => setNewsletter({ ...newsletter, subject: e.target.value })}
              placeholder="Email Subject Line"
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="date"
              value={newsletter.date}
              onChange={(e) => setNewsletter({ ...newsletter, date: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <input
            type="text"
            value={newsletter.preheader}
            onChange={(e) => setNewsletter({ ...newsletter, preheader: e.target.value })}
            placeholder="Preheader text (shows in email preview)"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.newsletterBuilder.addSection')}</h3>
        <div className="flex flex-wrap gap-2">
          {sectionTypes.map(type => (
            <button
              key={type.id}
              onClick={() => addSection(type.id as Section['type'])}
              className="px-3 py-2 bg-slate-100 rounded hover:bg-slate-200 text-sm"
            >
              {type.icon} {type.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {sections.map((section, index) => {
          const sectionType = sectionTypes.find(t => t.id === section.type)
          return (
            <div key={section.id} className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">{sectionType?.icon} {sectionType?.name}</span>
                <div className="flex gap-1">
                  <button onClick={() => moveSection(index, 'up')} disabled={index === 0} className="px-2 py-1 text-slate-400 hover:text-slate-600 disabled:opacity-30">↑</button>
                  <button onClick={() => moveSection(index, 'down')} disabled={index === sections.length - 1} className="px-2 py-1 text-slate-400 hover:text-slate-600 disabled:opacity-30">↓</button>
                  <button onClick={() => removeSection(section.id)} className="px-2 py-1 text-red-400 hover:text-red-600">×</button>
                </div>
              </div>
              {section.type === 'header' && (
                <div className="space-y-2">
                  <input type="text" value={section.content.title || ''} onChange={(e) => updateSection(section.id, { ...section.content, title: e.target.value })} placeholder="Header Title" className="w-full px-3 py-2 border border-slate-300 rounded" />
                  <textarea value={section.content.body || ''} onChange={(e) => updateSection(section.id, { ...section.content, body: e.target.value })} placeholder="Introduction text" rows={2} className="w-full px-3 py-2 border border-slate-300 rounded resize-none" />
                </div>
              )}
              {section.type === 'text' && (
                <textarea value={section.content.body || ''} onChange={(e) => updateSection(section.id, { ...section.content, body: e.target.value })} placeholder="Text content..." rows={3} className="w-full px-3 py-2 border border-slate-300 rounded resize-none" />
              )}
              {section.type === 'article' && (
                <div className="space-y-2">
                  <input type="text" value={section.content.title || ''} onChange={(e) => updateSection(section.id, { ...section.content, title: e.target.value })} placeholder="Article Title" className="w-full px-3 py-2 border border-slate-300 rounded" />
                  <textarea value={section.content.body || ''} onChange={(e) => updateSection(section.id, { ...section.content, body: e.target.value })} placeholder="Article summary..." rows={2} className="w-full px-3 py-2 border border-slate-300 rounded resize-none" />
                  <input type="text" value={section.content.link || ''} onChange={(e) => updateSection(section.id, { ...section.content, link: e.target.value })} placeholder="Read more URL" className="w-full px-3 py-2 border border-slate-300 rounded" />
                </div>
              )}
              {section.type === 'cta' && (
                <div className="space-y-2">
                  <input type="text" value={section.content.title || ''} onChange={(e) => updateSection(section.id, { ...section.content, title: e.target.value })} placeholder="CTA Headline" className="w-full px-3 py-2 border border-slate-300 rounded" />
                  <input type="text" value={section.content.body || ''} onChange={(e) => updateSection(section.id, { ...section.content, body: e.target.value })} placeholder="Supporting text" className="w-full px-3 py-2 border border-slate-300 rounded" />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={section.content.buttonText || ''} onChange={(e) => updateSection(section.id, { ...section.content, buttonText: e.target.value })} placeholder="Button Text" className="px-3 py-2 border border-slate-300 rounded" />
                    <input type="text" value={section.content.link || ''} onChange={(e) => updateSection(section.id, { ...section.content, link: e.target.value })} placeholder="Button URL" className="px-3 py-2 border border-slate-300 rounded" />
                  </div>
                </div>
              )}
              {section.type === 'footer' && (
                <textarea value={section.content.body || ''} onChange={(e) => updateSection(section.id, { ...section.content, body: e.target.value })} placeholder="Footer content (unsubscribe links, etc.)" rows={2} className="w-full px-3 py-2 border border-slate-300 rounded resize-none" />
              )}
              {section.type === 'divider' && (
                <div className="py-2 border-t border-slate-300 text-center text-slate-400 text-sm">Divider</div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex gap-2">
        <button onClick={copyText} className="flex-1 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
          Copy Text
        </button>
        <button onClick={copyHTML} className="flex-1 py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium">
          Copy HTML
        </button>
      </div>
    </div>
  )
}
