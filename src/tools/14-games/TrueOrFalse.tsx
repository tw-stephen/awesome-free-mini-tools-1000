import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Question {
  statement: string
  isTrue: boolean
  explanation: string
}

export default function TrueOrFalse() {
  const { t } = useTranslation()
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [questionsAsked, setQuestionsAsked] = useState(0)
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [usedQuestions, setUsedQuestions] = useState<number[]>([])
  const [totalQuestions] = useState(10)

  const questions: Question[] = [
    { statement: 'The Great Wall of China is visible from space.', isTrue: false, explanation: 'This is a common myth. The wall is too narrow to be visible from space with the naked eye.' },
    { statement: 'Honey never spoils.', isTrue: true, explanation: 'Honey has natural preservatives and has been found edible in ancient Egyptian tombs.' },
    { statement: 'Lightning never strikes the same place twice.', isTrue: false, explanation: 'Lightning can and often does strike the same place multiple times.' },
    { statement: 'Humans use only 10% of their brain.', isTrue: false, explanation: 'Brain scans show that we use virtually every part of our brain.' },
    { statement: 'Octopuses have three hearts.', isTrue: true, explanation: 'Two pump blood to the gills, while one pumps it to the rest of the body.' },
    { statement: 'Venus is the hottest planet in our solar system.', isTrue: true, explanation: 'Despite Mercury being closer to the Sun, Venus is hotter due to its thick atmosphere.' },
    { statement: 'Goldfish have a 3-second memory.', isTrue: false, explanation: 'Goldfish can remember things for months, not seconds.' },
    { statement: 'Bananas grow on trees.', isTrue: false, explanation: 'Bananas grow on large herbaceous plants, not trees.' },
    { statement: 'An ostrich\'s eye is bigger than its brain.', isTrue: true, explanation: 'Their eyes are about 2 inches across, larger than their brain.' },
    { statement: 'Hot water freezes faster than cold water.', isTrue: true, explanation: 'This is called the Mpemba effect, though the exact reasons are still debated.' },
    { statement: 'The tongue has different taste zones.', isTrue: false, explanation: 'All areas of the tongue can detect all tastes.' },
    { statement: 'Sound travels faster in water than in air.', isTrue: true, explanation: 'Sound travels about 4 times faster in water than in air.' },
    { statement: 'Diamonds are made from compressed coal.', isTrue: false, explanation: 'Diamonds form from carbon deep in the Earth, not from coal.' },
    { statement: 'A duck\'s quack doesn\'t echo.', isTrue: false, explanation: 'A duck\'s quack does echo, like any other sound.' },
    { statement: 'Humans have more than 5 senses.', isTrue: true, explanation: 'We also have senses for balance, temperature, pain, and more.' },
  ]

  const startGame = () => {
    setScore(0)
    setStreak(0)
    setQuestionsAsked(0)
    setGameOver(false)
    setUsedQuestions([])
    nextQuestion([])
  }

  const nextQuestion = (used: number[]) => {
    const availableIndices = questions
      .map((_, i) => i)
      .filter(i => !used.includes(i))

    if (availableIndices.length === 0 || used.length >= totalQuestions) {
      setGameOver(true)
      return
    }

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
    setCurrentQuestion(questions[randomIndex])
    setUsedQuestions([...used, randomIndex])
    setResult(null)
  }

  const handleAnswer = (answer: boolean) => {
    if (result || !currentQuestion) return

    setQuestionsAsked(prev => prev + 1)

    if (answer === currentQuestion.isTrue) {
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
        nextQuestion(usedQuestions)
      }
    }, 2500)
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
            <div className="text-sm text-slate-500">{t('tools.trueOrFalse.score')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{streak}🔥</div>
            <div className="text-sm text-slate-500">{t('tools.trueOrFalse.streak')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{questionsAsked}/{totalQuestions}</div>
            <div className="text-sm text-slate-500">{t('tools.trueOrFalse.progress')}</div>
          </div>
        </div>
      </div>

      <div className="card p-6 text-center">
        {!gameOver ? (
          <>
            <p className="text-sm text-slate-500 mb-4">{t('tools.trueOrFalse.isThisTrue')}</p>
            <div className="text-xl font-medium text-slate-800 mb-6 min-h-[60px]">
              "{currentQuestion?.statement}"
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <button
                onClick={() => handleAnswer(true)}
                disabled={!!result}
                className={`py-4 px-6 rounded-lg font-bold text-xl transition-all ${
                  result
                    ? currentQuestion?.isTrue
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-100'
                    : 'bg-green-100 hover:bg-green-200 text-green-700'
                }`}
              >
                ✓ {t('tools.trueOrFalse.true')}
              </button>
              <button
                onClick={() => handleAnswer(false)}
                disabled={!!result}
                className={`py-4 px-6 rounded-lg font-bold text-xl transition-all ${
                  result
                    ? !currentQuestion?.isTrue
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-100'
                    : 'bg-red-100 hover:bg-red-200 text-red-700'
                }`}
              >
                ✗ {t('tools.trueOrFalse.false')}
              </button>
            </div>

            {result && currentQuestion && (
              <div className={`mt-4 p-4 rounded-lg ${
                result === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                <div className="font-bold mb-1">
                  {result === 'correct' ? '✓ ' + t('tools.trueOrFalse.correct') : '✗ ' + t('tools.trueOrFalse.wrong')}
                </div>
                <div className="text-sm">{currentQuestion.explanation}</div>
              </div>
            )}
          </>
        ) : (
          <div className="py-4">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold mb-2">{t('tools.trueOrFalse.gameComplete')}</h2>
            <div className="text-4xl font-bold text-blue-600 mb-4">{score} {t('tools.trueOrFalse.points')}</div>
            <p className="text-slate-600 mb-4">
              {t('tools.trueOrFalse.gotCorrect', {
                correct: Math.round(score / 10),
                total: totalQuestions
              })}
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
            >
              {t('tools.trueOrFalse.playAgain')}
            </button>
          </div>
        )}
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.trueOrFalse.howToPlay')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.trueOrFalse.instruction1')}</li>
          <li>• {t('tools.trueOrFalse.instruction2')}</li>
          <li>• {t('tools.trueOrFalse.instruction3')}</li>
        </ul>
      </div>
    </div>
  )
}
