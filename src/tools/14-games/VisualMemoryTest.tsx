import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export default function VisualMemoryTest() {
  const { t } = useTranslation()
  const [level, setLevel] = useState(1)
  const [gridSize, setGridSize] = useState(3)
  const [pattern, setPattern] = useState<boolean[][]>([])
  const [userClicks, setUserClicks] = useState<Set<string>>(new Set())
  const [showPattern, setShowPattern] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [lives, setLives] = useState(3)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [requiredCells, setRequiredCells] = useState(0)
  const [correctClicks, setCorrectClicks] = useState(0)
  const [wrongClick, setWrongClick] = useState<string | null>(null)

  const generatePattern = useCallback((lvl: number) => {
    const size = Math.min(3 + Math.floor(lvl / 4), 6)
    setGridSize(size)

    const cellCount = Math.min(lvl + 2, Math.floor(size * size * 0.6))
    setRequiredCells(cellCount)

    const grid: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false))

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
  }, [])

  const startGame = () => {
    setLevel(1)
    setLives(3)
    setScore(0)
    setIsPlaying(true)
    startRound(1)
  }

  const startRound = (lvl: number) => {
    const newPattern = generatePattern(lvl)
    setPattern(newPattern)
    setUserClicks(new Set())
    setCorrectClicks(0)
    setWrongClick(null)
    setShowPattern(true)

    // Display time decreases as level increases
    const displayTime = Math.max(500, 2000 - lvl * 100)

    setTimeout(() => {
      setShowPattern(false)
    }, displayTime)
  }

  const handleCellClick = (row: number, col: number) => {
    if (showPattern || !isPlaying) return

    const key = `${row}-${col}`
    if (userClicks.has(key)) return

    const newClicks = new Set(userClicks)
    newClicks.add(key)
    setUserClicks(newClicks)

    if (pattern[row][col]) {
      // Correct click
      const newCorrectClicks = correctClicks + 1
      setCorrectClicks(newCorrectClicks)

      if (newCorrectClicks === requiredCells) {
        // Level complete
        const points = level * 10
        setScore(prev => prev + points)
        if (score + points > highScore) {
          setHighScore(score + points)
        }

        setTimeout(() => {
          const newLevel = level + 1
          setLevel(newLevel)
          startRound(newLevel)
        }, 500)
      }
    } else {
      // Wrong click
      setWrongClick(key)
      const newLives = lives - 1
      setLives(newLives)

      if (newLives === 0) {
        // Game over
        setIsPlaying(false)
        if (score > highScore) {
          setHighScore(score)
        }
      } else {
        // Show pattern again and restart level
        setTimeout(() => {
          setWrongClick(null)
          startRound(level)
        }, 1000)
      }
    }
  }

  const getCellClass = (row: number, col: number): string => {
    const key = `${row}-${col}`
    const isPatternCell = pattern[row][col]
    const isClicked = userClicks.has(key)
    const isWrong = wrongClick === key

    if (showPattern && isPatternCell) {
      return 'bg-blue-500'
    }

    if (isWrong) {
      return 'bg-red-500'
    }

    if (isClicked && isPatternCell) {
      return 'bg-green-500'
    }

    if (isClicked) {
      return 'bg-red-200'
    }

    return 'bg-slate-200 hover:bg-slate-300 cursor-pointer'
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="p-2 bg-blue-50 rounded">
            <div className="text-xl font-bold text-blue-600">{level}</div>
            <div className="text-xs text-slate-500">{t('tools.visualMemoryTest.level')}</div>
          </div>
          <div className="p-2 bg-green-50 rounded">
            <div className="text-xl font-bold text-green-600">{score}</div>
            <div className="text-xs text-slate-500">{t('tools.visualMemoryTest.score')}</div>
          </div>
          <div className="p-2 bg-red-50 rounded">
            <div className="text-xl font-bold text-red-600">{'❤️'.repeat(lives)}</div>
            <div className="text-xs text-slate-500">{t('tools.visualMemoryTest.lives')}</div>
          </div>
          <div className="p-2 bg-purple-50 rounded">
            <div className="text-xl font-bold text-purple-600">{highScore}</div>
            <div className="text-xs text-slate-500">{t('tools.visualMemoryTest.best')}</div>
          </div>
        </div>
      </div>

      {isPlaying && pattern.length > 0 ? (
        <div className="card p-6">
          {showPattern && (
            <div className="text-center mb-4 text-blue-600 font-medium">
              {t('tools.visualMemoryTest.memorize')}
            </div>
          )}

          {!showPattern && (
            <div className="text-center mb-4 text-slate-600">
              {t('tools.visualMemoryTest.clickCells', { count: requiredCells - correctClicks })}
            </div>
          )}

          <div
            className="grid gap-2 max-w-md mx-auto"
            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
          >
            {pattern.map((row, rowIndex) =>
              row.map((_, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  disabled={showPattern}
                  className={`aspect-square rounded-lg transition-all ${getCellClass(rowIndex, colIndex)}`}
                />
              ))
            )}
          </div>

          {/* Progress indicator */}
          {!showPattern && (
            <div className="mt-4">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${(correctClicks / requiredCells) * 100}%` }}
                />
              </div>
              <div className="text-center text-sm text-slate-500 mt-1">
                {correctClicks} / {requiredCells}
              </div>
            </div>
          )}
        </div>
      ) : !isPlaying && lives === 0 ? (
        <div className="card p-6 text-center">
          <div className="text-4xl mb-4">
            {level >= 15 ? '🏆' : level >= 10 ? '🎉' : level >= 5 ? '👍' : '💪'}
          </div>
          <h3 className="text-xl font-bold mb-2">{t('tools.visualMemoryTest.gameOver')}</h3>
          <p className="text-slate-600 mb-2">
            {t('tools.visualMemoryTest.reachedLevel', { level })}
          </p>
          <p className="text-2xl font-bold text-blue-600 mb-4">{score} {t('tools.visualMemoryTest.points')}</p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            {t('tools.visualMemoryTest.playAgain')}
          </button>
        </div>
      ) : (
        <div className="card p-6 text-center">
          <div className="text-6xl mb-4">🧠</div>
          <h3 className="text-lg font-medium mb-2">{t('tools.visualMemoryTest.title')}</h3>
          <p className="text-slate-500 mb-4">{t('tools.visualMemoryTest.instructions')}</p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            {t('tools.visualMemoryTest.start')}
          </button>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.visualMemoryTest.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>* {t('tools.visualMemoryTest.tip1')}</li>
          <li>* {t('tools.visualMemoryTest.tip2')}</li>
          <li>* {t('tools.visualMemoryTest.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
