import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function BusinessNameGenerator() {
  const { t } = useTranslation()
  const [keyword, setKeyword] = useState('')
  const [industry, setIndustry] = useState('tech')
  const [style, setStyle] = useState('modern')
  const [generatedNames, setGeneratedNames] = useState<string[]>([])
  const [savedNames, setSavedNames] = useState<string[]>([])

  const prefixes: Record<string, string[]> = {
    tech: ['Tech', 'Digi', 'Cyber', 'Neo', 'Quantum', 'Smart', 'Cloud', 'Data', 'AI', 'Byte'],
    health: ['Health', 'Vita', 'Care', 'Med', 'Well', 'Life', 'Bio', 'Pure', 'Heal', 'Fit'],
    finance: ['Fin', 'Capital', 'Wealth', 'Trust', 'Prime', 'Sage', 'Peak', 'Core', 'Fund', 'Asset'],
    food: ['Fresh', 'Tasty', 'Yum', 'Green', 'Pure', 'Organic', 'Natural', 'Farm', 'Gourmet', 'Artisan'],
    retail: ['Shop', 'Mart', 'Store', 'Hub', 'Market', 'Bazaar', 'Outlet', 'Emporium', 'Gallery', 'Boutique'],
  }

  const suffixes: Record<string, string[]> = {
    modern: ['Labs', 'Hub', 'Pro', 'Plus', 'Now', 'Go', 'AI', 'X', 'io', 'ly'],
    classic: ['Corp', 'Inc', 'Group', 'Co', 'Partners', 'Associates', 'Solutions', 'Services', 'Enterprises', 'Global'],
    creative: ['Studio', 'Works', 'Collective', 'House', 'Creative', 'Design', 'Media', 'Arts', 'Factory', 'Lab'],
    playful: ['Buddy', 'Pal', 'Joy', 'Happy', 'Fun', 'Spark', 'Pop', 'Boom', 'Buzz', 'Zest'],
  }

  const generateNames = () => {
    const names: string[] = []
    const industryPrefixes = prefixes[industry] || prefixes.tech
    const styleSuffixes = suffixes[style] || suffixes.modern
    const baseWord = keyword || 'Business'

    // Pattern 1: Prefix + Keyword
    for (let i = 0; i < 3; i++) {
      const prefix = industryPrefixes[Math.floor(Math.random() * industryPrefixes.length)]
      names.push(`${prefix}${baseWord.charAt(0).toUpperCase() + baseWord.slice(1)}`)
    }

    // Pattern 2: Keyword + Suffix
    for (let i = 0; i < 3; i++) {
      const suffix = styleSuffixes[Math.floor(Math.random() * styleSuffixes.length)]
      names.push(`${baseWord.charAt(0).toUpperCase() + baseWord.slice(1)}${suffix}`)
    }

    // Pattern 3: Prefix + Suffix
    for (let i = 0; i < 2; i++) {
      const prefix = industryPrefixes[Math.floor(Math.random() * industryPrefixes.length)]
      const suffix = styleSuffixes[Math.floor(Math.random() * styleSuffixes.length)]
      names.push(`${prefix}${suffix}`)
    }

    // Pattern 4: Compound words
    const compoundWords = [
      `${baseWord}ify`,
      `${baseWord}able`,
      `Get${baseWord.charAt(0).toUpperCase() + baseWord.slice(1)}`,
      `My${baseWord.charAt(0).toUpperCase() + baseWord.slice(1)}`,
    ]
    names.push(...compoundWords.slice(0, 2))

    setGeneratedNames([...new Set(names)])
  }

  const saveName = (name: string) => {
    if (!savedNames.includes(name)) {
      setSavedNames([...savedNames, name])
    }
  }

  const removeSaved = (name: string) => {
    setSavedNames(savedNames.filter(n => n !== name))
  }

  const copyName = (name: string) => {
    navigator.clipboard.writeText(name)
  }

  const copyAllSaved = () => {
    navigator.clipboard.writeText(savedNames.join('\n'))
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.businessNameGenerator.settings')}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">Keyword</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter a keyword..."
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-500 block mb-1">Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                <option value="tech">Technology</option>
                <option value="health">Health & Wellness</option>
                <option value="finance">Finance</option>
                <option value="food">Food & Beverage</option>
                <option value="retail">Retail</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                <option value="modern">Modern</option>
                <option value="classic">Classic</option>
                <option value="creative">Creative</option>
                <option value="playful">Playful</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={generateNames}
        className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
      >
        {t('tools.businessNameGenerator.generate')}
      </button>

      {generatedNames.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.businessNameGenerator.results')}</h3>
          <div className="grid grid-cols-2 gap-2">
            {generatedNames.map((name, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 bg-slate-50 rounded"
              >
                <span className="font-medium">{name}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => copyName(name)}
                    className="px-2 py-1 text-xs bg-slate-200 rounded hover:bg-slate-300"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => saveName(name)}
                    className={`px-2 py-1 text-xs rounded ${
                      savedNames.includes(name)
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {savedNames.includes(name) ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {savedNames.length > 0 && (
        <div className="card p-4 bg-green-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">{t('tools.businessNameGenerator.saved')} ({savedNames.length})</h3>
            <button
              onClick={copyAllSaved}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            >
              Copy All
            </button>
          </div>
          <div className="space-y-1">
            {savedNames.map((name, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-white rounded">
                <span>{name}</span>
                <button
                  onClick={() => removeSaved(name)}
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.businessNameGenerator.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Keep it short and memorable</li>
          <li>• Check domain availability</li>
          <li>• Ensure it's easy to spell and pronounce</li>
          <li>• Verify trademark availability</li>
        </ul>
      </div>
    </div>
  )
}
