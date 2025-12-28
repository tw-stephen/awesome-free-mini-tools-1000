import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface HeartRateEntry {
  id: number
  bpm: number
  date: string
  time: string
  activity: string
}

export default function HeartRateMonitor() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<HeartRateEntry[]>([])
  const [manualBpm, setManualBpm] = useState('')
  const [tapCount, setTapCount] = useState(0)
  const [tapTimes, setTapTimes] = useState<number[]>([])
  const [calculatedBpm, setCalculatedBpm] = useState<number | null>(null)
  const [activity, setActivity] = useState('resting')
  const timerRef = useRef<number | null>(null)

  const activities = ['resting', 'walking', 'exercise', 'postExercise']

  useEffect(() => {
    const saved = localStorage.getItem('heart-rate-monitor')
    if (saved) {
      try {
        setEntries(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load heart rate data')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('heart-rate-monitor', JSON.stringify(entries))
  }, [entries])

  const handleTap = () => {
    const now = Date.now()
    const newTapTimes = [...tapTimes, now].filter(t => now - t < 15000)
    setTapTimes(newTapTimes)
    setTapCount(newTapTimes.length)

    if (newTapTimes.length >= 3) {
      const intervals: number[] = []
      for (let i = 1; i < newTapTimes.length; i++) {
        intervals.push(newTapTimes[i] - newTapTimes[i - 1])
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
      const bpm = Math.round(60000 / avgInterval)
      setCalculatedBpm(bpm)
    }

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      setTapTimes([])
      setTapCount(0)
      setCalculatedBpm(null)
    }, 5000)
  }

  const saveEntry = (bpm: number) => {
    const entry: HeartRateEntry = {
      id: Date.now(),
      bpm,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      activity,
    }
    setEntries([entry, ...entries])
    setManualBpm('')
    setCalculatedBpm(null)
    setTapTimes([])
    setTapCount(0)
  }

  const deleteEntry = (id: number) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  const getZone = (bpm: number) => {
    if (bpm < 60) return { label: t('tools.heartRateMonitor.low'), color: 'text-blue-600' }
    if (bpm < 100) return { label: t('tools.heartRateMonitor.normal'), color: 'text-green-600' }
    if (bpm < 140) return { label: t('tools.heartRateMonitor.elevated'), color: 'text-yellow-600' }
    if (bpm < 170) return { label: t('tools.heartRateMonitor.high'), color: 'text-orange-600' }
    return { label: t('tools.heartRateMonitor.max'), color: 'text-red-600' }
  }

  const todayEntries = entries.filter(e => e.date === new Date().toISOString().split('T')[0])
  const avgBpm = todayEntries.length > 0
    ? Math.round(todayEntries.reduce((sum, e) => sum + e.bpm, 0) / todayEntries.length)
    : null

  return (
    <div className="space-y-4">
      <div className="card p-6 text-center">
        <button
          onClick={handleTap}
          className="w-32 h-32 rounded-full bg-red-500 text-white flex items-center justify-center mx-auto hover:bg-red-600 active:scale-95 transition"
        >
          <div>
            <div className="text-4xl">❤️</div>
            <div className="text-sm">{t('tools.heartRateMonitor.tap')}</div>
          </div>
        </button>
        <p className="text-sm text-slate-500 mt-4">
          {t('tools.heartRateMonitor.tapInstructions')}
        </p>
        {tapCount > 0 && (
          <div className="mt-2 text-sm text-slate-600">
            {t('tools.heartRateMonitor.taps')}: {tapCount}
          </div>
        )}
        {calculatedBpm && (
          <div className="mt-4">
            <div className="text-4xl font-bold text-red-600">{calculatedBpm} BPM</div>
            <div className={`text-lg ${getZone(calculatedBpm).color}`}>
              {getZone(calculatedBpm).label}
            </div>
            <button
              onClick={() => saveEntry(calculatedBpm)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              {t('tools.heartRateMonitor.saveReading')}
            </button>
          </div>
        )}
      </div>

      <div className="card p-4 space-y-3">
        <h3 className="text-sm font-medium text-slate-700">{t('tools.heartRateMonitor.manualEntry')}</h3>
        <div className="flex gap-2">
          <input
            type="number"
            value={manualBpm}
            onChange={(e) => setManualBpm(e.target.value)}
            placeholder="72"
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
          />
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded"
          >
            {activities.map(a => (
              <option key={a} value={a}>{t(`tools.heartRateMonitor.${a}`)}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => manualBpm && saveEntry(parseInt(manualBpm))}
          disabled={!manualBpm}
          className="w-full py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {t('tools.heartRateMonitor.save')}
        </button>
      </div>

      {avgBpm && (
        <div className="card p-4 text-center bg-red-50">
          <div className="text-sm text-slate-600">{t('tools.heartRateMonitor.todayAvg')}</div>
          <div className="text-3xl font-bold text-red-600">{avgBpm} BPM</div>
        </div>
      )}

      {entries.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.heartRateMonitor.history')}</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {entries.slice(0, 20).map(entry => (
              <div key={entry.id} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                <div>
                  <div className="font-medium text-red-600">{entry.bpm} BPM</div>
                  <div className="text-xs text-slate-500">
                    {entry.date} {entry.time} • {t(`tools.heartRateMonitor.${entry.activity}`)}
                  </div>
                </div>
                <button onClick={() => deleteEntry(entry.id)} className="text-red-500">×</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
