import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Todo {
  id: number
  text: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate: string | null
  createdAt: string
}

export default function TodoList() {
  const { t } = useTranslation()
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('simple-todo-list')
    if (saved) {
      try {
        setTodos(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load todos')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('simple-todo-list', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (!newTodo.trim()) return
    const todo: Todo = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false,
      priority,
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
    }
    setTodos([todo, ...todos])
    setNewTodo('')
    setDueDate('')
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'text-red-500 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-500 bg-green-50'
      default: return ''
    }
  }

  const activeTodos = todos.filter(t => !t.completed).length

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="space-y-3">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder={t('tools.todoList.newTask')}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <div className="flex gap-2 flex-wrap">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            >
              <option value="low">{t('tools.todoList.low')}</option>
              <option value="medium">{t('tools.todoList.medium')}</option>
              <option value="high">{t('tools.todoList.high')}</option>
            </select>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <button
              onClick={addTodo}
              className="px-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
            >
              + {t('tools.todoList.add')}
            </button>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          {(['all', 'active', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-sm font-medium ${
                filter === f ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {t(`tools.todoList.${f}`)}
            </button>
          ))}
          <div className="flex-1"></div>
          <span className="text-sm text-slate-500">
            {activeTodos} {t('tools.todoList.remaining')}
          </span>
        </div>

        {sortedTodos.length === 0 ? (
          <div className="text-center text-slate-500 py-8">
            <div className="text-4xl mb-2">✅</div>
            {filter === 'all'
              ? t('tools.todoList.noTasks')
              : t('tools.todoList.noTasksFilter')
            }
          </div>
        ) : (
          <div className="space-y-2">
            {sortedTodos.map(todo => (
              <div
                key={todo.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  todo.completed ? 'bg-slate-50' : 'bg-white border border-slate-200'
                }`}
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    todo.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-slate-300'
                  }`}
                >
                  {todo.completed && '✓'}
                </button>
                <div className="flex-1 min-w-0">
                  <span className={todo.completed ? 'line-through text-slate-400' : ''}>
                    {todo.text}
                  </span>
                  {todo.dueDate && (
                    <div className="text-xs text-slate-400 mt-1">
                      📅 {todo.dueDate}
                    </div>
                  )}
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                  {t(`tools.todoList.${todo.priority}`)}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-slate-400 hover:text-red-500"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        )}

        {todos.some(t => t.completed) && (
          <button
            onClick={clearCompleted}
            className="mt-4 text-sm text-slate-500 hover:text-red-500"
          >
            {t('tools.todoList.clearCompleted')}
          </button>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.todoList.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.todoList.tip1')}</li>
          <li>{t('tools.todoList.tip2')}</li>
          <li>{t('tools.todoList.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
