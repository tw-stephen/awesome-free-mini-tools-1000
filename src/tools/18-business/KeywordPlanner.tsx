import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Keyword {
  id: number
  keyword: string
  volume: string
  difficulty: string
  cpc: string
  intent: 'informational' | 'navigational' | 'transactional' | 'commercial'
  priority: 'high' | 'medium' | 'low'
}

export default function KeywordPlanner() {
  const { t } = useTranslation()
  const [seedKeyword, setSeedKeyword] = useState('')
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [filter, setFilter] = useState('all')

  const intents = [
    { id: 'informational', name: 'Informational', description: 'User wants to learn' },
    { id: 'navigational', name: 'Navigational', description: 'User looking for specific site' },
    { id: 'transactional', name: 'Transactional', description: 'User ready to buy' },
    { id: 'commercial', name: 'Commercial', description: 'User researching before purchase' },
  ]

  const addKeyword = () => {
    if (!seedKeyword.trim()) return
    setKeywords([...keywords, {
      id: Date.now(),
      keyword: seedKeyword.trim(),
      volume: '',
      difficulty: 'medium',
      cpc: '',
      intent: 'informational',
      priority: 'medium',
    }])
    setSeedKeyword('')
  }

  const addBulkKeywords = (text: string) => {
    const newKeywords = text.split('\n')
      .map(k => k.trim())
      .filter(k => k && !keywords.some(existing => existing.keyword === k))
      .map(keyword => ({
        id: Date.now() + Math.random(),
        keyword,
        volume: '',
        difficulty: 'medium' as const,
        cpc: '',
        intent: 'informational' as const,
        priority: 'medium' as const,
      }))
    setKeywords([...keywords, ...newKeywords])
  }

  const updateKeyword = (id: number, field: keyof Keyword, value: string) => {
    setKeywords(keywords.map(k => k.id === id ? { ...k, [field]: value } : k))
  }

  const removeKeyword = (id: number) => {
    setKeywords(keywords.filter(k => k.id !== id))
  }

  const getIntentColor = (intent: Keyword['intent']): string => {
    const colors = {
      informational: 'bg-blue-100 text-blue-600',
      navigational: 'bg-purple-100 text-purple-600',
      transactional: 'bg-green-100 text-green-600',
      commercial: 'bg-orange-100 text-orange-600',
    }
    return colors[intent]
  }

  const getPriorityColor = (priority: Keyword['priority']): string => {
    const colors = {
      high: 'bg-red-100 text-red-600',
      medium: 'bg-yellow-100 text-yellow-600',
      low: 'bg-slate-100 text-slate-600',
    }
    return colors[priority]
  }

  const filteredKeywords = filter === 'all'
    ? keywords
    : keywords.filter(k => k.priority === filter || k.intent === filter)

  const generateReport = (): string => {
    let doc = `KEYWORD RESEARCH REPORT\n${'═'.repeat(50)}\n\n`
    doc += `Total Keywords: ${keywords.length}\n`
    doc += `High Priority: ${keywords.filter(k => k.priority === 'high').length}\n\n`

    doc += `KEYWORDS BY PRIORITY\n${'─'.repeat(40)}\n\n`

    ;(['high', 'medium', 'low'] as const).forEach(priority => {
      const priorityKeywords = keywords.filter(k => k.priority === priority)
      if (priorityKeywords.length > 0) {
        doc += `${priority.toUpperCase()} PRIORITY:\n`
        priorityKeywords.forEach(k => {
          doc += `  • ${k.keyword}`
          if (k.volume) doc += ` | Volume: ${k.volume}`
          if (k.cpc) doc += ` | CPC: ${k.cpc}`
          doc += ` | Intent: ${k.intent}\n`
        })
        doc += '\n'
      }
    })

    doc += `\nKEYWORDS BY INTENT\n${'─'.repeat(40)}\n`
    intents.forEach(intent => {
      const intentKeywords = keywords.filter(k => k.intent === intent.id)
      if (intentKeywords.length > 0) {
        doc += `\n${intent.name} (${intentKeywords.length}):\n`
        intentKeywords.forEach(k => {
          doc += `  • ${k.keyword}\n`
        })
      }
    })

    return doc
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.keywordPlanner.add')}</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={seedKeyword}
            onChange={(e) => setSeedKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
            placeholder="Enter keyword"
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
          />
          <button onClick={addKeyword} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Add
          </button>
        </div>
        <details className="text-sm">
          <summary className="text-blue-500 cursor-pointer hover:text-blue-600">Add multiple keywords</summary>
          <textarea
            placeholder="One keyword per line..."
            rows={4}
            className="w-full mt-2 px-3 py-2 border border-slate-300 rounded resize-none"
            onBlur={(e) => {
              if (e.target.value.trim()) {
                addBulkKeywords(e.target.value)
                e.target.value = ''
              }
            }}
          />
        </details>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.keywordPlanner.stats')}</h3>
          <span className="text-sm text-slate-500">{keywords.length} keywords</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {intents.map(intent => (
            <div key={intent.id} className="text-center p-2 bg-slate-50 rounded">
              <div className="text-lg font-bold">{keywords.filter(k => k.intent === intent.id).length}</div>
              <div className="text-xs text-slate-500">{intent.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded text-sm whitespace-nowrap ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>All</button>
        <button onClick={() => setFilter('high')} className={`px-3 py-1 rounded text-sm whitespace-nowrap ${filter === 'high' ? 'bg-red-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>High Priority</button>
        <button onClick={() => setFilter('medium')} className={`px-3 py-1 rounded text-sm whitespace-nowrap ${filter === 'medium' ? 'bg-yellow-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>Medium</button>
        <button onClick={() => setFilter('transactional')} className={`px-3 py-1 rounded text-sm whitespace-nowrap ${filter === 'transactional' ? 'bg-green-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>Transactional</button>
      </div>

      <div className="space-y-2">
        {filteredKeywords.map(keyword => (
          <div key={keyword.id} className="card p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">{keyword.keyword}</span>
                <span className={`px-2 py-0.5 rounded text-xs ${getIntentColor(keyword.intent)}`}>{keyword.intent}</span>
                <span className={`px-2 py-0.5 rounded text-xs ${getPriorityColor(keyword.priority)}`}>{keyword.priority}</span>
              </div>
              <button onClick={() => removeKeyword(keyword.id)} className="text-red-400 hover:text-red-600">×</button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              <div>
                <label className="text-xs text-slate-500">Volume</label>
                <input type="text" value={keyword.volume} onChange={(e) => updateKeyword(keyword.id, 'volume', e.target.value)} placeholder="e.g., 10K" className="w-full px-2 py-1 border border-slate-300 rounded text-sm" />
              </div>
              <div>
                <label className="text-xs text-slate-500">Difficulty</label>
                <select value={keyword.difficulty} onChange={(e) => updateKeyword(keyword.id, 'difficulty', e.target.value)} className="w-full px-2 py-1 border border-slate-300 rounded text-sm">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500">CPC</label>
                <input type="text" value={keyword.cpc} onChange={(e) => updateKeyword(keyword.id, 'cpc', e.target.value)} placeholder="e.g., $2.50" className="w-full px-2 py-1 border border-slate-300 rounded text-sm" />
              </div>
              <div>
                <label className="text-xs text-slate-500">Intent</label>
                <select value={keyword.intent} onChange={(e) => updateKeyword(keyword.id, 'intent', e.target.value as Keyword['intent'])} className="w-full px-2 py-1 border border-slate-300 rounded text-sm">
                  {intents.map(i => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500">Priority</label>
                <select value={keyword.priority} onChange={(e) => updateKeyword(keyword.id, 'priority', e.target.value as Keyword['priority'])} className="w-full px-2 py-1 border border-slate-300 rounded text-sm">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {keywords.length === 0 && (
        <div className="card p-8 text-center text-slate-500">
          Add keywords to start your research
        </div>
      )}

      {keywords.length > 0 && (
        <button onClick={copyReport} className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium">
          {t('tools.keywordPlanner.export')}
        </button>
      )}
    </div>
  )
}
