import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Topic {
  id: number
  text: string
  addedBy: 'manager' | 'employee'
}

export default function OneOnOneAgenda() {
  const { t } = useTranslation()
  const [managerName, setManagerName] = useState('')
  const [employeeName, setEmployeeName] = useState('')
  const [date, setDate] = useState('')
  const [topics, setTopics] = useState<Topic[]>([])
  const [actionItems, setActionItems] = useState<string[]>([''])
  const [notes, setNotes] = useState('')

  const addTopic = (addedBy: 'manager' | 'employee') => {
    setTopics([...topics, { id: Date.now(), text: '', addedBy }])
  }

  const updateTopic = (id: number, text: string) => {
    setTopics(topics.map(t => t.id === id ? { ...t, text } : t))
  }

  const removeTopic = (id: number) => {
    setTopics(topics.filter(t => t.id !== id))
  }

  const addActionItem = () => {
    setActionItems([...actionItems, ''])
  }

  const updateActionItem = (index: number, text: string) => {
    const newItems = [...actionItems]
    newItems[index] = text
    setActionItems(newItems)
  }

  const removeActionItem = (index: number) => {
    if (actionItems.length > 1) {
      setActionItems(actionItems.filter((_, i) => i !== index))
    }
  }

  const generateAgenda = (): string => {
    let agenda = `1:1 MEETING AGENDA\n${'='.repeat(50)}\n\n`
    agenda += `Manager: ${managerName || '[Manager]'}\n`
    agenda += `Employee: ${employeeName || '[Employee]'}\n`
    agenda += `Date: ${date || '[Date]'}\n\n`

    const managerTopics = topics.filter(t => t.addedBy === 'manager')
    const employeeTopics = topics.filter(t => t.addedBy === 'employee')

    if (managerTopics.length > 0) {
      agenda += `Manager's Topics\n${'─'.repeat(30)}\n`
      managerTopics.forEach((t, i) => {
        if (t.text) agenda += `${i + 1}. ${t.text}\n`
      })
      agenda += '\n'
    }

    if (employeeTopics.length > 0) {
      agenda += `Employee's Topics\n${'─'.repeat(30)}\n`
      employeeTopics.forEach((t, i) => {
        if (t.text) agenda += `${i + 1}. ${t.text}\n`
      })
      agenda += '\n'
    }

    const validActions = actionItems.filter(a => a.trim())
    if (validActions.length > 0) {
      agenda += `Action Items\n${'─'.repeat(30)}\n`
      validActions.forEach((a) => {
        agenda += `[ ] ${a}\n`
      })
      agenda += '\n'
    }

    if (notes) {
      agenda += `Notes\n${'─'.repeat(30)}\n${notes}\n`
    }

    return agenda
  }

  const copyAgenda = () => {
    navigator.clipboard.writeText(generateAgenda())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.oneOnOneAgenda.manager')}</label>
            <input
              type="text"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              placeholder="Manager name"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.oneOnOneAgenda.employee')}</label>
            <input
              type="text"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              placeholder="Employee name"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.oneOnOneAgenda.date')}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-blue-700">{t('tools.oneOnOneAgenda.managerTopics')}</h3>
            <button
              onClick={() => addTopic('manager')}
              className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              + Add
            </button>
          </div>
          <div className="space-y-2">
            {topics.filter(t => t.addedBy === 'manager').map((topic) => (
              <div key={topic.id} className="flex gap-2">
                <input
                  type="text"
                  value={topic.text}
                  onChange={(e) => updateTopic(topic.id, e.target.value)}
                  placeholder="Topic..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
                />
                <button
                  onClick={() => removeTopic(topic.id)}
                  className="px-2 text-red-500"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-green-700">{t('tools.oneOnOneAgenda.employeeTopics')}</h3>
            <button
              onClick={() => addTopic('employee')}
              className="px-2 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              + Add
            </button>
          </div>
          <div className="space-y-2">
            {topics.filter(t => t.addedBy === 'employee').map((topic) => (
              <div key={topic.id} className="flex gap-2">
                <input
                  type="text"
                  value={topic.text}
                  onChange={(e) => updateTopic(topic.id, e.target.value)}
                  placeholder="Topic..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
                />
                <button
                  onClick={() => removeTopic(topic.id)}
                  className="px-2 text-red-500"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.oneOnOneAgenda.actionItems')}</h3>
          <button
            onClick={addActionItem}
            className="px-2 py-1 text-sm bg-slate-100 rounded hover:bg-slate-200"
          >
            + Add
          </button>
        </div>
        <div className="space-y-2">
          {actionItems.map((item, index) => (
            <div key={index} className="flex gap-2">
              <span className="px-2 py-2 text-slate-400">[ ]</span>
              <input
                type="text"
                value={item}
                onChange={(e) => updateActionItem(index, e.target.value)}
                placeholder="Action item..."
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
              />
              {actionItems.length > 1 && (
                <button
                  onClick={() => removeActionItem(index)}
                  className="px-2 text-red-500"
                >
                  X
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-1">{t('tools.oneOnOneAgenda.notes')}</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Meeting notes..."
          rows={4}
          className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.oneOnOneAgenda.preview')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono">
          {generateAgenda()}
        </pre>
        <button
          onClick={copyAgenda}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.oneOnOneAgenda.copy')}
        </button>
      </div>
    </div>
  )
}
