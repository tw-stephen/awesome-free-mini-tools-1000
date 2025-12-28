import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type Cell = number | null
type Grid = Cell[][]

export default function SudokuGenerator() {
  const { t } = useTranslation()
  const [grid, setGrid] = useState<Grid>([])
  const [solution, setSolution] = useState<Grid>([])
  const [userGrid, setUserGrid] = useState<Grid>([])
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)
  const [errors, setErrors] = useState<Set<string>>(new Set())
  const [showSolution, setShowSolution] = useState(false)

  const generateSudoku = () => {
    // Generate a solved sudoku
    const solved = createSolvedGrid()
    setSolution(solved)

    // Remove cells based on difficulty
    const cellsToRemove = { easy: 30, medium: 45, hard: 55 }[difficulty]
    const puzzle = JSON.parse(JSON.stringify(solved)) as Grid

    let removed = 0
    while (removed < cellsToRemove) {
      const row = Math.floor(Math.random() * 9)
      const col = Math.floor(Math.random() * 9)
      if (puzzle[row][col] !== null) {
        puzzle[row][col] = null
        removed++
      }
    }

    setGrid(JSON.parse(JSON.stringify(puzzle)))
    setUserGrid(JSON.parse(JSON.stringify(puzzle)))
    setErrors(new Set())
    setShowSolution(false)
  }

  const createSolvedGrid = (): Grid => {
    const grid: Grid = Array.from({ length: 9 }, () => Array(9).fill(null))
    solveSudoku(grid)
    return grid
  }

  const solveSudoku = (grid: Grid): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null) {
          const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9])
          for (const num of numbers) {
            if (isValid(grid, row, col, num)) {
              grid[row][col] = num
              if (solveSudoku(grid)) return true
              grid[row][col] = null
            }
          }
          return false
        }
      }
    }
    return true
  }

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const isValid = (grid: Grid, row: number, col: number, num: number): boolean => {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num) return false
    }
    // Check column
    for (let i = 0; i < 9; i++) {
      if (grid[i][col] === num) return false
    }
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3
    const boxCol = Math.floor(col / 3) * 3
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[boxRow + i][boxCol + j] === num) return false
      }
    }
    return true
  }

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col] === null) {
      setSelectedCell([row, col])
    }
  }

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return
    const [row, col] = selectedCell
    if (grid[row][col] !== null) return

    const newUserGrid = JSON.parse(JSON.stringify(userGrid))
    newUserGrid[row][col] = num === 0 ? null : num
    setUserGrid(newUserGrid)

    // Check for errors
    const newErrors = new Set<string>()
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (newUserGrid[r][c] !== null && newUserGrid[r][c] !== solution[r][c]) {
          newErrors.add(`${r}-${c}`)
        }
      }
    }
    setErrors(newErrors)
  }

  const isComplete = () => {
    if (userGrid.length === 0) return false
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (userGrid[i][j] !== solution[i][j]) return false
      }
    }
    return true
  }

  useEffect(() => {
    generateSudoku()
  }, [])

  const getFilledCount = () => {
    let count = 0
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (userGrid[i]?.[j] !== null) count++
      }
    }
    return count
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              {t('tools.sudokuGenerator.difficulty')}
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              <option value="easy">{t('tools.sudokuGenerator.easy')}</option>
              <option value="medium">{t('tools.sudokuGenerator.medium')}</option>
              <option value="hard">{t('tools.sudokuGenerator.hard')}</option>
            </select>
          </div>
          <button
            onClick={generateSudoku}
            className="px-6 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 self-end"
          >
            {t('tools.sudokuGenerator.newPuzzle')}
          </button>
        </div>
      </div>

      {userGrid.length > 0 && (
        <>
          <div className="card p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">{t('tools.sudokuGenerator.puzzle')}</h3>
              <span className="text-sm text-slate-500">
                {getFilledCount()}/81 {t('tools.sudokuGenerator.filled')}
              </span>
            </div>

            <div className="grid grid-cols-9 gap-0 max-w-sm mx-auto border-2 border-slate-800">
              {userGrid.map((row, i) =>
                row.map((cell, j) => (
                  <button
                    key={`${i}-${j}`}
                    onClick={() => handleCellClick(i, j)}
                    className={`
                      w-9 h-9 flex items-center justify-center text-lg font-mono
                      border border-slate-300
                      ${j % 3 === 2 && j !== 8 ? 'border-r-2 border-r-slate-800' : ''}
                      ${i % 3 === 2 && i !== 8 ? 'border-b-2 border-b-slate-800' : ''}
                      ${grid[i][j] !== null ? 'bg-slate-100 font-bold' : 'bg-white'}
                      ${selectedCell?.[0] === i && selectedCell?.[1] === j ? 'bg-blue-100' : ''}
                      ${errors.has(`${i}-${j}`) ? 'bg-red-100 text-red-600' : ''}
                      ${showSolution && grid[i][j] === null ? 'text-green-600' : ''}
                    `}
                  >
                    {showSolution ? solution[i][j] : cell}
                  </button>
                ))
              )}
            </div>

            <div className="flex justify-center gap-2 mt-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  onClick={() => handleNumberInput(num)}
                  className="w-9 h-9 bg-slate-100 rounded font-bold hover:bg-slate-200"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => handleNumberInput(0)}
                className="w-9 h-9 bg-red-100 text-red-600 rounded font-bold hover:bg-red-200"
              >
                ✕
              </button>
            </div>

            <div className="flex justify-center gap-2 mt-3">
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="px-4 py-2 bg-slate-100 rounded text-sm hover:bg-slate-200"
              >
                {showSolution ? t('tools.sudokuGenerator.hideSolution') : t('tools.sudokuGenerator.showSolution')}
              </button>
            </div>
          </div>

          {isComplete() && (
            <div className="card p-4 bg-green-50 text-center">
              <span className="text-2xl">🎉</span>
              <h3 className="font-bold text-green-700 text-lg">
                {t('tools.sudokuGenerator.congratulations')}
              </h3>
              <p className="text-green-600">{t('tools.sudokuGenerator.puzzleSolved')}</p>
            </div>
          )}
        </>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.sudokuGenerator.rules')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.sudokuGenerator.rule1')}</li>
          <li>• {t('tools.sudokuGenerator.rule2')}</li>
          <li>• {t('tools.sudokuGenerator.rule3')}</li>
        </ul>
      </div>
    </div>
  )
}
