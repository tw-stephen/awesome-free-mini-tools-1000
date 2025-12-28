import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Logo {
  emoji: string
  hint: string
  answer: string
  category: string
}

export default function LogoQuiz() {
  const { t } = useTranslation()
  const [currentLogo, setCurrentLogo] = useState<Logo | null>(null)
  const [options, setOptions] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [questionsAsked, setQuestionsAsked] = useState(0)
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [totalQuestions] = useState(10)

  // Using emoji combinations to represent famous brands/companies
  const logos: Logo[] = [
    { emoji: '🍎', hint: 'Technology company', answer: 'Apple', category: 'Tech' },
    { emoji: '🔍', hint: 'Search engine', answer: 'Google', category: 'Tech' },
    { emoji: '📘', hint: 'Social network', answer: 'Facebook', category: 'Social' },
    { emoji: '🐦', hint: 'Microblogging platform', answer: 'Twitter', category: 'Social' },
    { emoji: '📷', hint: 'Photo sharing app', answer: 'Instagram', category: 'Social' },
    { emoji: '🎬', hint: 'Video streaming', answer: 'Netflix', category: 'Entertainment' },
    { emoji: '🛒', hint: 'Online shopping', answer: 'Amazon', category: 'Shopping' },
    { emoji: '☕', hint: 'Coffee chain', answer: 'Starbucks', category: 'Food' },
    { emoji: '🍔', hint: 'Fast food restaurant', answer: 'McDonald\'s', category: 'Food' },
    { emoji: '👟', hint: 'Sportswear brand', answer: 'Nike', category: 'Fashion' },
    { emoji: '🚗', hint: 'Electric car company', answer: 'Tesla', category: 'Automotive' },
    { emoji: '🎮', hint: 'Gaming platform', answer: 'PlayStation', category: 'Gaming' },
    { emoji: '🎵', hint: 'Music streaming', answer: 'Spotify', category: 'Entertainment' },
    { emoji: '📦', hint: 'Video platform', answer: 'YouTube', category: 'Entertainment' },
    { emoji: '💬', hint: 'Messaging app', answer: 'WhatsApp', category: 'Social' },
    { emoji: '🏠', hint: 'Home rental platform', answer: 'Airbnb', category: 'Travel' },
    { emoji: '🚕', hint: 'Ride-sharing service', answer: 'Uber', category: 'Transport' },
    { emoji: '💼', hint: 'Professional network', answer: 'LinkedIn', category: 'Social' },
    { emoji: '🎥', hint: 'Video conferencing', answer: 'Zoom', category: 'Tech' },
    { emoji: '📱', hint: 'Korean tech giant', answer: 'Samsung', category: 'Tech' },
  ]

  const allBrands = logos.map(l => l.answer)

  const startGame = () => {
    setScore(0)
    setStreak(0)
    setQuestionsAsked(0)
    setGameOver(false)
    nextQuestion()
  }

  const nextQuestion = () => {
    const randomLogo = logos[Math.floor(Math.random() * logos.length)]
    setCurrentLogo(randomLogo)

    // Generate wrong options
    const wrongOptions: string[] = []
    while (wrongOptions.length < 3) {
      const randomWrong = allBrands[Math.floor(Math.random() * allBrands.length)]
      if (randomWrong !== randomLogo.answer && !wrongOptions.includes(randomWrong)) {
        wrongOptions.push(randomWrong)
      }
    }

    // Shuffle options
    const allOptions = [randomLogo.answer, ...wrongOptions]
    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]]
    }

    setOptions(allOptions)
    setResult(null)
    setSelectedAnswer(null)
  }

  const handleAnswer = (answer: string) => {
    if (result) return

    setSelectedAnswer(answer)
    setQuestionsAsked(prev => prev + 1)

    if (answer === currentLogo?.answer) {
      setResult('correct')
      setScore(prev => prev + 10 + streak * 2)
      setStreak(prev => prev + 1)
    } else {
      setResult('wrong')
      setStreak(0)
    }

    setTimeout(() => {
      if (questionsAsked + 1 >= totalQuestions) {
        setGameOver(true)
      } else {
        nextQuestion()
      }
    }, 1500)
  }

  useEffect(() => {
    startGame()
  }, [])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-slate-500">{t('tools.logoQuiz.score')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{streak}🔥</div>
            <div className="text-sm text-slate-500">{t('tools.logoQuiz.streak')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{questionsAsked}/{totalQuestions}</div>
            <div className="text-sm text-slate-500">{t('tools.logoQuiz.progress')}</div>
          </div>
        </div>
      </div>

      <div className="card p-6 text-center">
        {!gameOver ? (
          <>
            <p className="text-sm text-slate-500 mb-2">{t('tools.logoQuiz.guessBrand')}</p>
            <div className="text-8xl mb-2">{currentLogo?.emoji}</div>
            <div className="text-sm text-slate-400 mb-4">
              <span className="px-2 py-1 bg-slate-100 rounded">{currentLogo?.category}</span>
              <span className="mx-2">•</span>
              <span>{currentLogo?.hint}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              {options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(option)}
                  disabled={!!result}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    result
                      ? option === currentLogo?.answer
                        ? 'bg-green-500 text-white'
                        : option === selectedAnswer
                          ? 'bg-red-500 text-white'
                          : 'bg-slate-100'
                      : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {result && (
              <div className={`mt-4 p-3 rounded-lg ${
                result === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {result === 'correct'
                  ? t('tools.logoQuiz.correct')
                  : t('tools.logoQuiz.wrongAnswer', { answer: currentLogo?.answer })
                }
              </div>
            )}
          </>
        ) : (
          <div className="py-4">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold mb-2">{t('tools.logoQuiz.quizComplete')}</h2>
            <div className="text-4xl font-bold text-blue-600 mb-4">{score} {t('tools.logoQuiz.points')}</div>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
            >
              {t('tools.logoQuiz.playAgain')}
            </button>
          </div>
        )}
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.logoQuiz.howToPlay')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.logoQuiz.instruction1')}</li>
          <li>• {t('tools.logoQuiz.instruction2')}</li>
          <li>• {t('tools.logoQuiz.instruction3')}</li>
        </ul>
      </div>
    </div>
  )
}
