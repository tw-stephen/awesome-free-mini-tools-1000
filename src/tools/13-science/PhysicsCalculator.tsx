import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Category = 'kinematics' | 'force' | 'energy' | 'electricity' | 'waves'

interface Formula {
  id: string
  name: string
  formula: string
  variables: { id: string; name: string; unit: string }[]
  calculate: (vars: Record<string, number>) => { result: number; unit: string; solving: string }
}

export default function PhysicsCalculator() {
  const { t } = useTranslation()
  const [category, setCategory] = useState<Category>('kinematics')
  const [selectedFormula, setSelectedFormula] = useState('')
  const [variables, setVariables] = useState<Record<string, string>>({})
  const [result, setResult] = useState<{ value: number; unit: string; formula: string } | null>(null)

  const formulas: Record<Category, Formula[]> = {
    kinematics: [
      {
        id: 'velocity',
        name: 'Velocity (v = d/t)',
        formula: 'v = d / t',
        variables: [
          { id: 'd', name: 'Distance', unit: 'm' },
          { id: 't', name: 'Time', unit: 's' },
        ],
        calculate: (v) => ({ result: v.d / v.t, unit: 'm/s', solving: 'v' }),
      },
      {
        id: 'acceleration',
        name: 'Acceleration (a = Δv/t)',
        formula: 'a = (v - v₀) / t',
        variables: [
          { id: 'v', name: 'Final Velocity', unit: 'm/s' },
          { id: 'v0', name: 'Initial Velocity', unit: 'm/s' },
          { id: 't', name: 'Time', unit: 's' },
        ],
        calculate: (v) => ({ result: (v.v - v.v0) / v.t, unit: 'm/s²', solving: 'a' }),
      },
      {
        id: 'displacement',
        name: 'Displacement (d = v₀t + ½at²)',
        formula: 'd = v₀t + ½at²',
        variables: [
          { id: 'v0', name: 'Initial Velocity', unit: 'm/s' },
          { id: 'a', name: 'Acceleration', unit: 'm/s²' },
          { id: 't', name: 'Time', unit: 's' },
        ],
        calculate: (v) => ({ result: v.v0 * v.t + 0.5 * v.a * v.t * v.t, unit: 'm', solving: 'd' }),
      },
      {
        id: 'finalVelocity',
        name: 'Final Velocity (v² = v₀² + 2ad)',
        formula: 'v = √(v₀² + 2ad)',
        variables: [
          { id: 'v0', name: 'Initial Velocity', unit: 'm/s' },
          { id: 'a', name: 'Acceleration', unit: 'm/s²' },
          { id: 'd', name: 'Distance', unit: 'm' },
        ],
        calculate: (v) => ({ result: Math.sqrt(v.v0 * v.v0 + 2 * v.a * v.d), unit: 'm/s', solving: 'v' }),
      },
    ],
    force: [
      {
        id: 'newtonSecond',
        name: "Newton's Second Law (F = ma)",
        formula: 'F = m × a',
        variables: [
          { id: 'm', name: 'Mass', unit: 'kg' },
          { id: 'a', name: 'Acceleration', unit: 'm/s²' },
        ],
        calculate: (v) => ({ result: v.m * v.a, unit: 'N', solving: 'F' }),
      },
      {
        id: 'weight',
        name: 'Weight (W = mg)',
        formula: 'W = m × g',
        variables: [
          { id: 'm', name: 'Mass', unit: 'kg' },
          { id: 'g', name: 'Gravity', unit: 'm/s² (9.81)' },
        ],
        calculate: (v) => ({ result: v.m * v.g, unit: 'N', solving: 'W' }),
      },
      {
        id: 'friction',
        name: 'Friction Force (f = μN)',
        formula: 'f = μ × N',
        variables: [
          { id: 'mu', name: 'Coefficient of Friction', unit: '' },
          { id: 'N', name: 'Normal Force', unit: 'N' },
        ],
        calculate: (v) => ({ result: v.mu * v.N, unit: 'N', solving: 'f' }),
      },
      {
        id: 'momentum',
        name: 'Momentum (p = mv)',
        formula: 'p = m × v',
        variables: [
          { id: 'm', name: 'Mass', unit: 'kg' },
          { id: 'v', name: 'Velocity', unit: 'm/s' },
        ],
        calculate: (v) => ({ result: v.m * v.v, unit: 'kg·m/s', solving: 'p' }),
      },
    ],
    energy: [
      {
        id: 'kineticEnergy',
        name: 'Kinetic Energy (KE = ½mv²)',
        formula: 'KE = ½mv²',
        variables: [
          { id: 'm', name: 'Mass', unit: 'kg' },
          { id: 'v', name: 'Velocity', unit: 'm/s' },
        ],
        calculate: (v) => ({ result: 0.5 * v.m * v.v * v.v, unit: 'J', solving: 'KE' }),
      },
      {
        id: 'potentialEnergy',
        name: 'Potential Energy (PE = mgh)',
        formula: 'PE = m × g × h',
        variables: [
          { id: 'm', name: 'Mass', unit: 'kg' },
          { id: 'g', name: 'Gravity', unit: 'm/s²' },
          { id: 'h', name: 'Height', unit: 'm' },
        ],
        calculate: (v) => ({ result: v.m * v.g * v.h, unit: 'J', solving: 'PE' }),
      },
      {
        id: 'work',
        name: 'Work (W = Fd)',
        formula: 'W = F × d × cos(θ)',
        variables: [
          { id: 'F', name: 'Force', unit: 'N' },
          { id: 'd', name: 'Distance', unit: 'm' },
          { id: 'theta', name: 'Angle', unit: '° (degrees)' },
        ],
        calculate: (v) => ({ result: v.F * v.d * Math.cos(v.theta * Math.PI / 180), unit: 'J', solving: 'W' }),
      },
      {
        id: 'power',
        name: 'Power (P = W/t)',
        formula: 'P = W / t',
        variables: [
          { id: 'W', name: 'Work', unit: 'J' },
          { id: 't', name: 'Time', unit: 's' },
        ],
        calculate: (v) => ({ result: v.W / v.t, unit: 'W', solving: 'P' }),
      },
    ],
    electricity: [
      {
        id: 'ohmsLaw',
        name: "Ohm's Law (V = IR)",
        formula: 'V = I × R',
        variables: [
          { id: 'I', name: 'Current', unit: 'A' },
          { id: 'R', name: 'Resistance', unit: 'Ω' },
        ],
        calculate: (v) => ({ result: v.I * v.R, unit: 'V', solving: 'V' }),
      },
      {
        id: 'electricPower',
        name: 'Electric Power (P = IV)',
        formula: 'P = I × V',
        variables: [
          { id: 'I', name: 'Current', unit: 'A' },
          { id: 'V', name: 'Voltage', unit: 'V' },
        ],
        calculate: (v) => ({ result: v.I * v.V, unit: 'W', solving: 'P' }),
      },
      {
        id: 'resistance',
        name: 'Resistance (R = ρL/A)',
        formula: 'R = ρ × L / A',
        variables: [
          { id: 'rho', name: 'Resistivity', unit: 'Ω·m' },
          { id: 'L', name: 'Length', unit: 'm' },
          { id: 'A', name: 'Cross-section Area', unit: 'm²' },
        ],
        calculate: (v) => ({ result: v.rho * v.L / v.A, unit: 'Ω', solving: 'R' }),
      },
      {
        id: 'coulombsLaw',
        name: "Coulomb's Law (F = kq₁q₂/r²)",
        formula: 'F = k × q₁ × q₂ / r²',
        variables: [
          { id: 'q1', name: 'Charge 1', unit: 'C' },
          { id: 'q2', name: 'Charge 2', unit: 'C' },
          { id: 'r', name: 'Distance', unit: 'm' },
        ],
        calculate: (v) => ({ result: 8.99e9 * v.q1 * v.q2 / (v.r * v.r), unit: 'N', solving: 'F' }),
      },
    ],
    waves: [
      {
        id: 'waveSpeed',
        name: 'Wave Speed (v = fλ)',
        formula: 'v = f × λ',
        variables: [
          { id: 'f', name: 'Frequency', unit: 'Hz' },
          { id: 'lambda', name: 'Wavelength', unit: 'm' },
        ],
        calculate: (v) => ({ result: v.f * v.lambda, unit: 'm/s', solving: 'v' }),
      },
      {
        id: 'period',
        name: 'Period (T = 1/f)',
        formula: 'T = 1 / f',
        variables: [
          { id: 'f', name: 'Frequency', unit: 'Hz' },
        ],
        calculate: (v) => ({ result: 1 / v.f, unit: 's', solving: 'T' }),
      },
      {
        id: 'frequency',
        name: 'Frequency (f = 1/T)',
        formula: 'f = 1 / T',
        variables: [
          { id: 'T', name: 'Period', unit: 's' },
        ],
        calculate: (v) => ({ result: 1 / v.T, unit: 'Hz', solving: 'f' }),
      },
      {
        id: 'pendulum',
        name: 'Pendulum Period (T = 2π√(L/g))',
        formula: 'T = 2π√(L/g)',
        variables: [
          { id: 'L', name: 'Length', unit: 'm' },
          { id: 'g', name: 'Gravity', unit: 'm/s²' },
        ],
        calculate: (v) => ({ result: 2 * Math.PI * Math.sqrt(v.L / v.g), unit: 's', solving: 'T' }),
      },
    ],
  }

  const categories = [
    { id: 'kinematics', label: t('tools.physicsCalculator.kinematics') },
    { id: 'force', label: t('tools.physicsCalculator.force') },
    { id: 'energy', label: t('tools.physicsCalculator.energy') },
    { id: 'electricity', label: t('tools.physicsCalculator.electricity') },
    { id: 'waves', label: t('tools.physicsCalculator.waves') },
  ]

  const currentFormulas = formulas[category]
  const activeFormula = currentFormulas.find(f => f.id === selectedFormula)

  const calculate = () => {
    if (!activeFormula) return

    const vars: Record<string, number> = {}
    for (const v of activeFormula.variables) {
      const val = parseFloat(variables[v.id] || '0')
      if (isNaN(val)) {
        setResult(null)
        return
      }
      vars[v.id] = val
    }

    const { result: value, unit, solving } = activeFormula.calculate(vars)
    setResult({ value, unit, formula: solving })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setCategory(cat.id as Category)
              setSelectedFormula('')
              setResult(null)
            }}
            className={`px-3 py-1.5 rounded text-sm ${
              category === cat.id ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium mb-2">
          {t('tools.physicsCalculator.selectFormula')}
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {currentFormulas.map(f => (
            <button
              key={f.id}
              onClick={() => {
                setSelectedFormula(f.id)
                setVariables({})
                setResult(null)
              }}
              className={`p-3 text-left rounded border ${
                selectedFormula === f.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="font-medium text-sm">{f.name}</div>
              <div className="text-xs text-slate-500 font-mono">{f.formula}</div>
            </button>
          ))}
        </div>
      </div>

      {activeFormula && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{activeFormula.name}</h3>
          <div className="space-y-3">
            {activeFormula.variables.map(v => (
              <div key={v.id} className="flex items-center gap-3">
                <label className="w-40 text-sm">
                  {v.name} <span className="text-slate-400">({v.unit})</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={variables[v.id] || ''}
                  onChange={(e) => setVariables({ ...variables, [v.id]: e.target.value })}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded"
                />
              </div>
            ))}
          </div>

          <button
            onClick={calculate}
            className="w-full mt-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t('tools.physicsCalculator.calculate')}
          </button>

          {result && (
            <div className="mt-4 p-4 bg-green-50 rounded text-center">
              <div className="text-sm text-green-600 mb-1">{result.formula} =</div>
              <div className="text-3xl font-bold text-green-700">
                {result.value.toFixed(6).replace(/\.?0+$/, '')} {result.unit}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
