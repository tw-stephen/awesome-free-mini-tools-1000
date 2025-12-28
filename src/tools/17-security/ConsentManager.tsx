import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ConsentRecord {
  id: number
  userId: string
  purpose: string
  granted: boolean
  timestamp: string
  expiresAt: string
  source: string
  version: string
}

export default function ConsentManager() {
  const { t } = useTranslation()
  const [records, setRecords] = useState<ConsentRecord[]>([
    {
      id: 1,
      userId: 'user_001',
      purpose: 'Marketing Communications',
      granted: true,
      timestamp: '2024-01-15T10:30:00',
      expiresAt: '2025-01-15',
      source: 'Web Form',
      version: '1.0',
    },
    {
      id: 2,
      userId: 'user_001',
      purpose: 'Analytics Tracking',
      granted: false,
      timestamp: '2024-01-15T10:30:00',
      expiresAt: '2025-01-15',
      source: 'Cookie Banner',
      version: '1.0',
    },
  ])
  const [filter, setFilter] = useState('')
  const [showForm, setShowForm] = useState(false)

  const purposes = [
    'Marketing Communications',
    'Analytics Tracking',
    'Personalization',
    'Third-Party Sharing',
    'Research & Development',
    'Profiling',
    'Automated Decision Making',
  ]

  const sources = ['Web Form', 'Cookie Banner', 'Mobile App', 'Email', 'Phone', 'In Person']

  const addRecord = (record: Omit<ConsentRecord, 'id'>) => {
    setRecords([...records, { ...record, id: Date.now() }])
    setShowForm(false)
  }

  const updateConsent = (id: number, granted: boolean) => {
    setRecords(records.map(r =>
      r.id === id ? {
        ...r,
        granted,
        timestamp: new Date().toISOString(),
      } : r
    ))
  }

  const deleteRecord = (id: number) => {
    setRecords(records.filter(r => r.id !== id))
  }

  const filteredRecords = records.filter(r =>
    r.userId.toLowerCase().includes(filter.toLowerCase()) ||
    r.purpose.toLowerCase().includes(filter.toLowerCase())
  )

  const exportRecords = () => {
    let report = `CONSENT RECORDS EXPORT\n${'='.repeat(60)}\n\n`
    report += `Generated: ${new Date().toLocaleString()}\n`
    report += `Total Records: ${records.length}\n\n`

    const grouped = records.reduce((acc, r) => {
      if (!acc[r.userId]) acc[r.userId] = []
      acc[r.userId].push(r)
      return acc
    }, {} as Record<string, ConsentRecord[]>)

    Object.entries(grouped).forEach(([userId, userRecords]) => {
      report += `User: ${userId}\n${'─'.repeat(40)}\n`
      userRecords.forEach(r => {
        report += `  ${r.purpose}: ${r.granted ? 'GRANTED' : 'DENIED'}\n`
        report += `    Date: ${new Date(r.timestamp).toLocaleString()}\n`
        report += `    Source: ${r.source}\n`
        report += `    Expires: ${r.expiresAt}\n`
      })
      report += '\n'
    })

    navigator.clipboard.writeText(report)
  }

  const RecordForm = () => {
    const [form, setForm] = useState({
      userId: '',
      purpose: purposes[0],
      granted: true,
      source: sources[0],
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      version: '1.0',
    })

    return (
      <div className="card p-4 border-2 border-blue-300">
        <h3 className="font-medium mb-3">{t('tools.consentManager.addRecord')}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">User ID</label>
            <input
              type="text"
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
              placeholder="e.g., user_001"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-500 block mb-1">Purpose</label>
              <select
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                {purposes.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">Source</label>
              <select
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                {sources.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">Consent</label>
              <select
                value={form.granted ? 'granted' : 'denied'}
                onChange={(e) => setForm({ ...form, granted: e.target.value === 'granted' })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                <option value="granted">Granted</option>
                <option value="denied">Denied</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">Expires</label>
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => addRecord({
                ...form,
                timestamp: new Date().toISOString(),
              })}
              disabled={!form.userId}
              className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
            >
              Add Record
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.consentManager.records')}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(true)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
            >
              + Add Record
            </button>
            <button
              onClick={exportRecords}
              className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
            >
              Export
            </button>
          </div>
        </div>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search by user ID or purpose..."
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      {showForm && <RecordForm />}

      <div className="card p-4">
        <div className="flex gap-4 mb-3 text-sm text-slate-500">
          <span>Total: {records.length}</span>
          <span className="text-green-600">Granted: {records.filter(r => r.granted).length}</span>
          <span className="text-red-600">Denied: {records.filter(r => !r.granted).length}</span>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredRecords.map(record => (
            <div key={record.id} className={`p-3 rounded border ${
              record.granted ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-medium">{record.userId}</span>
                  <span className="mx-2 text-slate-400">•</span>
                  <span>{record.purpose}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => updateConsent(record.id, !record.granted)}
                    className={`text-xs px-2 py-1 rounded ${
                      record.granted
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {record.granted ? 'Revoke' : 'Grant'}
                  </button>
                  <button
                    onClick={() => deleteRecord(record.id)}
                    className="text-xs px-2 py-1 text-slate-500 hover:bg-slate-100 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="flex gap-4 text-xs text-slate-500">
                <span>Source: {record.source}</span>
                <span>Date: {new Date(record.timestamp).toLocaleDateString()}</span>
                <span>Expires: {record.expiresAt}</span>
                <span>v{record.version}</span>
              </div>
            </div>
          ))}

          {filteredRecords.length === 0 && (
            <p className="text-center text-slate-500 py-4">No records found</p>
          )}
        </div>
      </div>

      <div className="card p-4 bg-blue-50">
        <h4 className="font-medium mb-2">{t('tools.consentManager.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Record all consent with timestamp and source</li>
          <li>• Allow easy consent withdrawal</li>
          <li>• Set expiration dates for consent validity</li>
          <li>• Keep version history for compliance audits</li>
        </ul>
      </div>
    </div>
  )
}
