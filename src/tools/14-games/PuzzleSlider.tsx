import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function PuzzleSlider() {
  const { t } = useTranslation()
  const [tiles, setTiles] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gridSize, setGridSize] = useState(3)
  const [isSolved, setIsSolved] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  const initPuzzle = () => {
    const totalTiles = gridSize * gridSize
    let newTiles: number[]

    // Generate solvable puzzle
    do {
      newTiles = Array.from({ length: totalTiles - 1 }, (_, i) => i + 1)
      newTiles.push(0) // Empty tile

      // Shuffle
      for (let i = newTiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]]
      }
    } while (!isSolvable(newTiles) || checkSolved(newTiles))

    setTiles(newTiles)
    setMoves(0)
    setIsSolved(false)
    setStartTime(Date.now())
    setElapsedTime(0)
  }

  const isSolvable = (tiles: number[]): boolean => {
    let inversions = 0
    const flatTiles = tiles.filter(t => t !== 0)

    for (let i = 0; i < flatTiles.length; i++) {
      for (let j = i + 1; j < flatTiles.length; j++) {
        if (flatTiles[i] > flatTiles[j]) inversions++
      }
    }

    if (gridSize % 2 === 1) {
      return inversions % 2 === 0
    } else {
      const emptyRow = Math.floor(tiles.indexOf(0) / gridSize)
      return (inversions + emptyRow) % 2 === 1
    }
  }

  const checkSolved = (tiles: number[]): boolean => {
    for (let i = 0; i < tiles.length - 1; i++) {
      if (tiles[i] !== i + 1) return false
    }
    return tiles[tiles.length - 1] === 0
  }

  const moveTile = (index: number) => {
    if (isSolved) return

    const emptyIndex = tiles.indexOf(0)
    const row = Math.floor(index / gridSize)
    const col = index % gridSize
    const emptyRow = Math.floor(emptyIndex / gridSize)
    const emptyCol = emptyIndex % gridSize

    // Check if adjacent to empty
    const isAdjacent =
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)

    if (isAdjacent) {
      const newTiles = [...tiles]
      ;[newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]]
      setTiles(newTiles)
      setMoves(moves + 1)

      if (checkSolved(newTiles)) {
        setIsSolved(true)
      }
    }
  }

  useEffect(() => {
    initPuzzle()
  }, [gridSize])

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (startTime && !isSolved) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [startTime, isSolved])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              {t('tools.puzzleSlider.gridSize')}
            </label>
            <select
              value={gridSize}
              onChange={(e) => setGridSize(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              <option value={3}>3×3 (Easy)</option>
              <option value={4}>4×4 (Medium)</option>
              <option value={5}>5×5 (Hard)</option>
            </select>
          </div>
          <button
            onClick={initPuzzle}
            className="px-6 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            {t('tools.puzzleSlider.newPuzzle')}
          </button>
        </div>
      </div>

      <div className="card p-4">
        <div className="grid grid-cols-2 gap-4 text-center mb-4">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{moves}</div>
            <div className="text-sm text-slate-500">{t('tools.puzzleSlider.moves')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{formatTime(elapsedTime)}</div>
            <div className="text-sm text-slate-500">{t('tools.puzzleSlider.time')}</div>
          </div>
        </div>

        <div
          className="grid gap-1 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            maxWidth: gridSize * 80,
          }}
        >
          {tiles.map((tile, index) => (
            <button
              key={index}
              onClick={() => moveTile(index)}
              disabled={tile === 0}
              className={`aspect-square text-2xl font-bold rounded-lg transition-all ${
                tile === 0
                  ? 'bg-slate-100'
                  : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
              }`}
              style={{ minHeight: 60 }}
            >
              {tile !== 0 && tile}
            </button>
          ))}
        </div>
      </div>

      {isSolved && (
        <div className="card p-6 bg-green-50 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-xl font-bold text-green-700 mb-2">
            {t('tools.puzzleSlider.congratulations')}
          </h3>
          <p className="text-green-600">
            {t('tools.puzzleSlider.solved', { moves, time: formatTime(elapsedTime) })}
          </p>
          <button
            onClick={initPuzzle}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600"
          >
            {t('tools.puzzleSlider.playAgain')}
          </button>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.puzzleSlider.howToPlay')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.puzzleSlider.instruction1')}</li>
          <li>• {t('tools.puzzleSlider.instruction2')}</li>
          <li>• {t('tools.puzzleSlider.instruction3')}</li>
        </ul>
      </div>
    </div>
  )
}
