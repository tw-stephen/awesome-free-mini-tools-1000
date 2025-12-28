import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Shape = '2d' | '3d'
type Shape2D = 'circle' | 'rectangle' | 'triangle' | 'trapezoid' | 'parallelogram' | 'ellipse'
type Shape3D = 'sphere' | 'cube' | 'cylinder' | 'cone' | 'pyramid' | 'prism'

interface ShapeResult {
  area?: number
  perimeter?: number
  volume?: number
  surfaceArea?: number
}

export default function GeometryCalculator() {
  const { t } = useTranslation()
  const [shapeType, setShapeType] = useState<Shape>('2d')
  const [shape2D, setShape2D] = useState<Shape2D>('circle')
  const [shape3D, setShape3D] = useState<Shape3D>('sphere')
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [result, setResult] = useState<ShapeResult | null>(null)

  const shapes2D: Record<Shape2D, { inputs: { id: string; label: string }[]; calculate: (v: Record<string, number>) => ShapeResult }> = {
    circle: {
      inputs: [{ id: 'r', label: 'Radius' }],
      calculate: (v) => ({
        area: Math.PI * v.r * v.r,
        perimeter: 2 * Math.PI * v.r,
      }),
    },
    rectangle: {
      inputs: [{ id: 'l', label: 'Length' }, { id: 'w', label: 'Width' }],
      calculate: (v) => ({
        area: v.l * v.w,
        perimeter: 2 * (v.l + v.w),
      }),
    },
    triangle: {
      inputs: [{ id: 'b', label: 'Base' }, { id: 'h', label: 'Height' }, { id: 'a', label: 'Side a' }, { id: 'c', label: 'Side c' }],
      calculate: (v) => ({
        area: 0.5 * v.b * v.h,
        perimeter: v.a + v.b + v.c,
      }),
    },
    trapezoid: {
      inputs: [{ id: 'a', label: 'Base a' }, { id: 'b', label: 'Base b' }, { id: 'h', label: 'Height' }, { id: 's1', label: 'Side 1' }, { id: 's2', label: 'Side 2' }],
      calculate: (v) => ({
        area: 0.5 * (v.a + v.b) * v.h,
        perimeter: v.a + v.b + v.s1 + v.s2,
      }),
    },
    parallelogram: {
      inputs: [{ id: 'b', label: 'Base' }, { id: 'h', label: 'Height' }, { id: 's', label: 'Side' }],
      calculate: (v) => ({
        area: v.b * v.h,
        perimeter: 2 * (v.b + v.s),
      }),
    },
    ellipse: {
      inputs: [{ id: 'a', label: 'Semi-major axis' }, { id: 'b', label: 'Semi-minor axis' }],
      calculate: (v) => ({
        area: Math.PI * v.a * v.b,
        perimeter: Math.PI * (3 * (v.a + v.b) - Math.sqrt((3 * v.a + v.b) * (v.a + 3 * v.b))),
      }),
    },
  }

  const shapes3D: Record<Shape3D, { inputs: { id: string; label: string }[]; calculate: (v: Record<string, number>) => ShapeResult }> = {
    sphere: {
      inputs: [{ id: 'r', label: 'Radius' }],
      calculate: (v) => ({
        volume: (4 / 3) * Math.PI * Math.pow(v.r, 3),
        surfaceArea: 4 * Math.PI * v.r * v.r,
      }),
    },
    cube: {
      inputs: [{ id: 's', label: 'Side' }],
      calculate: (v) => ({
        volume: Math.pow(v.s, 3),
        surfaceArea: 6 * v.s * v.s,
      }),
    },
    cylinder: {
      inputs: [{ id: 'r', label: 'Radius' }, { id: 'h', label: 'Height' }],
      calculate: (v) => ({
        volume: Math.PI * v.r * v.r * v.h,
        surfaceArea: 2 * Math.PI * v.r * (v.r + v.h),
      }),
    },
    cone: {
      inputs: [{ id: 'r', label: 'Radius' }, { id: 'h', label: 'Height' }],
      calculate: (v) => {
        const slant = Math.sqrt(v.r * v.r + v.h * v.h)
        return {
          volume: (1 / 3) * Math.PI * v.r * v.r * v.h,
          surfaceArea: Math.PI * v.r * (v.r + slant),
        }
      },
    },
    pyramid: {
      inputs: [{ id: 'b', label: 'Base side' }, { id: 'h', label: 'Height' }],
      calculate: (v) => {
        const slant = Math.sqrt(Math.pow(v.h, 2) + Math.pow(v.b / 2, 2))
        return {
          volume: (1 / 3) * v.b * v.b * v.h,
          surfaceArea: v.b * v.b + 2 * v.b * slant,
        }
      },
    },
    prism: {
      inputs: [{ id: 'l', label: 'Length' }, { id: 'w', label: 'Width' }, { id: 'h', label: 'Height' }],
      calculate: (v) => ({
        volume: v.l * v.w * v.h,
        surfaceArea: 2 * (v.l * v.w + v.w * v.h + v.h * v.l),
      }),
    },
  }

  const currentShape = shapeType === '2d' ? shapes2D[shape2D] : shapes3D[shape3D]

  const calculate = () => {
    const values: Record<string, number> = {}
    for (const input of currentShape.inputs) {
      const val = parseFloat(inputs[input.id] || '0')
      if (isNaN(val) || val < 0) {
        setResult(null)
        return
      }
      values[input.id] = val
    }
    setResult(currentShape.calculate(values))
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => { setShapeType('2d'); setResult(null); setInputs({}) }}
          className={`px-4 py-2 rounded ${shapeType === '2d' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.geometryCalculator.2dShapes')}
        </button>
        <button
          onClick={() => { setShapeType('3d'); setResult(null); setInputs({}) }}
          className={`px-4 py-2 rounded ${shapeType === '3d' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}
        >
          {t('tools.geometryCalculator.3dShapes')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.geometryCalculator.selectShape')}</h3>
        <div className="flex flex-wrap gap-2">
          {shapeType === '2d' ? (
            Object.keys(shapes2D).map(s => (
              <button
                key={s}
                onClick={() => { setShape2D(s as Shape2D); setResult(null); setInputs({}) }}
                className={`px-3 py-1.5 rounded text-sm capitalize ${
                  shape2D === s ? 'bg-green-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {t(`tools.geometryCalculator.${s}`)}
              </button>
            ))
          ) : (
            Object.keys(shapes3D).map(s => (
              <button
                key={s}
                onClick={() => { setShape3D(s as Shape3D); setResult(null); setInputs({}) }}
                className={`px-3 py-1.5 rounded text-sm capitalize ${
                  shape3D === s ? 'bg-green-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {t(`tools.geometryCalculator.${s}`)}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3 capitalize">
          {shapeType === '2d' ? t(`tools.geometryCalculator.${shape2D}`) : t(`tools.geometryCalculator.${shape3D}`)}
        </h3>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {currentShape.inputs.map(input => (
            <div key={input.id}>
              <label className="block text-sm text-slate-600 mb-1">{input.label}</label>
              <input
                type="number"
                step="any"
                min="0"
                value={inputs[input.id] || ''}
                onChange={(e) => setInputs({ ...inputs, [input.id]: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          ))}
        </div>

        <button
          onClick={calculate}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t('tools.geometryCalculator.calculate')}
        </button>

        {result && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            {result.area !== undefined && (
              <div className="p-4 bg-blue-50 rounded text-center">
                <div className="text-sm text-blue-600">{t('tools.geometryCalculator.area')}</div>
                <div className="text-2xl font-bold text-blue-700">
                  {result.area.toFixed(4)}
                </div>
                <div className="text-xs text-blue-500">{t('tools.geometryCalculator.squareUnits')}</div>
              </div>
            )}
            {result.perimeter !== undefined && (
              <div className="p-4 bg-green-50 rounded text-center">
                <div className="text-sm text-green-600">{t('tools.geometryCalculator.perimeter')}</div>
                <div className="text-2xl font-bold text-green-700">
                  {result.perimeter.toFixed(4)}
                </div>
                <div className="text-xs text-green-500">{t('tools.geometryCalculator.units')}</div>
              </div>
            )}
            {result.volume !== undefined && (
              <div className="p-4 bg-purple-50 rounded text-center">
                <div className="text-sm text-purple-600">{t('tools.geometryCalculator.volume')}</div>
                <div className="text-2xl font-bold text-purple-700">
                  {result.volume.toFixed(4)}
                </div>
                <div className="text-xs text-purple-500">{t('tools.geometryCalculator.cubicUnits')}</div>
              </div>
            )}
            {result.surfaceArea !== undefined && (
              <div className="p-4 bg-orange-50 rounded text-center">
                <div className="text-sm text-orange-600">{t('tools.geometryCalculator.surfaceArea')}</div>
                <div className="text-2xl font-bold text-orange-700">
                  {result.surfaceArea.toFixed(4)}
                </div>
                <div className="text-xs text-orange-500">{t('tools.geometryCalculator.squareUnits')}</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.geometryCalculator.formulas')}</h4>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2 bg-white rounded">Circle: A = πr²</div>
          <div className="p-2 bg-white rounded">Rectangle: A = l × w</div>
          <div className="p-2 bg-white rounded">Triangle: A = ½bh</div>
          <div className="p-2 bg-white rounded">Sphere: V = ⁴⁄₃πr³</div>
          <div className="p-2 bg-white rounded">Cylinder: V = πr²h</div>
          <div className="p-2 bg-white rounded">Cone: V = ⅓πr²h</div>
        </div>
      </div>
    </div>
  )
}
