import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type CalcMode = 'ohm' | 'power' | 'resistor' | 'capacitor' | 'inductor'

export default function ElectricalCalculator() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<CalcMode>('ohm')

  // Ohm's Law
  const [voltage, setVoltage] = useState('')
  const [current, setCurrent] = useState('')
  const [resistance, setResistance] = useState('')

  // Power
  const [power, setPower] = useState('')

  // Resistor color code
  const [band1, setBand1] = useState('brown')
  const [band2, setBand2] = useState('black')
  const [band3, setBand3] = useState('red')
  const [band4, setBand4] = useState('gold')

  // Capacitor/Inductor
  const [capacitance, setCapacitance] = useState('')
  const [inductance, setInductance] = useState('')
  const [frequency, setFrequency] = useState('')

  const [result, setResult] = useState<{ label: string; value: string }[] | null>(null)

  const colorValues: Record<string, number> = {
    black: 0, brown: 1, red: 2, orange: 3, yellow: 4,
    green: 5, blue: 6, violet: 7, grey: 8, white: 9
  }

  const multiplierValues: Record<string, number> = {
    black: 1, brown: 10, red: 100, orange: 1000, yellow: 10000,
    green: 100000, blue: 1000000, gold: 0.1, silver: 0.01
  }

  const toleranceValues: Record<string, string> = {
    brown: '±1%', red: '±2%', gold: '±5%', silver: '±10%', none: '±20%'
  }

  const colorOptions = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'grey', 'white']
  const multiplierOptions = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'gold', 'silver']
  const toleranceOptions = ['brown', 'red', 'gold', 'silver', 'none']

  const formatResistance = (ohms: number): string => {
    if (ohms >= 1000000) return `${(ohms / 1000000).toFixed(2)} MΩ`
    if (ohms >= 1000) return `${(ohms / 1000).toFixed(2)} kΩ`
    return `${ohms.toFixed(2)} Ω`
  }

  const calculate = () => {
    const results: { label: string; value: string }[] = []

    switch (mode) {
      case 'ohm': {
        const v = parseFloat(voltage)
        const i = parseFloat(current)
        const r = parseFloat(resistance)

        // V = IR
        if (!isNaN(i) && !isNaN(r) && isNaN(v)) {
          results.push({ label: 'V (Voltage)', value: `${(i * r).toFixed(4)} V` })
        }
        // I = V/R
        if (!isNaN(v) && !isNaN(r) && isNaN(i)) {
          results.push({ label: 'I (Current)', value: `${(v / r).toFixed(4)} A` })
        }
        // R = V/I
        if (!isNaN(v) && !isNaN(i) && isNaN(r)) {
          results.push({ label: 'R (Resistance)', value: formatResistance(v / i) })
        }
        break
      }
      case 'power': {
        const v = parseFloat(voltage)
        const i = parseFloat(current)
        const r = parseFloat(resistance)
        const p = parseFloat(power)

        // P = VI, P = I²R, P = V²/R
        if (!isNaN(v) && !isNaN(i)) {
          results.push({ label: 'P (Power)', value: `${(v * i).toFixed(4)} W` })
        } else if (!isNaN(i) && !isNaN(r)) {
          results.push({ label: 'P (Power)', value: `${(i * i * r).toFixed(4)} W` })
        } else if (!isNaN(v) && !isNaN(r)) {
          results.push({ label: 'P (Power)', value: `${(v * v / r).toFixed(4)} W` })
        }

        // Calculate other values from power
        if (!isNaN(p)) {
          if (!isNaN(v)) {
            results.push({ label: 'I (Current)', value: `${(p / v).toFixed(4)} A` })
          }
          if (!isNaN(i)) {
            results.push({ label: 'V (Voltage)', value: `${(p / i).toFixed(4)} V` })
          }
          if (!isNaN(r)) {
            results.push({ label: 'I (from P/R)', value: `${Math.sqrt(p / r).toFixed(4)} A` })
            results.push({ label: 'V (from P×R)', value: `${Math.sqrt(p * r).toFixed(4)} V` })
          }
        }
        break
      }
      case 'resistor': {
        const digit1 = colorValues[band1]
        const digit2 = colorValues[band2]
        const multiplier = multiplierValues[band3]
        const tolerance = toleranceValues[band4]

        const value = (digit1 * 10 + digit2) * multiplier
        results.push(
          { label: t('tools.electricalCalculator.resistance'), value: formatResistance(value) },
          { label: t('tools.electricalCalculator.tolerance'), value: tolerance }
        )
        break
      }
      case 'capacitor': {
        const c = parseFloat(capacitance) * 1e-6 // μF to F
        const f = parseFloat(frequency)

        if (!isNaN(c) && !isNaN(f) && f > 0) {
          const xc = 1 / (2 * Math.PI * f * c)
          results.push(
            { label: t('tools.electricalCalculator.capacitiveReactance'), value: formatResistance(xc) },
            { label: t('tools.electricalCalculator.timeConstant'), value: `${(c * 1000).toFixed(4)} ms (with 1kΩ)` }
          )
        }
        break
      }
      case 'inductor': {
        const l = parseFloat(inductance) * 1e-3 // mH to H
        const f = parseFloat(frequency)

        if (!isNaN(l) && !isNaN(f) && f > 0) {
          const xl = 2 * Math.PI * f * l
          results.push(
            { label: t('tools.electricalCalculator.inductiveReactance'), value: formatResistance(xl) },
            { label: t('tools.electricalCalculator.timeConstant'), value: `${(l * 1000).toFixed(4)} ms (with 1Ω)` }
          )
        }
        break
      }
    }

    setResult(results)
  }

  const modes = [
    { id: 'ohm', label: t('tools.electricalCalculator.ohmsLaw') },
    { id: 'power', label: t('tools.electricalCalculator.power') },
    { id: 'resistor', label: t('tools.electricalCalculator.resistorCode') },
    { id: 'capacitor', label: t('tools.electricalCalculator.capacitor') },
    { id: 'inductor', label: t('tools.electricalCalculator.inductor') },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {modes.map(m => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id as CalcMode); setResult(null) }}
            className={`px-3 py-1.5 rounded text-sm ${
              mode === m.id ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="card p-4">
        {(mode === 'ohm' || mode === 'power') && (
          <div className="space-y-3">
            <h3 className="font-medium">
              {mode === 'ohm' ? "Ohm's Law (V = IR)" : t('tools.electricalCalculator.powerCalc')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-slate-600 mb-1">V (Volts)</label>
                <input
                  type="number"
                  step="any"
                  value={voltage}
                  onChange={(e) => setVoltage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                  placeholder="Leave blank to calculate"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">I (Amps)</label>
                <input
                  type="number"
                  step="any"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                  placeholder="Leave blank to calculate"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">R (Ohms)</label>
                <input
                  type="number"
                  step="any"
                  value={resistance}
                  onChange={(e) => setResistance(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                  placeholder="Leave blank to calculate"
                />
              </div>
              {mode === 'power' && (
                <div>
                  <label className="block text-sm text-slate-600 mb-1">P (Watts)</label>
                  <input
                    type="number"
                    step="any"
                    value={power}
                    onChange={(e) => setPower(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                    placeholder="Leave blank to calculate"
                  />
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500">{t('tools.electricalCalculator.hint')}</p>
          </div>
        )}

        {mode === 'resistor' && (
          <div className="space-y-3">
            <h3 className="font-medium">{t('tools.electricalCalculator.resistorTitle')}</h3>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-xs text-slate-600 mb-1">{t('tools.electricalCalculator.band1')}</label>
                <select
                  value={band1}
                  onChange={(e) => setBand1(e.target.value)}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                >
                  {colorOptions.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">{t('tools.electricalCalculator.band2')}</label>
                <select
                  value={band2}
                  onChange={(e) => setBand2(e.target.value)}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                >
                  {colorOptions.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">{t('tools.electricalCalculator.multiplier')}</label>
                <select
                  value={band3}
                  onChange={(e) => setBand3(e.target.value)}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                >
                  {multiplierOptions.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">{t('tools.electricalCalculator.tolerance')}</label>
                <select
                  value={band4}
                  onChange={(e) => setBand4(e.target.value)}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                >
                  {toleranceOptions.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {mode === 'capacitor' && (
          <div className="space-y-3">
            <h3 className="font-medium">{t('tools.electricalCalculator.capacitorTitle')}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-slate-600 mb-1">C (μF)</label>
                <input
                  type="number"
                  step="any"
                  value={capacitance}
                  onChange={(e) => setCapacitance(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">f (Hz)</label>
                <input
                  type="number"
                  step="any"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {mode === 'inductor' && (
          <div className="space-y-3">
            <h3 className="font-medium">{t('tools.electricalCalculator.inductorTitle')}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-slate-600 mb-1">L (mH)</label>
                <input
                  type="number"
                  step="any"
                  value={inductance}
                  onChange={(e) => setInductance(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">f (Hz)</label>
                <input
                  type="number"
                  step="any"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>
        )}

        <button
          onClick={calculate}
          className="w-full mt-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t('tools.electricalCalculator.calculate')}
        </button>
      </div>

      {result && result.length > 0 && (
        <div className="card p-4">
          <div className="space-y-2">
            {result.map((r, i) => (
              <div key={i} className="p-3 bg-green-50 rounded">
                <div className="text-sm text-green-600">{r.label}</div>
                <div className="font-mono text-lg font-bold text-green-700">{r.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.electricalCalculator.formulas')}</h4>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2 bg-white rounded">V = I × R</div>
          <div className="p-2 bg-white rounded">P = V × I</div>
          <div className="p-2 bg-white rounded">Xc = 1/(2πfC)</div>
          <div className="p-2 bg-white rounded">XL = 2πfL</div>
        </div>
      </div>
    </div>
  )
}
