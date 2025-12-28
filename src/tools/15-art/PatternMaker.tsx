import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export default function PatternMaker() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [patternType, setPatternType] = useState<'dots' | 'lines' | 'grid' | 'chevron' | 'waves'>('dots')
  const [primaryColor, setPrimaryColor] = useState('#3B82F6')
  const [secondaryColor, setSecondaryColor] = useState('#ffffff')
  const [size, setSize] = useState(20)
  const [spacing, setSpacing] = useState(10)

  useEffect(() => {
    drawPattern()
  }, [patternType, primaryColor, secondaryColor, size, spacing])

  const drawPattern = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear and set background
    ctx.fillStyle = secondaryColor
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = primaryColor

    const totalSize = size + spacing

    switch (patternType) {
      case 'dots':
        for (let x = 0; x < width; x += totalSize) {
          for (let y = 0; y < height; y += totalSize) {
            ctx.beginPath()
            ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2)
            ctx.fill()
          }
        }
        break

      case 'lines':
        ctx.lineWidth = size
        ctx.strokeStyle = primaryColor
        for (let i = -height; i < width + height; i += totalSize) {
          ctx.beginPath()
          ctx.moveTo(i, 0)
          ctx.lineTo(i + height, height)
          ctx.stroke()
        }
        break

      case 'grid':
        ctx.lineWidth = size / 4
        ctx.strokeStyle = primaryColor
        for (let x = 0; x < width; x += totalSize) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, height)
          ctx.stroke()
        }
        for (let y = 0; y < height; y += totalSize) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(width, y)
          ctx.stroke()
        }
        break

      case 'chevron':
        ctx.lineWidth = size / 3
        ctx.strokeStyle = primaryColor
        for (let y = 0; y < height; y += totalSize) {
          ctx.beginPath()
          for (let x = 0; x < width; x += totalSize) {
            ctx.moveTo(x, y + totalSize/2)
            ctx.lineTo(x + totalSize/2, y)
            ctx.lineTo(x + totalSize, y + totalSize/2)
          }
          ctx.stroke()
        }
        break

      case 'waves':
        ctx.lineWidth = size / 3
        ctx.strokeStyle = primaryColor
        for (let y = 0; y < height; y += totalSize) {
          ctx.beginPath()
          ctx.moveTo(0, y + totalSize/2)
          for (let x = 0; x < width; x += 1) {
            const wave = Math.sin(x / totalSize * Math.PI * 2) * (totalSize / 4)
            ctx.lineTo(x, y + totalSize/2 + wave)
          }
          ctx.stroke()
        }
        break
    }
  }

  const downloadPattern = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `pattern-${patternType}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const patterns: { id: typeof patternType; name: string; icon: string }[] = [
    { id: 'dots', name: 'Dots', icon: '●●' },
    { id: 'lines', name: 'Lines', icon: '///' },
    { id: 'grid', name: 'Grid', icon: '▦' },
    { id: 'chevron', name: 'Chevron', icon: '⟨⟩' },
    { id: 'waves', name: 'Waves', icon: '∿' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="border border-slate-200 rounded-lg"
          />
        </div>
        <button
          onClick={downloadPattern}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          ⬇️ {t('tools.patternMaker.download')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.patternMaker.patternType')}</h3>
        <div className="grid grid-cols-5 gap-2">
          {patterns.map((pattern) => (
            <button
              key={pattern.id}
              onClick={() => setPatternType(pattern.id)}
              className={`p-3 rounded-lg transition-all text-center ${
                patternType === pattern.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <div className="text-xl">{pattern.icon}</div>
              <div className="text-xs mt-1">{pattern.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.patternMaker.colors')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.patternMaker.primary')}</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-12 h-10 cursor-pointer"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded font-mono text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.patternMaker.background')}</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-12 h-10 cursor-pointer"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.patternMaker.settings')}</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.patternMaker.size')}: {size}px
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.patternMaker.spacing')}: {spacing}px
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={spacing}
              onChange={(e) => setSpacing(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.patternMaker.about')}</h4>
        <p className="text-sm text-slate-600">
          {t('tools.patternMaker.aboutText')}
        </p>
      </div>
    </div>
  )
}
