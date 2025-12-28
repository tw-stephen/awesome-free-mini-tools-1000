import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Option {
  id: number
  name: string
  scores: number[]
}

export default function DecisionMatrix() {
  const { t } = useTranslation()
  const [decisionTitle, setDecisionTitle] = useState('')
  const [criteria, setCriteria] = useState(['Cost', 'Time', 'Quality', 'Risk'])
  const [weights, setWeights] = useState([3, 2, 3, 2])
  const [options, setOptions] = useState<Option[]>([
    { id: 1, name: 'Option A', scores: [3, 4, 5, 3] },
    { id: 2, name: 'Option B', scores: [4, 3, 4, 4] },
  ])

  const addOption = () => {
    setOptions([...options, { id: Date.now(), name: '', scores: new Array(criteria.length).fill(3) }])
  }

  const addCriterion = () => {
    setCriteria([...criteria, 'New Criterion'])
    setWeights([...weights, 2])
    setOptions(options.map(o => ({ ...o, scores: [...o.scores, 3] })))
  }

  const updateOption = (id: number, field: string, value: string | number[]) => {
    setOptions(options.map(o => o.id === id ? { ...o, [field]: value } : o))
  }

  const updateScore = (optId: number, critIndex: number, score: number) => {
    setOptions(options.map(o => {
      if (o.id === optId) {
        const newScores = [...o.scores]
        newScores[critIndex] = score
        return { ...o, scores: newScores }
      }
      return o
    }))
  }

  const calculateTotal = (scores: number[]): number => {
    return scores.reduce((sum, score, i) => sum + score * weights[i], 0)
  }

  const maxTotal = Math.max(...options.map(o => calculateTotal(o.scores)))

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-1">{t('tools.decisionMatrix.decision')}</label>
        <input
          type="text"
          value={decisionTitle}
          onChange={(e) => setDecisionTitle(e.target.value)}
          placeholder="What decision are you making?"
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">{t('tools.decisionMatrix.option')}</th>
              {criteria.map((c, i) => (
                <th key={i} className="p-2 text-center">
                  <input
                    type="text"
                    value={c}
                    onChange={(e) => {
                      const newC = [...criteria]
                      newC[i] = e.target.value
                      setCriteria(newC)
                    }}
                    className="w-20 text-center border-b border-transparent hover:border-slate-300 focus:border-blue-500"
                  />
                  <div className="text-xs text-slate-500 mt-1">
                    Weight:
                    <select
                      value={weights[i]}
                      onChange={(e) => {
                        const newW = [...weights]
                        newW[i] = parseInt(e.target.value)
                        setWeights(newW)
                      }}
                      className="ml-1"
                    >
                      {[1, 2, 3, 4, 5].map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </div>
                </th>
              ))}
              <th className="p-2 text-center">{t('tools.decisionMatrix.total')}</th>
            </tr>
          </thead>
          <tbody>
            {options.map((option) => {
              const total = calculateTotal(option.scores)
              const isWinner = total === maxTotal
              return (
                <tr key={option.id} className={isWinner ? 'bg-green-50' : ''}>
                  <td className="p-2">
                    <input
                      type="text"
                      value={option.name}
                      onChange={(e) => updateOption(option.id, 'name', e.target.value)}
                      placeholder="Option name"
                      className="w-full px-2 py-1 border border-slate-300 rounded"
                    />
                  </td>
                  {criteria.map((_, i) => (
                    <td key={i} className="p-2 text-center">
                      <select
                        value={option.scores[i]}
                        onChange={(e) => updateScore(option.id, i, parseInt(e.target.value))}
                        className="px-2 py-1 border border-slate-300 rounded"
                      >
                        {[1, 2, 3, 4, 5].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  ))}
                  <td className={`p-2 text-center font-bold ${isWinner ? 'text-green-600' : ''}`}>
                    {total}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="flex gap-2 mt-3">
          <button onClick={addOption} className="flex-1 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            + Add Option
          </button>
          <button onClick={addCriterion} className="flex-1 py-2 bg-slate-100 rounded hover:bg-slate-200">
            + Add Criterion
          </button>
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.decisionMatrix.recommendation')}</h4>
        <p className="text-lg">
          {options.length > 0 && options.some(o => o.name) ? (
            <>Best choice: <strong className="text-green-600">
              {options.find(o => calculateTotal(o.scores) === maxTotal)?.name || 'No clear winner'}
            </strong> with score of {maxTotal}</>
          ) : 'Enter options to see recommendation'}
        </p>
      </div>
    </div>
  )
}
