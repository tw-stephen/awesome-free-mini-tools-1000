import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Puzzle {
  question: string
  answer: string
  hint: string
  category: string
}

export default function BrainTeaser() {
  const { t } = useTranslation()
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null)
  const [input, setInput] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [solved, setSolved] = useState(0)
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)

  const puzzles: Puzzle[] = [
    { question: 'I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?', answer: 'echo', hint: 'You might hear me in a canyon', category: 'Riddle' },
    { question: 'What has keys but no locks, space but no room, and you can enter but cannot go inside?', answer: 'keyboard', hint: 'You use it every day with your computer', category: 'Riddle' },
    { question: 'The more you take, the more you leave behind. What am I?', answer: 'footsteps', hint: 'Look behind you when you walk', category: 'Riddle' },
    { question: 'What can travel around the world while staying in a corner?', answer: 'stamp', hint: 'Found on letters and postcards', category: 'Riddle' },
    { question: 'I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?', answer: 'map', hint: 'Used for navigation', category: 'Riddle' },
    { question: 'What gets wetter the more it dries?', answer: 'towel', hint: 'Used after a shower', category: 'Riddle' },
    { question: 'What can you break without touching it?', answer: 'promise', hint: 'It involves trust', category: 'Riddle' },
    { question: 'What has a head and a tail but no body?', answer: 'coin', hint: 'Used for buying things', category: 'Riddle' },
    { question: 'What building has the most stories?', answer: 'library', hint: 'It\'s full of books', category: 'Wordplay' },
    { question: 'What has hands but cannot clap?', answer: 'clock', hint: 'Tells you the time', category: 'Riddle' },
    { question: 'What can run but never walks, has a mouth but never talks?', answer: 'river', hint: 'Found in nature, flows to the sea', category: 'Riddle' },
    { question: 'What has an eye but cannot see?', answer: 'needle', hint: 'Used in sewing', category: 'Riddle' },
    { question: 'What word becomes shorter when you add two letters to it?', answer: 'short', hint: 'Think about the word itself', category: 'Wordplay' },
    { question: 'What starts with T, ends with T, and has T in it?', answer: 'teapot', hint: 'Used for making a hot beverage', category: 'Wordplay' },
    { question: 'Forward I am heavy, but backward I am not. What am I?', answer: 'ton', hint: 'A unit of weight', category: 'Wordplay' },
  ]

  const getNewPuzzle = () => {
    const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)]
    setCurrentPuzzle(randomPuzzle)
    setInput('')
    setShowHint(false)
    setShowAnswer(false)
    setResult(null)
  }

  useEffect(() => {
    getNewPuzzle()
  }, [])

  const checkAnswer = () => {
    if (!currentPuzzle || !input.trim()) return

    const userAnswer = input.toLowerCase().trim()
    const correctAnswer = currentPuzzle.answer.toLowerCase()

    if (userAnswer === correctAnswer || userAnswer.includes(correctAnswer) || correctAnswer.includes(userAnswer)) {
      setResult('correct')
      setScore(prev => prev + (showHint ? 5 : 10))
      setSolved(prev => prev + 1)
    } else {
      setResult('wrong')
    }
  }

  const revealAnswer = () => {
    setShowAnswer(true)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer()
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-slate-500">{t('tools.brainTeaser.score')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{solved}</div>
            <div className="text-sm text-slate-500">{t('tools.brainTeaser.solved')}</div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        {currentPuzzle && (
          <>
            <div className="text-center mb-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                {currentPuzzle.category}
              </span>
            </div>
            <div className="text-xl text-center font-medium text-slate-800 mb-6 min-h-[80px]">
              🤔 {currentPuzzle.question}
            </div>

            {showHint && !showAnswer && (
              <div className="mb-4 p-3 bg-yellow-50 rounded-lg text-center text-yellow-700">
                💡 {t('tools.brainTeaser.hint')}: {currentPuzzle.hint}
              </div>
            )}

            {showAnswer && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg text-center">
                <span className="text-sm text-slate-500">{t('tools.brainTeaser.theAnswer')}:</span>
                <div className="text-xl font-bold text-blue-600">{currentPuzzle.answer.toUpperCase()}</div>
              </div>
            )}

            {result === 'correct' && (
              <div className="mb-4 p-3 bg-green-100 rounded-lg text-center text-green-700 font-medium">
                🎉 {t('tools.brainTeaser.correct')}! +{showHint ? 5 : 10} {t('tools.brainTeaser.points')}
              </div>
            )}

            {result === 'wrong' && (
              <div className="mb-4 p-3 bg-red-100 rounded-lg text-center text-red-700">
                ❌ {t('tools.brainTeaser.tryAgain')}
              </div>
            )}

            {!showAnswer && result !== 'correct' && (
              <>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('tools.brainTeaser.typeAnswer')}
                    className="flex-1 px-4 py-3 border border-slate-300 rounded text-center"
                  />
                  <button
                    onClick={checkAnswer}
                    className="px-6 py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
                  >
                    {t('tools.brainTeaser.check')}
                  </button>
                </div>

                <div className="flex gap-2 justify-center">
                  {!showHint && (
                    <button
                      onClick={() => setShowHint(true)}
                      className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200"
                    >
                      💡 {t('tools.brainTeaser.getHint')}
                    </button>
                  )}
                  <button
                    onClick={revealAnswer}
                    className="px-4 py-2 bg-slate-100 rounded text-sm hover:bg-slate-200"
                  >
                    👁️ {t('tools.brainTeaser.showAnswer')}
                  </button>
                </div>
              </>
            )}

            {(showAnswer || result === 'correct') && (
              <div className="text-center">
                <button
                  onClick={getNewPuzzle}
                  className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
                >
                  {t('tools.brainTeaser.nextPuzzle')}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.brainTeaser.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.brainTeaser.tip1')}</li>
          <li>• {t('tools.brainTeaser.tip2')}</li>
          <li>• {t('tools.brainTeaser.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
