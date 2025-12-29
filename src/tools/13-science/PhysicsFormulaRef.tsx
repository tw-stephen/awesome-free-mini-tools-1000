import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Formula {
  id: string
  name: string
  formula: string
  variables: string
  category: string
}

export default function PhysicsFormulaRef() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'mechanics', 'thermodynamics', 'electromagnetism', 'waves', 'modern']

  const formulas: Formula[] = [
    // Mechanics
    { id: '1', name: 'Velocity', formula: 'v = d/t', variables: 'v=velocity, d=distance, t=time', category: 'mechanics' },
    { id: '2', name: 'Acceleration', formula: 'a = (v-u)/t', variables: 'a=acceleration, v=final velocity, u=initial velocity, t=time', category: 'mechanics' },
    { id: '3', name: 'Force', formula: 'F = ma', variables: 'F=force, m=mass, a=acceleration', category: 'mechanics' },
    { id: '4', name: 'Weight', formula: 'W = mg', variables: 'W=weight, m=mass, g=gravitational acceleration', category: 'mechanics' },
    { id: '5', name: 'Kinetic Energy', formula: 'KE = (1/2)mv^2', variables: 'KE=kinetic energy, m=mass, v=velocity', category: 'mechanics' },
    { id: '6', name: 'Potential Energy', formula: 'PE = mgh', variables: 'PE=potential energy, m=mass, g=gravity, h=height', category: 'mechanics' },
    { id: '7', name: 'Work', formula: 'W = Fd cos(theta)', variables: 'W=work, F=force, d=distance, theta=angle', category: 'mechanics' },
    { id: '8', name: 'Power', formula: 'P = W/t', variables: 'P=power, W=work, t=time', category: 'mechanics' },
    { id: '9', name: 'Momentum', formula: 'p = mv', variables: 'p=momentum, m=mass, v=velocity', category: 'mechanics' },
    { id: '10', name: 'Impulse', formula: 'J = Ft', variables: 'J=impulse, F=force, t=time', category: 'mechanics' },
    { id: '11', name: 'Centripetal Force', formula: 'F = mv^2/r', variables: 'F=force, m=mass, v=velocity, r=radius', category: 'mechanics' },
    { id: '12', name: 'Gravitational Force', formula: 'F = Gm1m2/r^2', variables: 'F=force, G=gravitational constant, m=masses, r=distance', category: 'mechanics' },
    // Thermodynamics
    { id: '13', name: 'Heat Transfer', formula: 'Q = mcDeltaT', variables: 'Q=heat, m=mass, c=specific heat, DeltaT=temperature change', category: 'thermodynamics' },
    { id: '14', name: 'Ideal Gas Law', formula: 'PV = nRT', variables: 'P=pressure, V=volume, n=moles, R=gas constant, T=temperature', category: 'thermodynamics' },
    { id: '15', name: 'First Law', formula: 'DeltaU = Q - W', variables: 'DeltaU=internal energy change, Q=heat, W=work', category: 'thermodynamics' },
    { id: '16', name: 'Entropy', formula: 'DeltaS = Q/T', variables: 'DeltaS=entropy change, Q=heat, T=temperature', category: 'thermodynamics' },
    { id: '17', name: 'Thermal Expansion', formula: 'DeltaL = alphaL0DeltaT', variables: 'DeltaL=length change, alpha=coefficient, L0=original length', category: 'thermodynamics' },
    // Electromagnetism
    { id: '18', name: 'Ohms Law', formula: 'V = IR', variables: 'V=voltage, I=current, R=resistance', category: 'electromagnetism' },
    { id: '19', name: 'Electric Power', formula: 'P = IV = I^2R = V^2/R', variables: 'P=power, I=current, V=voltage, R=resistance', category: 'electromagnetism' },
    { id: '20', name: 'Coulombs Law', formula: 'F = kq1q2/r^2', variables: 'F=force, k=Coulombs constant, q=charges, r=distance', category: 'electromagnetism' },
    { id: '21', name: 'Electric Field', formula: 'E = F/q', variables: 'E=electric field, F=force, q=charge', category: 'electromagnetism' },
    { id: '22', name: 'Capacitance', formula: 'C = Q/V', variables: 'C=capacitance, Q=charge, V=voltage', category: 'electromagnetism' },
    { id: '23', name: 'Magnetic Force', formula: 'F = qvB sin(theta)', variables: 'F=force, q=charge, v=velocity, B=magnetic field', category: 'electromagnetism' },
    // Waves
    { id: '24', name: 'Wave Speed', formula: 'v = f*lambda', variables: 'v=velocity, f=frequency, lambda=wavelength', category: 'waves' },
    { id: '25', name: 'Period', formula: 'T = 1/f', variables: 'T=period, f=frequency', category: 'waves' },
    { id: '26', name: 'Doppler Effect', formula: 'f = f0(v+vr)/(v+vs)', variables: 'f=observed frequency, f0=source frequency, v=wave speed', category: 'waves' },
    { id: '27', name: 'Snells Law', formula: 'n1 sin(theta1) = n2 sin(theta2)', variables: 'n=refractive index, theta=angle', category: 'waves' },
    { id: '28', name: 'Lens Equation', formula: '1/f = 1/do + 1/di', variables: 'f=focal length, do=object distance, di=image distance', category: 'waves' },
    // Modern Physics
    { id: '29', name: 'Einsteins Energy', formula: 'E = mc^2', variables: 'E=energy, m=mass, c=speed of light', category: 'modern' },
    { id: '30', name: 'Photon Energy', formula: 'E = hf', variables: 'E=energy, h=Plancks constant, f=frequency', category: 'modern' },
    { id: '31', name: 'de Broglie', formula: 'lambda = h/p', variables: 'lambda=wavelength, h=Plancks constant, p=momentum', category: 'modern' },
    { id: '32', name: 'Photoelectric', formula: 'KE = hf - phi', variables: 'KE=kinetic energy, h=Plancks constant, phi=work function', category: 'modern' },
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
          placeholder={t('tools.physicsFormulaRef.search')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded text-sm capitalize ${
              selectedCategory === cat ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t(`tools.physicsFormulaRef.categories.${cat}`)}
          </button>
        ))}
      </div>

      <div className="text-sm text-slate-500">
        {filteredFormulas.length} {t('tools.physicsFormulaRef.formulas')}
      </div>

      <div className="space-y-2">
        {filteredFormulas.map(formula => (
          <div key={formula.id} className="card p-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{formula.name}</div>
                <div className="text-xl font-mono text-blue-600 my-1">{formula.formula}</div>
                <div className="text-xs text-slate-500">{formula.variables}</div>
              </div>
              <button
                onClick={() => copyFormula(formula.formula)}
                className="text-xs text-blue-500 px-2 py-1 bg-blue-50 rounded"
              >
                {t('tools.physicsFormulaRef.copy')}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium mb-2">{t('tools.physicsFormulaRef.constants')}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>g = 9.8 m/s^2</div>
          <div>c = 3x10^8 m/s</div>
          <div>G = 6.67x10^-11 Nm^2/kg^2</div>
          <div>h = 6.63x10^-34 Js</div>
          <div>k = 9x10^9 Nm^2/C^2</div>
          <div>e = 1.6x10^-19 C</div>
        </div>
      </div>
    </div>
  )
}
