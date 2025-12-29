import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface FoodPortion {
  name: string
  category: string
  portionPer: string
  amount: number
  unit: string
}

const portionGuide: FoodPortion[] = [
  // Proteins
  { name: 'Chicken/Beef/Pork', category: 'protein', portionPer: 'person', amount: 170, unit: 'g' },
  { name: 'Fish Fillet', category: 'protein', portionPer: 'person', amount: 150, unit: 'g' },
  { name: 'Shrimp (with shell)', category: 'protein', portionPer: 'person', amount: 200, unit: 'g' },
  { name: 'Eggs', category: 'protein', portionPer: 'person', amount: 2, unit: 'pieces' },

  // Grains
  { name: 'Rice (uncooked)', category: 'grains', portionPer: 'person', amount: 75, unit: 'g' },
  { name: 'Pasta (uncooked)', category: 'grains', portionPer: 'person', amount: 85, unit: 'g' },
  { name: 'Bread', category: 'grains', portionPer: 'person', amount: 2, unit: 'slices' },
  { name: 'Potatoes', category: 'grains', portionPer: 'person', amount: 200, unit: 'g' },

  // Vegetables
  { name: 'Salad Greens', category: 'vegetables', portionPer: 'person', amount: 100, unit: 'g' },
  { name: 'Cooked Vegetables', category: 'vegetables', portionPer: 'person', amount: 150, unit: 'g' },
  { name: 'Soup', category: 'vegetables', portionPer: 'person', amount: 250, unit: 'ml' },

  // Party Foods
  { name: 'Appetizers (mixed)', category: 'party', portionPer: 'person', amount: 8, unit: 'pieces' },
  { name: 'Pizza', category: 'party', portionPer: 'person', amount: 3, unit: 'slices' },
  { name: 'Chips/Snacks', category: 'party', portionPer: 'person', amount: 100, unit: 'g' },
  { name: 'Dips', category: 'party', portionPer: 'person', amount: 60, unit: 'g' },

  // Beverages
  { name: 'Wine', category: 'beverages', portionPer: 'person', amount: 2, unit: 'glasses' },
  { name: 'Beer', category: 'beverages', portionPer: 'person', amount: 2, unit: 'bottles' },
  { name: 'Soft Drinks', category: 'beverages', portionPer: 'person', amount: 500, unit: 'ml' },
  { name: 'Coffee/Tea', category: 'beverages', portionPer: 'person', amount: 2, unit: 'cups' },

  // Desserts
  { name: 'Cake', category: 'desserts', portionPer: 'person', amount: 1, unit: 'slice' },
  { name: 'Ice Cream', category: 'desserts', portionPer: 'person', amount: 100, unit: 'g' },
  { name: 'Cookies', category: 'desserts', portionPer: 'person', amount: 2, unit: 'pieces' },
]

const categories = [
  { id: 'protein', name: 'Protein', icon: '🥩' },
  { id: 'grains', name: 'Grains & Starches', icon: '🍚' },
  { id: 'vegetables', name: 'Vegetables', icon: '🥗' },
  { id: 'party', name: 'Party Foods', icon: '🎉' },
  { id: 'beverages', name: 'Beverages', icon: '🥤' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
]

export default function PortionCalculator() {
  const { t } = useTranslation()
  const [guests, setGuests] = useState(4)
  const [eventType, setEventType] = useState<'meal' | 'party' | 'buffet'>('meal')
  const [selectedCategory, setSelectedCategory] = useState('protein')

  const getMultiplier = () => {
    switch (eventType) {
      case 'party': return 0.7 // Light eating at parties
      case 'buffet': return 1.2 // People eat more at buffets
      default: return 1
    }
  }

  const calculatePortion = (portion: FoodPortion) => {
    const baseAmount = portion.amount * guests * getMultiplier()
    return {
      amount: baseAmount,
      unit: portion.unit,
    }
  }

  const filteredPortions = portionGuide.filter(p => p.category === selectedCategory)

  const formatAmount = (amount: number) => {
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}kg`
    }
    return amount.toFixed(0)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.portionCalculator.eventDetails')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500">{t('tools.portionCalculator.numberOfGuests')}</label>
            <input
              type="number"
              value={guests}
              onChange={e => setGuests(parseInt(e.target.value) || 1)}
              min={1}
              max={500}
              className="w-full px-3 py-2 border border-slate-300 rounded text-xl text-center"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500">{t('tools.portionCalculator.eventType')}</label>
            <select
              value={eventType}
              onChange={e => setEventType(e.target.value as typeof eventType)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              <option value="meal">Sit-down Meal</option>
              <option value="party">Cocktail Party</option>
              <option value="buffet">Buffet</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {[2, 4, 6, 8, 10, 12, 20, 50].map(num => (
            <button
              key={num}
              onClick={() => setGuests(num)}
              className={`px-3 py-1 rounded ${
                guests === num ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-2 rounded text-center ${
                selectedCategory === cat.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <div className="text-xl">{cat.icon}</div>
              <div className="text-xs mt-1">{cat.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">
          {categories.find(c => c.id === selectedCategory)?.icon}{' '}
          {categories.find(c => c.id === selectedCategory)?.name} {t('tools.portionCalculator.for')} {guests} {t('tools.portionCalculator.guests')}
        </h3>
        <div className="space-y-2">
          {filteredPortions.map((portion, idx) => {
            const calculated = calculatePortion(portion)
            return (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                <div>
                  <div className="font-medium">{portion.name}</div>
                  <div className="text-xs text-slate-500">
                    {portion.amount} {portion.unit} per person
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-600">
                    {portion.unit === 'g' || portion.unit === 'ml'
                      ? formatAmount(calculated.amount)
                      : `${Math.ceil(calculated.amount)} ${calculated.unit}`
                    }
                  </div>
                  {(portion.unit === 'g' || portion.unit === 'ml') && (
                    <div className="text-xs text-slate-500">
                      {calculated.amount.toFixed(0)} {calculated.unit}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-4 bg-yellow-50">
        <h3 className="font-medium mb-2">{t('tools.portionCalculator.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>- {t('tools.portionCalculator.tip1')}</li>
          <li>- {t('tools.portionCalculator.tip2')}</li>
          <li>- {t('tools.portionCalculator.tip3')}</li>
          <li>- {t('tools.portionCalculator.tip4')}</li>
        </ul>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.portionCalculator.quickReference')}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-slate-50 rounded">
            <div className="font-medium">1 chicken breast</div>
            <div className="text-slate-500">~170g / 6oz</div>
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <div className="font-medium">1 cup rice (cooked)</div>
            <div className="text-slate-500">~180g / 6oz</div>
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <div className="font-medium">1 bottle wine</div>
            <div className="text-slate-500">~5 glasses</div>
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <div className="font-medium">1 lb pasta (dry)</div>
            <div className="text-slate-500">~8 servings</div>
          </div>
        </div>
      </div>
    </div>
  )
}
