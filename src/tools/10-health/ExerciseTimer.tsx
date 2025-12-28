import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface Exercise {
  name: string
  duration: number
  rest: number
}

export default function ExerciseTimer() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'setup' | 'running' | 'done'>('setup')
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: 'Jumping Jacks', duration: 30, rest: 10 },
    { name: 'Push-ups', duration: 30, rest: 10 },
    { name: 'Squats', duration: 30, rest: 10 },
    { name: 'Plank', duration: 30, rest: 10 },
  ])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isRest, setIsRest] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [rounds, setRounds] = useState(1)
  const [currentRound, setCurrentRound] = useState(1)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (mode === 'running' && !isPaused && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [mode, isPaused, timeLeft])

  useEffect(() => {
    if (mode === 'running' && timeLeft === 0) {
      playBeep()
      if (isRest) {
        if (currentIndex < exercises.length - 1) {
          setCurrentIndex(currentIndex + 1)
          setIsRest(false)
          setTimeLeft(exercises[currentIndex + 1].duration)
        } else if (currentRound < rounds) {
          setCurrentRound(currentRound + 1)
          setCurrentIndex(0)
          setIsRest(false)
          setTimeLeft(exercises[0].duration)
        } else {
          setMode('done')
        }
      } else {
        setIsRest(true)
        setTimeLeft(exercises[currentIndex].rest)
      }
    }
  }, [timeLeft, mode, isRest, currentIndex, exercises, currentRound, rounds])

  const playBeep = () => {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.2)
  }

  const startWorkout = () => {
    setMode('running')
    setCurrentIndex(0)
    setCurrentRound(1)
    setIsRest(false)
    setTimeLeft(exercises[0].duration)
    setIsPaused(false)
  }

  const reset = () => {
    setMode('setup')
    setCurrentIndex(0)
    setCurrentRound(1)
    setIsRest(false)
    setIsPaused(false)
  }

  const updateExercise = (index: number, field: keyof Exercise, value: string | number) => {
    const updated = [...exercises]
    updated[index] = { ...updated[index], [field]: value }
    setExercises(updated)
  }

  const addExercise = () => {
    setExercises([...exercises, { name: 'New Exercise', duration: 30, rest: 10 }])
  }

  const removeExercise = (index: number) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((_, i) => i !== index))
    }
  }

  const totalTime = exercises.reduce((sum, e) => sum + e.duration + e.rest, 0) * rounds

  return (
    <div className="space-y-4">
      {mode === 'setup' && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.exerciseTimer.exercises')}</h3>
            <div className="space-y-2">
              {exercises.map((ex, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded space-y-2">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={ex.name}
                      onChange={(e) => updateExercise(i, 'name', e.target.value)}
                      className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                    />
                    <button onClick={() => removeExercise(i)} className="ml-2 text-red-500">×</button>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-slate-500">{t('tools.exerciseTimer.duration')}</label>
                      <input
                        type="number"
                        value={ex.duration}
                        onChange={(e) => updateExercise(i, 'duration', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-slate-500">{t('tools.exerciseTimer.rest')}</label>
                      <input
                        type="number"
                        value={ex.rest}
                        onChange={(e) => updateExercise(i, 'rest', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={addExercise} className="w-full mt-2 py-2 text-blue-500 text-sm">
              + {t('tools.exerciseTimer.addExercise')}
            </button>
          </div>

          <div className="card p-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('tools.exerciseTimer.rounds')}</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setRounds(n)}
                  className={`flex-1 py-2 rounded ${rounds === n ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="text-sm text-slate-500 mt-2 text-center">
              {t('tools.exerciseTimer.totalTime')}: {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}
            </div>
          </div>

          <button
            onClick={startWorkout}
            className="w-full py-3 bg-green-500 text-white rounded font-medium text-lg"
          >
            {t('tools.exerciseTimer.start')}
          </button>
        </>
      )}

      {mode === 'running' && (
        <div className="card p-6 text-center">
          <div className="text-sm text-slate-500 mb-2">
            {t('tools.exerciseTimer.round')} {currentRound}/{rounds} • {currentIndex + 1}/{exercises.length}
          </div>
          <div className={`text-6xl font-bold ${isRest ? 'text-green-600' : 'text-blue-600'}`}>
            {timeLeft}
          </div>
          <div className="text-2xl font-medium mt-2">
            {isRest ? t('tools.exerciseTimer.restTime') : exercises[currentIndex].name}
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex-1 py-3 bg-yellow-500 text-white rounded font-medium"
            >
              {isPaused ? t('tools.exerciseTimer.resume') : t('tools.exerciseTimer.pause')}
            </button>
            <button
              onClick={reset}
              className="flex-1 py-3 bg-red-500 text-white rounded font-medium"
            >
              {t('tools.exerciseTimer.stop')}
            </button>
          </div>

          {!isRest && currentIndex < exercises.length - 1 && (
            <div className="mt-4 text-sm text-slate-500">
              {t('tools.exerciseTimer.next')}: {exercises[currentIndex + 1].name}
            </div>
          )}
        </div>
      )}

      {mode === 'done' && (
        <div className="card p-6 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <div className="text-2xl font-bold text-green-600">{t('tools.exerciseTimer.complete')}</div>
          <p className="text-slate-600 mt-2">{t('tools.exerciseTimer.greatJob')}</p>
          <button
            onClick={reset}
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded font-medium"
          >
            {t('tools.exerciseTimer.startAgain')}
          </button>
        </div>
      )}
    </div>
  )
}
