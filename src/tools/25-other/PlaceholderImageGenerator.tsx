import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function PlaceholderImageGenerator() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [width, setWidth] = useState(400)
  const [height, setHeight] = useState(300)
  const [bgColor, setBgColor] = useState('#e2e8f0')
  const [textColor, setTextColor] = useState('#64748b')
  const [text, setText] = useState('')
  const [showDimensions, setShowDimensions] = useState(true)
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png')

  const displayText = text || (showDimensions ? `${width} × ${height}` : '')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = width
    canvas.height = height

    // Background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, width, height)

    // Text
    if (displayText) {
      ctx.fillStyle = textColor
      const fontSize = Math.min(width, height) / 8
      ctx.font = `bold ${fontSize}px system-ui, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(displayText, width / 2, height / 2)
    }

    // Border
    ctx.strokeStyle = textColor
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, width - 2, height - 2)

    // Diagonal lines
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(width, height)
    ctx.moveTo(width, 0)
    ctx.lineTo(0, height)
    ctx.strokeStyle = textColor
    ctx.globalAlpha = 0.1
    ctx.stroke()
    ctx.globalAlpha = 1
  }, [width, height, bgColor, textColor, displayText])

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const mimeType = `image/${format}`
    const a = document.createElement('a')
    a.download = `placeholder-${width}x${height}.${format}`
    a.href = canvas.toDataURL(mimeType, 0.9)
    a.click()
  }

  const copyToClipboard = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/png')
      })
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const presets = [
    { name: 'Square', w: 400, h: 400 },
    { name: 'Banner', w: 728, h: 90 },
    { name: 'Thumbnail', w: 150, h: 150 },
    { name: 'Card', w: 350, h: 200 },
    { name: 'HD', w: 1280, h: 720 },
    { name: 'Full HD', w: 1920, h: 1080 },
    { name: 'Instagram', w: 1080, h: 1080 },
    { name: 'Story', w: 1080, h: 1920 }
  ]

  const colorPresets = [
    { name: 'Gray', bg: '#e2e8f0', text: '#64748b' },
    { name: 'Blue', bg: '#dbeafe', text: '#3b82f6' },
    { name: 'Green', bg: '#dcfce7', text: '#22c55e' },
    { name: 'Red', bg: '#fee2e2', text: '#ef4444' },
    { name: 'Purple', bg: '#f3e8ff', text: '#a855f7' },
    { name: 'Dark', bg: '#1e293b', text: '#94a3b8' }
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <div className="flex gap-1 flex-wrap">
          {presets.slice(0, 4).map(preset => (
            <button
              key={preset.name}
              onClick={() => { setWidth(preset.w); setHeight(preset.h) }}
              className="px-2 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              {preset.name}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <Button variant="secondary" onClick={copyToClipboard}>{t('common.copy')}</Button>
        <Button variant="secondary" onClick={downloadImage}>{t('common.download')}</Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-center p-4 bg-slate-50 rounded-lg overflow-auto">
            <canvas
              ref={canvasRef}
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                width: width > 600 ? '100%' : 'auto'
              }}
              className="shadow-lg"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {presets.map(preset => (
              <button
                key={preset.name}
                onClick={() => { setWidth(preset.w); setHeight(preset.h) }}
                className={`px-3 py-2 text-xs rounded border ${
                  width === preset.w && height === preset.h
                    ? 'border-blue-300 bg-blue-50 text-blue-600'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-medium">{preset.name}</div>
                <div className="text-slate-400">{preset.w}×{preset.h}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4 max-h-[550px] overflow-auto">
          <h3 className="font-semibold text-slate-700">{t('tools.placeholder.settings')}</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.placeholder.width')}</label>
                <input
                  type="number"
                  min="10"
                  max="2000"
                  value={width}
                  onChange={(e) => setWidth(Math.max(10, parseInt(e.target.value) || 100))}
                  className="input w-full text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.placeholder.height')}</label>
                <input
                  type="number"
                  min="10"
                  max="2000"
                  value={height}
                  onChange={(e) => setHeight(Math.max(10, parseInt(e.target.value) || 100))}
                  className="input w-full text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.placeholder.text')}</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`${width} × ${height}`}
                className="input w-full text-sm"
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showDimensions}
                onChange={(e) => setShowDimensions(e.target.checked)}
                className="rounded"
              />
              {t('tools.placeholder.showDimensions')}
            </label>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.placeholder.bgColor')}</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="input flex-1 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.placeholder.textColor')}</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-10 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="input flex-1 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-2">{t('tools.placeholder.colorPresets')}</label>
              <div className="grid grid-cols-3 gap-1">
                {colorPresets.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => { setBgColor(preset.bg); setTextColor(preset.text) }}
                    className="p-2 rounded border border-slate-200 hover:border-slate-300"
                    style={{ backgroundColor: preset.bg }}
                  >
                    <span className="text-xs" style={{ color: preset.text }}>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.placeholder.format')}</label>
              <div className="flex gap-1">
                {(['png', 'jpeg', 'webp'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`flex-1 px-2 py-1 text-xs rounded ${format === f ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
