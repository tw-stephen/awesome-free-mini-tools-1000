import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type Cell = null | 'red' | 'yellow'
type Board = Cell[][]

export default function ConnectFour() {
  const { t } = useTranslation()
  const ROWS = 6
  const COLS = 7
  const [board, setBoard] = useState<Board>([])
  const [currentPlayer, setCurrentPlayer] = useState<'red' | 'yellow'>('red')
  const [winner, setWinner] = useState<Cell>(null)
  const [winningCells, setWinningCells] = useState<[number, number][]>([])
  const [score, setScore] = useState({ red: 0, yellow: 0 })
  const [gameMode, setGameMode] = useState<'pvp' | 'pvc'>('pvc')
  const [isDraw, setIsDraw] = useState(false)

  const initBoard = () => {
    const newBoard: Board = Array.from({ length: ROWS }, () =>
      Array(COLS).fill(null)
    )
    setBoard(newBoard)
    setCurrentPlayer('red')
    setWinner(null)
    setWinningCells([])
    setIsDraw(false)
  }

  useEffect(() => {
    initBoard()
  }, [])

  const dropPiece = (col: number) => {
    if (winner || board[0][col] !== null) return

    const newBoard = board.map(row => [...row])
    let row = ROWS - 1
    while (row >= 0 && newBoard[row][col] !== null) {
      row--
    }
    if (row < 0) return

    newBoard[row][col] = currentPlayer
    setBoard(newBoard)

    const win = checkWin(newBoard, row, col, currentPlayer)
    if (win) {
      setWinner(currentPlayer)
      setWinningCells(win)
      setScore(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 1 }))
    } else if (newBoard[0].every(cell => cell !== null)) {
      setIsDraw(true)
    } else {
      setCurrentPlayer(currentPlayer === 'red' ? 'yellow' : 'red')
    }
  }

  const checkWin = (board: Board, row: number, col: number, player: Cell): [number, number][] | null => {
    const directions = [
      [0, 1],   // horizontal
      [1, 0],   // vertical
      [1, 1],   // diagonal down-right
      [1, -1],  // diagonal down-left
    ]

    for (const [dr, dc] of directions) {
      const cells: [number, number][] = [[row, col]]

      // Check in positive direction
      let r = row + dr
      let c = col + dc
      while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        cells.push([r, c])
        r += dr
        c += dc
      }

      // Check in negative direction
      r = row - dr
      c = col - dc
      while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        cells.push([r, c])
        r -= dr
        c -= dc
      }

      if (cells.length >= 4) {
        return cells
      }
    }

    return null
  }

  // Computer move
  useEffect(() => {
    if (gameMode === 'pvc' && currentPlayer === 'yellow' && !winner && !isDraw) {
      const timer = setTimeout(() => {
        const move = getBestMove()
        if (move !== -1) {
          dropPiece(move)
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentPlayer, gameMode, winner, isDraw])

  const getBestMove = (): number => {
    // Try to win
    for (let col = 0; col < COLS; col++) {
      const testBoard = board.map(row => [...row])
      let row = ROWS - 1
      while (row >= 0 && testBoard[row][col] !== null) row--
      if (row >= 0) {
        testBoard[row][col] = 'yellow'
        if (checkWin(testBoard, row, col, 'yellow')) return col
      }
    }

    // Block player
    for (let col = 0; col < COLS; col++) {
      const testBoard = board.map(row => [...row])
      let row = ROWS - 1
      while (row >= 0 && testBoard[row][col] !== null) row--
      if (row >= 0) {
        testBoard[row][col] = 'red'
        if (checkWin(testBoard, row, col, 'red')) return col
      }
    }

    // Prefer center column
    const centerCol = Math.floor(COLS / 2)
    if (board[0][centerCol] === null) return centerCol

    // Random valid column
    const validCols = []
    for (let col = 0; col < COLS; col++) {
      if (board[0][col] === null) validCols.push(col)
    }
    return validCols[Math.floor(Math.random() * validCols.length)] ?? -1
  }

  const isWinningCell = (row: number, col: number) => {
    return winningCells.some(([r, c]) => r === row && c === col)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => { setGameMode('pvc'); initBoard(); }}
            className={`flex-1 py-2 rounded ${gameMode === 'pvc' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
          >
            {t('tools.connectFour.vsComputer')}
          </button>
          <button
            onClick={() => { setGameMode('pvp'); initBoard(); }}
            className={`flex-1 py-2 rounded ${gameMode === 'pvp' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
          >
            {t('tools.connectFour.twoPlayers')}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className={`p-3 rounded ${currentPlayer === 'red' && !winner ? 'ring-2 ring-red-500' : ''} bg-red-50`}>
            <div className="text-2xl font-bold text-red-600">{score.red}</div>
            <div className="text-sm text-slate-500">
              🔴 {gameMode === 'pvc' ? t('tools.connectFour.you') : t('tools.connectFour.player1')}
            </div>
          </div>
          <div className={`p-3 rounded ${currentPlayer === 'yellow' && !winner ? 'ring-2 ring-yellow-500' : ''} bg-yellow-50`}>
            <div className="text-2xl font-bold text-yellow-600">{score.yellow}</div>
            <div className="text-sm text-slate-500">
              🟡 {gameMode === 'pvc' ? t('tools.connectFour.cpu') : t('tools.connectFour.player2')}
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        {!winner && !isDraw && (
          <div className="text-center mb-4">
            <span className={`text-lg font-medium ${currentPlayer === 'red' ? 'text-red-600' : 'text-yellow-600'}`}>
              {currentPlayer === 'red' ? '🔴' : '🟡'} {t('tools.connectFour.turn')}
              {gameMode === 'pvc' && currentPlayer === 'yellow' && ' (thinking...)'}
            </span>
          </div>
        )}

        <div className="flex justify-center">
          <div className="bg-blue-600 p-2 rounded-lg">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => dropPiece(colIndex)}
                    disabled={!!winner || cell !== null || isDraw || (gameMode === 'pvc' && currentPlayer === 'yellow')}
                    className={`w-10 h-10 rounded-full transition-all ${
                      cell === 'red'
                        ? 'bg-red-500'
                        : cell === 'yellow'
                          ? 'bg-yellow-400'
                          : 'bg-white hover:bg-slate-100'
                    } ${isWinningCell(rowIndex, colIndex) ? 'ring-4 ring-green-400 animate-pulse' : ''}`}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {(winner || isDraw) && (
          <div className={`mt-4 p-4 rounded-lg text-center ${
            winner === 'red' ? 'bg-red-100' : winner === 'yellow' ? 'bg-yellow-100' : 'bg-slate-100'
          }`}>
            <div className="text-2xl mb-2">
              {winner ? '🎉' : '🤝'}
            </div>
            <div className="text-lg font-bold">
              {isDraw
                ? t('tools.connectFour.draw')
                : gameMode === 'pvc'
                  ? winner === 'red' ? t('tools.connectFour.youWin') : t('tools.connectFour.cpuWins')
                  : t('tools.connectFour.playerWins', { player: winner === 'red' ? 1 : 2 })
              }
            </div>
            <button
              onClick={initBoard}
              className="mt-3 px-6 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
            >
              {t('tools.connectFour.playAgain')}
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button onClick={initBoard} className="flex-1 py-2 bg-slate-100 rounded hover:bg-slate-200">
          {t('tools.connectFour.newGame')}
        </button>
        <button
          onClick={() => setScore({ red: 0, yellow: 0 })}
          className="flex-1 py-2 bg-slate-100 rounded hover:bg-slate-200"
        >
          {t('tools.connectFour.resetScore')}
        </button>
      </div>
    </div>
  )
}
