import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Contact {
  role: string
  name: string
  phone: string
  email: string
}

interface Step {
  id: number
  phase: string
  action: string
  responsible: string
  timeframe: string
}

export default function IncidentResponsePlan() {
  const { t } = useTranslation()
  const [incidentType, setIncidentType] = useState('Data Breach')
  const [severity, setSeverity] = useState<'critical' | 'high' | 'medium' | 'low'>('high')
  const [contacts, setContacts] = useState<Contact[]>([
    { role: 'Incident Commander', name: '', phone: '', email: '' },
    { role: 'Security Lead', name: '', phone: '', email: '' },
    { role: 'Communications Lead', name: '', phone: '', email: '' },
    { role: 'Legal Counsel', name: '', phone: '', email: '' },
  ])
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, phase: 'Detection', action: 'Identify and confirm the incident', responsible: 'Security Team', timeframe: '< 15 min' },
    { id: 2, phase: 'Detection', action: 'Document initial findings', responsible: 'Security Lead', timeframe: '< 30 min' },
    { id: 3, phase: 'Containment', action: 'Isolate affected systems', responsible: 'IT Team', timeframe: '< 1 hour' },
    { id: 4, phase: 'Containment', action: 'Preserve evidence', responsible: 'Security Team', timeframe: '< 2 hours' },
    { id: 5, phase: 'Eradication', action: 'Remove threat from systems', responsible: 'Security Team', timeframe: '< 24 hours' },
    { id: 6, phase: 'Recovery', action: 'Restore affected systems', responsible: 'IT Team', timeframe: '< 48 hours' },
    { id: 7, phase: 'Recovery', action: 'Verify system integrity', responsible: 'Security Lead', timeframe: '< 72 hours' },
    { id: 8, phase: 'Post-Incident', action: 'Conduct post-mortem analysis', responsible: 'Incident Commander', timeframe: '< 1 week' },
  ])

  const incidentTypes = [
    'Data Breach',
    'Ransomware Attack',
    'DDoS Attack',
    'Unauthorized Access',
    'Malware Infection',
    'Phishing Attack',
    'Insider Threat',
    'System Outage',
  ]

  const updateContact = (index: number, field: keyof Contact, value: string) => {
    const updated = [...contacts]
    updated[index] = { ...updated[index], [field]: value }
    setContacts(updated)
  }

  const addStep = () => {
    setSteps([...steps, {
      id: Date.now(),
      phase: 'Detection',
      action: '',
      responsible: '',
      timeframe: '',
    }])
  }

  const updateStep = (id: number, field: keyof Step, value: string) => {
    setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const removeStep = (id: number) => {
    setSteps(steps.filter(s => s.id !== id))
  }

  const phases = ['Detection', 'Containment', 'Eradication', 'Recovery', 'Post-Incident']

  const getPhaseColor = (phase: string): string => {
    switch (phase) {
      case 'Detection': return 'bg-red-100 text-red-700'
      case 'Containment': return 'bg-orange-100 text-orange-700'
      case 'Eradication': return 'bg-yellow-100 text-yellow-700'
      case 'Recovery': return 'bg-blue-100 text-blue-700'
      case 'Post-Incident': return 'bg-green-100 text-green-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const generatePlan = (): string => {
    let plan = `INCIDENT RESPONSE PLAN\n${'='.repeat(60)}\n\n`
    plan += `Incident Type: ${incidentType}\n`
    plan += `Severity: ${severity.toUpperCase()}\n`
    plan += `Generated: ${new Date().toLocaleString()}\n\n`

    plan += `EMERGENCY CONTACTS\n${'─'.repeat(40)}\n`
    contacts.forEach(c => {
      plan += `${c.role}: ${c.name || '[TBD]'}\n`
      plan += `  Phone: ${c.phone || '[TBD]'}\n`
      plan += `  Email: ${c.email || '[TBD]'}\n`
    })
    plan += '\n'

    phases.forEach(phase => {
      const phaseSteps = steps.filter(s => s.phase === phase)
      if (phaseSteps.length > 0) {
        plan += `${phase.toUpperCase()} PHASE\n${'─'.repeat(40)}\n`
        phaseSteps.forEach((step, i) => {
          plan += `${i + 1}. ${step.action}\n`
          plan += `   Responsible: ${step.responsible}\n`
          plan += `   Timeframe: ${step.timeframe}\n`
        })
        plan += '\n'
      }
    })

    return plan
  }

  const copyPlan = () => {
    navigator.clipboard.writeText(generatePlan())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.incidentResponsePlan.incident')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">Incident Type</label>
            <select
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              {incidentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as typeof severity)}
              className={`w-full px-3 py-2 border rounded ${
                severity === 'critical' ? 'border-red-500 bg-red-50' :
                severity === 'high' ? 'border-orange-500 bg-orange-50' :
                severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-green-500 bg-green-50'
              }`}
            >
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.incidentResponsePlan.contacts')}</h3>
        <div className="space-y-3">
          {contacts.map((contact, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded">
              <span className="text-sm font-medium text-slate-600 block mb-2">{contact.role}</span>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => updateContact(i, 'name', e.target.value)}
                  placeholder="Name"
                  className="px-2 py-1 border border-slate-300 rounded text-sm"
                />
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => updateContact(i, 'phone', e.target.value)}
                  placeholder="Phone"
                  className="px-2 py-1 border border-slate-300 rounded text-sm"
                />
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => updateContact(i, 'email', e.target.value)}
                  placeholder="Email"
                  className="px-2 py-1 border border-slate-300 rounded text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.incidentResponsePlan.steps')}</h3>
          <button onClick={addStep} className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
            + Add Step
          </button>
        </div>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {steps.map((step) => (
            <div key={step.id} className="p-2 bg-slate-50 rounded flex gap-2 items-center">
              <select
                value={step.phase}
                onChange={(e) => updateStep(step.id, 'phase', e.target.value)}
                className={`px-2 py-1 rounded text-xs ${getPhaseColor(step.phase)}`}
              >
                {phases.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input
                type="text"
                value={step.action}
                onChange={(e) => updateStep(step.id, 'action', e.target.value)}
                placeholder="Action..."
                className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
              />
              <input
                type="text"
                value={step.responsible}
                onChange={(e) => updateStep(step.id, 'responsible', e.target.value)}
                placeholder="Who"
                className="w-28 px-2 py-1 border border-slate-300 rounded text-sm"
              />
              <input
                type="text"
                value={step.timeframe}
                onChange={(e) => updateStep(step.id, 'timeframe', e.target.value)}
                placeholder="When"
                className="w-20 px-2 py-1 border border-slate-300 rounded text-sm"
              />
              <button onClick={() => removeStep(step.id)} className="text-red-500 hover:text-red-600">
                X
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={copyPlan}
        className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
      >
        {t('tools.incidentResponsePlan.copy')}
      </button>

      <div className="card p-4 bg-yellow-50">
        <h4 className="font-medium mb-2">{t('tools.incidentResponsePlan.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Test your incident response plan regularly</li>
          <li>• Keep contact information up to date</li>
          <li>• Document everything during an incident</li>
          <li>• Conduct post-incident reviews to improve</li>
        </ul>
      </div>
    </div>
  )
}
