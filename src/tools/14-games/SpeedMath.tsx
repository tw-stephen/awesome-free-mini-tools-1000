import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface Problem {
  num1: number
  num2: number
  operator: string
  answer: number
  options: number[]
}

export default function SpeedMath() {
  const { t } = useTranslation()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isPlaying, setIsPlaying] = useState(false)
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const generateProblem = (): Problem => {
    const operators = ['+', '-', '×']
    const op = operators[Math.floor(Math.random() * operators.length)]

    let num1: number, num2: number, answer: number

    switch (op) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1
        num2 = Math.floor(Math.random() * 50) + 1
        answer = num1 + num2
        break
      case '-':
        num1 = Math.floor(Math.random() * 50) + 20
        num2 = Math.floor(Math.random() * Math.min(num1, 30)) + 1
        answer = num1 - num2
        break
      case '×':
        num1 = Math.floor(Math.random() * 12) + 1
        num2 = Math.floor(Math.random() * 12) + 1
        answer = num1 * num2
        break
      default:
        num1 = 1
        num2 = 1
        answer = 2
    }

    // Generate wrong options
    const options = [answer]
    while (options.length < 4) {
      const offset = Math.floor(Math.random() * 20) - 10
      const wrongAnswer = answer + offset
      if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
        options.push(wrongAnswer)
      }
    }

    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[options[i], options[j]] = [options[j], options[i]]
    }

    return { num1, num2, operator: op, answer, options }
  }

  const startGame = () => {
    setScore(0)
    setStreak(0)
    setTimeLeft(60)
    setQuestionsAnswered(0)
    setCorrectAnswers(0)
    setIsPlaying(true)
    setProblem(generateProblem())
    setResult(null)

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
    setIsPlaying(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const handleAnswer = (selectedAnswer: number) => {
    if (!problem || !isPlaying) return

    setQuestionsAnswered(prev => prev + 1)

    if (selectedAnswer === problem.answer) {
      setResult('correct')
      setScore(prev => prev + 10 + streak * 2)
      setStreak(prev => prev + 1)
      setCorrectAnswers(prev => prev + 1)
    } else {
      setResult('wrong')
      setStreak(0)
    }

    setTimeout(() => {
      setResult(null)
      setProblem(generateProblem())
    }, 300)
  }

  const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-slate-500">{t('tools.speedMath.score')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{streak}🔥</div>
            <div className="text-sm text-slate-500">{t('tools.speedMath.streak')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{accuracy}%</div>
            <div className="text-sm text-slate-500">{t('tools.speedMath.accuracy')}</div>
          </div>
          <div className="p-3 bg-orange-50 rounded">
            <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-orange-600'}`}>
              {timeLeft}s
            </div>
            <div className="text-sm text-slate-500">{t('tools.speedMath.time')}</div>
          </div>
        </div>
      </div>

      <div className={`card p-6 text-center ${
        result === 'correct' ? 'bg-green-50' :
        result === 'wrong' ? 'bg-red-50' : ''
      }`}>
        {!isPlaying && timeLeft === 60 && (
          <>
            <div className="text-6xl mb-4">⚡</div>
            <h2 className="text-xl font-bold mb-2">{t('tools.speedMath.title')}</h2>
            <p className="text-slate-500 mb-4">{t('tools.speedMath.description')}</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
            >
              {t('tools.speedMath.startGame')}
            </button>
          </>
        )}

        {isPlaying && problem && (
          <>
            <div className="text-5xl font-bold mb-6 font-mono">
              {problem.num1} {problem.operator} {problem.num2} = ?
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
              {problem.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(option)}
                  className="py-4 text-2xl font-bold bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}

        {!isPlaying && timeLeft === 0 && (
          <div className="py-4">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold mb-2">{t('tools.speedMath.timeUp')}</h2>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-4">
              <div>
                <div className="text-2xl font-bold text-blue-600">{score}</div>
                <div className="text-sm text-slate-500">{t('tools.speedMath.score')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{correctAnswers}/{questionsAnswered}</div>
                <div className="text-sm text-slate-500">{t('tools.speedMath.correct')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{accuracy}%</div>
                <div className="text-sm text-slate-500">{t('tools.speedMath.accuracy')}</div>
              </div>
            </div>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
            >
              {t('tools.speedMath.playAgain')}
            </button>
          </div>
        )}
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.speedMath.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.speedMath.tip1')}</li>
          <li>• {t('tools.speedMath.tip2')}</li>
          <li>• {t('tools.speedMath.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
