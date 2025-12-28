import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function EquationBalancer() {
  const { t } = useTranslation()
  const [equation, setEquation] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const commonEquations = [
    { equation: 'H2 + O2 → H2O', balanced: '2H2 + O2 → 2H2O' },
    { equation: 'CH4 + O2 → CO2 + H2O', balanced: 'CH4 + 2O2 → CO2 + 2H2O' },
    { equation: 'Fe + O2 → Fe2O3', balanced: '4Fe + 3O2 → 2Fe2O3' },
    { equation: 'N2 + H2 → NH3', balanced: 'N2 + 3H2 → 2NH3' },
    { equation: 'Na + Cl2 → NaCl', balanced: '2Na + Cl2 → 2NaCl' },
    { equation: 'C + O2 → CO2', balanced: 'C + O2 → CO2' },
    { equation: 'H2O → H2 + O2', balanced: '2H2O → 2H2 + O2' },
    { equation: 'CaCO3 → CaO + CO2', balanced: 'CaCO3 → CaO + CO2' },
  ]

  const parseCompound = (compound: string) => {
    const elements: Record<string, number> = {}
    const regex = /([A-Z][a-z]?)(\d*)/g
    let match

    // Handle coefficient
    const coeffMatch = compound.match(/^(\d+)/)
    const coeff = coeffMatch ? parseInt(coeffMatch[1]) : 1
    const formula = coeffMatch ? compound.slice(coeffMatch[1].length) : compound

    while ((match = regex.exec(formula)) !== null) {
      const element = match[1]
      const count = (match[2] ? parseInt(match[2]) : 1) * coeff
      if (element) {
        elements[element] = (elements[element] || 0) + count
      }
    }

    return elements
  }

  const checkBalance = () => {
    try {
      setError(null)
      setResult(null)

      const parts = equation.split(/→|->|=/).map(s => s.trim())
      if (parts.length !== 2) {
        setError(t('tools.equationBalancer.invalidFormat'))
        return
      }

      const leftCompounds = parts[0].split('+').map(s => s.trim())
      const rightCompounds = parts[1].split('+').map(s => s.trim())

      const leftElements: Record<string, number> = {}
      const rightElements: Record<string, number> = {}

      leftCompounds.forEach(compound => {
        const elements = parseCompound(compound)
        for (const [el, count] of Object.entries(elements)) {
          leftElements[el] = (leftElements[el] || 0) + count
        }
      })

      rightCompounds.forEach(compound => {
        const elements = parseCompound(compound)
        for (const [el, count] of Object.entries(elements)) {
          rightElements[el] = (rightElements[el] || 0) + count
        }
      })

      // Check if balanced
      const allElements = new Set([...Object.keys(leftElements), ...Object.keys(rightElements)])
      let isBalanced = true
      const details: string[] = []

      allElements.forEach(el => {
        const left = leftElements[el] || 0
        const right = rightElements[el] || 0
        details.push(`${el}: ${left} → ${right}`)
        if (left !== right) isBalanced = false
      })

      setResult(isBalanced
        ? t('tools.equationBalancer.balanced')
        : t('tools.equationBalancer.notBalanced') + '\n' + details.join('\n'))

    } catch (e) {
      setError(t('tools.equationBalancer.parseError'))
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {t('tools.equationBalancer.enterEquation')}
        </label>
        <input
          type="text"
          value={equation}
          onChange={(e) => setEquation(e.target.value)}
          placeholder="H2 + O2 → H2O"
          className="w-full px-3 py-2 border border-slate-300 rounded font-mono"
        />
        <p className="text-xs text-slate-500 mt-1">
          {t('tools.equationBalancer.hint')}
        </p>
        <button
          onClick={checkBalance}
          disabled={!equation.trim()}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
        >
          {t('tools.equationBalancer.check')}
        </button>
      </div>

      {result && (
        <div className={`card p-4 ${result.includes('balanced') && !result.includes('not') ? 'bg-green-50' : 'bg-yellow-50'}`}>
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      )}

      {error && (
        <div className="card p-4 bg-red-50 text-red-600">
          {error}
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.equationBalancer.examples')}
        </h3>
        <div className="space-y-2">
          {commonEquations.map((eq, i) => (
            <div
              key={i}
              className="p-2 bg-slate-50 rounded cursor-pointer hover:bg-slate-100"
              onClick={() => setEquation(eq.equation)}
            >
              <div className="font-mono text-sm">{eq.equation}</div>
              <div className="text-xs text-green-600">→ {eq.balanced}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.equationBalancer.tips')}
        </h3>
        <div className="text-xs text-slate-500 space-y-1">
          <p>• {t('tools.equationBalancer.tip1')}</p>
          <p>• {t('tools.equationBalancer.tip2')}</p>
          <p>• {t('tools.equationBalancer.tip3')}</p>
        </div>
      </div>
    </div>
  )
}
