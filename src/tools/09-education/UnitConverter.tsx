import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type Category = 'length' | 'weight' | 'temperature' | 'volume' | 'area' | 'time'

const conversions: Record<Category, Record<string, number>> = {
  length: {
    meter: 1,
    kilometer: 1000,
    centimeter: 0.01,
    millimeter: 0.001,
    mile: 1609.344,
    yard: 0.9144,
    foot: 0.3048,
    inch: 0.0254,
  },
  weight: {
    kilogram: 1,
    gram: 0.001,
    milligram: 0.000001,
    pound: 0.453592,
    ounce: 0.0283495,
    ton: 1000,
  },
  temperature: {
    celsius: 1, // Special handling
    fahrenheit: 1,
    kelvin: 1,
  },
  volume: {
    liter: 1,
    milliliter: 0.001,
    gallon: 3.78541,
    quart: 0.946353,
    pint: 0.473176,
    cup: 0.236588,
    'fluid ounce': 0.0295735,
  },
  area: {
    'square meter': 1,
    'square kilometer': 1000000,
    'square foot': 0.092903,
    'square yard': 0.836127,
    acre: 4046.86,
    hectare: 10000,
  },
  time: {
    second: 1,
    minute: 60,
    hour: 3600,
    day: 86400,
    week: 604800,
    month: 2628000,
    year: 31536000,
  },
}

export default function UnitConverter() {
  const { t } = useTranslation()
  const [category, setCategory] = useState<Category>('length')
  const [fromUnit, setFromUnit] = useState('meter')
  const [toUnit, setToUnit] = useState('foot')
  const [value, setValue] = useState('')

  const units = Object.keys(conversions[category])

  const result = useMemo(() => {
    const num = parseFloat(value)
    if (isNaN(num)) return null

    if (category === 'temperature') {
      let celsius: number
      // Convert to Celsius first
      if (fromUnit === 'celsius') celsius = num
      else if (fromUnit === 'fahrenheit') celsius = (num - 32) * 5 / 9
      else celsius = num - 273.15 // kelvin

      // Convert from Celsius to target
      if (toUnit === 'celsius') return celsius
      if (toUnit === 'fahrenheit') return celsius * 9 / 5 + 32
      return celsius + 273.15 // kelvin
    }

    const inBase = num * conversions[category][fromUnit]
    return inBase / conversions[category][toUnit]
  }, [value, category, fromUnit, toUnit])

  const swap = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
  }

  const categories: { key: Category; label: string }[] = [
    { key: 'length', label: t('tools.unitConverter.length') },
    { key: 'weight', label: t('tools.unitConverter.weight') },
    { key: 'temperature', label: t('tools.unitConverter.temperature') },
    { key: 'volume', label: t('tools.unitConverter.volume') },
    { key: 'area', label: t('tools.unitConverter.area') },
    { key: 'time', label: t('tools.unitConverter.time') },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => {
              setCategory(cat.key)
              const u = Object.keys(conversions[cat.key])
              setFromUnit(u[0])
              setToUnit(u[1])
            }}
            className={`px-3 py-1 rounded text-sm ${
              category === cat.key ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="card p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.unitConverter.from')}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0"
              className="flex-1 px-3 py-2 border border-slate-300 rounded text-lg"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded"
            >
              {units.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={swap}
            className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"
          >
            ⇅
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('tools.unitConverter.to')}
          </label>
          <div className="flex gap-2">
            <div className="flex-1 px-3 py-2 border border-slate-300 rounded text-lg bg-slate-50">
              {result !== null ? result.toFixed(6).replace(/\.?0+$/, '') : '—'}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded"
            >
              {units.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {value && result !== null && (
        <div className="card p-4 bg-blue-50 text-center">
          <div className="text-lg">
            <span className="font-bold">{value}</span> {fromUnit} =
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {result.toFixed(6).replace(/\.?0+$/, '')} {toUnit}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.unitConverter.quickRef')}
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {category === 'length' && (
            <>
              <div className="p-2 bg-slate-50 rounded">1 mile = 1.609 km</div>
              <div className="p-2 bg-slate-50 rounded">1 foot = 30.48 cm</div>
              <div className="p-2 bg-slate-50 rounded">1 inch = 2.54 cm</div>
              <div className="p-2 bg-slate-50 rounded">1 yard = 0.914 m</div>
            </>
          )}
          {category === 'weight' && (
            <>
              <div className="p-2 bg-slate-50 rounded">1 lb = 0.454 kg</div>
              <div className="p-2 bg-slate-50 rounded">1 oz = 28.35 g</div>
              <div className="p-2 bg-slate-50 rounded">1 kg = 2.205 lb</div>
              <div className="p-2 bg-slate-50 rounded">1 ton = 1000 kg</div>
            </>
          )}
          {category === 'temperature' && (
            <>
              <div className="p-2 bg-slate-50 rounded">0°C = 32°F</div>
              <div className="p-2 bg-slate-50 rounded">100°C = 212°F</div>
              <div className="p-2 bg-slate-50 rounded">0°C = 273.15 K</div>
              <div className="p-2 bg-slate-50 rounded">-40°C = -40°F</div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
