import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Puzzle {
  grid1: string[][]
  grid2: string[][]
  differences: [number, number][]
}

export default function SpotDifference() {
  const { t } = useTranslation()
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [foundDiffs, setFoundDiffs] = useState<Set<string>>(new Set())
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  const emojis = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍒', '🥝', '🍑', '🌟', '⭐', '🌙', '☀️', '❤️', '💙', '💚', '💛']

  const generatePuzzle = () => {
    const size = 4 + Math.floor(level / 3) // Increase size with level
    const numDifferences = 3 + Math.floor(level / 2) // More differences at higher levels

    // Create base grid
    const grid1: string[][] = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => emojis[Math.floor(Math.random() * emojis.length)])
    )

    // Copy grid
    const grid2 = grid1.map(row => [...row])

    // Create differences
    const differences: [number, number][] = []
    const used = new Set<string>()

    while (differences.length < Math.min(numDifferences, size * size / 2)) {
      const row = Math.floor(Math.random() * size)
      const col = Math.floor(Math.random() * size)
      const key = `${row}-${col}`

      if (!used.has(key)) {
        used.add(key)
        const currentEmoji = grid2[row][col]
        let newEmoji = emojis[Math.floor(Math.random() * emojis.length)]
        while (newEmoji === currentEmoji) {
          newEmoji = emojis[Math.floor(Math.random() * emojis.length)]
        }
        grid2[row][col] = newEmoji
        differences.push([row, col])
      }
    }

    setPuzzle({ grid1, grid2, differences })
    setFoundDiffs(new Set())
    setStartTime(Date.now())
    setElapsedTime(0)
  }

  useEffect(() => {
    generatePuzzle()
  }, [level])

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (startTime && puzzle && foundDiffs.size < puzzle.differences.length) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [startTime, puzzle, foundDiffs.size])

  const handleClick = (gridNum: number, row: number, col: number) => {
    if (!puzzle) return

    const key = `${row}-${col}`
    if (foundDiffs.has(key)) return

    const isDiff = puzzle.differences.some(([r, c]) => r === row && c === col)

    if (isDiff) {
      setFoundDiffs(prev => new Set([...prev, key]))
      setScore(prev => prev + 10)

      // Check if all found
      if (foundDiffs.size + 1 === puzzle.differences.length) {
        const timeBonus = Math.max(0, 100 - elapsedTime)
        setScore(prev => prev + timeBonus)
      }
    }
  }

  const nextLevel = () => {
    setLevel(prev => prev + 1)
  }

  const resetGame = () => {
    setLevel(1)
    setScore(0)
    generatePuzzle()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isComplete = puzzle ? foundDiffs.size === puzzle.differences.length : false

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{level}</div>
            <div className="text-sm text-slate-500">{t('tools.spotDifference.level')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{score}</div>
            <div className="text-sm text-slate-500">{t('tools.spotDifference.score')}</div>
          </div>
          <div className="p-3 bg-orange-50 rounded">
            <div className="text-2xl font-bold text-orange-600">
              {puzzle ? `${foundDiffs.size}/${puzzle.differences.length}` : '0/0'}
            </div>
            <div className="text-sm text-slate-500">{t('tools.spotDifference.found')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{formatTime(elapsedTime)}</div>
            <div className="text-sm text-slate-500">{t('tools.spotDifference.time')}</div>
          </div>
        </div>
      </div>

      {puzzle && (
        <div className="card p-4">
          <p className="text-center text-sm text-slate-500 mb-4">
            {t('tools.spotDifference.findDifferences', { count: puzzle.differences.length })}
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[puzzle.grid1, puzzle.grid2].map((grid, gridNum) => (
              <div key={gridNum} className="border-2 border-slate-300 rounded-lg p-2">
                <div className="text-center text-sm font-medium mb-2">
                  {gridNum === 0 ? t('tools.spotDifference.image1') : t('tools.spotDifference.image2')}
                </div>
                <div
                  className="grid gap-1"
                  style={{ gridTemplateColumns: `repeat(${grid.length}, 1fr)` }}
                >
                  {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                      const key = `${rowIndex}-${colIndex}`
                      const isFound = foundDiffs.has(key)
                      const isDiff = puzzle.differences.some(([r, c]) => r === rowIndex && c === colIndex)

                      return (
                        <button
                          key={key}
                          onClick={() => handleClick(gridNum, rowIndex, colIndex)}
                          className={`aspect-square flex items-center justify-center text-lg rounded transition-all ${
                            isFound
                              ? 'bg-green-100 ring-2 ring-green-500'
                              : 'bg-slate-50 hover:bg-slate-100'
                          }`}
                        >
                          {cell}
                        </button>
                      )
                    })
                  )}
                </div>
              </div>
            ))}
          </div>

          {isComplete && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg text-center">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-xl font-bold text-green-700 mb-2">
                {t('tools.spotDifference.levelComplete')}
              </h3>
              <p className="text-green-600">
                {t('tools.spotDifference.completedIn', { time: formatTime(elapsedTime) })}
              </p>
              <button
                onClick={nextLevel}
                className="mt-4 px-6 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600"
              >
                {t('tools.spotDifference.nextLevel')}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={generatePuzzle}
          className="flex-1 py-2 bg-slate-100 rounded hover:bg-slate-200"
        >
          {t('tools.spotDifference.newPuzzle')}
        </button>
        <button
          onClick={resetGame}
          className="flex-1 py-2 bg-slate-100 rounded hover:bg-slate-200"
        >
          {t('tools.spotDifference.resetGame')}
        </button>
      </div>
    </div>
  )
}
