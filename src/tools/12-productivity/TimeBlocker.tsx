import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface TimeBlock {
  id: string
  title: string
  startTime: string
  endTime: string
  color: string
  notes?: string
}

export default function TimeBlocker() {
  const { t } = useTranslation()
  const [blocks, setBlocks] = useState<TimeBlock[]>([])
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [color, setColor] = useState('#3b82f6')
  const [notes, setNotes] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
  ]

  useEffect(() => {
    const saved = localStorage.getItem(`time-blocks-${selectedDate}`)
    if (saved) setBlocks(JSON.parse(saved))
    else setBlocks([])
  }, [selectedDate])

  const saveBlocks = (updated: TimeBlock[]) => {
    setBlocks(updated)
    localStorage.setItem(`time-blocks-${selectedDate}`, JSON.stringify(updated))
  }

  const addBlock = () => {
    if (!title.trim()) return
    const block: TimeBlock = {
      id: Date.now().toString(),
      title,
      startTime,
      endTime,
      color,
      notes: notes || undefined
    }
    saveBlocks([...blocks, block].sort((a, b) => a.startTime.localeCompare(b.startTime)))
    setTitle('')
    setNotes('')
  }

  const deleteBlock = (id: string) => {
    saveBlocks(blocks.filter(b => b.id !== id))
  }

  const getBlockDuration = (start: string, end: string) => {
    const [startH, startM] = start.split(':').map(Number)
    const [endH, endM] = end.split(':').map(Number)
    const startMins = startH * 60 + startM
    const endMins = endH * 60 + endM
    const duration = endMins - startMins
    const hours = Math.floor(duration / 60)
    const mins = duration % 60
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`
    if (hours > 0) return `${hours}h`
    return `${mins}m`
  }

  const getTotalScheduled = () => {
    let total = 0
    blocks.forEach(block => {
      const [startH, startM] = block.startTime.split(':').map(Number)
      const [endH, endM] = block.endTime.split(':').map(Number)
      total += (endH * 60 + endM) - (startH * 60 + startM)
    })
    const hours = Math.floor(total / 60)
    const mins = total % 60
    return `${hours}h ${mins}m`
  }

  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="text-sm text-slate-600 block mb-2">
          {t('tools.timeBlocker.date')}
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4 space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('tools.timeBlocker.blockTitle')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-600 block mb-1">
              {t('tools.timeBlocker.startTime')}
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-2 py-1 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600 block mb-1">
              {t('tools.timeBlocker.endTime')}
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-2 py-1 border border-slate-300 rounded"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-600 block mb-1">
            {t('tools.timeBlocker.color')}
          </label>
          <div className="flex gap-2 flex-wrap">
            {colors.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full ${color === c ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('tools.timeBlocker.notes')}
          className="w-full px-3 py-2 border border-slate-300 rounded h-20"
        />

        <button
          onClick={addBlock}
          disabled={!title.trim()}
          className="w-full py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {t('tools.timeBlocker.addBlock')}
        </button>
      </div>

      <div className="card p-4">
        <div className="flex justify-between mb-3">
          <h3 className="font-medium">{t('tools.timeBlocker.schedule')}</h3>
          <span className="text-sm text-slate-500">
            {t('tools.timeBlocker.totalScheduled')}: {getTotalScheduled()}
          </span>
        </div>

        <div className="space-y-1 max-h-96 overflow-y-auto">
          {blocks.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              {t('tools.timeBlocker.noBlocks')}
            </div>
          ) : (
            blocks.map(block => (
              <div
                key={block.id}
                className="p-3 rounded border-l-4 bg-slate-50"
                style={{ borderColor: block.color }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{block.title}</div>
                    <div className="text-sm text-slate-500">
                      {block.startTime} - {block.endTime} ({getBlockDuration(block.startTime, block.endTime)})
                    </div>
                    {block.notes && (
                      <div className="text-xs text-slate-400 mt-1">{block.notes}</div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteBlock(block.id)}
                    className="text-red-500 text-sm"
                  >
                    {t('tools.timeBlocker.delete')}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium mb-2">{t('tools.timeBlocker.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>- {t('tools.timeBlocker.tip1')}</li>
          <li>- {t('tools.timeBlocker.tip2')}</li>
          <li>- {t('tools.timeBlocker.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
