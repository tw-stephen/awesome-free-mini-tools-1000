import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface LogEntry {
  id: number
  date: string
  type: 'email' | 'call' | 'meeting' | 'chat' | 'other'
  participants: string
  subject: string
  summary: string
  actionItems: string
}

export default function CommunicationLog() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<LogEntry[]>([])
  const [newEntry, setNewEntry] = useState<Omit<LogEntry, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    type: 'email',
    participants: '',
    subject: '',
    summary: '',
    actionItems: ''
  })
  const [filterType, setFilterType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const addEntry = () => {
    if (!newEntry.subject.trim()) return
    setEntries([{ id: Date.now(), ...newEntry }, ...entries])
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      type: 'email',
      participants: '',
      subject: '',
      summary: '',
      actionItems: ''
    })
  }

  const removeEntry = (id: number) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  const typeIcons: Record<string, string> = {
    'email': '📧',
    'call': '📞',
    'meeting': '👥',
    'chat': '💬',
    'other': '📝',
  }

  const filteredEntries = entries
    .filter(e => filterType === 'all' || e.type === filterType)
    .filter(e =>
      searchTerm === '' ||
      e.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.participants.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.summary.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const generateLog = (): string => {
    let text = `COMMUNICATION LOG\\n${'='.repeat(50)}\\n\\n`

    filteredEntries.forEach(e => {
      text += `${e.date} | ${typeIcons[e.type]} ${e.type.toUpperCase()}\\n`
      text += `Subject: ${e.subject}\\n`
      if (e.participants) text += `With: ${e.participants}\\n`
      if (e.summary) text += `Summary: ${e.summary}\\n`
      if (e.actionItems) text += `Action Items: ${e.actionItems}\\n`
      text += `${'─'.repeat(40)}\\n\\n`
    })

    return text
  }

  const copyLog = () => {
    navigator.clipboard.writeText(generateLog())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.communicationLog.newEntry')}</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="date"
              value={newEntry.date}
              onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded"
            />
            <select
              value={newEntry.type}
              onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value as LogEntry['type'] })}
              className="px-3 py-2 border border-slate-300 rounded"
            >
              {Object.entries(typeIcons).map(([type, icon]) => (
                <option key={type} value={type}>{icon} {type}</option>
              ))}
            </select>
            <input
              type="text"
              value={newEntry.participants}
              onChange={(e) => setNewEntry({ ...newEntry, participants: e.target.value })}
              placeholder="Participants"
              className="flex-1 px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <input
            type="text"
            value={newEntry.subject}
            onChange={(e) => setNewEntry({ ...newEntry, subject: e.target.value })}
            placeholder="Subject"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <textarea
            value={newEntry.summary}
            onChange={(e) => setNewEntry({ ...newEntry, summary: e.target.value })}
            placeholder="Summary of communication..."
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <input
            type="text"
            value={newEntry.actionItems}
            onChange={(e) => setNewEntry({ ...newEntry, actionItems: e.target.value })}
            placeholder="Action items (if any)"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <button
            onClick={addEntry}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('tools.communicationLog.add')}
          </button>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search logs..."
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded"
          >
            <option value="all">All Types</option>
            {Object.entries(typeIcons).map(([type, icon]) => (
              <option key={type} value={type}>{icon} {type}</option>
            ))}
          </select>
        </div>

        <h3 className="font-medium mb-3">
          {t('tools.communicationLog.entries')} ({filteredEntries.length})
        </h3>

        {filteredEntries.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No entries found</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="p-4 bg-slate-50 rounded">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-sm text-slate-500">{entry.date}</span>
                    <span className="mx-2">{typeIcons[entry.type]}</span>
                    <span className="font-medium">{entry.subject}</span>
                  </div>
                  <button
                    onClick={() => removeEntry(entry.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
                {entry.participants && (
                  <p className="text-sm text-slate-600 mb-1">
                    <span className="text-slate-400">With:</span> {entry.participants}
                  </p>
                )}
                {entry.summary && (
                  <p className="text-sm text-slate-700 mb-1">{entry.summary}</p>
                )}
                {entry.actionItems && (
                  <p className="text-sm text-blue-600">
                    <span className="font-medium">Action:</span> {entry.actionItems}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.communicationLog.export')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">
          {generateLog()}
        </pre>
        <button
          onClick={copyLog}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.communicationLog.copy')}
        </button>
      </div>
    </div>
  )
}
