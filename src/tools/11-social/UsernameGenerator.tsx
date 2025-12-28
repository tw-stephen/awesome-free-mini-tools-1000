import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function UsernameGenerator() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [keywords, setKeywords] = useState('')
  const [style, setStyle] = useState<'simple' | 'gaming' | 'professional' | 'creative'>('simple')
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [generatedUsernames, setGeneratedUsernames] = useState<string[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  const prefixes = {
    simple: ['the', 'just', 'its', 'real', 'official'],
    gaming: ['pro', 'elite', 'dark', 'shadow', 'epic', 'ninja', 'cyber', 'neo'],
    professional: ['mr', 'ms', 'dr', 'prof', 'ceo'],
    creative: ['art', 'pixel', 'dream', 'cosmic', 'neon', 'retro', 'vintage']
  }

  const suffixes = {
    simple: ['official', 'real', 'here', 'now', 'daily'],
    gaming: ['gaming', 'plays', 'live', 'gg', 'wins', 'legend'],
    professional: ['pro', 'official', 'hq', 'works', 'studio'],
    creative: ['creates', 'designs', 'arts', 'studio', 'lab']
  }

  const generate = () => {
    const results: string[] = []
    const baseName = name.toLowerCase().replace(/[^a-z0-9]/g, '')
    const keywordList = keywords.toLowerCase().split(/[,\s]+/).filter(k => k.length > 0)

    // Simple variations
    if (baseName) {
      results.push(baseName)
      results.push(`${baseName}_`)
      results.push(`_${baseName}`)
      results.push(`${baseName}x`)
    }

    // With prefixes
    prefixes[style].forEach(prefix => {
      if (baseName) {
        results.push(`${prefix}${baseName}`)
        results.push(`${prefix}_${baseName}`)
      }
    })

    // With suffixes
    suffixes[style].forEach(suffix => {
      if (baseName) {
        results.push(`${baseName}${suffix}`)
        results.push(`${baseName}_${suffix}`)
      }
    })

    // With keywords
    keywordList.forEach(keyword => {
      if (baseName) {
        results.push(`${baseName}${keyword}`)
        results.push(`${keyword}${baseName}`)
        results.push(`${baseName}_${keyword}`)
      }
    })

    // With numbers
    if (includeNumbers && baseName) {
      const year = new Date().getFullYear().toString().slice(-2)
      results.push(`${baseName}${year}`)
      results.push(`${baseName}${Math.floor(Math.random() * 100)}`)
      results.push(`${baseName}${Math.floor(Math.random() * 1000)}`)
      results.push(`${baseName}x${Math.floor(Math.random() * 100)}`)
    }

    // Unique and shuffle
    const unique = [...new Set(results)]
      .filter(u => u.length >= 3 && u.length <= 20)
      .sort(() => Math.random() - 0.5)
      .slice(0, 20)

    setGeneratedUsernames(unique)
  }

  const copyUsername = (username: string) => {
    navigator.clipboard.writeText(username)
    setCopied(username)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.usernameGenerator.name')}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('tools.usernameGenerator.namePlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.usernameGenerator.keywords')}
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder={t('tools.usernameGenerator.keywordsPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.usernameGenerator.style')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['simple', 'gaming', 'professional', 'creative'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`px-3 py-1.5 rounded text-sm capitalize ${
                style === s ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {t(`tools.usernameGenerator.style${s.charAt(0).toUpperCase() + s.slice(1)}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">{t('tools.usernameGenerator.includeNumbers')}</span>
        </label>
      </div>

      <button
        onClick={generate}
        disabled={!name}
        className="w-full py-3 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
      >
        {t('tools.usernameGenerator.generate')}
      </button>

      {generatedUsernames.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">
            {t('tools.usernameGenerator.results')} ({generatedUsernames.length})
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {generatedUsernames.map((username, index) => (
              <button
                key={index}
                onClick={() => copyUsername(username)}
                className={`p-2 rounded text-sm text-left transition ${
                  copied === username
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                @{username}
                {copied === username && (
                  <span className="text-xs ml-1">✓</span>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">
            {t('tools.usernameGenerator.clickToCopy')}
          </p>
        </div>
      )}

      <div className="card p-4 bg-yellow-50">
        <p className="text-sm text-yellow-700">
          {t('tools.usernameGenerator.availability')}
        </p>
      </div>
    </div>
  )
}
