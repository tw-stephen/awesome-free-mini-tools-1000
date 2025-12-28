import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export default function Game2048() {
  const { t } = useTranslation()
  const [board, setBoard] = useState<number[][]>([])
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)

  const initBoard = useCallback(() => {
    const newBoard = Array.from({ length: 4 }, () => Array(4).fill(0))
    addRandomTile(newBoard)
    addRandomTile(newBoard)
    setBoard(newBoard)
    setScore(0)
    setGameOver(false)
    setWon(false)
  }, [])

  useEffect(() => {
    initBoard()
  }, [initBoard])

  const addRandomTile = (board: number[][]) => {
    const emptyCells: [number, number][] = []
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) emptyCells.push([i, j])
      }
    }
    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      board[row][col] = Math.random() < 0.9 ? 2 : 4
    }
  }

  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return

    const newBoard = board.map(row => [...row])
    let moved = false
    let addedScore = 0

    const moveRow = (row: number[]) => {
      // Remove zeros
      const filtered = row.filter(x => x !== 0)

      // Merge adjacent equal tiles
      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2
          addedScore += filtered[i]
          if (filtered[i] === 2048 && !won) setWon(true)
          filtered.splice(i + 1, 1)
        }
      }

      // Pad with zeros
      while (filtered.length < 4) filtered.push(0)
      return filtered
    }

    const transpose = (board: number[][]) => {
      return board[0].map((_, i) => board.map(row => row[i]))
    }

    const reverse = (board: number[][]) => {
      return board.map(row => [...row].reverse())
    }

    let processed = newBoard

    switch (direction) {
      case 'left':
        processed = processed.map(moveRow)
        break
      case 'right':
        processed = reverse(processed.map(row => moveRow([...row].reverse())))
        break
      case 'up':
        processed = transpose(transpose(processed).map(moveRow))
        break
      case 'down':
        processed = transpose(reverse(transpose(processed).map(row => moveRow([...row].reverse()))))
        break
    }

    // Check if moved
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] !== processed[i][j]) moved = true
      }
    }

    if (moved) {
      addRandomTile(processed)
      setBoard(processed)
      const newScore = score + addedScore
      setScore(newScore)
      if (newScore > bestScore) setBestScore(newScore)

      // Check game over
      if (!canMove(processed)) {
        setGameOver(true)
      }
    }
  }, [board, score, bestScore, gameOver, won])

  const canMove = (board: number[][]) => {
    // Check for empty cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) return true
      }
    }
    // Check for possible merges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (j < 3 && board[i][j] === board[i][j + 1]) return true
        if (i < 3 && board[i][j] === board[i + 1][j]) return true
      }
    }
    return false
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          e.preventDefault()
          move('up')
          break
        case 'ArrowDown':
        case 's':
          e.preventDefault()
          move('down')
          break
        case 'ArrowLeft':
        case 'a':
          e.preventDefault()
          move('left')
          break
        case 'ArrowRight':
        case 'd':
          e.preventDefault()
          move('right')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [move])

  const getTileColor = (value: number) => {
    const colors: Record<number, string> = {
      0: 'bg-slate-200',
      2: 'bg-slate-100 text-slate-700',
      4: 'bg-slate-200 text-slate-700',
      8: 'bg-orange-300 text-white',
      16: 'bg-orange-400 text-white',
      32: 'bg-orange-500 text-white',
      64: 'bg-orange-600 text-white',
      128: 'bg-yellow-400 text-white',
      256: 'bg-yellow-500 text-white',
      512: 'bg-yellow-600 text-white',
      1024: 'bg-yellow-700 text-white',
      2048: 'bg-yellow-800 text-white',
    }
    return colors[value] || 'bg-black text-white'
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-2 gap-4 text-center mb-4">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-slate-500">{t('tools.game2048.score')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{bestScore}</div>
            <div className="text-sm text-slate-500">{t('tools.game2048.best')}</div>
          </div>
        </div>

        <button
          onClick={initBoard}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          {t('tools.game2048.newGame')}
        </button>
      </div>

      <div className="card p-4">
        <div className="bg-slate-300 p-2 rounded-lg max-w-xs mx-auto">
          <div className="grid grid-cols-4 gap-2">
            {board.flat().map((value, index) => (
              <div
                key={index}
                className={`aspect-square flex items-center justify-center rounded font-bold text-lg transition-all ${getTileColor(value)}`}
              >
                {value !== 0 && value}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          <button onClick={() => move('up')} className="w-12 h-12 bg-slate-100 rounded hover:bg-slate-200">↑</button>
        </div>
        <div className="flex justify-center gap-2 mt-1">
          <button onClick={() => move('left')} className="w-12 h-12 bg-slate-100 rounded hover:bg-slate-200">←</button>
          <button onClick={() => move('down')} className="w-12 h-12 bg-slate-100 rounded hover:bg-slate-200">↓</button>
          <button onClick={() => move('right')} className="w-12 h-12 bg-slate-100 rounded hover:bg-slate-200">→</button>
        </div>

        {won && !gameOver && (
          <div className="mt-4 p-4 bg-yellow-100 rounded-lg text-center">
            <div className="text-2xl mb-2">🎉</div>
            <div className="font-bold text-yellow-700">{t('tools.game2048.youWon')}</div>
            <p className="text-sm text-yellow-600">{t('tools.game2048.keepPlaying')}</p>
          </div>
        )}

        {gameOver && (
          <div className="mt-4 p-4 bg-red-100 rounded-lg text-center">
            <div className="text-2xl mb-2">😔</div>
            <div className="font-bold text-red-700">{t('tools.game2048.gameOver')}</div>
            <p className="text-sm text-red-600">{t('tools.game2048.finalScore', { score })}</p>
            <button
              onClick={initBoard}
              className="mt-3 px-6 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
            >
              {t('tools.game2048.tryAgain')}
            </button>
          </div>
        )}
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.game2048.howToPlay')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.game2048.instruction1')}</li>
          <li>• {t('tools.game2048.instruction2')}</li>
          <li>• {t('tools.game2048.instruction3')}</li>
        </ul>
      </div>
    </div>
  )
}
