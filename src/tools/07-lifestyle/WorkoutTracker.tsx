import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Exercise {
  id: number
  name: string
  sets: number
  reps: number
  weight?: number
}

interface Workout {
  id: number
  date: string
  name: string
  exercises: Exercise[]
  duration: number
  notes?: string
}

export default function WorkoutTracker() {
  const { t } = useTranslation()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [showAddWorkout, setShowAddWorkout] = useState(false)
  const [currentWorkout, setCurrentWorkout] = useState({
    name: '',
    exercises: [] as Exercise[],
    duration: 30,
    notes: '',
  })
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '3',
    reps: '10',
    weight: '',
  })

  useEffect(() => {
    const saved = localStorage.getItem('workout-tracker')
    if (saved) {
      try {
        setWorkouts(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load workouts')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('workout-tracker', JSON.stringify(workouts))
  }, [workouts])

  const commonExercises = [
    'Push-ups', 'Pull-ups', 'Squats', 'Lunges', 'Deadlifts',
    'Bench Press', 'Shoulder Press', 'Bicep Curls', 'Tricep Dips',
    'Plank', 'Crunches', 'Burpees', 'Jumping Jacks', 'Running',
  ]

  const addExercise = () => {
    if (!newExercise.name) return
    const exercise: Exercise = {
      id: Date.now(),
      name: newExercise.name,
      sets: parseInt(newExercise.sets) || 3,
      reps: parseInt(newExercise.reps) || 10,
      weight: newExercise.weight ? parseFloat(newExercise.weight) : undefined,
    }
    setCurrentWorkout({
      ...currentWorkout,
      exercises: [...currentWorkout.exercises, exercise],
    })
    setNewExercise({ name: '', sets: '3', reps: '10', weight: '' })
  }

  const removeExercise = (id: number) => {
    setCurrentWorkout({
      ...currentWorkout,
      exercises: currentWorkout.exercises.filter(e => e.id !== id),
    })
  }

  const saveWorkout = () => {
    if (!currentWorkout.name || currentWorkout.exercises.length === 0) return
    const workout: Workout = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      name: currentWorkout.name,
      exercises: currentWorkout.exercises,
      duration: currentWorkout.duration,
      notes: currentWorkout.notes || undefined,
    }
    setWorkouts([workout, ...workouts])
    setCurrentWorkout({ name: '', exercises: [], duration: 30, notes: '' })
    setShowAddWorkout(false)
  }

  const deleteWorkout = (id: number) => {
    setWorkouts(workouts.filter(w => w.id !== id))
  }

  const stats = useMemo(() => {
    const thisWeek = workouts.filter(w => {
      const workoutDate = new Date(w.date)
      const today = new Date()
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      return workoutDate >= weekAgo
    })

    const thisMonth = workouts.filter(w => {
      const workoutDate = new Date(w.date)
      const today = new Date()
      return workoutDate.getMonth() === today.getMonth() &&
             workoutDate.getFullYear() === today.getFullYear()
    })

    const totalDuration = thisWeek.reduce((sum, w) => sum + w.duration, 0)

    return {
      weekWorkouts: thisWeek.length,
      monthWorkouts: thisMonth.length,
      weekDuration: totalDuration,
      totalWorkouts: workouts.length,
    }
  }, [workouts])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{stats.weekWorkouts}</div>
            <div className="text-xs text-slate-500">{t('tools.workoutTracker.thisWeek')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{stats.monthWorkouts}</div>
            <div className="text-xs text-slate-500">{t('tools.workoutTracker.thisMonth')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{stats.weekDuration}m</div>
            <div className="text-xs text-slate-500">{t('tools.workoutTracker.weekTime')}</div>
          </div>
          <div className="p-3 bg-orange-50 rounded">
            <div className="text-2xl font-bold text-orange-600">{stats.totalWorkouts}</div>
            <div className="text-xs text-slate-500">{t('tools.workoutTracker.total')}</div>
          </div>
        </div>
      </div>

      {!showAddWorkout ? (
        <button
          onClick={() => setShowAddWorkout(true)}
          className="w-full py-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
        >
          + {t('tools.workoutTracker.newWorkout')}
        </button>
      ) : (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.workoutTracker.newWorkout')}
          </h3>

          <div className="space-y-3 mb-4">
            <input
              type="text"
              value={currentWorkout.name}
              onChange={(e) => setCurrentWorkout({ ...currentWorkout, name: e.target.value })}
              placeholder={t('tools.workoutTracker.workoutName')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.workoutTracker.duration')} (min)
                </label>
                <input
                  type="number"
                  value={currentWorkout.duration}
                  onChange={(e) => setCurrentWorkout({ ...currentWorkout, duration: parseInt(e.target.value) || 30 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.workoutTracker.notes')}
                </label>
                <input
                  type="text"
                  value={currentWorkout.notes}
                  onChange={(e) => setCurrentWorkout({ ...currentWorkout, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 mb-3">
            <h4 className="text-xs text-slate-500 mb-2">{t('tools.workoutTracker.addExercise')}</h4>
            <div className="grid grid-cols-4 gap-2 mb-2">
              <input
                type="text"
                value={newExercise.name}
                onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                placeholder={t('tools.workoutTracker.exercise')}
                className="col-span-2 px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <input
                type="number"
                value={newExercise.sets}
                onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })}
                placeholder="Sets"
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <input
                type="number"
                value={newExercise.reps}
                onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                placeholder="Reps"
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={newExercise.weight}
                onChange={(e) => setNewExercise({ ...newExercise, weight: e.target.value })}
                placeholder={t('tools.workoutTracker.weight')}
                className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <button
                onClick={addExercise}
                className="px-4 py-2 bg-slate-200 rounded font-medium hover:bg-slate-300"
              >
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {commonExercises.slice(0, 8).map(ex => (
                <button
                  key={ex}
                  onClick={() => setNewExercise({ ...newExercise, name: ex })}
                  className="px-2 py-1 bg-slate-100 rounded text-xs hover:bg-slate-200"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {currentWorkout.exercises.length > 0 && (
            <div className="space-y-2 mb-4">
              {currentWorkout.exercises.map(ex => (
                <div key={ex.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <span className="font-medium">{ex.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">
                      {ex.sets}×{ex.reps} {ex.weight && `@ ${ex.weight}kg`}
                    </span>
                    <button
                      onClick={() => removeExercise(ex.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={saveWorkout}
              className="flex-1 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
            >
              {t('tools.workoutTracker.save')}
            </button>
            <button
              onClick={() => {
                setShowAddWorkout(false)
                setCurrentWorkout({ name: '', exercises: [], duration: 30, notes: '' })
              }}
              className="px-4 py-2 bg-slate-200 rounded font-medium hover:bg-slate-300"
            >
              {t('tools.workoutTracker.cancel')}
            </button>
          </div>
        </div>
      )}

      {workouts.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.workoutTracker.history')}
          </h3>
          <div className="space-y-3">
            {workouts.slice(0, 10).map(workout => (
              <div key={workout.id} className="p-3 bg-slate-50 rounded">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">{workout.name}</div>
                    <div className="text-xs text-slate-500">{workout.date} • {workout.duration} min</div>
                  </div>
                  <button
                    onClick={() => deleteWorkout(workout.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {workout.exercises.map(ex => (
                    <span key={ex.id} className="px-2 py-1 bg-white rounded text-xs">
                      {ex.name} ({ex.sets}×{ex.reps})
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.workoutTracker.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.workoutTracker.tip1')}</li>
          <li>{t('tools.workoutTracker.tip2')}</li>
          <li>{t('tools.workoutTracker.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
