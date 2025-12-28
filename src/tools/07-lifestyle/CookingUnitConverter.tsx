import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type UnitCategory = 'volume' | 'weight' | 'temperature'

interface ConversionUnit {
  id: string
  name: string
  category: UnitCategory
  toBase: (value: number) => number
  fromBase: (value: number) => number
}

export default function CookingUnitConverter() {
  const { t } = useTranslation()
  const [category, setCategory] = useState<UnitCategory>('volume')
  const [fromUnit, setFromUnit] = useState('cup')
  const [toUnit, setToUnit] = useState('ml')
  const [value, setValue] = useState('1')

  const units: ConversionUnit[] = [
    // Volume (base: ml)
    { id: 'ml', name: 'Milliliter (ml)', category: 'volume', toBase: v => v, fromBase: v => v },
    { id: 'l', name: 'Liter (L)', category: 'volume', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { id: 'tsp', name: 'Teaspoon (tsp)', category: 'volume', toBase: v => v * 4.929, fromBase: v => v / 4.929 },
    { id: 'tbsp', name: 'Tablespoon (tbsp)', category: 'volume', toBase: v => v * 14.787, fromBase: v => v / 14.787 },
    { id: 'cup', name: 'Cup', category: 'volume', toBase: v => v * 236.588, fromBase: v => v / 236.588 },
    { id: 'floz', name: 'Fluid Ounce (fl oz)', category: 'volume', toBase: v => v * 29.574, fromBase: v => v / 29.574 },
    { id: 'pint', name: 'Pint', category: 'volume', toBase: v => v * 473.176, fromBase: v => v / 473.176 },
    { id: 'quart', name: 'Quart', category: 'volume', toBase: v => v * 946.353, fromBase: v => v / 946.353 },
    { id: 'gallon', name: 'Gallon', category: 'volume', toBase: v => v * 3785.41, fromBase: v => v / 3785.41 },

    // Weight (base: g)
    { id: 'g', name: 'Gram (g)', category: 'weight', toBase: v => v, fromBase: v => v },
    { id: 'kg', name: 'Kilogram (kg)', category: 'weight', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { id: 'oz', name: 'Ounce (oz)', category: 'weight', toBase: v => v * 28.3495, fromBase: v => v / 28.3495 },
    { id: 'lb', name: 'Pound (lb)', category: 'weight', toBase: v => v * 453.592, fromBase: v => v / 453.592 },

    // Temperature (base: celsius)
    { id: 'celsius', name: 'Celsius (°C)', category: 'temperature', toBase: v => v, fromBase: v => v },
    { id: 'fahrenheit', name: 'Fahrenheit (°F)', category: 'temperature', toBase: v => (v - 32) * 5/9, fromBase: v => v * 9/5 + 32 },
    { id: 'gas', name: 'Gas Mark', category: 'temperature', toBase: v => (v * 14) + 121, fromBase: v => (v - 121) / 14 },
  ]

  const categoryUnits = useMemo(() => {
    return units.filter(u => u.category === category)
  }, [category])

  const result = useMemo(() => {
    const num = parseFloat(value) || 0
    const from = units.find(u => u.id === fromUnit)
    const to = units.find(u => u.id === toUnit)

    if (!from || !to || from.category !== to.category) return '0'

    const baseValue = from.toBase(num)
    const converted = to.fromBase(baseValue)

    return converted.toFixed(4).replace(/\.?0+$/, '')
  }, [value, fromUnit, toUnit])

  const handleCategoryChange = (newCategory: UnitCategory) => {
    setCategory(newCategory)
    const newUnits = units.filter(u => u.category === newCategory)
    setFromUnit(newUnits[0]?.id || '')
    setToUnit(newUnits[1]?.id || newUnits[0]?.id || '')
  }

  const swapUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
  }

  // Common conversions quick reference
  const quickRef = [
    { from: '1 cup', to: '236.6 ml' },
    { from: '1 tbsp', to: '14.8 ml' },
    { from: '1 tsp', to: '4.9 ml' },
    { from: '1 oz', to: '28.3 g' },
    { from: '1 lb', to: '453.6 g' },
    { from: '350°F', to: '177°C' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          {(['volume', 'weight', 'temperature'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`flex-1 py-2 rounded font-medium ${
                category === cat ? 'bg-blue-500 text-white' : 'bg-slate-200'
              }`}
            >
              {t(`tools.cookingConverter.${cat}`)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.cookingConverter.value')}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>

          <div className="grid grid-cols-5 gap-2 items-center">
            <div className="col-span-2">
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.cookingConverter.from')}
              </label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              >
                {categoryUnits.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-center">
              <button
                onClick={swapUnits}
                className="p-2 bg-slate-100 rounded hover:bg-slate-200"
              >
                ⇄
              </button>
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.cookingConverter.to')}
              </label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              >
                {categoryUnits.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="text-center">
          <div className="text-sm text-slate-500 mb-1">
            {t('tools.cookingConverter.result')}
          </div>
          <div className="text-3xl font-bold text-blue-600">
            {result} {units.find(u => u.id === toUnit)?.name.split(' ')[0]}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.cookingConverter.quickReference')}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {quickRef.map((ref, i) => (
            <div key={i} className="flex justify-between p-2 bg-slate-50 rounded text-sm">
              <span>{ref.from}</span>
              <span className="text-slate-500">=</span>
              <span className="font-medium">{ref.to}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.cookingConverter.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.cookingConverter.tip1')}</li>
          <li>{t('tools.cookingConverter.tip2')}</li>
          <li>{t('tools.cookingConverter.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
