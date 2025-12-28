import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface AuditLog {
  id: number
  timestamp: string
  user: string
  action: string
  resource: string
  status: 'success' | 'failure' | 'warning'
  ip: string
  details: string
}

export default function AuditLogViewer() {
  const { t } = useTranslation()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [filter, setFilter] = useState({
    search: '',
    status: 'all',
    action: 'all',
    dateFrom: '',
    dateTo: '',
  })
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  const actions = ['LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT', 'PERMISSION_CHANGE']
  const users = ['admin@company.com', 'john@company.com', 'jane@company.com', 'system']

  useEffect(() => {
    // Generate demo logs
    const demoLogs: AuditLog[] = []
    const now = Date.now()

    for (let i = 0; i < 50; i++) {
      const timestamp = new Date(now - Math.random() * 7 * 24 * 60 * 60 * 1000)
      const action = actions[Math.floor(Math.random() * actions.length)]
      const user = users[Math.floor(Math.random() * users.length)]
      const status = Math.random() > 0.1 ? 'success' : Math.random() > 0.5 ? 'failure' : 'warning'

      demoLogs.push({
        id: i + 1,
        timestamp: timestamp.toISOString(),
        user,
        action,
        resource: ['User Account', 'Document', 'Settings', 'Report', 'Database'][Math.floor(Math.random() * 5)],
        status,
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        details: `${action} operation on resource`,
      })
    }

    setLogs(demoLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()))
  }, [])

  const filteredLogs = logs.filter(log => {
    if (filter.search && !JSON.stringify(log).toLowerCase().includes(filter.search.toLowerCase())) {
      return false
    }
    if (filter.status !== 'all' && log.status !== filter.status) {
      return false
    }
    if (filter.action !== 'all' && log.action !== filter.action) {
      return false
    }
    if (filter.dateFrom && new Date(log.timestamp) < new Date(filter.dateFrom)) {
      return false
    }
    if (filter.dateTo && new Date(log.timestamp) > new Date(filter.dateTo + 'T23:59:59')) {
      return false
    }
    return true
  })

  const getStatusColor = (status: AuditLog['status']): string => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-700'
      case 'failure': return 'bg-red-100 text-red-700'
      case 'warning': return 'bg-yellow-100 text-yellow-700'
    }
  }

  const exportLogs = () => {
    let csv = 'Timestamp,User,Action,Resource,Status,IP,Details\n'
    filteredLogs.forEach(log => {
      csv += `"${log.timestamp}","${log.user}","${log.action}","${log.resource}","${log.status}","${log.ip}","${log.details}"\n`
    })
    navigator.clipboard.writeText(csv)
  }

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString)
    return date.toLocaleString()
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.auditLogViewer.filters')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <input
              type="text"
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              placeholder="Search logs..."
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="failure">Failure</option>
            <option value="warning">Warning</option>
          </select>
          <select
            value={filter.action}
            onChange={(e) => setFilter({ ...filter, action: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded"
          >
            <option value="all">All Actions</option>
            {actions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <input
            type="date"
            value={filter.dateFrom}
            onChange={(e) => setFilter({ ...filter, dateFrom: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded"
            placeholder="From date"
          />
          <input
            type="date"
            value={filter.dateTo}
            onChange={(e) => setFilter({ ...filter, dateTo: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded"
            placeholder="To date"
          />
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.auditLogViewer.logs')} ({filteredLogs.length})</h3>
          <button
            onClick={exportLogs}
            className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
          >
            Export CSV
          </button>
        </div>
        <div className="flex gap-4 mb-3 text-sm">
          <span className="text-green-600">
            ✓ {filteredLogs.filter(l => l.status === 'success').length} Success
          </span>
          <span className="text-red-600">
            ✗ {filteredLogs.filter(l => l.status === 'failure').length} Failed
          </span>
          <span className="text-yellow-600">
            ⚠ {filteredLogs.filter(l => l.status === 'warning').length} Warnings
          </span>
        </div>
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {filteredLogs.slice(0, 100).map(log => (
            <div
              key={log.id}
              onClick={() => setSelectedLog(log)}
              className={`p-2 rounded cursor-pointer hover:bg-slate-100 ${
                selectedLog?.id === log.id ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 text-sm">
                <span className={`px-1.5 py-0.5 rounded text-xs ${getStatusColor(log.status)}`}>
                  {log.status === 'success' ? '✓' : log.status === 'failure' ? '✗' : '⚠'}
                </span>
                <span className="text-slate-400 text-xs w-32 shrink-0">
                  {formatDate(log.timestamp)}
                </span>
                <span className="font-medium text-blue-600 w-32 shrink-0 truncate">{log.user}</span>
                <span className="px-1.5 py-0.5 bg-slate-200 rounded text-xs">{log.action}</span>
                <span className="flex-1 truncate text-slate-600">{log.resource}</span>
                <span className="text-xs text-slate-400">{log.ip}</span>
              </div>
            </div>
          ))}
          {filteredLogs.length === 0 && (
            <p className="text-center text-slate-500 py-4">No logs match the filters</p>
          )}
        </div>
      </div>

      {selectedLog && (
        <div className="card p-4 bg-blue-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">{t('tools.auditLogViewer.details')}</h3>
            <button
              onClick={() => setSelectedLog(null)}
              className="text-slate-500 hover:text-slate-700"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="p-2 bg-white rounded">
              <span className="text-slate-500">Timestamp:</span>
              <span className="ml-2">{formatDate(selectedLog.timestamp)}</span>
            </div>
            <div className="p-2 bg-white rounded">
              <span className="text-slate-500">User:</span>
              <span className="ml-2">{selectedLog.user}</span>
            </div>
            <div className="p-2 bg-white rounded">
              <span className="text-slate-500">Action:</span>
              <span className="ml-2">{selectedLog.action}</span>
            </div>
            <div className="p-2 bg-white rounded">
              <span className="text-slate-500">Resource:</span>
              <span className="ml-2">{selectedLog.resource}</span>
            </div>
            <div className="p-2 bg-white rounded">
              <span className="text-slate-500">Status:</span>
              <span className={`ml-2 px-2 py-0.5 rounded ${getStatusColor(selectedLog.status)}`}>
                {selectedLog.status}
              </span>
            </div>
            <div className="p-2 bg-white rounded">
              <span className="text-slate-500">IP Address:</span>
              <span className="ml-2 font-mono">{selectedLog.ip}</span>
            </div>
            <div className="col-span-2 p-2 bg-white rounded">
              <span className="text-slate-500">Details:</span>
              <span className="ml-2">{selectedLog.details}</span>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.auditLogViewer.info')}</h4>
        <p className="text-sm text-slate-600">
          This is a demo audit log viewer. In production, logs would be fetched from
          a centralized logging system (SIEM, CloudWatch, Splunk, etc.).
        </p>
      </div>
    </div>
  )
}
