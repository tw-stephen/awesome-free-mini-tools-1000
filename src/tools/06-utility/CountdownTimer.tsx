import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export default function CountdownTimer() {
  const { t } = useTranslation()
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(5)
  const [seconds, setSeconds] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const presets = [
    { label: '1 min', value: 60 },
    { label: '5 min', value: 300 },
    { label: '10 min', value: 600 },
    { label: '15 min', value: 900 },
    { label: '30 min', value: 1800 },
    { label: '1 hr', value: 3600 },
  ]

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null

    if (isRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            playAlarm()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, isPaused, timeLeft])

  const playAlarm = () => {
    // Create a simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)

      // Play 3 beeps
      setTimeout(() => {
        const osc2 = audioContext.createOscillator()
        const gain2 = audioContext.createGain()
        osc2.connect(gain2)
        gain2.connect(audioContext.destination)
        osc2.frequency.value = 800
        gain2.gain.setValueAtTime(0.3, audioContext.currentTime)
        gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
        osc2.start(audioContext.currentTime)
        osc2.stop(audioContext.currentTime + 0.5)
      }, 600)
    } catch (e) {
      console.log('Audio not supported')
    }
  }

  const start = useCallback(() => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds
    if (totalSeconds > 0) {
      setTimeLeft(totalSeconds)
      setIsRunning(true)
      setIsPaused(false)
    }
  }, [hours, minutes, seconds])

  const pause = () => {
    setIsPaused(!isPaused)
  }

  const stop = () => {
    setIsRunning(false)
    setIsPaused(false)
    setTimeLeft(0)
  }

  const setPreset = (value: number) => {
    const h = Math.floor(value / 3600)
    const m = Math.floor((value % 3600) / 60)
    const s = value % 60
    setHours(h)
    setMinutes(m)
    setSeconds(s)
    if (!isRunning) {
      setTimeLeft(value)
    }
  }

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    return {
      hours: h.toString().padStart(2, '0'),
      minutes: m.toString().padStart(2, '0'),
      seconds: s.toString().padStart(2, '0'),
    }
  }

  const displayTime = formatTime(timeLeft)
  const progress = isRunning
    ? (timeLeft / (hours * 3600 + minutes * 60 + seconds)) * 100
    : 0

  return (
    <div className="space-y-4">
      <div className="card p-4">
        {!isRunning ? (
          <>
            <div className="flex justify-center gap-2 mb-4">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setPreset(preset.value)}
                  className="px-3 py-1 bg-slate-200 rounded text-sm hover:bg-slate-300"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="flex justify-center items-center gap-2 mb-6">
              <div className="text-center">
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(Math.max(0, Math.min(99, parseInt(e.target.value) || 0)))}
                  className="w-20 text-center text-3xl font-mono py-2 border border-slate-300 rounded"
                  min="0"
                  max="99"
                />
                <div className="text-xs text-slate-500 mt-1">{t('tools.countdownTimer.hours')}</div>
              </div>
              <span className="text-3xl font-bold text-slate-400">:</span>
              <div className="text-center">
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="w-20 text-center text-3xl font-mono py-2 border border-slate-300 rounded"
                  min="0"
                  max="59"
                />
                <div className="text-xs text-slate-500 mt-1">{t('tools.countdownTimer.minutes')}</div>
              </div>
              <span className="text-3xl font-bold text-slate-400">:</span>
              <div className="text-center">
                <input
                  type="number"
                  value={seconds}
                  onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="w-20 text-center text-3xl font-mono py-2 border border-slate-300 rounded"
                  min="0"
                  max="59"
                />
                <div className="text-xs text-slate-500 mt-1">{t('tools.countdownTimer.seconds')}</div>
              </div>
            </div>

            <button
              onClick={start}
              disabled={hours === 0 && minutes === 0 && seconds === 0}
              className="w-full py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('tools.countdownTimer.start')}
            </button>
          </>
        ) : (
          <>
            <div className="relative mb-6">
              <div className="text-center">
                <div className="text-6xl font-mono font-bold text-slate-800">
                  {displayTime.hours}:{displayTime.minutes}:{displayTime.seconds}
                </div>
                {timeLeft === 0 && (
                  <div className="text-2xl text-red-500 font-bold mt-2 animate-pulse">
                    {t('tools.countdownTimer.timesUp')}
                  </div>
                )}
              </div>

              <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    timeLeft < 10 ? 'bg-red-500' : timeLeft < 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={pause}
                className={`flex-1 py-3 rounded-lg font-medium ${
                  isPaused
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-yellow-500 text-white hover:bg-yellow-600'
                }`}
              >
                {isPaused ? t('tools.countdownTimer.resume') : t('tools.countdownTimer.pause')}
              </button>
              <button
                onClick={stop}
                className="flex-1 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
              >
                {t('tools.countdownTimer.stop')}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.countdownTimer.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.countdownTimer.tip1')}</li>
          <li>{t('tools.countdownTimer.tip2')}</li>
          <li>{t('tools.countdownTimer.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
