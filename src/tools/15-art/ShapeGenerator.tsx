import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function ShapeGenerator() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [shape, setShape] = useState<'star' | 'heart' | 'polygon' | 'burst' | 'arrow'>('star')
  const [fillColor, setFillColor] = useState('#3B82F6')
  const [strokeColor, setStrokeColor] = useState('#1E40AF')
  const [strokeWidth, setStrokeWidth] = useState(3)
  const [sides, setSides] = useState(5)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    drawShape()
  }, [shape, fillColor, strokeColor, strokeWidth, sides, rotation])

  const drawShape = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = 200
    canvas.width = size
    canvas.height = size

    ctx.clearRect(0, 0, size, size)
    ctx.save()
    ctx.translate(size / 2, size / 2)
    ctx.rotate((rotation * Math.PI) / 180)

    ctx.fillStyle = fillColor
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = strokeWidth

    const radius = size / 2 - 20

    switch (shape) {
      case 'star':
        drawStar(ctx, 0, 0, sides, radius, radius / 2)
        break
      case 'heart':
        drawHeart(ctx, radius)
        break
      case 'polygon':
        drawPolygon(ctx, 0, 0, radius, sides)
        break
      case 'burst':
        drawBurst(ctx, 0, 0, radius, sides * 2)
        break
      case 'arrow':
        drawArrow(ctx, radius)
        break
    }

    ctx.fill()
    if (strokeWidth > 0) ctx.stroke()
    ctx.restore()
  }

  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
    ctx.beginPath()
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius
      const angle = (Math.PI / spikes) * i - Math.PI / 2
      const x = cx + Math.cos(angle) * radius
      const y = cy + Math.sin(angle) * radius
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
  }

  const drawHeart = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.beginPath()
    ctx.moveTo(0, size * 0.3)
    ctx.bezierCurveTo(-size, -size * 0.3, -size * 0.5, -size, 0, -size * 0.5)
    ctx.bezierCurveTo(size * 0.5, -size, size, -size * 0.3, 0, size * 0.3)
    ctx.closePath()
  }

  const drawPolygon = (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, sides: number) => {
    ctx.beginPath()
    for (let i = 0; i < sides; i++) {
      const angle = (Math.PI * 2 / sides) * i - Math.PI / 2
      const x = cx + Math.cos(angle) * radius
      const y = cy + Math.sin(angle) * radius
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
  }

  const drawBurst = (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, points: number) => {
    ctx.beginPath()
    for (let i = 0; i < points; i++) {
      const r = i % 2 === 0 ? radius : radius * 0.6
      const angle = (Math.PI * 2 / points) * i - Math.PI / 2
      const x = cx + Math.cos(angle) * r
      const y = cy + Math.sin(angle) * r
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
  }

  const drawArrow = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.beginPath()
    ctx.moveTo(0, -size)
    ctx.lineTo(size * 0.6, 0)
    ctx.lineTo(size * 0.3, 0)
    ctx.lineTo(size * 0.3, size)
    ctx.lineTo(-size * 0.3, size)
    ctx.lineTo(-size * 0.3, 0)
    ctx.lineTo(-size * 0.6, 0)
    ctx.closePath()
  }

  const downloadShape = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `shape-${shape}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const shapes = [
    { id: 'star', name: 'Star', icon: '⭐' },
    { id: 'heart', name: 'Heart', icon: '❤️' },
    { id: 'polygon', name: 'Polygon', icon: '⬡' },
    { id: 'burst', name: 'Burst', icon: '✴️' },
    { id: 'arrow', name: 'Arrow', icon: '➤' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            className="border border-slate-200 rounded-lg"
            style={{ background: 'repeating-conic-gradient(#f0f0f0 0% 25%, white 0% 50%) 50% / 20px 20px' }}
          />
        </div>
        <button
          onClick={downloadShape}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          {t('tools.shapeGenerator.download')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.shapeGenerator.shape')}</h3>
        <div className="grid grid-cols-5 gap-2">
          {shapes.map((s) => (
            <button
              key={s.id}
              onClick={() => setShape(s.id as any)}
              className={`p-3 rounded-lg text-center ${
                shape === s.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <div className="text-xl">{s.icon}</div>
              <div className="text-xs mt-1">{s.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.shapeGenerator.colors')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.shapeGenerator.fill')}</label>
            <input
              type="color"
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.shapeGenerator.stroke')}</label>
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.shapeGenerator.settings')}</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.shapeGenerator.strokeWidth')}: {strokeWidth}px
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          {(shape === 'star' || shape === 'polygon' || shape === 'burst') && (
            <div>
              <label className="text-sm text-slate-500 block mb-1">
                {t('tools.shapeGenerator.sides')}: {sides}
              </label>
              <input
                type="range"
                min="3"
                max="12"
                value={sides}
                onChange={(e) => setSides(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          )}
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.shapeGenerator.rotation')}: {rotation}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
