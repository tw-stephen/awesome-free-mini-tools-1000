import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division'

interface Problem {
  a: number
  b: number
  operation: Operation
  answer: number
  userAnswer: number | null
  correct: boolean | null
  time: number
}

export default function MathFactsPractice() {
  const { t } = useTranslation()
  const [operation, setOperation] = useState<Operation>('addition')
  const [maxNumber, setMaxNumber] = useState(12)
  const [mode, setMode] = useState<'setup' | 'practice' | 'results'>('setup')
  const [problems, setProblems] = useState<Problem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [startTime, setStartTime] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const generateProblem = (): Problem => {
    let a: number, b: number, answer: number

    switch (operation) {
      case 'addition':
        a = Math.floor(Math.random() * (maxNumber + 1))
        b = Math.floor(Math.random() * (maxNumber + 1))
        answer = a + b
        break
      case 'subtraction':
        a = Math.floor(Math.random() * (maxNumber + 1))
        b = Math.floor(Math.random() * (a + 1))
        answer = a - b
        break
      case 'multiplication':
        a = Math.floor(Math.random() * (maxNumber + 1))
        b = Math.floor(Math.random() * (maxNumber + 1))
        answer = a * b
        break
      case 'division':
        b = Math.floor(Math.random() * maxNumber) + 1
        answer = Math.floor(Math.random() * (maxNumber + 1))
        a = b * answer
        break
      default:
        a = 0; b = 0; answer = 0
    }

    return { a, b, operation, answer, userAnswer: null, correct: null, time: 0 }
  }

  const startPractice = () => {
    const newProblems = Array(20).fill(null).map(() => generateProblem())
    setProblems(newProblems)
    setCurrentIndex(0)
    setStartTime(Date.now())
    setMode('practice')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const submitAnswer = () => {
    const answer = parseInt(userInput)
    if (isNaN(answer)) return

    const time = Date.now() - startTime
    const correct = answer === problems[currentIndex].answer

    const updatedProblems = [...problems]
    updatedProblems[currentIndex] = {
      ...updatedProblems[currentIndex],
      userAnswer: answer,
      correct,
      time,
    }
    setProblems(updatedProblems)
    setUserInput('')

    if (currentIndex < problems.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setStartTime(Date.now())
      setTimeout(() => inputRef.current?.focus(), 0)
    } else {
      setMode('results')
    }
  }

  const getOperationSymbol = (op: Operation) => {
    switch (op) {
      case 'addition': return '+'
      case 'subtraction': return '−'
      case 'multiplication': return '×'
      case 'division': return '÷'
    }
  }

  const correctCount = problems.filter(p => p.correct).length
  const totalTime = problems.reduce((sum, p) => sum + p.time, 0)
  const avgTime = problems.length > 0 ? totalTime / problems.length : 0

  return (
    <div className="space-y-4">
      {mode === 'setup' && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.mathFactsPractice.selectOperation')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(['addition', 'subtraction', 'multiplication', 'division'] as Operation[]).map(op => (
                <button
                  key={op}
                  onClick={() => setOperation(op)}
                  className={`p-3 rounded text-center ${operation === op ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
                >
                  <div className="text-2xl">{getOperationSymbol(op)}</div>
                  <div className="text-sm">{t(`tools.mathFactsPractice.${op}`)}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.mathFactsPractice.maxNumber')}
            </h3>
            <div className="flex gap-2">
              {[5, 10, 12, 15, 20].map(n => (
                <button
                  key={n}
                  onClick={() => setMaxNumber(n)}
                  className={`flex-1 py-2 rounded ${maxNumber === n ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startPractice}
            className="w-full py-3 bg-green-500 text-white rounded font-medium text-lg"
          >
            {t('tools.mathFactsPractice.start')}
          </button>
        </>
      )}

      {mode === 'practice' && problems.length > 0 && (
        <div className="card p-6 text-center">
          <div className="text-sm text-slate-500 mb-4">
            {currentIndex + 1} / {problems.length}
          </div>
          <div className="h-2 bg-slate-200 rounded mb-6">
            <div
              className="h-full bg-blue-500 rounded transition-all"
              style={{ width: `${((currentIndex + 1) / problems.length) * 100}%` }}
            />
          </div>

          <div className="text-5xl font-bold mb-6">
            {problems[currentIndex].a} {getOperationSymbol(problems[currentIndex].operation)} {problems[currentIndex].b} = ?
          </div>

          <input
            ref={inputRef}
            type="number"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitAnswer()}
            className="w-32 px-4 py-3 text-3xl text-center border-2 border-slate-300 rounded mb-4"
            autoFocus
          />

          <button
            onClick={submitAnswer}
            disabled={!userInput}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
          >
            {t('tools.mathFactsPractice.submit')}
          </button>
        </div>
      )}

      {mode === 'results' && (
        <>
          <div className="card p-6 text-center bg-blue-50">
            <div className="text-sm text-slate-600">{t('tools.mathFactsPractice.score')}</div>
            <div className={`text-5xl font-bold ${correctCount === problems.length ? 'text-green-600' : correctCount >= problems.length * 0.8 ? 'text-blue-600' : 'text-red-600'}`}>
              {correctCount} / {problems.length}
            </div>
            <div className="text-sm text-slate-500 mt-2">
              {t('tools.mathFactsPractice.avgTime')}: {(avgTime / 1000).toFixed(1)}s
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.mathFactsPractice.review')}
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {problems.map((p, i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center p-2 rounded ${p.correct ? 'bg-green-50' : 'bg-red-50'}`}
                >
                  <span className="font-mono">
                    {p.a} {getOperationSymbol(p.operation)} {p.b} = {p.answer}
                  </span>
                  <span className={p.correct ? 'text-green-600' : 'text-red-600'}>
                    {p.correct ? '✓' : `✗ (${p.userAnswer})`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setMode('setup')}
              className="flex-1 py-2 bg-slate-100 rounded"
            >
              {t('tools.mathFactsPractice.changeSettings')}
            </button>
            <button
              onClick={startPractice}
              className="flex-1 py-2 bg-blue-500 text-white rounded"
            >
              {t('tools.mathFactsPractice.tryAgain')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
