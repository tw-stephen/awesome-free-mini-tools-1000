import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface ChecklistItem {
  id: string
  text: string
  checked: boolean
}

interface Checklist {
  id: string
  title: string
  items: ChecklistItem[]
  createdAt: string
}

export default function ChecklistMaker() {
  const { t } = useTranslation()
  const [checklists, setChecklists] = useState<Checklist[]>([])
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newItem, setNewItem] = useState('')
  const [copied, setCopied] = useState(false)

  const templates = [
    { name: t('tools.checklistMaker.travelPacking'), items: ['Passport', 'Phone charger', 'Toiletries', 'Clothes', 'Medications', 'Tickets'] },
    { name: t('tools.checklistMaker.groceryShopping'), items: ['Fruits', 'Vegetables', 'Milk', 'Bread', 'Eggs', 'Meat'] },
    { name: t('tools.checklistMaker.meetingPrep'), items: ['Agenda', 'Presentation', 'Notes', 'Questions', 'Follow-ups'] },
    { name: t('tools.checklistMaker.projectLaunch'), items: ['Testing complete', 'Documentation', 'Stakeholder approval', 'Backup plan', 'Launch announcement'] }
  ]

  useEffect(() => {
    const saved = localStorage.getItem('checklists')
    if (saved) setChecklists(JSON.parse(saved))
  }, [])

  const saveChecklists = (updated: Checklist[]) => {
    setChecklists(updated)
    localStorage.setItem('checklists', JSON.stringify(updated))
  }

  const createChecklist = (title: string, items: string[] = []) => {
    if (!title) return
    const checklist: Checklist = {
      id: Date.now().toString(),
      title,
      items: items.map((text, i) => ({ id: Date.now().toString() + i, text, checked: false })),
      createdAt: new Date().toISOString()
    }
    saveChecklists([checklist, ...checklists])
    setSelectedChecklist(checklist)
    setNewTitle('')
  }

  const updateChecklist = (updated: Checklist) => {
    saveChecklists(checklists.map(c => c.id === updated.id ? updated : c))
    setSelectedChecklist(updated)
  }

  const deleteChecklist = (id: string) => {
    saveChecklists(checklists.filter(c => c.id !== id))
    if (selectedChecklist?.id === id) setSelectedChecklist(null)
  }

  const addItem = () => {
    if (!selectedChecklist || !newItem) return
    const updated = {
      ...selectedChecklist,
      items: [...selectedChecklist.items, { id: Date.now().toString(), text: newItem, checked: false }]
    }
    updateChecklist(updated)
    setNewItem('')
  }

  const toggleItem = (itemId: string) => {
    if (!selectedChecklist) return
    const updated = {
      ...selectedChecklist,
      items: selectedChecklist.items.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    }
    updateChecklist(updated)
  }

  const deleteItem = (itemId: string) => {
    if (!selectedChecklist) return
    const updated = {
      ...selectedChecklist,
      items: selectedChecklist.items.filter(item => item.id !== itemId)
    }
    updateChecklist(updated)
  }

  const moveItem = (itemId: string, direction: 'up' | 'down') => {
    if (!selectedChecklist) return
    const index = selectedChecklist.items.findIndex(i => i.id === itemId)
    if (index === -1) return
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= selectedChecklist.items.length) return

    const items = [...selectedChecklist.items]
    ;[items[index], items[newIndex]] = [items[newIndex], items[index]]
    updateChecklist({ ...selectedChecklist, items })
  }

  const clearChecked = () => {
    if (!selectedChecklist) return
    const updated = {
      ...selectedChecklist,
      items: selectedChecklist.items.filter(item => !item.checked)
    }
    updateChecklist(updated)
  }

  const uncheckAll = () => {
    if (!selectedChecklist) return
    const updated = {
      ...selectedChecklist,
      items: selectedChecklist.items.map(item => ({ ...item, checked: false }))
    }
    updateChecklist(updated)
  }

  const copyChecklist = () => {
    if (!selectedChecklist) return
    const text = `${selectedChecklist.title}\n${selectedChecklist.items.map(i => `${i.checked ? '☑' : '☐'} ${i.text}`).join('\n')}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const duplicateChecklist = () => {
    if (!selectedChecklist) return
    createChecklist(
      `${selectedChecklist.title} (copy)`,
      selectedChecklist.items.map(i => i.text)
    )
  }

  const progress = selectedChecklist
    ? Math.round((selectedChecklist.items.filter(i => i.checked).length / selectedChecklist.items.length) * 100) || 0
    : 0

  return (
    <div className="space-y-4">
      {!selectedChecklist ? (
        <>
          <div className="card p-4">
            <h3 className="font-medium text-slate-700 mb-3">{t('tools.checklistMaker.createNew')}</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={t('tools.checklistMaker.checklistName')}
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
                onKeyDown={(e) => e.key === 'Enter' && createChecklist(newTitle)}
              />
              <button
                onClick={() => createChecklist(newTitle)}
                disabled={!newTitle}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium text-slate-700 mb-3">{t('tools.checklistMaker.templates')}</h3>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((template, i) => (
                <button
                  key={i}
                  onClick={() => createChecklist(template.name, template.items)}
                  className="p-3 bg-slate-50 rounded text-left hover:bg-slate-100"
                >
                  <div className="font-medium text-sm">{template.name}</div>
                  <div className="text-xs text-slate-500">{template.items.length} items</div>
                </button>
              ))}
            </div>
          </div>

          {checklists.length > 0 && (
            <div className="card p-4">
              <h3 className="font-medium text-slate-700 mb-3">{t('tools.checklistMaker.yourChecklists')}</h3>
              <div className="space-y-2">
                {checklists.map(checklist => {
                  const checked = checklist.items.filter(i => i.checked).length
                  const total = checklist.items.length
                  return (
                    <div
                      key={checklist.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded"
                    >
                      <div
                        onClick={() => setSelectedChecklist(checklist)}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium">{checklist.title}</div>
                        <div className="text-xs text-slate-500">
                          {checked}/{total} completed
                        </div>
                      </div>
                      <button
                        onClick={() => deleteChecklist(checklist.id)}
                        className="text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setSelectedChecklist(null)}
                className="px-3 py-1 bg-slate-100 rounded"
              >
                ←
              </button>
              <input
                type="text"
                value={selectedChecklist.title}
                onChange={(e) => updateChecklist({ ...selectedChecklist, title: e.target.value })}
                className="flex-1 px-3 py-2 border border-slate-300 rounded font-medium"
              />
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>{t('tools.checklistMaker.progress')}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded overflow-hidden">
                <div
                  className={`h-full ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder={t('tools.checklistMaker.addItem')}
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
                onKeyDown={(e) => e.key === 'Enter' && addItem()}
              />
              <button
                onClick={addItem}
                disabled={!newItem}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                +
              </button>
            </div>

            <div className="space-y-2">
              {selectedChecklist.items.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-2 p-2 rounded ${
                    item.checked ? 'bg-green-50' : 'bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItem(item.id)}
                    className="shrink-0"
                  />
                  <span className={`flex-1 ${item.checked ? 'line-through text-slate-400' : ''}`}>
                    {item.text}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveItem(item.id, 'up')}
                      disabled={index === 0}
                      className="text-xs text-slate-400 disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveItem(item.id, 'down')}
                      disabled={index === selectedChecklist.items.length - 1}
                      className="text-xs text-slate-400 disabled:opacity-30"
                    >
                      ▼
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-red-500 text-sm"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {selectedChecklist.items.length === 0 && (
              <p className="text-center text-slate-500 py-4">{t('tools.checklistMaker.noItems')}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={copyChecklist}
              className={`py-2 rounded ${copied ? 'bg-green-500 text-white' : 'bg-slate-100'}`}
            >
              {copied ? '✓' : t('tools.checklistMaker.copy')}
            </button>
            <button
              onClick={duplicateChecklist}
              className="py-2 bg-slate-100 rounded"
            >
              {t('tools.checklistMaker.duplicate')}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={uncheckAll}
              className="py-2 bg-slate-100 rounded text-sm"
            >
              {t('tools.checklistMaker.uncheckAll')}
            </button>
            <button
              onClick={clearChecked}
              className="py-2 bg-red-100 text-red-600 rounded text-sm"
            >
              {t('tools.checklistMaker.clearChecked')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
