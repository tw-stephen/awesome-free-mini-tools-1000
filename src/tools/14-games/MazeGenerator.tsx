import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

interface Cell {
  x: number
  y: number
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean }
  visited: boolean
}

export default function MazeGenerator() {
  const { t } = useTranslation()
  const [maze, setMaze] = useState<Cell[][]>([])
  const [size, setSize] = useState(15)
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 })
  const [moves, setMoves] = useState(0)
  const [solved, setSolved] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  const generateMaze = useCallback(() => {
    // Initialize grid
    const grid: Cell[][] = []
    for (let y = 0; y < size; y++) {
      grid[y] = []
      for (let x = 0; x < size; x++) {
        grid[y][x] = {
          x, y,
          walls: { top: true, right: true, bottom: true, left: true },
          visited: false,
        }
      }
    }

    // DFS maze generation
    const stack: Cell[] = []
    const startCell = grid[0][0]
    startCell.visited = true
    stack.push(startCell)

    while (stack.length > 0) {
      const current = stack[stack.length - 1]
      const neighbors = getUnvisitedNeighbors(grid, current)

      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)]
        removeWall(current, next)
        next.visited = true
        stack.push(next)
      } else {
        stack.pop()
      }
    }

    setMaze(grid)
    setPlayerPos({ x: 0, y: 0 })
    setMoves(0)
    setSolved(false)
    setStartTime(Date.now())
    setElapsedTime(0)
  }, [size])

  const getUnvisitedNeighbors = (grid: Cell[][], cell: Cell): Cell[] => {
    const neighbors: Cell[] = []
    const { x, y } = cell

    if (y > 0 && !grid[y - 1][x].visited) neighbors.push(grid[y - 1][x])
    if (x < size - 1 && !grid[y][x + 1].visited) neighbors.push(grid[y][x + 1])
    if (y < size - 1 && !grid[y + 1][x].visited) neighbors.push(grid[y + 1][x])
    if (x > 0 && !grid[y][x - 1].visited) neighbors.push(grid[y][x - 1])

    return neighbors
  }

  const removeWall = (a: Cell, b: Cell) => {
    const dx = b.x - a.x
    const dy = b.y - a.y

    if (dx === 1) {
      a.walls.right = false
      b.walls.left = false
    } else if (dx === -1) {
      a.walls.left = false
      b.walls.right = false
    } else if (dy === 1) {
      a.walls.bottom = false
      b.walls.top = false
    } else if (dy === -1) {
      a.walls.top = false
      b.walls.bottom = false
    }
  }

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (solved || maze.length === 0) return

    const { x, y } = playerPos
    const cell = maze[y][x]

    // Check walls
    if (dx === 1 && cell.walls.right) return
    if (dx === -1 && cell.walls.left) return
    if (dy === 1 && cell.walls.bottom) return
    if (dy === -1 && cell.walls.top) return

    const newX = x + dx
    const newY = y + dy

    if (newX >= 0 && newX < size && newY >= 0 && newY < size) {
      setPlayerPos({ x: newX, y: newY })
      setMoves(m => m + 1)

      // Check win
      if (newX === size - 1 && newY === size - 1) {
        setSolved(true)
      }
    }
  }, [playerPos, maze, size, solved])

  useEffect(() => {
    generateMaze()
  }, [size, generateMaze])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          e.preventDefault()
          movePlayer(0, -1)
          break
        case 'ArrowDown':
        case 's':
          e.preventDefault()
          movePlayer(0, 1)
          break
        case 'ArrowLeft':
        case 'a':
          e.preventDefault()
          movePlayer(-1, 0)
          break
        case 'ArrowRight':
        case 'd':
          e.preventDefault()
          movePlayer(1, 0)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [movePlayer])

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (startTime && !solved) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [startTime, solved])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const cellSize = Math.min(20, 400 / size)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              {t('tools.mazeGenerator.mazeSize')}
            </label>
            <select
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              <option value={10}>10×10 (Easy)</option>
              <option value={15}>15×15 (Medium)</option>
              <option value={20}>20×20 (Hard)</option>
              <option value={25}>25×25 (Expert)</option>
            </select>
          </div>
          <button
            onClick={generateMaze}
            className="px-6 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            {t('tools.mazeGenerator.newMaze')}
          </button>
        </div>
      </div>

      <div className="card p-4">
        <div className="grid grid-cols-2 gap-4 text-center mb-4">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{moves}</div>
            <div className="text-sm text-slate-500">{t('tools.mazeGenerator.moves')}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{formatTime(elapsedTime)}</div>
            <div className="text-sm text-slate-500">{t('tools.mazeGenerator.time')}</div>
          </div>
        </div>

        <div className="overflow-auto flex justify-center">
          <div
            className="border-2 border-slate-800"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
            }}
          >
            {maze.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    borderTop: cell.walls.top ? '1px solid #1e293b' : 'none',
                    borderRight: cell.walls.right ? '1px solid #1e293b' : 'none',
                    borderBottom: cell.walls.bottom ? '1px solid #1e293b' : 'none',
                    borderLeft: cell.walls.left ? '1px solid #1e293b' : 'none',
                  }}
                  className={`flex items-center justify-center text-xs ${
                    playerPos.x === x && playerPos.y === y
                      ? 'bg-blue-500'
                      : x === 0 && y === 0
                        ? 'bg-green-200'
                        : x === size - 1 && y === size - 1
                          ? 'bg-red-200'
                          : ''
                  }`}
                >
                  {playerPos.x === x && playerPos.y === y && '🏃'}
                  {x === size - 1 && y === size - 1 && playerPos.x !== x && '🏁'}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          <button onClick={() => movePlayer(0, -1)} className="w-12 h-12 bg-slate-100 rounded hover:bg-slate-200">↑</button>
        </div>
        <div className="flex justify-center gap-2 mt-1">
          <button onClick={() => movePlayer(-1, 0)} className="w-12 h-12 bg-slate-100 rounded hover:bg-slate-200">←</button>
          <button onClick={() => movePlayer(0, 1)} className="w-12 h-12 bg-slate-100 rounded hover:bg-slate-200">↓</button>
          <button onClick={() => movePlayer(1, 0)} className="w-12 h-12 bg-slate-100 rounded hover:bg-slate-200">→</button>
        </div>
      </div>

      {solved && (
        <div className="card p-6 bg-green-50 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-xl font-bold text-green-700 mb-2">
            {t('tools.mazeGenerator.congratulations')}
          </h3>
          <p className="text-green-600">
            {t('tools.mazeGenerator.escaped', { moves, time: formatTime(elapsedTime) })}
          </p>
          <button
            onClick={generateMaze}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600"
          >
            {t('tools.mazeGenerator.newMaze')}
          </button>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.mazeGenerator.controls')}</h4>
        <p className="text-sm text-slate-600">
          {t('tools.mazeGenerator.controlsDescription')}
        </p>
      </div>
    </div>
  )
}
