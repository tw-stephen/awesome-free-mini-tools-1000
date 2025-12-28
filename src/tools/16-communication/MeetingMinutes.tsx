import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ActionItem {
  id: number
  task: string
  assignee: string
  dueDate: string
}

export default function MeetingMinutes() {
  const { t } = useTranslation()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [attendees, setAttendees] = useState('')
  const [discussion, setDiscussion] = useState('')
  const [decisions, setDecisions] = useState('')
  const [actionItems, setActionItems] = useState<ActionItem[]>([
    { id: 1, task: '', assignee: '', dueDate: '' }
  ])

  const addActionItem = () => {
    setActionItems([...actionItems, { id: Date.now(), task: '', assignee: '', dueDate: '' }])
  }

  const updateActionItem = (id: number, field: keyof ActionItem, value: string) => {
    setActionItems(actionItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const removeActionItem = (id: number) => {
    if (actionItems.length > 1) {
      setActionItems(actionItems.filter(item => item.id !== id))
    }
  }

  const generateMinutes = (): string => {
    let minutes = `MEETING MINUTES\n${'='.repeat(50)}\n\n`
    minutes += `Meeting: ${title || '[Meeting Title]'}\n`
    minutes += `Date: ${date || '[Date]'}\n`
    minutes += `Attendees: ${attendees || '[Attendees]'}\n\n`
    minutes += `${'='.repeat(50)}\n\n`

    if (discussion) {
      minutes += `DISCUSSION NOTES:\n${'─'.repeat(30)}\n${discussion}\n\n`
    }

    if (decisions) {
      minutes += `DECISIONS MADE:\n${'─'.repeat(30)}\n${decisions}\n\n`
    }

    minutes += `ACTION ITEMS:\n${'─'.repeat(30)}\n`
    actionItems.forEach((item, index) => {
      if (item.task) {
        minutes += `${index + 1}. ${item.task}\n`
        if (item.assignee) minutes += `   Assigned to: ${item.assignee}\n`
        if (item.dueDate) minutes += `   Due: ${item.dueDate}\n`
        minutes += '\n'
      }
    })

    minutes += `\n${'='.repeat(50)}\nMinutes recorded on ${new Date().toLocaleDateString()}`
    return minutes
  }

  const copyMinutes = () => {
    navigator.clipboard.writeText(generateMinutes())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.meetingMinutes.title')}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Meeting title"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.meetingMinutes.date')}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.meetingMinutes.attendees')}</label>
            <input
              type="text"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              placeholder="John, Jane, etc."
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.meetingMinutes.discussion')}</label>
          <textarea
            value={discussion}
            onChange={(e) => setDiscussion(e.target.value)}
            placeholder="Key discussion points..."
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.meetingMinutes.decisions')}</label>
          <textarea
            value={decisions}
            onChange={(e) => setDecisions(e.target.value)}
            placeholder="Decisions made..."
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.meetingMinutes.actionItems')}</h3>
        <div className="space-y-3">
          {actionItems.map((item) => (
            <div key={item.id} className="flex gap-2 items-start">
              <div className="flex-1 grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={item.task}
                  onChange={(e) => updateActionItem(item.id, 'task', e.target.value)}
                  placeholder="Task"
                  className="col-span-3 sm:col-span-1 px-3 py-2 border border-slate-300 rounded"
                />
                <input
                  type="text"
                  value={item.assignee}
                  onChange={(e) => updateActionItem(item.id, 'assignee', e.target.value)}
                  placeholder="Assignee"
                  className="px-3 py-2 border border-slate-300 rounded"
                />
                <input
                  type="date"
                  value={item.dueDate}
                  onChange={(e) => updateActionItem(item.id, 'dueDate', e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded"
                />
              </div>
              <button
                onClick={() => removeActionItem(item.id)}
                className="px-2 py-2 text-red-500 hover:bg-red-50 rounded"
              >
                X
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addActionItem}
          className="w-full mt-3 py-2 border-2 border-dashed border-slate-300 rounded text-slate-500 hover:border-blue-500 hover:text-blue-500"
        >
          + {t('tools.meetingMinutes.addAction')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.meetingMinutes.preview')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono">
          {generateMinutes()}
        </pre>
        <button
          onClick={copyMinutes}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.meetingMinutes.copy')}
        </button>
      </div>
    </div>
  )
}
