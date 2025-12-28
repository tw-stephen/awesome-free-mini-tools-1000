import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Element {
  symbol: string
  name: string
  atomicNumber: number
  atomicMass: number
}

const elements: Record<string, Element> = {
  H: { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, atomicMass: 1.008 },
  He: { symbol: 'He', name: 'Helium', atomicNumber: 2, atomicMass: 4.003 },
  Li: { symbol: 'Li', name: 'Lithium', atomicNumber: 3, atomicMass: 6.941 },
  Be: { symbol: 'Be', name: 'Beryllium', atomicNumber: 4, atomicMass: 9.012 },
  B: { symbol: 'B', name: 'Boron', atomicNumber: 5, atomicMass: 10.81 },
  C: { symbol: 'C', name: 'Carbon', atomicNumber: 6, atomicMass: 12.01 },
  N: { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, atomicMass: 14.01 },
  O: { symbol: 'O', name: 'Oxygen', atomicNumber: 8, atomicMass: 16.00 },
  F: { symbol: 'F', name: 'Fluorine', atomicNumber: 9, atomicMass: 19.00 },
  Ne: { symbol: 'Ne', name: 'Neon', atomicNumber: 10, atomicMass: 20.18 },
  Na: { symbol: 'Na', name: 'Sodium', atomicNumber: 11, atomicMass: 22.99 },
  Mg: { symbol: 'Mg', name: 'Magnesium', atomicNumber: 12, atomicMass: 24.31 },
  Al: { symbol: 'Al', name: 'Aluminum', atomicNumber: 13, atomicMass: 26.98 },
  Si: { symbol: 'Si', name: 'Silicon', atomicNumber: 14, atomicMass: 28.09 },
  P: { symbol: 'P', name: 'Phosphorus', atomicNumber: 15, atomicMass: 30.97 },
  S: { symbol: 'S', name: 'Sulfur', atomicNumber: 16, atomicMass: 32.07 },
  Cl: { symbol: 'Cl', name: 'Chlorine', atomicNumber: 17, atomicMass: 35.45 },
  Ar: { symbol: 'Ar', name: 'Argon', atomicNumber: 18, atomicMass: 39.95 },
  K: { symbol: 'K', name: 'Potassium', atomicNumber: 19, atomicMass: 39.10 },
  Ca: { symbol: 'Ca', name: 'Calcium', atomicNumber: 20, atomicMass: 40.08 },
  Fe: { symbol: 'Fe', name: 'Iron', atomicNumber: 26, atomicMass: 55.85 },
  Cu: { symbol: 'Cu', name: 'Copper', atomicNumber: 29, atomicMass: 63.55 },
  Zn: { symbol: 'Zn', name: 'Zinc', atomicNumber: 30, atomicMass: 65.38 },
  Br: { symbol: 'Br', name: 'Bromine', atomicNumber: 35, atomicMass: 79.90 },
  Ag: { symbol: 'Ag', name: 'Silver', atomicNumber: 47, atomicMass: 107.87 },
  I: { symbol: 'I', name: 'Iodine', atomicNumber: 53, atomicMass: 126.90 },
  Au: { symbol: 'Au', name: 'Gold', atomicNumber: 79, atomicMass: 196.97 },
  Pb: { symbol: 'Pb', name: 'Lead', atomicNumber: 82, atomicMass: 207.2 },
}

interface ParsedElement {
  symbol: string
  count: number
  mass: number
}

