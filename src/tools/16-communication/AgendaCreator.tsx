import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface AgendaItem {
  id: number
  topic: string
  duration: number
  presenter: string
}

export default function AgendaCreator() {
  const { t } = useTranslation()
  const [meetingTitle, setMeetingTitle] = useState('')
  const [meetingDate, setMeetingDate] = useState('')
  const [meetingTime, setMeetingTime] = useState('')
  const [items, setItems] = useState<AgendaItem[]>([
    { id: 1, topic: '', duration: 10, presenter: '' }
  ])

  const addItem = () => {
    setItems([...items, { id: Date.now(), topic: '', duration: 10, presenter: '' }])
  }

  const updateItem = (id: number, field: keyof AgendaItem, value: string | number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < items.length) {
      [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]]
      setItems(newItems)
    }
  }

  const totalDuration = items.reduce((sum, item) => sum + item.duration, 0)

  const generateAgenda = (): string => {
    let agenda = `MEETING AGENDA\n${'='.repeat(50)}\n\n`
    agenda += `Meeting: ${meetingTitle || '[Meeting Title]'}\n`
    agenda += `Date: ${meetingDate || '[Date]'}\n`
    agenda += `Time: ${meetingTime || '[Time]'}\n`
    agenda += `Duration: ${totalDuration} minutes\n\n`
    agenda += `${'='.repeat(50)}\n\n`

    let runningTime = 0
    items.forEach((item, index) => {
      agenda += `${index + 1}. ${item.topic || '[Topic]'}\n`
      agenda += `   Duration: ${item.duration} min`
      if (item.presenter) agenda += ` | Presenter: ${item.presenter}`
      agenda += `\n   Time: ${runningTime}-${runningTime + item.duration} min\n\n`
      runningTime += item.duration
    })

    return agenda
  }

  const copyAgenda = () => {
    navigator.clipboard.writeText(generateAgenda())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.agendaCreator.title')}</label>
          <input
            type="text"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            placeholder="Meeting title"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.agendaCreator.date')}</label>
            <input
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.agendaCreator.time')}</label>
            <input
              type="time"
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.agendaCreator.items')}</h3>
          <div className="text-sm text-slate-500">
            Total: {totalDuration} min
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.id} className="flex gap-2 items-start p-3 bg-slate-50 rounded">
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className="px-2 py-1 text-xs bg-slate-200 rounded disabled:opacity-50"
                >
                  Up
                </button>
                <button
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === items.length - 1}
                  className="px-2 py-1 text-xs bg-slate-200 rounded disabled:opacity-50"
                >
                  Dn
                </button>
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={item.topic}
                  onChange={(e) => updateItem(item.id, 'topic', e.target.value)}
                  placeholder="Agenda topic"
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
                <div className="flex gap-2">
                  <select
                    value={item.duration}
                    onChange={(e) => updateItem(item.id, 'duration', parseInt(e.target.value))}
                    className="px-3 py-2 border border-slate-300 rounded"
                  >
                    {[5, 10, 15, 20, 30, 45, 60].map((d) => (
                      <option key={d} value={d}>{d} min</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={item.presenter}
                    onChange={(e) => updateItem(item.id, 'presenter', e.target.value)}
                    placeholder="Presenter"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="px-2 py-2 text-red-500 hover:bg-red-50 rounded"
              >
                X
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addItem}
          className="w-full mt-3 py-2 border-2 border-dashed border-slate-300 rounded text-slate-500 hover:border-blue-500 hover:text-blue-500"
        >
          + {t('tools.agendaCreator.addItem')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.agendaCreator.preview')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono">
          {generateAgenda()}
        </pre>
        <button
          onClick={copyAgenda}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.agendaCreator.copy')}
        </button>
      </div>
    </div>
  )
}
