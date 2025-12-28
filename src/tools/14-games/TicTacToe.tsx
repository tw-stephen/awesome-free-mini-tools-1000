import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type Cell = 'X' | 'O' | null
type Board = Cell[]

export default function TicTacToe() {
  const { t } = useTranslation()
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [gameMode, setGameMode] = useState<'pvp' | 'pvc'>('pvc')
  const [score, setScore] = useState({ x: 0, o: 0, draws: 0 })
  const [winningLine, setWinningLine] = useState<number[] | null>(null)

  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6], // diagonals
  ]

  const checkWinner = (squares: Board): { winner: Cell; line: number[] } | null => {
    for (const line of lines) {
      const [a, b, c] = line
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line }
      }
    }
    return null
  }

  const isDraw = (squares: Board): boolean => {
    return squares.every(cell => cell !== null) && !checkWinner(squares)
  }

  const getComputerMove = (squares: Board): number => {
    // Try to win
    for (const line of lines) {
      const [a, b, c] = line
      const vals = [squares[a], squares[b], squares[c]]
      if (vals.filter(v => v === 'O').length === 2 && vals.includes(null)) {
        return line[vals.indexOf(null)]
      }
    }

    // Block player
    for (const line of lines) {
      const [a, b, c] = line
      const vals = [squares[a], squares[b], squares[c]]
      if (vals.filter(v => v === 'X').length === 2 && vals.includes(null)) {
        return line[vals.indexOf(null)]
      }
    }

    // Take center
    if (squares[4] === null) return 4

    // Take a corner
    const corners = [0, 2, 6, 8]
    const availableCorners = corners.filter(i => squares[i] === null)
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)]
    }

    // Take any available
    const available = squares.map((cell, i) => cell === null ? i : -1).filter(i => i !== -1)
    return available[Math.floor(Math.random() * available.length)]
  }

  const handleClick = (index: number) => {
    if (board[index] || checkWinner(board) || winningLine) return

    const newBoard = [...board]
    newBoard[index] = isXNext ? 'X' : 'O'
    setBoard(newBoard)

    const result = checkWinner(newBoard)
    if (result) {
      setWinningLine(result.line)
      setScore(prev => ({
        ...prev,
        [result.winner!.toLowerCase()]: prev[result.winner!.toLowerCase() as 'x' | 'o'] + 1
      }))
    } else if (isDraw(newBoard)) {
      setScore(prev => ({ ...prev, draws: prev.draws + 1 }))
    }

    setIsXNext(!isXNext)
  }

  // Computer move
  useEffect(() => {
    if (gameMode === 'pvc' && !isXNext && !checkWinner(board) && !isDraw(board)) {
      const timer = setTimeout(() => {
        const move = getComputerMove(board)
        if (move !== undefined) {
          handleClick(move)
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isXNext, board, gameMode])

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
    setWinningLine(null)
  }

  const resetScore = () => {
    resetGame()
    setScore({ x: 0, o: 0, draws: 0 })
  }

  const result = checkWinner(board)
  const draw = isDraw(board)
  const gameOver = result || draw

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => { setGameMode('pvc'); resetGame(); }}
            className={`flex-1 py-2 rounded ${gameMode === 'pvc' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
          >
            {t('tools.ticTacToe.vsComputer')}
          </button>
          <button
            onClick={() => { setGameMode('pvp'); resetGame(); }}
            className={`flex-1 py-2 rounded ${gameMode === 'pvp' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
          >
            {t('tools.ticTacToe.twoPlayers')}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{score.x}</div>
            <div className="text-sm text-slate-500">X {gameMode === 'pvc' ? `(${t('tools.ticTacToe.you')})` : ''}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded">
            <div className="text-2xl font-bold text-slate-600">{score.draws}</div>
            <div className="text-sm text-slate-500">{t('tools.ticTacToe.draws')}</div>
          </div>
          <div className="p-3 bg-red-50 rounded">
            <div className="text-2xl font-bold text-red-600">{score.o}</div>
            <div className="text-sm text-slate-500">O {gameMode === 'pvc' ? `(${t('tools.ticTacToe.cpu')})` : ''}</div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        {!gameOver && (
          <div className="text-center mb-4">
            <span className={`text-lg font-medium ${isXNext ? 'text-blue-600' : 'text-red-600'}`}>
              {isXNext ? 'X' : 'O'} {t('tools.ticTacToe.turn')}
              {gameMode === 'pvc' && !isXNext && ' (thinking...)'}
            </span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              disabled={!!cell || !!gameOver || (gameMode === 'pvc' && !isXNext)}
              className={`w-24 h-24 text-4xl font-bold rounded-lg border-2 transition-all
                ${cell === 'X' ? 'text-blue-600' : 'text-red-600'}
                ${winningLine?.includes(index) ? 'bg-yellow-100 border-yellow-400' : 'bg-white border-slate-300'}
                ${!cell && !gameOver ? 'hover:bg-slate-50 cursor-pointer' : ''}
              `}
            >
              {cell}
            </button>
          ))}
        </div>

        {gameOver && (
          <div className={`mt-4 p-4 rounded-lg text-center ${
            result ? (result.winner === 'X' ? 'bg-blue-100' : 'bg-red-100') : 'bg-yellow-100'
          }`}>
            <div className="text-2xl mb-2">
              {result ? (result.winner === 'X' ? '🎉' : '😢') : '🤝'}
            </div>
            <div className="text-lg font-bold">
              {result
                ? (gameMode === 'pvc'
                    ? (result.winner === 'X' ? t('tools.ticTacToe.youWin') : t('tools.ticTacToe.computerWins'))
                    : t('tools.ticTacToe.playerWins', { player: result.winner }))
                : t('tools.ticTacToe.itsDraw')
              }
            </div>
            <button
              onClick={resetGame}
              className="mt-3 px-6 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
            >
              {t('tools.ticTacToe.playAgain')}
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={resetGame}
          className="flex-1 py-2 bg-slate-100 rounded hover:bg-slate-200"
        >
          {t('tools.ticTacToe.newGame')}
        </button>
        <button
          onClick={resetScore}
          className="flex-1 py-2 bg-slate-100 rounded hover:bg-slate-200"
        >
          {t('tools.ticTacToe.resetScore')}
        </button>
      </div>
    </div>
  )
}
