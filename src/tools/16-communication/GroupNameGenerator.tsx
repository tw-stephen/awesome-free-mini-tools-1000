import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function GroupNameGenerator() {
  const { t } = useTranslation()
  const [category, setCategory] = useState<'work' | 'project' | 'fun' | 'sports'>('work')
  const [keyword, setKeyword] = useState('')
  const [generatedNames, setGeneratedNames] = useState<string[]>([])

  const nameParts = {
    work: {
      prefixes: ['Team', 'Squad', 'Group', 'Division', 'Unit', 'Crew', 'Task Force', 'Alliance'],
      suffixes: ['Hub', 'Central', 'Network', 'Circle', 'Core', 'HQ', 'Base', 'Zone'],
      adjectives: ['Dynamic', 'Elite', 'Prime', 'Alpha', 'Strategic', 'Synergy', 'Innovative']
    },
    project: {
      prefixes: ['Project', 'Initiative', 'Venture', 'Mission', 'Operation', 'Sprint', 'Phase'],
      suffixes: ['Labs', 'Works', 'Studio', 'Forge', 'Factory', 'Workshop', 'Space'],
      adjectives: ['Phoenix', 'Titan', 'Nova', 'Genesis', 'Apex', 'Quantum', 'Horizon']
    },
    fun: {
      prefixes: ['The', 'Awesome', 'Super', 'Epic', 'Ultra', 'Mega', 'Power'],
      suffixes: ['Squad', 'Gang', 'Crew', 'Bunch', 'Club', 'Pack', 'Tribe'],
      adjectives: ['Cool', 'Amazing', 'Fantastic', 'Legendary', 'Supreme', 'Unstoppable']
    },
    sports: {
      prefixes: ['Team', 'Club', 'United', 'FC', 'Athletic', 'Sports', 'Racing'],
      suffixes: ['Warriors', 'Champions', 'Stars', 'Titans', 'Lions', 'Eagles', 'Legends'],
      adjectives: ['Mighty', 'Swift', 'Thunder', 'Iron', 'Golden', 'Silver', 'Royal']
    }
  }

  const generateNames = () => {
    const parts = nameParts[category]
    const names: string[] = []

    for (let i = 0; i < 10; i++) {
      const prefix = parts.prefixes[Math.floor(Math.random() * parts.prefixes.length)]
      const suffix = parts.suffixes[Math.floor(Math.random() * parts.suffixes.length)]
      const adj = parts.adjectives[Math.floor(Math.random() * parts.adjectives.length)]

      const patterns = [
        `${prefix} ${adj}`,
        `${adj} ${suffix}`,
        `${prefix} ${suffix}`,
        keyword ? `${prefix} ${keyword}` : `${adj} ${prefix}`,
        keyword ? `${keyword} ${suffix}` : `${prefix} ${adj} ${suffix}`,
      ]

      names.push(patterns[Math.floor(Math.random() * patterns.length)])
    }

    setGeneratedNames([...new Set(names)])
  }

  const copyName = (name: string) => {
    navigator.clipboard.writeText(name)
  }

  const categories = [
    { id: 'work', name: 'Work Team' },
    { id: 'project', name: 'Project' },
    { id: 'fun', name: 'Fun/Social' },
    { id: 'sports', name: 'Sports' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.groupNameGenerator.category')}</h3>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id as typeof category)}
              className={`px-4 py-2 rounded ${
                category === cat.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-1">{t('tools.groupNameGenerator.keyword')}</label>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Optional: Add a keyword"
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <button
        onClick={generateNames}
        className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
      >
        {t('tools.groupNameGenerator.generate')}
      </button>

      {generatedNames.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.groupNameGenerator.results')}</h3>
          <div className="space-y-2">
            {generatedNames.map((name, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-slate-50 rounded hover:bg-slate-100 cursor-pointer"
                onClick={() => copyName(name)}
              >
                <span className="font-medium">{name}</span>
                <span className="text-xs text-slate-500">{t('tools.groupNameGenerator.clickToCopy')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
