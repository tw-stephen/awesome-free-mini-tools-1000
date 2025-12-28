import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Criterion {
  id: string
  name: string
  weight: number
}

interface Option {
  id: string
  name: string
  scores: Record<string, number>
}

export default function DecisionMatrix() {
  const { t } = useTranslation()
  const [decision, setDecision] = useState('')
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: '1', name: '', weight: 5 }
  ])
  const [options, setOptions] = useState<Option[]>([
    { id: '1', name: '', scores: {} }
  ])

  useEffect(() => {
    const saved = localStorage.getItem('decision-matrix')
    if (saved) {
      const data = JSON.parse(saved)
      setDecision(data.decision || '')
      setCriteria(data.criteria || [{ id: '1', name: '', weight: 5 }])
      setOptions(data.options || [{ id: '1', name: '', scores: {} }])
    }
  }, [])

  const saveData = () => {
    localStorage.setItem('decision-matrix', JSON.stringify({ decision, criteria, options }))
  }

  useEffect(() => {
    saveData()
  }, [decision, criteria, options])

  const addCriterion = () => {
    setCriteria([...criteria, { id: Date.now().toString(), name: '', weight: 5 }])
  }

  const updateCriterion = (id: string, field: keyof Criterion, value: string | number) => {
    setCriteria(criteria.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  const removeCriterion = (id: string) => {
    if (criteria.length > 1) {
      setCriteria(criteria.filter(c => c.id !== id))
    }
  }

  const addOption = () => {
    setOptions([...options, { id: Date.now().toString(), name: '', scores: {} }])
  }

  const updateOption = (id: string, name: string) => {
    setOptions(options.map(o => o.id === id ? { ...o, name } : o))
  }

  const updateScore = (optionId: string, criterionId: string, score: number) => {
    setOptions(options.map(o =>
      o.id === optionId ? { ...o, scores: { ...o.scores, [criterionId]: score } } : o
    ))
  }

  const removeOption = (id: string) => {
    if (options.length > 1) {
      setOptions(options.filter(o => o.id !== id))
    }
  }

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0)

  const calculateScore = (option: Option) => {
    let score = 0
    criteria.forEach(c => {
      const rawScore = option.scores[c.id] || 0
      const normalizedWeight = c.weight / totalWeight
      score += rawScore * normalizedWeight
    })
    return score
  }

  const rankedOptions = useMemo(() => {
    return [...options]
      .map(o => ({ ...o, totalScore: calculateScore(o) }))
      .sort((a, b) => b.totalScore - a.totalScore)
  }, [options, criteria])

  const maxScore = Math.max(...rankedOptions.map(o => o.totalScore), 1)

  const clearAll = () => {
    setDecision('')
    setCriteria([{ id: '1', name: '', weight: 5 }])
    setOptions([{ id: '1', name: '', scores: {} }])
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="text-sm font-medium text-slate-700 mb-2 block">
          {t('tools.decisionMatrix.decision')}
        </label>
        <input
          type="text"
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          placeholder={t('tools.decisionMatrix.decisionPlaceholder')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-slate-700">{t('tools.decisionMatrix.criteria')}</h3>
          <button onClick={addCriterion} className="text-sm text-blue-500">
            + {t('tools.decisionMatrix.addCriterion')}
          </button>
        </div>
        <div className="space-y-2">
          {criteria.map((c, index) => (
            <div key={c.id} className="flex gap-2 items-center">
              <span className="text-xs text-slate-400 w-6">{index + 1}</span>
              <input
                type="text"
                value={c.name}
                onChange={(e) => updateCriterion(c.id, 'name', e.target.value)}
                placeholder={t('tools.decisionMatrix.criterionName')}
                className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <div className="flex items-center gap-1 w-24">
                <input
                  type="range"
                  value={c.weight}
                  onChange={(e) => updateCriterion(c.id, 'weight', parseInt(e.target.value))}
                  min="1"
                  max="10"
                  className="flex-1"
                />
                <span className="text-xs w-4">{c.weight}</span>
              </div>
              <button
                onClick={() => removeCriterion(c.id)}
                className="text-red-500"
                disabled={criteria.length === 1}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {t('tools.decisionMatrix.weightHint')}
        </p>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-slate-700">{t('tools.decisionMatrix.options')}</h3>
          <button onClick={addOption} className="text-sm text-blue-500">
            + {t('tools.decisionMatrix.addOption')}
          </button>
        </div>
        <div className="space-y-2">
          {options.map((o, index) => (
            <div key={o.id} className="flex gap-2 items-center">
              <span className="text-xs text-slate-400 w-6">{index + 1}</span>
              <input
                type="text"
                value={o.name}
                onChange={(e) => updateOption(o.id, e.target.value)}
                placeholder={t('tools.decisionMatrix.optionName')}
                className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <button
                onClick={() => removeOption(o.id)}
                className="text-red-500"
                disabled={options.length === 1}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {criteria.some(c => c.name) && options.some(o => o.name) && (
        <div className="card p-4 overflow-x-auto">
          <h3 className="font-medium text-slate-700 mb-3">{t('tools.decisionMatrix.scoring')}</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">{t('tools.decisionMatrix.option')}</th>
                {criteria.filter(c => c.name).map(c => (
                  <th key={c.id} className="text-center p-2 min-w-[80px]">
                    {c.name}
                    <div className="text-xs text-slate-400 font-normal">({c.weight})</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {options.filter(o => o.name).map(o => (
                <tr key={o.id} className="border-b">
                  <td className="p-2 font-medium">{o.name}</td>
                  {criteria.filter(c => c.name).map(c => (
                    <td key={c.id} className="p-2 text-center">
                      <select
                        value={o.scores[c.id] || 0}
                        onChange={(e) => updateScore(o.id, c.id, parseInt(e.target.value))}
                        className="w-16 px-2 py-1 border border-slate-300 rounded text-center"
                      >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-slate-500 mt-2">
            {t('tools.decisionMatrix.scoreHint')}
          </p>
        </div>
      )}

      {rankedOptions.some(o => o.name) && (
        <div className="card p-4">
          <h3 className="font-medium text-slate-700 mb-3">{t('tools.decisionMatrix.results')}</h3>
          <div className="space-y-2">
            {rankedOptions.filter(o => o.name).map((o, index) => (
              <div key={o.id} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-yellow-400 text-yellow-900' :
                  index === 1 ? 'bg-slate-300 text-slate-700' :
                  index === 2 ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{o.name}</span>
                    <span className="text-sm">{o.totalScore.toFixed(2)}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded overflow-hidden">
                    <div
                      className={`h-full ${index === 0 ? 'bg-green-500' : 'bg-blue-400'}`}
                      style={{ width: `${(o.totalScore / maxScore) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {rankedOptions.filter(o => o.name).length > 0 && (
            <div className="mt-4 p-3 bg-green-50 rounded text-center">
              <span className="text-sm text-slate-600">{t('tools.decisionMatrix.recommendation')}: </span>
              <span className="font-bold text-green-700">{rankedOptions[0]?.name}</span>
            </div>
          )}
        </div>
      )}

      <button
        onClick={clearAll}
        className="w-full py-2 bg-slate-100 rounded text-sm"
      >
        {t('tools.decisionMatrix.clearAll')}
      </button>
    </div>
  )
}
