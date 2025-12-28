import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Country {
  name: string
  capital: string
}

export default function CapitalQuiz() {
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
    { name: 'France', capital: 'Paris' },
    { name: 'Germany', capital: 'Berlin' },
    { name: 'Italy', capital: 'Rome' },
    { name: 'Spain', capital: 'Madrid' },
    { name: 'United Kingdom', capital: 'London' },
    { name: 'Japan', capital: 'Tokyo' },
    { name: 'China', capital: 'Beijing' },
    { name: 'Australia', capital: 'Canberra' },
    { name: 'Canada', capital: 'Ottawa' },
    { name: 'Brazil', capital: 'Brasília' },
    { name: 'India', capital: 'New Delhi' },
    { name: 'Russia', capital: 'Moscow' },
    { name: 'South Korea', capital: 'Seoul' },
    { name: 'Mexico', capital: 'Mexico City' },
    { name: 'Egypt', capital: 'Cairo' },
    { name: 'Thailand', capital: 'Bangkok' },
    { name: 'Turkey', capital: 'Ankara' },
    { name: 'Greece', capital: 'Athens' },
    { name: 'Poland', capital: 'Warsaw' },
    { name: 'Netherlands', capital: 'Amsterdam' },
    { name: 'Sweden', capital: 'Stockholm' },
    { name: 'Norway', capital: 'Oslo' },
    { name: 'Denmark', capital: 'Copenhagen' },
    { name: 'Finland', capital: 'Helsinki' },
    { name: 'Portugal', capital: 'Lisbon' },
    { name: 'Austria', capital: 'Vienna' },
    { name: 'Switzerland', capital: 'Bern' },
    { name: 'Ireland', capital: 'Dublin' },
    { name: 'Argentina', capital: 'Buenos Aires' },
    { name: 'Chile', capital: 'Santiago' },
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
      if (randomWrong.capital !== randomCountry.capital && !wrongOptions.includes(randomWrong.capital)) {
        wrongOptions.push(randomWrong.capital)
      }
    }

    // Shuffle options
    const allOptions = [randomCountry.capital, ...wrongOptions]
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

    if (answer === currentCountry?.capital) {
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
            <div className="text-sm text-slate-500">{t('tools.capitalQuiz.score')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{streak}🔥</div>
            <div className="text-sm text-slate-500">{t('tools.capitalQuiz.streak')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{questionsAsked}/{totalQuestions}</div>
            <div className="text-sm text-slate-500">{t('tools.capitalQuiz.progress')}</div>
          </div>
        </div>
      </div>

      <div className="card p-6 text-center">
        {!gameOver ? (
          <>
            <p className="text-sm text-slate-500 mb-2">{t('tools.capitalQuiz.whatCapital')}</p>
            <div className="text-4xl font-bold text-blue-600 mb-6">{currentCountry?.name}</div>

            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              {options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(option)}
                  disabled={!!result}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    result
                      ? option === currentCountry?.capital
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
                  ? t('tools.capitalQuiz.correct')
                  : t('tools.capitalQuiz.wrongAnswer', { answer: currentCountry?.capital })
                }
              </div>
            )}
          </>
        ) : (
          <div className="py-4">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold mb-2">{t('tools.capitalQuiz.quizComplete')}</h2>
            <div className="text-4xl font-bold text-blue-600 mb-4">{score} {t('tools.capitalQuiz.points')}</div>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
            >
              {t('tools.capitalQuiz.playAgain')}
            </button>
          </div>
        )}
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.capitalQuiz.learnMore')}</h4>
        <p className="text-sm text-slate-600">
          {t('tools.capitalQuiz.learnMoreText')}
        </p>
      </div>
    </div>
  )
}
