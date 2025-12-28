import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type AngleUnit = 'degrees' | 'radians'
type CalcMode = 'basic' | 'triangle' | 'identities'

export default function TrigonometryCalculator() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<CalcMode>('basic')
  const [angleUnit, setAngleUnit] = useState<AngleUnit>('degrees')
  const [angle, setAngle] = useState('45')
  const [basicResults, setBasicResults] = useState<Record<string, string> | null>(null)

  // Triangle mode
  const [sideA, setSideA] = useState('')
  const [sideB, setSideB] = useState('')
  const [sideC, setSideC] = useState('')
  const [angleA, setAngleA] = useState('')
  const [angleB, setAngleB] = useState('')
  const [angleC, setAngleC] = useState('')
  const [triangleResult, setTriangleResult] = useState<Record<string, string> | null>(null)

  const toRadians = (deg: number) => deg * Math.PI / 180
  const toDegrees = (rad: number) => rad * 180 / Math.PI

  const formatNumber = (n: number): string => {
    if (isNaN(n) || !isFinite(n)) return 'undefined'
    return parseFloat(n.toFixed(8)).toString()
  }

  const calculateBasic = () => {
    const value = parseFloat(angle)
    if (isNaN(value)) return

    const rad = angleUnit === 'degrees' ? toRadians(value) : value

    setBasicResults({
      sin: formatNumber(Math.sin(rad)),
      cos: formatNumber(Math.cos(rad)),
      tan: formatNumber(Math.tan(rad)),
      csc: formatNumber(1 / Math.sin(rad)),
      sec: formatNumber(1 / Math.cos(rad)),
      cot: formatNumber(1 / Math.tan(rad)),
      asin: formatNumber(angleUnit === 'degrees' ? toDegrees(Math.asin(Math.sin(rad))) : Math.asin(Math.sin(rad))),
      acos: formatNumber(angleUnit === 'degrees' ? toDegrees(Math.acos(Math.cos(rad))) : Math.acos(Math.cos(rad))),
      atan: formatNumber(angleUnit === 'degrees' ? toDegrees(Math.atan(Math.tan(rad))) : Math.atan(Math.tan(rad))),
    })
  }

  const calculateTriangle = () => {
    const a = parseFloat(sideA) || 0
    const b = parseFloat(sideB) || 0
    const c = parseFloat(sideC) || 0
    const A = angleUnit === 'degrees' ? toRadians(parseFloat(angleA) || 0) : (parseFloat(angleA) || 0)
    const B = angleUnit === 'degrees' ? toRadians(parseFloat(angleB) || 0) : (parseFloat(angleB) || 0)
    const C = angleUnit === 'degrees' ? toRadians(parseFloat(angleC) || 0) : (parseFloat(angleC) || 0)

    let result: Record<string, string> = {}

    // SSS - Three sides known
    if (a > 0 && b > 0 && c > 0) {
      if (a + b > c && b + c > a && a + c > b) {
        const cosA = (b * b + c * c - a * a) / (2 * b * c)
        const cosB = (a * a + c * c - b * b) / (2 * a * c)
        const cosC = (a * a + b * b - c * c) / (2 * a * b)
        const angA = Math.acos(cosA)
        const angB = Math.acos(cosB)
        const angC = Math.acos(cosC)

        const s = (a + b + c) / 2
        const area = Math.sqrt(s * (s - a) * (s - b) * (s - c))

        result = {
          angleA: formatNumber(angleUnit === 'degrees' ? toDegrees(angA) : angA),
          angleB: formatNumber(angleUnit === 'degrees' ? toDegrees(angB) : angB),
          angleC: formatNumber(angleUnit === 'degrees' ? toDegrees(angC) : angC),
          area: formatNumber(area),
          perimeter: formatNumber(a + b + c),
        }
      } else {
        result = { error: t('tools.trigonometryCalculator.invalidTriangle') }
      }
    }
    // SAS - Two sides and included angle
    else if (a > 0 && b > 0 && C > 0) {
      const cCalc = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(C))
      const angA = Math.asin(a * Math.sin(C) / cCalc)
      const angB = Math.PI - C - angA
      const area = 0.5 * a * b * Math.sin(C)

      result = {
        sideC: formatNumber(cCalc),
        angleA: formatNumber(angleUnit === 'degrees' ? toDegrees(angA) : angA),
        angleB: formatNumber(angleUnit === 'degrees' ? toDegrees(angB) : angB),
        area: formatNumber(area),
        perimeter: formatNumber(a + b + cCalc),
      }
    }
    // ASA - Two angles and included side
    else if (A > 0 && B > 0 && c > 0) {
      const C = Math.PI - A - B
      const aCalc = c * Math.sin(A) / Math.sin(C)
      const bCalc = c * Math.sin(B) / Math.sin(C)
      const area = 0.5 * aCalc * bCalc * Math.sin(C)

      result = {
        sideA: formatNumber(aCalc),
        sideB: formatNumber(bCalc),
        angleC: formatNumber(angleUnit === 'degrees' ? toDegrees(C) : C),
        area: formatNumber(area),
        perimeter: formatNumber(aCalc + bCalc + c),
      }
    }
    else {
      result = { hint: t('tools.trigonometryCalculator.needMore') }
    }

    setTriangleResult(result)
  }

  const identities = [
    { name: 'sin²θ + cos²θ', value: '1' },
    { name: '1 + tan²θ', value: 'sec²θ' },
    { name: '1 + cot²θ', value: 'csc²θ' },
    { name: 'sin(2θ)', value: '2 sin θ cos θ' },
    { name: 'cos(2θ)', value: 'cos²θ - sin²θ' },
    { name: 'tan(2θ)', value: '2 tan θ / (1 - tan²θ)' },
    { name: 'sin(α + β)', value: 'sin α cos β + cos α sin β' },
    { name: 'cos(α + β)', value: 'cos α cos β - sin α sin β' },
    { name: 'sin(α - β)', value: 'sin α cos β - cos α sin β' },
    { name: 'cos(α - β)', value: 'cos α cos β + sin α sin β' },
    { name: 'sin(θ/2)', value: '±√((1 - cos θ) / 2)' },
    { name: 'cos(θ/2)', value: '±√((1 + cos θ) / 2)' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(['basic', 'triangle', 'identities'] as CalcMode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1.5 rounded text-sm ${
              mode === m ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            {t(`tools.trigonometryCalculator.${m}`)}
          </button>
        ))}
      </div>

      {mode !== 'identities' && (
        <div className="flex gap-2">
          <button
            onClick={() => setAngleUnit('degrees')}
            className={`px-3 py-1 text-sm rounded ${
              angleUnit === 'degrees' ? 'bg-green-600 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.trigonometryCalculator.degrees')}
          </button>
          <button
            onClick={() => setAngleUnit('radians')}
            className={`px-3 py-1 text-sm rounded ${
              angleUnit === 'radians' ? 'bg-green-600 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.trigonometryCalculator.radians')}
          </button>
        </div>
      )}

      {mode === 'basic' && (
        <div className="space-y-4">
          <div className="card p-4">
            <label className="block text-sm font-medium mb-2">
              {t('tools.trigonometryCalculator.angle')} ({angleUnit === 'degrees' ? '°' : 'rad'})
            </label>
            <input
              type="number"
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <button
            onClick={calculateBasic}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t('tools.trigonometryCalculator.calculate')}
          </button>

          {basicResults && (
            <div className="card p-4">
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(basicResults).map(([key, value]) => (
                  <div key={key} className="p-2 bg-slate-50 rounded text-center">
                    <div className="text-xs text-slate-500">{key}</div>
                    <div className="font-mono text-sm">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'triangle' && (
        <div className="space-y-4">
          <div className="card p-4">
            <h4 className="font-medium mb-3">{t('tools.trigonometryCalculator.sides')}</h4>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-slate-500">a</label>
                <input
                  type="number"
                  value={sideA}
                  onChange={(e) => setSideA(e.target.value)}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500">b</label>
                <input
                  type="number"
                  value={sideB}
                  onChange={(e) => setSideB(e.target.value)}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500">c</label>
                <input
                  type="number"
                  value={sideC}
                  onChange={(e) => setSideC(e.target.value)}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                />
              </div>
            </div>

            <h4 className="font-medium mb-3 mt-4">{t('tools.trigonometryCalculator.angles')}</h4>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-slate-500">A</label>
                <input
                  type="number"
                  value={angleA}
                  onChange={(e) => setAngleA(e.target.value)}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500">B</label>
                <input
                  type="number"
                  value={angleB}
                  onChange={(e) => setAngleB(e.target.value)}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500">C</label>
                <input
                  type="number"
                  value={angleC}
                  onChange={(e) => setAngleC(e.target.value)}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                />
              </div>
            </div>
          </div>

          <button
            onClick={calculateTriangle}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t('tools.trigonometryCalculator.solveTriangle')}
          </button>

          {triangleResult && (
            <div className="card p-4">
              <h3 className="font-medium mb-3">{t('tools.trigonometryCalculator.solution')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(triangleResult).map(([key, value]) => (
                  <div key={key} className="p-2 bg-slate-50 rounded">
                    <div className="text-xs text-slate-500">{key}</div>
                    <div className="font-mono text-sm">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'identities' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.trigonometryCalculator.identitiesTitle')}</h3>
          <div className="space-y-2">
            {identities.map((id, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded font-mono text-sm">
                <span className="text-blue-600">{id.name}</span>
                <span className="text-slate-400">=</span>
                <span>{id.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
