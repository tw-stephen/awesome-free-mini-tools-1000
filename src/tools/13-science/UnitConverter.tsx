import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Category = 'length' | 'weight' | 'volume' | 'area' | 'speed' | 'temperature' | 'pressure' | 'energy'

interface UnitDefinition {
  name: string
  toBase: (value: number) => number
  fromBase: (value: number) => number
}

const units: Record<Category, Record<string, UnitDefinition>> = {
  length: {
    meter: { name: 'm', toBase: v => v, fromBase: v => v },
    kilometer: { name: 'km', toBase: v => v * 1000, fromBase: v => v / 1000 },
    centimeter: { name: 'cm', toBase: v => v / 100, fromBase: v => v * 100 },
    millimeter: { name: 'mm', toBase: v => v / 1000, fromBase: v => v * 1000 },
    mile: { name: 'mi', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
    yard: { name: 'yd', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
    foot: { name: 'ft', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    inch: { name: 'in', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
  },
  weight: {
    kilogram: { name: 'kg', toBase: v => v, fromBase: v => v },
    gram: { name: 'g', toBase: v => v / 1000, fromBase: v => v * 1000 },
    milligram: { name: 'mg', toBase: v => v / 1000000, fromBase: v => v * 1000000 },
    pound: { name: 'lb', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
    ounce: { name: 'oz', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
    ton: { name: 't', toBase: v => v * 1000, fromBase: v => v / 1000 },
  },
  volume: {
    liter: { name: 'L', toBase: v => v, fromBase: v => v },
    milliliter: { name: 'mL', toBase: v => v / 1000, fromBase: v => v * 1000 },
    cubicMeter: { name: 'm³', toBase: v => v * 1000, fromBase: v => v / 1000 },
    gallon: { name: 'gal', toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
    quart: { name: 'qt', toBase: v => v * 0.946353, fromBase: v => v / 0.946353 },
    pint: { name: 'pt', toBase: v => v * 0.473176, fromBase: v => v / 0.473176 },
    cup: { name: 'cup', toBase: v => v * 0.236588, fromBase: v => v / 0.236588 },
    fluidOunce: { name: 'fl oz', toBase: v => v * 0.0295735, fromBase: v => v / 0.0295735 },
  },
  area: {
    squareMeter: { name: 'm²', toBase: v => v, fromBase: v => v },
    squareKilometer: { name: 'km²', toBase: v => v * 1000000, fromBase: v => v / 1000000 },
    squareCentimeter: { name: 'cm²', toBase: v => v / 10000, fromBase: v => v * 10000 },
    squareFoot: { name: 'ft²', toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
    squareInch: { name: 'in²', toBase: v => v * 0.00064516, fromBase: v => v / 0.00064516 },
    acre: { name: 'acre', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
    hectare: { name: 'ha', toBase: v => v * 10000, fromBase: v => v / 10000 },
  },
  speed: {
    meterPerSecond: { name: 'm/s', toBase: v => v, fromBase: v => v },
    kilometerPerHour: { name: 'km/h', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
    milePerHour: { name: 'mph', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
    knot: { name: 'kn', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
    footPerSecond: { name: 'ft/s', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
  },
  temperature: {
    celsius: { name: '°C', toBase: v => v, fromBase: v => v },
    fahrenheit: { name: '°F', toBase: v => (v - 32) * 5/9, fromBase: v => v * 9/5 + 32 },
    kelvin: { name: 'K', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
  },
  pressure: {
    pascal: { name: 'Pa', toBase: v => v, fromBase: v => v },
    kilopascal: { name: 'kPa', toBase: v => v * 1000, fromBase: v => v / 1000 },
    bar: { name: 'bar', toBase: v => v * 100000, fromBase: v => v / 100000 },
    psi: { name: 'psi', toBase: v => v * 6894.76, fromBase: v => v / 6894.76 },
    atm: { name: 'atm', toBase: v => v * 101325, fromBase: v => v / 101325 },
  },
  energy: {
    joule: { name: 'J', toBase: v => v, fromBase: v => v },
    kilojoule: { name: 'kJ', toBase: v => v * 1000, fromBase: v => v / 1000 },
    calorie: { name: 'cal', toBase: v => v * 4.184, fromBase: v => v / 4.184 },
    kilocalorie: { name: 'kcal', toBase: v => v * 4184, fromBase: v => v / 4184 },
    wattHour: { name: 'Wh', toBase: v => v * 3600, fromBase: v => v / 3600 },
    kilowattHour: { name: 'kWh', toBase: v => v * 3600000, fromBase: v => v / 3600000 },
    btu: { name: 'BTU', toBase: v => v * 1055.06, fromBase: v => v / 1055.06 },
  },
}

export default function UnitConverter() {
  const { t } = useTranslation()
  const [category, setCategory] = useState<Category>('length')
  const [fromUnit, setFromUnit] = useState('meter')
  const [toUnit, setToUnit] = useState('foot')
  const [fromValue, setFromValue] = useState('1')
  const [toValue, setToValue] = useState('')

  const convert = (value: string, from: string, to: string, cat: Category) => {
    const num = parseFloat(value)
    if (isNaN(num)) return ''

    const categoryUnits = units[cat]
    const baseValue = categoryUnits[from].toBase(num)
    const result = categoryUnits[to].fromBase(baseValue)
    return result.toPrecision(10).replace(/\.?0+$/, '')
  }

  const handleFromValueChange = (value: string) => {
    setFromValue(value)
    setToValue(convert(value, fromUnit, toUnit, category))
  }

  const handleToValueChange = (value: string) => {
    setToValue(value)
    setFromValue(convert(value, toUnit, fromUnit, category))
  }

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat)
    const unitKeys = Object.keys(units[cat])
    setFromUnit(unitKeys[0])
    setToUnit(unitKeys[1] || unitKeys[0])
    setFromValue('1')
    setToValue(convert('1', unitKeys[0], unitKeys[1] || unitKeys[0], cat))
  }

  const swapUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    setFromValue(toValue)
    setToValue(fromValue)
  }

  const categories: { id: Category; label: string }[] = [
    { id: 'length', label: t('tools.unitConverter.length') },
    { id: 'weight', label: t('tools.unitConverter.weight') },
    { id: 'volume', label: t('tools.unitConverter.volume') },
    { id: 'area', label: t('tools.unitConverter.area') },
    { id: 'speed', label: t('tools.unitConverter.speed') },
    { id: 'temperature', label: t('tools.unitConverter.temperature') },
    { id: 'pressure', label: t('tools.unitConverter.pressure') },
    { id: 'energy', label: t('tools.unitConverter.energy') },
  ]

  const currentUnits = units[category]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-3 py-1.5 rounded text-sm ${
              category === cat.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="card p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm text-slate-600 mb-1">{t('tools.unitConverter.from')}</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={fromValue}
                onChange={(e) => handleFromValueChange(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
              />
              <select
                value={fromUnit}
                onChange={(e) => {
                  setFromUnit(e.target.value)
                  setToValue(convert(fromValue, e.target.value, toUnit, category))
                }}
                className="px-3 py-2 border border-slate-300 rounded"
              >
                {Object.entries(currentUnits).map(([key, unit]) => (
                  <option key={key} value={key}>{unit.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={swapUnits}
              className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"
              title={t('tools.unitConverter.swap')}
            >
              ⇄
            </button>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-slate-600 mb-1">{t('tools.unitConverter.to')}</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={toValue}
                onChange={(e) => handleToValueChange(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
              />
              <select
                value={toUnit}
                onChange={(e) => {
                  setToUnit(e.target.value)
                  setToValue(convert(fromValue, fromUnit, e.target.value, category))
                }}
                className="px-3 py-2 border border-slate-300 rounded"
              >
                {Object.entries(currentUnits).map(([key, unit]) => (
                  <option key={key} value={key}>{unit.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.unitConverter.allConversions')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {Object.entries(currentUnits).map(([key, unit]) => {
            if (key === fromUnit) return null
            const converted = convert(fromValue, fromUnit, key, category)
            return (
              <div key={key} className="p-2 bg-slate-50 rounded">
                <span className="font-mono">{converted}</span>
                <span className="text-slate-500 ml-1">{unit.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
