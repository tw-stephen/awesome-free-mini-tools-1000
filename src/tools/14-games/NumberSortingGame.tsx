import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type SortOrder = 'ascending' | 'descending'
type Difficulty = 'easy' | 'medium' | 'hard'

export default function NumberSortingGame() {
  const { t } = useTranslation()
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [sortOrder, setSortOrder] = useState<SortOrder>('ascending')
  const [numbers, setNumbers] = useState<number[]>([])
  const [userOrder, setUserOrder] = useState<number[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [bestTime, setBestTime] = useState<Record<string, number>>({})

  const difficultySettings = {
    easy: { count: 5, maxNum: 20 },
    medium: { count: 7, maxNum: 50 },
    hard: { count: 10, maxNum: 100 }
  }

  const generateNumbers = () => {
    const settings = difficultySettings[difficulty]
    const nums: number[] = []
    while (nums.length < settings.count) {
      const num = Math.floor(Math.random() * settings.maxNum) + 1
      if (!nums.includes(num)) {
        nums.push(num)
      }
    }
    return nums
  }

  const startGame = () => {
    const nums = generateNumbers()
    setNumbers(nums)
    setUserOrder([])
    setIsPlaying(true)
    setStartTime(Date.now())
    setElapsedTime(0)
    setFeedback(null)
    setSortOrder(Math.random() > 0.5 ? 'ascending' : 'descending')
  }

  useEffect(() => {
    let interval: number
    if (isPlaying && startTime) {
      interval = window.setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isPlaying, startTime])

  const handleNumberClick = (num: number) => {
    if (!isPlaying || userOrder.includes(num)) return

    const newOrder = [...userOrder, num]
    setUserOrder(newOrder)

    // Check if this selection is correct
    const sortedNumbers = [...numbers].sort((a, b) =>
      sortOrder === 'ascending' ? a - b : b - a
    )

    const expectedNumber = sortedNumbers[newOrder.length - 1]
    if (num !== expectedNumber) {
      setFeedback('wrong')
      setStreak(0)
      setTimeout(() => {
        setUserOrder([])
        setFeedback(null)
      }, 1000)
      return
    }

    // Check if completed
    if (newOrder.length === numbers.length) {
      setFeedback('correct')
      setIsPlaying(false)

      const timeElapsed = (Date.now() - (startTime || 0)) / 1000
      const points = Math.max(10, Math.floor(100 - timeElapsed * 2)) + streak * 5
      setScore(prev => prev + points)
      setStreak(prev => prev + 1)

      const key = `${difficulty}-${sortOrder}`
      const currentBest = bestTime[key] || Infinity
      if (timeElapsed < currentBest) {
        setBestTime(prev => ({ ...prev, [key]: timeElapsed }))
      }
    }
  }

  const formatTime = (seconds: number): string => {
    return `${seconds.toFixed(1)}s`
  }

  const sortedNumbers = [...numbers].sort((a, b) =>
    sortOrder === 'ascending' ? a - b : b - a
  )

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
              {t(`tools.numberSortingGame.${d}`)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-slate-500">{t('tools.numberSortingGame.score')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{streak}</div>
            <div className="text-sm text-slate-500">{t('tools.numberSortingGame.streak')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{formatTime(elapsedTime)}</div>
            <div className="text-sm text-slate-500">{t('tools.numberSortingGame.time')}</div>
          </div>
        </div>
      </div>

      {isPlaying || feedback ? (
        <div className={`card p-6 ${
          feedback === 'correct' ? 'bg-green-50' : feedback === 'wrong' ? 'bg-red-50' : ''
        }`}>
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium">
              {sortOrder === 'ascending'
                ? t('tools.numberSortingGame.sortAscending')
                : t('tools.numberSortingGame.sortDescending')}
            </h3>
            <p className="text-sm text-slate-500">
              {sortOrder === 'ascending'
                ? t('tools.numberSortingGame.smallToLarge')
                : t('tools.numberSortingGame.largeToSmall')}
            </p>
          </div>

          {/* Selected numbers */}
          <div className="flex justify-center gap-2 mb-4 min-h-[48px] flex-wrap">
            {userOrder.map((num, index) => (
              <div
                key={index}
                className="w-12 h-12 bg-green-500 text-white rounded-lg text-xl font-bold flex items-center justify-center"
              >
                {num}
              </div>
            ))}
            {userOrder.length < numbers.length && (
              <div className="w-12 h-12 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400">
                ?
              </div>
            )}
          </div>

          {/* Available numbers */}
          <div className="flex flex-wrap justify-center gap-2">
            {numbers.map(num => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                disabled={userOrder.includes(num) || feedback !== null}
                className={`w-14 h-14 rounded-lg text-xl font-bold transition-all ${
                  userOrder.includes(num)
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {feedback === 'correct' && (
            <div className="text-center mt-4">
              <div className="text-green-600 font-bold text-lg mb-2">
                {t('tools.numberSortingGame.correct')}
              </div>
              <button
                onClick={startGame}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {t('tools.numberSortingGame.nextRound')}
              </button>
            </div>
          )}

          {feedback === 'wrong' && (
            <div className="text-center mt-4 text-red-600 font-bold text-lg">
              {t('tools.numberSortingGame.wrong')}
            </div>
          )}
        </div>
      ) : (
        <div className="card p-6 text-center">
          <div className="text-6xl mb-4">🔢</div>
          <h3 className="text-lg font-medium mb-2">{t('tools.numberSortingGame.title')}</h3>
          <p className="text-slate-500 mb-4">{t('tools.numberSortingGame.instructions')}</p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            {t('tools.numberSortingGame.start')}
          </button>
        </div>
      )}

      {feedback === 'correct' && (
        <div className="card p-4 bg-blue-50">
          <h4 className="font-medium mb-2">{t('tools.numberSortingGame.correctOrder')}</h4>
          <div className="flex gap-2 flex-wrap">
            {sortedNumbers.map((num, index) => (
              <span key={index} className="px-3 py-1 bg-white rounded font-mono">
                {num}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.numberSortingGame.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>* {t('tools.numberSortingGame.tip1')}</li>
          <li>* {t('tools.numberSortingGame.tip2')}</li>
          <li>* {t('tools.numberSortingGame.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
