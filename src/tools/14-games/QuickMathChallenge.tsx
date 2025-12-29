import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

type Operation = '+' | '-' | '*' | '/'
type Difficulty = 'easy' | 'medium' | 'hard'

interface Problem {
  num1: number
  num2: number
  operation: Operation
  answer: number
}

export default function QuickMathChallenge() {
  const { t } = useTranslation()
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [problem, setProblem] = useState<Problem | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isPlaying, setIsPlaying] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [highScore, setHighScore] = useState(0)
  const [totalProblems, setTotalProblems] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const difficultySettings = {
    easy: { maxNum: 10, operations: ['+', '-'] as Operation[], time: 60 },
    medium: { maxNum: 20, operations: ['+', '-', '*'] as Operation[], time: 60 },
    hard: { maxNum: 50, operations: ['+', '-', '*', '/'] as Operation[], time: 45 }
  }

  const generateProblem = (): Problem => {
    const settings = difficultySettings[difficulty]
    const operation = settings.operations[Math.floor(Math.random() * settings.operations.length)]

    let num1: number, num2: number, answer: number

    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * settings.maxNum) + 1
        num2 = Math.floor(Math.random() * settings.maxNum) + 1
        answer = num1 + num2
        break
      case '-':
        num1 = Math.floor(Math.random() * settings.maxNum) + 1
        num2 = Math.floor(Math.random() * num1) + 1
        answer = num1 - num2
        break
      case '*':
        num1 = Math.floor(Math.random() * Math.min(12, settings.maxNum)) + 1
        num2 = Math.floor(Math.random() * Math.min(12, settings.maxNum)) + 1
        answer = num1 * num2
        break
      case '/':
        num2 = Math.floor(Math.random() * 12) + 1
        answer = Math.floor(Math.random() * 12) + 1
        num1 = num2 * answer
        break
      default:
        num1 = 1
        num2 = 1
        answer = 2
    }

    return { num1, num2, operation, answer }
  }

  const startGame = () => {
    setScore(0)
    setStreak(0)
    setTimeLeft(difficultySettings[difficulty].time)
    setIsPlaying(true)
    setTotalProblems(0)
    setCorrectAnswers(0)
    setProblem(generateProblem())
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const endGame = () => {
    setIsPlaying(false)
    if (score > highScore) {
      setHighScore(score)
    }
  }

  useEffect(() => {
    let timer: number
    if (isPlaying && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isPlaying, timeLeft])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!problem || !isPlaying) return

    const answer = parseFloat(userAnswer)
    setTotalProblems(prev => prev + 1)

    if (answer === problem.answer) {
      setFeedback('correct')
      const points = (10 + streak * 2) * (difficulty === 'hard' ? 2 : difficulty === 'medium' ? 1.5 : 1)
      setScore(prev => prev + Math.round(points))
      setStreak(prev => prev + 1)
      setCorrectAnswers(prev => prev + 1)
    } else {
      setFeedback('wrong')
      setStreak(0)
    }

    setTimeout(() => {
      setFeedback(null)
      setProblem(generateProblem())
      setUserAnswer('')
      inputRef.current?.focus()
    }, 300)
  }

  const getOperationSymbol = (op: Operation): string => {
    switch (op) {
      case '+': return '+'
      case '-': return '-'
      case '*': return 'x'
      case '/': return ':'
    }
  }

  const accuracy = totalProblems > 0 ? Math.round((correctAnswers / totalProblems) * 100) : 0

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          {(['easy', 'medium', 'hard'] as const).map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              disabled={isPlaying}
              className={`flex-1 py-2 rounded capitalize ${
                difficulty === d ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {t(`tools.quickMathChallenge.${d}`)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="p-2 bg-blue-50 rounded">
            <div className="text-xl font-bold text-blue-600">{score}</div>
            <div className="text-xs text-slate-500">{t('tools.quickMathChallenge.score')}</div>
          </div>
          <div className="p-2 bg-green-50 rounded">
            <div className="text-xl font-bold text-green-600">{streak}</div>
            <div className="text-xs text-slate-500">{t('tools.quickMathChallenge.streak')}</div>
          </div>
          <div className="p-2 bg-purple-50 rounded">
            <div className="text-xl font-bold text-purple-600">{accuracy}%</div>
            <div className="text-xs text-slate-500">{t('tools.quickMathChallenge.accuracy')}</div>
          </div>
          <div className={`p-2 rounded ${timeLeft <= 10 ? 'bg-red-50' : 'bg-yellow-50'}`}>
            <div className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-yellow-600'}`}>
              {timeLeft}s
            </div>
            <div className="text-xs text-slate-500">{t('tools.quickMathChallenge.time')}</div>
          </div>
        </div>
      </div>

      {isPlaying && problem ? (
        <div className={`card p-6 transition-colors ${
          feedback === 'correct' ? 'bg-green-50' : feedback === 'wrong' ? 'bg-red-50' : ''
        }`}>
          <div className="text-center mb-6">
            <div className="text-5xl font-bold font-mono">
              {problem.num1} {getOperationSymbol(problem.operation)} {problem.num2} = ?
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 max-w-xs mx-auto">
            <input
              ref={inputRef}
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="flex-1 px-4 py-3 border border-slate-300 rounded text-2xl text-center font-mono"
              placeholder="?"
              autoComplete="off"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
            >
              {t('tools.quickMathChallenge.submit')}
            </button>
          </form>

          {feedback === 'correct' && (
            <div className="text-center mt-4 text-green-600 font-bold">
              {t('tools.quickMathChallenge.correct')} +{Math.round((10 + (streak - 1) * 2) * (difficulty === 'hard' ? 2 : difficulty === 'medium' ? 1.5 : 1))}
            </div>
          )}

          {feedback === 'wrong' && (
            <div className="text-center mt-4 text-red-600 font-bold">
              {t('tools.quickMathChallenge.wrong')} ({problem.answer})
            </div>
          )}
        </div>
      ) : !isPlaying && totalProblems > 0 ? (
        <div className="card p-6 text-center">
          <div className="text-4xl mb-4">
            {accuracy >= 80 ? '🏆' : accuracy >= 60 ? '🎉' : accuracy >= 40 ? '👍' : '💪'}
          </div>
          <h3 className="text-xl font-bold mb-4">{t('tools.quickMathChallenge.gameOver')}</h3>

          <div className="grid grid-cols-2 gap-4 mb-6 max-w-xs mx-auto">
            <div className="p-4 bg-blue-50 rounded">
              <div className="text-3xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-slate-500">{t('tools.quickMathChallenge.finalScore')}</div>
            </div>
            <div className="p-4 bg-green-50 rounded">
              <div className="text-3xl font-bold text-green-600">{correctAnswers}/{totalProblems}</div>
              <div className="text-sm text-slate-500">{t('tools.quickMathChallenge.correct')}</div>
            </div>
          </div>

          {highScore > 0 && (
            <p className="text-slate-500 mb-4">
              {t('tools.quickMathChallenge.highScore')}: {highScore}
            </p>
          )}

          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            {t('tools.quickMathChallenge.playAgain')}
          </button>
        </div>
      ) : (
        <div className="card p-6 text-center">
          <div className="text-6xl mb-4">🧮</div>
          <h3 className="text-lg font-medium mb-2">{t('tools.quickMathChallenge.title')}</h3>
          <p className="text-slate-500 mb-4">{t('tools.quickMathChallenge.instructions')}</p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            {t('tools.quickMathChallenge.start')}
          </button>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.quickMathChallenge.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>* {t('tools.quickMathChallenge.tip1')}</li>
          <li>* {t('tools.quickMathChallenge.tip2')}</li>
          <li>* {t('tools.quickMathChallenge.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
