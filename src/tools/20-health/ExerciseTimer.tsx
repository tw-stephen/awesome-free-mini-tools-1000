import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Exercise {
  id: number
  name: string
  duration: number // seconds
  rest: number // seconds
}

export default function ExerciseTimer() {
  const { t } = useTranslation()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [rounds, setRounds] = useState(1)
  const [currentRound, setCurrentRound] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [newExercise, setNewExercise] = useState({
    name: '',
    duration: 30,
    rest: 10,
  })

  const presetWorkouts = [
    {
      name: 'Quick HIIT',
      exercises: [
        { id: 1, name: 'Jumping Jacks', duration: 30, rest: 10 },
        { id: 2, name: 'Squats', duration: 30, rest: 10 },
        { id: 3, name: 'Push-ups', duration: 30, rest: 10 },
        { id: 4, name: 'Lunges', duration: 30, rest: 10 },
      ],
    },
    {
      name: 'Core Workout',
      exercises: [
        { id: 1, name: 'Plank', duration: 45, rest: 15 },
        { id: 2, name: 'Crunches', duration: 30, rest: 10 },
        { id: 3, name: 'Mountain Climbers', duration: 30, rest: 10 },
        { id: 4, name: 'Leg Raises', duration: 30, rest: 10 },
      ],
    },
    {
      name: 'Tabata',
      exercises: [
        { id: 1, name: 'Work', duration: 20, rest: 10 },
      ],
    },
  ]

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 4 && prev > 1) {
            playBeep()
          }
          return prev - 1
        })
      }, 1000)
    } else if (isRunning && timeRemaining === 0) {
      handleTimerComplete()
    }

    return () => clearInterval(interval)
  }, [isRunning, timeRemaining])

  const playBeep = () => {
    // Beep using Web Audio API
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    gainNode.gain.value = 0.1
    oscillator.start()
    setTimeout(() => oscillator.stop(), 100)
  }

  const handleTimerComplete = () => {
    if (isResting) {
      // Move to next exercise
      if (currentIndex < exercises.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setTimeRemaining(exercises[currentIndex + 1].duration)
        setIsResting(false)
      } else if (currentRound < rounds) {
        // Next round
        setCurrentRound(currentRound + 1)
        setCurrentIndex(0)
        setTimeRemaining(exercises[0].duration)
        setIsResting(false)
      } else {
        // Workout complete
        setIsRunning(false)
        setIsFinished(true)
      }
    } else {
      // Start rest period
      const currentExercise = exercises[currentIndex]
      if (currentExercise.rest > 0 && (currentIndex < exercises.length - 1 || currentRound < rounds)) {
        setTimeRemaining(currentExercise.rest)
        setIsResting(true)
      } else {
        // No rest, move to next
        if (currentIndex < exercises.length - 1) {
          setCurrentIndex(currentIndex + 1)
          setTimeRemaining(exercises[currentIndex + 1].duration)
        } else if (currentRound < rounds) {
          setCurrentRound(currentRound + 1)
          setCurrentIndex(0)
          setTimeRemaining(exercises[0].duration)
        } else {
          setIsRunning(false)
          setIsFinished(true)
        }
      }
    }
  }

  const startWorkout = () => {
    if (exercises.length === 0) return
    setCurrentIndex(0)
    setCurrentRound(1)
    setTimeRemaining(exercises[0].duration)
    setIsResting(false)
    setIsFinished(false)
    setIsRunning(true)
  }

  const pauseWorkout = () => {
    setIsRunning(false)
  }

  const resumeWorkout = () => {
    setIsRunning(true)
  }

  const resetWorkout = () => {
    setIsRunning(false)
    setCurrentIndex(0)
    setCurrentRound(1)
    setTimeRemaining(0)
    setIsResting(false)
    setIsFinished(false)
  }

  const addExercise = () => {
    if (!newExercise.name.trim()) return
    setExercises([...exercises, { ...newExercise, id: Date.now() }])
    setNewExercise({ name: '', duration: 30, rest: 10 })
    setShowForm(false)
  }

  const removeExercise = (id: number) => {
    setExercises(exercises.filter((e) => e.id !== id))
  }

  const loadPreset = (preset: typeof presetWorkouts[0]) => {
    setExercises(preset.exercises.map((e) => ({ ...e, id: Date.now() + e.id })))
    resetWorkout()
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTotalTime = (): number => {
    const exerciseTime = exercises.reduce((sum, e) => sum + e.duration, 0)
    const restTime = exercises.reduce((sum, e) => sum + e.rest, 0) - (exercises[exercises.length - 1]?.rest || 0)
    return (exerciseTime + restTime) * rounds
  }

  return (
    <div className="space-y-4">
      {isRunning || isFinished ? (
        <div className={`card p-6 text-center ${isResting ? 'bg-green-50' : 'bg-blue-50'}`}>
          {isFinished ? (
            <div>
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-2xl font-bold text-green-600">Workout Complete!</div>
              <button
                onClick={resetWorkout}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Start New Workout
              </button>
            </div>
          ) : (
            <div>
              <div className="text-sm text-slate-500 mb-2">
                Round {currentRound}/{rounds} • Exercise {currentIndex + 1}/{exercises.length}
              </div>
              <div className="text-xl font-medium mb-2">
                {isResting ? 'REST' : exercises[currentIndex]?.name}
              </div>
              <div className={`text-7xl font-bold my-4 ${isResting ? 'text-green-600' : 'text-blue-600'}`}>
                {formatTime(timeRemaining)}
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={pauseWorkout}
                  className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Pause
                </button>
                <button
                  onClick={resetWorkout}
                  className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Reset
                </button>
              </div>
              {!isResting && currentIndex < exercises.length - 1 && (
                <div className="mt-4 text-sm text-slate-500">
                  Next: {exercises[currentIndex + 1].name}
                </div>
              )}
            </div>
          )}
        </div>
      ) : timeRemaining > 0 ? (
        <div className="card p-4 text-center">
          <div className="text-lg font-medium mb-2">Paused</div>
          <div className="text-4xl font-bold text-blue-600 mb-4">{formatTime(timeRemaining)}</div>
          <div className="flex justify-center gap-4">
            <button
              onClick={resumeWorkout}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Resume
            </button>
            <button
              onClick={resetWorkout}
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Reset
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.exerciseTimer.presets')}</h3>
            <div className="flex flex-wrap gap-2">
              {presetWorkouts.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => loadPreset(preset)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">{t('tools.exerciseTimer.exercises')}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Rounds:</span>
                <input
                  type="number"
                  value={rounds}
                  onChange={(e) => setRounds(Math.max(1, parseInt(e.target.value) || 1))}
                  min={1}
                  className="w-16 px-2 py-1 border border-slate-300 rounded text-center"
                />
              </div>
            </div>

            {exercises.length > 0 ? (
              <div className="space-y-2 mb-4">
                {exercises.map((exercise, i) => (
                  <div key={exercise.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{i + 1}</span>
                      <div>
                        <div className="font-medium">{exercise.name}</div>
                        <div className="text-xs text-slate-500">
                          {exercise.duration}s work / {exercise.rest}s rest
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeExercise(exercise.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="text-sm text-slate-500 text-right">
                  Total: {formatTime(getTotalTime())}
                </div>
              </div>
            ) : (
              <div className="text-slate-500 text-center py-4 mb-4">Add exercises to begin</div>
            )}

            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="w-full py-2 bg-slate-100 rounded hover:bg-slate-200"
              >
                + Add Exercise
              </button>
            ) : (
              <div className="space-y-2 p-3 bg-slate-50 rounded">
                <input
                  type="text"
                  value={newExercise.name}
                  onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                  placeholder="Exercise name"
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-500">Work (sec)</label>
                    <input
                      type="number"
                      value={newExercise.duration}
                      onChange={(e) => setNewExercise({ ...newExercise, duration: parseInt(e.target.value) || 0 })}
                      min={1}
                      className="w-full px-3 py-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Rest (sec)</label>
                    <input
                      type="number"
                      value={newExercise.rest}
                      onChange={(e) => setNewExercise({ ...newExercise, rest: parseInt(e.target.value) || 0 })}
                      min={0}
                      className="w-full px-3 py-2 border border-slate-300 rounded"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addExercise}
                    disabled={!newExercise.name.trim()}
                    className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {exercises.length > 0 && (
            <button
              onClick={startWorkout}
              className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium text-lg"
            >
              {t('tools.exerciseTimer.start')}
            </button>
          )}
        </>
      )}
    </div>
  )
}
