import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Cell {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  adjacentMines: number
}

export default function Minesweeper() {
  const { t } = useTranslation()
  const [board, setBoard] = useState<Cell[][]>([])
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [flagCount, setFlagCount] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [firstClick, setFirstClick] = useState(true)

  const difficulties = {
    easy: { rows: 8, cols: 8, mines: 10 },
    medium: { rows: 12, cols: 12, mines: 30 },
    hard: { rows: 16, cols: 16, mines: 55 },
  }

  const initBoard = () => {
    const { rows, cols } = difficulties[difficulty]
    const newBoard: Cell[][] = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
      }))
    )
    setBoard(newBoard)
    setGameState('playing')
    setFlagCount(0)
    setStartTime(null)
    setElapsedTime(0)
    setFirstClick(true)
  }

  const placeMines = (firstRow: number, firstCol: number) => {
    const { rows, cols, mines } = difficulties[difficulty]
    const newBoard = board.map(row => row.map(cell => ({ ...cell })))
    let placed = 0

    while (placed < mines) {
      const row = Math.floor(Math.random() * rows)
      const col = Math.floor(Math.random() * cols)

      // Don't place mine on first click or adjacent cells
      const isNearFirst = Math.abs(row - firstRow) <= 1 && Math.abs(col - firstCol) <= 1

      if (!newBoard[row][col].isMine && !isNearFirst) {
        newBoard[row][col].isMine = true
        placed++
      }
    }

    // Calculate adjacent mines
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newBoard[r][c].isMine) {
          let count = 0
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr
              const nc = c + dc
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].isMine) {
                count++
              }
            }
          }
          newBoard[r][c].adjacentMines = count
        }
      }
    }

    setBoard(newBoard)
    return newBoard
  }

  const revealCell = (row: number, col: number, currentBoard?: Cell[][]) => {
    const boardToUse = currentBoard || board
    const { rows, cols } = difficulties[difficulty]
    const newBoard = boardToUse.map(r => r.map(c => ({ ...c })))

    if (newBoard[row][col].isRevealed || newBoard[row][col].isFlagged) return newBoard

    newBoard[row][col].isRevealed = true

    if (newBoard[row][col].isMine) {
      // Game over - reveal all mines
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (newBoard[r][c].isMine) {
            newBoard[r][c].isRevealed = true
          }
        }
      }
      setBoard(newBoard)
      setGameState('lost')
      return newBoard
    }

    // Flood fill for empty cells
    if (newBoard[row][col].adjacentMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = row + dr
          const nc = col + dc
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !newBoard[nr][nc].isRevealed) {
            const revealed = revealCell(nr, nc, newBoard)
            for (let r = 0; r < rows; r++) {
              for (let c = 0; c < cols; c++) {
                if (revealed[r][c].isRevealed) newBoard[r][c].isRevealed = true
              }
            }
          }
        }
      }
    }

    setBoard(newBoard)

    // Check win
    const unrevealedNonMines = newBoard.flat().filter(c => !c.isMine && !c.isRevealed).length
    if (unrevealedNonMines === 0) {
      setGameState('won')
    }

    return newBoard
  }

  const handleClick = (row: number, col: number) => {
    if (gameState !== 'playing') return

    if (firstClick) {
      setFirstClick(false)
      setStartTime(Date.now())
      const newBoard = placeMines(row, col)
      revealCell(row, col, newBoard)
    } else {
      revealCell(row, col)
    }
  }

  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault()
    if (gameState !== 'playing' || board[row][col].isRevealed) return

    const newBoard = board.map(r => r.map(c => ({ ...c })))
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged
    setBoard(newBoard)
    setFlagCount(newBoard.flat().filter(c => c.isFlagged).length)
  }

  useEffect(() => {
    initBoard()
  }, [difficulty])

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (startTime && gameState === 'playing') {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [startTime, gameState])

  const { mines } = difficulties[difficulty]
  const minesLeft = mines - flagCount

  const getCellColor = (cell: Cell) => {
    const colors: Record<number, string> = {
      1: 'text-blue-600',
      2: 'text-green-600',
      3: 'text-red-600',
      4: 'text-purple-600',
      5: 'text-yellow-700',
      6: 'text-cyan-600',
      7: 'text-pink-600',
      8: 'text-slate-600',
    }
    return colors[cell.adjacentMines] || ''
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          {(['easy', 'medium', 'hard'] as const).map(level => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`flex-1 py-2 rounded capitalize ${
                difficulty === level ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {t(`tools.minesweeper.${level}`)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-red-50 rounded">
            <div className="text-2xl font-bold text-red-600">💣 {minesLeft}</div>
            <div className="text-sm text-slate-500">{t('tools.minesweeper.mines')}</div>
          </div>
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl">
              {gameState === 'playing' ? '😊' : gameState === 'won' ? '😎' : '😵'}
            </div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">⏱️ {elapsedTime}</div>
            <div className="text-sm text-slate-500">{t('tools.minesweeper.time')}</div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="overflow-auto flex justify-center">
          <div className="inline-block">
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((cell, colIndex) => (
                  <button
                    key={colIndex}
                    onClick={() => handleClick(rowIndex, colIndex)}
                    onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                    disabled={cell.isRevealed && !cell.isMine}
                    className={`w-7 h-7 text-sm font-bold flex items-center justify-center border border-slate-300 ${
                      cell.isRevealed
                        ? cell.isMine
                          ? 'bg-red-500'
                          : 'bg-slate-100'
                        : 'bg-slate-300 hover:bg-slate-400'
                    } ${getCellColor(cell)}`}
                  >
                    {cell.isRevealed
                      ? cell.isMine
                        ? '💣'
                        : cell.adjacentMines > 0
                          ? cell.adjacentMines
                          : ''
                      : cell.isFlagged
                        ? '🚩'
                        : ''
                    }
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {gameState !== 'playing' && (
          <div className={`mt-4 p-4 rounded-lg text-center ${
            gameState === 'won' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <div className="text-2xl mb-2">{gameState === 'won' ? '🎉' : '💥'}</div>
            <div className="font-bold">
              {gameState === 'won'
                ? t('tools.minesweeper.youWon', { time: elapsedTime })
                : t('tools.minesweeper.gameOver')
              }
            </div>
            <button
              onClick={initBoard}
              className="mt-3 px-6 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
            >
              {t('tools.minesweeper.playAgain')}
            </button>
          </div>
        )}
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.minesweeper.howToPlay')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.minesweeper.instruction1')}</li>
          <li>• {t('tools.minesweeper.instruction2')}</li>
          <li>• {t('tools.minesweeper.instruction3')}</li>
        </ul>
      </div>
    </div>
  )
}
