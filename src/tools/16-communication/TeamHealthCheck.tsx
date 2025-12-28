import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface HealthItem {
  id: number
  category: string
  question: string
  rating: number
  trend: 'up' | 'same' | 'down'
}

export default function TeamHealthCheck() {
  const { t } = useTranslation()
  const [teamName, setTeamName] = useState('')
  const [checkDate, setCheckDate] = useState(new Date().toISOString().split('T')[0])
  const [items, setItems] = useState<HealthItem[]>([
    { id: 1, category: 'Delivery', question: 'We deliver value regularly', rating: 3, trend: 'same' },
    { id: 2, category: 'Delivery', question: 'We ship with confidence', rating: 3, trend: 'same' },
    { id: 3, category: 'Quality', question: 'Our codebase is healthy', rating: 3, trend: 'same' },
    { id: 4, category: 'Quality', question: 'We have good test coverage', rating: 3, trend: 'same' },
    { id: 5, category: 'Speed', question: 'We can release easily', rating: 3, trend: 'same' },
    { id: 6, category: 'Speed', question: 'We get fast feedback', rating: 3, trend: 'same' },
    { id: 7, category: 'Mission', question: 'We know our purpose', rating: 3, trend: 'same' },
    { id: 8, category: 'Mission', question: 'We understand our customers', rating: 3, trend: 'same' },
    { id: 9, category: 'Fun', question: 'We enjoy working together', rating: 3, trend: 'same' },
    { id: 10, category: 'Fun', question: 'We celebrate successes', rating: 3, trend: 'same' },
    { id: 11, category: 'Learning', question: 'We learn from mistakes', rating: 3, trend: 'same' },
    { id: 12, category: 'Learning', question: 'We share knowledge', rating: 3, trend: 'same' },
    { id: 13, category: 'Support', question: 'We help each other', rating: 3, trend: 'same' },
    { id: 14, category: 'Support', question: 'We have good work-life balance', rating: 3, trend: 'same' },
  ])

  const updateItem = (id: number, field: 'rating' | 'trend', value: number | string) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const categories = [...new Set(items.map(i => i.category))]

  const getCategoryScore = (category: string): number => {
    const catItems = items.filter(i => i.category === category)
    return catItems.reduce((sum, i) => sum + i.rating, 0) / catItems.length
  }

  const overallScore = items.reduce((sum, i) => sum + i.rating, 0) / items.length

  const getScoreColor = (score: number): string => {
    if (score >= 4) return 'text-green-600 bg-green-100'
    if (score >= 3) return 'text-blue-600 bg-blue-100'
    if (score >= 2) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const trendIcons: Record<string, string> = {
    'up': '↑',
    'same': '→',
    'down': '↓'
  }

  const generateReport = (): string => {
    let text = `TEAM HEALTH CHECK\\n${'='.repeat(50)}\\n\\n`
    text += `Team: ${teamName || '[Team Name]'}\\n`
    text += `Date: ${checkDate}\\n`
    text += `Overall Score: ${overallScore.toFixed(1)}/5\\n\\n`

    categories.forEach(cat => {
      const score = getCategoryScore(cat)
      text += `${cat.toUpperCase()} (${score.toFixed(1)}/5)\\n${'─'.repeat(30)}\\n`
      items.filter(i => i.category === cat).forEach(i => {
        const emoji = i.rating >= 4 ? '✓' : i.rating >= 3 ? '○' : i.rating >= 2 ? '△' : '✗'
        text += `${emoji} ${i.question}: ${i.rating}/5 ${trendIcons[i.trend]}\\n`
      })
      text += '\\n'
    })

    const lowItems = items.filter(i => i.rating <= 2)
    if (lowItems.length > 0) {
      text += `NEEDS ATTENTION\\n${'─'.repeat(30)}\\n`
      lowItems.forEach(i => {
        text += `• ${i.question} (${i.rating}/5)\\n`
      })
    }

    return text
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.teamHealthCheck.team')}</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Team name"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.teamHealthCheck.date')}</label>
            <input
              type="date"
              value={checkDate}
              onChange={(e) => setCheckDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">{t('tools.teamHealthCheck.overall')}</h3>
          <span className={`px-4 py-2 rounded font-bold text-xl ${getScoreColor(overallScore)}`}>
            {overallScore.toFixed(1)}/5
          </span>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {categories.map(cat => {
            const score = getCategoryScore(cat)
            return (
              <div key={cat} className="text-center">
                <div className={`w-full aspect-square rounded-lg flex items-center justify-center text-lg font-bold ${getScoreColor(score)}`}>
                  {score.toFixed(1)}
                </div>
                <p className="text-xs text-slate-500 mt-1">{cat}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.teamHealthCheck.assessment')}</h3>
        <div className="space-y-6">
          {categories.map(category => (
            <div key={category}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-slate-600 uppercase">{category}</h4>
                <span className={`text-sm px-2 py-0.5 rounded ${getScoreColor(getCategoryScore(category))}`}>
                  {getCategoryScore(category).toFixed(1)}/5
                </span>
              </div>
              <div className="space-y-2">
                {items.filter(i => i.category === category).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded">
                    <span className="flex-1 text-sm">{item.question}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(r => (
                        <button
                          key={r}
                          onClick={() => updateItem(item.id, 'rating', r)}
                          className={`w-8 h-8 rounded ${
                            item.rating >= r
                              ? r >= 4 ? 'bg-green-500 text-white'
                                : r >= 3 ? 'bg-blue-500 text-white'
                                : r >= 2 ? 'bg-yellow-500 text-white'
                                : 'bg-red-500 text-white'
                              : 'bg-slate-200'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      {(['down', 'same', 'up'] as const).map(trend => (
                        <button
                          key={trend}
                          onClick={() => updateItem(item.id, 'trend', trend)}
                          className={`w-8 h-8 rounded ${
                            item.trend === trend
                              ? trend === 'up' ? 'bg-green-500 text-white'
                                : trend === 'down' ? 'bg-red-500 text-white'
                                : 'bg-slate-400 text-white'
                              : 'bg-slate-200'
                          }`}
                        >
                          {trendIcons[trend]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {items.some(i => i.rating <= 2) && (
        <div className="card p-4 bg-red-50 border-red-200">
          <h4 className="font-medium text-red-800 mb-2">⚠️ {t('tools.teamHealthCheck.attention')}</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {items.filter(i => i.rating <= 2).map(i => (
              <li key={i.id}>• {i.question} ({i.rating}/5)</li>
            ))}
          </ul>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.teamHealthCheck.report')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
          {generateReport()}
        </pre>
        <button
          onClick={copyReport}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.teamHealthCheck.copy')}
        </button>
      </div>
    </div>
  )
}
