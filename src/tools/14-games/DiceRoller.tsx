import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface DieResult {
  id: number
  value: number
  sides: number
}

export default function DiceRoller() {
  const { t } = useTranslation()
  const [numDice, setNumDice] = useState(2)
  const [diceSides, setDiceSides] = useState(6)
  const [results, setResults] = useState<DieResult[]>([])
  const [rolling, setRolling] = useState(false)
  const [history, setHistory] = useState<{ dice: DieResult[], total: number }[]>([])

  const rollDice = () => {
    setRolling(true)

    // Animate rolling
    const animationDuration = 500
    const interval = 50
    const iterations = animationDuration / interval
    let count = 0

    const animate = setInterval(() => {
      const tempResults = Array.from({ length: numDice }, (_, i) => ({
        id: i,
        value: Math.floor(Math.random() * diceSides) + 1,
        sides: diceSides
      }))
      setResults(tempResults)
      count++

      if (count >= iterations) {
        clearInterval(animate)
        const finalResults = Array.from({ length: numDice }, (_, i) => ({
          id: i,
          value: Math.floor(Math.random() * diceSides) + 1,
          sides: diceSides
        }))
        setResults(finalResults)
        setHistory(prev => [{ dice: finalResults, total: finalResults.reduce((sum, d) => sum + d.value, 0) }, ...prev].slice(0, 10))
        setRolling(false)
      }
    }, interval)
  }

  const total = results.reduce((sum, die) => sum + die.value, 0)

  const diceTypes = [4, 6, 8, 10, 12, 20, 100]

  const getDieFace = (value: number, sides: number) => {
    if (sides === 6) {
      const dots: Record<number, string> = {
        1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅'
      }
      return dots[value] || value.toString()
    }
    return value.toString()
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('tools.diceRoller.numberOfDice')}
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={numDice}
              onChange={(e) => setNumDice(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('tools.diceRoller.diceSides')}
            </label>
            <select
              value={diceSides}
              onChange={(e) => setDiceSides(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              {diceTypes.map(sides => (
                <option key={sides} value={sides}>D{sides}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {diceTypes.map(sides => (
            <button
              key={sides}
              onClick={() => setDiceSides(sides)}
              className={`px-3 py-1 rounded ${diceSides === sides ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
            >
              D{sides}
            </button>
          ))}
        </div>

        <button
          onClick={rollDice}
          disabled={rolling}
          className="w-full py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 disabled:bg-blue-300"
        >
          {rolling ? t('tools.diceRoller.rolling') : t('tools.diceRoller.roll')}
        </button>
      </div>

      {results.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.diceRoller.results')}</h3>
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            {results.map((die) => (
              <div
                key={die.id}
                className={`w-16 h-16 flex items-center justify-center bg-white border-2 border-slate-300 rounded-lg shadow ${rolling ? 'animate-bounce' : ''}`}
              >
                <span className={`${die.sides === 6 ? 'text-4xl' : 'text-2xl font-bold'}`}>
                  {getDieFace(die.value, die.sides)}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <div className="text-sm text-slate-500">{t('tools.diceRoller.total')}</div>
            <div className="text-4xl font-bold text-blue-600">{total}</div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.diceRoller.quickRolls')}</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { dice: 1, sides: 20, label: '1d20' },
            { dice: 2, sides: 6, label: '2d6' },
            { dice: 3, sides: 6, label: '3d6' },
            { dice: 4, sides: 6, label: '4d6' },
            { dice: 1, sides: 100, label: '1d100' },
            { dice: 2, sides: 10, label: '2d10' },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => { setNumDice(preset.dice); setDiceSides(preset.sides); }}
              className="px-3 py-2 bg-slate-100 rounded hover:bg-slate-200 text-sm"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {history.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.diceRoller.history')}</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {history.map((roll, i) => (
              <div key={i} className="flex justify-between p-2 bg-slate-50 rounded text-sm">
                <span className="font-mono">
                  {roll.dice.map(d => d.value).join(' + ')}
                </span>
                <span className="font-bold">= {roll.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
