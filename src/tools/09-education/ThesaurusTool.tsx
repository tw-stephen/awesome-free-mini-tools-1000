import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ThesaurusTool() {
  const { t } = useTranslation()
  const [word, setWord] = useState('')
  const [result, setResult] = useState<{ word: string; synonyms: string[]; antonyms: string[] } | null>(null)

  // Common word synonyms/antonyms database
  const thesaurus: Record<string, { synonyms: string[]; antonyms: string[] }> = {
    happy: { synonyms: ['joyful', 'cheerful', 'delighted', 'pleased', 'glad', 'content', 'elated'], antonyms: ['sad', 'unhappy', 'miserable', 'depressed'] },
    sad: { synonyms: ['unhappy', 'sorrowful', 'melancholy', 'gloomy', 'dejected', 'downcast'], antonyms: ['happy', 'joyful', 'cheerful'] },
    big: { synonyms: ['large', 'huge', 'enormous', 'massive', 'vast', 'immense', 'gigantic'], antonyms: ['small', 'tiny', 'little', 'miniature'] },
    small: { synonyms: ['little', 'tiny', 'miniature', 'petite', 'compact', 'minute'], antonyms: ['big', 'large', 'huge', 'enormous'] },
    fast: { synonyms: ['quick', 'rapid', 'swift', 'speedy', 'hasty', 'brisk'], antonyms: ['slow', 'sluggish', 'leisurely'] },
    slow: { synonyms: ['sluggish', 'leisurely', 'gradual', 'unhurried', 'plodding'], antonyms: ['fast', 'quick', 'rapid', 'swift'] },
    good: { synonyms: ['excellent', 'fine', 'great', 'wonderful', 'superb', 'outstanding'], antonyms: ['bad', 'poor', 'terrible', 'awful'] },
    bad: { synonyms: ['poor', 'terrible', 'awful', 'dreadful', 'horrible', 'atrocious'], antonyms: ['good', 'excellent', 'great', 'wonderful'] },
    beautiful: { synonyms: ['pretty', 'lovely', 'gorgeous', 'stunning', 'attractive', 'elegant'], antonyms: ['ugly', 'unattractive', 'plain'] },
    ugly: { synonyms: ['unattractive', 'unsightly', 'hideous', 'grotesque', 'repulsive'], antonyms: ['beautiful', 'pretty', 'lovely', 'attractive'] },
    smart: { synonyms: ['intelligent', 'clever', 'bright', 'brilliant', 'wise', 'sharp'], antonyms: ['stupid', 'dumb', 'foolish', 'ignorant'] },
    stupid: { synonyms: ['dumb', 'foolish', 'ignorant', 'dense', 'dim-witted'], antonyms: ['smart', 'intelligent', 'clever', 'bright'] },
    old: { synonyms: ['ancient', 'elderly', 'aged', 'vintage', 'antique'], antonyms: ['new', 'young', 'modern', 'recent'] },
    new: { synonyms: ['fresh', 'modern', 'recent', 'novel', 'contemporary'], antonyms: ['old', 'ancient', 'vintage', 'antique'] },
    hot: { synonyms: ['warm', 'heated', 'scorching', 'boiling', 'burning', 'fiery'], antonyms: ['cold', 'cool', 'freezing', 'chilly'] },
    cold: { synonyms: ['cool', 'chilly', 'freezing', 'icy', 'frigid', 'frosty'], antonyms: ['hot', 'warm', 'heated', 'burning'] },
    easy: { synonyms: ['simple', 'effortless', 'straightforward', 'uncomplicated'], antonyms: ['difficult', 'hard', 'challenging', 'complex'] },
    difficult: { synonyms: ['hard', 'challenging', 'tough', 'complex', 'demanding'], antonyms: ['easy', 'simple', 'effortless'] },
    strong: { synonyms: ['powerful', 'mighty', 'sturdy', 'robust', 'tough'], antonyms: ['weak', 'feeble', 'frail', 'fragile'] },
    weak: { synonyms: ['feeble', 'frail', 'fragile', 'delicate', 'flimsy'], antonyms: ['strong', 'powerful', 'mighty', 'sturdy'] },
  }

  const search = () => {
    const searchWord = word.toLowerCase().trim()
    if (thesaurus[searchWord]) {
      setResult({
        word: searchWord,
        ...thesaurus[searchWord],
      })
    } else {
      setResult({
        word: searchWord,
        synonyms: [],
        antonyms: [],
      })
    }
  }

  const availableWords = Object.keys(thesaurus)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.thesaurusTool.enterWord')}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search()}
            placeholder={t('tools.thesaurusTool.placeholder')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
          />
          <button
            onClick={search}
            disabled={!word.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
          >
            {t('tools.thesaurusTool.search')}
          </button>
        </div>
      </div>

      {result && (
        <>
          <div className="card p-4">
            <h3 className="text-lg font-medium text-slate-700 mb-1 capitalize">
              {result.word}
            </h3>
            {result.synonyms.length === 0 && result.antonyms.length === 0 ? (
              <p className="text-slate-500">{t('tools.thesaurusTool.notFound')}</p>
            ) : null}
          </div>

          {result.synonyms.length > 0 && (
            <div className="card p-4 bg-green-50">
              <h4 className="text-sm font-medium text-green-700 mb-3">
                {t('tools.thesaurusTool.synonyms')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.synonyms.map(syn => (
                  <button
                    key={syn}
                    onClick={() => setWord(syn)}
                    className="px-3 py-1 bg-white rounded border border-green-200 text-green-700 hover:bg-green-100"
                  >
                    {syn}
                  </button>
                ))}
              </div>
            </div>
          )}

          {result.antonyms.length > 0 && (
            <div className="card p-4 bg-red-50">
              <h4 className="text-sm font-medium text-red-700 mb-3">
                {t('tools.thesaurusTool.antonyms')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.antonyms.map(ant => (
                  <button
                    key={ant}
                    onClick={() => setWord(ant)}
                    className="px-3 py-1 bg-white rounded border border-red-200 text-red-700 hover:bg-red-100"
                  >
                    {ant}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.thesaurusTool.availableWords')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {availableWords.map(w => (
            <button
              key={w}
              onClick={() => { setWord(w); setTimeout(search, 0) }}
              className="px-2 py-1 text-sm bg-slate-100 rounded hover:bg-slate-200 capitalize"
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.thesaurusTool.about')}
        </h3>
        <div className="text-xs text-slate-500 space-y-1">
          <p>• {t('tools.thesaurusTool.tip1')}</p>
          <p>• {t('tools.thesaurusTool.tip2')}</p>
          <p>• {t('tools.thesaurusTool.tip3')}</p>
        </div>
      </div>
    </div>
  )
}
