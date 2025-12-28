import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Milestone {
  id: number
  name: string
  startDate: string
  endDate: string
  status: 'pending' | 'in-progress' | 'completed' | 'delayed'
  description: string
}

export default function ProjectTimeline() {
  const { t } = useTranslation()
  const [projectName, setProjectName] = useState('')
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: 1, name: 'Planning', startDate: '', endDate: '', status: 'pending', description: '' }
  ])

  const addMilestone = () => {
    setMilestones([...milestones, {
      id: Date.now(),
      name: '',
      startDate: '',
      endDate: '',
      status: 'pending',
      description: ''
    }])
  }

  const updateMilestone = (id: number, field: keyof Milestone, value: string) => {
    setMilestones(milestones.map(m =>
      m.id === id ? { ...m, [field]: value } : m
    ))
  }

  const removeMilestone = (id: number) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter(m => m.id !== id))
    }
  }

  const statusColors: Record<string, { bg: string; text: string }> = {
    'pending': { bg: 'bg-slate-100', text: 'text-slate-700' },
    'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700' },
    'completed': { bg: 'bg-green-100', text: 'text-green-700' },
    'delayed': { bg: 'bg-red-100', text: 'text-red-700' },
  }

  const generateTimeline = (): string => {
    let text = `PROJECT TIMELINE\\n${'='.repeat(50)}\\n`
    text += `Project: ${projectName || '[Project Name]'}\\n\\n`

    const sortedMilestones = [...milestones]
      .filter(m => m.name)
      .sort((a, b) => (a.startDate || '9999').localeCompare(b.startDate || '9999'))

    sortedMilestones.forEach((m, i) => {
      const statusIcon = m.status === 'completed' ? '[✓]' :
                         m.status === 'in-progress' ? '[→]' :
                         m.status === 'delayed' ? '[!]' : '[ ]'
      text += `${statusIcon} ${m.name}\\n`
      if (m.startDate || m.endDate) {
        text += `    ${m.startDate || 'TBD'} → ${m.endDate || 'TBD'}\\n`
      }
      if (m.description) {
        text += `    ${m.description}\\n`
      }
      if (i < sortedMilestones.length - 1) text += '    │\\n'
    })

    return text
  }

  const copyTimeline = () => {
    navigator.clipboard.writeText(generateTimeline())
  }

  const calculateDuration = (start: string, end: string): string => {
    if (!start || !end) return ''
    const startDate = new Date(start)
    const endDate = new Date(end)
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    if (days < 0) return 'Invalid'
    if (days === 0) return '1 day'
    if (days < 7) return `${days} days`
    if (days < 30) return `${Math.ceil(days / 7)} weeks`
    return `${Math.ceil(days / 30)} months`
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-1">{t('tools.projectTimeline.project')}</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project name"
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.projectTimeline.milestones')}</h3>
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="relative">
              {index > 0 && (
                <div className="absolute left-4 -top-4 h-4 w-0.5 bg-slate-300" />
              )}
              <div className={`p-4 rounded border-l-4 ${
                milestone.status === 'completed' ? 'border-green-500 bg-green-50' :
                milestone.status === 'in-progress' ? 'border-blue-500 bg-blue-50' :
                milestone.status === 'delayed' ? 'border-red-500 bg-red-50' :
                'border-slate-300 bg-slate-50'
              }`}>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={milestone.name}
                    onChange={(e) => updateMilestone(milestone.id, 'name', e.target.value)}
                    placeholder="Milestone name"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded"
                  />
                  <select
                    value={milestone.status}
                    onChange={(e) => updateMilestone(milestone.id, 'status', e.target.value)}
                    className={`px-3 py-2 rounded ${statusColors[milestone.status].bg} ${statusColors[milestone.status].text}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="delayed">Delayed</option>
                  </select>
                  <button
                    onClick={() => removeMilestone(milestone.id)}
                    className="px-2 text-red-500"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex gap-2 mb-2">
                  <div className="flex-1">
                    <label className="text-xs text-slate-500">Start</label>
                    <input
                      type="date"
                      value={milestone.startDate}
                      onChange={(e) => updateMilestone(milestone.id, 'startDate', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-500">End</label>
                    <input
                      type="date"
                      value={milestone.endDate}
                      onChange={(e) => updateMilestone(milestone.id, 'endDate', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded"
                    />
                  </div>
                  {milestone.startDate && milestone.endDate && (
                    <div className="flex items-end">
                      <span className="px-3 py-2 bg-slate-200 rounded text-sm">
                        {calculateDuration(milestone.startDate, milestone.endDate)}
                      </span>
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  value={milestone.description}
                  onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                  placeholder="Description (optional)"
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addMilestone}
          className="w-full mt-4 py-2 border-2 border-dashed border-slate-300 rounded text-slate-500 hover:border-blue-500 hover:text-blue-500"
        >
          + {t('tools.projectTimeline.addMilestone')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.projectTimeline.preview')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono">
          {generateTimeline()}
        </pre>
        <button
          onClick={copyTimeline}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.projectTimeline.copy')}
        </button>
      </div>
    </div>
  )
}
