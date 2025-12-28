import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Shape = 'circle' | 'rectangle' | 'triangle' | 'trapezoid' | 'parallelogram'

export default function GeometryCalculator() {
  const { t } = useTranslation()
  const [shape, setShape] = useState<Shape>('circle')
  const [values, setValues] = useState<Record<string, string>>({})

  const shapes: { id: Shape; label: string; inputs: string[] }[] = [
    { id: 'circle', label: t('tools.geometryCalculator.circle'), inputs: ['radius'] },
    { id: 'rectangle', label: t('tools.geometryCalculator.rectangle'), inputs: ['width', 'height'] },
    { id: 'triangle', label: t('tools.geometryCalculator.triangle'), inputs: ['base', 'height', 'side1', 'side2', 'side3'] },
    { id: 'trapezoid', label: t('tools.geometryCalculator.trapezoid'), inputs: ['base1', 'base2', 'height', 'side1', 'side2'] },
    { id: 'parallelogram', label: t('tools.geometryCalculator.parallelogram'), inputs: ['base', 'height', 'side'] },
  ]

  const calculate = () => {
    const v = (key: string) => parseFloat(values[key]) || 0

    switch (shape) {
      case 'circle': {
        const r = v('radius')
        return {
          area: Math.PI * r * r,
          perimeter: 2 * Math.PI * r,
        }
      }
      case 'rectangle': {
        const w = v('width'), h = v('height')
        return {
          area: w * h,
          perimeter: 2 * (w + h),
          diagonal: Math.sqrt(w * w + h * h),
        }
      }
      case 'triangle': {
        const base = v('base'), height = v('height')
        const s1 = v('side1'), s2 = v('side2'), s3 = v('side3')
        const area = (base * height) / 2
        const perimeter = s1 + s2 + s3
        return { area, perimeter }
      }
      case 'trapezoid': {
        const b1 = v('base1'), b2 = v('base2'), h = v('height')
        const s1 = v('side1'), s2 = v('side2')
        return {
          area: ((b1 + b2) * h) / 2,
          perimeter: b1 + b2 + s1 + s2,
        }
      }
      case 'parallelogram': {
        const base = v('base'), h = v('height'), side = v('side')
        return {
          area: base * h,
          perimeter: 2 * (base + side),
        }
      }
      default:
        return {}
    }
  }

  const results = calculate()
  const currentShape = shapes.find(s => s.id === shape)!

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {shapes.map(s => (
          <button
            key={s.id}
            onClick={() => { setShape(s.id); setValues({}) }}
            className={`px-3 py-2 rounded text-sm ${shape === s.id ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {currentShape.label}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {currentShape.inputs.map(input => (
            <div key={input}>
              <label className="block text-xs text-slate-500 mb-1">
                {t(`tools.geometryCalculator.${input}`)}
              </label>
              <input
                type="number"
                value={values[input] || ''}
                onChange={(e) => setValues({ ...values, [input]: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-blue-50">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.geometryCalculator.results')}
        </h3>
        <div className="space-y-2">
          {Object.entries(results).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-slate-600">{t(`tools.geometryCalculator.${key}`)}:</span>
              <span className="font-medium">{(value as number).toFixed(4)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.geometryCalculator.formulas')}
        </h3>
        <div className="text-xs text-slate-500 space-y-1 font-mono">
          {shape === 'circle' && (
            <>
              <p>Area = π × r²</p>
              <p>Circumference = 2 × π × r</p>
            </>
          )}
          {shape === 'rectangle' && (
            <>
              <p>Area = width × height</p>
              <p>Perimeter = 2 × (width + height)</p>
              <p>Diagonal = √(width² + height²)</p>
            </>
          )}
          {shape === 'triangle' && (
            <>
              <p>Area = (base × height) / 2</p>
              <p>Perimeter = side1 + side2 + side3</p>
            </>
          )}
          {shape === 'trapezoid' && (
            <>
              <p>Area = ((base1 + base2) × height) / 2</p>
              <p>Perimeter = base1 + base2 + side1 + side2</p>
            </>
          )}
          {shape === 'parallelogram' && (
            <>
              <p>Area = base × height</p>
              <p>Perimeter = 2 × (base + side)</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
