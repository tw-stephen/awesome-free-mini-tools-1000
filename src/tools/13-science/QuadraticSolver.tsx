import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function QuadraticSolver() {
  const { t } = useTranslation()
  const [a, setA] = useState('1')
  const [b, setB] = useState('-5')
  const [c, setC] = useState('6')
  const [result, setResult] = useState<{
    discriminant: number
    x1: { real: number; imag: number }
    x2: { real: number; imag: number }
    vertex: { x: number; y: number }
    axisOfSymmetry: number
    yIntercept: number
    factored?: string
  } | null>(null)

  const solve = () => {
    const aVal = parseFloat(a)
    const bVal = parseFloat(b)
    const cVal = parseFloat(c)

    if (isNaN(aVal) || isNaN(bVal) || isNaN(cVal) || aVal === 0) {
      setResult(null)
      return
    }

    const discriminant = bVal * bVal - 4 * aVal * cVal
    const vertexX = -bVal / (2 * aVal)
    const vertexY = aVal * vertexX * vertexX + bVal * vertexX + cVal

    let x1: { real: number; imag: number }
    let x2: { real: number; imag: number }
    let factored: string | undefined

    if (discriminant >= 0) {
      const sqrtD = Math.sqrt(discriminant)
      x1 = { real: (-bVal + sqrtD) / (2 * aVal), imag: 0 }
      x2 = { real: (-bVal - sqrtD) / (2 * aVal), imag: 0 }

      // Try to create factored form
      if (Number.isInteger(x1.real) && Number.isInteger(x2.real)) {
        const sign1 = x1.real >= 0 ? '-' : '+'
        const sign2 = x2.real >= 0 ? '-' : '+'
        factored = `${aVal === 1 ? '' : aVal}(x ${sign1} ${Math.abs(x1.real)})(x ${sign2} ${Math.abs(x2.real)})`
      }
    } else {
      const sqrtD = Math.sqrt(-discriminant)
      x1 = { real: -bVal / (2 * aVal), imag: sqrtD / (2 * aVal) }
      x2 = { real: -bVal / (2 * aVal), imag: -sqrtD / (2 * aVal) }
    }

    setResult({
      discriminant,
      x1,
      x2,
      vertex: { x: vertexX, y: vertexY },
      axisOfSymmetry: vertexX,
      yIntercept: cVal,
      factored,
    })
  }

  const formatRoot = (root: { real: number; imag: number }): string => {
    if (root.imag === 0) {
      return root.real.toFixed(4).replace(/\.?0+$/, '')
    }
    const sign = root.imag >= 0 ? '+' : '-'
    return `${root.real.toFixed(4).replace(/\.?0+$/, '')} ${sign} ${Math.abs(root.imag).toFixed(4).replace(/\.?0+$/, '')}i`
  }

  const examples = [
    { a: '1', b: '-5', c: '6', label: 'x² - 5x + 6 = 0' },
    { a: '1', b: '2', c: '1', label: 'x² + 2x + 1 = 0' },
    { a: '1', b: '0', c: '-4', label: 'x² - 4 = 0' },
    { a: '1', b: '1', c: '1', label: 'x² + x + 1 = 0' },
    { a: '2', b: '-7', c: '3', label: '2x² - 7x + 3 = 0' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.quadraticSolver.title')}</h3>
        <p className="text-sm text-slate-600 mb-4 font-mono">ax² + bx + c = 0</p>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <input
            type="number"
            step="any"
            value={a}
            onChange={(e) => setA(e.target.value)}
            className="w-20 px-3 py-2 border border-slate-300 rounded text-center"
          />
          <span className="font-mono">x² +</span>
          <input
            type="number"
            step="any"
            value={b}
            onChange={(e) => setB(e.target.value)}
            className="w-20 px-3 py-2 border border-slate-300 rounded text-center"
          />
          <span className="font-mono">x +</span>
          <input
            type="number"
            step="any"
            value={c}
            onChange={(e) => setC(e.target.value)}
            className="w-20 px-3 py-2 border border-slate-300 rounded text-center"
          />
          <span className="font-mono">= 0</span>
        </div>

        <button
          onClick={solve}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t('tools.quadraticSolver.solve')}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-slate-500">{t('tools.quadraticSolver.examples')}:</span>
        {examples.map((ex, i) => (
          <button
            key={i}
            onClick={() => { setA(ex.a); setB(ex.b); setC(ex.c) }}
            className="px-2 py-1 bg-slate-100 rounded text-xs hover:bg-slate-200 font-mono"
          >
            {ex.label}
          </button>
        ))}
      </div>

      {result && (
        <div className="space-y-4">
          <div className="card p-4">
            <h4 className="font-medium mb-3">{t('tools.quadraticSolver.solutions')}</h4>

            <div className={`p-3 rounded mb-4 ${
              result.discriminant > 0 ? 'bg-green-50' :
              result.discriminant === 0 ? 'bg-yellow-50' : 'bg-purple-50'
            }`}>
              <div className="text-sm mb-1">
                {t('tools.quadraticSolver.discriminant')}: Δ = b² - 4ac = {result.discriminant.toFixed(4)}
              </div>
              <div className={`text-sm font-medium ${
                result.discriminant > 0 ? 'text-green-700' :
                result.discriminant === 0 ? 'text-yellow-700' : 'text-purple-700'
              }`}>
                {result.discriminant > 0
                  ? t('tools.quadraticSolver.twoRealRoots')
                  : result.discriminant === 0
                  ? t('tools.quadraticSolver.oneRealRoot')
                  : t('tools.quadraticSolver.complexRoots')
                }
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded text-center">
                <div className="text-sm text-blue-600 mb-1">x₁</div>
                <div className="text-xl font-bold text-blue-700 font-mono">
                  {formatRoot(result.x1)}
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded text-center">
                <div className="text-sm text-blue-600 mb-1">x₂</div>
                <div className="text-xl font-bold text-blue-700 font-mono">
                  {formatRoot(result.x2)}
                </div>
              </div>
            </div>

            {result.factored && (
              <div className="mt-4 p-3 bg-slate-50 rounded">
                <div className="text-sm text-slate-600">{t('tools.quadraticSolver.factored')}:</div>
                <div className="font-mono">{result.factored} = 0</div>
              </div>
            )}
          </div>

          <div className="card p-4">
            <h4 className="font-medium mb-3">{t('tools.quadraticSolver.graphProperties')}</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-sm text-slate-600">{t('tools.quadraticSolver.vertex')}</div>
                <div className="font-mono">
                  ({result.vertex.x.toFixed(4).replace(/\.?0+$/, '')}, {result.vertex.y.toFixed(4).replace(/\.?0+$/, '')})
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-sm text-slate-600">{t('tools.quadraticSolver.axisOfSymmetry')}</div>
                <div className="font-mono">x = {result.axisOfSymmetry.toFixed(4).replace(/\.?0+$/, '')}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-sm text-slate-600">{t('tools.quadraticSolver.yIntercept')}</div>
                <div className="font-mono">(0, {result.yIntercept})</div>
              </div>
              <div className="p-3 bg-slate-50 rounded">
                <div className="text-sm text-slate-600">{t('tools.quadraticSolver.direction')}</div>
                <div className="font-mono">
                  {parseFloat(a) > 0
                    ? t('tools.quadraticSolver.opensUp')
                    : t('tools.quadraticSolver.opensDown')
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="card p-4 bg-slate-50">
            <h4 className="font-medium mb-2">{t('tools.quadraticSolver.formula')}</h4>
            <div className="p-3 bg-white rounded font-mono text-center">
              x = (-b ± √(b² - 4ac)) / 2a
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
