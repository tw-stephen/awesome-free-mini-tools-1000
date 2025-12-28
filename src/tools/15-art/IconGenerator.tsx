import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function IconGenerator() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [iconText, setIconText] = useState('AB')
  const [bgColor, setBgColor] = useState('#3B82F6')
  const [textColor, setTextColor] = useState('#ffffff')
  const [shape, setShape] = useState<'circle' | 'square' | 'rounded'>('circle')
  const [size, setSize] = useState(128)
  const [fontSize, setFontSize] = useState(48)

  useEffect(() => {
    drawIcon()
  }, [iconText, bgColor, textColor, shape, size, fontSize])

  const drawIcon = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    // Clear
    ctx.clearRect(0, 0, size, size)

    // Draw background
    ctx.fillStyle = bgColor
    const radius = size / 4

    if (shape === 'circle') {
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
      ctx.fill()
    } else if (shape === 'rounded') {
      ctx.beginPath()
      ctx.roundRect(0, 0, size, size, radius)
      ctx.fill()
    } else {
      ctx.fillRect(0, 0, size, size)
    }

    // Draw text
    ctx.fillStyle = textColor
    ctx.font = `bold ${fontSize}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(iconText.toUpperCase().slice(0, 2), size / 2, size / 2)
  }

  const downloadIcon = (downloadSize: number) => {
    const canvas = document.createElement('canvas')
    canvas.width = downloadSize
    canvas.height = downloadSize
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const scale = downloadSize / size

    // Draw background
    ctx.fillStyle = bgColor
    const radius = downloadSize / 4

    if (shape === 'circle') {
      ctx.beginPath()
      ctx.arc(downloadSize / 2, downloadSize / 2, downloadSize / 2, 0, Math.PI * 2)
      ctx.fill()
    } else if (shape === 'rounded') {
      ctx.beginPath()
      ctx.roundRect(0, 0, downloadSize, downloadSize, radius)
      ctx.fill()
    } else {
      ctx.fillRect(0, 0, downloadSize, downloadSize)
    }

    // Draw text
    ctx.fillStyle = textColor
    ctx.font = `bold ${fontSize * scale}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(iconText.toUpperCase().slice(0, 2), downloadSize / 2, downloadSize / 2)

    const link = document.createElement('a')
    link.download = `icon-${downloadSize}x${downloadSize}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const downloadAllSizes = () => {
    [16, 32, 64, 128, 256, 512].forEach((s, i) => {
      setTimeout(() => downloadIcon(s), i * 100)
    })
  }

  const presets = [
    { bg: '#3B82F6', text: '#ffffff' },
    { bg: '#10B981', text: '#ffffff' },
    { bg: '#F59E0B', text: '#ffffff' },
    { bg: '#EF4444', text: '#ffffff' },
    { bg: '#8B5CF6', text: '#ffffff' },
    { bg: '#EC4899', text: '#ffffff' },
    { bg: '#000000', text: '#ffffff' },
    { bg: '#ffffff', text: '#000000' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4 text-center">
        <canvas
          ref={canvasRef}
          className="mx-auto border border-slate-200 rounded-lg"
          style={{ width: size, height: size }}
        />
        <div className="mt-4 flex gap-2 justify-center">
          <button
            onClick={() => downloadIcon(size)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ⬇️ {t('tools.iconGenerator.download')} ({size}px)
          </button>
          <button
            onClick={downloadAllSizes}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            📦 {t('tools.iconGenerator.downloadAll')}
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.iconGenerator.text')}</h3>
        <input
          type="text"
          value={iconText}
          onChange={(e) => setIconText(e.target.value)}
          maxLength={2}
          className="w-full px-4 py-3 text-center text-2xl font-bold border border-slate-300 rounded"
          placeholder="AB"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.iconGenerator.colors')}</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.iconGenerator.bgColor')}</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-12 h-10 cursor-pointer"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="flex-1 px-2 py-1 border border-slate-300 rounded font-mono text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.iconGenerator.textColor')}</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-12 h-10 cursor-pointer"
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="flex-1 px-2 py-1 border border-slate-300 rounded font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {presets.map((preset, i) => (
            <button
              key={i}
              onClick={() => {
                setBgColor(preset.bg)
                setTextColor(preset.text)
              }}
              className="w-8 h-8 rounded-full border-2 border-slate-200 hover:scale-110 transition-transform"
              style={{ backgroundColor: preset.bg }}
            />
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.iconGenerator.shape')}</h3>
        <div className="flex gap-2">
          {(['circle', 'rounded', 'square'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setShape(s)}
              className={`flex-1 py-2 rounded font-medium ${
                shape === s ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {s === 'circle' && '○'} {s === 'rounded' && '▢'} {s === 'square' && '□'}
              <span className="ml-1 capitalize">{t('tools.iconGenerator.' + s)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.iconGenerator.settings')}</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.iconGenerator.size')}: {size}px
            </label>
            <input
              type="range"
              min="32"
              max="256"
              step="16"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.iconGenerator.fontSize')}: {fontSize}px
            </label>
            <input
              type="range"
              min="16"
              max="96"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.iconGenerator.about')}</h4>
        <p className="text-sm text-slate-600">
          {t('tools.iconGenerator.aboutText')}
        </p>
      </div>
    </div>
  )
}
