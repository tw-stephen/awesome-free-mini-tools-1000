import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type SwotCategory = 'strengths' | 'weaknesses' | 'opportunities' | 'threats'

interface SwotItem {
  id: string
  text: string
  category: SwotCategory
}

interface SwotAnalysis {
  id: string
  title: string
  items: SwotItem[]
  createdAt: string
}

export default function SwotAnalysis() {
  const { t } = useTranslation()
  const [analyses, setAnalyses] = useState<SwotAnalysis[]>([])
  const [currentAnalysis, setCurrentAnalysis] = useState<SwotAnalysis>({
    id: '',
    title: '',
    items: [],
    createdAt: ''
  })
  const [newItem, setNewItem] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<SwotCategory>('strengths')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('swot-analyses')
    if (saved) setAnalyses(JSON.parse(saved))
  }, [])

  const saveAnalyses = (updated: SwotAnalysis[]) => {
    setAnalyses(updated)
    localStorage.setItem('swot-analyses', JSON.stringify(updated))
  }

  const addItem = () => {
    if (!newItem.trim()) return
    const item: SwotItem = {
      id: Date.now().toString(),
      text: newItem,
      category: selectedCategory
    }
    setCurrentAnalysis(prev => ({
      ...prev,
      items: [...prev.items, item]
    }))
    setNewItem('')
  }

  const removeItem = (id: string) => {
    setCurrentAnalysis(prev => ({
      ...prev,
      items: prev.items.filter(i => i.id !== id)
    }))
  }

  const moveItem = (id: string, category: SwotCategory) => {
    setCurrentAnalysis(prev => ({
      ...prev,
      items: prev.items.map(i => i.id === id ? { ...i, category } : i)
    }))
  }

  const getItemsByCategory = (category: SwotCategory) => {
    return currentAnalysis.items.filter(i => i.category === category)
  }

  const saveCurrentAnalysis = () => {
    if (!currentAnalysis.title) return
    const analysis = {
      ...currentAnalysis,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    saveAnalyses([...analyses, analysis])
    setCurrentAnalysis({ id: '', title: '', items: [], createdAt: '' })
  }

  const loadAnalysis = (analysis: SwotAnalysis) => {
    setCurrentAnalysis(analysis)
  }

  const deleteAnalysis = (id: string) => {
    saveAnalyses(analyses.filter(a => a.id !== id))
  }

  const categoryInfo: Record<SwotCategory, { title: string; color: string; bg: string; description: string }> = {
    strengths: {
      title: t('tools.swotAnalysis.strengths'),
      color: 'border-green-500',
      bg: 'bg-green-50',
      description: t('tools.swotAnalysis.strengthsDesc')
    },
    weaknesses: {
      title: t('tools.swotAnalysis.weaknesses'),
      color: 'border-red-500',
      bg: 'bg-red-50',
      description: t('tools.swotAnalysis.weaknessesDesc')
    },
    opportunities: {
      title: t('tools.swotAnalysis.opportunities'),
      color: 'border-blue-500',
      bg: 'bg-blue-50',
      description: t('tools.swotAnalysis.opportunitiesDesc')
    },
    threats: {
      title: t('tools.swotAnalysis.threats'),
      color: 'border-yellow-500',
      bg: 'bg-yellow-50',
      description: t('tools.swotAnalysis.threatsDesc')
    }
  }

  const generateText = () => {
    let text = `SWOT Analysis: ${currentAnalysis.title}\n${'='.repeat(50)}\n\n`
    const categories: SwotCategory[] = ['strengths', 'weaknesses', 'opportunities', 'threats']
    categories.forEach(cat => {
      const items = getItemsByCategory(cat)
      text += `${categoryInfo[cat].title.toUpperCase()}\n${'-'.repeat(30)}\n`
      if (items.length === 0) {
        text += '(None)\n'
      } else {
        items.forEach(item => {
          text += `• ${item.text}\n`
        })
      }
      text += '\n'
    })
    return text
  }

  const copyAnalysis = () => {
    navigator.clipboard.writeText(generateText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const SwotBox = ({ category }: { category: SwotCategory }) => {
    const info = categoryInfo[category]
    const items = getItemsByCategory(category)

    return (
      <div className={`card p-3 border-l-4 ${info.color} ${info.bg} min-h-[150px]`}>
        <div className="mb-2">
          <div className="font-medium text-sm">{info.title}</div>
          <div className="text-xs text-slate-500">{info.description}</div>
        </div>
        <div className="space-y-1">
          {items.map(item => (
            <div key={item.id} className="flex items-start gap-2 p-1.5 bg-white rounded text-sm">
              <span className="flex-1">{item.text}</span>
              <select
                value={item.category}
                onChange={(e) => moveItem(item.id, e.target.value as SwotCategory)}
                className="text-xs bg-transparent border-none cursor-pointer"
              >
                <option value="strengths">S</option>
                <option value="weaknesses">W</option>
                <option value="opportunities">O</option>
                <option value="threats">T</option>
              </select>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <input
          type="text"
          value={currentAnalysis.title}
          onChange={(e) => setCurrentAnalysis({ ...currentAnalysis, title: e.target.value })}
          placeholder={t('tools.swotAnalysis.analysisTitle')}
          className="w-full px-3 py-2 border border-slate-300 rounded mb-3"
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            placeholder={t('tools.swotAnalysis.addItem')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <button
            onClick={addItem}
            disabled={!newItem.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            +
          </button>
        </div>
        <div className="flex gap-2 mt-2">
          {(['strengths', 'weaknesses', 'opportunities', 'threats'] as SwotCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-1 py-1.5 text-xs rounded ${
                selectedCategory === cat
                  ? `${categoryInfo[cat].color.replace('border', 'bg').replace('-500', '-500')} text-white`
                  : 'bg-slate-100'
              }`}
            >
              {categoryInfo[cat].title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="text-center text-xs text-slate-500 col-span-2 mb-1">
          <span className="font-medium">{t('tools.swotAnalysis.internal')}</span>
        </div>
        <SwotBox category="strengths" />
        <SwotBox category="weaknesses" />
      </div>

      <div className="text-center text-xs text-slate-500">
        <span className="font-medium">{t('tools.swotAnalysis.external')}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <SwotBox category="opportunities" />
        <SwotBox category="threats" />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {(['strengths', 'weaknesses', 'opportunities', 'threats'] as SwotCategory[]).map(cat => (
          <div key={cat} className="card p-2 text-center">
            <div className="text-lg font-bold">{getItemsByCategory(cat).length}</div>
            <div className="text-xs text-slate-500">{cat[0].toUpperCase()}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={copyAnalysis}
          className={`py-2 rounded font-medium ${copied ? 'bg-green-500 text-white' : 'bg-slate-100'}`}
        >
          {copied ? '✓' : t('tools.swotAnalysis.copy')}
        </button>
        <button
          onClick={saveCurrentAnalysis}
          disabled={!currentAnalysis.title}
          className="py-2 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
        >
          {t('tools.swotAnalysis.save')}
        </button>
      </div>

      {analyses.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium text-slate-700 mb-3">{t('tools.swotAnalysis.savedAnalyses')}</h3>
          <div className="space-y-2">
            {analyses.map(analysis => (
              <div key={analysis.id} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                <div>
                  <div className="font-medium text-sm">{analysis.title}</div>
                  <div className="text-xs text-slate-500">
                    {analysis.items.length} {t('tools.swotAnalysis.items')} • {new Date(analysis.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadAnalysis(analysis)}
                    className="text-xs text-blue-500"
                  >
                    {t('tools.swotAnalysis.load')}
                  </button>
                  <button
                    onClick={() => deleteAnalysis(analysis.id)}
                    className="text-xs text-red-500"
                  >
                    {t('tools.swotAnalysis.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
