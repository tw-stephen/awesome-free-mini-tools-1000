import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Step {
  id: number
  action: string
  details: string
  responsible: string
  duration: string
}

export default function SOPBuilder() {
  const { t } = useTranslation()
  const [title, setTitle] = useState('')
  const [department, setDepartment] = useState('')
  const [purpose, setPurpose] = useState('')
  const [scope, setScope] = useState('')
  const [steps, setSteps] = useState<Step[]>([
    { id: Date.now(), action: '', details: '', responsible: '', duration: '' }
  ])
  const [revisionDate, setRevisionDate] = useState(new Date().toISOString().split('T')[0])
  const [approvedBy, setApprovedBy] = useState('')

  const addStep = () => {
    setSteps([...steps, {
      id: Date.now(),
      action: '',
      details: '',
      responsible: '',
      duration: ''
    }])
  }

  const updateStep = (id: number, field: keyof Step, value: string) => {
    setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const removeStep = (id: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter(s => s.id !== id))
    }
  }

  const moveStep = (id: number, direction: 'up' | 'down') => {
    const index = steps.findIndex(s => s.id === id)
    if (direction === 'up' && index > 0) {
      const newSteps = [...steps]
      ;[newSteps[index], newSteps[index - 1]] = [newSteps[index - 1], newSteps[index]]
      setSteps(newSteps)
    } else if (direction === 'down' && index < steps.length - 1) {
      const newSteps = [...steps]
      ;[newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]]
      setSteps(newSteps)
    }
  }

  const generateSOP = (): string => {
    let text = `STANDARD OPERATING PROCEDURE\\n${'='.repeat(50)}\\n\\n`
    text += `Title: ${title || '[SOP Title]'}\\n`
    text += `Department: ${department || '[Department]'}\\n`
    text += `Revision Date: ${revisionDate}\\n`
    text += `Approved By: ${approvedBy || '[Approver]'}\\n\\n`

    if (purpose) {
      text += `PURPOSE\\n${'─'.repeat(30)}\\n${purpose}\\n\\n`
    }

    if (scope) {
      text += `SCOPE\\n${'─'.repeat(30)}\\n${scope}\\n\\n`
    }

    text += `PROCEDURE\\n${'─'.repeat(30)}\\n`
    steps.forEach((step, i) => {
      if (step.action) {
        text += `\\nStep ${i + 1}: ${step.action}\\n`
        if (step.details) text += `   Details: ${step.details}\\n`
        if (step.responsible) text += `   Responsible: ${step.responsible}\\n`
        if (step.duration) text += `   Duration: ${step.duration}\\n`
      }
    })

    return text
  }

  const copySOP = () => {
    navigator.clipboard.writeText(generateSOP())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.sopBuilder.header')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">SOP Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Employee Onboarding Process"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g., Human Resources"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Revision Date</label>
            <input
              type="date"
              value={revisionDate}
              onChange={(e) => setRevisionDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">Approved By</label>
            <input
              type="text"
              value={approvedBy}
              onChange={(e) => setApprovedBy(e.target.value)}
              placeholder="Name and title"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="card p-4 space-y-4">
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.sopBuilder.purpose')}</label>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Describe the purpose of this SOP..."
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
        <div>
          <label className="text-sm text-slate-500 block mb-1">{t('tools.sopBuilder.scope')}</label>
          <textarea
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            placeholder="Define what this SOP covers..."
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">{t('tools.sopBuilder.steps')}</h3>
          <button
            onClick={addStep}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            + Add Step
          </button>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="p-4 bg-slate-50 rounded border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full font-bold">
                    {index + 1}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveStep(step.id, 'up')}
                      disabled={index === 0}
                      className="px-2 py-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveStep(step.id, 'down')}
                      disabled={index === steps.length - 1}
                      className="px-2 py-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    >
                      ▼
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeStep(step.id)}
                  className="px-2 text-red-500"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={step.action}
                  onChange={(e) => updateStep(step.id, 'action', e.target.value)}
                  placeholder="Action (what to do)"
                  className="w-full px-3 py-2 border border-slate-300 rounded font-medium"
                />
                <textarea
                  value={step.details}
                  onChange={(e) => updateStep(step.id, 'details', e.target.value)}
                  placeholder="Details (how to do it)"
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded resize-none text-sm"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={step.responsible}
                    onChange={(e) => updateStep(step.id, 'responsible', e.target.value)}
                    placeholder="Responsible person/role"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    value={step.duration}
                    onChange={(e) => updateStep(step.id, 'duration', e.target.value)}
                    placeholder="Duration (e.g., 15 min)"
                    className="w-40 px-3 py-2 border border-slate-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.sopBuilder.flowchart')}</h3>
        <div className="flex flex-wrap items-center gap-2 p-4 bg-slate-50 rounded overflow-x-auto">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <div className="px-4 py-2 bg-blue-100 border border-blue-300 rounded text-sm text-center min-w-[100px]">
                {step.action || `Step ${i + 1}`}
              </div>
              {i < steps.length - 1 && (
                <span className="mx-2 text-slate-400">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.sopBuilder.preview')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
          {generateSOP()}
        </pre>
        <button
          onClick={copySOP}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.sopBuilder.copy')}
        </button>
      </div>
    </div>
  )
}
