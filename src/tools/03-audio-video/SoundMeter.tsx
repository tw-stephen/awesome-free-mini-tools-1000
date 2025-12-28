import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function SoundMeter() {
  const { t } = useTranslation()
  const [isListening, setIsListening] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(0)
  const [peakLevel, setPeakLevel] = useState(0)
  const [avgLevel, setAvgLevel] = useState(0)
  const [minLevel, setMinLevel] = useState(100)
  const [maxLevel, setMaxLevel] = useState(0)

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number>(0)
  const levelsRef = useRef<number[]>([])

  const calculateDecibels = (dataArray: Uint8Array): number => {
    let sum = 0
    for (let i = 0; i < dataArray.length; i++) {
      const normalized = (dataArray[i] - 128) / 128
      sum += normalized * normalized
    }
    const rms = Math.sqrt(sum / dataArray.length)
    const db = 20 * Math.log10(rms + 0.0001)
    // Normalize to 0-100 range (roughly -60dB to 0dB)
    return Math.max(0, Math.min(100, (db + 60) * (100 / 60)))
  }

  const analyze = useCallback(() => {
    const analyser = analyserRef.current
    if (!analyser) return

    const bufferLength = analyser.fftSize
    const dataArray = new Uint8Array(bufferLength)

    analyser.getByteTimeDomainData(dataArray)
    const level = calculateDecibels(dataArray)

    setCurrentLevel(level)

    levelsRef.current.push(level)
    if (levelsRef.current.length > 100) {
      levelsRef.current.shift()
    }

    const avg = levelsRef.current.reduce((a, b) => a + b, 0) / levelsRef.current.length
    setAvgLevel(avg)

    if (level > peakLevel) {
      setPeakLevel(level)
    }

    if (level > maxLevel) {
      setMaxLevel(level)
    }

    if (level < minLevel && level > 0) {
      setMinLevel(level)
    }

    animationRef.current = requestAnimationFrame(analyze)
  }, [peakLevel, maxLevel, minLevel])

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 2048

      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      audioContextRef.current = audioContext
      analyserRef.current = analyser

      levelsRef.current = []
      setPeakLevel(0)
      setMinLevel(100)
      setMaxLevel(0)
      setAvgLevel(0)

      setIsListening(true)
      analyze()
    } catch (error) {
      console.error('Failed to access microphone:', error)
      alert(t('tools.soundMeter.micPermissionError'))
    }
  }, [analyze, t])

  const stopListening = useCallback(() => {
    cancelAnimationFrame(animationRef.current)

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
    }

    streamRef.current = null
    audioContextRef.current = null
    analyserRef.current = null

    setIsListening(false)
  }, [])

  const resetStats = () => {
    setPeakLevel(0)
    setMinLevel(100)
    setMaxLevel(0)
    setAvgLevel(0)
    levelsRef.current = []
  }

  const getColor = (level: number): string => {
    if (level < 30) return 'bg-green-500'
    if (level < 60) return 'bg-yellow-500'
    if (level < 80) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getLevelLabel = (level: number): string => {
    if (level < 20) return t('tools.soundMeter.quiet')
    if (level < 40) return t('tools.soundMeter.normal')
    if (level < 60) return t('tools.soundMeter.moderate')
    if (level < 80) return t('tools.soundMeter.loud')
    return t('tools.soundMeter.veryLoud')
  }

  useEffect(() => {
    return () => {
      stopListening()
    }
  }, [stopListening])

  // Reset peak after 3 seconds
  useEffect(() => {
    if (!isListening) return

    const interval = setInterval(() => {
      setPeakLevel((prev) => Math.max(currentLevel, prev * 0.95))
    }, 100)

    return () => clearInterval(interval)
  }, [isListening, currentLevel])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="12"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke={currentLevel < 60 ? '#22c55e' : currentLevel < 80 ? '#f59e0b' : '#ef4444'}
                strokeWidth="12"
                strokeDasharray={`${(currentLevel / 100) * 553} 553`}
                strokeLinecap="round"
                className="transition-all duration-100"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-slate-700">
                {Math.round(currentLevel)}
              </div>
              <div className="text-sm text-slate-500">
                {getLevelLabel(currentLevel)}
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm">
            <div className="h-8 bg-slate-200 rounded-full overflow-hidden relative">
              <div
                className={`h-full ${getColor(currentLevel)} transition-all duration-100`}
                style={{ width: `${currentLevel}%` }}
              />
              {peakLevel > 0 && (
                <div
                  className="absolute top-0 bottom-0 w-1 bg-red-600"
                  style={{ left: `${peakLevel}%` }}
                />
              )}
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={isListening ? stopListening : startListening}
            >
              {isListening ? t('tools.soundMeter.stop') : t('tools.soundMeter.start')}
            </Button>
            {isListening && (
              <Button variant="secondary" onClick={resetStats}>
                {t('tools.soundMeter.reset')}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.soundMeter.statistics')}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-700">
              {Math.round(currentLevel)}
            </div>
            <div className="text-xs text-slate-500">
              {t('tools.soundMeter.current')}
            </div>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(avgLevel)}
            </div>
            <div className="text-xs text-slate-500">
              {t('tools.soundMeter.average')}
            </div>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {minLevel < 100 ? Math.round(minLevel) : 0}
            </div>
            <div className="text-xs text-slate-500">
              {t('tools.soundMeter.min')}
            </div>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {Math.round(maxLevel)}
            </div>
            <div className="text-xs text-slate-500">
              {t('tools.soundMeter.max')}
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.soundMeter.reference')}
        </h3>
        <div className="space-y-2 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span>0-30: {t('tools.soundMeter.quiet')} ({t('tools.soundMeter.library')})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500" />
            <span>30-60: {t('tools.soundMeter.normal')} ({t('tools.soundMeter.conversation')})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500" />
            <span>60-80: {t('tools.soundMeter.loud')} ({t('tools.soundMeter.traffic')})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span>80-100: {t('tools.soundMeter.veryLoud')} ({t('tools.soundMeter.harmful')})</span>
          </div>
        </div>
      </div>
    </div>
  )
}
