import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Element {
  number: number
  symbol: string
  name: string
  mass: number
  category: string
}

const elements: Element[] = [
  { number: 1, symbol: 'H', name: 'Hydrogen', mass: 1.008, category: 'nonmetal' },
  { number: 2, symbol: 'He', name: 'Helium', mass: 4.003, category: 'noble-gas' },
  { number: 3, symbol: 'Li', name: 'Lithium', mass: 6.941, category: 'alkali-metal' },
  { number: 4, symbol: 'Be', name: 'Beryllium', mass: 9.012, category: 'alkaline-earth' },
  { number: 5, symbol: 'B', name: 'Boron', mass: 10.81, category: 'metalloid' },
  { number: 6, symbol: 'C', name: 'Carbon', mass: 12.01, category: 'nonmetal' },
  { number: 7, symbol: 'N', name: 'Nitrogen', mass: 14.01, category: 'nonmetal' },
  { number: 8, symbol: 'O', name: 'Oxygen', mass: 16.00, category: 'nonmetal' },
  { number: 9, symbol: 'F', name: 'Fluorine', mass: 19.00, category: 'halogen' },
  { number: 10, symbol: 'Ne', name: 'Neon', mass: 20.18, category: 'noble-gas' },
  { number: 11, symbol: 'Na', name: 'Sodium', mass: 22.99, category: 'alkali-metal' },
  { number: 12, symbol: 'Mg', name: 'Magnesium', mass: 24.31, category: 'alkaline-earth' },
  { number: 13, symbol: 'Al', name: 'Aluminum', mass: 26.98, category: 'post-transition' },
  { number: 14, symbol: 'Si', name: 'Silicon', mass: 28.09, category: 'metalloid' },
  { number: 15, symbol: 'P', name: 'Phosphorus', mass: 30.97, category: 'nonmetal' },
  { number: 16, symbol: 'S', name: 'Sulfur', mass: 32.07, category: 'nonmetal' },
  { number: 17, symbol: 'Cl', name: 'Chlorine', mass: 35.45, category: 'halogen' },
  { number: 18, symbol: 'Ar', name: 'Argon', mass: 39.95, category: 'noble-gas' },
  { number: 19, symbol: 'K', name: 'Potassium', mass: 39.10, category: 'alkali-metal' },
  { number: 20, symbol: 'Ca', name: 'Calcium', mass: 40.08, category: 'alkaline-earth' },
  { number: 26, symbol: 'Fe', name: 'Iron', mass: 55.85, category: 'transition' },
  { number: 29, symbol: 'Cu', name: 'Copper', mass: 63.55, category: 'transition' },
  { number: 30, symbol: 'Zn', name: 'Zinc', mass: 65.38, category: 'transition' },
  { number: 47, symbol: 'Ag', name: 'Silver', mass: 107.87, category: 'transition' },
  { number: 79, symbol: 'Au', name: 'Gold', mass: 196.97, category: 'transition' },
]

const categoryColors: Record<string, string> = {
  'nonmetal': 'bg-green-100 hover:bg-green-200 text-green-800',
  'noble-gas': 'bg-purple-100 hover:bg-purple-200 text-purple-800',
  'alkali-metal': 'bg-red-100 hover:bg-red-200 text-red-800',
  'alkaline-earth': 'bg-orange-100 hover:bg-orange-200 text-orange-800',
  'metalloid': 'bg-teal-100 hover:bg-teal-200 text-teal-800',
  'halogen': 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800',
  'transition': 'bg-blue-100 hover:bg-blue-200 text-blue-800',
  'post-transition': 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800',
}

export default function PeriodicTable() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Element | null>(null)

  const filteredElements = elements.filter(el =>
    el.name.toLowerCase().includes(search.toLowerCase()) ||
    el.symbol.toLowerCase().includes(search.toLowerCase()) ||
    el.number.toString().includes(search)
  )

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('tools.periodicTable.search')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      {selected && (
        <div className={`card p-4 ${categoryColors[selected.category]}`}>
          <div className="flex justify-between items-start">
            <div>
              <div className="text-4xl font-bold">{selected.symbol}</div>
              <div className="text-lg font-medium">{selected.name}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{selected.number}</div>
              <div className="text-sm">{selected.mass.toFixed(3)}</div>
            </div>
          </div>
          <div className="mt-3 text-sm">
            {t('tools.periodicTable.category')}: {selected.category.replace('-', ' ')}
          </div>
          <button
            onClick={() => setSelected(null)}
            className="mt-2 text-sm underline"
          >
            {t('tools.periodicTable.close')}
          </button>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.periodicTable.elements')} ({filteredElements.length})
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {filteredElements.map(el => (
            <button
              key={el.number}
              onClick={() => setSelected(el)}
              className={`p-2 rounded text-center transition-all ${categoryColors[el.category]} ${
                selected?.number === el.number ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="text-xs text-slate-500">{el.number}</div>
              <div className="text-lg font-bold">{el.symbol}</div>
              <div className="text-xs truncate">{el.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.periodicTable.legend')}</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Object.entries(categoryColors).map(([cat, color]) => (
            <div key={cat} className={`p-1 rounded ${color.split(' ')[0]}`}>
              {cat.replace('-', ' ')}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
