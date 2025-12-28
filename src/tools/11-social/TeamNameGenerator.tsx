import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type TeamType = 'sports' | 'gaming' | 'business' | 'creative' | 'tech' | 'random'

export default function TeamNameGenerator() {
  const { t } = useTranslation()
  const [teamType, setTeamType] = useState<TeamType>('sports')
  const [keyword, setKeyword] = useState('')
  const [generatedNames, setGeneratedNames] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  const prefixes: Record<TeamType, string[]> = {
    sports: ['Thunder', 'Lightning', 'Storm', 'Fire', 'Iron', 'Steel', 'Royal', 'Elite', 'Prime', 'Victory'],
    gaming: ['Shadow', 'Phantom', 'Cyber', 'Neo', 'Dark', 'Neon', 'Pixel', 'Chaos', 'Void', 'Digital'],
    business: ['Apex', 'Summit', 'Peak', 'Prime', 'Elite', 'Core', 'Pro', 'Alpha', 'Synergy', 'Momentum'],
    creative: ['Spark', 'Muse', 'Canvas', 'Vision', 'Dream', 'Color', 'Art', 'Design', 'Craft', 'Studio'],
    tech: ['Binary', 'Code', 'Quantum', 'Neural', 'Cyber', 'Data', 'Logic', 'Cloud', 'Stack', 'Node'],
    random: ['Epic', 'Mighty', 'Super', 'Ultra', 'Mega', 'Hyper', 'Turbo', 'Power', 'Force', 'Max']
  }

  const suffixes: Record<TeamType, string[]> = {
    sports: ['Warriors', 'Knights', 'Titans', 'Wolves', 'Eagles', 'Lions', 'Hawks', 'Bears', 'Panthers', 'Dragons'],
    gaming: ['Squad', 'Legion', 'Clan', 'Guild', 'Force', 'Army', 'Crew', 'Pack', 'Team', 'Syndicate'],
    business: ['Solutions', 'Dynamics', 'Ventures', 'Partners', 'Group', 'Labs', 'Works', 'Hub', 'Co', 'Inc'],
    creative: ['Collective', 'Studios', 'Lab', 'Works', 'Guild', 'House', 'Space', 'Hub', 'Factory', 'Crew'],
    tech: ['Labs', 'Systems', 'Tech', 'Software', 'Works', 'Dev', 'Digital', 'Solutions', 'IO', 'HQ'],
    random: ['Force', 'Squad', 'Team', 'Crew', 'Gang', 'Club', 'Alliance', 'Union', 'League', 'United']
  }

  const patterns = [
    (pre: string, suf: string, key: string) => `${pre} ${suf}`,
    (pre: string, suf: string, key: string) => `The ${pre} ${suf}`,
    (pre: string, suf: string, key: string) => `Team ${pre}`,
    (pre: string, suf: string, key: string) => `${pre}${suf}`,
    (pre: string, suf: string, key: string) => key ? `${key} ${suf}` : `${pre} ${suf}`,
    (pre: string, suf: string, key: string) => key ? `${pre} ${key}` : `${pre} ${suf}`,
    (pre: string, suf: string, key: string) => `${pre.toLowerCase()}${suf.toLowerCase()}`,
    (pre: string, suf: string, key: string) => `${suf} of ${pre}`,
  ]

  const generate = () => {
    const pres = prefixes[teamType]
    const sufs = suffixes[teamType]
    const names: string[] = []

    for (let i = 0; i < 10; i++) {
      const pre = pres[Math.floor(Math.random() * pres.length)]
      const suf = sufs[Math.floor(Math.random() * sufs.length)]
      const pattern = patterns[Math.floor(Math.random() * patterns.length)]
      names.push(pattern(pre, suf, keyword))
    }

    // Add keyword-based names if keyword exists
    if (keyword) {
      names.push(`Team ${keyword}`)
      names.push(`${keyword} ${sufs[Math.floor(Math.random() * sufs.length)]}`)
      names.push(`${pres[Math.floor(Math.random() * pres.length)]} ${keyword}`)
    }

    setGeneratedNames([...new Set(names)].slice(0, 12))
  }

  const toggleFavorite = (name: string) => {
    if (favorites.includes(name)) {
      setFavorites(favorites.filter(f => f !== name))
    } else {
      setFavorites([...favorites, name])
    }
  }

  const copyName = (name: string) => {
    navigator.clipboard.writeText(name)
    setCopied(name)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.teamNameGenerator.type')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['sports', 'gaming', 'business', 'creative', 'tech', 'random'] as const).map(type => (
            <button
              key={type}
              onClick={() => setTeamType(type)}
              className={`px-3 py-1.5 rounded text-sm capitalize ${
                teamType === type ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {t(`tools.teamNameGenerator.type${type.charAt(0).toUpperCase() + type.slice(1)}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.teamNameGenerator.keyword')}
        </label>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={t('tools.teamNameGenerator.keywordPlaceholder')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <button
        onClick={generate}
        className="w-full py-3 bg-blue-500 text-white rounded font-medium"
      >
        {t('tools.teamNameGenerator.generate')}
      </button>

      {generatedNames.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.teamNameGenerator.results')}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {generatedNames.map((name, index) => (
              <div
                key={index}
                className="p-3 bg-slate-50 rounded flex items-center justify-between"
              >
                <span className="font-medium">{name}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleFavorite(name)}
                    className="text-yellow-500 p-1"
                  >
                    {favorites.includes(name) ? '★' : '☆'}
                  </button>
                  <button
                    onClick={() => copyName(name)}
                    className={`p-1 text-xs ${copied === name ? 'text-green-500' : 'text-blue-500'}`}
                  >
                    {copied === name ? '✓' : t('tools.teamNameGenerator.copy')}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={generate}
            className="mt-3 w-full py-2 bg-slate-100 rounded text-sm"
          >
            {t('tools.teamNameGenerator.regenerate')}
          </button>
        </div>
      )}

      {favorites.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-2">
            {t('tools.teamNameGenerator.favorites')} ({favorites.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {favorites.map((name, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded text-sm flex items-center gap-1"
              >
                {name}
                <button
                  onClick={() => toggleFavorite(name)}
                  className="ml-1 text-yellow-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
