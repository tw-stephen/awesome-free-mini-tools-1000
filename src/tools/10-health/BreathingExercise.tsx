import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface BreathingPattern {
  id: string
  name: string
  inhale: number
  hold1: number
  exhale: number
  hold2: number
  cycles: number
}

export default function BreathingExercise() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'select' | 'running' | 'done'>('select')
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern | null>(null)
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale')
  const [timeLeft, setTimeLeft] = useState(0)
  const [cycle, setCycle] = useState(1)
  const intervalRef = useRef<number | null>(null)

  const patterns: BreathingPattern[] = [
    { id: 'box', name: t('tools.breathingExercise.box'), inhale: 4, hold1: 4, exhale: 4, hold2: 4, cycles: 4 },
    { id: '478', name: t('tools.breathingExercise.relaxing'), inhale: 4, hold1: 7, exhale: 8, hold2: 0, cycles: 4 },
    { id: 'energizing', name: t('tools.breathingExercise.energizing'), inhale: 4, hold1: 0, exhale: 4, hold2: 0, cycles: 10 },
    { id: 'calming', name: t('tools.breathingExercise.calming'), inhale: 4, hold1: 2, exhale: 6, hold2: 2, cycles: 6 },
  ]

  useEffect(() => {
    if (mode === 'running' && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [mode, timeLeft])

  useEffect(() => {
    if (mode === 'running' && timeLeft === 0 && selectedPattern) {
      const phases: ('inhale' | 'hold1' | 'exhale' | 'hold2')[] = ['inhale', 'hold1', 'exhale', 'hold2']
      const currentIndex = phases.indexOf(phase)

      let nextIndex = currentIndex
      do {
        nextIndex = (nextIndex + 1) % 4
      } while (selectedPattern[phases[nextIndex]] === 0 && nextIndex !== currentIndex)

      if (nextIndex === 0) {
        if (cycle >= selectedPattern.cycles) {
          setMode('done')
          return
        }
        setCycle(cycle + 1)
      }

      setPhase(phases[nextIndex])
      setTimeLeft(selectedPattern[phases[nextIndex]])
    }
  }, [timeLeft, mode, phase, selectedPattern, cycle])

  const startExercise = (pattern: BreathingPattern) => {
    setSelectedPattern(pattern)
    setPhase('inhale')
    setTimeLeft(pattern.inhale)
    setCycle(1)
    setMode('running')
  }

  const stopExercise = () => {
    setMode('select')
    setSelectedPattern(null)
  }

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return t('tools.breathingExercise.inhale')
      case 'hold1': case 'hold2': return t('tools.breathingExercise.hold')
      case 'exhale': return t('tools.breathingExercise.exhale')
    }
  }

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'text-blue-600'
      case 'hold1': case 'hold2': return 'text-purple-600'
      case 'exhale': return 'text-green-600'
    }
  }

  const getCircleSize = () => {
    if (!selectedPattern) return 100
    const duration = selectedPattern[phase]
    const progress = duration > 0 ? (duration - timeLeft) / duration : 0

    if (phase === 'inhale') return 60 + (progress * 80)
    if (phase === 'exhale') return 140 - (progress * 80)
    return phase === 'hold1' ? 140 : 60
  }

  return (
    <div className="space-y-4">
      {mode === 'select' && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.breathingExercise.selectPattern')}</h3>
            <div className="space-y-2">
              {patterns.map(pattern => (
                <button
                  key={pattern.id}
                  onClick={() => startExercise(pattern)}
                  className="w-full p-4 text-left bg-slate-50 rounded hover:bg-slate-100"
                >
                  <div className="font-medium">{pattern.name}</div>
                  <div className="text-sm text-slate-500">
                    {pattern.inhale}s {t('tools.breathingExercise.in')}
                    {pattern.hold1 > 0 && ` • ${pattern.hold1}s ${t('tools.breathingExercise.holdShort')}`}
                    {` • ${pattern.exhale}s ${t('tools.breathingExercise.out')}`}
                    {pattern.hold2 > 0 && ` • ${pattern.hold2}s ${t('tools.breathingExercise.holdShort')}`}
                    {` • ${pattern.cycles} ${t('tools.breathingExercise.cycles')}`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4 bg-blue-50">
            <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.breathingExercise.benefits')}</h3>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              <li>{t('tools.breathingExercise.benefit1')}</li>
              <li>{t('tools.breathingExercise.benefit2')}</li>
              <li>{t('tools.breathingExercise.benefit3')}</li>
              <li>{t('tools.breathingExercise.benefit4')}</li>
            </ul>
          </div>
        </>
      )}

      {mode === 'running' && selectedPattern && (
        <div className="card p-6 text-center">
          <div className="text-sm text-slate-500 mb-4">
            {selectedPattern.name} • {t('tools.breathingExercise.cycle')} {cycle}/{selectedPattern.cycles}
          </div>

          <div className="relative w-64 h-64 mx-auto mb-6 flex items-center justify-center">
            <div
              className={`rounded-full bg-blue-100 transition-all duration-1000 ease-in-out flex items-center justify-center`}
              style={{
                width: `${getCircleSize()}%`,
                height: `${getCircleSize()}%`,
              }}
            >
              <div className="text-center">
                <div className={`text-5xl font-bold ${getPhaseColor()}`}>{timeLeft}</div>
                <div className={`text-xl font-medium ${getPhaseColor()}`}>{getPhaseText()}</div>
              </div>
            </div>
          </div>

          <button
            onClick={stopExercise}
            className="px-6 py-2 bg-slate-200 rounded font-medium"
          >
            {t('tools.breathingExercise.stop')}
          </button>
        </div>
      )}

      {mode === 'done' && (
        <div className="card p-6 text-center">
          <div className="text-6xl mb-4">🧘</div>
          <div className="text-2xl font-bold text-green-600 mb-2">{t('tools.breathingExercise.complete')}</div>
          <p className="text-slate-600 mb-4">{t('tools.breathingExercise.wellDone')}</p>
          <button
            onClick={() => setMode('select')}
            className="px-6 py-2 bg-blue-500 text-white rounded font-medium"
          >
            {t('tools.breathingExercise.tryAnother')}
          </button>
        </div>
      )}
    </div>
  )
}
