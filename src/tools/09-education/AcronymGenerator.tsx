import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function AcronymGenerator() {
  const { t } = useTranslation()
  const [words, setWords] = useState('')
  const [mode, setMode] = useState<'create' | 'expand'>('create')
  const [acronym, setAcronym] = useState('')

  const result = useMemo(() => {
    if (mode === 'create') {
      const wordList = words.trim().split(/[\s,]+/).filter(Boolean)
      if (wordList.length === 0) return null

      const acr = wordList.map(w => w[0].toUpperCase()).join('')
      return {
        acronym: acr,
        words: wordList,
      }
    } else {
      const letters = acronym.trim().toUpperCase().split('').filter(c => /[A-Z]/.test(c))
      if (letters.length === 0) return null

      // Generate word suggestions for each letter
      const commonWords: Record<string, string[]> = {
        A: ['Action', 'Accurate', 'Advanced', 'Amazing', 'Always', 'Active'],
        B: ['Best', 'Better', 'Basic', 'Brilliant', 'Bold', 'Build'],
        C: ['Creative', 'Clear', 'Complete', 'Core', 'Central', 'Critical'],
        D: ['Dynamic', 'Direct', 'Develop', 'Drive', 'Dedicated', 'Design'],
        E: ['Effective', 'Essential', 'Excellent', 'Expert', 'Easy', 'Efficient'],
        F: ['Fast', 'Focus', 'Future', 'Flexible', 'First', 'Fresh'],
        G: ['Great', 'Global', 'Growth', 'Goal', 'Guide', 'Good'],
        H: ['High', 'Help', 'Human', 'Happy', 'Honest', 'Health'],
        I: ['Innovative', 'Important', 'Intelligent', 'Integrated', 'Instant', 'Ideal'],
        J: ['Just', 'Joint', 'Journey', 'Jump', 'Joyful', 'Judicious'],
        K: ['Key', 'Knowledge', 'Keep', 'Kind', 'Keen', 'Know'],
        L: ['Learn', 'Lead', 'Live', 'Light', 'Logic', 'Long'],
        M: ['Main', 'Make', 'Modern', 'Move', 'Master', 'Maximum'],
        N: ['New', 'Next', 'Natural', 'Network', 'Notable', 'Nice'],
        O: ['Open', 'Optimal', 'Original', 'Organized', 'Outcome', 'Outstanding'],
        P: ['Perfect', 'Power', 'Prime', 'Progress', 'Plan', 'Practical'],
        Q: ['Quality', 'Quick', 'Quiet', 'Quest', 'Quantum', 'Quote'],
        R: ['Real', 'Ready', 'Result', 'Right', 'Rapid', 'Reliable'],
        S: ['Smart', 'Simple', 'Strong', 'Success', 'System', 'Safe'],
        T: ['True', 'Time', 'Total', 'Think', 'Together', 'Top'],
        U: ['Ultimate', 'Unique', 'United', 'Universal', 'User', 'Unified'],
        V: ['Value', 'Vision', 'Virtual', 'Vital', 'Verified', 'Victory'],
        W: ['World', 'Work', 'Win', 'Wise', 'Well', 'Way'],
        X: ['X-factor', 'Xtra', 'Xcellent', 'Xpert', 'Xpress', 'Xtreme'],
        Y: ['Yes', 'Your', 'Young', 'Yield', 'Year', 'Youthful'],
        Z: ['Zero', 'Zone', 'Zen', 'Zeal', 'Zoom', 'Zenith'],
      }

      return {
        letters,
        suggestions: letters.map(l => commonWords[l] || []),
      }
    }
  }, [words, acronym, mode])

  const [selectedWords, setSelectedWords] = useState<string[]>([])

  const handleSelectWord = (index: number, word: string) => {
    const newSelected = [...selectedWords]
    newSelected[index] = word
    setSelectedWords(newSelected)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => { setMode('create'); setSelectedWords([]) }}
          className={`flex-1 py-2 rounded font-medium ${mode === 'create' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.acronymGenerator.createAcronym')}
        </button>
        <button
          onClick={() => { setMode('expand'); setSelectedWords([]) }}
          className={`flex-1 py-2 rounded font-medium ${mode === 'expand' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.acronymGenerator.expandAcronym')}
        </button>
      </div>

      {mode === 'create' && (
        <>
          <div className="card p-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.acronymGenerator.enterWords')}
            </label>
            <textarea
              value={words}
              onChange={(e) => setWords(e.target.value)}
              placeholder={t('tools.acronymGenerator.wordsPlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
              rows={3}
            />
          </div>

          {result && 'acronym' in result && result.words && (
            <div className="card p-4 bg-blue-50 text-center">
              <div className="text-sm text-slate-600">{t('tools.acronymGenerator.yourAcronym')}</div>
              <div className="text-4xl font-bold text-blue-600">{result.acronym}</div>
              <div className="text-sm text-slate-500 mt-2">
                {result.words.map((w, i) => (
                  <span key={i}>
                    <span className="font-bold text-blue-600">{w[0].toUpperCase()}</span>
                    {w.slice(1)}
                    {i < result.words.length - 1 && ' · '}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {mode === 'expand' && (
        <>
          <div className="card p-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.acronymGenerator.enterAcronym')}
            </label>
            <input
              type="text"
              value={acronym}
              onChange={(e) => { setAcronym(e.target.value); setSelectedWords([]) }}
              placeholder="SMART"
              className="w-full px-3 py-2 border border-slate-300 rounded text-lg font-mono uppercase"
            />
          </div>

          {result && 'letters' in result && result.suggestions && (
            <div className="card p-4">
              <h3 className="text-sm font-medium text-slate-700 mb-3">
                {t('tools.acronymGenerator.suggestions')}
              </h3>
              <div className="space-y-3">
                {result.letters.map((letter, i) => (
                  <div key={i}>
                    <div className="text-lg font-bold text-blue-600 mb-1">{letter}</div>
                    <div className="flex flex-wrap gap-2">
                      {result.suggestions[i]?.map(word => (
                        <button
                          key={word}
                          onClick={() => handleSelectWord(i, word)}
                          className={`px-3 py-1 rounded text-sm ${
                            selectedWords[i] === word
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-100 hover:bg-slate-200'
                          }`}
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedWords.filter(Boolean).length > 0 && (
            <div className="card p-4 bg-green-50 text-center">
              <div className="text-sm text-slate-600">{t('tools.acronymGenerator.yourPhrase')}</div>
              <div className="text-lg font-medium text-green-700">
                {selectedWords.filter(Boolean).join(' ')}
              </div>
            </div>
          )}
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.acronymGenerator.examples')}
        </h3>
        <div className="text-xs text-slate-500 space-y-1">
          <p><strong>SMART</strong>: Specific, Measurable, Achievable, Relevant, Time-bound</p>
          <p><strong>KISS</strong>: Keep It Simple, Stupid</p>
          <p><strong>ASAP</strong>: As Soon As Possible</p>
        </div>
      </div>
    </div>
  )
}
