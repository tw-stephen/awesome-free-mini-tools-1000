import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface CheckItem {
  id: string
  category: string
  item: string
  description: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  checked: boolean
}

export default function SecurityChecklist() {
  const { t } = useTranslation()
  const [checklistType, setChecklistType] = useState<'webapp' | 'infrastructure' | 'workplace'>('webapp')
  const [items, setItems] = useState<CheckItem[]>([])

  const webappChecklist: CheckItem[] = [
    { id: 'w1', category: 'Authentication', item: 'Strong password policy enforced', description: 'Min 12 chars, mix of types', priority: 'critical', checked: false },
    { id: 'w2', category: 'Authentication', item: 'Multi-factor authentication available', description: 'TOTP or hardware keys supported', priority: 'critical', checked: false },
    { id: 'w3', category: 'Authentication', item: 'Account lockout after failed attempts', description: 'Lock after 5-10 failures', priority: 'high', checked: false },
    { id: 'w4', category: 'Authentication', item: 'Secure session management', description: 'Secure cookies, proper timeouts', priority: 'high', checked: false },
    { id: 'w5', category: 'Data Protection', item: 'HTTPS everywhere', description: 'TLS 1.2+ with valid certificates', priority: 'critical', checked: false },
    { id: 'w6', category: 'Data Protection', item: 'Sensitive data encrypted at rest', description: 'AES-256 or equivalent', priority: 'critical', checked: false },
    { id: 'w7', category: 'Data Protection', item: 'Input validation implemented', description: 'Server-side validation for all inputs', priority: 'high', checked: false },
    { id: 'w8', category: 'Data Protection', item: 'SQL injection prevention', description: 'Parameterized queries used', priority: 'critical', checked: false },
    { id: 'w9', category: 'Headers', item: 'Security headers configured', description: 'CSP, HSTS, X-Frame-Options', priority: 'high', checked: false },
    { id: 'w10', category: 'Headers', item: 'CORS properly configured', description: 'Whitelist trusted origins', priority: 'medium', checked: false },
    { id: 'w11', category: 'Logging', item: 'Security event logging', description: 'Log auth failures, access attempts', priority: 'high', checked: false },
    { id: 'w12', category: 'Logging', item: 'No sensitive data in logs', description: 'Mask passwords, tokens, PII', priority: 'high', checked: false },
  ]

  const infrastructureChecklist: CheckItem[] = [
    { id: 'i1', category: 'Network', item: 'Firewall configured', description: 'Deny by default, allow specific', priority: 'critical', checked: false },
    { id: 'i2', category: 'Network', item: 'VPN for remote access', description: 'Encrypted tunnel for admin access', priority: 'critical', checked: false },
    { id: 'i3', category: 'Network', item: 'Network segmentation', description: 'Separate prod, dev, admin networks', priority: 'high', checked: false },
    { id: 'i4', category: 'Servers', item: 'OS patching automated', description: 'Security updates within 24-48 hours', priority: 'critical', checked: false },
    { id: 'i5', category: 'Servers', item: 'Unnecessary services disabled', description: 'Minimize attack surface', priority: 'high', checked: false },
    { id: 'i6', category: 'Servers', item: 'SSH key authentication', description: 'Disable password auth for SSH', priority: 'high', checked: false },
    { id: 'i7', category: 'Backup', item: 'Regular backups configured', description: 'Daily backups, tested restore', priority: 'critical', checked: false },
    { id: 'i8', category: 'Backup', item: 'Offsite backup storage', description: '3-2-1 backup rule', priority: 'high', checked: false },
    { id: 'i9', category: 'Monitoring', item: 'Intrusion detection system', description: 'IDS/IPS in place', priority: 'high', checked: false },
    { id: 'i10', category: 'Monitoring', item: 'Centralized logging', description: 'SIEM or log aggregation', priority: 'medium', checked: false },
  ]

  const workplaceChecklist: CheckItem[] = [
    { id: 'p1', category: 'Devices', item: 'Device encryption enabled', description: 'Full disk encryption on laptops', priority: 'critical', checked: false },
    { id: 'p2', category: 'Devices', item: 'Screen lock configured', description: 'Auto-lock after 5 minutes', priority: 'high', checked: false },
    { id: 'p3', category: 'Devices', item: 'Antivirus/EDR installed', description: 'Real-time protection enabled', priority: 'high', checked: false },
    { id: 'p4', category: 'Accounts', item: 'Password manager in use', description: 'Unique passwords per service', priority: 'high', checked: false },
    { id: 'p5', category: 'Accounts', item: '2FA on critical accounts', description: 'Email, banking, cloud services', priority: 'critical', checked: false },
    { id: 'p6', category: 'Physical', item: 'Clean desk policy', description: 'Lock sensitive docs away', priority: 'medium', checked: false },
    { id: 'p7', category: 'Physical', item: 'Visitor access controlled', description: 'Sign-in required, escort policy', priority: 'medium', checked: false },
    { id: 'p8', category: 'Training', item: 'Security awareness training', description: 'Annual phishing, social engineering training', priority: 'high', checked: false },
    { id: 'p9', category: 'Training', item: 'Incident reporting process known', description: 'Staff know who to contact', priority: 'high', checked: false },
    { id: 'p10', category: 'Remote Work', item: 'VPN for remote work', description: 'Secure connection to company resources', priority: 'high', checked: false },
  ]

  const loadChecklist = (type: typeof checklistType) => {
    setChecklistType(type)
    switch (type) {
      case 'webapp': setItems(webappChecklist); break
      case 'infrastructure': setItems(infrastructureChecklist); break
      case 'workplace': setItems(workplaceChecklist); break
    }
  }

  const toggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  const getProgress = (): number => {
    if (items.length === 0) return 0
    return Math.round((items.filter(i => i.checked).length / items.length) * 100)
  }

  const getPriorityColor = (priority: CheckItem['priority']): string => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
    }
  }

  const categories = [...new Set(items.map(i => i.category))]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.securityChecklist.type')}</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'webapp', label: 'Web Application' },
            { id: 'infrastructure', label: 'Infrastructure' },
            { id: 'workplace', label: 'Workplace' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => loadChecklist(type.id as typeof checklistType)}
              className={`py-2 rounded ${
                checklistType === type.id && items.length > 0
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {items.length > 0 && (
        <>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{t('tools.securityChecklist.progress')}</h3>
              <span className="font-bold">{getProgress()}%</span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  getProgress() >= 80 ? 'bg-green-500' :
                  getProgress() >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${getProgress()}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-slate-500">
              <span>{items.filter(i => i.checked).length} completed</span>
              <span>{items.filter(i => !i.checked).length} remaining</span>
            </div>
          </div>

          {categories.map(category => (
            <div key={category} className="card p-4">
              <h3 className="font-medium mb-3">{category}</h3>
              <div className="space-y-2">
                {items.filter(i => i.category === category).map(item => (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`p-3 rounded border cursor-pointer transition-colors ${
                      item.checked
                        ? 'bg-green-50 border-green-200'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        readOnly
                        className="mt-1 rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={item.checked ? 'line-through text-slate-400' : 'font-medium'}>
                            {item.item}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {items.length === 0 && (
        <div className="card p-8 text-center text-slate-500">
          Select a checklist type to get started
        </div>
      )}

      <div className="card p-4 bg-blue-50">
        <h4 className="font-medium mb-2">{t('tools.securityChecklist.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Start with critical items first</li>
          <li>• Review checklist quarterly</li>
          <li>• Document exceptions with justification</li>
          <li>• Customize for your specific environment</li>
        </ul>
      </div>
    </div>
  )
}
