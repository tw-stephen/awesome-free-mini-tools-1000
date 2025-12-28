import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type Quadrant = 'do' | 'schedule' | 'delegate' | 'eliminate'

interface Task {
  id: string
  title: string
  quadrant: Quadrant
  completed: boolean
}

export default function TaskPriorityMatrix() {
  const { t } = useTranslation()
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [selectedQuadrant, setSelectedQuadrant] = useState<Quadrant>('do')

  useEffect(() => {
    const saved = localStorage.getItem('priority-matrix-tasks')
    if (saved) setTasks(JSON.parse(saved))
  }, [])

  const saveTasks = (updated: Task[]) => {
    setTasks(updated)
    localStorage.setItem('priority-matrix-tasks', JSON.stringify(updated))
  }

  const addTask = () => {
    if (!newTask.trim()) return
    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      quadrant: selectedQuadrant,
      completed: false
    }
    saveTasks([...tasks, task])
    setNewTask('')
  }

  const toggleTask = (id: string) => {
    saveTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const moveTask = (id: string, quadrant: Quadrant) => {
    saveTasks(tasks.map(t => t.id === id ? { ...t, quadrant } : t))
  }

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter(t => t.id !== id))
  }

  const getTasksByQuadrant = (quadrant: Quadrant) => {
    return tasks.filter(t => t.quadrant === quadrant)
  }

  const quadrantInfo: Record<Quadrant, { title: string; subtitle: string; color: string; bg: string }> = {
    do: {
      title: t('tools.taskPriorityMatrix.doFirst'),
      subtitle: t('tools.taskPriorityMatrix.urgentImportant'),
      color: 'border-red-500',
      bg: 'bg-red-50'
    },
    schedule: {
      title: t('tools.taskPriorityMatrix.schedule'),
      subtitle: t('tools.taskPriorityMatrix.notUrgentImportant'),
      color: 'border-blue-500',
      bg: 'bg-blue-50'
    },
    delegate: {
      title: t('tools.taskPriorityMatrix.delegate'),
      subtitle: t('tools.taskPriorityMatrix.urgentNotImportant'),
      color: 'border-yellow-500',
      bg: 'bg-yellow-50'
    },
    eliminate: {
      title: t('tools.taskPriorityMatrix.eliminate'),
      subtitle: t('tools.taskPriorityMatrix.notUrgentNotImportant'),
      color: 'border-slate-400',
      bg: 'bg-slate-50'
    }
  }

  const QuadrantBox = ({ quadrant }: { quadrant: Quadrant }) => {
    const info = quadrantInfo[quadrant]
    const quadrantTasks = getTasksByQuadrant(quadrant)

    return (
      <div className={`card p-3 border-l-4 ${info.color} ${info.bg} min-h-[150px]`}>
        <div className="mb-2">
          <div className="font-medium text-sm">{info.title}</div>
          <div className="text-xs text-slate-500">{info.subtitle}</div>
        </div>
        <div className="space-y-1">
          {quadrantTasks.map(task => (
            <div
              key={task.id}
              className={`flex items-center gap-2 p-1.5 bg-white rounded text-sm ${
                task.completed ? 'opacity-50' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="shrink-0"
              />
              <span className={task.completed ? 'line-through' : ''}>{task.title}</span>
              <div className="ml-auto flex gap-1">
                <select
                  value={task.quadrant}
                  onChange={(e) => moveTask(task.id, e.target.value as Quadrant)}
                  className="text-xs bg-transparent border-none cursor-pointer"
                >
                  <option value="do">→ Q1</option>
                  <option value="schedule">→ Q2</option>
                  <option value="delegate">→ Q3</option>
                  <option value="eliminate">→ Q4</option>
                </select>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 text-xs"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          {quadrantTasks.length === 0 && (
            <div className="text-xs text-slate-400 text-center py-2">
              {t('tools.taskPriorityMatrix.noTasks')}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder={t('tools.taskPriorityMatrix.addTask')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <button
            onClick={addTask}
            disabled={!newTask.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            +
          </button>
        </div>
        <div className="flex gap-2">
          {(['do', 'schedule', 'delegate', 'eliminate'] as Quadrant[]).map(q => (
            <button
              key={q}
              onClick={() => setSelectedQuadrant(q)}
              className={`flex-1 py-1.5 text-xs rounded capitalize ${
                selectedQuadrant === q
                  ? `${quadrantInfo[q].color.replace('border', 'bg').replace('-500', '-500')} text-white`
                  : 'bg-slate-100'
              }`}
            >
              {quadrantInfo[q].title}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center text-sm text-slate-600 mb-2">
        <span className="font-medium">{t('tools.taskPriorityMatrix.important')}</span> ↑
      </div>

      <div className="grid grid-cols-2 gap-2">
        <QuadrantBox quadrant="do" />
        <QuadrantBox quadrant="schedule" />
      </div>

      <div className="flex items-center justify-center text-sm text-slate-600">
        <span>{t('tools.taskPriorityMatrix.urgent')} ←</span>
        <span className="mx-8">|</span>
        <span>→ {t('tools.taskPriorityMatrix.notUrgent')}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <QuadrantBox quadrant="delegate" />
        <QuadrantBox quadrant="eliminate" />
      </div>

      <div className="text-center text-sm text-slate-600 mt-2">
        ↓ <span className="font-medium">{t('tools.taskPriorityMatrix.notImportant')}</span>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-4">
        {(['do', 'schedule', 'delegate', 'eliminate'] as Quadrant[]).map(q => {
          const quadrantTasks = getTasksByQuadrant(q)
          const completed = quadrantTasks.filter(t => t.completed).length
          return (
            <div key={q} className="card p-2 text-center">
              <div className="text-lg font-bold">{quadrantTasks.length}</div>
              <div className="text-xs text-slate-500">
                {completed}/{quadrantTasks.length}
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={() => saveTasks(tasks.filter(t => !t.completed))}
        className="w-full py-2 bg-slate-100 rounded text-sm"
      >
        {t('tools.taskPriorityMatrix.clearCompleted')}
      </button>
    </div>
  )
}
