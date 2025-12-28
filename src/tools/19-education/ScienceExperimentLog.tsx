import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Observation {
  id: number
  time: string
  description: string
  measurement: string
}

interface Experiment {
  id: number
  title: string
  date: string
  hypothesis: string
  materials: string[]
  procedure: string[]
  observations: Observation[]
  conclusion: string
  status: 'planning' | 'in_progress' | 'completed'
}

export default function ScienceExperimentLog() {
  const { t } = useTranslation()
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [selectedExperiment, setSelectedExperiment] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [newExperiment, setNewExperiment] = useState({
    title: '',
    hypothesis: '',
  })
  const [newMaterial, setNewMaterial] = useState('')
  const [newStep, setNewStep] = useState('')
  const [newObservation, setNewObservation] = useState({ time: '', description: '', measurement: '' })

  const createExperiment = () => {
    if (!newExperiment.title.trim()) return
    const experiment: Experiment = {
      id: Date.now(),
      title: newExperiment.title,
      date: new Date().toISOString().split('T')[0],
      hypothesis: newExperiment.hypothesis,
      materials: [],
      procedure: [],
      observations: [],
      conclusion: '',
      status: 'planning',
    }
    setExperiments([...experiments, experiment])
    setSelectedExperiment(experiment.id)
    setNewExperiment({ title: '', hypothesis: '' })
    setShowForm(false)
  }

  const updateExperiment = (id: number, updates: Partial<Experiment>) => {
    setExperiments(experiments.map(e => e.id === id ? { ...e, ...updates } : e))
  }

  const deleteExperiment = (id: number) => {
    setExperiments(experiments.filter(e => e.id !== id))
    if (selectedExperiment === id) setSelectedExperiment(null)
  }

  const currentExperiment = experiments.find(e => e.id === selectedExperiment)

  const addMaterial = () => {
    if (!currentExperiment || !newMaterial.trim()) return
    updateExperiment(currentExperiment.id, {
      materials: [...currentExperiment.materials, newMaterial],
    })
    setNewMaterial('')
  }

  const removeMaterial = (index: number) => {
    if (!currentExperiment) return
    updateExperiment(currentExperiment.id, {
      materials: currentExperiment.materials.filter((_, i) => i !== index),
    })
  }

  const addStep = () => {
    if (!currentExperiment || !newStep.trim()) return
    updateExperiment(currentExperiment.id, {
      procedure: [...currentExperiment.procedure, newStep],
    })
    setNewStep('')
  }

  const removeStep = (index: number) => {
    if (!currentExperiment) return
    updateExperiment(currentExperiment.id, {
      procedure: currentExperiment.procedure.filter((_, i) => i !== index),
    })
  }

  const addObservation = () => {
    if (!currentExperiment || !newObservation.description.trim()) return
    updateExperiment(currentExperiment.id, {
      observations: [...currentExperiment.observations, { ...newObservation, id: Date.now() }],
    })
    setNewObservation({ time: '', description: '', measurement: '' })
  }

  const removeObservation = (id: number) => {
    if (!currentExperiment) return
    updateExperiment(currentExperiment.id, {
      observations: currentExperiment.observations.filter(o => o.id !== id),
    })
  }

  const exportExperiment = () => {
    if (!currentExperiment) return
    let text = `SCIENCE EXPERIMENT LOG\n${'='.repeat(50)}\n\n`
    text += `Title: ${currentExperiment.title}\n`
    text += `Date: ${currentExperiment.date}\n`
    text += `Status: ${currentExperiment.status}\n\n`

    text += `HYPOTHESIS\n${'-'.repeat(20)}\n${currentExperiment.hypothesis || 'N/A'}\n\n`

    text += `MATERIALS\n${'-'.repeat(20)}\n`
    currentExperiment.materials.forEach(m => text += `• ${m}\n`)
    text += '\n'

    text += `PROCEDURE\n${'-'.repeat(20)}\n`
    currentExperiment.procedure.forEach((p, i) => text += `${i + 1}. ${p}\n`)
    text += '\n'

    text += `OBSERVATIONS\n${'-'.repeat(20)}\n`
    currentExperiment.observations.forEach(o => {
      text += `[${o.time || 'N/A'}] ${o.description}`
      if (o.measurement) text += ` (${o.measurement})`
      text += '\n'
    })
    text += '\n'

    text += `CONCLUSION\n${'-'.repeat(20)}\n${currentExperiment.conclusion || 'N/A'}\n`

    navigator.clipboard.writeText(text)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-700'
      case 'in_progress': return 'bg-blue-100 text-blue-700'
      case 'completed': return 'bg-green-100 text-green-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  if (selectedExperiment && currentExperiment) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{currentExperiment.title}</h2>
            <div className="text-sm text-slate-500">{currentExperiment.date}</div>
          </div>
          <button onClick={() => setSelectedExperiment(null)} className="text-blue-500">
            Back
          </button>
        </div>

        <div className="flex gap-2">
          {(['planning', 'in_progress', 'completed'] as const).map(status => (
            <button
              key={status}
              onClick={() => updateExperiment(currentExperiment.id, { status })}
              className={`flex-1 py-2 rounded capitalize text-sm ${
                currentExperiment.status === status
                  ? getStatusColor(status)
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="card p-4">
          <h3 className="font-medium mb-2">{t('tools.scienceExperimentLog.hypothesis')}</h3>
          <textarea
            value={currentExperiment.hypothesis}
            onChange={(e) => updateExperiment(currentExperiment.id, { hypothesis: e.target.value })}
            placeholder="If... then... because..."
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none text-sm"
          />
        </div>

        <div className="card p-4">
          <h3 className="font-medium mb-2">{t('tools.scienceExperimentLog.materials')}</h3>
          <div className="space-y-1 mb-2">
            {currentExperiment.materials.map((m, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded text-sm">
                <span>• {m}</span>
                <button onClick={() => removeMaterial(i)} className="text-red-400 hover:text-red-600">×</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newMaterial}
              onChange={(e) => setNewMaterial(e.target.value)}
              placeholder="Add material"
              className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
              onKeyPress={(e) => e.key === 'Enter' && addMaterial()}
            />
            <button
              onClick={addMaterial}
              disabled={!newMaterial.trim()}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm disabled:bg-slate-300"
            >
              Add
            </button>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-medium mb-2">{t('tools.scienceExperimentLog.procedure')}</h3>
          <div className="space-y-1 mb-2">
            {currentExperiment.procedure.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded text-sm">
                <span>{i + 1}. {p}</span>
                <button onClick={() => removeStep(i)} className="text-red-400 hover:text-red-600">×</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              placeholder="Add step"
              className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
              onKeyPress={(e) => e.key === 'Enter' && addStep()}
            />
            <button
              onClick={addStep}
              disabled={!newStep.trim()}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm disabled:bg-slate-300"
            >
              Add
            </button>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-medium mb-2">{t('tools.scienceExperimentLog.observations')}</h3>
          <div className="space-y-2 mb-3">
            {currentExperiment.observations.map(o => (
              <div key={o.id} className="flex items-start justify-between p-2 bg-slate-50 rounded text-sm">
                <div>
                  {o.time && <span className="text-slate-500">[{o.time}] </span>}
                  {o.description}
                  {o.measurement && <span className="text-blue-600 ml-1">({o.measurement})</span>}
                </div>
                <button onClick={() => removeObservation(o.id)} className="text-red-400 hover:text-red-600">×</button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            <input
              type="text"
              value={newObservation.time}
              onChange={(e) => setNewObservation({ ...newObservation, time: e.target.value })}
              placeholder="Time"
              className="px-2 py-1 border border-slate-300 rounded text-sm"
            />
            <input
              type="text"
              value={newObservation.description}
              onChange={(e) => setNewObservation({ ...newObservation, description: e.target.value })}
              placeholder="Observation"
              className="col-span-2 px-2 py-1 border border-slate-300 rounded text-sm"
            />
            <button
              onClick={addObservation}
              disabled={!newObservation.description.trim()}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm disabled:bg-slate-300"
            >
              Add
            </button>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-medium mb-2">{t('tools.scienceExperimentLog.conclusion')}</h3>
          <textarea
            value={currentExperiment.conclusion}
            onChange={(e) => updateExperiment(currentExperiment.id, { conclusion: e.target.value })}
            placeholder="What did you learn? Was your hypothesis correct?"
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none text-sm"
          />
        </div>

        <button
          onClick={exportExperiment}
          className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
        >
          {t('tools.scienceExperimentLog.export')}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
        >
          + {t('tools.scienceExperimentLog.newExperiment')}
        </button>
      )}

      {showForm && (
        <div className="card p-4 border-2 border-blue-300">
          <h3 className="font-medium mb-3">{t('tools.scienceExperimentLog.newExperiment')}</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newExperiment.title}
              onChange={(e) => setNewExperiment({ ...newExperiment, title: e.target.value })}
              placeholder="Experiment title"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <textarea
              value={newExperiment.hypothesis}
              onChange={(e) => setNewExperiment({ ...newExperiment, hypothesis: e.target.value })}
              placeholder="Hypothesis (If... then... because...)"
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={createExperiment}
                disabled={!newExperiment.title.trim()}
                className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
              >
                Create
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
      )}

      <div className="space-y-2">
        {experiments.map(exp => (
          <div
            key={exp.id}
            className="card p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedExperiment(exp.id)}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">{exp.title}</div>
                <div className="text-sm text-slate-500">{exp.date}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs capitalize ${getStatusColor(exp.status)}`}>
                  {exp.status.replace('_', ' ')}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteExperiment(exp.id) }}
                  className="text-red-400 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {experiments.length === 0 && !showForm && (
        <div className="card p-8 text-center text-slate-500">
          Start your first experiment!
        </div>
      )}
    </div>
  )
}
