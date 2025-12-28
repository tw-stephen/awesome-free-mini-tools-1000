import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface FrequencyUnit {
  id: string
  name: string
  toHz: number
}

const frequencyUnits: FrequencyUnit[] = [
  { id: 'hz', name: 'Hertz (Hz)', toHz: 1 },
  { id: 'khz', name: 'Kilohertz (kHz)', toHz: 1000 },
  { id: 'mhz', name: 'Megahertz (MHz)', toHz: 1e6 },
  { id: 'ghz', name: 'Gigahertz (GHz)', toHz: 1e9 },
  { id: 'thz', name: 'Terahertz (THz)', toHz: 1e12 },
  { id: 'rpm', name: 'RPM (rev/min)', toHz: 1 / 60 },
  { id: 'rps', name: 'RPS (rev/s)', toHz: 1 },
  { id: 'bpm', name: 'BPM (beats/min)', toHz: 1 / 60 },
  { id: 'radps', name: 'rad/s', toHz: 1 / (2 * Math.PI) },
]

export default function FrequencyCalculator() {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState('1000')
  const [inputUnit, setInputUnit] = useState('hz')
  const [conversions, setConversions] = useState<Record<string, number>>({})

  const convert = () => {
    const value = parseFloat(inputValue)
    if (isNaN(value) || value <= 0) {
      setConversions({})
      return
    }

    const inputUnitDef = frequencyUnits.find(u => u.id === inputUnit)
    if (!inputUnitDef) return

    const hz = value * inputUnitDef.toHz
    const results: Record<string, number> = {}

    frequencyUnits.forEach(unit => {
      results[unit.id] = hz / unit.toHz
    })

    // Add derived values
    results['period_s'] = 1 / hz
    results['period_ms'] = 1000 / hz
    results['period_us'] = 1e6 / hz
    results['wavelength_light'] = 299792458 / hz // Speed of light
    results['wavelength_sound'] = 343 / hz // Speed of sound in air

    setConversions(results)
  }

  useEffect(() => {
    convert()
  }, [inputValue, inputUnit])

  const formatNumber = (num: number): string => {
    if (num === 0) return '0'
    if (Math.abs(num) < 0.0001) return num.toExponential(4)
    if (Math.abs(num) >= 1e12) return num.toExponential(4)
    return num.toLocaleString(undefined, { maximumFractionDigits: 6 })
  }

  const formatWavelength = (meters: number): string => {
    if (meters >= 1000) return `${formatNumber(meters / 1000)} km`
    if (meters >= 1) return `${formatNumber(meters)} m`
    if (meters >= 0.01) return `${formatNumber(meters * 100)} cm`
    if (meters >= 0.001) return `${formatNumber(meters * 1000)} mm`
    if (meters >= 1e-6) return `${formatNumber(meters * 1e6)} μm`
    if (meters >= 1e-9) return `${formatNumber(meters * 1e9)} nm`
    return `${formatNumber(meters * 1e12)} pm`
  }

  const quickValues = [
    { label: '60 Hz', value: 60, unit: 'hz' },
    { label: '440 Hz', value: 440, unit: 'hz' },
    { label: '1 kHz', value: 1, unit: 'khz' },
    { label: '2.4 GHz', value: 2.4, unit: 'ghz' },
    { label: '120 BPM', value: 120, unit: 'bpm' },
  ]

  const frequencyExamples = [
    { name: t('tools.frequencyCalculator.humanHearing'), value: '20 Hz - 20 kHz' },
    { name: t('tools.frequencyCalculator.middleA'), value: '440 Hz' },
    { name: t('tools.frequencyCalculator.acPower'), value: '50/60 Hz' },
    { name: t('tools.frequencyCalculator.wifi'), value: '2.4 / 5 GHz' },
    { name: t('tools.frequencyCalculator.cpu'), value: '2-5 GHz' },
    { name: t('tools.frequencyCalculator.visibleLight'), value: '400-800 THz' },
  ]

  const musicalNotes = [
    { note: 'C4', freq: 261.63 },
    { note: 'D4', freq: 293.66 },
    { note: 'E4', freq: 329.63 },
    { note: 'F4', freq: 349.23 },
    { note: 'G4', freq: 392.00 },
    { note: 'A4', freq: 440.00 },
    { note: 'B4', freq: 493.88 },
    { note: 'C5', freq: 523.25 },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium mb-2">
          {t('tools.frequencyCalculator.enterFrequency')}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            step="any"
            min="0"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-lg"
          />
          <select
            value={inputUnit}
            onChange={(e) => setInputUnit(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded"
          >
            {frequencyUnits.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {quickValues.map((q, i) => (
            <button
              key={i}
              onClick={() => { setInputValue(q.value.toString()); setInputUnit(q.unit) }}
              className="px-2 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {Object.keys(conversions).length > 0 && (
        <>
          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.frequencyCalculator.conversions')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {frequencyUnits.slice(0, 6).map(unit => (
                <div
                  key={unit.id}
                  className={`p-3 rounded ${unit.id === inputUnit ? 'bg-blue-50 border-2 border-blue-300' : 'bg-slate-50'}`}
                >
                  <div className="text-sm text-slate-600">{unit.name}</div>
                  <div className="text-lg font-bold font-mono">
                    {formatNumber(conversions[unit.id])}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4 bg-purple-50">
            <h3 className="font-medium mb-3">{t('tools.frequencyCalculator.periodWavelength')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-2 bg-white rounded">
                <div className="text-xs text-slate-600">{t('tools.frequencyCalculator.period')}</div>
                <div className="font-mono font-bold">
                  {conversions.period_s >= 1
                    ? `${formatNumber(conversions.period_s)} s`
                    : conversions.period_ms >= 1
                      ? `${formatNumber(conversions.period_ms)} ms`
                      : `${formatNumber(conversions.period_us)} μs`
                  }
                </div>
              </div>
              <div className="p-2 bg-white rounded">
                <div className="text-xs text-slate-600">{t('tools.frequencyCalculator.angularFreq')}</div>
                <div className="font-mono font-bold">{formatNumber(conversions.radps)} rad/s</div>
              </div>
              <div className="p-2 bg-white rounded">
                <div className="text-xs text-slate-600">{t('tools.frequencyCalculator.soundWavelength')}</div>
                <div className="font-mono font-bold">{formatWavelength(conversions.wavelength_sound)}</div>
              </div>
              <div className="p-2 bg-white rounded">
                <div className="text-xs text-slate-600">{t('tools.frequencyCalculator.emWavelength')}</div>
                <div className="font-mono font-bold">{formatWavelength(conversions.wavelength_light)}</div>
              </div>
            </div>
          </div>

          {conversions.bpm && (
            <div className="card p-4 bg-red-50">
              <h3 className="font-medium mb-2">{t('tools.frequencyCalculator.rhythmContext')}</h3>
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-xs text-red-600">{t('tools.frequencyCalculator.asBPM')}</div>
                  <div className="font-mono font-bold text-2xl text-red-700">{formatNumber(conversions.bpm)} BPM</div>
                </div>
                <div className="text-sm text-slate-600">
                  {conversions.bpm < 60 && t('tools.frequencyCalculator.verySlowTempo')}
                  {conversions.bpm >= 60 && conversions.bpm < 80 && t('tools.frequencyCalculator.slowTempo')}
                  {conversions.bpm >= 80 && conversions.bpm < 120 && t('tools.frequencyCalculator.moderateTempo')}
                  {conversions.bpm >= 120 && conversions.bpm < 160 && t('tools.frequencyCalculator.fastTempo')}
                  {conversions.bpm >= 160 && t('tools.frequencyCalculator.veryFastTempo')}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.frequencyCalculator.musicalNotes')}</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {musicalNotes.map(note => (
            <button
              key={note.note}
              onClick={() => { setInputValue(note.freq.toString()); setInputUnit('hz') }}
              className="p-2 bg-slate-50 rounded text-center hover:bg-slate-100"
            >
              <div className="font-medium">{note.note}</div>
              <div className="text-xs text-slate-500 font-mono">{note.freq} Hz</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.frequencyCalculator.commonFrequencies')}</h3>
        <div className="space-y-2">
          {frequencyExamples.map((example, i) => (
            <div key={i} className="flex justify-between p-2 bg-slate-50 rounded">
              <span className="text-sm">{example.name}</span>
              <span className="font-mono text-sm">{example.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.frequencyCalculator.formulas')}</h4>
        <div className="grid grid-cols-2 gap-2 text-sm font-mono">
          <div className="p-2 bg-white rounded">f = 1/T</div>
          <div className="p-2 bg-white rounded">ω = 2πf</div>
          <div className="p-2 bg-white rounded">λ = v/f</div>
          <div className="p-2 bg-white rounded">v = fλ</div>
        </div>
      </div>
    </div>
  )
}
