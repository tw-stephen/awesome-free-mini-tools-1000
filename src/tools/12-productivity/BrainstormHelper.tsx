import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Idea {
  id: string
  text: string
  category: string
  votes: number
}

export default function BrainstormHelper() {
  const { t } = useTranslation()
  const [topic, setTopic] = useState('')
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [newIdea, setNewIdea] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('general')
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showPrompts, setShowPrompts] = useState(false)

  const categories = ['general', 'creative', 'practical', 'wild', 'combination']

  const prompts = [
    { key: 'whatIf', text: t('tools.brainstormHelper.prompts.whatIf') },
    { key: 'howMight', text: t('tools.brainstormHelper.prompts.howMight') },
    { key: 'opposite', text: t('tools.brainstormHelper.prompts.opposite') },
    { key: 'combine', text: t('tools.brainstormHelper.prompts.combine') },
    { key: 'simplify', text: t('tools.brainstormHelper.prompts.simplify') },
    { key: 'expand', text: t('tools.brainstormHelper.prompts.expand') },
    { key: 'noLimits', text: t('tools.brainstormHelper.prompts.noLimits') },
    { key: 'perspective', text: t('tools.brainstormHelper.prompts.perspective') }
  ]

  const addIdea = () => {
    if (!newIdea.trim()) return
    const idea: Idea = {
      id: Date.now().toString(),
      text: newIdea,
      category: selectedCategory,
      votes: 0
    }
    setIdeas([...ideas, idea])
    setNewIdea('')
  }

  const removeIdea = (id: string) => {
    setIdeas(ideas.filter(i => i.id !== id))
  }

  const voteIdea = (id: string, delta: number) => {
    setIdeas(ideas.map(i =>
      i.id === id ? { ...i, votes: i.votes + delta } : i
    ))
  }

  const startTimer = (minutes: number) => {
    setTimer(minutes * 60)
    setIsRunning(true)
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          setIsRunning(false)
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      general: 'bg-blue-100 border-blue-500',
      creative: 'bg-purple-100 border-purple-500',
      practical: 'bg-green-100 border-green-500',
      wild: 'bg-orange-100 border-orange-500',
      combination: 'bg-pink-100 border-pink-500'
    }
    return colors[cat] || colors.general
  }

  const sortedIdeas = [...ideas].sort((a, b) => b.votes - a.votes)

  const exportIdeas = () => {
    let text = `Brainstorm: ${topic || 'Untitled'}\n\n`
    text += `Generated ${ideas.length} ideas\n\n`
    sortedIdeas.forEach((idea, index) => {
      text += `${index + 1}. [${idea.category}] ${idea.text} (${idea.votes} votes)\n`
    })
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'brainstorm-ideas.txt'
    a.click()
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={t('tools.brainstormHelper.topicPlaceholder')}
          className="w-full px-3 py-2 border border-slate-300 rounded text-lg font-medium"
        />
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">{t('tools.brainstormHelper.timer')}</h3>
          {isRunning && (
            <span className="text-2xl font-mono font-bold text-blue-600">
              {formatTime(timer)}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {[1, 3, 5, 10, 15].map(mins => (
            <button
              key={mins}
              onClick={() => startTimer(mins)}
              disabled={isRunning}
              className={`flex-1 py-2 rounded ${
                isRunning ? 'bg-slate-100 text-slate-400' : 'bg-blue-500 text-white'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setShowPrompts(!showPrompts)}
        className="w-full py-2 bg-yellow-100 rounded text-sm"
      >
        {showPrompts ? t('tools.brainstormHelper.hidePrompts') : t('tools.brainstormHelper.showPrompts')}
      </button>

      {showPrompts && (
        <div className="card p-4 bg-yellow-50">
          <h3 className="font-medium mb-2">{t('tools.brainstormHelper.promptsTitle')}</h3>
          <div className="grid grid-cols-2 gap-2">
            {prompts.map(prompt => (
              <div key={prompt.key} className="p-2 bg-white rounded text-sm">
                {prompt.text}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4 space-y-3">
        <textarea
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), addIdea())}
          placeholder={t('tools.brainstormHelper.ideaPlaceholder')}
          className="w-full px-3 py-2 border border-slate-300 rounded h-20"
        />

        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded text-sm capitalize ${
                selectedCategory === cat
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100'
              }`}
            >
              {t(`tools.brainstormHelper.categories.${cat}`)}
            </button>
          ))}
        </div>

        <button
          onClick={addIdea}
          disabled={!newIdea.trim()}
          className="w-full py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          {t('tools.brainstormHelper.addIdea')}
        </button>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">
            {t('tools.brainstormHelper.ideas')} ({ideas.length})
          </h3>
          {ideas.length > 0 && (
            <button onClick={exportIdeas} className="text-sm text-blue-500">
              {t('tools.brainstormHelper.export')}
            </button>
          )}
        </div>

        {ideas.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            {t('tools.brainstormHelper.noIdeas')}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedIdeas.map((idea, index) => (
              <div
                key={idea.id}
                className={`p-3 rounded border-l-4 ${getCategoryColor(idea.category)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => voteIdea(idea.id, 1)}
                      className="text-slate-400 hover:text-green-500"
                    >
                      +
                    </button>
                    <span className="font-bold text-sm">{idea.votes}</span>
                    <button
                      onClick={() => voteIdea(idea.id, -1)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      -
                    </button>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-slate-400">#{index + 1}</span>
                    <p className="text-sm">{idea.text}</p>
                    <span className="text-xs text-slate-400 capitalize">{idea.category}</span>
                  </div>
                  <button
                    onClick={() => removeIdea(idea.id)}
                    className="text-red-500 text-sm"
                  >
                    x
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setIdeas([])}
        className="w-full py-2 bg-slate-100 text-slate-600 rounded"
      >
        {t('tools.brainstormHelper.clearAll')}
      </button>
    </div>
  )
}
