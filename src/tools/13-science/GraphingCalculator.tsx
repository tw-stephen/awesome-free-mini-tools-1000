import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface FunctionEntry {
  id: string
  expression: string
  color: string
  visible: boolean
}

const colors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899']

export default function GraphingCalculator() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [functions, setFunctions] = useState<FunctionEntry[]>([
    { id: '1', expression: 'x^2', color: colors[0], visible: true }
  ])
  const [xMin, setXMin] = useState(-10)
  const [xMax, setXMax] = useState(10)
  const [yMin, setYMin] = useState(-10)
  const [yMax, setYMax] = useState(10)
  const [showGrid, setShowGrid] = useState(true)

  const evaluateExpression = (expr: string, x: number): number => {
    try {
      const expression = expr
        .replace(/\^/g, '**')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/abs/g, 'Math.abs')
        .replace(/log/g, 'Math.log10')
        .replace(/ln/g, 'Math.log')
        .replace(/exp/g, 'Math.exp')
        .replace(/pi/gi, 'Math.PI')
        .replace(/e(?![x])/g, 'Math.E')

      return new Function('x', `return ${expression}`)(x)
    } catch {
      return NaN
    }
  }

  const drawGraph = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const xRange = xMax - xMin
    const yRange = yMax - yMin

    const toCanvasX = (x: number) => ((x - xMin) / xRange) * width
    const toCanvasY = (y: number) => height - ((y - yMin) / yRange) * height

    // Clear canvas
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 1

      // Vertical lines
      for (let x = Math.ceil(xMin); x <= xMax; x++) {
        const canvasX = toCanvasX(x)
        ctx.beginPath()
        ctx.moveTo(canvasX, 0)
        ctx.lineTo(canvasX, height)
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = Math.ceil(yMin); y <= yMax; y++) {
        const canvasY = toCanvasY(y)
        ctx.beginPath()
        ctx.moveTo(0, canvasY)
        ctx.lineTo(width, canvasY)
        ctx.stroke()
      }
    }

    // Draw axes
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 2

    // X-axis
    if (yMin <= 0 && yMax >= 0) {
      const y0 = toCanvasY(0)
      ctx.beginPath()
      ctx.moveTo(0, y0)
      ctx.lineTo(width, y0)
      ctx.stroke()
    }

    // Y-axis
    if (xMin <= 0 && xMax >= 0) {
      const x0 = toCanvasX(0)
      ctx.beginPath()
      ctx.moveTo(x0, 0)
      ctx.lineTo(x0, height)
      ctx.stroke()
    }

    // Draw functions
    functions.forEach(fn => {
      if (!fn.visible || !fn.expression.trim()) return

      ctx.strokeStyle = fn.color
      ctx.lineWidth = 2
      ctx.beginPath()

      let started = false
      const step = xRange / width

      for (let i = 0; i <= width; i++) {
        const x = xMin + (i / width) * xRange
        const y = evaluateExpression(fn.expression, x)

        if (isNaN(y) || !isFinite(y) || y < yMin - yRange || y > yMax + yRange) {
          if (started) {
            ctx.stroke()
            ctx.beginPath()
            started = false
          }
          continue
        }

        const canvasX = toCanvasX(x)
        const canvasY = toCanvasY(y)

        if (!started) {
          ctx.moveTo(canvasX, canvasY)
          started = true
        } else {
          ctx.lineTo(canvasX, canvasY)
        }
      }
      ctx.stroke()
    })

    // Draw labels
    ctx.fillStyle = '#6b7280'
    ctx.font = '12px sans-serif'
    ctx.fillText(`x: [${xMin}, ${xMax}]`, 10, 20)
    ctx.fillText(`y: [${yMin}, ${yMax}]`, 10, 36)
  }

  useEffect(() => {
    drawGraph()
  }, [functions, xMin, xMax, yMin, yMax, showGrid])

  const addFunction = () => {
    if (functions.length >= 6) return
    const newId = Date.now().toString()
    setFunctions([...functions, {
      id: newId,
      expression: '',
      color: colors[functions.length % colors.length],
      visible: true
    }])
  }

  const updateFunction = (id: string, updates: Partial<FunctionEntry>) => {
    setFunctions(functions.map(fn => fn.id === id ? { ...fn, ...updates } : fn))
  }

  const removeFunction = (id: string) => {
    if (functions.length <= 1) return
    setFunctions(functions.filter(fn => fn.id !== id))
  }

  const resetView = () => {
    setXMin(-10)
    setXMax(10)
    setYMin(-10)
    setYMax(10)
  }

  const zoomIn = () => {
    const xCenter = (xMin + xMax) / 2
    const yCenter = (yMin + yMax) / 2
    const xRange = (xMax - xMin) * 0.4
    const yRange = (yMax - yMin) * 0.4
    setXMin(xCenter - xRange)
    setXMax(xCenter + xRange)
    setYMin(yCenter - yRange)
    setYMax(yCenter + yRange)
  }

  const zoomOut = () => {
    const xCenter = (xMin + xMax) / 2
    const yCenter = (yMin + yMax) / 2
    const xRange = (xMax - xMin) * 0.6
    const yRange = (yMax - yMin) * 0.6
    setXMin(xCenter - xRange)
    setXMax(xCenter + xRange)
    setYMin(yCenter - yRange)
    setYMax(yCenter + yRange)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">{t('tools.graphingCalculator.functions')}</h3>
          <button
            onClick={addFunction}
            disabled={functions.length >= 6}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {t('tools.graphingCalculator.addFunction')}
          </button>
        </div>

        <div className="space-y-2">
          {functions.map((fn, index) => (
            <div key={fn.id} className="flex items-center gap-2">
              <input
                type="color"
                value={fn.color}
                onChange={(e) => updateFunction(fn.id, { color: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <span className="text-sm text-slate-600">f{index + 1}(x) =</span>
              <input
                type="text"
                value={fn.expression}
                onChange={(e) => updateFunction(fn.id, { expression: e.target.value })}
                placeholder="x^2, sin(x), etc."
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-sm"
              />
              <button
                onClick={() => updateFunction(fn.id, { visible: !fn.visible })}
                className={`p-1.5 rounded ${fn.visible ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}
              >
                {fn.visible ? '👁' : '👁‍🗨'}
              </button>
              {functions.length > 1 && (
                <button
                  onClick={() => removeFunction(fn.id)}
                  className="p-1.5 bg-red-100 text-red-600 rounded"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex gap-2">
            <button onClick={zoomIn} className="px-3 py-1 bg-slate-100 rounded hover:bg-slate-200">+</button>
            <button onClick={zoomOut} className="px-3 py-1 bg-slate-100 rounded hover:bg-slate-200">−</button>
            <button onClick={resetView} className="px-3 py-1 bg-slate-100 rounded hover:bg-slate-200 text-sm">
              {t('tools.graphingCalculator.reset')}
            </button>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
            />
            {t('tools.graphingCalculator.showGrid')}
          </label>
        </div>

        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full border border-slate-200 rounded bg-white"
        />

        <div className="grid grid-cols-4 gap-2 mt-3 text-sm">
          <div>
            <label className="text-slate-500">x min</label>
            <input
              type="number"
              value={xMin}
              onChange={(e) => setXMin(parseFloat(e.target.value))}
              className="w-full px-2 py-1 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-slate-500">x max</label>
            <input
              type="number"
              value={xMax}
              onChange={(e) => setXMax(parseFloat(e.target.value))}
              className="w-full px-2 py-1 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-slate-500">y min</label>
            <input
              type="number"
              value={yMin}
              onChange={(e) => setYMin(parseFloat(e.target.value))}
              className="w-full px-2 py-1 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-slate-500">y max</label>
            <input
              type="number"
              value={yMax}
              onChange={(e) => setYMax(parseFloat(e.target.value))}
              className="w-full px-2 py-1 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.graphingCalculator.examples')}</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          {['x^2', 'sin(x)', 'cos(x)', '1/x', 'sqrt(x)', 'exp(x)', 'log(x)', 'abs(x)'].map(expr => (
            <button
              key={expr}
              onClick={() => updateFunction(functions[0].id, { expression: expr })}
              className="px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50"
            >
              {expr}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
