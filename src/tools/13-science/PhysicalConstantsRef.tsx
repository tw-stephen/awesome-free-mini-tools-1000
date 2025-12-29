import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Constant {
  name: string
  symbol: string
  value: string
  unit: string
  category: string
}

export default function PhysicalConstantsRef() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'fundamental', 'electromagnetic', 'atomic', 'astronomical', 'thermodynamic']

  const constants: Constant[] = [
    // Fundamental
    { name: 'Speed of light in vacuum', symbol: 'c', value: '299,792,458', unit: 'm/s', category: 'fundamental' },
    { name: 'Planck constant', symbol: 'h', value: '6.62607015 x 10^-34', unit: 'J s', category: 'fundamental' },
    { name: 'Reduced Planck constant', symbol: 'hbar', value: '1.054571817 x 10^-34', unit: 'J s', category: 'fundamental' },
    { name: 'Gravitational constant', symbol: 'G', value: '6.67430 x 10^-11', unit: 'N m^2/kg^2', category: 'fundamental' },
    { name: 'Boltzmann constant', symbol: 'k', value: '1.380649 x 10^-23', unit: 'J/K', category: 'fundamental' },
    { name: 'Avogadro constant', symbol: 'N_A', value: '6.02214076 x 10^23', unit: 'mol^-1', category: 'fundamental' },

    // Electromagnetic
    { name: 'Elementary charge', symbol: 'e', value: '1.602176634 x 10^-19', unit: 'C', category: 'electromagnetic' },
    { name: 'Electric constant (permittivity)', symbol: 'epsilon_0', value: '8.8541878128 x 10^-12', unit: 'F/m', category: 'electromagnetic' },
    { name: 'Magnetic constant (permeability)', symbol: 'mu_0', value: '1.25663706212 x 10^-6', unit: 'H/m', category: 'electromagnetic' },
    { name: 'Coulomb constant', symbol: 'k_e', value: '8.9875517923 x 10^9', unit: 'N m^2/C^2', category: 'electromagnetic' },

    // Atomic
    { name: 'Electron mass', symbol: 'm_e', value: '9.1093837015 x 10^-31', unit: 'kg', category: 'atomic' },
    { name: 'Proton mass', symbol: 'm_p', value: '1.67262192369 x 10^-27', unit: 'kg', category: 'atomic' },
    { name: 'Neutron mass', symbol: 'm_n', value: '1.67492749804 x 10^-27', unit: 'kg', category: 'atomic' },
    { name: 'Atomic mass unit', symbol: 'u', value: '1.66053906660 x 10^-27', unit: 'kg', category: 'atomic' },
    { name: 'Bohr radius', symbol: 'a_0', value: '5.29177210903 x 10^-11', unit: 'm', category: 'atomic' },
    { name: 'Rydberg constant', symbol: 'R_inf', value: '1.0973731568160 x 10^7', unit: 'm^-1', category: 'atomic' },
    { name: 'Fine-structure constant', symbol: 'alpha', value: '7.2973525693 x 10^-3', unit: 'dimensionless', category: 'atomic' },

    // Astronomical
    { name: 'Astronomical unit', symbol: 'AU', value: '1.495978707 x 10^11', unit: 'm', category: 'astronomical' },
    { name: 'Light-year', symbol: 'ly', value: '9.4607304725808 x 10^15', unit: 'm', category: 'astronomical' },
    { name: 'Parsec', symbol: 'pc', value: '3.0856775814914 x 10^16', unit: 'm', category: 'astronomical' },
    { name: 'Solar mass', symbol: 'M_sun', value: '1.98892 x 10^30', unit: 'kg', category: 'astronomical' },
    { name: 'Earth mass', symbol: 'M_earth', value: '5.9722 x 10^24', unit: 'kg', category: 'astronomical' },
    { name: 'Earth radius (equatorial)', symbol: 'R_earth', value: '6.378137 x 10^6', unit: 'm', category: 'astronomical' },

    // Thermodynamic
    { name: 'Gas constant', symbol: 'R', value: '8.314462618', unit: 'J/(mol K)', category: 'thermodynamic' },
    { name: 'Stefan-Boltzmann constant', symbol: 'sigma', value: '5.670374419 x 10^-8', unit: 'W/(m^2 K^4)', category: 'thermodynamic' },
    { name: 'Standard atmosphere', symbol: 'atm', value: '101,325', unit: 'Pa', category: 'thermodynamic' },
    { name: 'Molar volume (ideal gas, STP)', symbol: 'V_m', value: '22.41396954', unit: 'L/mol', category: 'thermodynamic' },
  ]

  const filteredConstants = constants.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const copyValue = async (value: string) => {
    await navigator.clipboard.writeText(value.replace(/,/g, ''))
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('tools.physicalConstantsRef.search')}
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
            {t(`tools.physicalConstantsRef.categories.${cat}`)}
          </button>
        ))}
      </div>

      <div className="text-sm text-slate-500">
        {filteredConstants.length} {t('tools.physicalConstantsRef.constants')}
      </div>

      <div className="space-y-2">
        {filteredConstants.map((constant, index) => (
          <div key={index} className="card p-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{constant.name}</div>
                <div className="text-lg font-mono text-blue-600 my-1">
                  {constant.symbol} = {constant.value}
                </div>
                <div className="text-sm text-slate-500">{constant.unit}</div>
              </div>
              <button
                onClick={() => copyValue(constant.value)}
                className="text-xs text-blue-500 px-2 py-1 bg-blue-50 rounded"
              >
                {t('tools.physicalConstantsRef.copy')}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium mb-2">{t('tools.physicalConstantsRef.note')}</h3>
        <p className="text-sm text-slate-600">
          {t('tools.physicalConstantsRef.noteText')}
        </p>
      </div>
    </div>
  )
}
