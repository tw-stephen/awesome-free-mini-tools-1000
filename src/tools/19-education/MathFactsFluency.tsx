import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface Problem {
  a: number
  b: number
  operation: string
  answer: number
}

export default function MathFactsFluency() {
  const { t } = useTranslation()
  const [operation, setOperation] = useState<'+' | '-' | '×' | '÷'>('+')
  const [maxNumber, setMaxNumber] = useState(12)
  const [timeLimit, setTimeLimit] = useState(60)
  const [practicing, setPracticing] = useState(false)
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [stats, setStats] = useState({ correct: 0, wrong: 0, total: 0 })
  const [problems, setProblems] = useState<{ problem: Problem; userAnswer: number; correct: boolean }[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (practicing && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setPracticing(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [practicing, timeLeft])

  const generateProblem = (): Problem => {
    let a: number, b: number, answer: number

    switch (operation) {
      case '+':
        a = Math.floor(Math.random() * maxNumber) + 1
        b = Math.floor(Math.random() * maxNumber) + 1
        answer = a + b
        break
      case '-':
        a = Math.floor(Math.random() * maxNumber) + 1
        b = Math.floor(Math.random() * a) + 1
        answer = a - b
        break
      case '×':
        a = Math.floor(Math.random() * maxNumber) + 1
        b = Math.floor(Math.random() * maxNumber) + 1
        answer = a * b
        break
      case '÷':
        b = Math.floor(Math.random() * maxNumber) + 1
        answer = Math.floor(Math.random() * maxNumber) + 1
        a = b * answer
        break
      default:
        a = 0
        b = 0
        answer = 0
    }

    return { a, b, operation, answer }
  }

  const startPractice = () => {
    setPracticing(true)
    setTimeLeft(timeLimit)
    setStats({ correct: 0, wrong: 0, total: 0 })
    setProblems([])
    setCurrentProblem(generateProblem())
    setUserAnswer('')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const submitAnswer = () => {
    if (!currentProblem || userAnswer === '') return

    const userNum = parseInt(userAnswer)
    const isCorrect = userNum === currentProblem.answer

    setProblems([...problems, { problem: currentProblem, userAnswer: userNum, correct: isCorrect }])
    setStats({
      correct: stats.correct + (isCorrect ? 1 : 0),
      wrong: stats.wrong + (isCorrect ? 0 : 1),
      total: stats.total + 1,
    })

    setCurrentProblem(generateProblem())
    setUserAnswer('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitAnswer()
    }
  }

  const getProblemsPerMinute = (): number => {
    const timeUsed = timeLimit - timeLeft
    if (timeUsed === 0) return 0
    return Math.round((stats.total / timeUsed) * 60)
  }

  const getAccuracy = (): number => {
    if (stats.total === 0) return 0
    return Math.round((stats.correct / stats.total) * 100)
  }

  if (practicing && timeLeft > 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold">{timeLeft}s</div>
          <div className="flex gap-4">
            <span className="text-green-600 font-medium">✓ {stats.correct}</span>
            <span className="text-red-600 font-medium">✗ {stats.wrong}</span>
          </div>
        </div>

        <div className="w-full h-2 bg-slate-200 rounded-full">
          <div
            className="h-2 bg-blue-500 rounded-full transition-all duration-1000"
            style={{ width: `${(timeLeft / timeLimit) * 100}%` }}
          />
        </div>

        <div className="card p-8 text-center">
          <div className="text-5xl font-bold mb-6">
            {currentProblem?.a} {currentProblem?.operation} {currentProblem?.b} = ?
          </div>
          <input
            ref={inputRef}
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-32 px-4 py-3 text-3xl text-center border-2 border-blue-300 rounded font-bold"
            autoFocus
          />
        </div>

        <button
          onClick={submitAnswer}
          disabled={userAnswer === ''}
          className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium disabled:bg-slate-300"
        >
          Submit (Enter)
        </button>

        <button
          onClick={() => setPracticing(false)}
          className="w-full py-2 bg-slate-200 rounded hover:bg-slate-300"
        >
          End Practice
        </button>
      </div>
    )
  }

  // Results
  if (!practicing && stats.total > 0) {
    const ppm = getProblemsPerMinute()
    const accuracy = getAccuracy()

    return (
      <div className="space-y-4">
        <div className="card p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Practice Complete!</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 rounded">
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-blue-500">Problems</div>
            </div>
            <div className="p-3 bg-green-50 rounded">
              <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
              <div className="text-sm text-green-500">Accuracy</div>
            </div>
            <div className="p-3 bg-purple-50 rounded">
              <div className="text-3xl font-bold text-purple-600">{ppm}</div>
              <div className="text-sm text-purple-500">Per Minute</div>
            </div>
          </div>
        </div>

        {problems.length > 0 && (
          <div className="card p-4">
            <h3 className="font-medium mb-3">Review</h3>
            <div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto">
              {problems.map((p, i) => (
                <div
                  key={i}
                  className={`p-2 rounded text-center text-sm ${
                    p.correct ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <div>{p.problem.a} {p.problem.operation} {p.problem.b}</div>
                  <div className={p.correct ? 'text-green-600' : 'text-red-600'}>
                    {p.userAnswer}
                    {!p.correct && <span className="ml-1">({p.problem.answer})</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={startPractice}
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
        >
          Practice Again
        </button>
        <button
          onClick={() => setStats({ correct: 0, wrong: 0, total: 0 })}
          className="w-full py-2 bg-slate-200 rounded hover:bg-slate-300"
        >
          Change Settings
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.mathFactsFluency.operation')}</h3>
        <div className="flex gap-2">
          {(['+', '-', '×', '÷'] as const).map(op => (
            <button
              key={op}
              onClick={() => setOperation(op)}
              className={`flex-1 py-3 text-2xl rounded ${
                operation === op ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {op}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-2">Max Number</label>
            <select
              value={maxNumber}
              onChange={(e) => setMaxNumber(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              {[5, 10, 12, 15, 20].map(n => (
                <option key={n} value={n}>Up to {n}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-2">Time Limit</label>
            <select
              value={timeLimit}
              onChange={(e) => setTimeLimit(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              {[30, 60, 90, 120].map(t => (
                <option key={t} value={t}>{t} seconds</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={startPractice}
        className="w-full py-4 bg-green-500 text-white rounded hover:bg-green-600 font-medium text-lg"
      >
        {t('tools.mathFactsFluency.start')}
      </button>

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium mb-2 text-blue-700">{t('tools.mathFactsFluency.tips')}</h3>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• Answer as many problems as you can</li>
          <li>• Focus on accuracy first, then speed</li>
          <li>• Press Enter to submit quickly</li>
          <li>• Practice regularly to improve</li>
        </ul>
      </div>
    </div>
  )
}
