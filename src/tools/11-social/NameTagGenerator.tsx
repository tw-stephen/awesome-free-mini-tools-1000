import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface NameTag {
  id: string
  name: string
  title: string
  company: string
}

export default function NameTagGenerator() {
  const { t } = useTranslation()
  const [tags, setTags] = useState<NameTag[]>([{ id: '1', name: '', title: '', company: '' }])
  const [template, setTemplate] = useState<'simple' | 'professional' | 'modern' | 'colorful'>('simple')
  const [primaryColor, setPrimaryColor] = useState('#3b82f6')
  const [showCompany, setShowCompany] = useState(true)
  const [showTitle, setShowTitle] = useState(true)
  const printRef = useRef<HTMLDivElement>(null)

  const addTag = () => {
    setTags([...tags, { id: Date.now().toString(), name: '', title: '', company: '' }])
  }

  const removeTag = (id: string) => {
    if (tags.length > 1) {
      setTags(tags.filter(t => t.id !== id))
    }
  }

  const updateTag = (id: string, field: keyof NameTag, value: string) => {
    setTags(tags.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  const bulkImport = () => {
    const text = prompt(t('tools.nameTagGenerator.bulkImportPrompt'))
    if (!text) return

    const lines = text.split('\n').filter(l => l.trim())
    const newTags = lines.map((line, index) => {
      const parts = line.split(',').map(p => p.trim())
      return {
        id: Date.now().toString() + index,
        name: parts[0] || '',
        title: parts[1] || '',
        company: parts[2] || ''
      }
    })

    if (newTags.length > 0) {
      setTags(newTags)
    }
  }

  const getTemplateStyles = (tag: NameTag) => {
    switch (template) {
      case 'simple':
        return (
          <div className="w-72 h-40 bg-white border-2 border-slate-300 rounded-lg flex flex-col items-center justify-center p-4">
            <div className="text-2xl font-bold text-slate-800">{tag.name || 'Name'}</div>
            {showTitle && tag.title && (
              <div className="text-sm text-slate-600 mt-1">{tag.title}</div>
            )}
            {showCompany && tag.company && (
              <div className="text-sm text-slate-500 mt-1">{tag.company}</div>
            )}
          </div>
        )
      case 'professional':
        return (
          <div className="w-72 h-40 bg-white border rounded-lg overflow-hidden flex">
            <div className="w-2" style={{ backgroundColor: primaryColor }} />
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="text-2xl font-bold" style={{ color: primaryColor }}>{tag.name || 'Name'}</div>
              {showTitle && tag.title && (
                <div className="text-sm text-slate-600 mt-1">{tag.title}</div>
              )}
              {showCompany && tag.company && (
                <div className="text-sm font-medium text-slate-800 mt-2">{tag.company}</div>
              )}
            </div>
          </div>
        )
      case 'modern':
        return (
          <div
            className="w-72 h-40 rounded-lg flex flex-col items-center justify-center p-4"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)` }}
          >
            <div className="text-2xl font-bold text-white">{tag.name || 'Name'}</div>
            {showTitle && tag.title && (
              <div className="text-sm text-white/80 mt-1">{tag.title}</div>
            )}
            {showCompany && tag.company && (
              <div className="text-sm text-white/70 mt-1">{tag.company}</div>
            )}
          </div>
        )
      case 'colorful':
        return (
          <div className="w-72 h-40 bg-white border-4 rounded-lg flex flex-col items-center justify-center p-4" style={{ borderColor: primaryColor }}>
            <div
              className="absolute top-0 left-0 right-0 h-12 flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: primaryColor }}
            >
              {showCompany ? (tag.company || 'COMPANY') : 'HELLO'}
            </div>
            <div className="text-2xl font-bold text-slate-800 mt-6">{tag.name || 'Name'}</div>
            {showTitle && tag.title && (
              <div className="text-sm text-slate-600 mt-1">{tag.title}</div>
            )}
          </div>
        )
    }
  }

  const print = () => {
    const printContent = printRef.current
    if (!printContent) return

    const printWindow = window.open('', '', 'width=800,height=600')
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>Name Tags</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .tag-container { display: flex; flex-wrap: wrap; gap: 20px; padding: 20px; }
            .tag { page-break-inside: avoid; }
            @media print {
              .tag-container { gap: 10px; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.nameTagGenerator.template')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['simple', 'professional', 'modern', 'colorful'] as const).map(t => (
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

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.nameTagGenerator.color')}
            </label>
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-full h-8 rounded cursor-pointer"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showTitle}
                onChange={(e) => setShowTitle(e.target.checked)}
              />
              <span className="text-sm">{t('tools.nameTagGenerator.showTitle')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showCompany}
                onChange={(e) => setShowCompany(e.target.checked)}
              />
              <span className="text-sm">{t('tools.nameTagGenerator.showCompany')}</span>
            </label>
          </div>
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.nameTagGenerator.entries')} ({tags.length})
          </h3>
          <button
            onClick={bulkImport}
            className="text-sm text-blue-500"
          >
            {t('tools.nameTagGenerator.bulkImport')}
          </button>
        </div>

        {tags.map((tag, index) => (
          <div key={tag.id} className="p-3 bg-slate-50 rounded space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-400">#{index + 1}</span>
              {tags.length > 1 && (
                <button
                  onClick={() => removeTag(tag.id)}
                  className="ml-auto text-red-400 hover:text-red-600 text-sm"
                >
                  {t('tools.nameTagGenerator.remove')}
                </button>
              )}
            </div>
            <input
              type="text"
              value={tag.name}
              onChange={(e) => updateTag(tag.id, 'name', e.target.value)}
              placeholder={t('tools.nameTagGenerator.name')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={tag.title}
                onChange={(e) => updateTag(tag.id, 'title', e.target.value)}
                placeholder={t('tools.nameTagGenerator.title')}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <input
                type="text"
                value={tag.company}
                onChange={(e) => updateTag(tag.id, 'company', e.target.value)}
                placeholder={t('tools.nameTagGenerator.company')}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          </div>
        ))}

        <button
          onClick={addTag}
          className="w-full py-2 border-2 border-dashed border-slate-300 rounded text-slate-500 hover:border-blue-400 hover:text-blue-500"
        >
          + {t('tools.nameTagGenerator.addTag')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.nameTagGenerator.preview')}
        </h3>
        <div ref={printRef} className="flex flex-wrap gap-4 justify-center">
          {tags.filter(t => t.name).map(tag => (
            <div key={tag.id} className="tag relative">
              {getTemplateStyles(tag)}
            </div>
          ))}
        </div>
        {tags.filter(t => t.name).length === 0 && (
          <p className="text-center text-slate-500 py-4">
            {t('tools.nameTagGenerator.enterNames')}
          </p>
        )}
      </div>

      <button
        onClick={print}
        disabled={tags.filter(t => t.name).length === 0}
        className="w-full py-3 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
      >
        {t('tools.nameTagGenerator.print')}
      </button>
    </div>
  )
}
