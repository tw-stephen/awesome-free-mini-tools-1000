import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ChecklistItem {
  id: number
  category: string
  task: string
  completed: boolean
  assignee: string
  dueDay: number
}

export default function OnboardingChecklist() {
  const { t } = useTranslation()
  const [employeeName, setEmployeeName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: 1, category: 'Before Day 1', task: 'Set up workstation', completed: false, assignee: 'IT', dueDay: -1 },
    { id: 2, category: 'Before Day 1', task: 'Create email account', completed: false, assignee: 'IT', dueDay: -1 },
    { id: 3, category: 'Day 1', task: 'Welcome meeting with manager', completed: false, assignee: 'Manager', dueDay: 1 },
    { id: 4, category: 'Day 1', task: 'Office tour', completed: false, assignee: 'HR', dueDay: 1 },
    { id: 5, category: 'Week 1', task: 'Team introductions', completed: false, assignee: 'Manager', dueDay: 5 },
    { id: 6, category: 'Week 1', task: 'Review company policies', completed: false, assignee: 'HR', dueDay: 5 },
  ])

  const toggleItem = (id: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const addItem = () => {
    setItems([...items, {
      id: Date.now(),
      category: 'Day 1',
      task: '',
      completed: false,
      assignee: '',
      dueDay: 1,
    }])
  }

  const updateItem = (id: number, field: keyof ChecklistItem, value: string | number | boolean) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const categories = [...new Set(items.map(i => i.category))]
  const completedCount = items.filter(i => i.completed).length
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0

  const generateChecklist = (): string => {
    let checklist = `ONBOARDING CHECKLIST\n`
    checklist += `Employee: ${employeeName || '[Name]'}\n`
    checklist += `Start Date: ${startDate || '[Date]'}\n`
    checklist += `${'='.repeat(50)}\n\n`

    categories.forEach(cat => {
      const catItems = items.filter(i => i.category === cat)
      checklist += `${cat}\n${'─'.repeat(30)}\n`
      catItems.forEach(item => {
        const status = item.completed ? '[X]' : '[ ]'
        checklist += `${status} ${item.task}`
        if (item.assignee) checklist += ` (${item.assignee})`
        checklist += '\n'
      })
      checklist += '\n'
    })

    checklist += `Progress: ${completedCount}/${items.length} (${progress.toFixed(0)}%)`
    return checklist
  }

  const copyChecklist = () => {
    navigator.clipboard.writeText(generateChecklist())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.onboardingChecklist.employee')}</label>
            <input
              type="text"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              placeholder="New employee name"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.onboardingChecklist.startDate')}</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.onboardingChecklist.progress')}</h3>
          <span className="text-sm font-mono">{completedCount}/{items.length}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {categories.map((category) => (
        <div key={category} className="card p-4">
          <h3 className="font-medium mb-3">{category}</h3>
          <div className="space-y-2">
            {items.filter(i => i.category === category).map((item) => (
              <div key={item.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleItem(item.id)}
                  className="w-5 h-5"
                />
                <input
                  type="text"
                  value={item.task}
                  onChange={(e) => updateItem(item.id, 'task', e.target.value)}
                  placeholder="Task description"
                  className={`flex-1 px-2 py-1 border border-slate-300 rounded text-sm ${
                    item.completed ? 'line-through text-slate-400' : ''
                  }`}
                />
                <input
                  type="text"
                  value={item.assignee}
                  onChange={(e) => updateItem(item.id, 'assignee', e.target.value)}
                  placeholder="Assignee"
                  className="w-24 px-2 py-1 border border-slate-300 rounded text-sm"
                />
                <button
                  onClick={() => removeItem(item.id)}
                  className="px-2 text-red-500 hover:bg-red-50 rounded text-sm"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={addItem}
        className="w-full py-2 border-2 border-dashed border-slate-300 rounded text-slate-500 hover:border-blue-500 hover:text-blue-500"
      >
        + {t('tools.onboardingChecklist.addItem')}
      </button>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.onboardingChecklist.preview')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono">
          {generateChecklist()}
        </pre>
        <button
          onClick={copyChecklist}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.onboardingChecklist.copy')}
        </button>
      </div>
    </div>
  )
}
