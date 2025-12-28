import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Resource {
  id: number
  name: string
  type: 'person' | 'equipment' | 'material' | 'budget'
  availability: number
  allocated: number
  unit: string
}

export default function ResourcePlanner() {
  const { t } = useTranslation()
  const [projectName, setProjectName] = useState('')
  const [resources, setResources] = useState<Resource[]>([
    { id: 1, name: 'Developer', type: 'person', availability: 40, allocated: 0, unit: 'hours/week' },
    { id: 2, name: 'Designer', type: 'person', availability: 40, allocated: 0, unit: 'hours/week' },
  ])

  const addResource = () => {
    setResources([...resources, {
      id: Date.now(),
      name: '',
      type: 'person',
      availability: 0,
      allocated: 0,
      unit: 'hours'
    }])
  }

  const updateResource = (id: number, field: keyof Resource, value: string | number) => {
    setResources(resources.map(r =>
      r.id === id ? { ...r, [field]: value } : r
    ))
  }

  const removeResource = (id: number) => {
    if (resources.length > 1) {
      setResources(resources.filter(r => r.id !== id))
    }
  }

  const typeIcons: Record<string, string> = {
    'person': '👤',
    'equipment': '🔧',
    'material': '📦',
    'budget': '💰',
  }

  const getUtilization = (r: Resource): number => {
    if (r.availability === 0) return 0
    return Math.round((r.allocated / r.availability) * 100)
  }

  const getUtilizationColor = (util: number): string => {
    if (util > 100) return 'text-red-600 bg-red-100'
    if (util > 80) return 'text-yellow-600 bg-yellow-100'
    if (util > 50) return 'text-green-600 bg-green-100'
    return 'text-slate-600 bg-slate-100'
  }

  const generatePlan = (): string => {
    let text = `RESOURCE PLAN\\n${'='.repeat(50)}\\n`
    text += `Project: ${projectName || '[Project Name]'}\\n\\n`

    const types = ['person', 'equipment', 'material', 'budget']
    types.forEach(type => {
      const typeResources = resources.filter(r => r.type === type && r.name)
      if (typeResources.length > 0) {
        text += `${type.toUpperCase()}S\\n${'─'.repeat(30)}\\n`
        typeResources.forEach(r => {
          const util = getUtilization(r)
          text += `${r.name}: ${r.allocated}/${r.availability} ${r.unit} (${util}%)\\n`
        })
        text += '\\n'
      }
    })

    const overallocated = resources.filter(r => getUtilization(r) > 100)
    if (overallocated.length > 0) {
      text += `⚠️ OVERALLOCATED\\n${'─'.repeat(30)}\\n`
      overallocated.forEach(r => {
        text += `${r.name}: ${getUtilization(r)}% utilized\\n`
      })
    }

    return text
  }

  const copyPlan = () => {
    navigator.clipboard.writeText(generatePlan())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-1">{t('tools.resourcePlanner.project')}</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project name"
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.resourcePlanner.resources')}</h3>
        <div className="space-y-3">
          {resources.map((resource) => {
            const util = getUtilization(resource)
            return (
              <div key={resource.id} className="p-3 bg-slate-50 rounded">
                <div className="flex gap-2 mb-2">
                  <select
                    value={resource.type}
                    onChange={(e) => updateResource(resource.id, 'type', e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded"
                  >
                    {Object.entries(typeIcons).map(([type, icon]) => (
                      <option key={type} value={type}>{icon} {type}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={resource.name}
                    onChange={(e) => updateResource(resource.id, 'name', e.target.value)}
                    placeholder="Resource name"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded"
                  />
                  <button
                    onClick={() => removeResource(resource.id)}
                    className="px-2 text-red-500"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <label className="text-xs text-slate-500">Available</label>
                    <input
                      type="number"
                      value={resource.availability}
                      onChange={(e) => updateResource(resource.id, 'availability', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-500">Allocated</label>
                    <input
                      type="number"
                      value={resource.allocated}
                      onChange={(e) => updateResource(resource.id, 'allocated', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-500">Unit</label>
                    <input
                      type="text"
                      value={resource.unit}
                      onChange={(e) => updateResource(resource.id, 'unit', e.target.value)}
                      placeholder="hours, $, etc."
                      className="w-full px-3 py-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="text-center pt-4">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${getUtilizationColor(util)}`}>
                      {util}%
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        util > 100 ? 'bg-red-500' : util > 80 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(util, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <button
          onClick={addResource}
          className="w-full mt-3 py-2 border-2 border-dashed border-slate-300 rounded text-slate-500 hover:border-blue-500 hover:text-blue-500"
        >
          + {t('tools.resourcePlanner.addResource')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.resourcePlanner.summary')}</h3>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {['person', 'equipment', 'material', 'budget'].map(type => {
            const typeResources = resources.filter(r => r.type === type)
            const avgUtil = typeResources.length > 0
              ? Math.round(typeResources.reduce((sum, r) => sum + getUtilization(r), 0) / typeResources.length)
              : 0
            return (
              <div key={type} className="text-center p-3 bg-slate-50 rounded">
                <span className="text-2xl">{typeIcons[type]}</span>
                <p className="text-sm text-slate-500 capitalize">{type}s</p>
                <p className="font-medium">{typeResources.length}</p>
                <p className={`text-xs ${getUtilizationColor(avgUtil)}`}>{avgUtil}% avg</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.resourcePlanner.export')}</h3>
        <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono">
          {generatePlan()}
        </pre>
        <button
          onClick={copyPlan}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('tools.resourcePlanner.copy')}
        </button>
      </div>
    </div>
  )
}
