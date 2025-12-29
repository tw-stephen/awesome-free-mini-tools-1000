import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export default function SequenceMemoryGame() {
  const { t } = useTranslation()
  const [gridSize, setGridSize] = useState(3)
  const [sequence, setSequence] = useState<number[]>([])
  const [playerSequence, setPlayerSequence] = useState<number[]>([])
  const [isShowingSequence, setIsShowingSequence] = useState(false)
  const [activeCell, setActiveCell] = useState<number | null>(null)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const totalCells = gridSize * gridSize

  const generateSequence = useCallback((length: number) => {
    const newSequence: number[] = []
    for (let i = 0; i < length; i++) {
      newSequence.push(Math.floor(Math.random() * totalCells))
    }
    return newSequence
  }, [totalCells])

  const showSequence = useCallback(async () => {
    setIsShowingSequence(true)
    setPlayerSequence([])

    for (let i = 0; i < sequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300))
      setActiveCell(sequence[i])
      await new Promise(resolve => setTimeout(resolve, 500))
      setActiveCell(null)
    }

    setIsShowingSequence(false)
  }, [sequence])

  const startGame = () => {
    setLevel(1)
    setScore(0)
    setGameOver(false)
    setIsPlaying(true)
    const newSequence = generateSequence(3)
    setSequence(newSequence)
  }

  const nextLevel = () => {
    const newLevel = level + 1
    setLevel(newLevel)
    const sequenceLength = 2 + newLevel
    const newSequence = generateSequence(sequenceLength)
    setSequence(newSequence)
    setPlayerSequence([])
  }

  useEffect(() => {
    if (sequence.length > 0 && isPlaying && !gameOver) {
      showSequence()
    }
  }, [sequence, isPlaying, gameOver, showSequence])

  const handleCellClick = (index: number) => {
    if (isShowingSequence || !isPlaying || gameOver) return

    setActiveCell(index)
    setTimeout(() => setActiveCell(null), 200)

    const newPlayerSequence = [...playerSequence, index]
    setPlayerSequence(newPlayerSequence)

    const currentIndex = newPlayerSequence.length - 1
    if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
      setGameOver(true)
      setIsPlaying(false)
      if (score > highScore) {
        setHighScore(score)
      }
      return
    }

    if (newPlayerSequence.length === sequence.length) {
      const points = level * 10
      setScore(prev => prev + points)
      setTimeout(nextLevel, 500)
    }
  }

  const handleGridSizeChange = (size: number) => {
    setGridSize(size)
    if (isPlaying) {
      setIsPlaying(false)
      setGameOver(false)
      setSequence([])
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          {[3, 4, 5].map(size => (
            <button
              key={size}
              onClick={() => handleGridSizeChange(size)}
              disabled={isPlaying}
              className={`flex-1 py-2 rounded ${
                gridSize === size ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {size}x{size}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{level}</div>
            <div className="text-sm text-slate-500">{t('tools.sequenceMemoryGame.level')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{score}</div>
            <div className="text-sm text-slate-500">{t('tools.sequenceMemoryGame.score')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{highScore}</div>
            <div className="text-sm text-slate-500">{t('tools.sequenceMemoryGame.highScore')}</div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div
          className="grid gap-2 max-w-xs mx-auto"
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          {Array.from({ length: totalCells }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={isShowingSequence || !isPlaying}
              className={`aspect-square rounded-lg transition-all duration-150 ${
                activeCell === index
                  ? 'bg-blue-500 scale-105'
                  : 'bg-slate-200 hover:bg-slate-300'
              } ${isShowingSequence || !isPlaying ? 'cursor-not-allowed' : ''}`}
            />
          ))}
        </div>

        {isShowingSequence && (
          <div className="text-center mt-4 text-slate-500">
            {t('tools.sequenceMemoryGame.watch')}
          </div>
        )}

        {!isShowingSequence && isPlaying && !gameOver && (
          <div className="text-center mt-4 text-slate-500">
            {t('tools.sequenceMemoryGame.yourTurn')} ({playerSequence.length}/{sequence.length})
          </div>
        )}
      </div>

      {gameOver && (
        <div className="card p-4 bg-red-50 text-center">
          <div className="text-xl font-bold text-red-600 mb-2">
            {t('tools.sequenceMemoryGame.gameOver')}
          </div>
          <p className="text-slate-600 mb-2">
            {t('tools.sequenceMemoryGame.reachedLevel', { level })}
          </p>
          <p className="text-slate-600 mb-4">
            {t('tools.sequenceMemoryGame.finalScore', { score })}
          </p>
          <button
            onClick={startGame}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('tools.sequenceMemoryGame.playAgain')}
          </button>
        </div>
      )}

      {!isPlaying && !gameOver && (
        <div className="card p-6 text-center">
          <div className="text-6xl mb-4">🧠</div>
          <h3 className="text-lg font-medium mb-2">{t('tools.sequenceMemoryGame.title')}</h3>
          <p className="text-slate-500 mb-4">{t('tools.sequenceMemoryGame.instructions')}</p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            {t('tools.sequenceMemoryGame.start')}
          </button>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.sequenceMemoryGame.howToPlay')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>* {t('tools.sequenceMemoryGame.tip1')}</li>
          <li>* {t('tools.sequenceMemoryGame.tip2')}</li>
          <li>* {t('tools.sequenceMemoryGame.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
