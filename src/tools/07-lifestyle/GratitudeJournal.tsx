import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface GratitudeEntry {
  id: number
  date: string
  items: string[]
}

export default function GratitudeJournal() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<GratitudeEntry[]>([])
  const [todayItems, setTodayItems] = useState<string[]>(['', '', ''])
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const saved = localStorage.getItem('gratitude-journal')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setEntries(data)
        const todayEntry = data.find((e: GratitudeEntry) => e.date === today)
        if (todayEntry) {
          setTodayItems(todayEntry.items)
        }
      } catch (e) {
        console.error('Failed to load gratitude journal')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('gratitude-journal', JSON.stringify(entries))
  }, [entries])

  const updateTodayItem = (index: number, value: string) => {
    const newItems = [...todayItems]
    newItems[index] = value
    setTodayItems(newItems)
  }

  const saveToday = () => {
    const filledItems = todayItems.filter(item => item.trim())
    if (filledItems.length === 0) return

    const existingIndex = entries.findIndex(e => e.date === today)
    if (existingIndex >= 0) {
      const updated = [...entries]
      updated[existingIndex] = { ...updated[existingIndex], items: filledItems }
      setEntries(updated)
    } else {
      setEntries([{ id: Date.now(), date: today, items: filledItems }, ...entries])
    }
  }

  const deleteEntry = (id: number) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  const stats = useMemo(() => {
    const totalItems = entries.reduce((sum, e) => sum + e.items.length, 0)
    const streak = calculateStreak()
    return { totalEntries: entries.length, totalItems, streak }
  }, [entries])

  function calculateStreak() {
    let streak = 0
    const sortedDates = entries.map(e => e.date).sort().reverse()

    for (let i = 0; i < sortedDates.length; i++) {
      const expectedDate = new Date()
      expectedDate.setDate(expectedDate.getDate() - i)
      const expected = expectedDate.toISOString().split('T')[0]

      if (sortedDates.includes(expected)) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const prompts = [
    'Something that made me smile today',
    'A person I am grateful for',
    'A simple pleasure I enjoyed',
    'Something I learned today',
    'A challenge that helped me grow',
    'Something beautiful I noticed',
    'An act of kindness I witnessed or did',
    'Something I often take for granted',
  ]

  const getRandomPrompt = (index: number) => {
    const prompt = prompts[Math.floor(Math.random() * prompts.length)]
    updateTodayItem(index, prompt + ': ')
  }

  const addMoreItems = () => {
    setTodayItems([...todayItems, ''])
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-yellow-50 rounded">
            <div className="text-2xl font-bold text-yellow-600">{stats.streak}</div>
            <div className="text-xs text-slate-500">{t('tools.gratitude.streak')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{stats.totalEntries}</div>
            <div className="text-xs text-slate-500">{t('tools.gratitude.days')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{stats.totalItems}</div>
            <div className="text-xs text-slate-500">{t('tools.gratitude.items')}</div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.gratitude.todayTitle')}
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          {t('tools.gratitude.todayPrompt')}
        </p>

        <div className="space-y-3">
          {todayItems.map((item, index) => (
            <div key={index} className="flex gap-2">
              <span className="w-8 h-10 flex items-center justify-center text-xl">
                {index === 0 ? '🌟' : index === 1 ? '💫' : index === 2 ? '✨' : '⭐'}
              </span>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateTodayItem(index, e.target.value)}
                  placeholder={`${t('tools.gratitude.item')} ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
                />
                <button
                  onClick={() => getRandomPrompt(index)}
                  className="px-3 py-2 bg-slate-100 rounded text-sm hover:bg-slate-200"
                  title={t('tools.gratitude.getPrompt')}
                >
                  💡
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={addMoreItems}
            className="flex-1 py-2 bg-slate-100 rounded text-sm hover:bg-slate-200"
          >
            + {t('tools.gratitude.addMore')}
          </button>
          <button
            onClick={saveToday}
            className="flex-1 py-2 bg-yellow-500 text-white rounded font-medium hover:bg-yellow-600"
          >
            {t('tools.gratitude.save')}
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.gratitude.prompts')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {prompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => {
                const emptyIndex = todayItems.findIndex(item => !item.trim())
                if (emptyIndex >= 0) {
                  updateTodayItem(emptyIndex, prompt + ': ')
                }
              }}
              className="px-3 py-1 bg-slate-100 rounded-full text-sm hover:bg-slate-200"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {entries.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.gratitude.history')}
          </h3>
          <div className="space-y-3">
            {entries.slice(0, 10).map(entry => (
              <div key={entry.id} className="p-3 bg-slate-50 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">{entry.date}</span>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
                <ul className="space-y-1">
                  {entry.items.map((item, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span>{i === 0 ? '🌟' : i === 1 ? '💫' : '✨'}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.gratitude.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.gratitude.tip1')}</li>
          <li>{t('tools.gratitude.tip2')}</li>
          <li>{t('tools.gratitude.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
