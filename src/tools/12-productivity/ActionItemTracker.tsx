import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface ActionItem {
  id: string
  title: string
  assignee: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in-progress' | 'completed'
  source: string
  notes: string
  createdAt: string
}

export default function ActionItemTracker() {
  const { t } = useTranslation()
  const [items, setItems] = useState<ActionItem[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all')
  const [showForm, setShowForm] = useState(false)
  const [newItem, setNewItem] = useState({
    title: '',
    assignee: '',
    dueDate: '',
    priority: 'medium' as const,
    source: '',
    notes: ''
  })

  useEffect(() => {
    const saved = localStorage.getItem('action-items')
    if (saved) setItems(JSON.parse(saved))
  }, [])

  const saveItems = (updated: ActionItem[]) => {
    setItems(updated)
    localStorage.setItem('action-items', JSON.stringify(updated))
  }

  const addItem = () => {
    if (!newItem.title.trim()) return
    const item: ActionItem = {
      id: Date.now().toString(),
      title: newItem.title,
      assignee: newItem.assignee,
      dueDate: newItem.dueDate,
      priority: newItem.priority,
      status: 'pending',
      source: newItem.source,
      notes: newItem.notes,
      createdAt: new Date().toISOString()
    }
    saveItems([item, ...items])
    setNewItem({
      title: '',
      assignee: '',
      dueDate: '',
      priority: 'medium',
      source: '',
      notes: ''
    })
    setShowForm(false)
  }

  const updateStatus = (id: string, status: ActionItem['status']) => {
    const updated = items.map(i => i.id === id ? { ...i, status } : i)
    saveItems(updated)
  }

  const deleteItem = (id: string) => {
    saveItems(items.filter(i => i.id !== id))
  }

  const filteredItems = items.filter(i => filter === 'all' || i.status === filter)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-slate-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in-progress': return 'bg-blue-500'
      default: return 'bg-slate-300'
    }
  }

  const getDaysOverdue = (dueDate: string) => {
    if (!dueDate) return null
    const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days
  }

  const getStats = () => {
    const pending = items.filter(i => i.status === 'pending').length
    const inProgress = items.filter(i => i.status === 'in-progress').length
    const completed = items.filter(i => i.status === 'completed').length
    const overdue = items.filter(i => {
      if (!i.dueDate || i.status === 'completed') return false
      return getDaysOverdue(i.dueDate)! < 0
    }).length

    return { pending, inProgress, completed, overdue, total: items.length }
  }

  const stats = getStats()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        <div className="card p-2 text-center">
          <div className="text-xl font-bold text-slate-600">{stats.total}</div>
          <div className="text-xs text-slate-400">{t('tools.actionItemTracker.total')}</div>
        </div>
        <div className="card p-2 text-center">
          <div className="text-xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-xs text-slate-400">{t('tools.actionItemTracker.pending')}</div>
        </div>
        <div className="card p-2 text-center">
          <div className="text-xl font-bold text-blue-600">{stats.inProgress}</div>
          <div className="text-xs text-slate-400">{t('tools.actionItemTracker.inProgress')}</div>
        </div>
        <div className="card p-2 text-center">
          <div className="text-xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-xs text-slate-400">{t('tools.actionItemTracker.completed')}</div>
        </div>
      </div>

      {stats.overdue > 0 && (
        <div className="card p-3 bg-red-50 border-l-4 border-red-500">
          <span className="font-medium text-red-700">
            {stats.overdue} {t('tools.actionItemTracker.overdueItems')}
          </span>
        </div>
      )}

      <div className="flex gap-2">
        {(['all', 'pending', 'in-progress', 'completed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 rounded text-sm ${
              filter === f ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t(`tools.actionItemTracker.${f === 'all' ? 'all' : f}`)}
          </button>
        ))}
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full py-2 bg-blue-500 text-white rounded"
      >
        {showForm ? t('tools.actionItemTracker.cancel') : t('tools.actionItemTracker.addItem')}
      </button>

      {showForm && (
        <div className="card p-4 space-y-3">
          <input
            type="text"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            placeholder={t('tools.actionItemTracker.titlePlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={newItem.assignee}
              onChange={(e) => setNewItem({ ...newItem, assignee: e.target.value })}
              placeholder={t('tools.actionItemTracker.assignee')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <input
              type="date"
              value={newItem.dueDate}
              onChange={(e) => setNewItem({ ...newItem, dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-600 block mb-1">
                {t('tools.actionItemTracker.priority')}
              </label>
              <select
                value={newItem.priority}
                onChange={(e) => setNewItem({ ...newItem, priority: e.target.value as 'high' | 'medium' | 'low' })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                <option value="high">{t('tools.actionItemTracker.priorityHigh')}</option>
                <option value="medium">{t('tools.actionItemTracker.priorityMedium')}</option>
                <option value="low">{t('tools.actionItemTracker.priorityLow')}</option>
              </select>
            </div>
            <input
              type="text"
              value={newItem.source}
              onChange={(e) => setNewItem({ ...newItem, source: e.target.value })}
              placeholder={t('tools.actionItemTracker.source')}
              className="w-full px-3 py-2 border border-slate-300 rounded mt-5"
            />
          </div>

          <textarea
            value={newItem.notes}
            onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
            placeholder={t('tools.actionItemTracker.notes')}
            className="w-full px-3 py-2 border border-slate-300 rounded h-16"
          />

          <button
            onClick={addItem}
            disabled={!newItem.title.trim()}
            className="w-full py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            {t('tools.actionItemTracker.create')}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {filteredItems.length === 0 ? (
          <div className="card p-8 text-center text-slate-400">
            {t('tools.actionItemTracker.noItems')}
          </div>
        ) : (
          filteredItems.map(item => {
            const daysLeft = getDaysOverdue(item.dueDate)
            const isOverdue = daysLeft !== null && daysLeft < 0 && item.status !== 'completed'

            return (
              <div
                key={item.id}
                className={`card p-3 ${isOverdue ? 'border-l-4 border-red-500' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-1.5 ${getStatusColor(item.status)}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-medium ${item.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                        {item.title}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      {item.assignee && <span>@{item.assignee}</span>}
                      {item.dueDate && (
                        <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
                          {item.dueDate}
                          {daysLeft !== null && daysLeft < 0 && ` (${Math.abs(daysLeft)}d overdue)`}
                        </span>
                      )}
                      {item.source && <span>from: {item.source}</span>}
                    </div>

                    {item.notes && (
                      <div className="text-xs text-slate-400 mt-1">{item.notes}</div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <select
                      value={item.status}
                      onChange={(e) => updateStatus(item.id, e.target.value as ActionItem['status'])}
                      className="text-xs px-2 py-1 border border-slate-200 rounded"
                    >
                      <option value="pending">{t('tools.actionItemTracker.pending')}</option>
                      <option value="in-progress">{t('tools.actionItemTracker.inProgress')}</option>
                      <option value="completed">{t('tools.actionItemTracker.completed')}</option>
                    </select>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-red-500 text-xs"
                    >
                      {t('tools.actionItemTracker.delete')}
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
