import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Idea {
  id: number
  text: string
  category: string
  votes: number
}

export default function BrainstormBoard() {
  const { t } = useTranslation()
  const [topic, setTopic] = useState('')
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [newIdea, setNewIdea] = useState('')
  const [categories] = useState(['General', 'Feature', 'Improvement', 'Innovation', 'Problem'])
  const [selectedCategory, setSelectedCategory] = useState('General')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState<'newest' | 'votes'>('newest')

  const addIdea = () => {
    if (!newIdea.trim()) return
    setIdeas([...ideas, {
      id: Date.now(),
      text: newIdea.trim(),
      category: selectedCategory,
      votes: 0
    }])
    setNewIdea('')
  }

  const vote = (id: number, delta: number) => {
    setIdeas(ideas.map(i =>
      i.id === id ? { ...i, votes: Math.max(0, i.votes + delta) } : i
    ))
  }

  const removeIdea = (id: number) => {
    setIdeas(ideas.filter(i => i.id !== id))
  }

  const filteredIdeas = ideas
    .filter(i => filterCategory === 'all' || i.category === filterCategory)
    .sort((a, b) => sortBy === 'votes' ? b.votes - a.votes : b.id - a.id)

  const exportIdeas = (): string => {
    let text = `BRAINSTORM SESSION\\n${'='.repeat(50)}\\n`
    text += `Topic: ${topic || '[Topic]'}\\n\\n`

    categories.forEach(cat => {
      const catIdeas = ideas.filter(i => i.category === cat)
      if (catIdeas.length > 0) {
        text += `${cat.toUpperCase()}\\n${'─'.repeat(30)}\\n`
        catIdeas.sort((a, b) => b.votes - a.votes).forEach(i => {
          text += `[${i.votes} votes] ${i.text}\\n`
        })
        text += '\\n'
      }
    })

    return text
  }

  const copyExport = () => {
    navigator.clipboard.writeText(exportIdeas())
  }

  const categoryColors: Record<string, string> = {
    'General': 'bg-slate-100 text-slate-700',
    'Feature': 'bg-blue-100 text-blue-700',
    'Improvement': 'bg-green-100 text-green-700',
    'Innovation': 'bg-purple-100 text-purple-700',
    'Problem': 'bg-red-100 text-red-700',
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-1">{t('tools.brainstormBoard.topic')}</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What are we brainstorming about?"
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.brainstormBoard.addIdea')}</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newIdea}
            onChange={(e) => setNewIdea(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addIdea()}
            placeholder="Enter your idea..."
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button
            onClick={addIdea}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.brainstormBoard.ideas')} ({filteredIdeas.length})</h3>
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2 py-1 text-sm border border-slate-300 rounded"
            >
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'votes')}
              className="px-2 py-1 text-sm border border-slate-300 rounded"
            >
              <option value="newest">Newest</option>
              <option value="votes">Most Votes</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredIdeas.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No ideas yet. Add one above!</p>
          ) : (
            filteredIdeas.map((idea) => (
              <div key={idea.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => vote(idea.id, 1)}
                    className="text-slate-400 hover:text-green-500"
                  >
                    ▲
                  </button>
                  <span className="font-bold text-sm">{idea.votes}</span>
                  <button
                    onClick={() => vote(idea.id, -1)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    ▼
                  </button>
                </div>
                <div className="flex-1">
                  <p>{idea.text}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[idea.category]}`}>
                    {idea.category}
                  </span>
                </div>
                <button
                  onClick={() => removeIdea(idea.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.brainstormBoard.export')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">
          {exportIdeas()}
        </pre>
        <button
          onClick={copyExport}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.brainstormBoard.copy')}
        </button>
      </div>
    </div>
  )
}
