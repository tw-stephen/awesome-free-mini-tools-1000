import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Operation = 'add' | 'subtract' | 'multiply' | 'transpose' | 'determinant' | 'inverse' | 'scalar'

export default function MatrixCalculator() {
  const { t } = useTranslation()
  const [rowsA, setRowsA] = useState(2)
  const [colsA, setColsA] = useState(2)
  const [rowsB, setRowsB] = useState(2)
  const [colsB, setColsB] = useState(2)
  const [matrixA, setMatrixA] = useState<number[][]>([[1, 2], [3, 4]])
  const [matrixB, setMatrixB] = useState<number[][]>([[5, 6], [7, 8]])
  const [scalar, setScalar] = useState(2)
  const [result, setResult] = useState<number[][] | number | null>(null)
  const [operation, setOperation] = useState<Operation>('add')
  const [error, setError] = useState('')

  const createMatrix = (rows: number, cols: number): number[][] => {
    return Array(rows).fill(0).map(() => Array(cols).fill(0))
  }

  const resizeMatrix = (matrix: number[][], rows: number, cols: number): number[][] => {
    const newMatrix = createMatrix(rows, cols)
    for (let i = 0; i < Math.min(rows, matrix.length); i++) {
      for (let j = 0; j < Math.min(cols, matrix[0]?.length || 0); j++) {
        newMatrix[i][j] = matrix[i][j] || 0
      }
    }
    return newMatrix
  }

  const updateMatrixCell = (matrix: number[][], setMatrix: (m: number[][]) => void, row: number, col: number, value: string) => {
    const newMatrix = matrix.map(r => [...r])
    newMatrix[row][col] = parseFloat(value) || 0
    setMatrix(newMatrix)
  }

  const addMatrices = (a: number[][], b: number[][]): number[][] => {
    return a.map((row, i) => row.map((val, j) => val + b[i][j]))
  }

  const subtractMatrices = (a: number[][], b: number[][]): number[][] => {
    return a.map((row, i) => row.map((val, j) => val - b[i][j]))
  }

  const multiplyMatrices = (a: number[][], b: number[][]): number[][] => {
    const result = createMatrix(a.length, b[0].length)
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b[0].length; j++) {
        for (let k = 0; k < a[0].length; k++) {
          result[i][j] += a[i][k] * b[k][j]
        }
      }
    }
    return result
  }

  const transposeMatrix = (m: number[][]): number[][] => {
    return m[0].map((_, i) => m.map(row => row[i]))
  }

  const determinant = (m: number[][]): number => {
    const n = m.length
    if (n === 1) return m[0][0]
    if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0]

    let det = 0
    for (let j = 0; j < n; j++) {
      const subMatrix = m.slice(1).map(row => [...row.slice(0, j), ...row.slice(j + 1)])
      det += Math.pow(-1, j) * m[0][j] * determinant(subMatrix)
    }
    return det
  }

  const inverseMatrix = (m: number[][]): number[][] | null => {
    const n = m.length
    const det = determinant(m)
    if (det === 0) return null

    if (n === 2) {
      return [
        [m[1][1] / det, -m[0][1] / det],
        [-m[1][0] / det, m[0][0] / det]
      ]
    }

    // Create augmented matrix [A|I]
    const aug = m.map((row, i) => [...row, ...Array(n).fill(0).map((_, j) => i === j ? 1 : 0)])

    // Gaussian elimination
    for (let i = 0; i < n; i++) {
      // Find pivot
      let maxRow = i
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(aug[k][i]) > Math.abs(aug[maxRow][i])) {
          maxRow = k
        }
      }
      [aug[i], aug[maxRow]] = [aug[maxRow], aug[i]]

      if (Math.abs(aug[i][i]) < 1e-10) return null

      // Scale row
      const pivot = aug[i][i]
      for (let j = 0; j < 2 * n; j++) {
        aug[i][j] /= pivot
      }

      // Eliminate column
      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = aug[k][i]
          for (let j = 0; j < 2 * n; j++) {
            aug[k][j] -= factor * aug[i][j]
          }
        }
      }
    }

    return aug.map(row => row.slice(n))
  }

  const scalarMultiply = (m: number[][], s: number): number[][] => {
    return m.map(row => row.map(val => val * s))
  }

  const calculate = () => {
    setError('')
    setResult(null)

    try {
      switch (operation) {
        case 'add':
          if (rowsA !== rowsB || colsA !== colsB) {
            setError(t('tools.matrixCalculator.sizeError'))
            return
          }
          setResult(addMatrices(matrixA, matrixB))
          break
        case 'subtract':
          if (rowsA !== rowsB || colsA !== colsB) {
            setError(t('tools.matrixCalculator.sizeError'))
            return
          }
          setResult(subtractMatrices(matrixA, matrixB))
          break
        case 'multiply':
          if (colsA !== rowsB) {
            setError(t('tools.matrixCalculator.multiplyError'))
            return
          }
          setResult(multiplyMatrices(matrixA, matrixB))
          break
        case 'transpose':
          setResult(transposeMatrix(matrixA))
          break
        case 'determinant':
          if (rowsA !== colsA) {
            setError(t('tools.matrixCalculator.squareError'))
            return
          }
          setResult(determinant(matrixA))
          break
        case 'inverse':
          if (rowsA !== colsA) {
            setError(t('tools.matrixCalculator.squareError'))
            return
          }
          const inv = inverseMatrix(matrixA)
          if (!inv) {
            setError(t('tools.matrixCalculator.noInverse'))
            return
          }
          setResult(inv)
          break
        case 'scalar':
          setResult(scalarMultiply(matrixA, scalar))
          break
      }
    } catch {
      setError(t('tools.matrixCalculator.calcError'))
    }
  }

  const MatrixInput = ({ matrix, setMatrix, rows, cols, label }: {
    matrix: number[][]
    setMatrix: (m: number[][]) => void
    rows: number
    cols: number
    label: string
  }) => (
    <div className="card p-3">
      <h4 className="font-medium mb-2">{label}</h4>
      <div className="inline-block">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-1 mb-1">
            {Array.from({ length: cols }).map((_, j) => (
              <input
                key={j}
                type="number"
                value={matrix[i]?.[j] || 0}
                onChange={(e) => updateMatrixCell(matrix, setMatrix, i, j, e.target.value)}
                className="w-14 px-2 py-1 border border-slate-300 rounded text-center text-sm"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )

  const showSecondMatrix = ['add', 'subtract', 'multiply'].includes(operation)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'add', label: 'A + B' },
          { id: 'subtract', label: 'A - B' },
          { id: 'multiply', label: 'A × B' },
          { id: 'transpose', label: 'Aᵀ' },
          { id: 'determinant', label: 'det(A)' },
          { id: 'inverse', label: 'A⁻¹' },
          { id: 'scalar', label: 'k × A' },
        ].map(op => (
          <button
            key={op.id}
            onClick={() => setOperation(op.id as Operation)}
            className={`px-3 py-1.5 rounded text-sm ${
              operation === op.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            {op.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">{t('tools.matrixCalculator.matrixA')}</span>
            <input
              type="number"
              min="1"
              max="5"
              value={rowsA}
              onChange={(e) => {
                const r = Math.min(5, Math.max(1, parseInt(e.target.value) || 1))
                setRowsA(r)
                setMatrixA(resizeMatrix(matrixA, r, colsA))
              }}
              className="w-14 px-2 py-1 border border-slate-300 rounded text-center text-sm"
            />
            <span>×</span>
            <input
              type="number"
              min="1"
              max="5"
              value={colsA}
              onChange={(e) => {
                const c = Math.min(5, Math.max(1, parseInt(e.target.value) || 1))
                setColsA(c)
                setMatrixA(resizeMatrix(matrixA, rowsA, c))
              }}
              className="w-14 px-2 py-1 border border-slate-300 rounded text-center text-sm"
            />
          </div>
          <MatrixInput matrix={matrixA} setMatrix={setMatrixA} rows={rowsA} cols={colsA} label="Matrix A" />
        </div>

        {showSecondMatrix && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">{t('tools.matrixCalculator.matrixB')}</span>
              <input
                type="number"
                min="1"
                max="5"
                value={rowsB}
                onChange={(e) => {
                  const r = Math.min(5, Math.max(1, parseInt(e.target.value) || 1))
                  setRowsB(r)
                  setMatrixB(resizeMatrix(matrixB, r, colsB))
                }}
                className="w-14 px-2 py-1 border border-slate-300 rounded text-center text-sm"
              />
              <span>×</span>
              <input
                type="number"
                min="1"
                max="5"
                value={colsB}
                onChange={(e) => {
                  const c = Math.min(5, Math.max(1, parseInt(e.target.value) || 1))
                  setColsB(c)
                  setMatrixB(resizeMatrix(matrixB, rowsB, c))
                }}
                className="w-14 px-2 py-1 border border-slate-300 rounded text-center text-sm"
              />
            </div>
            <MatrixInput matrix={matrixB} setMatrix={setMatrixB} rows={rowsB} cols={colsB} label="Matrix B" />
          </div>
        )}

        {operation === 'scalar' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">{t('tools.matrixCalculator.scalar')}</span>
              <input
                type="number"
                value={scalar}
                onChange={(e) => setScalar(parseFloat(e.target.value) || 0)}
                className="w-20 px-2 py-1 border border-slate-300 rounded text-center"
              />
            </div>
          </div>
        )}
      </div>

      <button
        onClick={calculate}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {t('tools.matrixCalculator.calculate')}
      </button>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {result !== null && !error && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.matrixCalculator.result')}</h3>
          {typeof result === 'number' ? (
            <div className="text-2xl font-mono">{result.toFixed(4)}</div>
          ) : (
            <div className="inline-block bg-slate-50 p-3 rounded">
              {result.map((row, i) => (
                <div key={i} className="flex gap-2 mb-1">
                  {row.map((val, j) => (
                    <span key={j} className="w-16 text-center font-mono text-sm">
                      {val.toFixed(2)}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
