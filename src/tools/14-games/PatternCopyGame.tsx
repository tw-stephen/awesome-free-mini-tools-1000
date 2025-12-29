import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

const COLORS = ['#EF4444', '#3B82F6', '#22C55E', '#EAB308', '#A855F7', '#EC4899']

interface Cell {
  color: string
  active: boolean
}

export default function PatternCopyGame() {
  const { t } = useTranslation()
  const [gridSize, setGridSize] = useState(3)
  const [pattern, setPattern] = useState<boolean[][]>([])
  const [userPattern, setUserPattern] = useState<boolean[][]>([])
  const [showPattern, setShowPattern] = useState(false)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [patternColor] = useState(COLORS[Math.floor(Math.random() * COLORS.length)])
  const [displayTime, setDisplayTime] = useState(3)

  const createEmptyGrid = (size: number): boolean[][] => {
    return Array(size).fill(null).map(() => Array(size).fill(false))
  }

  const generatePattern = useCallback((lvl: number): boolean[][] => {
    const size = gridSize
    const grid = createEmptyGrid(size)
    const cellCount = Math.min(lvl + 2, size * size - 1)

    let filled = 0
    while (filled < cellCount) {
      const row = Math.floor(Math.random() * size)
      const col = Math.floor(Math.random() * size)
      if (!grid[row][col]) {
        grid[row][col] = true
        filled++
      }
    }

    return grid
  }, [gridSize])

  const startGame = () => {
    setLevel(1)
    setScore(0)
    setIsPlaying(true)
    startRound(1)
  }

  const startRound = (lvl: number) => {
    const newPattern = generatePattern(lvl)
    setPattern(newPattern)
    setUserPattern(createEmptyGrid(gridSize))
    setShowPattern(true)
    setFeedback(null)

    // Calculate display time based on level
    const time = Math.max(1, 4 - Math.floor(lvl / 3))
    setDisplayTime(time)

    setTimeout(() => {
      setShowPattern(false)
    }, time * 1000)
  }

  const handleCellClick = (row: number, col: number) => {
    if (showPattern || !isPlaying) return

    setUserPattern(prev => {
      const newGrid = prev.map(r => [...r])
      newGrid[row][col] = !newGrid[row][col]
      return newGrid
    })
  }

  const checkPattern = () => {
    if (showPattern || !isPlaying) return

    let correct = true
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (pattern[i][j] !== userPattern[i][j]) {
          correct = false
          break
        }
      }
      if (!correct) break
    }

    if (correct) {
      setFeedback('correct')
      const points = level * 10 + displayTime * 5
      setScore(prev => prev + points)

      setTimeout(() => {
        const newLevel = level + 1
        setLevel(newLevel)
        startRound(newLevel)
      }, 1000)
    } else {
      setFeedback('wrong')
      setIsPlaying(false)
      if (score > highScore) {
        setHighScore(score)
      }
    }
  }

  const clearUserPattern = () => {
    setUserPattern(createEmptyGrid(gridSize))
  }

  useEffect(() => {
    setPattern([])
    setUserPattern([])
    setIsPlaying(false)
  }, [gridSize])

  const patternCellCount = pattern.flat().filter(Boolean).length
  const userCellCount = userPattern.flat().filter(Boolean).length

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          {[3, 4, 5].map(size => (
            <button
              key={size}
              onClick={() => setGridSize(size)}
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
            <div className="text-sm text-slate-500">{t('tools.patternCopyGame.level')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{score}</div>
            <div className="text-sm text-slate-500">{t('tools.patternCopyGame.score')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{highScore}</div>
            <div className="text-sm text-slate-500">{t('tools.patternCopyGame.best')}</div>
          </div>
        </div>
      </div>

      {isPlaying && pattern.length > 0 ? (
        <div className={`card p-6 ${
          feedback === 'correct' ? 'bg-green-50' : feedback === 'wrong' ? 'bg-red-50' : ''
        }`}>
          {showPattern && (
            <div className="text-center mb-4 text-blue-600 font-medium">
              {t('tools.patternCopyGame.memorize')} ({displayTime}s)
            </div>
          )}

          <div
            className="grid gap-2 max-w-xs mx-auto mb-4"
            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
          >
            {(showPattern ? pattern : userPattern).map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  disabled={showPattern}
                  className={`aspect-square rounded-lg transition-all ${
                    cell
                      ? `scale-100`
                      : 'bg-slate-200 hover:bg-slate-300'
                  } ${showPattern ? 'cursor-default' : 'cursor-pointer'}`}
                  style={{
                    backgroundColor: cell ? patternColor : undefined
                  }}
                />
              ))
            )}
          </div>

          {!showPattern && feedback !== 'wrong' && (
            <>
              <div className="text-center text-sm text-slate-500 mb-4">
                {t('tools.patternCopyGame.cellsSelected', { selected: userCellCount, total: patternCellCount })}
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={clearUserPattern}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
                >
                  {t('tools.patternCopyGame.clear')}
                </button>
                <button
                  onClick={checkPattern}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {t('tools.patternCopyGame.check')}
                </button>
              </div>
            </>
          )}

          {feedback === 'correct' && (
            <div className="text-center text-green-600 font-bold text-lg">
              {t('tools.patternCopyGame.correct')}
            </div>
          )}

          {feedback === 'wrong' && (
            <div className="text-center">
              <div className="text-red-600 font-bold text-lg mb-4">
                {t('tools.patternCopyGame.wrong')}
              </div>
              <button
                onClick={startGame}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {t('tools.patternCopyGame.tryAgain')}
              </button>
            </div>
          )}
        </div>
      ) : !isPlaying && feedback === 'wrong' ? null : (
        <div className="card p-6 text-center">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-lg font-medium mb-2">{t('tools.patternCopyGame.title')}</h3>
          <p className="text-slate-500 mb-4">{t('tools.patternCopyGame.instructions')}</p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            {t('tools.patternCopyGame.start')}
          </button>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.patternCopyGame.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>* {t('tools.patternCopyGame.tip1')}</li>
          <li>* {t('tools.patternCopyGame.tip2')}</li>
          <li>* {t('tools.patternCopyGame.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