export default function ChemicalFormulaParser() {
  const { t } = useTranslation()
  const [formula, setFormula] = useState('H2O')
  const [result, setResult] = useState<{
    elements: ParsedElement[]
    totalMass: number
    composition: { symbol: string; percentage: number }[]
  } | null>(null)
  const [error, setError] = useState('')

  const parseFormula = (formula: string): Record<string, number> => {
    const stack: Record<string, number>[] = [{}]

    let i = 0
    while (i < formula.length) {
      if (formula[i] === '(') {
        stack.push({})
        i++
      } else if (formula[i] === ')') {
        i++
        let numStr = ''
        while (i < formula.length && /\d/.test(formula[i])) {
          numStr += formula[i]
          i++
        }
        const multiplier = numStr ? parseInt(numStr) : 1
        const group = stack.pop()!

        for (const [elem, count] of Object.entries(group)) {
          stack[stack.length - 1][elem] = (stack[stack.length - 1][elem] || 0) + count * multiplier
        }
      } else if (/[A-Z]/.test(formula[i])) {
        let symbol = formula[i]
        i++
        while (i < formula.length && /[a-z]/.test(formula[i])) {
          symbol += formula[i]
          i++
        }
        let numStr = ''
        while (i < formula.length && /\d/.test(formula[i])) {
          numStr += formula[i]
          i++
        }
        const count = numStr ? parseInt(numStr) : 1
        stack[stack.length - 1][symbol] = (stack[stack.length - 1][symbol] || 0) + count
      } else {
        i++
      }
    }

    return stack[0]
  }

  const calculate = () => {
    setError('')
    setResult(null)

    try {
      const parsed = parseFormula(formula)
      const parsedElements: ParsedElement[] = []
      let totalMass = 0

      for (const [symbol, count] of Object.entries(parsed)) {
        const element = elements[symbol]
        if (!element) {
          setError(t('tools.chemicalFormulaParser.unknownElement', { symbol }))
          return
        }
        const mass = element.atomicMass * count
        totalMass += mass
        parsedElements.push({ symbol, count, mass })
      }

      const composition = parsedElements.map(el => ({
        symbol: el.symbol,
        percentage: (el.mass / totalMass) * 100,
      }))

      setResult({
        elements: parsedElements,
        totalMass,
        composition,
      })
    } catch {
      setError(t('tools.chemicalFormulaParser.parseError'))
    }
  }

  const commonFormulas = [
    { formula: 'H2O', name: 'Water' },
    { formula: 'NaCl', name: 'Salt' },
    { formula: 'CO2', name: 'Carbon Dioxide' },
    { formula: 'C6H12O6', name: 'Glucose' },
    { formula: 'H2SO4', name: 'Sulfuric Acid' },
    { formula: 'NaHCO3', name: 'Baking Soda' },
    { formula: 'C2H5OH', name: 'Ethanol' },
    { formula: 'CaCO3', name: 'Calcium Carbonate' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium mb-2">
          {t('tools.chemicalFormulaParser.enterFormula')}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded font-mono text-lg"
            placeholder="H2O, NaCl, C6H12O6..."
          />
          <button
            onClick={calculate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t('tools.chemicalFormulaParser.parse')}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {t('tools.chemicalFormulaParser.hint')}
        </p>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.chemicalFormulaParser.molecularMass')}</h3>
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-3xl font-bold text-blue-700">
                {result.totalMass.toFixed(4)} g/mol
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.chemicalFormulaParser.composition')}</h3>
            <div className="space-y-2">
              {result.elements.map((el, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-slate-50 rounded">
                  <span className="w-12 text-center font-mono font-bold text-lg">
                    {el.symbol}
                  </span>
                  <span className="w-8 text-center text-sm text-slate-500">
                    ×{el.count}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{elements[el.symbol]?.name}</span>
                      <span>{el.mass.toFixed(4)} g/mol</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${result.composition[i].percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-16 text-right text-sm font-mono">
                    {result.composition[i].percentage.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.chemicalFormulaParser.elementDetails')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-2 text-left">{t('tools.chemicalFormulaParser.symbol')}</th>
                    <th className="p-2 text-left">{t('tools.chemicalFormulaParser.name')}</th>
                    <th className="p-2 text-center">{t('tools.chemicalFormulaParser.atomicNumber')}</th>
                    <th className="p-2 text-right">{t('tools.chemicalFormulaParser.atomicMass')}</th>
                    <th className="p-2 text-center">{t('tools.chemicalFormulaParser.count')}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.elements.map((el, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="p-2 font-mono font-bold">{el.symbol}</td>
                      <td className="p-2">{elements[el.symbol]?.name}</td>
                      <td className="p-2 text-center">{elements[el.symbol]?.atomicNumber}</td>
                      <td className="p-2 text-right font-mono">{elements[el.symbol]?.atomicMass}</td>
                      <td className="p-2 text-center">{el.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.chemicalFormulaParser.commonCompounds')}</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {commonFormulas.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                setFormula(item.formula)
                setTimeout(calculate, 0)
              }}
              className="p-2 bg-white rounded border hover:bg-slate-50 text-left"
            >
              <div className="font-mono font-bold">{item.formula}</div>
              <div className="text-xs text-slate-500">{item.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
