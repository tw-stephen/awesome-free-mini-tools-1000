import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function MultiplicationTable() {
  const { t } = useTranslation()
  const [tableSize, setTableSize] = useState(12)
  const [practiceMode, setPracticeMode] = useState(false)
  const [currentProblem, setCurrentProblem] = useState({ a: 0, b: 0 })
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState({ correct: 0, wrong: 0 })
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [practiceRange, setPracticeRange] = useState({ min: 1, max: 12 })

  const generateProblem = () => {
    const a = Math.floor(Math.random() * (practiceRange.max - practiceRange.min + 1)) + practiceRange.min
    const b = Math.floor(Math.random() * (practiceRange.max - practiceRange.min + 1)) + practiceRange.min
    setCurrentProblem({ a, b })
    setAnswer('')
    setFeedback(null)
  }

  useEffect(() => {
    if (practiceMode) {
      generateProblem()
    }
  }, [practiceMode])

  const checkAnswer = () => {
    const correct = currentProblem.a * currentProblem.b
    const userAnswer = parseInt(answer)

    if (userAnswer === correct) {
      setFeedback('correct')
      setScore({ ...score, correct: score.correct + 1 })
      setTimeout(generateProblem, 1000)
    } else {
      setFeedback('wrong')
      setScore({ ...score, wrong: score.wrong + 1 })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && answer) {
      checkAnswer()
    }
  }

  const resetPractice = () => {
    setScore({ correct: 0, wrong: 0 })
    generateProblem()
  }

  if (practiceMode) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <div className="px-3 py-1 bg-green-100 text-green-700 rounded">
              Correct: {score.correct}
            </div>
            <div className="px-3 py-1 bg-red-100 text-red-700 rounded">
              Wrong: {score.wrong}
            </div>
          </div>
          <button onClick={() => setPracticeMode(false)} className="text-blue-500">
            Exit Practice
          </button>
        </div>

        <div className={`card p-8 text-center ${
          feedback === 'correct' ? 'bg-green-50' :
          feedback === 'wrong' ? 'bg-red-50' : ''
        }`}>
          <div className="text-5xl font-bold mb-4">
            {currentProblem.a} × {currentProblem.b} = ?
          </div>

          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-32 px-4 py-3 text-2xl text-center border-2 border-slate-300 rounded font-bold"
            autoFocus
          />

          {feedback === 'correct' && (
            <div className="mt-4 text-green-600 text-xl font-medium">
              Correct!
            </div>
          )}

          {feedback === 'wrong' && (
            <div className="mt-4">
              <div className="text-red-600 text-xl font-medium">Try Again!</div>
              <div className="text-slate-500 mt-1">
                The answer is {currentProblem.a * currentProblem.b}
              </div>
            </div>
          )}

          <button
            onClick={checkAnswer}
            disabled={!answer}
            className="mt-4 px-8 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300 font-medium"
          >
            Check
          </button>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">Practice Range:</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={practiceRange.min}
                onChange={(e) => setPracticeRange({ ...practiceRange, min: parseInt(e.target.value) || 1 })}
                min={1}
                max={12}
                className="w-16 px-2 py-1 border border-slate-300 rounded text-center"
              />
              <span>to</span>
              <input
                type="number"
                value={practiceRange.max}
                onChange={(e) => setPracticeRange({ ...practiceRange, max: parseInt(e.target.value) || 12 })}
                min={1}
                max={12}
                className="w-16 px-2 py-1 border border-slate-300 rounded text-center"
              />
            </div>
            <button onClick={resetPractice} className="ml-auto text-blue-500 text-sm">
              Reset Score
            </button>
          </div>
        </div>

        {score.correct + score.wrong > 0 && (
          <div className="card p-4 bg-slate-50">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round((score.correct / (score.correct + score.wrong)) * 100)}%
              </div>
              <div className="text-sm text-slate-500">Accuracy</div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.multiplicationTable.settings')}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Size:</span>
            <select
              value={tableSize}
              onChange={(e) => setTableSize(parseInt(e.target.value))}
              className="px-2 py-1 border border-slate-300 rounded"
            >
              {[10, 12, 15, 20].map(size => (
                <option key={size} value={size}>{size} × {size}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={() => setPracticeMode(true)}
          className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
        >
          {t('tools.multiplicationTable.practice')}
        </button>
      </div>

      <div className="card p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="w-10 h-10 bg-slate-200 font-bold">×</th>
              {Array.from({ length: tableSize }, (_, i) => (
                <th key={i} className="w-10 h-10 bg-slate-100 font-bold">{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: tableSize }, (_, row) => (
              <tr key={row}>
                <td className="w-10 h-10 bg-slate-100 font-bold text-center">{row + 1}</td>
                {Array.from({ length: tableSize }, (_, col) => {
                  const product = (row + 1) * (col + 1)
                  const isSquare = row === col
                  return (
                    <td
                      key={col}
                      className={`w-10 h-10 text-center border border-slate-100 hover:bg-blue-100
                        ${isSquare ? 'bg-yellow-50 font-medium' : ''}`}
                    >
                      {product}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card p-4 bg-yellow-50">
        <h3 className="font-medium mb-2 text-yellow-700">{t('tools.multiplicationTable.tips')}</h3>
        <ul className="text-sm text-yellow-600 space-y-1">
          <li>• Square numbers (same row and column) are highlighted</li>
          <li>• Hover over cells to highlight them</li>
          <li>• Use practice mode to test your knowledge</li>
          <li>• Start with smaller numbers and work up</li>
        </ul>
      </div>
    </div>
  )
}
