import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type CalcMode = 'distance' | 'gravity' | 'orbital' | 'lightYear'

interface CelestialBody {
  name: string
  mass: number // kg
  radius: number // m
  distanceFromSun: number // AU
  orbitalPeriod: number // Earth days
}

const celestialBodies: Record<string, CelestialBody> = {
  sun: { name: 'Sun', mass: 1.989e30, radius: 6.96e8, distanceFromSun: 0, orbitalPeriod: 0 },
  mercury: { name: 'Mercury', mass: 3.30e23, radius: 2.44e6, distanceFromSun: 0.39, orbitalPeriod: 88 },
  venus: { name: 'Venus', mass: 4.87e24, radius: 6.05e6, distanceFromSun: 0.72, orbitalPeriod: 225 },
  earth: { name: 'Earth', mass: 5.97e24, radius: 6.37e6, distanceFromSun: 1, orbitalPeriod: 365 },
  mars: { name: 'Mars', mass: 6.42e23, radius: 3.39e6, distanceFromSun: 1.52, orbitalPeriod: 687 },
  jupiter: { name: 'Jupiter', mass: 1.90e27, radius: 6.99e7, distanceFromSun: 5.2, orbitalPeriod: 4333 },
  saturn: { name: 'Saturn', mass: 5.68e26, radius: 5.82e7, distanceFromSun: 9.58, orbitalPeriod: 10759 },
  uranus: { name: 'Uranus', mass: 8.68e25, radius: 2.54e7, distanceFromSun: 19.22, orbitalPeriod: 30687 },
  neptune: { name: 'Neptune', mass: 1.02e26, radius: 2.46e7, distanceFromSun: 30.05, orbitalPeriod: 60190 },
  moon: { name: 'Moon', mass: 7.35e22, radius: 1.74e6, distanceFromSun: 1, orbitalPeriod: 27.3 },
}

const G = 6.674e-11 // Gravitational constant
const c = 299792458 // Speed of light (m/s)
const AU = 1.496e11 // Astronomical Unit in meters
const LIGHT_YEAR = 9.461e15 // Light year in meters

