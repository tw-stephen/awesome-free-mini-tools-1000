import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Summary {
  id: number
  title: string
  author: string
  mainIdeas: string
  keyTakeaways: string
  quotes: string
  rating: number
  date: string
}

export default function BookSummary() {
  const { t } = useTranslation()
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [mode, setMode] = useState<'list' | 'create' | 'view'>('list')
  const [current, setCurrent] = useState<Summary | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('book-summaries')
    if (saved) {
      try {
        setSummaries(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load summaries')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('book-summaries', JSON.stringify(summaries))
  }, [summaries])

  const createNew = () => {
    setCurrent({
      id: Date.now(),
      title: '',
      author: '',
      mainIdeas: '',
      keyTakeaways: '',
      quotes: '',
      rating: 0,
      date: new Date().toISOString().split('T')[0],
    })
    setMode('create')
  }

  const save = () => {
    if (!current || !current.title.trim()) return

    const existing = summaries.find(s => s.id === current.id)
    if (existing) {
      setSummaries(summaries.map(s => s.id === current.id ? current : s))
    } else {
      setSummaries([current, ...summaries])
    }
    setMode('list')
  }

  const deleteSummary = (id: number) => {
    setSummaries(summaries.filter(s => s.id !== id))
  }

  return (
    <div className="space-y-4">
      {mode === 'list' && (
        <>
          <button
            onClick={createNew}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            + {t('tools.bookSummary.newSummary')}
          </button>

          {summaries.length === 0 ? (
            <div className="card p-6 text-center text-slate-500">
              {t('tools.bookSummary.noSummaries')}
            </div>
          ) : (
            <div className="space-y-2">
              {summaries.map(summary => (
                <div key={summary.id} className="card p-4">
                  <div className="flex justify-between items-start">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => { setCurrent(summary); setMode('view') }}
                    >
                      <div className="font-medium">{summary.title}</div>
                      <div className="text-sm text-slate-500">{summary.author}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <span key={star} className={star <= summary.rating ? 'text-yellow-400' : 'text-slate-300'}>
                            ★
                          </span>
                        ))}
                        <span className="text-xs text-slate-400 ml-2">{summary.date}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteSummary(summary.id)}
                      className="text-red-500"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {(mode === 'create' || mode === 'view') && current && (
        <>
          <div className="card p-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('tools.bookSummary.bookTitle')}
                </label>
                <input
                  type="text"
                  value={current.title}
                  onChange={(e) => setCurrent({ ...current, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                  readOnly={mode === 'view'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('tools.bookSummary.author')}
                </label>
                <input
                  type="text"
                  value={current.author}
                  onChange={(e) => setCurrent({ ...current, author: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                  readOnly={mode === 'view'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('tools.bookSummary.rating')}
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => mode !== 'view' && setCurrent({ ...current, rating: star })}
                      className={`text-2xl ${star <= current.rating ? 'text-yellow-400' : 'text-slate-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.bookSummary.mainIdeas')}
            </label>
            <textarea
              value={current.mainIdeas}
              onChange={(e) => setCurrent({ ...current, mainIdeas: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
              rows={4}
              readOnly={mode === 'view'}
            />
          </div>

          <div className="card p-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.bookSummary.keyTakeaways')}
            </label>
            <textarea
              value={current.keyTakeaways}
              onChange={(e) => setCurrent({ ...current, keyTakeaways: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
              rows={4}
              readOnly={mode === 'view'}
            />
          </div>

          <div className="card p-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.bookSummary.favoriteQuotes')}
            </label>
            <textarea
              value={current.quotes}
              onChange={(e) => setCurrent({ ...current, quotes: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
              rows={3}
              readOnly={mode === 'view'}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setMode('list')}
              className="flex-1 py-2 bg-slate-100 rounded"
            >
              {t('common.back')}
            </button>
            {mode === 'create' && (
              <button
                onClick={save}
                disabled={!current.title.trim()}
                className="flex-1 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                {t('tools.bookSummary.save')}
              </button>
            )}
            {mode === 'view' && (
              <button
                onClick={() => setMode('create')}
                className="flex-1 py-2 bg-blue-500 text-white rounded"
              >
                {t('tools.bookSummary.edit')}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
