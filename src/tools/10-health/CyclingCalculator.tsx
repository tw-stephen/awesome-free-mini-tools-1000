import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface CycleEntry {
  id: number
  date: string
  distance: number
  duration: number
  avgSpeed: number
  calories: number
  type: string
  notes: string
}

export default function CyclingCalculator() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<CycleEntry[]>([])
  const [mode, setMode] = useState<'calculator' | 'log' | 'add'>('calculator')
  const [calcMode, setCalcMode] = useState<'speed' | 'time' | 'distance'>('speed')
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [speed, setSpeed] = useState('')
  const [weight, setWeight] = useState('70')
  const [calcResult, setCalcResult] = useState<{ speed?: number; time?: number; distance?: number; calories?: number } | null>(null)
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    distance: '',
    duration: '',
    type: 'road',
    notes: '',
  })

  const cycleTypes = ['road', 'mountain', 'commute', 'leisure', 'indoor']
  const metValues: Record<string, number> = {
    road: 8.0,
    mountain: 8.5,
    commute: 6.0,
    leisure: 4.0,
    indoor: 7.0,
  }

  useEffect(() => {
    const saved = localStorage.getItem('cycling-calculator')
    if (saved) {
      try {
        setEntries(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load cycling data')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cycling-calculator', JSON.stringify(entries))
  }, [entries])

  const calculate = () => {
    const w = parseFloat(weight)
    let result: { speed?: number; time?: number; distance?: number; calories?: number } = {}

    if (calcMode === 'speed') {
      const d = parseFloat(distance)
      const t = parseFloat(duration)
      if (isNaN(d) || isNaN(t) || t === 0) return
      const s = d / (t / 60) // km/h
      const calories = Math.round((metValues.road * w * t) / 60)
      result = { speed: parseFloat(s.toFixed(1)), calories }
    } else if (calcMode === 'time') {
      const d = parseFloat(distance)
      const s = parseFloat(speed)
      if (isNaN(d) || isNaN(s) || s === 0) return
      const t = (d / s) * 60 // minutes
      const calories = Math.round((metValues.road * w * t) / 60)
      result = { time: parseFloat(t.toFixed(0)), calories }
    } else if (calcMode === 'distance') {
      const t = parseFloat(duration)
      const s = parseFloat(speed)
      if (isNaN(t) || isNaN(s)) return
      const d = (s * t) / 60 // km
      const calories = Math.round((metValues.road * w * t) / 60)
      result = { distance: parseFloat(d.toFixed(1)), calories }
    }

    setCalcResult(result)
  }

  const addEntry = () => {
    if (!newEntry.distance || !newEntry.duration) return

    const d = parseFloat(newEntry.distance)
    const t = parseFloat(newEntry.duration)
    const avgSpeed = parseFloat((d / (t / 60)).toFixed(1))
    const w = parseFloat(weight)
    const calories = Math.round((metValues[newEntry.type] * w * t) / 60)

    const entry: CycleEntry = {
      id: Date.now(),
      date: newEntry.date,
      distance: d,
      duration: t,
      avgSpeed,
      calories,
      type: newEntry.type,
      notes: newEntry.notes,
    }
    setEntries([entry, ...entries])
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      distance: '',
      duration: '',
      type: 'road',
      notes: '',
    })
    setMode('log')
  }

  const deleteEntry = (id: number) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }

  const thisMonth = entries.filter(e => {
    const entryDate = new Date(e.date)
    const now = new Date()
    return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear()
  })

  const totalDistance = thisMonth.reduce((sum, e) => sum + e.distance, 0)
  const totalDuration = thisMonth.reduce((sum, e) => sum + e.duration, 0)
  const totalCalories = thisMonth.reduce((sum, e) => sum + e.calories, 0)

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('calculator')}
          className={`flex-1 py-2 rounded ${mode === 'calculator' ? 'bg-green-500 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.cyclingCalculator.calculator')}
        </button>
        <button
          onClick={() => setMode('log')}
          className={`flex-1 py-2 rounded ${mode === 'log' ? 'bg-green-500 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.cyclingCalculator.log')}
        </button>
      </div>

      {mode === 'calculator' && (
        <>
          <div className="card p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('tools.cyclingCalculator.calculateFor')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => { setCalcMode('speed'); setCalcResult(null) }}
                  className={`py-2 rounded text-sm ${
                    calcMode === 'speed' ? 'bg-green-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {t('tools.cyclingCalculator.speed')}
                </button>
                <button
                  onClick={() => { setCalcMode('time'); setCalcResult(null) }}
                  className={`py-2 rounded text-sm ${
                    calcMode === 'time' ? 'bg-green-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {t('tools.cyclingCalculator.time')}
                </button>
                <button
                  onClick={() => { setCalcMode('distance'); setCalcResult(null) }}
                  className={`py-2 rounded text-sm ${
                    calcMode === 'distance' ? 'bg-green-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {t('tools.cyclingCalculator.distance')}
                </button>
              </div>
            </div>

            {calcMode === 'speed' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('tools.cyclingCalculator.distance')} (km)
                  </label>
                  <input
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    placeholder="20"
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('tools.cyclingCalculator.time')} (min)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="60"
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
              </div>
            )}

            {calcMode === 'time' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('tools.cyclingCalculator.distance')} (km)
                  </label>
                  <input
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    placeholder="20"
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('tools.cyclingCalculator.speed')} (km/h)
                  </label>
                  <input
                    type="number"
                    value={speed}
                    onChange={(e) => setSpeed(e.target.value)}
                    placeholder="25"
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
              </div>
            )}

            {calcMode === 'distance' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('tools.cyclingCalculator.time')} (min)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="60"
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('tools.cyclingCalculator.speed')} (km/h)
                  </label>
                  <input
                    type="number"
                    value={speed}
                    onChange={(e) => setSpeed(e.target.value)}
                    placeholder="25"
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.cyclingCalculator.weight')} (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>

            <button
              onClick={calculate}
              className="w-full py-2 bg-green-500 text-white rounded font-medium"
            >
              {t('tools.cyclingCalculator.calculate')}
            </button>
          </div>

          {calcResult && (
            <div className="card p-6 text-center bg-green-50">
              {calcResult.speed !== undefined && (
                <>
                  <div className="text-sm text-slate-600">{t('tools.cyclingCalculator.avgSpeed')}</div>
                  <div className="text-4xl font-bold text-green-600">{calcResult.speed} km/h</div>
                </>
              )}
              {calcResult.time !== undefined && (
                <>
                  <div className="text-sm text-slate-600">{t('tools.cyclingCalculator.estimatedTime')}</div>
                  <div className="text-4xl font-bold text-green-600">{formatDuration(calcResult.time)}</div>
                </>
              )}
              {calcResult.distance !== undefined && (
                <>
                  <div className="text-sm text-slate-600">{t('tools.cyclingCalculator.estimatedDistance')}</div>
                  <div className="text-4xl font-bold text-green-600">{calcResult.distance} km</div>
                </>
              )}
              {calcResult.calories && (
                <div className="text-sm text-orange-600 mt-2">
                  ~{calcResult.calories} {t('tools.cyclingCalculator.caloriesBurned')}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {mode === 'log' && (
        <>
          <button
            onClick={() => setMode('add')}
            className="w-full py-3 bg-green-500 text-white rounded font-medium"
          >
            + {t('tools.cyclingCalculator.logRide')}
          </button>

          {entries.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              <div className="card p-3 text-center">
                <div className="text-xl font-bold text-green-600">{totalDistance.toFixed(1)}km</div>
                <div className="text-xs text-slate-500">{t('tools.cyclingCalculator.thisMonth')}</div>
              </div>
              <div className="card p-3 text-center">
                <div className="text-xl font-bold text-blue-600">{formatDuration(totalDuration)}</div>
                <div className="text-xs text-slate-500">{t('tools.cyclingCalculator.time')}</div>
              </div>
              <div className="card p-3 text-center">
                <div className="text-xl font-bold text-orange-600">{totalCalories}</div>
                <div className="text-xs text-slate-500">{t('tools.cyclingCalculator.calories')}</div>
              </div>
            </div>
          )}

          {entries.length === 0 ? (
            <div className="card p-6 text-center text-slate-500">
              {t('tools.cyclingCalculator.noRides')}
            </div>
          ) : (
            <div className="space-y-2">
              {entries.slice(0, 20).map(entry => (
                <div key={entry.id} className="card p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs text-slate-500">{entry.date}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-medium">{entry.distance}km</span>
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                          {t(`tools.cyclingCalculator.${entry.type}`)}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        {formatDuration(entry.duration)} • {entry.avgSpeed}km/h
                      </div>
                      <div className="text-xs text-orange-600">{entry.calories} kcal</div>
                    </div>
                    <button onClick={() => deleteEntry(entry.id)} className="text-red-500">×</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {mode === 'add' && (
        <div className="card p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.cyclingCalculator.date')}
            </label>
            <input
              type="date"
              value={newEntry.date}
              onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.cyclingCalculator.rideType')}
            </label>
            <div className="flex flex-wrap gap-2">
              {cycleTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setNewEntry({ ...newEntry, type })}
                  className={`px-3 py-1.5 rounded text-sm ${
                    newEntry.type === type ? 'bg-green-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {t(`tools.cyclingCalculator.${type}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.cyclingCalculator.distance')} (km) *
              </label>
              <input
                type="number"
                step="0.1"
                value={newEntry.distance}
                onChange={(e) => setNewEntry({ ...newEntry, distance: e.target.value })}
                placeholder="20"
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('tools.cyclingCalculator.time')} (min) *
              </label>
              <input
                type="number"
                value={newEntry.duration}
                onChange={(e) => setNewEntry({ ...newEntry, duration: e.target.value })}
                placeholder="60"
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.cyclingCalculator.notes')}
            </label>
            <textarea
              value={newEntry.notes}
              onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <button onClick={() => setMode('log')} className="flex-1 py-2 bg-slate-100 rounded">
              {t('common.cancel')}
            </button>
            <button
              onClick={addEntry}
              disabled={!newEntry.distance || !newEntry.duration}
              className="flex-1 py-2 bg-green-500 text-white rounded disabled:opacity-50"
            >
              {t('tools.cyclingCalculator.save')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
