import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type ColumnId = 'todo' | 'inProgress' | 'done'

interface KanbanCard {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  tags: string[]
  createdAt: string
}

interface KanbanColumn {
  id: ColumnId
  cards: KanbanCard[]
}

export default function KanbanBoard() {
  const { t } = useTranslation()
  const [columns, setColumns] = useState<KanbanColumn[]>([
    { id: 'todo', cards: [] },
    { id: 'inProgress', cards: [] },
    { id: 'done', cards: [] }
  ])
  const [showForm, setShowForm] = useState(false)
  const [editingCard, setEditingCard] = useState<KanbanCard | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    tags: ''
  })
  const [draggedCard, setDraggedCard] = useState<{ card: KanbanCard; fromColumn: ColumnId } | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('kanban-board')
    if (saved) setColumns(JSON.parse(saved))
  }, [])

  const saveColumns = (updated: KanbanColumn[]) => {
    setColumns(updated)
    localStorage.setItem('kanban-board', JSON.stringify(updated))
  }

  const addCard = () => {
    if (!form.title) return
    const card: KanbanCard = {
      id: Date.now().toString(),
      title: form.title,
      description: form.description,
      priority: form.priority,
      dueDate: form.dueDate,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString()
    }
    saveColumns(columns.map(col =>
      col.id === 'todo' ? { ...col, cards: [...col.cards, card] } : col
    ))
    resetForm()
  }

  const updateCard = () => {
    if (!editingCard || !form.title) return
    const updatedCard: KanbanCard = {
      ...editingCard,
      title: form.title,
      description: form.description,
      priority: form.priority,
      dueDate: form.dueDate,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
    }
    saveColumns(columns.map(col => ({
      ...col,
      cards: col.cards.map(c => c.id === editingCard.id ? updatedCard : c)
    })))
    resetForm()
  }

  const deleteCard = (cardId: string) => {
    saveColumns(columns.map(col => ({
      ...col,
      cards: col.cards.filter(c => c.id !== cardId)
    })))
  }

  const moveCard = (cardId: string, fromColumn: ColumnId, toColumn: ColumnId) => {
    const card = columns.find(c => c.id === fromColumn)?.cards.find(c => c.id === cardId)
    if (!card) return

    saveColumns(columns.map(col => {
      if (col.id === fromColumn) {
        return { ...col, cards: col.cards.filter(c => c.id !== cardId) }
      }
      if (col.id === toColumn) {
        return { ...col, cards: [...col.cards, card] }
      }
      return col
    }))
  }

  const resetForm = () => {
    setForm({ title: '', description: '', priority: 'medium', dueDate: '', tags: '' })
    setShowForm(false)
    setEditingCard(null)
  }

  const startEdit = (card: KanbanCard) => {
    setEditingCard(card)
    setForm({
      title: card.title,
      description: card.description,
      priority: card.priority,
      dueDate: card.dueDate,
      tags: card.tags.join(', ')
    })
    setShowForm(true)
  }

  const handleDragStart = (card: KanbanCard, columnId: ColumnId) => {
    setDraggedCard({ card, fromColumn: columnId })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (toColumn: ColumnId) => {
    if (draggedCard && draggedCard.fromColumn !== toColumn) {
      moveCard(draggedCard.card.id, draggedCard.fromColumn, toColumn)
    }
    setDraggedCard(null)
  }

  const columnInfo: Record<ColumnId, { title: string; color: string; bg: string }> = {
    todo: { title: t('tools.kanbanBoard.todo'), color: 'bg-slate-500', bg: 'bg-slate-50' },
    inProgress: { title: t('tools.kanbanBoard.inProgress'), color: 'bg-blue-500', bg: 'bg-blue-50' },
    done: { title: t('tools.kanbanBoard.done'), color: 'bg-green-500', bg: 'bg-green-50' }
  }

  const priorityColors = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700'
  }

  const getDaysUntilDue = (dueDate: string) => {
    if (!dueDate) return null
    return Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowForm(true)}
        className="w-full py-3 bg-blue-500 text-white rounded font-medium"
      >
        + {t('tools.kanbanBoard.addCard')}
      </button>

      {showForm && (
        <div className="card p-4 space-y-3">
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder={t('tools.kanbanBoard.cardTitle')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder={t('tools.kanbanBoard.description')}
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as 'low' | 'medium' | 'high' })}
              className="px-3 py-2 border border-slate-300 rounded"
            >
              <option value="low">{t('tools.kanbanBoard.low')}</option>
              <option value="medium">{t('tools.kanbanBoard.medium')}</option>
              <option value="high">{t('tools.kanbanBoard.high')}</option>
            </select>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder={t('tools.kanbanBoard.tagsPlaceholder')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div className="grid grid-cols-2 gap-2">
            <button onClick={resetForm} className="py-2 bg-slate-100 rounded">
              {t('tools.kanbanBoard.cancel')}
            </button>
            <button
              onClick={editingCard ? updateCard : addCard}
              disabled={!form.title}
              className="py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {editingCard ? t('tools.kanbanBoard.update') : t('tools.kanbanBoard.add')}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {columns.map(column => {
          const info = columnInfo[column.id]
          return (
            <div
              key={column.id}
              className={`${info.bg} rounded-lg p-2 min-h-[300px]`}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${info.color}`} />
                <span className="font-medium text-sm">{info.title}</span>
                <span className="text-xs text-slate-500 ml-auto">{column.cards.length}</span>
              </div>

              <div className="space-y-2">
                {column.cards.map(card => {
                  const daysUntilDue = getDaysUntilDue(card.dueDate)
                  return (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={() => handleDragStart(card, column.id)}
                      className="bg-white p-2 rounded shadow-sm cursor-move"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-medium text-sm">{card.title}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${priorityColors[card.priority]}`}>
                          {card.priority[0].toUpperCase()}
                        </span>
                      </div>
                      {card.description && (
                        <p className="text-xs text-slate-600 mb-1 line-clamp-2">{card.description}</p>
                      )}
                      {card.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-1">
                          {card.tags.map(tag => (
                            <span key={tag} className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs">
                        {daysUntilDue !== null && (
                          <span className={
                            daysUntilDue < 0 ? 'text-red-500' :
                            daysUntilDue <= 3 ? 'text-yellow-600' : 'text-slate-500'
                          }>
                            {daysUntilDue < 0 ? t('tools.kanbanBoard.overdue') :
                             daysUntilDue === 0 ? t('tools.kanbanBoard.today') :
                             `${daysUntilDue}d`}
                          </span>
                        )}
                        <div className="flex gap-1 ml-auto">
                          <button
                            onClick={() => startEdit(card)}
                            className="text-blue-500"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => deleteCard(card.id)}
                            className="text-red-500"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="card p-2">
          <div className="font-bold">{columns.find(c => c.id === 'todo')?.cards.length || 0}</div>
          <div className="text-xs text-slate-500">{t('tools.kanbanBoard.todo')}</div>
        </div>
        <div className="card p-2">
          <div className="font-bold text-blue-600">{columns.find(c => c.id === 'inProgress')?.cards.length || 0}</div>
          <div className="text-xs text-slate-500">{t('tools.kanbanBoard.inProgress')}</div>
        </div>
        <div className="card p-2">
          <div className="font-bold text-green-600">{columns.find(c => c.id === 'done')?.cards.length || 0}</div>
          <div className="text-xs text-slate-500">{t('tools.kanbanBoard.done')}</div>
        </div>
      </div>

      <button
        onClick={() => saveColumns([
          { id: 'todo', cards: [] },
          { id: 'inProgress', cards: [] },
          { id: 'done', cards: [] }
        ])}
        className="w-full py-2 bg-red-100 text-red-600 rounded text-sm"
      >
        {t('tools.kanbanBoard.clearAll')}
      </button>
    </div>
  )
}
