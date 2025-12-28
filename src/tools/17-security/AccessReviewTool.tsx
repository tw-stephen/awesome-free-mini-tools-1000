import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface AccessRecord {
  id: number
  user: string
  department: string
  role: string
  resources: string[]
  lastActive: string
  status: 'active' | 'inactive' | 'pending-review'
  decision: 'approve' | 'revoke' | 'modify' | null
  notes: string
}

export default function AccessReviewTool() {
  const { t } = useTranslation()
  const [records, setRecords] = useState<AccessRecord[]>([
    { id: 1, user: 'john.doe@company.com', department: 'Engineering', role: 'Senior Developer', resources: ['GitHub', 'AWS Console', 'Database Admin'], lastActive: '2024-12-20', status: 'active', decision: null, notes: '' },
    { id: 2, user: 'jane.smith@company.com', department: 'Marketing', role: 'Marketing Manager', resources: ['CRM', 'Analytics Dashboard', 'Social Media'], lastActive: '2024-12-22', status: 'active', decision: null, notes: '' },
    { id: 3, user: 'bob.wilson@company.com', department: 'Finance', role: 'Accountant', resources: ['ERP System', 'Financial Reports', 'Payroll'], lastActive: '2024-11-15', status: 'inactive', decision: null, notes: '' },
    { id: 4, user: 'alice.johnson@company.com', department: 'HR', role: 'HR Specialist', resources: ['HRIS', 'Background Check System'], lastActive: '2024-12-21', status: 'active', decision: null, notes: '' },
    { id: 5, user: 'charlie.brown@company.com', department: 'Engineering', role: 'Contractor', resources: ['GitHub', 'Staging Server'], lastActive: '2024-12-01', status: 'pending-review', decision: null, notes: '' },
  ])
  const [filter, setFilter] = useState('all')
  const [reviewerName, setReviewerName] = useState('')

  const updateDecision = (id: number, decision: AccessRecord['decision']) => {
    setRecords(records.map(r =>
      r.id === id ? { ...r, decision } : r
    ))
  }

  const updateNotes = (id: number, notes: string) => {
    setRecords(records.map(r =>
      r.id === id ? { ...r, notes } : r
    ))
  }

  const filteredRecords = records.filter(r => {
    if (filter === 'all') return true
    if (filter === 'pending') return r.decision === null
    if (filter === 'reviewed') return r.decision !== null
    if (filter === 'inactive') return r.status === 'inactive'
    return r.status === filter
  })

  const getStatusColor = (status: AccessRecord['status']): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'inactive': return 'bg-red-100 text-red-700'
      case 'pending-review': return 'bg-yellow-100 text-yellow-700'
    }
  }

  const getDecisionColor = (decision: AccessRecord['decision']): string => {
    switch (decision) {
      case 'approve': return 'bg-green-500 text-white'
      case 'revoke': return 'bg-red-500 text-white'
      case 'modify': return 'bg-yellow-500 text-white'
      default: return 'bg-white border border-slate-300'
    }
  }

  const generateReport = (): string => {
    let report = `ACCESS REVIEW REPORT\n${'='.repeat(60)}\n\n`
    report += `Reviewer: ${reviewerName || '[Reviewer Name]'}\n`
    report += `Date: ${new Date().toLocaleDateString()}\n`
    report += `Total Records: ${records.length}\n`
    report += `Reviewed: ${records.filter(r => r.decision).length}\n`
    report += `Pending: ${records.filter(r => !r.decision).length}\n\n`

    report += `DECISIONS\n${'─'.repeat(40)}\n`
    report += `Approved: ${records.filter(r => r.decision === 'approve').length}\n`
    report += `Revoked: ${records.filter(r => r.decision === 'revoke').length}\n`
    report += `Modified: ${records.filter(r => r.decision === 'modify').length}\n\n`

    report += `DETAILS\n${'─'.repeat(40)}\n`
    records.forEach(r => {
      report += `User: ${r.user}\n`
      report += `  Department: ${r.department}\n`
      report += `  Role: ${r.role}\n`
      report += `  Resources: ${r.resources.join(', ')}\n`
      report += `  Last Active: ${r.lastActive}\n`
      report += `  Decision: ${r.decision?.toUpperCase() || 'PENDING'}\n`
      if (r.notes) report += `  Notes: ${r.notes}\n`
      report += '\n'
    })

    return report
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  const completeReview = () => {
    const pendingCount = records.filter(r => !r.decision).length
    if (pendingCount > 0) {
      alert(`Please review all ${pendingCount} pending records before completing.`)
      return
    }
    copyReport()
    alert('Review completed! Report copied to clipboard.')
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.accessReviewTool.reviewer')}</h3>
        <input
          type="text"
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          placeholder="Your name..."
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.accessReviewTool.progress')}</h3>
          <span className="text-sm text-slate-500">
            {records.filter(r => r.decision).length} / {records.length} reviewed
          </span>
        </div>
        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${(records.filter(r => r.decision).length / records.length) * 100}%` }}
          />
        </div>
        <div className="flex gap-2 mt-3">
          {['all', 'pending', 'reviewed', 'inactive'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-sm ${
                filter === f ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredRecords.map(record => (
          <div key={record.id} className={`card p-4 ${record.decision ? 'border-l-4 border-l-blue-500' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{record.user}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </div>
                <div className="text-sm text-slate-500">
                  {record.department} • {record.role}
                </div>
              </div>
              <div className="text-right text-sm text-slate-500">
                <div>Last active: {record.lastActive}</div>
              </div>
            </div>

            <div className="mb-3">
              <span className="text-sm text-slate-500">Resources:</span>
              <div className="flex gap-1 flex-wrap mt-1">
                {record.resources.map((res, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-100 rounded text-xs">
                    {res}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">Decision:</span>
              {(['approve', 'revoke', 'modify'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => updateDecision(record.id, d)}
                  className={`px-3 py-1 rounded text-sm ${getDecisionColor(record.decision === d ? d : null)}`}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={record.notes}
              onChange={(e) => updateNotes(record.id, e.target.value)}
              placeholder="Add notes..."
              className="w-full mt-3 px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={completeReview}
          className="flex-1 py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
        >
          {t('tools.accessReviewTool.complete')}
        </button>
        <button
          onClick={copyReport}
          className="px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Export
        </button>
      </div>

      <div className="card p-4 bg-blue-50">
        <h4 className="font-medium mb-2">{t('tools.accessReviewTool.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Review inactive users first - they may need immediate revocation</li>
          <li>• Verify role-based access is still appropriate</li>
          <li>• Document justification for approvals and modifications</li>
          <li>• Access reviews should be conducted quarterly</li>
        </ul>
      </div>
    </div>
  )
}
