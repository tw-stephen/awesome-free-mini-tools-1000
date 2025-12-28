import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface Lap {
  number: number
  time: number
  diff: number
}

export default function Stopwatch() {
  const { t } = useTranslation()
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState<Lap[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)
  const accumulatedTimeRef = useRef<number>(0)

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - accumulatedTimeRef.current
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current)
      }, 10)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      accumulatedTimeRef.current = time
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const stop = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    setIsRunning(false)
    setTime(0)
    accumulatedTimeRef.current = 0
    setLaps([])
  }, [])

  const lap = useCallback(() => {
    const previousLapTime = laps.length > 0 ? laps[0].time : 0
    const diff = time - previousLapTime
    setLaps([
      { number: laps.length + 1, time, diff },
      ...laps,
    ])
  }, [time, laps])

  const formatTime = (ms: number, includeMs: boolean = true) => {
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const milliseconds = Math.floor((ms % 1000) / 10)

    const parts = []
    if (hours > 0) {
      parts.push(hours.toString().padStart(2, '0'))
    }
    parts.push(minutes.toString().padStart(2, '0'))
    parts.push(seconds.toString().padStart(2, '0'))

    const timeStr = parts.join(':')
    if (includeMs) {
      return `${timeStr}.${milliseconds.toString().padStart(2, '0')}`
    }
    return timeStr
  }

  const getBestLap = () => {
    if (laps.length < 2) return null
    return laps.reduce((best, lap) =>
      lap.diff < best.diff ? lap : best
    )
  }

  const getWorstLap = () => {
    if (laps.length < 2) return null
    return laps.reduce((worst, lap) =>
      lap.diff > worst.diff ? lap : worst
    )
  }

  const bestLap = getBestLap()
  const worstLap = getWorstLap()

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="text-center mb-8">
          <div className="text-6xl font-mono font-bold text-slate-800 tabular-nums">
            {formatTime(time)}
          </div>
        </div>

        <div className="flex gap-3">
          {!isRunning ? (
            <>
              <button
                onClick={start}
                className="flex-1 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
              >
                {time === 0 ? t('tools.stopwatch.start') : t('tools.stopwatch.resume')}
              </button>
              {time > 0 && (
                <button
                  onClick={reset}
                  className="flex-1 py-3 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300"
                >
                  {t('tools.stopwatch.reset')}
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={stop}
                className="flex-1 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
              >
                {t('tools.stopwatch.stop')}
              </button>
              <button
                onClick={lap}
                className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
              >
                {t('tools.stopwatch.lap')}
              </button>
            </>
          )}
        </div>
      </div>

      {laps.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.stopwatch.laps')} ({laps.length})
          </h3>

          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b">
                  <th className="text-left py-2 text-slate-500">#</th>
                  <th className="text-right py-2 text-slate-500">{t('tools.stopwatch.lapTime')}</th>
                  <th className="text-right py-2 text-slate-500">{t('tools.stopwatch.totalTime')}</th>
                </tr>
              </thead>
              <tbody>
                {laps.map((lap) => {
                  const isBest = bestLap && lap.number === bestLap.number
                  const isWorst = worstLap && lap.number === worstLap.number

                  return (
                    <tr
                      key={lap.number}
                      className={`border-b border-slate-100 ${
                        isBest ? 'bg-green-50' : isWorst ? 'bg-red-50' : ''
                      }`}
                    >
                      <td className="py-2">
                        <span className="flex items-center gap-1">
                          {lap.number}
                          {isBest && (
                            <span className="text-xs bg-green-500 text-white px-1 rounded">
                              {t('tools.stopwatch.best')}
                            </span>
                          )}
                          {isWorst && (
                            <span className="text-xs bg-red-500 text-white px-1 rounded">
                              {t('tools.stopwatch.worst')}
                            </span>
                          )}
                        </span>
                      </td>
                      <td className={`text-right font-mono ${
                        isBest ? 'text-green-600' : isWorst ? 'text-red-600' : ''
                      }`}>
                        {formatTime(lap.diff, false)}
                      </td>
                      <td className="text-right font-mono text-slate-500">
                        {formatTime(lap.time)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {laps.length >= 2 && (
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t">
              <div className="text-center p-2 bg-slate-50 rounded">
                <div className="text-xs text-slate-500">{t('tools.stopwatch.average')}</div>
                <div className="font-mono font-medium">
                  {formatTime(laps.reduce((sum, lap) => sum + lap.diff, 0) / laps.length, false)}
                </div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="text-xs text-slate-500">{t('tools.stopwatch.fastest')}</div>
                <div className="font-mono font-medium text-green-600">
                  {bestLap && formatTime(bestLap.diff, false)}
                </div>
              </div>
              <div className="text-center p-2 bg-red-50 rounded">
                <div className="text-xs text-slate-500">{t('tools.stopwatch.slowest')}</div>
                <div className="font-mono font-medium text-red-600">
                  {worstLap && formatTime(worstLap.diff, false)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.stopwatch.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.stopwatch.tip1')}</li>
          <li>{t('tools.stopwatch.tip2')}</li>
          <li>{t('tools.stopwatch.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
