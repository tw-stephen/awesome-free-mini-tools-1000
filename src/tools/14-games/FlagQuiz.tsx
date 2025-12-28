import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Country {
  name: string
  flag: string
}

export default function FlagQuiz() {
  const { t } = useTranslation()
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null)
  const [options, setOptions] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [questionsAsked, setQuestionsAsked] = useState(0)
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [totalQuestions] = useState(10)

  const countries: Country[] = [
    { name: 'United States', flag: '🇺🇸' },
    { name: 'United Kingdom', flag: '🇬🇧' },
    { name: 'Canada', flag: '🇨🇦' },
    { name: 'France', flag: '🇫🇷' },
    { name: 'Germany', flag: '🇩🇪' },
    { name: 'Japan', flag: '🇯🇵' },
    { name: 'China', flag: '🇨🇳' },
    { name: 'Australia', flag: '🇦🇺' },
    { name: 'Brazil', flag: '🇧🇷' },
    { name: 'Italy', flag: '🇮🇹' },
    { name: 'Spain', flag: '🇪🇸' },
    { name: 'Mexico', flag: '🇲🇽' },
    { name: 'India', flag: '🇮🇳' },
    { name: 'Russia', flag: '🇷🇺' },
    { name: 'South Korea', flag: '🇰🇷' },
    { name: 'Netherlands', flag: '🇳🇱' },
    { name: 'Sweden', flag: '🇸🇪' },
    { name: 'Switzerland', flag: '🇨🇭' },
    { name: 'Argentina', flag: '🇦🇷' },
    { name: 'Thailand', flag: '🇹🇭' },
    { name: 'Turkey', flag: '🇹🇷' },
    { name: 'Egypt', flag: '🇪🇬' },
    { name: 'Greece', flag: '🇬🇷' },
    { name: 'Portugal', flag: '🇵🇹' },
    { name: 'Poland', flag: '🇵🇱' },
    { name: 'Ireland', flag: '🇮🇪' },
    { name: 'Norway', flag: '🇳🇴' },
    { name: 'Denmark', flag: '🇩🇰' },
    { name: 'Finland', flag: '🇫🇮' },
    { name: 'New Zealand', flag: '🇳🇿' },
  ]

  const startGame = () => {
    setScore(0)
    setStreak(0)
    setQuestionsAsked(0)
    setGameOver(false)
    nextQuestion()
  }

  const nextQuestion = () => {
    const randomCountry = countries[Math.floor(Math.random() * countries.length)]
    setCurrentCountry(randomCountry)

    // Generate wrong options
    const wrongOptions: string[] = []
    while (wrongOptions.length < 3) {
      const randomWrong = countries[Math.floor(Math.random() * countries.length)]
      if (randomWrong.name !== randomCountry.name && !wrongOptions.includes(randomWrong.name)) {
        wrongOptions.push(randomWrong.name)
      }
    }

    // Shuffle options
    const allOptions = [randomCountry.name, ...wrongOptions]
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

    if (answer === currentCountry?.name) {
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
            <div className="text-sm text-slate-500">{t('tools.flagQuiz.score')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{streak}🔥</div>
            <div className="text-sm text-slate-500">{t('tools.flagQuiz.streak')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{questionsAsked}/{totalQuestions}</div>
            <div className="text-sm text-slate-500">{t('tools.flagQuiz.progress')}</div>
          </div>
        </div>
      </div>

      <div className="card p-6 text-center">
        {!gameOver ? (
          <>
            <p className="text-sm text-slate-500 mb-2">{t('tools.flagQuiz.whichCountry')}</p>
            <div className="text-8xl mb-6">{currentCountry?.flag}</div>

            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              {options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(option)}
                  disabled={!!result}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    result
                      ? option === currentCountry?.name
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
                  ? t('tools.flagQuiz.correct')
                  : t('tools.flagQuiz.wrongAnswer', { answer: currentCountry?.name })
                }
              </div>
            )}
          </>
        ) : (
          <div className="py-4">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold mb-2">{t('tools.flagQuiz.quizComplete')}</h2>
            <div className="text-4xl font-bold text-blue-600 mb-4">{score} {t('tools.flagQuiz.points')}</div>
            <p className="text-slate-600 mb-4">
              {t('tools.flagQuiz.gotCorrect', { correct: Math.round(score / 10), total: totalQuestions })}
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
            >
              {t('tools.flagQuiz.playAgain')}
            </button>
          </div>
        )}
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.flagQuiz.funFact')}</h4>
        <p className="text-sm text-slate-600">
          {t('tools.flagQuiz.funFactText')}
        </p>
      </div>
    </div>
  )
}