export default function AstronomyCalculator() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<CalcMode>('distance')
  const [selectedBody1, setSelectedBody1] = useState('earth')
  const [selectedBody2, setSelectedBody2] = useState('mars')
  const [customMass, setCustomMass] = useState('5.97e24')
  const [customRadius, setCustomRadius] = useState('6.37e6')
  const [distanceValue, setDistanceValue] = useState('1')
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'au' | 'ly'>('au')
  const [result, setResult] = useState<{ label: string; value: string; details?: string[] }[] | null>(null)

  const calculate = () => {
    const results: { label: string; value: string; details?: string[] }[] = []

    switch (mode) {
      case 'distance': {
        const body1 = celestialBodies[selectedBody1]
        const body2 = celestialBodies[selectedBody2]
        if (body1 && body2) {
          const distanceAU = Math.abs(body1.distanceFromSun - body2.distanceFromSun)
          const distanceKm = distanceAU * AU / 1000
          const lightTime = (distanceAU * AU) / c

          results.push(
            { label: t('tools.astronomyCalculator.distanceAU'), value: `${distanceAU.toFixed(4)} AU` },
            { label: t('tools.astronomyCalculator.distanceKm'), value: `${distanceKm.toExponential(4)} km` },
            { label: t('tools.astronomyCalculator.lightTime'), value: `${(lightTime / 60).toFixed(2)} min` },
          )
        }
        break
      }
      case 'gravity': {
        const mass = parseFloat(customMass)
        const radius = parseFloat(customRadius)
        if (!isNaN(mass) && !isNaN(radius) && radius > 0) {
          const gravity = (G * mass) / (radius * radius)
          const escapeVelocity = Math.sqrt((2 * G * mass) / radius)

          results.push(
            { label: t('tools.astronomyCalculator.surfaceGravity'), value: `${gravity.toFixed(4)} m/s²` },
            { label: t('tools.astronomyCalculator.gForce'), value: `${(gravity / 9.81).toFixed(4)} g` },
            { label: t('tools.astronomyCalculator.escapeVelocity'), value: `${(escapeVelocity / 1000).toFixed(2)} km/s` },
          )
        }
        break
      }
      case 'orbital': {
        const body = celestialBodies[selectedBody1]
        if (body && body.distanceFromSun > 0) {
          const semiMajorAxis = body.distanceFromSun * AU
          const orbitalVelocity = Math.sqrt(G * celestialBodies.sun.mass / semiMajorAxis)

          results.push(
            { label: t('tools.astronomyCalculator.orbitalPeriod'), value: `${body.orbitalPeriod} days` },
            { label: t('tools.astronomyCalculator.orbitalVelocity'), value: `${(orbitalVelocity / 1000).toFixed(2)} km/s` },
            { label: t('tools.astronomyCalculator.distanceFromSun'), value: `${body.distanceFromSun} AU` },
          )
        }
        break
      }
      case 'lightYear': {
        const value = parseFloat(distanceValue)
        if (!isNaN(value)) {
          let meters: number
          switch (distanceUnit) {
            case 'km': meters = value * 1000; break
            case 'au': meters = value * AU; break
            case 'ly': meters = value * LIGHT_YEAR; break
          }

          results.push(
            { label: t('tools.astronomyCalculator.kilometers'), value: `${(meters / 1000).toExponential(4)} km` },
            { label: t('tools.astronomyCalculator.astronomicalUnits'), value: `${(meters / AU).toExponential(4)} AU` },
            { label: t('tools.astronomyCalculator.lightYears'), value: `${(meters / LIGHT_YEAR).toExponential(4)} ly` },
            { label: t('tools.astronomyCalculator.lightTravelTime'), value: `${(meters / c / 31557600).toFixed(4)} years` },
          )
        }
        break
      }
    }

    setResult(results)
  }

  const modes = [
    { id: 'distance', label: t('tools.astronomyCalculator.planetDistance') },
    { id: 'gravity', label: t('tools.astronomyCalculator.gravity') },
    { id: 'orbital', label: t('tools.astronomyCalculator.orbital') },
    { id: 'lightYear', label: t('tools.astronomyCalculator.converter') },
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
        {mode === 'distance' && (
          <div className="space-y-3">
            <h3 className="font-medium">{t('tools.astronomyCalculator.distanceTitle')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">{t('tools.astronomyCalculator.from')}</label>
                <select
                  value={selectedBody1}
                  onChange={(e) => setSelectedBody1(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                >
                  {Object.entries(celestialBodies).map(([key, body]) => (
                    <option key={key} value={key}>{body.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">{t('tools.astronomyCalculator.to')}</label>
                <select
                  value={selectedBody2}
                  onChange={(e) => setSelectedBody2(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                >
                  {Object.entries(celestialBodies).map(([key, body]) => (
                    <option key={key} value={key}>{body.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {mode === 'gravity' && (
          <div className="space-y-3">
            <h3 className="font-medium">{t('tools.astronomyCalculator.gravityTitle')}</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {Object.entries(celestialBodies).slice(0, 6).map(([key, body]) => (
                <button
                  key={key}
                  onClick={() => {
                    setCustomMass(body.mass.toExponential())
                    setCustomRadius(body.radius.toExponential())
                  }}
                  className="px-2 py-1 bg-slate-100 rounded text-xs hover:bg-slate-200"
                >
                  {body.name}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">{t('tools.astronomyCalculator.mass')} (kg)</label>
                <input
                  type="text"
                  value={customMass}
                  onChange={(e) => setCustomMass(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">{t('tools.astronomyCalculator.radius')} (m)</label>
                <input
                  type="text"
                  value={customRadius}
                  onChange={(e) => setCustomRadius(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded font-mono text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {mode === 'orbital' && (
          <div className="space-y-3">
            <h3 className="font-medium">{t('tools.astronomyCalculator.orbitalTitle')}</h3>
            <select
              value={selectedBody1}
              onChange={(e) => setSelectedBody1(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              {Object.entries(celestialBodies).filter(([_, b]) => b.distanceFromSun > 0).map(([key, body]) => (
                <option key={key} value={key}>{body.name}</option>
              ))}
            </select>
          </div>
        )}

        {mode === 'lightYear' && (
          <div className="space-y-3">
            <h3 className="font-medium">{t('tools.astronomyCalculator.converterTitle')}</h3>
            <div className="flex gap-2">
              <input
                type="number"
                step="any"
                value={distanceValue}
                onChange={(e) => setDistanceValue(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
              />
              <select
                value={distanceUnit}
                onChange={(e) => setDistanceUnit(e.target.value as 'km' | 'au' | 'ly')}
                className="px-3 py-2 border border-slate-300 rounded"
              >
                <option value="km">km</option>
                <option value="au">AU</option>
                <option value="ly">Light Year</option>
              </select>
            </div>
          </div>
        )}

        <button
          onClick={calculate}
          className="w-full mt-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t('tools.astronomyCalculator.calculate')}
        </button>
      </div>

      {result && result.length > 0 && (
        <div className="card p-4">
          <div className="space-y-3">
            {result.map((r, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded">
                <div className="text-sm text-slate-600">{r.label}</div>
                <div className="font-mono text-lg font-bold">{r.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.astronomyCalculator.constants')}</h4>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2 bg-white rounded">G = 6.674×10⁻¹¹ N⋅m²/kg²</div>
          <div className="p-2 bg-white rounded">c = 299,792,458 m/s</div>
          <div className="p-2 bg-white rounded">1 AU = 149.6 million km</div>
          <div className="p-2 bg-white rounded">1 ly = 9.461 trillion km</div>
        </div>
      </div>
    </div>
  )
}
