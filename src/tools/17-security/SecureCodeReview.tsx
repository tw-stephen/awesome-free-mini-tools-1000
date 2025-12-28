import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ReviewItem {
  id: string
  category: string
  check: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: 'pass' | 'fail' | 'na' | null
  notes: string
}

export default function SecureCodeReview() {
  const { t } = useTranslation()
  const [projectName, setProjectName] = useState('')
  const [reviewerName, setReviewerName] = useState('')
  const [items, setItems] = useState<ReviewItem[]>([
    // Input Validation
    { id: 'iv1', category: 'Input Validation', check: 'All user inputs are validated on server-side', severity: 'critical', status: null, notes: '' },
    { id: 'iv2', category: 'Input Validation', check: 'Input length limits are enforced', severity: 'high', status: null, notes: '' },
    { id: 'iv3', category: 'Input Validation', check: 'Special characters are properly escaped', severity: 'critical', status: null, notes: '' },
    { id: 'iv4', category: 'Input Validation', check: 'File upload types are restricted', severity: 'high', status: null, notes: '' },
    // Authentication
    { id: 'au1', category: 'Authentication', check: 'Passwords are hashed with strong algorithm (bcrypt, Argon2)', severity: 'critical', status: null, notes: '' },
    { id: 'au2', category: 'Authentication', check: 'Session tokens are securely generated', severity: 'critical', status: null, notes: '' },
    { id: 'au3', category: 'Authentication', check: 'Account lockout after failed attempts', severity: 'high', status: null, notes: '' },
    { id: 'au4', category: 'Authentication', check: 'Password reset tokens expire properly', severity: 'high', status: null, notes: '' },
    // Authorization
    { id: 'az1', category: 'Authorization', check: 'Access control checks on all endpoints', severity: 'critical', status: null, notes: '' },
    { id: 'az2', category: 'Authorization', check: 'Vertical privilege escalation prevented', severity: 'critical', status: null, notes: '' },
    { id: 'az3', category: 'Authorization', check: 'Horizontal access control enforced', severity: 'high', status: null, notes: '' },
    { id: 'az4', category: 'Authorization', check: 'IDOR vulnerabilities addressed', severity: 'critical', status: null, notes: '' },
    // Data Protection
    { id: 'dp1', category: 'Data Protection', check: 'Sensitive data encrypted at rest', severity: 'high', status: null, notes: '' },
    { id: 'dp2', category: 'Data Protection', check: 'TLS used for all data in transit', severity: 'critical', status: null, notes: '' },
    { id: 'dp3', category: 'Data Protection', check: 'PII properly masked in logs', severity: 'high', status: null, notes: '' },
    { id: 'dp4', category: 'Data Protection', check: 'Secrets not hardcoded in source', severity: 'critical', status: null, notes: '' },
    // SQL/NoSQL
    { id: 'sq1', category: 'Database', check: 'Parameterized queries used (no SQL injection)', severity: 'critical', status: null, notes: '' },
    { id: 'sq2', category: 'Database', check: 'NoSQL injection prevented', severity: 'critical', status: null, notes: '' },
    { id: 'sq3', category: 'Database', check: 'Database user has minimal privileges', severity: 'high', status: null, notes: '' },
    // XSS
    { id: 'xs1', category: 'XSS Prevention', check: 'Output encoding applied', severity: 'critical', status: null, notes: '' },
    { id: 'xs2', category: 'XSS Prevention', check: 'Content Security Policy implemented', severity: 'high', status: null, notes: '' },
    { id: 'xs3', category: 'XSS Prevention', check: 'DOM-based XSS prevented', severity: 'high', status: null, notes: '' },
    // Error Handling
    { id: 'eh1', category: 'Error Handling', check: 'Generic error messages shown to users', severity: 'medium', status: null, notes: '' },
    { id: 'eh2', category: 'Error Handling', check: 'Stack traces not exposed in production', severity: 'high', status: null, notes: '' },
    { id: 'eh3', category: 'Error Handling', check: 'Exceptions properly caught and logged', severity: 'medium', status: null, notes: '' },
    // Dependencies
    { id: 'de1', category: 'Dependencies', check: 'No known vulnerable dependencies', severity: 'high', status: null, notes: '' },
    { id: 'de2', category: 'Dependencies', check: 'Dependencies from trusted sources', severity: 'medium', status: null, notes: '' },
    { id: 'de3', category: 'Dependencies', check: 'Lock file used for reproducible builds', severity: 'low', status: null, notes: '' },
  ])

  const updateStatus = (id: string, status: ReviewItem['status']) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, status } : item
    ))
  }

  const updateNotes = (id: string, notes: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, notes } : item
    ))
  }

  const categories = [...new Set(items.map(i => i.category))]

  const getStats = () => {
    const reviewed = items.filter(i => i.status !== null)
    const passed = items.filter(i => i.status === 'pass')
    const failed = items.filter(i => i.status === 'fail')
    const critical = items.filter(i => i.severity === 'critical' && i.status === 'fail')
    return { reviewed: reviewed.length, passed: passed.length, failed: failed.length, critical: critical.length, total: items.length }
  }

  const stats = getStats()
  const passRate = stats.reviewed > 0 ? Math.round((stats.passed / (stats.passed + stats.failed)) * 100) : 0

  const getSeverityColor = (severity: ReviewItem['severity']): string => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
    }
  }

  const getStatusColor = (status: ReviewItem['status']): string => {
    switch (status) {
      case 'pass': return 'bg-green-500 text-white'
      case 'fail': return 'bg-red-500 text-white'
      case 'na': return 'bg-slate-400 text-white'
      default: return 'bg-white border border-slate-300'
    }
  }

  const generateReport = (): string => {
    let report = `SECURE CODE REVIEW REPORT\n${'='.repeat(50)}\n\n`
    report += `Project: ${projectName || '[Project Name]'}\n`
    report += `Reviewer: ${reviewerName || '[Reviewer Name]'}\n`
    report += `Date: ${new Date().toLocaleDateString()}\n\n`
    report += `SUMMARY\n${'─'.repeat(40)}\n`
    report += `Items Reviewed: ${stats.reviewed}/${stats.total}\n`
    report += `Pass Rate: ${passRate}%\n`
    report += `Passed: ${stats.passed}\n`
    report += `Failed: ${stats.failed}\n`
    report += `Critical Issues: ${stats.critical}\n\n`

    report += `FINDINGS\n${'─'.repeat(40)}\n`
    categories.forEach(cat => {
      const catItems = items.filter(i => i.category === cat)
      report += `\n${cat.toUpperCase()}\n`
      catItems.forEach(item => {
        const statusText = item.status?.toUpperCase() || 'NOT REVIEWED'
        report += `[${statusText}] [${item.severity.toUpperCase()}] ${item.check}\n`
        if (item.notes) report += `  Notes: ${item.notes}\n`
      })
    })

    return report
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.secureCodeReview.info')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project name..."
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            placeholder="Reviewer name..."
            className="px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      <div className={`card p-4 ${
        stats.critical > 0 ? 'bg-red-50' :
        passRate >= 80 ? 'bg-green-50' : 'bg-yellow-50'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.secureCodeReview.progress')}</h3>
          <span className={`text-2xl font-bold ${
            stats.critical > 0 ? 'text-red-600' :
            passRate >= 80 ? 'text-green-600' : 'text-yellow-600'
          }`}>
            {passRate}% Pass
          </span>
        </div>
        <div className="h-3 bg-white/50 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-blue-500"
            style={{ width: `${(stats.reviewed / stats.total) * 100}%` }}
          />
        </div>
        <div className="grid grid-cols-4 gap-2 text-center text-sm">
          <div>
            <div className="font-bold">{stats.reviewed}</div>
            <div className="text-xs text-slate-500">Reviewed</div>
          </div>
          <div>
            <div className="font-bold text-green-600">{stats.passed}</div>
            <div className="text-xs text-slate-500">Passed</div>
          </div>
          <div>
            <div className="font-bold text-red-600">{stats.failed}</div>
            <div className="text-xs text-slate-500">Failed</div>
          </div>
          <div>
            <div className="font-bold text-red-700">{stats.critical}</div>
            <div className="text-xs text-slate-500">Critical</div>
          </div>
        </div>
      </div>

      {categories.map(category => (
        <div key={category} className="card p-4">
          <h3 className="font-medium mb-3">{category}</h3>
          <div className="space-y-2">
            {items.filter(i => i.category === category).map(item => (
              <div
                key={item.id}
                className={`p-3 rounded border ${
                  item.status === 'fail' ? 'bg-red-50 border-red-200' :
                  item.status === 'pass' ? 'bg-green-50 border-green-200' :
                  'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${getSeverityColor(item.severity)}`}>
                    {item.severity}
                  </span>
                  <span className="flex-1 text-sm">{item.check}</span>
                </div>
                <div className="flex items-center gap-2">
                  {(['pass', 'fail', 'na'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => updateStatus(item.id, status)}
                      className={`px-3 py-1 rounded text-xs ${getStatusColor(item.status === status ? status : null)}`}
                    >
                      {status === 'na' ? 'N/A' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                  <input
                    type="text"
                    value={item.notes}
                    onChange={(e) => updateNotes(item.id, e.target.value)}
                    placeholder="Notes..."
                    className="flex-1 px-2 py-1 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={copyReport}
        className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
      >
        {t('tools.secureCodeReview.export')}
      </button>
    </div>
  )
}
