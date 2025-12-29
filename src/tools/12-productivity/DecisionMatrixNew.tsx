import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Option {
  id: string
  name: string
  scores: Record<string, number>
}

interface Criteria {
  id: string
  name: string
  weight: number
}

export default function DecisionMatrixNew() {
  const { t } = useTranslation()
  const [options, setOptions] = useState<Option[]>([
    { id: '1', name: 'Option A', scores: {} },
    { id: '2', name: 'Option B', scores: {} }
  ])
  const [criteria, setCriteria] = useState<Criteria[]>([
    { id: '1', name: 'Cost', weight: 5 },
    { id: '2', name: 'Quality', weight: 4 },
    { id: '3', name: 'Time', weight: 3 }
  ])
  const [newOption, setNewOption] = useState('')
  const [newCriteria, setNewCriteria] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('decision-matrix-new')
    if (saved) {
      const data = JSON.parse(saved)
      setOptions(data.options || [])
      setCriteria(data.criteria || [])
    }
  }, [])

  const saveData = (opts: Option[], crit: Criteria[]) => {
    setOptions(opts)
    setCriteria(crit)
    localStorage.setItem('decision-matrix-new', JSON.stringify({ options: opts, criteria: crit }))
  }

  const addOption = () => {
    if (!newOption.trim()) return
    const option: Option = {
      id: Date.now().toString(),
      name: newOption,
      scores: {}
    }
    saveData([...options, option], criteria)
    setNewOption('')
  }

  const addCriteria = () => {
    if (!newCriteria.trim()) return
    const crit: Criteria = {
      id: Date.now().toString(),
      name: newCriteria,
      weight: 3
    }
    saveData(options, [...criteria, crit])
    setNewCriteria('')
  }

  const removeOption = (id: string) => {
    saveData(options.filter(o => o.id !== id), criteria)
  }

  const removeCriteria = (id: string) => {
    saveData(options, criteria.filter(c => c.id !== id))
  }

  const updateScore = (optionId: string, criteriaId: string, score: number) => {
    const updated = options.map(o => {
      if (o.id === optionId) {
        return { ...o, scores: { ...o.scores, [criteriaId]: score } }
      }
      return o
    })
    saveData(updated, criteria)
  }

  const updateWeight = (criteriaId: string, weight: number) => {
    const updated = criteria.map(c => {
      if (c.id === criteriaId) {
        return { ...c, weight }
      }
      return c
    })
    saveData(options, updated)
  }

  const calculateTotal = (option: Option): number => {
    let total = 0
    criteria.forEach(c => {
      const score = option.scores[c.id] || 0
      total += score * c.weight
    })
    return Math.round(total * 10) / 10
  }

  const sortedOptions = [...options].sort((a, b) => calculateTotal(b) - calculateTotal(a))
  const maxTotal = Math.max(...options.map(o => calculateTotal(o)), 1)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.decisionMatrixNew.options')}</h3>
        <div className="flex gap-2 mb-2 flex-wrap">
          {options.map(o => (
            <span key={o.id} className="px-2 py-1 bg-blue-100 rounded text-sm flex items-center gap-1">
              {o.name}
              <button onClick={() => removeOption(o.id)} className="text-red-500">x</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder={t('tools.decisionMatrixNew.addOption')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
          />
          <button
            onClick={addOption}
            disabled={!newOption.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.decisionMatrixNew.criteria')}</h3>
        <div className="space-y-2 mb-3">
          {criteria.map(c => (
            <div key={c.id} className="flex items-center gap-2">
              <span className="flex-1 text-sm">{c.name}</span>
              <span className="text-xs text-slate-500">{t('tools.decisionMatrixNew.weight')}:</span>
              <input
                type="number"
                value={c.weight}
                onChange={(e) => updateWeight(c.id, parseInt(e.target.value) || 1)}
                className="w-16 px-2 py-1 border border-slate-300 rounded text-sm"
                min="1"
                max="10"
              />
              <button onClick={() => removeCriteria(c.id)} className="text-red-500 text-sm">x</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCriteria}
            onChange={(e) => setNewCriteria(e.target.value)}
            placeholder={t('tools.decisionMatrixNew.addCriteria')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
          />
          <button
            onClick={addCriteria}
            disabled={!newCriteria.trim()}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>

      {options.length > 0 && criteria.length > 0 && (
        <div className="card p-4 overflow-x-auto">
          <h3 className="font-medium mb-3">{t('tools.decisionMatrixNew.scoreMatrix')}</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2">{t('tools.decisionMatrixNew.option')}</th>
                {criteria.map(c => (
                  <th key={c.id} className="text-center py-2 px-2">
                    <div>{c.name}</div>
                    <div className="text-xs text-slate-400">({t('tools.decisionMatrixNew.weight')}: {c.weight})</div>
                  </th>
                ))}
                <th className="text-center py-2 px-2">{t('tools.decisionMatrixNew.total')}</th>
              </tr>
            </thead>
            <tbody>
              {options.map(o => (
                <tr key={o.id} className="border-b">
                  <td className="py-2 px-2 font-medium">{o.name}</td>
                  {criteria.map(c => (
                    <td key={c.id} className="text-center py-2 px-2">
                      <input
                        type="number"
                        value={o.scores[c.id] || 0}
                        onChange={(e) => updateScore(o.id, c.id, parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border border-slate-300 rounded text-center"
                        min="0"
                        max="10"
                      />
                    </td>
                  ))}
                  <td className="text-center py-2 px-2 font-bold">
                    {calculateTotal(o)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {options.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.decisionMatrixNew.ranking')}</h3>
          <div className="space-y-2">
            {sortedOptions.map((o, index) => {
              const total = calculateTotal(o)
              const percentage = (total / maxTotal) * 100
              return (
                <div key={o.id} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-slate-300' : index === 2 ? 'bg-amber-600 text-white' : 'bg-slate-100'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="w-24 font-medium">{o.name}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-16 text-right font-mono">{total}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <button
        onClick={() => saveData([], [])}
        className="w-full py-2 bg-slate-100 text-slate-600 rounded"
      >
        {t('tools.decisionMatrixNew.reset')}
      </button>
    </div>
  )
}
