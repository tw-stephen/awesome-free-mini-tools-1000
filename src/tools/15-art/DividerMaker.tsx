import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function DividerMaker() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dividerType, setDividerType] = useState<'line' | 'dashed' | 'dotted' | 'wave' | 'zigzag' | 'gradient'>('line')
  const [primaryColor, setPrimaryColor] = useState('#3B82F6')
  const [secondaryColor, setSecondaryColor] = useState('#8B5CF6')
  const [thickness, setThickness] = useState(3)
  const [width, setWidth] = useState(400)

  useEffect(() => {
    drawDivider()
  }, [dividerType, primaryColor, secondaryColor, thickness, width])

  const drawDivider = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const height = 60
    canvas.width = width
    canvas.height = height

    ctx.clearRect(0, 0, width, height)

    const centerY = height / 2

    ctx.strokeStyle = primaryColor
    ctx.lineWidth = thickness
    ctx.lineCap = 'round'

    switch (dividerType) {
      case 'line':
        ctx.beginPath()
        ctx.moveTo(20, centerY)
        ctx.lineTo(width - 20, centerY)
        ctx.stroke()
        break

      case 'dashed':
        ctx.setLineDash([20, 10])
        ctx.beginPath()
        ctx.moveTo(20, centerY)
        ctx.lineTo(width - 20, centerY)
        ctx.stroke()
        ctx.setLineDash([])
        break

      case 'dotted':
        for (let x = 20; x < width - 20; x += 15) {
          ctx.beginPath()
          ctx.arc(x, centerY, thickness, 0, Math.PI * 2)
          ctx.fillStyle = primaryColor
          ctx.fill()
        }
        break

      case 'wave':
        ctx.beginPath()
        ctx.moveTo(20, centerY)
        for (let x = 20; x <= width - 20; x++) {
          const y = centerY + Math.sin((x - 20) * 0.05) * 10
          ctx.lineTo(x, y)
        }
        ctx.stroke()
        break

      case 'zigzag':
        ctx.beginPath()
        ctx.moveTo(20, centerY)
        let up = true
        for (let x = 20; x <= width - 20; x += 15) {
          ctx.lineTo(x, up ? centerY - 10 : centerY + 10)
          up = !up
        }
        ctx.stroke()
        break

      case 'gradient':
        const gradient = ctx.createLinearGradient(20, 0, width - 20, 0)
        gradient.addColorStop(0, primaryColor)
        gradient.addColorStop(0.5, secondaryColor)
        gradient.addColorStop(1, primaryColor)
        ctx.strokeStyle = gradient
        ctx.beginPath()
        ctx.moveTo(20, centerY)
        ctx.lineTo(width - 20, centerY)
        ctx.stroke()
        break
    }
  }

  const downloadDivider = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `divider-${dividerType}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const getCSSCode = (): string => {
    switch (dividerType) {
      case 'line':
        return `border-top: ${thickness}px solid ${primaryColor};`
      case 'dashed':
        return `border-top: ${thickness}px dashed ${primaryColor};`
      case 'dotted':
        return `border-top: ${thickness}px dotted ${primaryColor};`
      case 'gradient':
        return `height: ${thickness}px;\nbackground: linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${primaryColor});`
      default:
        return `/* Use the downloaded image as background */\nbackground-image: url('divider.png');\nbackground-repeat: no-repeat;\nbackground-position: center;`
    }
  }

  const dividers = [
    { id: 'line', name: 'Line', icon: '━' },
    { id: 'dashed', name: 'Dashed', icon: '┅' },
    { id: 'dotted', name: 'Dotted', icon: '┈' },
    { id: 'wave', name: 'Wave', icon: '∿' },
    { id: 'zigzag', name: 'Zigzag', icon: '⋀' },
    { id: 'gradient', name: 'Gradient', icon: '▬' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="bg-slate-100 p-8 rounded-lg flex items-center justify-center">
          <canvas ref={canvasRef} className="bg-white rounded" />
        </div>
        <button
          onClick={downloadDivider}
          className="w-full mt-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          {t('tools.dividerMaker.download')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.dividerMaker.type')}</h3>
        <div className="grid grid-cols-3 gap-2">
          {dividers.map((div) => (
            <button
              key={div.id}
              onClick={() => setDividerType(div.id as any)}
              className={`p-3 rounded-lg text-center ${
                dividerType === div.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <div className="text-xl">{div.icon}</div>
              <div className="text-xs mt-1">{div.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.dividerMaker.colors')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.dividerMaker.primary')}</label>
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
          {dividerType === 'gradient' && (
            <div>
              <label className="text-sm text-slate-500 block mb-1">{t('tools.dividerMaker.secondary')}</label>
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-full h-10 cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.dividerMaker.settings')}</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.dividerMaker.thickness')}: {thickness}px
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={thickness}
              onChange={(e) => setThickness(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.dividerMaker.width')}: {width}px
            </label>
            <input
              type="range"
              min="200"
              max="800"
              step="50"
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="card p-4 bg-slate-800 text-white font-mono text-sm">
        <div className="text-slate-400 mb-2">/* CSS */</div>
        <pre>{getCSSCode()}</pre>
      </div>
    </div>
  )
}
