import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface EscalationLevel {
  id: number
  level: number
  title: string
  contact: string
  email: string
  phone: string
  responseTime: string
  criteria: string
}

export default function EscalationPath() {
  const { t } = useTranslation()
  const [processName, setProcessName] = useState('')
  const [levels, setLevels] = useState<EscalationLevel[]>([
    { id: 1, level: 1, title: 'Team Lead', contact: '', email: '', phone: '', responseTime: '4 hours', criteria: 'Initial issue reported' },
    { id: 2, level: 2, title: 'Manager', contact: '', email: '', phone: '', responseTime: '2 hours', criteria: 'Issue unresolved after 4 hours' },
    { id: 3, level: 3, title: 'Director', contact: '', email: '', phone: '', responseTime: '1 hour', criteria: 'Critical impact or unresolved after 8 hours' },
  ])

  const addLevel = () => {
    const newLevel = levels.length + 1
    setLevels([...levels, {
      id: Date.now(),
      level: newLevel,
      title: '',
      contact: '',
      email: '',
      phone: '',
      responseTime: '',
      criteria: ''
    }])
  }

  const updateLevel = (id: number, field: keyof EscalationLevel, value: string | number) => {
    setLevels(levels.map(l =>
      l.id === id ? { ...l, [field]: value } : l
    ))
  }

  const removeLevel = (id: number) => {
    if (levels.length > 1) {
      const filtered = levels.filter(l => l.id !== id)
      setLevels(filtered.map((l, i) => ({ ...l, level: i + 1 })))
    }
  }

  const moveLevel = (id: number, direction: 'up' | 'down') => {
    const index = levels.findIndex(l => l.id === id)
    if (direction === 'up' && index > 0) {
      const newLevels = [...levels]
      ;[newLevels[index], newLevels[index - 1]] = [newLevels[index - 1], newLevels[index]]
      setLevels(newLevels.map((l, i) => ({ ...l, level: i + 1 })))
    } else if (direction === 'down' && index < levels.length - 1) {
      const newLevels = [...levels]
      ;[newLevels[index], newLevels[index + 1]] = [newLevels[index + 1], newLevels[index]]
      setLevels(newLevels.map((l, i) => ({ ...l, level: i + 1 })))
    }
  }

  const generatePath = (): string => {
    let text = `ESCALATION PATH\\n${'='.repeat(50)}\\n`
    text += `Process: ${processName || '[Process Name]'}\\n\\n`

    levels.forEach((l, i) => {
      text += `LEVEL ${l.level}: ${l.title || '[Title]'}\\n${'─'.repeat(30)}\\n`
      if (l.contact) text += `Contact: ${l.contact}\\n`
      if (l.email) text += `Email: ${l.email}\\n`
      if (l.phone) text += `Phone: ${l.phone}\\n`
      text += `Response Time: ${l.responseTime || 'TBD'}\\n`
      text += `Criteria: ${l.criteria || 'TBD'}\\n`
      if (i < levels.length - 1) {
        text += '    ↓\\n'
      }
      text += '\\n'
    })

    return text
  }

  const copyPath = () => {
    navigator.clipboard.writeText(generatePath())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-1">{t('tools.escalationPath.process')}</label>
        <input
          type="text"
          value={processName}
          onChange={(e) => setProcessName(e.target.value)}
          placeholder="Escalation process name (e.g., Customer Support, Incident Response)"
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.escalationPath.levels')}</h3>
        <div className="space-y-4">
          {levels.map((level, index) => (
            <div key={level.id} className="relative">
              {index > 0 && (
                <div className="flex justify-center -mt-2 mb-2">
                  <span className="text-slate-400 text-lg">↓</span>
                </div>
              )}
              <div className="p-4 bg-slate-50 rounded border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full font-bold">
                      {level.level}
                    </span>
                    <input
                      type="text"
                      value={level.title}
                      onChange={(e) => updateLevel(level.id, 'title', e.target.value)}
                      placeholder="Role/Title"
                      className="px-3 py-1 border border-slate-300 rounded font-medium"
                    />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveLevel(level.id, 'up')}
                      disabled={index === 0}
                      className="px-2 py-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveLevel(level.id, 'down')}
                      disabled={index === levels.length - 1}
                      className="px-2 py-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    >
                      ▼
                    </button>
                    <button
                      onClick={() => removeLevel(level.id)}
                      className="px-2 py-1 text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    value={level.contact}
                    onChange={(e) => updateLevel(level.id, 'contact', e.target.value)}
                    placeholder="Contact name"
                    className="px-3 py-2 border border-slate-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    value={level.responseTime}
                    onChange={(e) => updateLevel(level.id, 'responseTime', e.target.value)}
                    placeholder="Response time (e.g., 4 hours)"
                    className="px-3 py-2 border border-slate-300 rounded text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="email"
                    value={level.email}
                    onChange={(e) => updateLevel(level.id, 'email', e.target.value)}
                    placeholder="Email"
                    className="px-3 py-2 border border-slate-300 rounded text-sm"
                  />
                  <input
                    type="tel"
                    value={level.phone}
                    onChange={(e) => updateLevel(level.id, 'phone', e.target.value)}
                    placeholder="Phone"
                    className="px-3 py-2 border border-slate-300 rounded text-sm"
                  />
                </div>

                <input
                  type="text"
                  value={level.criteria}
                  onChange={(e) => updateLevel(level.id, 'criteria', e.target.value)}
                  placeholder="Escalation criteria (when to escalate to this level)"
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addLevel}
          className="w-full mt-4 py-2 border-2 border-dashed border-slate-300 rounded text-slate-500 hover:border-blue-500 hover:text-blue-500"
        >
          + {t('tools.escalationPath.addLevel')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.escalationPath.preview')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono">
          {generatePath()}
        </pre>
        <button
          onClick={copyPath}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.escalationPath.copy')}
        </button>
      </div>
    </div>
  )
}
