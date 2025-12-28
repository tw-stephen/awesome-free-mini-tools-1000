import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const atomicMasses: Record<string, number> = {
  H: 1.008, He: 4.003, Li: 6.941, Be: 9.012, B: 10.81,
  C: 12.01, N: 14.01, O: 16.00, F: 19.00, Ne: 20.18,
  Na: 22.99, Mg: 24.31, Al: 26.98, Si: 28.09, P: 30.97,
  S: 32.07, Cl: 35.45, Ar: 39.95, K: 39.10, Ca: 40.08,
  Fe: 55.85, Cu: 63.55, Zn: 65.38, Br: 79.90, Ag: 107.87,
  I: 126.90, Au: 196.97, Pb: 207.2,
}

export default function MolecularWeightCalculator() {
  const { t } = useTranslation()
  const [formula, setFormula] = useState('')

  const result = useMemo(() => {
    if (!formula.trim()) return null

    try {
      // Parse chemical formula
      const elements: { symbol: string; count: number }[] = []
      const regex = /([A-Z][a-z]?)(\d*)/g
      let match

      while ((match = regex.exec(formula)) !== null) {
        const symbol = match[1]
        const count = match[2] ? parseInt(match[2]) : 1

        if (!atomicMasses[symbol]) {
          return { error: `Unknown element: ${symbol}` }
        }

        elements.push({ symbol, count })
      }

      if (elements.length === 0) {
        return { error: 'Invalid formula' }
      }

      const breakdown = elements.map(({ symbol, count }) => ({
        symbol,
        count,
        mass: atomicMasses[symbol],
        total: atomicMasses[symbol] * count,
      }))

      const totalMass = breakdown.reduce((sum, el) => sum + el.total, 0)

      return {
        breakdown,
        totalMass,
        moles: (1 / totalMass).toFixed(6),
      }
    } catch (e) {
      return { error: 'Invalid formula' }
    }
  }, [formula])

  const commonCompounds = [
    { formula: 'H2O', name: 'Water' },
    { formula: 'CO2', name: 'Carbon Dioxide' },
    { formula: 'NaCl', name: 'Salt' },
    { formula: 'C6H12O6', name: 'Glucose' },
    { formula: 'H2SO4', name: 'Sulfuric Acid' },
    { formula: 'C2H5OH', name: 'Ethanol' },
    { formula: 'NH3', name: 'Ammonia' },
    { formula: 'CaCO3', name: 'Calcium Carbonate' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {t('tools.molecularWeightCalculator.formula')}
        </label>
        <input
          type="text"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          placeholder="H2O, NaCl, C6H12O6..."
          className="w-full px-3 py-2 border border-slate-300 rounded text-lg font-mono"
        />
        <p className="text-xs text-slate-500 mt-1">
          {t('tools.molecularWeightCalculator.hint')}
        </p>
      </div>

      {result && !('error' in result) && (
        <>
          <div className="card p-4 bg-blue-50 text-center">
            <div className="text-sm text-slate-600">{t('tools.molecularWeightCalculator.molecularWeight')}</div>
            <div className="text-4xl font-bold text-blue-600">
              {result.totalMass.toFixed(3)}
            </div>
            <div className="text-sm text-slate-500">g/mol</div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.molecularWeightCalculator.breakdown')}
            </h3>
            <div className="space-y-2">
              {result.breakdown.map((el, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span>
                    <span className="font-bold">{el.symbol}</span>
                    {el.count > 1 && <sub>{el.count}</sub>}
                  </span>
                  <span className="text-slate-500">
                    {el.mass.toFixed(3)} × {el.count} = {el.total.toFixed(3)} g/mol
                  </span>
                </div>
              ))}
              <hr />
              <div className="flex justify-between font-medium">
                <span>{t('tools.molecularWeightCalculator.total')}</span>
                <span>{result.totalMass.toFixed(3)} g/mol</span>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              {t('tools.molecularWeightCalculator.conversions')}
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">1 gram =</span>
                <span>{result.moles} mol</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">1 mol =</span>
                <span>{result.totalMass.toFixed(3)} g</span>
              </div>
            </div>
          </div>
        </>
      )}

      {result && 'error' in result && (
        <div className="card p-4 bg-red-50 text-red-600 text-center">
          {result.error}
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.molecularWeightCalculator.common')}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {commonCompounds.map(({ formula: f, name }) => (
            <button
              key={f}
              onClick={() => setFormula(f)}
              className="p-2 bg-slate-50 rounded hover:bg-slate-100 text-left"
            >
              <div className="font-mono font-medium">{f}</div>
              <div className="text-xs text-slate-500">{name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
