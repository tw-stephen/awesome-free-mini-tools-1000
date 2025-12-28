import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type CalcMode = 'molarity' | 'dilution' | 'moles' | 'mass'

export default function MolarityCalculator() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<CalcMode>('molarity')

  // Molarity calculation
  const [moles, setMoles] = useState('1')
  const [volume, setVolume] = useState('1')
  const [molarityResult, setMolarityResult] = useState<number | null>(null)

  // Dilution calculation (C1V1 = C2V2)
  const [c1, setC1] = useState('2')
  const [v1, setV1] = useState('50')
  const [c2, setC2] = useState('0.5')
  const [dilutionResult, setDilutionResult] = useState<number | null>(null)

  // Moles from molarity
  const [molarity, setMolarity] = useState('1')
  const [volumeL, setVolumeL] = useState('0.5')
  const [molesResult, setMolesResult] = useState<number | null>(null)

  // Mass from moles
  const [molesForMass, setMolesForMass] = useState('1')
  const [molarMass, setMolarMass] = useState('58.44')
  const [massResult, setMassResult] = useState<number | null>(null)

  const calculateMolarity = () => {
    const n = parseFloat(moles)
    const v = parseFloat(volume)
    if (!isNaN(n) && !isNaN(v) && v !== 0) {
      setMolarityResult(n / v)
    }
  }

  const calculateDilution = () => {
    const c1Val = parseFloat(c1)
    const v1Val = parseFloat(v1)
    const c2Val = parseFloat(c2)
    if (!isNaN(c1Val) && !isNaN(v1Val) && !isNaN(c2Val) && c2Val !== 0) {
      setDilutionResult((c1Val * v1Val) / c2Val)
    }
  }

  const calculateMoles = () => {
    const m = parseFloat(molarity)
    const v = parseFloat(volumeL)
    if (!isNaN(m) && !isNaN(v)) {
      setMolesResult(m * v)
    }
  }

  const calculateMass = () => {
    const n = parseFloat(molesForMass)
    const mm = parseFloat(molarMass)
    if (!isNaN(n) && !isNaN(mm)) {
      setMassResult(n * mm)
    }
  }

  const modes = [
    { id: 'molarity', label: t('tools.molarityCalculator.molarityMode') },
    { id: 'dilution', label: t('tools.molarityCalculator.dilutionMode') },
    { id: 'moles', label: t('tools.molarityCalculator.molesMode') },
    { id: 'mass', label: t('tools.molarityCalculator.massMode') },
  ]

  const commonCompounds = [
    { name: 'NaCl', molarMass: 58.44 },
    { name: 'H₂O', molarMass: 18.02 },
    { name: 'HCl', molarMass: 36.46 },
    { name: 'NaOH', molarMass: 40.00 },
    { name: 'H₂SO₄', molarMass: 98.08 },
    { name: 'C₆H₁₂O₆', molarMass: 180.16 },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {modes.map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id as CalcMode)}
            className={`px-3 py-1.5 rounded text-sm ${
              mode === m.id ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'molarity' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.molarityCalculator.calcMolarity')}</h3>
          <p className="text-sm text-slate-600 mb-4 font-mono">M = n / V</p>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="w-32 text-sm">{t('tools.molarityCalculator.moles')} (mol)</label>
              <input
                type="number"
                step="any"
                value={moles}
                onChange={(e) => setMoles(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="w-32 text-sm">{t('tools.molarityCalculator.volume')} (L)</label>
              <input
                type="number"
                step="any"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>

          <button
            onClick={calculateMolarity}
            className="w-full mt-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t('tools.molarityCalculator.calculate')}
          </button>

          {molarityResult !== null && (
            <div className="mt-4 p-4 bg-green-50 rounded text-center">
              <div className="text-sm text-green-600 mb-1">{t('tools.molarityCalculator.molarity')}</div>
              <div className="text-3xl font-bold text-green-700">
                {molarityResult.toFixed(4)} M
              </div>
              <div className="text-sm text-green-600 mt-1">({molarityResult.toFixed(4)} mol/L)</div>
            </div>
          )}
        </div>
      )}

      {mode === 'dilution' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.molarityCalculator.dilutionCalc')}</h3>
          <p className="text-sm text-slate-600 mb-4 font-mono">C₁V₁ = C₂V₂</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-medium mb-2">{t('tools.molarityCalculator.initial')}</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-slate-500">C₁ (M)</label>
                  <input
                    type="number"
                    step="any"
                    value={c1}
                    onChange={(e) => setC1(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500">V₁ (mL)</label>
                  <input
                    type="number"
                    step="any"
                    value={v1}
                    onChange={(e) => setV1(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">{t('tools.molarityCalculator.final')}</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-slate-500">C₂ (M)</label>
                  <input
                    type="number"
                    step="any"
                    value={c2}
                    onChange={(e) => setC2(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500">V₂ (mL)</label>
                  <div className="px-3 py-2 bg-slate-100 rounded text-center font-bold">
                    ?
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={calculateDilution}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t('tools.molarityCalculator.calculateV2')}
          </button>

          {dilutionResult !== null && (
            <div className="mt-4 p-4 bg-green-50 rounded text-center">
              <div className="text-sm text-green-600 mb-1">V₂ =</div>
              <div className="text-3xl font-bold text-green-700">
                {dilutionResult.toFixed(2)} mL
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'moles' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.molarityCalculator.molesCalc')}</h3>
          <p className="text-sm text-slate-600 mb-4 font-mono">n = M × V</p>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="w-32 text-sm">{t('tools.molarityCalculator.molarity')} (M)</label>
              <input
                type="number"
                step="any"
                value={molarity}
                onChange={(e) => setMolarity(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="w-32 text-sm">{t('tools.molarityCalculator.volume')} (L)</label>
              <input
                type="number"
                step="any"
                value={volumeL}
                onChange={(e) => setVolumeL(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>

          <button
            onClick={calculateMoles}
            className="w-full mt-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t('tools.molarityCalculator.calculate')}
          </button>

          {molesResult !== null && (
            <div className="mt-4 p-4 bg-green-50 rounded text-center">
              <div className="text-sm text-green-600 mb-1">{t('tools.molarityCalculator.moles')}</div>
              <div className="text-3xl font-bold text-green-700">
                {molesResult.toFixed(6)} mol
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'mass' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.molarityCalculator.massCalc')}</h3>
          <p className="text-sm text-slate-600 mb-4 font-mono">m = n × M (molar mass)</p>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="w-32 text-sm">{t('tools.molarityCalculator.moles')} (mol)</label>
              <input
                type="number"
                step="any"
                value={molesForMass}
                onChange={(e) => setMolesForMass(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="w-32 text-sm">{t('tools.molarityCalculator.molarMass')} (g/mol)</label>
              <input
                type="number"
                step="any"
                value={molarMass}
                onChange={(e) => setMolarMass(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>

          <div className="mt-3">
            <p className="text-xs text-slate-500 mb-2">{t('tools.molarityCalculator.quickSelect')}</p>
            <div className="flex flex-wrap gap-1">
              {commonCompounds.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setMolarMass(c.molarMass.toString())}
                  className="px-2 py-1 bg-slate-100 rounded text-xs hover:bg-slate-200"
                >
                  {c.name} ({c.molarMass})
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={calculateMass}
            className="w-full mt-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t('tools.molarityCalculator.calculate')}
          </button>

          {massResult !== null && (
            <div className="mt-4 p-4 bg-green-50 rounded text-center">
              <div className="text-sm text-green-600 mb-1">{t('tools.molarityCalculator.mass')}</div>
              <div className="text-3xl font-bold text-green-700">
                {massResult.toFixed(4)} g
              </div>
            </div>
          )}
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.molarityCalculator.formulas')}</h4>
        <div className="grid grid-cols-2 gap-2 text-sm font-mono">
          <div className="p-2 bg-white rounded">M = n / V</div>
          <div className="p-2 bg-white rounded">n = m / M</div>
          <div className="p-2 bg-white rounded">C₁V₁ = C₂V₂</div>
          <div className="p-2 bg-white rounded">m = n × M</div>
        </div>
      </div>
    </div>
  )
}
