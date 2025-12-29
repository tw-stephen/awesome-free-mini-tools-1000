import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Task {
  id: string
  title: string
  description?: string
  color: string
  createdAt: string
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

export default function SimpleKanban() {
  const { t } = useTranslation()
  const [columns, setColumns] = useState<Column[]>([
    { id: 'todo', title: 'To Do', tasks: [] },
    { id: 'doing', title: 'In Progress', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] }
  ])
  const [newTask, setNewTask] = useState('')
  const [newTaskDesc, setNewTaskDesc] = useState('')
  const [selectedColor, setSelectedColor] = useState('#3b82f6')
  const [showAddTask, setShowAddTask] = useState(false)
  const [draggedTask, setDraggedTask] = useState<{ task: Task; fromColumn: string } | null>(null)

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

  useEffect(() => {
    const saved = localStorage.getItem('simple-kanban')
    if (saved) setColumns(JSON.parse(saved))
  }, [])

  const saveColumns = (updated: Column[]) => {
    setColumns(updated)
    localStorage.setItem('simple-kanban', JSON.stringify(updated))
  }

  const addTask = () => {
    if (!newTask.trim()) return
    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      description: newTaskDesc || undefined,
      color: selectedColor,
      createdAt: new Date().toISOString()
    }
    const updated = columns.map(col =>
      col.id === 'todo' ? { ...col, tasks: [task, ...col.tasks] } : col
    )
    saveColumns(updated)
    setNewTask('')
    setNewTaskDesc('')
    setShowAddTask(false)
  }

  const moveTask = (taskId: string, fromColumnId: string, toColumnId: string) => {
    if (fromColumnId === toColumnId) return

    const fromColumn = columns.find(c => c.id === fromColumnId)
    const task = fromColumn?.tasks.find(t => t.id === taskId)
    if (!task) return

    const updated = columns.map(col => {
      if (col.id === fromColumnId) {
        return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) }
      }
      if (col.id === toColumnId) {
        return { ...col, tasks: [task, ...col.tasks] }
      }
      return col
    })
    saveColumns(updated)
  }

  const deleteTask = (columnId: string, taskId: string) => {
    const updated = columns.map(col =>
      col.id === columnId ? { ...col, tasks: col.tasks.filter(t => t.id !== taskId) } : col
    )
    saveColumns(updated)
  }

  const handleDragStart = (task: Task, columnId: string) => {
    setDraggedTask({ task, fromColumn: columnId })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (columnId: string) => {
    if (draggedTask) {
      moveTask(draggedTask.task.id, draggedTask.fromColumn, columnId)
      setDraggedTask(null)
    }
  }

  const getStats = () => {
    const todo = columns.find(c => c.id === 'todo')?.tasks.length || 0
    const doing = columns.find(c => c.id === 'doing')?.tasks.length || 0
    const done = columns.find(c => c.id === 'done')?.tasks.length || 0
    const total = todo + doing + done
    return { todo, doing, done, total }
  }

  const stats = getStats()

  const clearDone = () => {
    const updated = columns.map(col =>
      col.id === 'done' ? { ...col, tasks: [] } : col
    )
    saveColumns(updated)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        <div className="card p-2 text-center">
          <div className="text-xl font-bold">{stats.total}</div>
          <div className="text-xs text-slate-500">{t('tools.simpleKanban.total')}</div>
        </div>
        <div className="card p-2 text-center bg-slate-50">
          <div className="text-xl font-bold text-slate-600">{stats.todo}</div>
          <div className="text-xs text-slate-500">{t('tools.simpleKanban.todo')}</div>
        </div>
        <div className="card p-2 text-center bg-blue-50">
          <div className="text-xl font-bold text-blue-600">{stats.doing}</div>
          <div className="text-xs text-slate-500">{t('tools.simpleKanban.doing')}</div>
        </div>
        <div className="card p-2 text-center bg-green-50">
          <div className="text-xl font-bold text-green-600">{stats.done}</div>
          <div className="text-xs text-slate-500">{t('tools.simpleKanban.done')}</div>
        </div>
      </div>

      <button
        onClick={() => setShowAddTask(!showAddTask)}
        className="w-full py-2 bg-blue-500 text-white rounded"
      >
        {showAddTask ? t('tools.simpleKanban.cancel') : t('tools.simpleKanban.addTask')}
      </button>

      {showAddTask && (
        <div className="card p-4 space-y-3">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder={t('tools.simpleKanban.taskTitle')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <textarea
            value={newTaskDesc}
            onChange={(e) => setNewTaskDesc(e.target.value)}
            placeholder={t('tools.simpleKanban.taskDescription')}
            className="w-full px-3 py-2 border border-slate-300 rounded h-16"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">{t('tools.simpleKanban.color')}:</span>
            {colors.map(c => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className={`w-6 h-6 rounded-full ${selectedColor === c ? 'ring-2 ring-offset-1 ring-slate-400' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <button
            onClick={addTask}
            disabled={!newTask.trim()}
            className="w-full py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            {t('tools.simpleKanban.create')}
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {columns.map(column => (
          <div
            key={column.id}
            className={`card p-2 min-h-[300px] ${
              column.id === 'todo' ? 'bg-slate-50' :
              column.id === 'doing' ? 'bg-blue-50' : 'bg-green-50'
            }`}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-sm">{t(`tools.simpleKanban.${column.id}`)}</h3>
              <span className="text-xs text-slate-500">{column.tasks.length}</span>
            </div>

            <div className="space-y-2">
              {column.tasks.map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task, column.id)}
                  className="bg-white p-2 rounded shadow-sm border-l-4 cursor-move"
                  style={{ borderColor: task.color }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{task.title}</div>
                      {task.description && (
                        <div className="text-xs text-slate-500 mt-1">{task.description}</div>
                      )}
                    </div>
                    <button
                      onClick={() => deleteTask(column.id, task.id)}
                      className="text-red-500 text-xs ml-1"
                    >
                      x
                    </button>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {column.id !== 'todo' && (
                      <button
                        onClick={() => moveTask(task.id, column.id, column.id === 'doing' ? 'todo' : 'doing')}
                        className="text-xs px-2 py-0.5 bg-slate-100 rounded"
                      >
                        &lt;
                      </button>
                    )}
                    {column.id !== 'done' && (
                      <button
                        onClick={() => moveTask(task.id, column.id, column.id === 'todo' ? 'doing' : 'done')}
                        className="text-xs px-2 py-0.5 bg-slate-100 rounded"
                      >
                        &gt;
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {column.tasks.length === 0 && (
                <div className="text-xs text-slate-400 text-center py-8">
                  {t('tools.simpleKanban.empty')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {stats.done > 0 && (
        <button
          onClick={clearDone}
          className="w-full py-2 bg-slate-100 text-slate-600 rounded"
        >
          {t('tools.simpleKanban.clearDone')}
        </button>
      )}

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium mb-2">{t('tools.simpleKanban.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>- {t('tools.simpleKanban.tip1')}</li>
          <li>- {t('tools.simpleKanban.tip2')}</li>
          <li>- {t('tools.simpleKanban.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
