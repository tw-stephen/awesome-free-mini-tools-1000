import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type TaskCategory = 'venue' | 'food' | 'decorations' | 'entertainment' | 'guests' | 'supplies'
type TaskStatus = 'todo' | 'in_progress' | 'done'

interface Task {
  id: string
  title: string
  category: TaskCategory
  status: TaskStatus
  dueDate: string
  notes: string
  budget: number
  spent: number
}

interface Party {
  id: string
  name: string
  date: string
  location: string
  theme: string
  guestCount: number
  totalBudget: number
  tasks: Task[]
}

export default function PartyPlanner() {
  const { t } = useTranslation()
  const [party, setParty] = useState<Party>({
    id: '',
    name: '',
    date: '',
    location: '',
    theme: '',
    guestCount: 0,
    totalBudget: 0,
    tasks: []
  })
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all')

  const [taskForm, setTaskForm] = useState({
    title: '',
    category: 'venue' as TaskCategory,
    dueDate: '',
    notes: '',
    budget: '',
    spent: ''
  })

  useEffect(() => {
    const saved = localStorage.getItem('party-planner')
    if (saved) {
      setParty(JSON.parse(saved))
    } else {
      setParty(prev => ({ ...prev, id: Date.now().toString() }))
    }
  }, [])

  const saveParty = (updated: Party) => {
    setParty(updated)
    localStorage.setItem('party-planner', JSON.stringify(updated))
  }

  const addTask = () => {
    if (!taskForm.title) return
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskForm.title,
      category: taskForm.category,
      status: 'todo',
      dueDate: taskForm.dueDate,
      notes: taskForm.notes,
      budget: parseFloat(taskForm.budget) || 0,
      spent: parseFloat(taskForm.spent) || 0
    }
    saveParty({ ...party, tasks: [...party.tasks, newTask] })
    setTaskForm({ title: '', category: 'venue', dueDate: '', notes: '', budget: '', spent: '' })
    setShowTaskForm(false)
  }

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    const updatedTasks = party.tasks.map(task =>
      task.id === taskId ? { ...task, status } : task
    )
    saveParty({ ...party, tasks: updatedTasks })
  }

  const updateTaskSpent = (taskId: string, spent: number) => {
    const updatedTasks = party.tasks.map(task =>
      task.id === taskId ? { ...task, spent } : task
    )
    saveParty({ ...party, tasks: updatedTasks })
  }

  const deleteTask = (taskId: string) => {
    saveParty({ ...party, tasks: party.tasks.filter(t => t.id !== taskId) })
  }

  const categoryIcons: Record<TaskCategory, string> = {
    venue: '🏠',
    food: '🍕',
    decorations: '🎈',
    entertainment: '🎵',
    guests: '👥',
    supplies: '📦'
  }

  const statusColors: Record<TaskStatus, string> = {
    todo: 'bg-slate-100 text-slate-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    done: 'bg-green-100 text-green-700'
  }

  const filteredTasks = selectedCategory === 'all'
    ? party.tasks
    : party.tasks.filter(t => t.category === selectedCategory)

  const totalBudget = party.tasks.reduce((sum, t) => sum + t.budget, 0)
  const totalSpent = party.tasks.reduce((sum, t) => sum + t.spent, 0)
  const completedTasks = party.tasks.filter(t => t.status === 'done').length
  const daysUntilParty = party.date
    ? Math.ceil((new Date(party.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <h3 className="text-sm font-medium text-slate-700">
          {t('tools.partyPlanner.partyDetails')}
        </h3>
        <input
          type="text"
          value={party.name}
          onChange={(e) => saveParty({ ...party, name: e.target.value })}
          placeholder={t('tools.partyPlanner.partyName')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="datetime-local"
            value={party.date}
            onChange={(e) => saveParty({ ...party, date: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            value={party.location}
            onChange={(e) => saveParty({ ...party, location: e.target.value })}
            placeholder={t('tools.partyPlanner.location')}
            className="px-3 py-2 border border-slate-300 rounded"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={party.theme}
            onChange={(e) => saveParty({ ...party, theme: e.target.value })}
            placeholder={t('tools.partyPlanner.theme')}
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="number"
            value={party.guestCount || ''}
            onChange={(e) => saveParty({ ...party, guestCount: parseInt(e.target.value) || 0 })}
            placeholder={t('tools.partyPlanner.guestCount')}
            className="px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-blue-600">
            {daysUntilParty !== null ? (daysUntilParty > 0 ? daysUntilParty : 0) : '-'}
          </div>
          <div className="text-xs text-slate-500">{t('tools.partyPlanner.daysLeft')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-purple-600">
            {completedTasks}/{party.tasks.length}
          </div>
          <div className="text-xs text-slate-500">{t('tools.partyPlanner.tasks')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xl font-bold text-green-600">${totalBudget}</div>
          <div className="text-xs text-slate-500">{t('tools.partyPlanner.budget')}</div>
        </div>
        <div className="card p-3 text-center">
          <div className={`text-xl font-bold ${totalSpent > totalBudget ? 'text-red-600' : 'text-orange-600'}`}>
            ${totalSpent}
          </div>
          <div className="text-xs text-slate-500">{t('tools.partyPlanner.spent')}</div>
        </div>
      </div>

      {totalBudget > 0 && (
        <div className="card p-4">
          <div className="flex justify-between text-sm mb-2">
            <span>{t('tools.partyPlanner.budgetProgress')}</span>
            <span>{Math.round((totalSpent / totalBudget) * 100)}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${totalSpent > totalBudget ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      <button
        onClick={() => setShowTaskForm(true)}
        className="w-full py-3 bg-blue-500 text-white rounded font-medium"
      >
        + {t('tools.partyPlanner.addTask')}
      </button>

      {showTaskForm && (
        <div className="card p-4 space-y-3">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.partyPlanner.newTask')}
          </h3>
          <input
            type="text"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            placeholder={t('tools.partyPlanner.taskTitle')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div className="flex flex-wrap gap-2">
            {(['venue', 'food', 'decorations', 'entertainment', 'guests', 'supplies'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setTaskForm({ ...taskForm, category: cat })}
                className={`px-2 py-1 rounded text-xs capitalize ${
                  taskForm.category === cat ? 'bg-blue-500 text-white' : 'bg-slate-100'
                }`}
              >
                {categoryIcons[cat]} {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={taskForm.dueDate}
              onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="number"
              value={taskForm.budget}
              onChange={(e) => setTaskForm({ ...taskForm, budget: e.target.value })}
              placeholder={t('tools.partyPlanner.taskBudget')}
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <textarea
            value={taskForm.notes}
            onChange={(e) => setTaskForm({ ...taskForm, notes: e.target.value })}
            placeholder={t('tools.partyPlanner.notes')}
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setShowTaskForm(false)}
              className="flex-1 py-2 bg-slate-100 rounded"
            >
              {t('tools.partyPlanner.cancel')}
            </button>
            <button
              onClick={addTask}
              disabled={!taskForm.title}
              className="flex-1 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {t('tools.partyPlanner.add')}
            </button>
          </div>
        </div>
      )}

      <div className="card p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded text-sm ${
              selectedCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.partyPlanner.all')}
          </button>
          {(['venue', 'food', 'decorations', 'entertainment', 'guests', 'supplies'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded text-sm capitalize ${
                selectedCategory === cat ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {categoryIcons[cat]}
            </button>
          ))}
        </div>

        {filteredTasks.length === 0 ? (
          <p className="text-center text-slate-500 py-4">{t('tools.partyPlanner.noTasks')}</p>
        ) : (
          <div className="space-y-2">
            {filteredTasks.map(task => (
              <div key={task.id} className="p-3 bg-slate-50 rounded">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span>{categoryIcons[task.category]}</span>
                      <span className={`font-medium ${task.status === 'done' ? 'line-through text-slate-400' : ''}`}>
                        {task.title}
                      </span>
                    </div>
                    {task.notes && (
                      <p className="text-xs text-slate-500 mt-1">{task.notes}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      {task.dueDate && (
                        <span className="text-slate-500">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      {task.budget > 0 && (
                        <span className="text-slate-500">
                          ${task.spent}/${task.budget}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                      className={`text-xs px-2 py-1 rounded ${statusColors[task.status]}`}
                    >
                      <option value="todo">{t('tools.partyPlanner.todo')}</option>
                      <option value="in_progress">{t('tools.partyPlanner.inProgress')}</option>
                      <option value="done">{t('tools.partyPlanner.done')}</option>
                    </select>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-xs text-red-400"
                    >
                      {t('tools.partyPlanner.delete')}
                    </button>
                  </div>
                </div>
                {task.budget > 0 && task.status !== 'done' && (
                  <div className="mt-2 pt-2 border-t flex items-center gap-2">
                    <span className="text-xs text-slate-500">{t('tools.partyPlanner.updateSpent')}:</span>
                    <input
                      type="number"
                      value={task.spent}
                      onChange={(e) => updateTaskSpent(task.id, parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border border-slate-300 rounded text-xs"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
