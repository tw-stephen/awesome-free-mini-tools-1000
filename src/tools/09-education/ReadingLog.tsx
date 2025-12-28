import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface ReadingEntry {
  id: number
  bookTitle: string
  author: string
  pagesRead: number
  totalPages: number
  minutesRead: number
  date: string
  notes: string
}

export default function ReadingLog() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<ReadingEntry[]>([])
  const [mode, setMode] = useState<'list' | 'add'>('list')
  const [newEntry, setNewEntry] = useState<Partial<ReadingEntry>>({
    bookTitle: '',
    author: '',
    pagesRead: 0,
    totalPages: 0,
    minutesRead: 0,
    date: new Date().toISOString().split('T')[0],
    notes: '',
  })

  useEffect(() => {
    const saved = localStorage.getItem('reading-log')
    if (saved) {
      try {
        setEntries(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load reading log')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('reading-log', JSON.stringify(entries))
  }, [entries])

  const addEntry = () => {
    if (!newEntry.bookTitle?.trim()) return

    const entry: ReadingEntry = {
      id: Date.now(),
      bookTitle: newEntry.bookTitle,
      author: newEntry.author || '',
      pagesRead: newEntry.pagesRead || 0,
      totalPages: newEntry.totalPages || 0,
      minutesRead: newEntry.minutesRead || 0,
      date: newEntry.date || new Date().toISOString().split('T')[0],
      notes: newEntry.notes || '',
    }
    setEntries([entry, ...entries])
    setNewEntry({
      bookTitle: '',
      author: '',
      pagesRead: 0,
      totalPages: 0,
      minutesRead: 0,
      date: new Date().toISOString().split('T')[0],
      notes: '',
    })
    setMode('list')
  }

  const deleteEntry = (id: number) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  // Calculate stats
  const thisWeek = entries.filter(e => {
    const date = new Date(e.date)
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return date >= weekAgo
  })

  const totalPages = thisWeek.reduce((sum, e) => sum + e.pagesRead, 0)
  const totalMinutes = thisWeek.reduce((sum, e) => sum + e.minutesRead, 0)
  const booksInProgress = [...new Set(entries.filter(e => e.pagesRead < e.totalPages).map(e => e.bookTitle))]

  // Group by book
  const bookProgress = entries.reduce((acc, e) => {
    if (!acc[e.bookTitle]) {
      acc[e.bookTitle] = { pagesRead: 0, totalPages: e.totalPages, author: e.author }
    }
    acc[e.bookTitle].pagesRead += e.pagesRead
    return acc
  }, {} as Record<string, { pagesRead: number; totalPages: number; author: string }>)

  return (
    <div className="space-y-4">
      {mode === 'list' && (
        <>
          <button
            onClick={() => setMode('add')}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            + {t('tools.readingLog.addEntry')}
          </button>

          <div className="grid grid-cols-3 gap-2">
            <div className="card p-3 text-center bg-blue-50">
              <div className="text-2xl font-bold text-blue-600">{totalPages}</div>
              <div className="text-xs text-slate-500">{t('tools.readingLog.pagesThisWeek')}</div>
            </div>
            <div className="card p-3 text-center bg-green-50">
              <div className="text-2xl font-bold text-green-600">{totalMinutes}</div>
              <div className="text-xs text-slate-500">{t('tools.readingLog.minutesThisWeek')}</div>
            </div>
            <div className="card p-3 text-center bg-purple-50">
              <div className="text-2xl font-bold text-purple-600">{booksInProgress.length}</div>
              <div className="text-xs text-slate-500">{t('tools.readingLog.booksInProgress')}</div>
            </div>
          </div>

          {Object.keys(bookProgress).length > 0 && (
            <div className="card p-4">
              <h3 className="text-sm font-medium text-slate-700 mb-3">
                {t('tools.readingLog.bookProgress')}
              </h3>
              <div className="space-y-3">
                {Object.entries(bookProgress).slice(0, 5).map(([title, data]) => (
                  <div key={title}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium truncate">{title}</span>
                      <span className="text-slate-500">
                        {data.pagesRead} / {data.totalPages || '?'}
                      </span>
                    </div>
                    {data.totalPages > 0 && (
                      <div className="h-2 bg-slate-200 rounded">
                        <div
                          className="h-full bg-blue-500 rounded"
                          style={{ width: `${Math.min((data.pagesRead / data.totalPages) * 100, 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {entries.length === 0 ? (
            <div className="card p-6 text-center text-slate-500">
              {t('tools.readingLog.noEntries')}
            </div>
          ) : (
            <div className="card p-4">
              <h3 className="text-sm font-medium text-slate-700 mb-3">
                {t('tools.readingLog.recentEntries')}
              </h3>
              <div className="space-y-2">
                {entries.slice(0, 10).map(entry => (
                  <div key={entry.id} className="flex justify-between items-start p-2 bg-slate-50 rounded">
                    <div>
                      <div className="font-medium text-sm">{entry.bookTitle}</div>
                      <div className="text-xs text-slate-500">
                        {entry.pagesRead} {t('tools.readingLog.pages')} • {entry.minutesRead} {t('tools.readingLog.minutes')} • {entry.date}
                      </div>
                    </div>
                    <button onClick={() => deleteEntry(entry.id)} className="text-red-500 text-sm">×</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {mode === 'add' && (
        <div className="card p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.readingLog.bookTitle')} *
            </label>
            <input
              type="text"
              value={newEntry.bookTitle || ''}
              onChange={(e) => setNewEntry({ ...newEntry, bookTitle: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder={t('tools.readingLog.bookTitlePlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.readingLog.author')}
            </label>
            <input
              type="text"
              value={newEntry.author || ''}
              onChange={(e) => setNewEntry({ ...newEntry, author: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.readingLog.pagesRead')}
              </label>
              <input
                type="number"
                value={newEntry.pagesRead || ''}
                onChange={(e) => setNewEntry({ ...newEntry, pagesRead: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.readingLog.totalPages')}
              </label>
              <input
                type="number"
                value={newEntry.totalPages || ''}
                onChange={(e) => setNewEntry({ ...newEntry, totalPages: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.readingLog.minutesRead')}
              </label>
              <input
                type="number"
                value={newEntry.minutesRead || ''}
                onChange={(e) => setNewEntry({ ...newEntry, minutesRead: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.readingLog.date')}
              </label>
              <input
                type="date"
                value={newEntry.date || ''}
                onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.readingLog.notes')}
            </label>
            <textarea
              value={newEntry.notes || ''}
              onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <button onClick={() => setMode('list')} className="flex-1 py-2 bg-slate-100 rounded">
              {t('common.cancel')}
            </button>
            <button
              onClick={addEntry}
              disabled={!newEntry.bookTitle?.trim()}
              className="flex-1 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {t('tools.readingLog.save')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
