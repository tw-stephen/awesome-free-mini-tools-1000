import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface BreathPattern {
  id: string
  name: string
  inhale: number
  hold1: number
  exhale: number
  hold2: number
  description: string
}

export default function BreathingExercise() {
  const { t } = useTranslation()
  const [selectedPattern, setSelectedPattern] = useState<BreathPattern | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale')
  const [timeLeft, setTimeLeft] = useState(0)
  const [cycles, setCycles] = useState(0)
  const [targetCycles, setTargetCycles] = useState(5)
  const [totalTime, setTotalTime] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const patterns: BreathPattern[] = [
    {
      id: 'box',
      name: 'Box Breathing',
      inhale: 4,
      hold1: 4,
      exhale: 4,
      hold2: 4,
      description: 'Equal parts inhale, hold, exhale, hold. Great for stress relief.',
    },
    {
      id: '478',
      name: '4-7-8 Relaxing',
      inhale: 4,
      hold1: 7,
      exhale: 8,
      hold2: 0,
      description: 'Calming technique for sleep and anxiety.',
    },
    {
      id: 'energizing',
      name: 'Energizing',
      inhale: 6,
      hold1: 0,
      exhale: 2,
      hold2: 0,
      description: 'Long inhale, short exhale to boost energy.',
    },
    {
      id: 'calm',
      name: 'Calming',
      inhale: 4,
      hold1: 0,
      exhale: 8,
      hold2: 0,
      description: 'Extended exhale activates parasympathetic nervous system.',
    },
    {
      id: 'simple',
      name: 'Simple Breath',
      inhale: 4,
      hold1: 0,
      exhale: 4,
      hold2: 0,
      description: 'Simple equal breathing for beginners.',
    },
  ]

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startExercise = (pattern: BreathPattern) => {
    setSelectedPattern(pattern)
    setIsRunning(true)
    setPhase('inhale')
    setTimeLeft(pattern.inhale)
    setCycles(0)
    setTotalTime(0)
    runTimer(pattern, 'inhale', pattern.inhale)
  }

  const runTimer = (pattern: BreathPattern, currentPhase: typeof phase, seconds: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    let remaining = seconds

    timerRef.current = setInterval(() => {
      remaining--
      setTimeLeft(remaining)
      setTotalTime(prev => prev + 1)

      if (remaining <= 0) {
        // Move to next phase
        const nextPhaseInfo = getNextPhase(pattern, currentPhase)
        if (nextPhaseInfo.phase === 'inhale' && currentPhase === 'hold2' ||
            (currentPhase === 'exhale' && pattern.hold2 === 0)) {
          setCycles(prev => {
            const newCycles = prev + 1
            if (newCycles >= targetCycles) {
              stopExercise()
              return newCycles
            }
            return newCycles
          })
        }

        if (nextPhaseInfo.duration > 0) {
          setPhase(nextPhaseInfo.phase)
          setTimeLeft(nextPhaseInfo.duration)
          runTimer(pattern, nextPhaseInfo.phase, nextPhaseInfo.duration)
        } else {
          // Skip phases with 0 duration
          const skipNext = getNextPhase(pattern, nextPhaseInfo.phase)
          setPhase(skipNext.phase)
          setTimeLeft(skipNext.duration)
          runTimer(pattern, skipNext.phase, skipNext.duration)
        }
      }
    }, 1000)
  }

  const getNextPhase = (pattern: BreathPattern, current: typeof phase) => {
    switch (current) {
      case 'inhale':
        return { phase: 'hold1' as const, duration: pattern.hold1 }
      case 'hold1':
        return { phase: 'exhale' as const, duration: pattern.exhale }
      case 'exhale':
        return { phase: 'hold2' as const, duration: pattern.hold2 }
      case 'hold2':
        return { phase: 'inhale' as const, duration: pattern.inhale }
    }
  }

  const stopExercise = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setIsRunning(false)
  }

  const getPhaseLabel = () => {
    switch (phase) {
      case 'inhale': return t('tools.breathing.inhale')
      case 'hold1': return t('tools.breathing.hold')
      case 'exhale': return t('tools.breathing.exhale')
      case 'hold2': return t('tools.breathing.hold')
    }
  }

  const getCircleScale = () => {
    if (!selectedPattern) return 1
    switch (phase) {
      case 'inhale':
        return 1 + (1 - timeLeft / selectedPattern.inhale) * 0.5
      case 'hold1':
        return 1.5
      case 'exhale':
        return 1.5 - (1 - timeLeft / selectedPattern.exhale) * 0.5
      case 'hold2':
        return 1
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      {isRunning && selectedPattern ? (
        <div className="card p-6">
          <div className="text-center mb-6">
            <h3 className="font-medium text-slate-700">{selectedPattern.name}</h3>
            <p className="text-sm text-slate-500">
              {t('tools.breathing.cycle')} {cycles + 1} / {targetCycles}
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <div
              className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center transition-transform duration-1000"
              style={{ transform: `scale(${getCircleScale()})` }}
            >
              <div className="text-center text-white">
                <div className="text-4xl font-bold">{timeLeft}</div>
                <div className="text-lg">{getPhaseLabel()}</div>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-slate-500 mb-4">
            {t('tools.breathing.totalTime')}: {formatTime(totalTime)}
          </div>

          <button
            onClick={stopExercise}
            className="w-full py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
          >
            {t('tools.breathing.stop')}
          </button>
        </div>
      ) : (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.breathing.selectPattern')}
            </h3>
            <div className="space-y-3">
              {patterns.map(pattern => (
                <div
                  key={pattern.id}
                  className="p-4 bg-slate-50 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{pattern.name}</h4>
                      <p className="text-sm text-slate-500">{pattern.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 text-xs text-slate-500">
                      <span>↑{pattern.inhale}s</span>
                      {pattern.hold1 > 0 && <span>⏸{pattern.hold1}s</span>}
                      <span>↓{pattern.exhale}s</span>
                      {pattern.hold2 > 0 && <span>⏸{pattern.hold2}s</span>}
                    </div>
                    <button
                      onClick={() => startExercise(pattern)}
                      className="px-4 py-2 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600"
                    >
                      {t('tools.breathing.start')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.breathing.settings')}
            </h3>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.breathing.cycles')}
              </label>
              <div className="flex gap-2">
                {[3, 5, 10, 15].map(n => (
                  <button
                    key={n}
                    onClick={() => setTargetCycles(n)}
                    className={`flex-1 py-2 rounded ${
                      targetCycles === n ? 'bg-blue-500 text-white' : 'bg-slate-100'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.breathing.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.breathing.tip1')}</li>
          <li>{t('tools.breathing.tip2')}</li>
          <li>{t('tools.breathing.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
