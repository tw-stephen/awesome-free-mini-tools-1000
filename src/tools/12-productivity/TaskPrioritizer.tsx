import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Task {
  id: string
  title: string
  urgency: number
  importance: number
  effort: number
  deadline?: string
}

export default function TaskPrioritizer() {
  const { t } = useTranslation()
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [urgency, setUrgency] = useState(5)
  const [importance, setImportance] = useState(5)
  const [effort, setEffort] = useState(5)
  const [deadline, setDeadline] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('task-prioritizer')
    if (saved) setTasks(JSON.parse(saved))
  }, [])

  const saveTasks = (updated: Task[]) => {
    setTasks(updated)
    localStorage.setItem('task-prioritizer', JSON.stringify(updated))
  }

  const addTask = () => {
    if (!newTask.trim()) return
    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      urgency,
      importance,
      effort,
      deadline: deadline || undefined
    }
    saveTasks([...tasks, task])
    setNewTask('')
    setUrgency(5)
    setImportance(5)
    setEffort(5)
    setDeadline('')
  }

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter(t => t.id !== id))
  }

  const calculatePriority = (task: Task): number => {
    const urgencyWeight = 0.3
    const importanceWeight = 0.4
    const effortWeight = 0.2
    const deadlineWeight = 0.1

    let score = (task.urgency * urgencyWeight) + (task.importance * importanceWeight) + ((10 - task.effort) * effortWeight)

    if (task.deadline) {
      const daysUntil = Math.ceil((new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      if (daysUntil <= 1) score += 10 * deadlineWeight
      else if (daysUntil <= 3) score += 7 * deadlineWeight
      else if (daysUntil <= 7) score += 5 * deadlineWeight
    }

    return Math.round(score * 10) / 10
  }

  const sortedTasks = [...tasks].sort((a, b) => calculatePriority(b) - calculatePriority(a))

  const getPriorityColor = (score: number) => {
    if (score >= 7) return 'bg-red-100 border-red-500'
    if (score >= 5) return 'bg-yellow-100 border-yellow-500'
    return 'bg-green-100 border-green-500'
  }

  const getPriorityLabel = (score: number) => {
    if (score >= 7) return t('tools.taskPrioritizer.high')
    if (score >= 5) return t('tools.taskPrioritizer.medium')
    return t('tools.taskPrioritizer.low')
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder={t('tools.taskPrioritizer.taskPlaceholder')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-600 block mb-1">
              {t('tools.taskPrioritizer.urgency')}: {urgency}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={urgency}
              onChange={(e) => setUrgency(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600 block mb-1">
              {t('tools.taskPrioritizer.importance')}: {importance}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={importance}
              onChange={(e) => setImportance(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600 block mb-1">
              {t('tools.taskPrioritizer.effort')}: {effort}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={effort}
              onChange={(e) => setEffort(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600 block mb-1">
              {t('tools.taskPrioritizer.deadline')}
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>

        <button
          onClick={addTask}
          disabled={!newTask.trim()}
          className="w-full py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {t('tools.taskPrioritizer.addTask')}
        </button>
      </div>

      <div className="space-y-2">
        {sortedTasks.length === 0 ? (
          <div className="card p-4 text-center text-slate-500">
            {t('tools.taskPrioritizer.noTasks')}
          </div>
        ) : (
          sortedTasks.map((task, index) => {
            const score = calculatePriority(task)
            return (
              <div
                key={task.id}
                className={`card p-3 border-l-4 ${getPriorityColor(score)}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-slate-400">#{index + 1}</span>
                      <span className="font-medium">{task.title}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {t('tools.taskPrioritizer.urgency')}: {task.urgency} |
                      {t('tools.taskPrioritizer.importance')}: {task.importance} |
                      {t('tools.taskPrioritizer.effort')}: {task.effort}
                      {task.deadline && ` | ${t('tools.taskPrioritizer.deadline')}: ${task.deadline}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{getPriorityLabel(score)}</div>
                    <div className="text-xs text-slate-500">{t('tools.taskPrioritizer.score')}: {score}</div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 text-xs mt-1"
                    >
                      {t('tools.taskPrioritizer.delete')}
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium mb-2">{t('tools.taskPrioritizer.howItWorks')}</h3>
        <p className="text-sm text-slate-600">
          {t('tools.taskPrioritizer.description')}
        </p>
      </div>
    </div>
  )
}
