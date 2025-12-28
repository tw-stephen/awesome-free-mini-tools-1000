import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface RetentionRule {
  id: number
  dataType: string
  category: string
  retentionPeriod: string
  legalBasis: string
  deletionMethod: string
  exceptions: string
}

export default function DataRetentionPolicy() {
  const { t } = useTranslation()
  const [companyName, setCompanyName] = useState('')
  const [rules, setRules] = useState<RetentionRule[]>([
    { id: 1, dataType: 'Customer Accounts', category: 'Personal Data', retentionPeriod: '3 years after account closure', legalBasis: 'Contract fulfillment', deletionMethod: 'Secure deletion', exceptions: 'Tax records retained for 7 years' },
    { id: 2, dataType: 'Transaction Records', category: 'Financial', retentionPeriod: '7 years', legalBasis: 'Legal requirement', deletionMethod: 'Secure deletion', exceptions: 'None' },
    { id: 3, dataType: 'Marketing Preferences', category: 'Consent', retentionPeriod: '2 years from last interaction', legalBasis: 'Consent', deletionMethod: 'Anonymization', exceptions: 'None' },
    { id: 4, dataType: 'Support Tickets', category: 'Operational', retentionPeriod: '2 years', legalBasis: 'Legitimate interest', deletionMethod: 'Anonymization', exceptions: 'Legal disputes retained indefinitely' },
    { id: 5, dataType: 'Access Logs', category: 'Security', retentionPeriod: '1 year', legalBasis: 'Legitimate interest', deletionMethod: 'Automatic purge', exceptions: 'Security incidents retained for 5 years' },
  ])

  const categories = ['Personal Data', 'Financial', 'Consent', 'Operational', 'Security', 'Marketing', 'HR', 'Legal']
  const legalBases = ['Consent', 'Contract fulfillment', 'Legal requirement', 'Legitimate interest', 'Vital interest', 'Public interest']
  const deletionMethods = ['Secure deletion', 'Anonymization', 'Automatic purge', 'Manual deletion', 'Physical destruction']

  const addRule = () => {
    setRules([...rules, {
      id: Date.now(),
      dataType: '',
      category: 'Personal Data',
      retentionPeriod: '',
      legalBasis: 'Legitimate interest',
      deletionMethod: 'Secure deletion',
      exceptions: '',
    }])
  }

  const updateRule = (id: number, field: keyof RetentionRule, value: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  const removeRule = (id: number) => {
    setRules(rules.filter(r => r.id !== id))
  }

  const generatePolicy = (): string => {
    const company = companyName || '[Company Name]'
    let policy = `DATA RETENTION POLICY
${'='.repeat(60)}

${company}
Effective Date: ${new Date().toLocaleDateString()}

1. PURPOSE
This policy defines the data retention periods for different types of data collected and processed by ${company}.

2. SCOPE
This policy applies to all data processed by the organization, whether in electronic or physical format.

3. RETENTION SCHEDULE
`

    const grouped = rules.reduce((acc, r) => {
      if (!acc[r.category]) acc[r.category] = []
      acc[r.category].push(r)
      return acc
    }, {} as Record<string, RetentionRule[]>)

    Object.entries(grouped).forEach(([category, categoryRules]) => {
      policy += `\n${category.toUpperCase()}\n${'─'.repeat(40)}\n`
      categoryRules.forEach(r => {
        if (r.dataType) {
          policy += `• ${r.dataType}\n`
          policy += `  Retention: ${r.retentionPeriod}\n`
          policy += `  Legal Basis: ${r.legalBasis}\n`
          policy += `  Deletion: ${r.deletionMethod}\n`
          if (r.exceptions) policy += `  Exceptions: ${r.exceptions}\n`
          policy += '\n'
        }
      })
    })

    policy += `
4. DELETION PROCEDURES
- Data marked for deletion must be processed within 30 days
- Backups must be updated to reflect deletions
- Deletion must be verified and logged

5. EXCEPTIONS
- Legal holds may extend retention periods
- Ongoing investigations or disputes
- Regulatory requirements may override this policy

6. REVIEW
This policy will be reviewed annually or when regulations change.

7. CONTACT
For questions about this policy, contact the Data Protection Officer.
`

    return policy
  }

  const copyPolicy = () => {
    navigator.clipboard.writeText(generatePolicy())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-1">{t('tools.dataRetentionPolicy.company')}</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Your company name..."
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.dataRetentionPolicy.rules')}</h3>
          <button onClick={addRule} className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
            + Add Rule
          </button>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {rules.map((rule) => (
            <div key={rule.id} className="p-3 bg-slate-50 rounded space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={rule.dataType}
                  onChange={(e) => updateRule(rule.id, 'dataType', e.target.value)}
                  placeholder="Data type (e.g., Customer Accounts)"
                  className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                />
                <button onClick={() => removeRule(rule.id)} className="px-2 text-red-500">X</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={rule.category}
                  onChange={(e) => updateRule(rule.id, 'category', e.target.value)}
                  className="px-2 py-1 border border-slate-300 rounded text-sm"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  type="text"
                  value={rule.retentionPeriod}
                  onChange={(e) => updateRule(rule.id, 'retentionPeriod', e.target.value)}
                  placeholder="Retention period"
                  className="px-2 py-1 border border-slate-300 rounded text-sm"
                />
                <select
                  value={rule.legalBasis}
                  onChange={(e) => updateRule(rule.id, 'legalBasis', e.target.value)}
                  className="px-2 py-1 border border-slate-300 rounded text-sm"
                >
                  {legalBases.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <select
                  value={rule.deletionMethod}
                  onChange={(e) => updateRule(rule.id, 'deletionMethod', e.target.value)}
                  className="px-2 py-1 border border-slate-300 rounded text-sm"
                >
                  {deletionMethods.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <input
                type="text"
                value={rule.exceptions}
                onChange={(e) => updateRule(rule.id, 'exceptions', e.target.value)}
                placeholder="Exceptions (optional)"
                className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.dataRetentionPolicy.preview')}</h3>
          <button onClick={copyPolicy} className="text-sm text-blue-500 hover:text-blue-600">
            Copy Policy
          </button>
        </div>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
          {generatePolicy()}
        </pre>
      </div>

      <div className="card p-4 bg-yellow-50">
        <h4 className="font-medium mb-2">{t('tools.dataRetentionPolicy.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Define retention based on legal requirements first</li>
          <li>• Consider business needs within legal limits</li>
          <li>• Document exceptions clearly</li>
          <li>• Review and update annually</li>
          <li>• This is a template - consult legal for compliance</li>
        </ul>
      </div>
    </div>
  )
}
