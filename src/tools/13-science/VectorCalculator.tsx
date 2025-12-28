import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Operation = 'add' | 'subtract' | 'dot' | 'cross' | 'magnitude' | 'normalize' | 'angle' | 'scalar'
type Dimension = '2d' | '3d'

export default function VectorCalculator() {
  const { t } = useTranslation()
  const [dimension, setDimension] = useState<Dimension>('3d')
  const [operation, setOperation] = useState<Operation>('add')

  // Vector 1
  const [v1x, setV1x] = useState('1')
  const [v1y, setV1y] = useState('2')
  const [v1z, setV1z] = useState('3')

  // Vector 2
  const [v2x, setV2x] = useState('4')
  const [v2y, setV2y] = useState('5')
  const [v2z, setV2z] = useState('6')

  // Scalar
  const [scalar, setScalar] = useState('2')

  const [result, setResult] = useState<{
    vector?: number[]
    scalar?: number
    angle?: number
    label: string
  } | null>(null)

  const getV1 = (): number[] => {
    const v = [parseFloat(v1x) || 0, parseFloat(v1y) || 0]
    if (dimension === '3d') v.push(parseFloat(v1z) || 0)
    return v
  }

  const getV2 = (): number[] => {
    const v = [parseFloat(v2x) || 0, parseFloat(v2y) || 0]
    if (dimension === '3d') v.push(parseFloat(v2z) || 0)
    return v
  }

  const add = (a: number[], b: number[]): number[] => a.map((v, i) => v + b[i])
  const subtract = (a: number[], b: number[]): number[] => a.map((v, i) => v - b[i])
  const dot = (a: number[], b: number[]): number => a.reduce((sum, v, i) => sum + v * b[i], 0)
  const cross = (a: number[], b: number[]): number[] => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ]
  const magnitude = (a: number[]): number => Math.sqrt(a.reduce((sum, v) => sum + v * v, 0))
  const normalize = (a: number[]): number[] => {
    const mag = magnitude(a)
    return mag === 0 ? a : a.map(v => v / mag)
  }
  const scalarMult = (a: number[], s: number): number[] => a.map(v => v * s)
  const angleBetween = (a: number[], b: number[]): number => {
    const magA = magnitude(a)
    const magB = magnitude(b)
    if (magA === 0 || magB === 0) return 0
    const cosTheta = dot(a, b) / (magA * magB)
    return Math.acos(Math.max(-1, Math.min(1, cosTheta))) * (180 / Math.PI)
  }

  const calculate = () => {
    const v1 = getV1()
    const v2 = getV2()
    const s = parseFloat(scalar) || 0

    switch (operation) {
      case 'add':
        setResult({ vector: add(v1, v2), label: 'v₁ + v₂' })
        break
      case 'subtract':
        setResult({ vector: subtract(v1, v2), label: 'v₁ - v₂' })
        break
      case 'dot':
        setResult({ scalar: dot(v1, v2), label: 'v₁ · v₂' })
        break
      case 'cross':
        if (dimension === '3d') {
          setResult({ vector: cross(v1, v2), label: 'v₁ × v₂' })
        }
        break
      case 'magnitude':
        setResult({ scalar: magnitude(v1), label: '|v₁|' })
        break
      case 'normalize':
        setResult({ vector: normalize(v1), label: 'v₁ / |v₁|' })
        break
      case 'angle':
        setResult({ angle: angleBetween(v1, v2), label: 'θ' })
        break
      case 'scalar':
        setResult({ vector: scalarMult(v1, s), label: `${s} × v₁` })
        break
    }
  }

  const operations = [
    { id: 'add', label: 'v₁ + v₂' },
    { id: 'subtract', label: 'v₁ - v₂' },
    { id: 'dot', label: 'v₁ · v₂' },
    { id: 'cross', label: 'v₁ × v₂', only3d: true },
    { id: 'magnitude', label: '|v₁|' },
    { id: 'normalize', label: 'Normalize' },
    { id: 'angle', label: 'Angle' },
    { id: 'scalar', label: 'Scalar ×' },
  ]

  const needsSecondVector = ['add', 'subtract', 'dot', 'cross', 'angle'].includes(operation)

  const formatVector = (v: number[]): string => {
    return `(${v.map(n => n.toFixed(4).replace(/\.?0+$/, '')).join(', ')})`
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => { setDimension('2d'); if (operation === 'cross') setOperation('add') }}
          className={`px-4 py-2 rounded ${dimension === '2d' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}
        >
          2D
        </button>
        <button
          onClick={() => setDimension('3d')}
          className={`px-4 py-2 rounded ${dimension === '3d' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}
        >
          3D
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.vectorCalculator.vector1')}</h3>
        <div className="flex items-center gap-2">
          <span className="text-lg">(</span>
          <input
            type="number"
            step="any"
            value={v1x}
            onChange={(e) => setV1x(e.target.value)}
            className="w-20 px-2 py-1 border border-slate-300 rounded text-center"
            placeholder="x"
          />
          <span>,</span>
          <input
            type="number"
            step="any"
            value={v1y}
            onChange={(e) => setV1y(e.target.value)}
            className="w-20 px-2 py-1 border border-slate-300 rounded text-center"
            placeholder="y"
          />
          {dimension === '3d' && (
            <>
              <span>,</span>
              <input
                type="number"
                step="any"
                value={v1z}
                onChange={(e) => setV1z(e.target.value)}
                className="w-20 px-2 py-1 border border-slate-300 rounded text-center"
                placeholder="z"
              />
            </>
          )}
          <span className="text-lg">)</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {operations
          .filter(op => !op.only3d || dimension === '3d')
          .map(op => (
            <button
              key={op.id}
              onClick={() => setOperation(op.id as Operation)}
              className={`px-3 py-1.5 rounded text-sm ${
                operation === op.id ? 'bg-green-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {op.label}
            </button>
          ))}
      </div>

      {needsSecondVector && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.vectorCalculator.vector2')}</h3>
          <div className="flex items-center gap-2">
            <span className="text-lg">(</span>
            <input
              type="number"
              step="any"
              value={v2x}
              onChange={(e) => setV2x(e.target.value)}
              className="w-20 px-2 py-1 border border-slate-300 rounded text-center"
              placeholder="x"
            />
            <span>,</span>
            <input
              type="number"
              step="any"
              value={v2y}
              onChange={(e) => setV2y(e.target.value)}
              className="w-20 px-2 py-1 border border-slate-300 rounded text-center"
              placeholder="y"
            />
            {dimension === '3d' && (
              <>
                <span>,</span>
                <input
                  type="number"
                  step="any"
                  value={v2z}
                  onChange={(e) => setV2z(e.target.value)}
                  className="w-20 px-2 py-1 border border-slate-300 rounded text-center"
                  placeholder="z"
                />
              </>
            )}
            <span className="text-lg">)</span>
          </div>
        </div>
      )}

      {operation === 'scalar' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.vectorCalculator.scalar')}</h3>
          <input
            type="number"
            step="any"
            value={scalar}
            onChange={(e) => setScalar(e.target.value)}
            className="w-24 px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      )}

      <button
        onClick={calculate}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {t('tools.vectorCalculator.calculate')}
      </button>

      {result && (
        <div className="card p-4">
          <div className="p-4 bg-green-50 rounded text-center">
            <div className="text-sm text-green-600 mb-1">{result.label}</div>
            <div className="text-2xl font-bold text-green-700 font-mono">
              {result.vector && formatVector(result.vector)}
              {result.scalar !== undefined && result.scalar.toFixed(6).replace(/\.?0+$/, '')}
              {result.angle !== undefined && `${result.angle.toFixed(2)}°`}
            </div>
          </div>

          {result.vector && (
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-xs text-slate-500">x</div>
                <div className="font-mono">{result.vector[0].toFixed(4)}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-xs text-slate-500">y</div>
                <div className="font-mono">{result.vector[1].toFixed(4)}</div>
              </div>
              {dimension === '3d' && result.vector[2] !== undefined && (
                <div className="p-2 bg-slate-50 rounded">
                  <div className="text-xs text-slate-500">z</div>
                  <div className="font-mono">{result.vector[2].toFixed(4)}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.vectorCalculator.formulas')}</h4>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2 bg-white rounded">|v| = √(x² + y² + z²)</div>
          <div className="p-2 bg-white rounded">v₁ · v₂ = x₁x₂ + y₁y₂ + z₁z₂</div>
          <div className="p-2 bg-white rounded">cos(θ) = (v₁·v₂)/(|v₁||v₂|)</div>
          <div className="p-2 bg-white rounded">v̂ = v / |v|</div>
        </div>
      </div>
    </div>
  )
}
