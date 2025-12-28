import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface Question {
  num1: number
  num2: number
  operator: string
  answer: number
}

export default function MathQuizGame() {
  const { t } = useTranslation()
  const [question, setQuestion] = useState<Question | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isActive, setIsActive] = useState(false)
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [operators, setOperators] = useState<string[]>(['+', '-'])
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const generateQuestion = (): Question => {
    const op = operators[Math.floor(Math.random() * operators.length)]
    let num1: number, num2: number, answer: number

    const ranges = {
      easy: { max: 10, divisor: 10 },
      medium: { max: 50, divisor: 12 },
      hard: { max: 100, divisor: 20 },
    }
    const range = ranges[difficulty]

    switch (op) {
      case '+':
        num1 = Math.floor(Math.random() * range.max) + 1
        num2 = Math.floor(Math.random() * range.max) + 1
        answer = num1 + num2
        break
      case '-':
        num1 = Math.floor(Math.random() * range.max) + 1
        num2 = Math.floor(Math.random() * num1) + 1
        answer = num1 - num2
        break
      case '×':
        num1 = Math.floor(Math.random() * range.divisor) + 1
        num2 = Math.floor(Math.random() * range.divisor) + 1
        answer = num1 * num2
        break
      case '÷':
        num2 = Math.floor(Math.random() * range.divisor) + 1
        answer = Math.floor(Math.random() * range.divisor) + 1
        num1 = num2 * answer
        break
      default:
        num1 = 1
        num2 = 1
        answer = 2
    }

    return { num1, num2, operator: op, answer }
  }

  const startGame = () => {
    setScore(0)
    setStreak(0)
    setTimeLeft(60)
    setIsActive(true)
    setQuestion(generateQuestion())
    setUserAnswer('')
    setResult(null)
    setTimeout(() => inputRef.current?.focus(), 100)

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const endGame = () => {
    setIsActive(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    if (streak > bestStreak) {
      setBestStreak(streak)
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const handleSubmit = () => {
    if (!question || !isActive) return

    const userNum = parseInt(userAnswer)
    if (userNum === question.answer) {
      setResult('correct')
      setScore(prev => prev + 10 + streak)
      setStreak(prev => prev + 1)
    } else {
      setResult('wrong')
      if (streak > bestStreak) {
        setBestStreak(streak)
      }
      setStreak(0)
    }

    setTimeout(() => {
      setQuestion(generateQuestion())
      setUserAnswer('')
      setResult(null)
      inputRef.current?.focus()
    }, 300)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const toggleOperator = (op: string) => {
    if (operators.includes(op)) {
      if (operators.length > 1) {
        setOperators(operators.filter(o => o !== op))
      }
    } else {
      setOperators([...operators, op])
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          {(['easy', 'medium', 'hard'] as const).map(level => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              disabled={isActive}
              className={`flex-1 py-2 rounded capitalize ${
                difficulty === level ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              } disabled:opacity-50`}
            >
              {t(`tools.mathQuizGame.${level}`)}
            </button>
          ))}
        </div>

        <div className="flex gap-2 justify-center mb-4">
          {['+', '-', '×', '÷'].map(op => (
            <button
              key={op}
              onClick={() => toggleOperator(op)}
              disabled={isActive}
              className={`w-12 h-12 rounded-lg text-xl font-bold ${
                operators.includes(op)
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-100 text-slate-400'
              } disabled:opacity-50`}
            >
              {op}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-slate-500">{t('tools.mathQuizGame.score')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{streak}🔥</div>
            <div className="text-sm text-slate-500">{t('tools.mathQuizGame.streak')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{bestStreak}</div>
            <div className="text-sm text-slate-500">{t('tools.mathQuizGame.best')}</div>
          </div>
          <div className="p-3 bg-orange-50 rounded">
            <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-orange-600'}`}>
              {timeLeft}s
            </div>
            <div className="text-sm text-slate-500">{t('tools.mathQuizGame.time')}</div>
          </div>
        </div>
      </div>

      <div className={`card p-8 text-center ${
        result === 'correct' ? 'bg-green-50' :
        result === 'wrong' ? 'bg-red-50' : ''
      }`}>
        {!isActive && timeLeft === 60 && (
          <>
            <div className="text-6xl mb-4">🧮</div>
            <h2 className="text-xl font-bold mb-2">{t('tools.mathQuizGame.title')}</h2>
            <p className="text-slate-500 mb-4">{t('tools.mathQuizGame.description')}</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
            >
              {t('tools.mathQuizGame.startGame')}
            </button>
          </>
        )}

        {isActive && question && (
          <>
            <div className="text-5xl font-bold mb-6 font-mono">
              {question.num1} {question.operator} {question.num2} = ?
            </div>

            <div className="flex gap-2 max-w-xs mx-auto">
              <input
                ref={inputRef}
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-3 border-2 border-blue-300 rounded-lg text-2xl text-center font-mono"
                placeholder="?"
                autoComplete="off"
              />
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
              >
                →
              </button>
            </div>
          </>
        )}

        {!isActive && timeLeft === 0 && (
          <div className="py-4">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold mb-2">{t('tools.mathQuizGame.timeUp')}</h2>
            <div className="text-4xl font-bold text-blue-600 mb-4">{score} pts</div>
            <p className="text-slate-600 mb-4">
              {t('tools.mathQuizGame.bestStreak')}: {bestStreak}
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
            >
              {t('tools.mathQuizGame.playAgain')}
            </button>
          </div>
        )}
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.mathQuizGame.scoring')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.mathQuizGame.scoringRule1')}</li>
          <li>• {t('tools.mathQuizGame.scoringRule2')}</li>
          <li>• {t('tools.mathQuizGame.scoringRule3')}</li>
        </ul>
      </div>
    </div>
  )
}
