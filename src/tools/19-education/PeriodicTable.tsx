import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Element {
  number: number
  symbol: string
  name: string
  mass: number
  category: string
  group: number
  period: number
}

export default function PeriodicTable() {
  const { t } = useTranslation()
  const [selectedElement, setSelectedElement] = useState<Element | null>(null)
  const [search, setSearch] = useState('')

  const elements: Element[] = [
    { number: 1, symbol: 'H', name: 'Hydrogen', mass: 1.008, category: 'nonmetal', group: 1, period: 1 },
    { number: 2, symbol: 'He', name: 'Helium', mass: 4.003, category: 'noble-gas', group: 18, period: 1 },
    { number: 3, symbol: 'Li', name: 'Lithium', mass: 6.941, category: 'alkali-metal', group: 1, period: 2 },
    { number: 4, symbol: 'Be', name: 'Beryllium', mass: 9.012, category: 'alkaline-earth', group: 2, period: 2 },
    { number: 5, symbol: 'B', name: 'Boron', mass: 10.81, category: 'metalloid', group: 13, period: 2 },
    { number: 6, symbol: 'C', name: 'Carbon', mass: 12.01, category: 'nonmetal', group: 14, period: 2 },
    { number: 7, symbol: 'N', name: 'Nitrogen', mass: 14.01, category: 'nonmetal', group: 15, period: 2 },
    { number: 8, symbol: 'O', name: 'Oxygen', mass: 16.00, category: 'nonmetal', group: 16, period: 2 },
    { number: 9, symbol: 'F', name: 'Fluorine', mass: 19.00, category: 'halogen', group: 17, period: 2 },
    { number: 10, symbol: 'Ne', name: 'Neon', mass: 20.18, category: 'noble-gas', group: 18, period: 2 },
    { number: 11, symbol: 'Na', name: 'Sodium', mass: 22.99, category: 'alkali-metal', group: 1, period: 3 },
    { number: 12, symbol: 'Mg', name: 'Magnesium', mass: 24.31, category: 'alkaline-earth', group: 2, period: 3 },
    { number: 13, symbol: 'Al', name: 'Aluminum', mass: 26.98, category: 'post-transition', group: 13, period: 3 },
    { number: 14, symbol: 'Si', name: 'Silicon', mass: 28.09, category: 'metalloid', group: 14, period: 3 },
    { number: 15, symbol: 'P', name: 'Phosphorus', mass: 30.97, category: 'nonmetal', group: 15, period: 3 },
    { number: 16, symbol: 'S', name: 'Sulfur', mass: 32.07, category: 'nonmetal', group: 16, period: 3 },
    { number: 17, symbol: 'Cl', name: 'Chlorine', mass: 35.45, category: 'halogen', group: 17, period: 3 },
    { number: 18, symbol: 'Ar', name: 'Argon', mass: 39.95, category: 'noble-gas', group: 18, period: 3 },
    { number: 19, symbol: 'K', name: 'Potassium', mass: 39.10, category: 'alkali-metal', group: 1, period: 4 },
    { number: 20, symbol: 'Ca', name: 'Calcium', mass: 40.08, category: 'alkaline-earth', group: 2, period: 4 },
    { number: 26, symbol: 'Fe', name: 'Iron', mass: 55.85, category: 'transition-metal', group: 8, period: 4 },
    { number: 29, symbol: 'Cu', name: 'Copper', mass: 63.55, category: 'transition-metal', group: 11, period: 4 },
    { number: 30, symbol: 'Zn', name: 'Zinc', mass: 65.38, category: 'transition-metal', group: 12, period: 4 },
    { number: 47, symbol: 'Ag', name: 'Silver', mass: 107.87, category: 'transition-metal', group: 11, period: 5 },
    { number: 79, symbol: 'Au', name: 'Gold', mass: 196.97, category: 'transition-metal', group: 11, period: 6 },
  ]

  const categoryColors: { [key: string]: string } = {
    'nonmetal': 'bg-green-100 hover:bg-green-200 text-green-800',
    'noble-gas': 'bg-purple-100 hover:bg-purple-200 text-purple-800',
    'alkali-metal': 'bg-red-100 hover:bg-red-200 text-red-800',
    'alkaline-earth': 'bg-orange-100 hover:bg-orange-200 text-orange-800',
    'metalloid': 'bg-teal-100 hover:bg-teal-200 text-teal-800',
    'halogen': 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800',
    'transition-metal': 'bg-blue-100 hover:bg-blue-200 text-blue-800',
    'post-transition': 'bg-slate-100 hover:bg-slate-200 text-slate-800',
  }

  const filteredElements = search
    ? elements.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.symbol.toLowerCase().includes(search.toLowerCase()) ||
        e.number.toString().includes(search)
      )
    : elements

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, symbol, or number..."
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      {selectedElement && (
        <div className="card p-4 border-2 border-blue-400">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-4xl font-bold">{selectedElement.symbol}</div>
              <div className="text-xl">{selectedElement.name}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-slate-400">{selectedElement.number}</div>
              <div className="text-sm text-slate-500">{selectedElement.mass} u</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="p-2 bg-slate-50 rounded">
              <span className="text-slate-500">Category:</span>
              <span className="ml-2 capitalize">{selectedElement.category.replace('-', ' ')}</span>
            </div>
            <div className="p-2 bg-slate-50 rounded">
              <span className="text-slate-500">Group:</span>
              <span className="ml-2">{selectedElement.group}</span>
            </div>
            <div className="p-2 bg-slate-50 rounded">
              <span className="text-slate-500">Period:</span>
              <span className="ml-2">{selectedElement.period}</span>
            </div>
            <div className="p-2 bg-slate-50 rounded">
              <span className="text-slate-500">Atomic Mass:</span>
              <span className="ml-2">{selectedElement.mass}</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedElement(null)}
            className="mt-3 w-full py-2 bg-slate-100 rounded hover:bg-slate-200 text-sm"
          >
            Close
          </button>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.periodicTable.elements')}</h3>
        <div className="grid grid-cols-5 gap-2">
          {filteredElements.map(element => (
            <button
              key={element.number}
              onClick={() => setSelectedElement(element)}
              className={`p-2 rounded text-center transition-colors ${categoryColors[element.category]}`}
            >
              <div className="text-xs text-slate-500">{element.number}</div>
              <div className="text-xl font-bold">{element.symbol}</div>
              <div className="text-xs truncate">{element.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.periodicTable.legend')}</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(categoryColors).map(([category, color]) => (
            <div key={category} className={`p-2 rounded text-sm ${color}`}>
              {category.replace('-', ' ')}
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium mb-2 text-blue-700">{t('tools.periodicTable.info')}</h3>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• Click any element for detailed information</li>
          <li>• Search by name, symbol, or atomic number</li>
          <li>• Elements are color-coded by category</li>
          <li>• Atomic mass is in unified atomic mass units (u)</li>
        </ul>
      </div>
    </div>
  )
}
