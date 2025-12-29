import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface TempPreset {
  name: string
  celsius: number
  usage: string
}

const tempPresets: TempPreset[] = [
  { name: 'Very Low', celsius: 120, usage: 'Slow cooking, keeping warm' },
  { name: 'Low', celsius: 150, usage: 'Gentle baking, meringues' },
  { name: 'Moderate Low', celsius: 160, usage: 'Slow roasting' },
  { name: 'Moderate', celsius: 180, usage: 'General baking, cakes, cookies' },
  { name: 'Moderate High', celsius: 190, usage: 'Roasting vegetables' },
  { name: 'Hot', celsius: 200, usage: 'Bread, pastries' },
  { name: 'Very Hot', celsius: 220, usage: 'Pizza, quick roasting' },
  { name: 'Extremely Hot', celsius: 240, usage: 'High-heat searing' },
]

const meatTemps = [
  { meat: 'Beef (Rare)', internal: 52, celsius: true },
  { meat: 'Beef (Medium-Rare)', internal: 57, celsius: true },
  { meat: 'Beef (Medium)', internal: 63, celsius: true },
  { meat: 'Beef (Medium-Well)', internal: 68, celsius: true },
  { meat: 'Beef (Well Done)', internal: 74, celsius: true },
  { meat: 'Pork', internal: 63, celsius: true },
  { meat: 'Chicken/Turkey', internal: 74, celsius: true },
  { meat: 'Ground Meat', internal: 71, celsius: true },
  { meat: 'Fish', internal: 63, celsius: true },
]

export default function CookingTempConverter() {
  const { t } = useTranslation()
  const [celsius, setCelsius] = useState(180)
  const [fahrenheit, setFahrenheit] = useState(356)
  const [gasMark, setGasMark] = useState(4)
  const [lastEdited, setLastEdited] = useState<'c' | 'f' | 'gas'>('c')

  const celsiusToFahrenheit = (c: number) => (c * 9/5) + 32
  const fahrenheitToCelsius = (f: number) => (f - 32) * 5/9
  const celsiusToGasMark = (c: number) => Math.round((c - 121) / 14)
  const gasMarkToCelsius = (g: number) => (g * 14) + 121

  const handleCelsiusChange = (value: number) => {
    setCelsius(value)
    setFahrenheit(Math.round(celsiusToFahrenheit(value)))
    setGasMark(celsiusToGasMark(value))
    setLastEdited('c')
  }

  const handleFahrenheitChange = (value: number) => {
    setFahrenheit(value)
    const c = fahrenheitToCelsius(value)
    setCelsius(Math.round(c))
    setGasMark(celsiusToGasMark(c))
    setLastEdited('f')
  }

  const handleGasMarkChange = (value: number) => {
    setGasMark(value)
    const c = gasMarkToCelsius(value)
    setCelsius(Math.round(c))
    setFahrenheit(Math.round(celsiusToFahrenheit(c)))
    setLastEdited('gas')
  }

  const applyPreset = (preset: TempPreset) => {
    handleCelsiusChange(preset.celsius)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.cookingTempConverter.ovenTemperature')}</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-slate-500 mb-1">Celsius (°C)</label>
            <input
              type="number"
              value={celsius}
              onChange={e => handleCelsiusChange(parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded text-xl text-center ${
                lastEdited === 'c' ? 'border-blue-500 bg-blue-50' : 'border-slate-300'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-500 mb-1">Fahrenheit (°F)</label>
            <input
              type="number"
              value={fahrenheit}
              onChange={e => handleFahrenheitChange(parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded text-xl text-center ${
                lastEdited === 'f' ? 'border-blue-500 bg-blue-50' : 'border-slate-300'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-500 mb-1">Gas Mark</label>
            <input
              type="number"
              value={gasMark}
              onChange={e => handleGasMarkChange(parseInt(e.target.value) || 0)}
              min={1}
              max={10}
              className={`w-full px-3 py-2 border rounded text-xl text-center ${
                lastEdited === 'gas' ? 'border-blue-500 bg-blue-50' : 'border-slate-300'
              }`}
            />
          </div>
        </div>
      </div>

      <div className="card p-6 text-center bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-3xl font-bold">{celsius}°C</div>
            <div className="text-sm opacity-80">Celsius</div>
          </div>
          <div className="border-x border-white/20">
            <div className="text-3xl font-bold">{fahrenheit}°F</div>
            <div className="text-sm opacity-80">Fahrenheit</div>
          </div>
          <div>
            <div className="text-3xl font-bold">Gas {gasMark}</div>
            <div className="text-sm opacity-80">Gas Mark</div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.cookingTempConverter.commonTemperatures')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {tempPresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(preset)}
              className={`p-2 rounded text-left ${
                celsius === preset.celsius
                  ? 'bg-orange-100 border-2 border-orange-300'
                  : 'bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="font-medium">{preset.name}</div>
              <div className="text-sm text-blue-600">
                {preset.celsius}°C / {Math.round(celsiusToFahrenheit(preset.celsius))}°F
              </div>
              <div className="text-xs text-slate-500">{preset.usage}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.cookingTempConverter.meatDoneness')}</h3>
        <div className="space-y-2">
          {meatTemps.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded">
              <span>{item.meat}</span>
              <div className="text-right">
                <span className="font-bold text-blue-600">{item.internal}°C</span>
                <span className="text-slate-400 mx-2">/</span>
                <span className="text-slate-600">{Math.round(celsiusToFahrenheit(item.internal))}°F</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.cookingTempConverter.quickReference')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-right">°C</th>
                <th className="p-2 text-right">°F</th>
                <th className="p-2 text-right">Gas</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b"><td className="p-2">Water Boiling</td><td className="p-2 text-right">100</td><td className="p-2 text-right">212</td><td className="p-2 text-right">-</td></tr>
              <tr className="border-b"><td className="p-2">Low Oven</td><td className="p-2 text-right">150</td><td className="p-2 text-right">300</td><td className="p-2 text-right">2</td></tr>
              <tr className="border-b"><td className="p-2">Moderate Oven</td><td className="p-2 text-right">180</td><td className="p-2 text-right">350</td><td className="p-2 text-right">4</td></tr>
              <tr className="border-b"><td className="p-2">Hot Oven</td><td className="p-2 text-right">200</td><td className="p-2 text-right">400</td><td className="p-2 text-right">6</td></tr>
              <tr className="border-b"><td className="p-2">Very Hot Oven</td><td className="p-2 text-right">230</td><td className="p-2 text-right">450</td><td className="p-2 text-right">8</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
