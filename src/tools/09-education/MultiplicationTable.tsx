import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function MultiplicationTable() {
  const { t } = useTranslation()
  const [tableSize, setTableSize] = useState(12)
  const [highlightNumber, setHighlightNumber] = useState<number | null>(null)
  const [mode, setMode] = useState<'table' | 'practice'>('table')
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const generateQuestion = () => {
    setNum1(Math.floor(Math.random() * tableSize) + 1)
    setNum2(Math.floor(Math.random() * tableSize) + 1)
    setUserAnswer('')
    setFeedback(null)
  }

  const checkAnswer = () => {
    const correct = num1 * num2
    const isCorrect = parseInt(userAnswer) === correct
    setFeedback(isCorrect ? 'correct' : 'wrong')
    setScore({
      correct: score.correct + (isCorrect ? 1 : 0),
      total: score.total + 1,
    })
  }

  const startPractice = () => {
    setMode('practice')
    setScore({ correct: 0, total: 0 })
    generateQuestion()
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('table')}
          className={`flex-1 py-2 rounded font-medium ${mode === 'table' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.multiplicationTable.table')}
        </button>
        <button
          onClick={startPractice}
          className={`flex-1 py-2 rounded font-medium ${mode === 'practice' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.multiplicationTable.practice')}
        </button>
      </div>

      {mode === 'table' && (
        <>
          <div className="card p-4">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-medium text-slate-700">
                {t('tools.multiplicationTable.size')}: {tableSize}×{tableSize}
              </label>
              <input
                type="range"
                min="5"
                max="15"
                value={tableSize}
                onChange={(e) => setTableSize(parseInt(e.target.value))}
                className="w-32"
              />
            </div>

            <div className="flex gap-2 mb-4">
              <span className="text-sm text-slate-500">{t('tools.multiplicationTable.highlight')}:</span>
              {[2, 3, 5, 7, 9].map(n => (
                <button
                  key={n}
                  onClick={() => setHighlightNumber(highlightNumber === n ? null : n)}
                  className={`w-8 h-8 rounded text-sm ${
                    highlightNumber === n ? 'bg-blue-500 text-white' : 'bg-slate-100'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-sm">
                <thead>
                  <tr>
                    <th className="p-1 bg-slate-200">×</th>
                    {[...Array(tableSize)].map((_, i) => (
                      <th key={i} className="p-1 bg-slate-200">{i + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(tableSize)].map((_, row) => (
                    <tr key={row}>
                      <td className="p-1 bg-slate-200 font-medium">{row + 1}</td>
                      {[...Array(tableSize)].map((_, col) => {
                        const product = (row + 1) * (col + 1)
                        const isHighlighted = highlightNumber &&
                          ((row + 1) === highlightNumber || (col + 1) === highlightNumber)
                        return (
                          <td
                            key={col}
                            className={`p-1 ${isHighlighted ? 'bg-blue-100 text-blue-700 font-medium' : ''}`}
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
          </div>
        </>
      )}

      {mode === 'practice' && (
        <>
          <div className="card p-4 text-center">
            <div className="text-sm text-slate-500 mb-2">
              {t('tools.multiplicationTable.score')}: {score.correct} / {score.total}
              {score.total > 0 && ` (${Math.round(score.correct / score.total * 100)}%)`}
            </div>

            <div className="text-4xl font-bold mb-4">
              {num1} × {num2} = ?
            </div>

            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && userAnswer && checkAnswer()}
              placeholder="?"
              className="w-32 px-4 py-3 text-2xl text-center border-2 border-slate-300 rounded mb-4"
              autoFocus
            />

            {feedback && (
              <div className={`p-3 rounded mb-4 ${
                feedback === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {feedback === 'correct'
                  ? t('tools.multiplicationTable.correct')
                  : `${t('tools.multiplicationTable.wrong')} ${num1} × ${num2} = ${num1 * num2}`}
              </div>
            )}

            <div className="flex gap-2">
              {!feedback ? (
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer}
                  className="flex-1 py-3 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
                >
                  {t('tools.multiplicationTable.check')}
                </button>
              ) : (
                <button
                  onClick={generateQuestion}
                  className="flex-1 py-3 bg-green-500 text-white rounded font-medium"
                >
                  {t('tools.multiplicationTable.next')}
                </button>
              )}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              {t('tools.multiplicationTable.quickTips')}
            </h3>
            <div className="text-xs text-slate-500 space-y-1">
              <p>• {t('tools.multiplicationTable.tip1')}</p>
              <p>• {t('tools.multiplicationTable.tip2')}</p>
              <p>• {t('tools.multiplicationTable.tip3')}</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
