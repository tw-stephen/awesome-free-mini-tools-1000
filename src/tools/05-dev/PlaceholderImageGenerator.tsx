import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function PlaceholderImageGenerator() {
  const { t } = useTranslation()
  const [width, setWidth] = useState(400)
  const [height, setHeight] = useState(300)
  const [bgColor, setBgColor] = useState('#cccccc')
  const [textColor, setTextColor] = useState('#666666')
  const [text, setText] = useState('')
  const [fontSize, setFontSize] = useState(24)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { copy, copied } = useClipboard()

  const displayText = text || `${width} × ${height}`

  const generateImage = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Fill background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, width, height)

    // Draw text
    ctx.fillStyle = textColor
    ctx.font = `${fontSize}px Arial, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(displayText, width / 2, height / 2)

    // Draw border
    ctx.strokeStyle = textColor
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, width - 2, height - 2)
  }, [width, height, bgColor, textColor, displayText, fontSize])

  useEffect(() => {
    generateImage()
  }, [generateImage])

  const downloadImage = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `placeholder-${width}x${height}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [width, height])

  const copyDataUrl = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    copy(canvas.toDataURL('image/png'))
  }, [copy])

  const presets = [
    { name: 'Thumbnail', w: 150, h: 150 },
    { name: 'Banner', w: 728, h: 90 },
    { name: 'Facebook Post', w: 1200, h: 630 },
    { name: 'Twitter Post', w: 1200, h: 675 },
    { name: 'Instagram Post', w: 1080, h: 1080 },
    { name: 'YouTube Thumbnail', w: 1280, h: 720 },
    { name: 'HD', w: 1920, h: 1080 },
    { name: 'Mobile', w: 375, h: 667 },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.placeholderImageGenerator.dimensions')}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.placeholderImageGenerator.width')}
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Math.min(2000, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              min="1"
              max="2000"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.placeholderImageGenerator.height')}
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Math.min(2000, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              min="1"
              max="2000"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {presets.map(preset => (
            <Button
              key={preset.name}
              variant="secondary"
              onClick={() => { setWidth(preset.w); setHeight(preset.h); }}
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.placeholderImageGenerator.appearance')}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.placeholderImageGenerator.bgColor')}
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.placeholderImageGenerator.textColor')}
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.placeholderImageGenerator.text')}
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`${width} × ${height}`}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.placeholderImageGenerator.fontSize')}: {fontSize}px
            </label>
            <input
              type="range"
              min="8"
              max="72"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full mt-2"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.placeholderImageGenerator.preview')}
          </h3>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={copyDataUrl}>
              {copied ? t('common.copied') : t('tools.placeholderImageGenerator.copyDataUrl')}
            </Button>
            <Button variant="primary" onClick={downloadImage}>
              {t('tools.placeholderImageGenerator.download')}
            </Button>
          </div>
        </div>

        <div className="flex justify-center p-4 bg-slate-100 rounded-lg overflow-auto">
          <canvas
            ref={canvasRef}
            style={{
              maxWidth: '100%',
              height: 'auto',
              border: '1px solid #e2e8f0'
            }}
          />
        </div>

        <p className="text-xs text-slate-500 mt-2 text-center">
          {width} × {height} px
        </p>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.placeholderImageGenerator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.placeholderImageGenerator.tip1')}</li>
          <li>{t('tools.placeholderImageGenerator.tip2')}</li>
          <li>{t('tools.placeholderImageGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
