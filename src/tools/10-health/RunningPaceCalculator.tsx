import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function RunningPaceCalculator() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'pace' | 'time' | 'distance'>('pace')
  const [distance, setDistance] = useState('')
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')
  const [seconds, setSeconds] = useState('')
  const [paceMin, setPaceMin] = useState('')
  const [paceSec, setPaceSec] = useState('')
  const [unit, setUnit] = useState<'km' | 'mi'>('km')
  const [result, setResult] = useState<string | null>(null)

  const calculate = () => {
    if (mode === 'pace') {
      const dist = parseFloat(distance)
      const totalSeconds = (parseInt(hours) || 0) * 3600 + (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0)

      if (isNaN(dist) || dist <= 0 || totalSeconds <= 0) return

      const paceSecondsPerUnit = totalSeconds / dist
      const paceM = Math.floor(paceSecondsPerUnit / 60)
      const paceS = Math.floor(paceSecondsPerUnit % 60)

      setResult(`${paceM}:${paceS.toString().padStart(2, '0')} /${unit}`)
    } else if (mode === 'time') {
      const dist = parseFloat(distance)
      const paceSeconds = (parseInt(paceMin) || 0) * 60 + (parseInt(paceSec) || 0)

      if (isNaN(dist) || dist <= 0 || paceSeconds <= 0) return

      const totalSeconds = dist * paceSeconds
      const h = Math.floor(totalSeconds / 3600)
      const m = Math.floor((totalSeconds % 3600) / 60)
      const s = Math.floor(totalSeconds % 60)

      setResult(`${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`)
    } else {
      const totalSeconds = (parseInt(hours) || 0) * 3600 + (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0)
      const paceSeconds = (parseInt(paceMin) || 0) * 60 + (parseInt(paceSec) || 0)

      if (totalSeconds <= 0 || paceSeconds <= 0) return

      const dist = totalSeconds / paceSeconds
      setResult(`${dist.toFixed(2)} ${unit}`)
    }
  }

  const presets = [
    { name: '5K', distance: 5 },
    { name: '10K', distance: 10 },
    { name: t('tools.runningPaceCalculator.halfMarathon'), distance: 21.0975 },
    { name: t('tools.runningPaceCalculator.marathon'), distance: 42.195 },
  ]

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setUnit('km')}
          className={`flex-1 py-2 rounded ${unit === 'km' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
        >
          km
        </button>
        <button
          onClick={() => setUnit('mi')}
          className={`flex-1 py-2 rounded ${unit === 'mi' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
        >
          mi
        </button>
      </div>

      <div className="flex gap-2">
        {(['pace', 'time', 'distance'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setResult(null) }}
            className={`flex-1 py-2 rounded text-sm ${mode === m ? 'bg-green-500 text-white' : 'bg-slate-100'}`}
          >
            {t(`tools.runningPaceCalculator.calculate${m.charAt(0).toUpperCase() + m.slice(1)}`)}
          </button>
        ))}
      </div>

      <div className="card p-4 space-y-4">
        {mode !== 'distance' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.runningPaceCalculator.distance')} ({unit})
            </label>
            <input
              type="number"
              step="0.01"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="5"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <div className="flex gap-2 mt-2">
              {presets.map(p => (
                <button
                  key={p.name}
                  onClick={() => setDistance((unit === 'km' ? p.distance : p.distance * 0.621371).toFixed(2))}
                  className="px-3 py-1 bg-slate-100 rounded text-xs"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {mode !== 'time' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.runningPaceCalculator.time')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-slate-300 rounded text-center"
                />
                <span className="text-xs text-slate-500 block text-center">h</span>
              </div>
              <div>
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  placeholder="30"
                  className="w-full px-3 py-2 border border-slate-300 rounded text-center"
                />
                <span className="text-xs text-slate-500 block text-center">min</span>
              </div>
              <div>
                <input
                  type="number"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-slate-300 rounded text-center"
                />
                <span className="text-xs text-slate-500 block text-center">sec</span>
              </div>
            </div>
          </div>
        )}

        {mode !== 'pace' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.runningPaceCalculator.pace')} (/{unit})
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="number"
                  value={paceMin}
                  onChange={(e) => setPaceMin(e.target.value)}
                  placeholder="6"
                  className="w-full px-3 py-2 border border-slate-300 rounded text-center"
                />
                <span className="text-xs text-slate-500 block text-center">min</span>
              </div>
              <div>
                <input
                  type="number"
                  value={paceSec}
                  onChange={(e) => setPaceSec(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-slate-300 rounded text-center"
                />
                <span className="text-xs text-slate-500 block text-center">sec</span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={calculate}
          className="w-full py-2 bg-green-500 text-white rounded font-medium"
        >
          {t('tools.runningPaceCalculator.calculate')}
        </button>
      </div>

      {result && (
        <div className="card p-6 text-center bg-green-50">
          <div className="text-sm text-slate-600">
            {mode === 'pace' && t('tools.runningPaceCalculator.yourPace')}
            {mode === 'time' && t('tools.runningPaceCalculator.finishTime')}
            {mode === 'distance' && t('tools.runningPaceCalculator.distanceCovered')}
          </div>
          <div className="text-4xl font-bold text-green-600">{result}</div>
        </div>
      )}
    </div>
  )
}
