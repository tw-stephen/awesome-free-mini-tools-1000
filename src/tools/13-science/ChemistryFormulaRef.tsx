import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Formula {
  id: string
  name: string
  formula: string
  description: string
  category: string
}

export default function ChemistryFormulaRef() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'general', 'stoichiometry', 'solutions', 'gases', 'acids', 'electrochemistry']

  const formulas: Formula[] = [
    // General
    { id: '1', name: 'Molar Mass', formula: 'M = m/n', description: 'M=molar mass (g/mol), m=mass (g), n=moles', category: 'general' },
    { id: '2', name: 'Number of Moles', formula: 'n = m/M = N/NA', description: 'n=moles, m=mass, M=molar mass, N=particles, NA=Avogadro', category: 'general' },
    { id: '3', name: 'Density', formula: 'rho = m/V', description: 'rho=density, m=mass, V=volume', category: 'general' },
    { id: '4', name: 'Avogadros Number', formula: 'NA = 6.022 x 10^23', description: 'Number of particles per mole', category: 'general' },
    // Stoichiometry
    { id: '5', name: 'Percent Composition', formula: '% = (mass of element / total mass) x 100', description: 'Mass percentage of element in compound', category: 'stoichiometry' },
    { id: '6', name: 'Percent Yield', formula: '% yield = (actual/theoretical) x 100', description: 'Efficiency of a chemical reaction', category: 'stoichiometry' },
    { id: '7', name: 'Empirical Formula', formula: 'Simplest whole number ratio', description: 'Divide by smallest mole value', category: 'stoichiometry' },
    // Solutions
    { id: '8', name: 'Molarity', formula: 'M = n/V', description: 'M=molarity (mol/L), n=moles of solute, V=volume (L)', category: 'solutions' },
    { id: '9', name: 'Dilution', formula: 'M1V1 = M2V2', description: 'Concentration x Volume remains constant', category: 'solutions' },
    { id: '10', name: 'Molality', formula: 'm = n/kg solvent', description: 'm=molality, n=moles, kg=mass of solvent', category: 'solutions' },
    { id: '11', name: 'Mass Percent', formula: '% = (mass solute/mass solution) x 100', description: 'Mass concentration of solution', category: 'solutions' },
    { id: '12', name: 'PPM', formula: 'ppm = (mass solute/mass solution) x 10^6', description: 'Parts per million', category: 'solutions' },
    // Gases
    { id: '13', name: 'Ideal Gas Law', formula: 'PV = nRT', description: 'P=pressure, V=volume, n=moles, R=8.314, T=temp(K)', category: 'gases' },
    { id: '14', name: 'Boyles Law', formula: 'P1V1 = P2V2', description: 'At constant T, pressure inversely proportional to volume', category: 'gases' },
    { id: '15', name: 'Charles Law', formula: 'V1/T1 = V2/T2', description: 'At constant P, volume proportional to temperature', category: 'gases' },
    { id: '16', name: 'Combined Gas Law', formula: 'P1V1/T1 = P2V2/T2', description: 'Relates P, V, T for fixed amount of gas', category: 'gases' },
    { id: '17', name: 'Daltons Law', formula: 'Ptotal = P1 + P2 + P3...', description: 'Total pressure equals sum of partial pressures', category: 'gases' },
    { id: '18', name: 'STP Molar Volume', formula: 'V = 22.4 L/mol', description: 'Volume of 1 mole of gas at STP', category: 'gases' },
    // Acids and Bases
    { id: '19', name: 'pH', formula: 'pH = -log[H+]', description: 'Measure of acidity', category: 'acids' },
    { id: '20', name: 'pOH', formula: 'pOH = -log[OH-]', description: 'Measure of basicity', category: 'acids' },
    { id: '21', name: 'pH + pOH', formula: 'pH + pOH = 14', description: 'At 25C for aqueous solutions', category: 'acids' },
    { id: '22', name: 'Ka', formula: 'Ka = [H+][A-]/[HA]', description: 'Acid dissociation constant', category: 'acids' },
    { id: '23', name: 'Kb', formula: 'Kb = [BH+][OH-]/[B]', description: 'Base dissociation constant', category: 'acids' },
    { id: '24', name: 'Kw', formula: 'Kw = [H+][OH-] = 10^-14', description: 'Water autoionization constant', category: 'acids' },
    // Electrochemistry
    { id: '25', name: 'Cell Potential', formula: 'E = E(cathode) - E(anode)', description: 'Standard cell potential', category: 'electrochemistry' },
    { id: '26', name: 'Gibbs Free Energy', formula: 'DeltaG = -nFE', description: 'DeltaG=free energy, n=moles e-, F=Faraday, E=potential', category: 'electrochemistry' },
    { id: '27', name: 'Nernst Equation', formula: 'E = E0 - (RT/nF)lnQ', description: 'Cell potential at non-standard conditions', category: 'electrochemistry' },
    { id: '28', name: 'Faradays Law', formula: 'm = (ItM)/(nF)', description: 'Mass deposited in electrolysis', category: 'electrochemistry' },
  ]

  const filteredFormulas = formulas.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.formula.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const copyFormula = async (formula: string) => {
    await navigator.clipboard.writeText(formula)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('tools.chemistryFormulaRef.search')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded text-sm capitalize ${
              selectedCategory === cat ? 'bg-green-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t(`tools.chemistryFormulaRef.categories.${cat}`)}
          </button>
        ))}
      </div>

      <div className="text-sm text-slate-500">
        {filteredFormulas.length} {t('tools.chemistryFormulaRef.formulas')}
      </div>

      <div className="space-y-2">
        {filteredFormulas.map(formula => (
          <div key={formula.id} className="card p-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{formula.name}</div>
                <div className="text-xl font-mono text-green-600 my-1">{formula.formula}</div>
                <div className="text-xs text-slate-500">{formula.description}</div>
              </div>
              <button
                onClick={() => copyFormula(formula.formula)}
                className="text-xs text-green-500 px-2 py-1 bg-green-50 rounded"
              >
                {t('tools.chemistryFormulaRef.copy')}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-4 bg-green-50">
        <h3 className="font-medium mb-2">{t('tools.chemistryFormulaRef.constants')}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>NA = 6.022x10^23 mol^-1</div>
          <div>R = 8.314 J/(mol*K)</div>
          <div>F = 96485 C/mol</div>
          <div>STP: 0C, 1 atm</div>
          <div>1 atm = 101.325 kPa</div>
          <div>Kw = 10^-14</div>
        </div>
      </div>
    </div>
  )
}
