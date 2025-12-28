import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface KeyResult {
  id: number
  description: string
  target: number
  current: number
  unit: string
}

interface Objective {
  id: number
  title: string
  keyResults: KeyResult[]
}

export default function OKRTracker() {
  const { t } = useTranslation()
  const [quarter, setQuarter] = useState(`Q${Math.ceil((new Date().getMonth() + 1) / 3)} ${new Date().getFullYear()}`)
  const [objectives, setObjectives] = useState<Objective[]>([])

  const addObjective = () => {
    setObjectives([...objectives, {
      id: Date.now(),
      title: '',
      keyResults: [{ id: Date.now() + 1, description: '', target: 100, current: 0, unit: '%' }],
    }])
  }

  const updateObjective = (id: number, title: string) => {
    setObjectives(objectives.map(o => o.id === id ? { ...o, title } : o))
  }

  const removeObjective = (id: number) => {
    setObjectives(objectives.filter(o => o.id !== id))
  }

  const addKeyResult = (objectiveId: number) => {
    setObjectives(objectives.map(o => {
      if (o.id === objectiveId) {
        return {
          ...o,
          keyResults: [...o.keyResults, { id: Date.now(), description: '', target: 100, current: 0, unit: '%' }],
        }
      }
      return o
    }))
  }

  const updateKeyResult = (objectiveId: number, krId: number, field: keyof KeyResult, value: string | number) => {
    setObjectives(objectives.map(o => {
      if (o.id === objectiveId) {
        return {
          ...o,
          keyResults: o.keyResults.map(kr => kr.id === krId ? { ...kr, [field]: value } : kr),
        }
      }
      return o
    }))
  }

  const removeKeyResult = (objectiveId: number, krId: number) => {
    setObjectives(objectives.map(o => {
      if (o.id === objectiveId && o.keyResults.length > 1) {
        return {
          ...o,
          keyResults: o.keyResults.filter(kr => kr.id !== krId),
        }
      }
      return o
    }))
  }

  const getObjectiveProgress = (objective: Objective): number => {
    if (objective.keyResults.length === 0) return 0
    const totalProgress = objective.keyResults.reduce((sum, kr) => {
      const progress = kr.target > 0 ? (kr.current / kr.target) * 100 : 0
      return sum + Math.min(progress, 100)
    }, 0)
    return Math.round(totalProgress / objective.keyResults.length)
  }

  const overallProgress = objectives.length > 0
    ? Math.round(objectives.reduce((sum, o) => sum + getObjectiveProgress(o), 0) / objectives.length)
    : 0

  const getProgressColor = (progress: number): string => {
    if (progress >= 70) return 'bg-green-500'
    if (progress >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const generateReport = (): string => {
    let doc = `OKR REPORT - ${quarter}\n${'═'.repeat(50)}\n\n`
    doc += `Overall Progress: ${overallProgress}%\n\n`

    objectives.forEach((objective, index) => {
      const progress = getObjectiveProgress(objective)
      doc += `OBJECTIVE ${index + 1}: ${objective.title || '[Objective]'}\n`
      doc += `Progress: ${progress}%\n`
      doc += `${'─'.repeat(40)}\n`

      objective.keyResults.forEach((kr, krIndex) => {
        const krProgress = kr.target > 0 ? Math.round((kr.current / kr.target) * 100) : 0
        doc += `  KR${krIndex + 1}: ${kr.description || '[Key Result]'}\n`
        doc += `        ${kr.current}/${kr.target} ${kr.unit} (${krProgress}%)\n`
      })
      doc += '\n'
    })

    return doc
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.okrTracker.overview')}</h3>
          <input
            type="text"
            value={quarter}
            onChange={(e) => setQuarter(e.target.value)}
            placeholder="Q1 2024"
            className="px-3 py-1 border border-slate-300 rounded text-sm w-32"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Overall Progress</span>
              <span className="font-bold">{overallProgress}%</span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div className={`h-full ${getProgressColor(overallProgress)} transition-all`} style={{ width: `${overallProgress}%` }} />
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{objectives.length}</div>
            <div className="text-xs text-slate-500">Objectives</div>
          </div>
        </div>
      </div>

      <button
        onClick={addObjective}
        className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
      >
        + {t('tools.okrTracker.addObjective')}
      </button>

      {objectives.map((objective, objIndex) => {
        const progress = getObjectiveProgress(objective)
        return (
          <div key={objective.id} className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm font-medium">O{objIndex + 1}</span>
              <input
                type="text"
                value={objective.title}
                onChange={(e) => updateObjective(objective.id, e.target.value)}
                placeholder="Objective title"
                className="flex-1 px-3 py-2 border border-slate-300 rounded font-medium"
              />
              <span className={`px-2 py-1 rounded text-sm font-medium ${progress >= 70 ? 'bg-green-100 text-green-600' : progress >= 40 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                {progress}%
              </span>
              <button
                onClick={() => removeObjective(objective.id)}
                className="text-red-500 hover:text-red-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-2 ml-4">
              {objective.keyResults.map((kr, krIndex) => {
                const krProgress = kr.target > 0 ? Math.min(Math.round((kr.current / kr.target) * 100), 100) : 0
                return (
                  <div key={kr.id} className="p-3 bg-slate-50 rounded border border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-slate-500">KR{krIndex + 1}</span>
                      <input
                        type="text"
                        value={kr.description}
                        onChange={(e) => updateKeyResult(objective.id, kr.id, 'description', e.target.value)}
                        placeholder="Key result description"
                        className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                      />
                      <button
                        onClick={() => removeKeyResult(objective.id, kr.id)}
                        disabled={objective.keyResults.length === 1}
                        className="text-red-400 hover:text-red-600 disabled:opacity-30"
                      >
                        ×
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={kr.current}
                        onChange={(e) => updateKeyResult(objective.id, kr.id, 'current', Number(e.target.value))}
                        className="w-20 px-2 py-1 border border-slate-300 rounded text-sm text-center"
                        min="0"
                      />
                      <span className="text-slate-400">/</span>
                      <input
                        type="number"
                        value={kr.target}
                        onChange={(e) => updateKeyResult(objective.id, kr.id, 'target', Number(e.target.value))}
                        className="w-20 px-2 py-1 border border-slate-300 rounded text-sm text-center"
                        min="1"
                      />
                      <input
                        type="text"
                        value={kr.unit}
                        onChange={(e) => updateKeyResult(objective.id, kr.id, 'unit', e.target.value)}
                        className="w-16 px-2 py-1 border border-slate-300 rounded text-sm"
                        placeholder="unit"
                      />
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full ${getProgressColor(krProgress)}`} style={{ width: `${krProgress}%` }} />
                      </div>
                      <span className="text-xs text-slate-500 w-10">{krProgress}%</span>
                    </div>
                  </div>
                )
              })}
              <button
                onClick={() => addKeyResult(objective.id)}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                + Add Key Result
              </button>
            </div>
          </div>
        )
      })}

      {objectives.length === 0 && (
        <div className="card p-8 text-center text-slate-500">
          Add objectives to start tracking your OKRs
        </div>
      )}

      {objectives.length > 0 && (
        <button
          onClick={copyReport}
          className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
        >
          {t('tools.okrTracker.export')}
        </button>
      )}
    </div>
  )
}
