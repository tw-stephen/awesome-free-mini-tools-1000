import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Element {
  number: number
  symbol: string
  name: string
  mass: number
  category: string
  electronConfig: string
  group: number
  period: number
}

export default function PeriodicTableLookup() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedElement, setSelectedElement] = useState<Element | null>(null)

  const elements: Element[] = [
    { number: 1, symbol: 'H', name: 'Hydrogen', mass: 1.008, category: 'nonmetal', electronConfig: '1s1', group: 1, period: 1 },
    { number: 2, symbol: 'He', name: 'Helium', mass: 4.003, category: 'noble gas', electronConfig: '1s2', group: 18, period: 1 },
    { number: 3, symbol: 'Li', name: 'Lithium', mass: 6.941, category: 'alkali metal', electronConfig: '[He] 2s1', group: 1, period: 2 },
    { number: 4, symbol: 'Be', name: 'Beryllium', mass: 9.012, category: 'alkaline earth', electronConfig: '[He] 2s2', group: 2, period: 2 },
    { number: 5, symbol: 'B', name: 'Boron', mass: 10.81, category: 'metalloid', electronConfig: '[He] 2s2 2p1', group: 13, period: 2 },
    { number: 6, symbol: 'C', name: 'Carbon', mass: 12.01, category: 'nonmetal', electronConfig: '[He] 2s2 2p2', group: 14, period: 2 },
    { number: 7, symbol: 'N', name: 'Nitrogen', mass: 14.01, category: 'nonmetal', electronConfig: '[He] 2s2 2p3', group: 15, period: 2 },
    { number: 8, symbol: 'O', name: 'Oxygen', mass: 16.00, category: 'nonmetal', electronConfig: '[He] 2s2 2p4', group: 16, period: 2 },
    { number: 9, symbol: 'F', name: 'Fluorine', mass: 19.00, category: 'halogen', electronConfig: '[He] 2s2 2p5', group: 17, period: 2 },
    { number: 10, symbol: 'Ne', name: 'Neon', mass: 20.18, category: 'noble gas', electronConfig: '[He] 2s2 2p6', group: 18, period: 2 },
    { number: 11, symbol: 'Na', name: 'Sodium', mass: 22.99, category: 'alkali metal', electronConfig: '[Ne] 3s1', group: 1, period: 3 },
    { number: 12, symbol: 'Mg', name: 'Magnesium', mass: 24.31, category: 'alkaline earth', electronConfig: '[Ne] 3s2', group: 2, period: 3 },
    { number: 13, symbol: 'Al', name: 'Aluminum', mass: 26.98, category: 'post-transition', electronConfig: '[Ne] 3s2 3p1', group: 13, period: 3 },
    { number: 14, symbol: 'Si', name: 'Silicon', mass: 28.09, category: 'metalloid', electronConfig: '[Ne] 3s2 3p2', group: 14, period: 3 },
    { number: 15, symbol: 'P', name: 'Phosphorus', mass: 30.97, category: 'nonmetal', electronConfig: '[Ne] 3s2 3p3', group: 15, period: 3 },
    { number: 16, symbol: 'S', name: 'Sulfur', mass: 32.07, category: 'nonmetal', electronConfig: '[Ne] 3s2 3p4', group: 16, period: 3 },
    { number: 17, symbol: 'Cl', name: 'Chlorine', mass: 35.45, category: 'halogen', electronConfig: '[Ne] 3s2 3p5', group: 17, period: 3 },
    { number: 18, symbol: 'Ar', name: 'Argon', mass: 39.95, category: 'noble gas', electronConfig: '[Ne] 3s2 3p6', group: 18, period: 3 },
    { number: 19, symbol: 'K', name: 'Potassium', mass: 39.10, category: 'alkali metal', electronConfig: '[Ar] 4s1', group: 1, period: 4 },
    { number: 20, symbol: 'Ca', name: 'Calcium', mass: 40.08, category: 'alkaline earth', electronConfig: '[Ar] 4s2', group: 2, period: 4 },
    { number: 26, symbol: 'Fe', name: 'Iron', mass: 55.85, category: 'transition metal', electronConfig: '[Ar] 3d6 4s2', group: 8, period: 4 },
    { number: 29, symbol: 'Cu', name: 'Copper', mass: 63.55, category: 'transition metal', electronConfig: '[Ar] 3d10 4s1', group: 11, period: 4 },
    { number: 30, symbol: 'Zn', name: 'Zinc', mass: 65.38, category: 'transition metal', electronConfig: '[Ar] 3d10 4s2', group: 12, period: 4 },
    { number: 47, symbol: 'Ag', name: 'Silver', mass: 107.87, category: 'transition metal', electronConfig: '[Kr] 4d10 5s1', group: 11, period: 5 },
    { number: 79, symbol: 'Au', name: 'Gold', mass: 196.97, category: 'transition metal', electronConfig: '[Xe] 4f14 5d10 6s1', group: 11, period: 6 },
    { number: 82, symbol: 'Pb', name: 'Lead', mass: 207.2, category: 'post-transition', electronConfig: '[Xe] 4f14 5d10 6s2 6p2', group: 14, period: 6 },
  ]

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'nonmetal': 'bg-green-100 border-green-500',
      'noble gas': 'bg-purple-100 border-purple-500',
      'alkali metal': 'bg-red-100 border-red-500',
      'alkaline earth': 'bg-orange-100 border-orange-500',
      'metalloid': 'bg-teal-100 border-teal-500',
      'halogen': 'bg-yellow-100 border-yellow-500',
      'transition metal': 'bg-blue-100 border-blue-500',
      'post-transition': 'bg-slate-100 border-slate-500',
    }
    return colors[category] || 'bg-slate-100 border-slate-300'
  }

  const filteredElements = elements.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.number.toString().includes(searchQuery)
  )

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('tools.periodicTableLookup.search')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="grid grid-cols-5 gap-2">
        {filteredElements.map(element => (
          <button
            key={element.number}
            onClick={() => setSelectedElement(element)}
            className={`p-2 rounded border-2 text-center ${getCategoryColor(element.category)} ${
              selectedElement?.number === element.number ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="text-xs text-slate-500">{element.number}</div>
            <div className="text-xl font-bold">{element.symbol}</div>
            <div className="text-xs truncate">{element.name}</div>
          </button>
        ))}
      </div>

      {selectedElement && (
        <div className="card p-4 bg-blue-50">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-20 h-20 flex items-center justify-center rounded-lg border-4 ${getCategoryColor(selectedElement.category)}`}>
              <div className="text-center">
                <div className="text-xs">{selectedElement.number}</div>
                <div className="text-3xl font-bold">{selectedElement.symbol}</div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{selectedElement.name}</h2>
              <div className="text-sm text-slate-500 capitalize">{selectedElement.category}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 bg-white rounded">
              <div className="text-xs text-slate-500">{t('tools.periodicTableLookup.atomicNumber')}</div>
              <div className="font-bold">{selectedElement.number}</div>
            </div>
            <div className="p-2 bg-white rounded">
              <div className="text-xs text-slate-500">{t('tools.periodicTableLookup.atomicMass')}</div>
              <div className="font-bold">{selectedElement.mass} u</div>
            </div>
            <div className="p-2 bg-white rounded">
              <div className="text-xs text-slate-500">{t('tools.periodicTableLookup.group')}</div>
              <div className="font-bold">{selectedElement.group}</div>
            </div>
            <div className="p-2 bg-white rounded">
              <div className="text-xs text-slate-500">{t('tools.periodicTableLookup.period')}</div>
              <div className="font-bold">{selectedElement.period}</div>
            </div>
            <div className="col-span-2 p-2 bg-white rounded">
              <div className="text-xs text-slate-500">{t('tools.periodicTableLookup.electronConfig')}</div>
              <div className="font-mono">{selectedElement.electronConfig}</div>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-2">{t('tools.periodicTableLookup.legend')}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {['nonmetal', 'noble gas', 'alkali metal', 'alkaline earth', 'metalloid', 'halogen', 'transition metal', 'post-transition'].map(cat => (
            <div key={cat} className={`p-2 rounded border-l-4 ${getCategoryColor(cat)} capitalize`}>
              {cat}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
