import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Cell = number | null
type Grid = Cell[][]

const SAMPLE_PUZZLES: Grid[] = [
  [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
  ]
]

export default function SudokuValidator() {
  const { t } = useTranslation()
  const [grid, setGrid] = useState<Grid>(
    Array(9).fill(null).map(() => Array(9).fill(null))
  )
  const [errors, setErrors] = useState<Set<string>>(new Set())
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [message, setMessage] = useState('')

  const handleCellChange = (row: number, col: number, value: string) => {
    const num = parseInt(value)
    const newGrid = grid.map(r => [...r])

    if (value === '' || isNaN(num)) {
      newGrid[row][col] = null
    } else if (num >= 1 && num <= 9) {
      newGrid[row][col] = num
    }

    setGrid(newGrid)
    setIsValid(null)
    setErrors(new Set())
    setMessage('')
  }

  const validateGrid = () => {
    const newErrors = new Set<string>()
    let valid = true
    let complete = true

    // Check for empty cells
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid[i][j] === null) {
          complete = false
        }
      }
    }

    // Validate rows
    for (let row = 0; row < 9; row++) {
      const seen = new Map<number, number>()
      for (let col = 0; col < 9; col++) {
        const val = grid[row][col]
        if (val !== null) {
          if (seen.has(val)) {
            newErrors.add(`${row}-${col}`)
            newErrors.add(`${row}-${seen.get(val)}`)
            valid = false
          }
          seen.set(val, col)
        }
      }
    }

    // Validate columns
    for (let col = 0; col < 9; col++) {
      const seen = new Map<number, number>()
      for (let row = 0; row < 9; row++) {
        const val = grid[row][col]
        if (val !== null) {
          if (seen.has(val)) {
            newErrors.add(`${row}-${col}`)
            newErrors.add(`${seen.get(val)}-${col}`)
            valid = false
          }
          seen.set(val, row)
        }
      }
    }

    // Validate 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const seen = new Map<number, string>()
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const row = boxRow * 3 + i
            const col = boxCol * 3 + j
            const val = grid[row][col]
            if (val !== null) {
              if (seen.has(val)) {
                newErrors.add(`${row}-${col}`)
                newErrors.add(seen.get(val)!)
                valid = false
              }
              seen.set(val, `${row}-${col}`)
            }
          }
        }
      }
    }

    setErrors(newErrors)
    setIsValid(valid)

    if (!complete) {
      setMessage(t('tools.sudokuValidator.incomplete'))
    } else if (valid) {
      setMessage(t('tools.sudokuValidator.validComplete'))
    } else {
      setMessage(t('tools.sudokuValidator.invalid'))
    }
  }

  const clearGrid = () => {
    setGrid(Array(9).fill(null).map(() => Array(9).fill(null)))
    setErrors(new Set())
    setIsValid(null)
    setMessage('')
  }

  const loadSample = () => {
    const sample = SAMPLE_PUZZLES[Math.floor(Math.random() * SAMPLE_PUZZLES.length)]
    setGrid(sample.map(r => [...r]))
    setErrors(new Set())
    setIsValid(null)
    setMessage('')
  }

  const loadWithErrors = () => {
    const sample = SAMPLE_PUZZLES[0].map(r => [...r])
    // Introduce some errors
    sample[0][0] = 1 // Duplicate in row and column
    sample[8][8] = 1 // Duplicate in box
    setGrid(sample)
    setErrors(new Set())
    setIsValid(null)
    setMessage('')
  }

  const getCellClass = (row: number, col: number): string => {
    const key = `${row}-${col}`
    const hasError = errors.has(key)

    let classes = 'w-10 h-10 text-center text-lg font-medium border focus:outline-none focus:ring-2 focus:ring-blue-500 '

    if (hasError) {
      classes += 'bg-red-100 border-red-500 text-red-700 '
    } else if (grid[row][col] !== null) {
      classes += 'bg-blue-50 border-slate-300 '
    } else {
      classes += 'bg-white border-slate-300 '
    }

    // Add thicker borders for 3x3 boxes
    if (col % 3 === 0) classes += 'border-l-2 border-l-slate-400 '
    if (row % 3 === 0) classes += 'border-t-2 border-t-slate-400 '
    if (col === 8) classes += 'border-r-2 border-r-slate-400 '
    if (row === 8) classes += 'border-b-2 border-b-slate-400 '

    return classes
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={validateGrid}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('tools.sudokuValidator.validate')}
          </button>
          <button
            onClick={loadSample}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {t('tools.sudokuValidator.loadSample')}
          </button>
          <button
            onClick={loadWithErrors}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            {t('tools.sudokuValidator.loadWithErrors')}
          </button>
          <button
            onClick={clearGrid}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200"
          >
            {t('tools.sudokuValidator.clear')}
          </button>
        </div>
      </div>

      <div className="card p-6">
        <div className="overflow-x-auto">
          <div className="inline-block">
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((cell, colIndex) => (
                  <input
                    key={`${rowIndex}-${colIndex}`}
                    type="text"
                    maxLength={1}
                    value={cell !== null ? cell.toString() : ''}
                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                    className={getCellClass(rowIndex, colIndex)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {message && (
        <div className={`card p-4 text-center font-medium ${
          isValid === true
            ? 'bg-green-50 text-green-700'
            : isValid === false
              ? 'bg-red-50 text-red-700'
              : 'bg-yellow-50 text-yellow-700'
        }`}>
          {isValid === true && '✓ '}
          {isValid === false && '✗ '}
          {message}
        </div>
      )}

      {errors.size > 0 && (
        <div className="card p-4 bg-red-50">
          <h4 className="font-medium text-red-700 mb-2">
            {t('tools.sudokuValidator.errorsFound', { count: errors.size })}
          </h4>
          <p className="text-sm text-red-600">
            {t('tools.sudokuValidator.errorHint')}
          </p>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.sudokuValidator.rules')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>* {t('tools.sudokuValidator.rule1')}</li>
          <li>* {t('tools.sudokuValidator.rule2')}</li>
          <li>* {t('tools.sudokuValidator.rule3')}</li>
        </ul>
      </div>
    </div>
  )
}
