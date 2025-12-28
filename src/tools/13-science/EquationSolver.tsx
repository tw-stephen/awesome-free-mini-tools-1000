import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type EquationType = 'linear' | 'quadratic' | 'system2' | 'system3'

interface Solution {
  x?: number | string
  y?: number | string
  z?: number | string
  discriminant?: number
  steps?: string[]
}

export default function EquationSolver() {
  const { t } = useTranslation()
  const [equationType, setEquationType] = useState<EquationType>('linear')
  const [coefficients, setCoefficients] = useState({
    a: 1, b: 2, c: 3, d: 0, e: 0, f: 0,
    a1: 1, b1: 2, c1: 3,
    a2: 2, b2: 1, c2: 4,
    a3: 1, b3: 1, c3: 1, d3: 3
  })
  const [solution, setSolution] = useState<Solution | null>(null)

  const solveLinear = () => {
    // ax + b = c => x = (c - b) / a
    const { a, b, c } = coefficients
    if (a === 0) {
      return { x: b === c ? 'Any value' : 'No solution', steps: ['a = 0, equation is not linear'] }
    }
    const x = (c - b) / a
    return {
      x,
      steps: [
        `${a}x + ${b} = ${c}`,
        `${a}x = ${c} - ${b}`,
        `${a}x = ${c - b}`,
        `x = ${c - b} / ${a}`,
        `x = ${x}`
      ]
    }
  }

  const solveQuadratic = () => {
    // ax² + bx + c = 0
    const { a, b, c } = coefficients
    if (a === 0) {
      if (b === 0) {
        return { x: c === 0 ? 'Any value' : 'No solution' }
      }
      return { x: -c / b, steps: ['This is a linear equation'] }
    }

    const discriminant = b * b - 4 * a * c
    const steps = [
      `${a}x² + ${b}x + ${c} = 0`,
      `Discriminant: b² - 4ac = ${b}² - 4(${a})(${c}) = ${discriminant}`
    ]

    if (discriminant < 0) {
      const realPart = -b / (2 * a)
      const imagPart = Math.sqrt(-discriminant) / (2 * a)
      return {
        x: `${realPart.toFixed(4)} ± ${imagPart.toFixed(4)}i`,
        discriminant,
        steps: [...steps, 'Discriminant < 0: Complex roots']
      }
    } else if (discriminant === 0) {
      const x = -b / (2 * a)
      return {
        x,
        discriminant,
        steps: [...steps, 'Discriminant = 0: One repeated root', `x = -b / 2a = ${x}`]
      }
    } else {
      const x1 = (-b + Math.sqrt(discriminant)) / (2 * a)
      const x2 = (-b - Math.sqrt(discriminant)) / (2 * a)
      return {
        x: `${x1.toFixed(4)}, ${x2.toFixed(4)}`,
        discriminant,
        steps: [
          ...steps,
          'Discriminant > 0: Two real roots',
          `x₁ = (-b + √D) / 2a = ${x1.toFixed(4)}`,
          `x₂ = (-b - √D) / 2a = ${x2.toFixed(4)}`
        ]
      }
    }
  }

  const solveSystem2 = () => {
    // a1x + b1y = c1
    // a2x + b2y = c2
    const { a1, b1, c1, a2, b2, c2 } = coefficients
    const det = a1 * b2 - a2 * b1

    const steps = [
      `${a1}x + ${b1}y = ${c1}`,
      `${a2}x + ${b2}y = ${c2}`,
      `Determinant: ${a1}×${b2} - ${a2}×${b1} = ${det}`
    ]

    if (det === 0) {
      const ratio1 = a1 / a2
      const ratio2 = b1 / b2
      const ratio3 = c1 / c2
      if (ratio1 === ratio2 && ratio2 === ratio3) {
        return { x: 'Infinite solutions', y: 'Infinite solutions', steps: [...steps, 'Equations are dependent'] }
      }
      return { x: 'No solution', y: 'No solution', steps: [...steps, 'Equations are inconsistent'] }
    }

    const x = (c1 * b2 - c2 * b1) / det
    const y = (a1 * c2 - a2 * c1) / det

    return {
      x,
      y,
      steps: [
        ...steps,
        `x = (c1×b2 - c2×b1) / det = ${x.toFixed(4)}`,
        `y = (a1×c2 - a2×c1) / det = ${y.toFixed(4)}`
      ]
    }
  }

  const solveSystem3 = () => {
    // Simplified 3-variable system solver using Cramer's rule
    // a1x + b1y + c1z = d1
    // a2x + b2y + c2z = d2
    // a3x + b3y + c3z = d3
    // Using simplified coefficients for demo
    const { a1, b1, c1, a2, b2, c2, a3, b3, c3, d3 } = coefficients
    const d1 = coefficients.c1
    const d2 = coefficients.c2

    const det = (a: number[][]): number => {
      return a[0][0] * (a[1][1] * a[2][2] - a[1][2] * a[2][1])
           - a[0][1] * (a[1][0] * a[2][2] - a[1][2] * a[2][0])
           + a[0][2] * (a[1][0] * a[2][1] - a[1][1] * a[2][0])
    }

    const D = det([
      [a1, b1, c1],
      [a2, b2, c2],
      [a3, b3, c3]
    ])

    if (D === 0) {
      return { x: 'No unique solution', y: '-', z: '-' }
    }

    const Dx = det([
      [d1, b1, c1],
      [d2, b2, c2],
      [d3, b3, c3]
    ])

    const Dy = det([
      [a1, d1, c1],
      [a2, d2, c2],
      [a3, d3, c3]
    ])

    const Dz = det([
      [a1, b1, d1],
      [a2, b2, d2],
      [a3, b3, d3]
    ])

    return {
      x: Dx / D,
      y: Dy / D,
      z: Dz / D,
      steps: [`D = ${D}`, `x = Dx/D = ${Dx/D}`, `y = Dy/D = ${Dy/D}`, `z = Dz/D = ${Dz/D}`]
    }
  }

  const solve = () => {
    switch (equationType) {
      case 'linear':
        setSolution(solveLinear())
        break
      case 'quadratic':
        setSolution(solveQuadratic())
        break
      case 'system2':
        setSolution(solveSystem2())
        break
      case 'system3':
        setSolution(solveSystem3())
        break
    }
  }

  const updateCoef = (key: string, value: string) => {
    setCoefficients({ ...coefficients, [key]: parseFloat(value) || 0 })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'linear', label: t('tools.equationSolver.linear') },
          { id: 'quadratic', label: t('tools.equationSolver.quadratic') },
          { id: 'system2', label: t('tools.equationSolver.system2') },
          { id: 'system3', label: t('tools.equationSolver.system3') },
        ].map(type => (
          <button
            key={type.id}
            onClick={() => { setEquationType(type.id as EquationType); setSolution(null) }}
            className={`px-3 py-1.5 rounded text-sm ${
              equationType === type.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="card p-4 space-y-4">
        {equationType === 'linear' && (
          <div>
            <div className="text-sm text-slate-600 mb-2">ax + b = c</div>
            <div className="flex items-center gap-2 flex-wrap">
              <input type="number" value={coefficients.a} onChange={(e) => updateCoef('a', e.target.value)} className="w-16 px-2 py-1 border rounded text-center" />
              <span>x +</span>
              <input type="number" value={coefficients.b} onChange={(e) => updateCoef('b', e.target.value)} className="w-16 px-2 py-1 border rounded text-center" />
              <span>=</span>
              <input type="number" value={coefficients.c} onChange={(e) => updateCoef('c', e.target.value)} className="w-16 px-2 py-1 border rounded text-center" />
            </div>
          </div>
        )}

        {equationType === 'quadratic' && (
          <div>
            <div className="text-sm text-slate-600 mb-2">ax² + bx + c = 0</div>
            <div className="flex items-center gap-2 flex-wrap">
              <input type="number" value={coefficients.a} onChange={(e) => updateCoef('a', e.target.value)} className="w-16 px-2 py-1 border rounded text-center" />
              <span>x² +</span>
              <input type="number" value={coefficients.b} onChange={(e) => updateCoef('b', e.target.value)} className="w-16 px-2 py-1 border rounded text-center" />
              <span>x +</span>
              <input type="number" value={coefficients.c} onChange={(e) => updateCoef('c', e.target.value)} className="w-16 px-2 py-1 border rounded text-center" />
              <span>= 0</span>
            </div>
          </div>
        )}

        {equationType === 'system2' && (
          <div className="space-y-2">
            <div className="text-sm text-slate-600 mb-2">{t('tools.equationSolver.systemDesc2')}</div>
            <div className="flex items-center gap-2 flex-wrap">
              <input type="number" value={coefficients.a1} onChange={(e) => updateCoef('a1', e.target.value)} className="w-14 px-2 py-1 border rounded text-center" />
              <span>x +</span>
              <input type="number" value={coefficients.b1} onChange={(e) => updateCoef('b1', e.target.value)} className="w-14 px-2 py-1 border rounded text-center" />
              <span>y =</span>
              <input type="number" value={coefficients.c1} onChange={(e) => updateCoef('c1', e.target.value)} className="w-14 px-2 py-1 border rounded text-center" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <input type="number" value={coefficients.a2} onChange={(e) => updateCoef('a2', e.target.value)} className="w-14 px-2 py-1 border rounded text-center" />
              <span>x +</span>
              <input type="number" value={coefficients.b2} onChange={(e) => updateCoef('b2', e.target.value)} className="w-14 px-2 py-1 border rounded text-center" />
              <span>y =</span>
              <input type="number" value={coefficients.c2} onChange={(e) => updateCoef('c2', e.target.value)} className="w-14 px-2 py-1 border rounded text-center" />
            </div>
          </div>
        )}

        {equationType === 'system3' && (
          <div className="space-y-2">
            <div className="text-sm text-slate-600 mb-2">{t('tools.equationSolver.systemDesc3')}</div>
            <div className="flex items-center gap-1 flex-wrap text-sm">
              <input type="number" value={coefficients.a1} onChange={(e) => updateCoef('a1', e.target.value)} className="w-12 px-1 py-1 border rounded text-center" />
              <span>x +</span>
              <input type="number" value={coefficients.b1} onChange={(e) => updateCoef('b1', e.target.value)} className="w-12 px-1 py-1 border rounded text-center" />
              <span>y +</span>
              <input type="number" value={coefficients.c1} onChange={(e) => updateCoef('c1', e.target.value)} className="w-12 px-1 py-1 border rounded text-center" />
              <span>z =</span>
              <input type="number" value={coefficients.c1} onChange={(e) => updateCoef('c1', e.target.value)} className="w-12 px-1 py-1 border rounded text-center" />
            </div>
            <div className="flex items-center gap-1 flex-wrap text-sm">
              <input type="number" value={coefficients.a2} onChange={(e) => updateCoef('a2', e.target.value)} className="w-12 px-1 py-1 border rounded text-center" />
              <span>x +</span>
              <input type="number" value={coefficients.b2} onChange={(e) => updateCoef('b2', e.target.value)} className="w-12 px-1 py-1 border rounded text-center" />
              <span>y +</span>
              <input type="number" value={coefficients.c2} onChange={(e) => updateCoef('c2', e.target.value)} className="w-12 px-1 py-1 border rounded text-center" />
              <span>z =</span>
              <input type="number" value={coefficients.c2} onChange={(e) => updateCoef('c2', e.target.value)} className="w-12 px-1 py-1 border rounded text-center" />
            </div>
            <div className="flex items-center gap-1 flex-wrap text-sm">
              <input type="number" value={coefficients.a3} onChange={(e) => updateCoef('a3', e.target.value)} className="w-12 px-1 py-1 border rounded text-center" />
              <span>x +</span>
              <input type="number" value={coefficients.b3} onChange={(e) => updateCoef('b3', e.target.value)} className="w-12 px-1 py-1 border rounded text-center" />
              <span>y +</span>
              <input type="number" value={coefficients.c3} onChange={(e) => updateCoef('c3', e.target.value)} className="w-12 px-1 py-1 border rounded text-center" />
              <span>z =</span>
              <input type="number" value={coefficients.d3} onChange={(e) => updateCoef('d3', e.target.value)} className="w-12 px-1 py-1 border rounded text-center" />
            </div>
          </div>
        )}
      </div>

      <button
        onClick={solve}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {t('tools.equationSolver.solve')}
      </button>

      {solution && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.equationSolver.solution')}</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded">
              <div className="text-sm text-slate-600">x</div>
              <div className="text-xl font-mono">
                {typeof solution.x === 'number' ? solution.x.toFixed(4) : solution.x}
              </div>
            </div>
            {solution.y !== undefined && (
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-sm text-slate-600">y</div>
                <div className="text-xl font-mono">
                  {typeof solution.y === 'number' ? solution.y.toFixed(4) : solution.y}
                </div>
              </div>
            )}
            {solution.z !== undefined && (
              <div className="text-center p-3 bg-purple-50 rounded">
                <div className="text-sm text-slate-600">z</div>
                <div className="text-xl font-mono">
                  {typeof solution.z === 'number' ? solution.z.toFixed(4) : solution.z}
                </div>
              </div>
            )}
          </div>

          {solution.steps && (
            <div>
              <h4 className="text-sm font-medium text-slate-600 mb-2">{t('tools.equationSolver.steps')}</h4>
              <div className="space-y-1">
                {solution.steps.map((step, i) => (
                  <div key={i} className="text-sm font-mono p-2 bg-slate-50 rounded">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
