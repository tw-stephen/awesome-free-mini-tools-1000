import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function FaviconGenerator() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [text, setText] = useState('A')
  const [bgColor, setBgColor] = useState('#3b82f6')
  const [textColor, setTextColor] = useState('#ffffff')
  const [fontSize, setFontSize] = useState(70)
  const [borderRadius, setBorderRadius] = useState(20)
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('bold')

  const sizes = [16, 32, 48, 64, 128, 180, 192, 512]
  const previewSize = 128

  useEffect(() => {
    renderCanvas(previewSize)
  }, [text, bgColor, textColor, fontSize, borderRadius, fontWeight])

  const renderCanvas = (size: number, targetCanvas?: HTMLCanvasElement) => {
    const canvas = targetCanvas || canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    const scale = size / 100
    const radius = borderRadius * scale

    // Clear
    ctx.clearRect(0, 0, size, size)

    // Rounded rectangle background
    ctx.beginPath()
    ctx.moveTo(radius, 0)
    ctx.lineTo(size - radius, 0)
    ctx.quadraticCurveTo(size, 0, size, radius)
    ctx.lineTo(size, size - radius)
    ctx.quadraticCurveTo(size, size, size - radius, size)
    ctx.lineTo(radius, size)
    ctx.quadraticCurveTo(0, size, 0, size - radius)
    ctx.lineTo(0, radius)
    ctx.quadraticCurveTo(0, 0, radius, 0)
    ctx.closePath()
    ctx.fillStyle = bgColor
    ctx.fill()

    // Text
    if (text) {
      ctx.fillStyle = textColor
      const actualFontSize = (fontSize / 100) * size
      ctx.font = `${fontWeight} ${actualFontSize}px system-ui, -apple-system, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text.slice(0, 2), size / 2, size / 2 + actualFontSize * 0.05)
    }
  }

  const downloadFavicon = (size: number) => {
    const tempCanvas = document.createElement('canvas')
    renderCanvas(size, tempCanvas)
    const a = document.createElement('a')
    a.download = `favicon-${size}x${size}.png`
    a.href = tempCanvas.toDataURL('image/png')
    a.click()
  }

  const downloadAll = () => {
    sizes.forEach((size, index) => {
      setTimeout(() => downloadFavicon(size), index * 200)
    })
  }

  const downloadICO = () => {
    // For simplicity, download as 32x32 PNG (real ICO generation would need a library)
    downloadFavicon(32)
  }

  const colorPresets = [
    { name: 'Blue', bg: '#3b82f6', text: '#ffffff' },
    { name: 'Green', bg: '#22c55e', text: '#ffffff' },
    { name: 'Red', bg: '#ef4444', text: '#ffffff' },
    { name: 'Purple', bg: '#8b5cf6', text: '#ffffff' },
    { name: 'Orange', bg: '#f97316', text: '#ffffff' },
    { name: 'Pink', bg: '#ec4899', text: '#ffffff' },
    { name: 'Dark', bg: '#1e293b', text: '#ffffff' },
    { name: 'Light', bg: '#f1f5f9', text: '#1e293b' }
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button onClick={downloadAll}>{t('tools.favicon.downloadAll')}</Button>
        <div className="flex-1" />
        <Button variant="secondary" onClick={downloadICO}>{t('tools.favicon.downloadICO')}</Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-center p-8 bg-slate-100 rounded-lg">
            <div className="flex flex-col items-center gap-4">
              <canvas
                ref={canvasRef}
                width={previewSize}
                height={previewSize}
                className="shadow-xl rounded-2xl"
              />
              <div className="text-sm text-slate-500">{previewSize}×{previewSize} {t('tools.favicon.preview')}</div>
            </div>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {sizes.map(size => {
              const displaySize = Math.min(size, 64)
              return (
                <div
                  key={size}
                  className="flex flex-col items-center gap-2 p-2 border border-slate-200 rounded-lg hover:border-slate-300 cursor-pointer"
                  onClick={() => downloadFavicon(size)}
                >
                  <div
                    className="rounded flex items-center justify-center font-bold text-white"
                    style={{
                      width: displaySize,
                      height: displaySize,
                      backgroundColor: bgColor,
                      fontSize: displaySize * 0.5,
                      borderRadius: borderRadius * displaySize / 100
                    }}
                  >
                    {text.slice(0, 2)}
                  </div>
                  <span className="text-xs text-slate-500">{size}px</span>
                </div>
              )
            })}
          </div>

          <div className="p-3 bg-slate-800 rounded-lg">
            <code className="text-xs text-green-400 block">
              {'<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">'}
            </code>
            <code className="text-xs text-green-400 block mt-1">
              {'<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png">'}
            </code>
          </div>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.favicon.settings')}</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.favicon.text')}</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={2}
                placeholder="A"
                className="input w-full text-center text-xl font-bold"
              />
              <div className="text-xs text-slate-400 mt-1">{t('tools.favicon.maxChars')}</div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.favicon.bgColor')}</label>
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
              <label className="block text-xs text-slate-500 mb-1">{t('tools.favicon.textColor')}</label>
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
              <label className="block text-xs text-slate-500 mb-2">{t('tools.favicon.colorPresets')}</label>
              <div className="grid grid-cols-4 gap-1">
                {colorPresets.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => { setBgColor(preset.bg); setTextColor(preset.text) }}
                    className="w-full aspect-square rounded"
                    style={{ backgroundColor: preset.bg }}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.favicon.fontSize')} ({fontSize}%)</label>
              <input
                type="range"
                min="30"
                max="90"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.favicon.borderRadius')} ({borderRadius}%)</label>
              <input
                type="range"
                min="0"
                max="50"
                value={borderRadius}
                onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.favicon.fontWeight')}</label>
              <div className="flex gap-1">
                <button
                  onClick={() => setFontWeight('normal')}
                  className={`flex-1 px-2 py-1 text-xs rounded ${fontWeight === 'normal' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                >
                  Normal
                </button>
                <button
                  onClick={() => setFontWeight('bold')}
                  className={`flex-1 px-2 py-1 text-xs rounded ${fontWeight === 'bold' ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                >
                  Bold
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
