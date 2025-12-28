import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Task {
  id: number
  task: string
  assignee: string
  priority: 'high' | 'medium' | 'low'
  deadline: string
}

export default function TaskDelegator() {
  const { t } = useTranslation()
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, task: '', assignee: '', priority: 'medium', deadline: '' }
  ])
  const [teamMembers] = useState(['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'])

  const addTask = () => {
    setTasks([...tasks, { id: Date.now(), task: '', assignee: '', priority: 'medium', deadline: '' }])
  }

  const updateTask = (id: number, field: keyof Task, value: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  const removeTask = (id: number) => {
    if (tasks.length > 1) setTasks(tasks.filter(t => t.id !== id))
  }

  const generateDelegation = (): string => {
    let text = `TASK DELEGATION\n${'='.repeat(50)}\n\n`
    const grouped = tasks.reduce((acc, t) => {
      const assignee = t.assignee || 'Unassigned'
      if (!acc[assignee]) acc[assignee] = []
      acc[assignee].push(t)
      return acc
    }, {} as Record<string, Task[]>)

    Object.entries(grouped).forEach(([assignee, tasks]) => {
      text += `${assignee}\n${'─'.repeat(30)}\n`
      tasks.forEach((taskItem) => {
        if (taskItem.task) {
          const priority = taskItem.priority === 'high' ? '!' : taskItem.priority === 'medium' ? '-' : '.'
          text += `[${priority}] ${taskItem.task}`
          if (taskItem.deadline) text += ` (Due: ${taskItem.deadline})`
          text += '\n'
        }
      })
      text += '\n'
    })
    return text
  }

  const copyDelegation = () => {
    navigator.clipboard.writeText(generateDelegation())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.taskDelegator.tasks')}</h3>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="p-3 bg-slate-50 rounded space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={task.task}
                  onChange={(e) => updateTask(task.id, 'task', e.target.value)}
                  placeholder="Task description"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded"
                />
                <button onClick={() => removeTask(task.id)} className="px-2 text-red-500">X</button>
              </div>
              <div className="flex gap-2">
                <select
                  value={task.assignee}
                  onChange={(e) => updateTask(task.id, 'assignee', e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded"
                >
                  <option value="">Select assignee</option>
                  {teamMembers.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select
                  value={task.priority}
                  onChange={(e) => updateTask(task.id, 'priority', e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <input
                  type="date"
                  value={task.deadline}
                  onChange={(e) => updateTask(task.id, 'deadline', e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded"
                />
              </div>
            </div>
          ))}
        </div>
        <button onClick={addTask} className="w-full mt-3 py-2 border-2 border-dashed border-slate-300 rounded text-slate-500 hover:border-blue-500 hover:text-blue-500">
          + {t('tools.taskDelegator.addTask')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.taskDelegator.preview')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono">{generateDelegation()}</pre>
        <button onClick={copyDelegation} className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          {t('tools.taskDelegator.copy')}
        </button>
      </div>
    </div>
  )
}
