import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface JournalEntry {
  id: number
  date: string
  title: string
  content: string
  mood?: string
  tags: string[]
}

export default function JournalApp() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [currentEntry, setCurrentEntry] = useState({
    title: '',
    content: '',
    mood: '',
    tags: [] as string[],
  })
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [newTag, setNewTag] = useState('')

  const moods = ['😊', '😐', '😢', '😤', '😴', '🤔', '😍', '🎉']

  useEffect(() => {
    const saved = localStorage.getItem('journal-app')
    if (saved) {
      try {
        setEntries(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load journal')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('journal-app', JSON.stringify(entries))
  }, [entries])

  const addTag = () => {
    if (!newTag || currentEntry.tags.includes(newTag)) return
    setCurrentEntry({ ...currentEntry, tags: [...currentEntry.tags, newTag] })
    setNewTag('')
  }

  const removeTag = (tag: string) => {
    setCurrentEntry({ ...currentEntry, tags: currentEntry.tags.filter(t => t !== tag) })
  }

  const saveEntry = () => {
    if (!currentEntry.title && !currentEntry.content) return

    const entry: JournalEntry = {
      id: selectedEntry?.id || Date.now(),
      date: selectedEntry?.date || new Date().toISOString().split('T')[0],
      title: currentEntry.title || 'Untitled',
      content: currentEntry.content,
      mood: currentEntry.mood || undefined,
      tags: currentEntry.tags,
    }

    if (selectedEntry) {
      setEntries(entries.map(e => e.id === selectedEntry.id ? entry : e))
    } else {
      setEntries([entry, ...entries])
    }

    setCurrentEntry({ title: '', content: '', mood: '', tags: [] })
    setSelectedEntry(null)
  }

  const editEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry)
    setCurrentEntry({
      title: entry.title,
      content: entry.content,
      mood: entry.mood || '',
      tags: entry.tags,
    })
  }

  const deleteEntry = (id: number) => {
    setEntries(entries.filter(e => e.id !== id))
    if (selectedEntry?.id === id) {
      setSelectedEntry(null)
      setCurrentEntry({ title: '', content: '', mood: '', tags: [] })
    }
  }

  const cancelEdit = () => {
    setSelectedEntry(null)
    setCurrentEntry({ title: '', content: '', mood: '', tags: [] })
  }

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    entries.forEach(e => e.tags.forEach(t => tags.add(t)))
    return Array.from(tags)
  }, [entries])

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = !searchQuery ||
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesTag = !tagFilter || entry.tags.includes(tagFilter)

      return matchesSearch && matchesTag
    })
  }, [entries, searchQuery, tagFilter])

  const stats = useMemo(() => {
    const thisMonth = entries.filter(e => {
      const entryDate = new Date(e.date)
      const now = new Date()
      return entryDate.getMonth() === now.getMonth() &&
             entryDate.getFullYear() === now.getFullYear()
    })

    return {
      total: entries.length,
      thisMonth: thisMonth.length,
      tags: allTags.length,
    }
  }, [entries, allTags])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-xs text-slate-500">{t('tools.journal.totalEntries')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{stats.thisMonth}</div>
            <div className="text-xs text-slate-500">{t('tools.journal.thisMonth')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{stats.tags}</div>
            <div className="text-xs text-slate-500">{t('tools.journal.tags')}</div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {selectedEntry ? t('tools.journal.editEntry') : t('tools.journal.newEntry')}
        </h3>

        <div className="space-y-3">
          <input
            type="text"
            value={currentEntry.title}
            onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
            placeholder={t('tools.journal.title')}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />

          <textarea
            value={currentEntry.content}
            onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
            placeholder={t('tools.journal.writeHere')}
            rows={6}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm resize-none"
          />

          <div>
            <label className="block text-xs text-slate-500 mb-2">{t('tools.journal.mood')}</label>
            <div className="flex gap-2">
              {moods.map(mood => (
                <button
                  key={mood}
                  onClick={() => setCurrentEntry({ ...currentEntry, mood })}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                    currentEntry.mood === mood ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-slate-100'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">{t('tools.journal.tags')}</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {currentEntry.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
                >
                  #{tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-red-500">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                placeholder={t('tools.journal.addTag')}
                className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <button
                onClick={addTag}
                className="px-3 py-2 bg-slate-200 rounded hover:bg-slate-300"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={saveEntry}
              className="flex-1 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
            >
              {selectedEntry ? t('tools.journal.update') : t('tools.journal.save')}
            </button>
            {selectedEntry && (
              <button
                onClick={cancelEdit}
                className="px-4 py-2 bg-slate-200 rounded font-medium hover:bg-slate-300"
              >
                {t('tools.journal.cancel')}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('tools.journal.search')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          >
            <option value="">{t('tools.journal.allTags')}</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>#{tag}</option>
            ))}
          </select>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            {t('tools.journal.noEntries')}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEntries.map(entry => (
              <div key={entry.id} className="p-3 bg-slate-50 rounded">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {entry.mood && <span>{entry.mood}</span>}
                      {entry.title}
                    </div>
                    <div className="text-xs text-slate-500">{entry.date}</div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => editEntry(entry)}
                      className="p-1 text-slate-400 hover:text-blue-500"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="p-1 text-slate-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-600 line-clamp-3">{entry.content}</p>
                {entry.tags.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {entry.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-slate-200 rounded-full text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.journal.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.journal.tip1')}</li>
          <li>{t('tools.journal.tip2')}</li>
          <li>{t('tools.journal.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
