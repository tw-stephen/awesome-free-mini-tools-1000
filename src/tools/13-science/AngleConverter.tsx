import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type AngleUnit = 'degrees' | 'radians' | 'gradians' | 'turns' | 'arcminutes' | 'arcseconds'

interface AngleConversions {
  degrees: number
  radians: number
  gradians: number
  turns: number
  arcminutes: number
  arcseconds: number
}

export default function AngleConverter() {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState('90')
  const [inputUnit, setInputUnit] = useState<AngleUnit>('degrees')
  const [conversions, setConversions] = useState<AngleConversions | null>(null)

  const toDegrees = (value: number, unit: AngleUnit): number => {
    switch (unit) {
      case 'degrees': return value
      case 'radians': return value * (180 / Math.PI)
      case 'gradians': return value * 0.9
      case 'turns': return value * 360
      case 'arcminutes': return value / 60
      case 'arcseconds': return value / 3600
    }
  }

  const fromDegrees = (degrees: number): AngleConversions => ({
    degrees,
    radians: degrees * (Math.PI / 180),
    gradians: degrees / 0.9,
    turns: degrees / 360,
    arcminutes: degrees * 60,
    arcseconds: degrees * 3600,
  })

  const convert = () => {
    const value = parseFloat(inputValue)
    if (isNaN(value)) {
      setConversions(null)
      return
    }

    const degrees = toDegrees(value, inputUnit)
    setConversions(fromDegrees(degrees))
  }

  useEffect(() => {
    convert()
  }, [inputValue, inputUnit])

  const formatNumber = (num: number): string => {
    if (Math.abs(num) < 0.0001) return num.toExponential(4)
    if (Math.abs(num) >= 1000000) return num.toExponential(4)
    return num.toFixed(6).replace(/\.?0+$/, '')
  }

  const units: { id: AngleUnit; name: string; symbol: string }[] = [
    { id: 'degrees', name: t('tools.angleConverter.degrees'), symbol: '°' },
    { id: 'radians', name: t('tools.angleConverter.radians'), symbol: 'rad' },
    { id: 'gradians', name: t('tools.angleConverter.gradians'), symbol: 'grad' },
    { id: 'turns', name: t('tools.angleConverter.turns'), symbol: 'turn' },
    { id: 'arcminutes', name: t('tools.angleConverter.arcminutes'), symbol: "'" },
    { id: 'arcseconds', name: t('tools.angleConverter.arcseconds'), symbol: '"' },
  ]

  const commonAngles = [
    { degrees: 0, radians: '0', name: '0°' },
    { degrees: 30, radians: 'π/6', name: '30°' },
    { degrees: 45, radians: 'π/4', name: '45°' },
    { degrees: 60, radians: 'π/3', name: '60°' },
    { degrees: 90, radians: 'π/2', name: '90°' },
    { degrees: 120, radians: '2π/3', name: '120°' },
    { degrees: 180, radians: 'π', name: '180°' },
    { degrees: 270, radians: '3π/2', name: '270°' },
    { degrees: 360, radians: '2π', name: '360°' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium mb-2">
          {t('tools.angleConverter.enterAngle')}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            step="any"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-lg"
          />
          <select
            value={inputUnit}
            onChange={(e) => setInputUnit(e.target.value as AngleUnit)}
            className="px-3 py-2 border border-slate-300 rounded"
          >
            {units.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {[30, 45, 60, 90, 180, 360].map(deg => (
            <button
              key={deg}
              onClick={() => { setInputValue(deg.toString()); setInputUnit('degrees') }}
              className="px-2 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200"
            >
              {deg}°
            </button>
          ))}
          <button
            onClick={() => { setInputValue(Math.PI.toString()); setInputUnit('radians') }}
            className="px-2 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200"
          >
            π rad
          </button>
        </div>
      </div>

      {conversions && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.angleConverter.conversions')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {units.map(unit => (
              <div
                key={unit.id}
                className={`p-3 rounded ${unit.id === inputUnit ? 'bg-blue-50 border-2 border-blue-300' : 'bg-slate-50'}`}
              >
                <div className="text-sm text-slate-600">{unit.name}</div>
                <div className="text-lg font-bold font-mono">
                  {formatNumber(conversions[unit.id])} {unit.symbol}
                </div>
              </div>
            ))}
          </div>

          {conversions.degrees >= 0 && conversions.degrees <= 360 && (
            <div className="mt-4 p-3 bg-purple-50 rounded">
              <div className="text-sm text-purple-600">{t('tools.angleConverter.trigValues')}</div>
              <div className="grid grid-cols-3 gap-2 mt-2 font-mono text-sm">
                <div>sin = {Math.sin(conversions.radians).toFixed(4)}</div>
                <div>cos = {Math.cos(conversions.radians).toFixed(4)}</div>
                <div>tan = {Math.abs(Math.cos(conversions.radians)) > 0.0001 ? Math.tan(conversions.radians).toFixed(4) : '∞'}</div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.angleConverter.commonAngles')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-2 text-left">{t('tools.angleConverter.angle')}</th>
                <th className="p-2 text-center">Degrees</th>
                <th className="p-2 text-center">Radians</th>
                <th className="p-2 text-center">sin</th>
                <th className="p-2 text-center">cos</th>
              </tr>
            </thead>
            <tbody>
              {commonAngles.map((angle, i) => {
                const rad = angle.degrees * Math.PI / 180
                return (
                  <tr
                    key={i}
                    className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'} cursor-pointer hover:bg-blue-50`}
                    onClick={() => { setInputValue(angle.degrees.toString()); setInputUnit('degrees') }}
                  >
                    <td className="p-2 font-medium">{angle.name}</td>
                    <td className="p-2 text-center font-mono">{angle.degrees}°</td>
                    <td className="p-2 text-center font-mono">{angle.radians}</td>
                    <td className="p-2 text-center font-mono">{Math.sin(rad).toFixed(4)}</td>
                    <td className="p-2 text-center font-mono">{Math.cos(rad).toFixed(4)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.angleConverter.formulas')}</h4>
        <div className="grid grid-cols-2 gap-2 text-sm font-mono">
          <div className="p-2 bg-white rounded">1° = π/180 rad</div>
          <div className="p-2 bg-white rounded">1 rad = 180°/π</div>
          <div className="p-2 bg-white rounded">1° = 60 arcmin</div>
          <div className="p-2 bg-white rounded">1 arcmin = 60 arcsec</div>
          <div className="p-2 bg-white rounded">360° = 2π rad</div>
          <div className="p-2 bg-white rounded">100 grad = 90°</div>
        </div>
      </div>
    </div>
  )
}
