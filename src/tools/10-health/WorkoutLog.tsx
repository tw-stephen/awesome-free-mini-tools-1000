import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Exercise {
  name: string
  sets: number
  reps: number
  weight: number
}

interface Workout {
  id: number
  date: string
  name: string
  exercises: Exercise[]
  duration: number
  notes: string
}

export default function WorkoutLog() {
  const { t } = useTranslation()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [mode, setMode] = useState<'list' | 'add'>('list')
  const [newWorkout, setNewWorkout] = useState<Partial<Workout>>({
    name: '',
    exercises: [{ name: '', sets: 3, reps: 10, weight: 0 }],
    duration: 45,
    notes: '',
  })

  useEffect(() => {
    const saved = localStorage.getItem('workout-log')
    if (saved) {
      try {
        setWorkouts(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load workouts')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('workout-log', JSON.stringify(workouts))
  }, [workouts])

  const addWorkout = () => {
    if (!newWorkout.name?.trim()) return

    const workout: Workout = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      name: newWorkout.name,
      exercises: newWorkout.exercises?.filter(e => e.name.trim()) || [],
      duration: newWorkout.duration || 45,
      notes: newWorkout.notes || '',
    }
    setWorkouts([workout, ...workouts])
    setNewWorkout({
      name: '',
      exercises: [{ name: '', sets: 3, reps: 10, weight: 0 }],
      duration: 45,
      notes: '',
    })
    setMode('list')
  }

  const deleteWorkout = (id: number) => {
    setWorkouts(workouts.filter(w => w.id !== id))
  }

  const addExercise = () => {
    setNewWorkout({
      ...newWorkout,
      exercises: [...(newWorkout.exercises || []), { name: '', sets: 3, reps: 10, weight: 0 }],
    })
  }

  const updateExercise = (index: number, field: keyof Exercise, value: string | number) => {
    const exercises = [...(newWorkout.exercises || [])]
    exercises[index] = { ...exercises[index], [field]: value }
    setNewWorkout({ ...newWorkout, exercises })
  }

  const removeExercise = (index: number) => {
    setNewWorkout({
      ...newWorkout,
      exercises: newWorkout.exercises?.filter((_, i) => i !== index),
    })
  }

  const thisWeek = workouts.filter(w => {
    const date = new Date(w.date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return date >= weekAgo
  })

  const totalDuration = thisWeek.reduce((sum, w) => sum + w.duration, 0)

  return (
    <div className="space-y-4">
      {mode === 'list' && (
        <>
          <button
            onClick={() => setMode('add')}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            + {t('tools.workoutLog.addWorkout')}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <div className="card p-4 text-center bg-green-50">
              <div className="text-2xl font-bold text-green-600">{thisWeek.length}</div>
              <div className="text-xs text-slate-500">{t('tools.workoutLog.workoutsThisWeek')}</div>
            </div>
            <div className="card p-4 text-center bg-blue-50">
              <div className="text-2xl font-bold text-blue-600">{totalDuration}</div>
              <div className="text-xs text-slate-500">{t('tools.workoutLog.minutesThisWeek')}</div>
            </div>
          </div>

          {workouts.length === 0 ? (
            <div className="card p-6 text-center text-slate-500">
              {t('tools.workoutLog.noWorkouts')}
            </div>
          ) : (
            <div className="space-y-2">
              {workouts.slice(0, 20).map(workout => (
                <div key={workout.id} className="card p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{workout.name}</div>
                      <div className="text-xs text-slate-500">
                        {workout.date} • {workout.duration} {t('tools.workoutLog.min')}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        {workout.exercises.length} {t('tools.workoutLog.exercises')}
                      </div>
                    </div>
                    <button onClick={() => deleteWorkout(workout.id)} className="text-red-500">×</button>
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
              {t('tools.workoutLog.workoutName')} *
            </label>
            <input
              type="text"
              value={newWorkout.name || ''}
              onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
              placeholder={t('tools.workoutLog.namePlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('tools.workoutLog.exercises')}
            </label>
            <div className="space-y-2">
              {newWorkout.exercises?.map((ex, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={ex.name}
                      onChange={(e) => updateExercise(i, 'name', e.target.value)}
                      placeholder={t('tools.workoutLog.exerciseName')}
                      className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                    />
                    <button onClick={() => removeExercise(i)} className="text-red-500">×</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-slate-500">{t('tools.workoutLog.sets')}</label>
                      <input
                        type="number"
                        value={ex.sets}
                        onChange={(e) => updateExercise(i, 'sets', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">{t('tools.workoutLog.reps')}</label>
                      <input
                        type="number"
                        value={ex.reps}
                        onChange={(e) => updateExercise(i, 'reps', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">{t('tools.workoutLog.weight')} (kg)</label>
                      <input
                        type="number"
                        value={ex.weight}
                        onChange={(e) => updateExercise(i, 'weight', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={addExercise} className="w-full mt-2 py-2 text-blue-500 text-sm">
              + {t('tools.workoutLog.addExercise')}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.workoutLog.duration')} ({t('tools.workoutLog.min')})
            </label>
            <input
              type="number"
              value={newWorkout.duration || ''}
              onChange={(e) => setNewWorkout({ ...newWorkout, duration: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.workoutLog.notes')}
            </label>
            <textarea
              value={newWorkout.notes || ''}
              onChange={(e) => setNewWorkout({ ...newWorkout, notes: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <button onClick={() => setMode('list')} className="flex-1 py-2 bg-slate-100 rounded">
              {t('common.cancel')}
            </button>
            <button
              onClick={addWorkout}
              disabled={!newWorkout.name?.trim()}
              className="flex-1 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {t('tools.workoutLog.save')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
