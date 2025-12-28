import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function FaviconGenerator() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [letter, setLetter] = useState('F')
  const [bgColor, setBgColor] = useState('#3B82F6')
  const [textColor, setTextColor] = useState('#ffffff')
  const [shape, setShape] = useState<'square' | 'rounded' | 'circle'>('rounded')

  useEffect(() => {
    drawFavicon()
  }, [letter, bgColor, textColor, shape])

  const drawFavicon = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = 64
    canvas.width = size
    canvas.height = size

    // Clear
    ctx.clearRect(0, 0, size, size)

    // Draw background shape
    ctx.fillStyle = bgColor
    if (shape === 'circle') {
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
      ctx.fill()
    } else if (shape === 'rounded') {
      ctx.beginPath()
      ctx.roundRect(0, 0, size, size, size / 4)
      ctx.fill()
    } else {
      ctx.fillRect(0, 0, size, size)
    }

    // Draw letter
    ctx.fillStyle = textColor
    ctx.font = 'bold 40px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(letter.charAt(0).toUpperCase(), size / 2, size / 2)
  }

  const downloadFavicon = (downloadSize: number) => {
    const canvas = document.createElement('canvas')
    canvas.width = downloadSize
    canvas.height = downloadSize
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw background shape
    ctx.fillStyle = bgColor
    if (shape === 'circle') {
      ctx.beginPath()
      ctx.arc(downloadSize / 2, downloadSize / 2, downloadSize / 2, 0, Math.PI * 2)
      ctx.fill()
    } else if (shape === 'rounded') {
      ctx.beginPath()
      ctx.roundRect(0, 0, downloadSize, downloadSize, downloadSize / 4)
      ctx.fill()
    } else {
      ctx.fillRect(0, 0, downloadSize, downloadSize)
    }

    // Draw letter
    ctx.fillStyle = textColor
    ctx.font = `bold ${downloadSize * 0.625}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(letter.charAt(0).toUpperCase(), downloadSize / 2, downloadSize / 2)

    const link = document.createElement('a')
    link.download = `favicon-${downloadSize}x${downloadSize}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const presets = [
    { bg: '#3B82F6', text: '#ffffff' },
    { bg: '#10B981', text: '#ffffff' },
    { bg: '#EF4444', text: '#ffffff' },
    { bg: '#8B5CF6', text: '#ffffff' },
    { bg: '#F59E0B', text: '#000000' },
    { bg: '#000000', text: '#ffffff' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4 text-center">
        <canvas
          ref={canvasRef}
          className="mx-auto border border-slate-200 rounded"
          style={{ width: 128, height: 128 }}
        />
        <div className="mt-4 flex gap-2 justify-center flex-wrap">
          {[16, 32, 48, 64, 128, 180, 192, 512].map((size) => (
            <button
              key={size}
              onClick={() => downloadFavicon(size)}
              className="px-3 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200"
            >
              {size}px
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.faviconGenerator.letter')}</h3>
        <input
          type="text"
          value={letter}
          onChange={(e) => setLetter(e.target.value)}
          maxLength={1}
          className="w-full px-4 py-3 text-center text-3xl font-bold border border-slate-300 rounded"
          placeholder="F"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.faviconGenerator.shape')}</h3>
        <div className="flex gap-2">
          {(['square', 'rounded', 'circle'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setShape(s)}
              className={`flex-1 py-2 rounded capitalize ${
                shape === s ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.faviconGenerator.colors')}</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.faviconGenerator.bgColor')}</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.faviconGenerator.textColor')}</label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
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
              className="w-8 h-8 rounded border-2 border-slate-200 hover:scale-110 transition-transform"
              style={{ backgroundColor: preset.bg }}
            />
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.faviconGenerator.about')}</h4>
        <p className="text-sm text-slate-600">
          {t('tools.faviconGenerator.aboutText')}
        </p>
      </div>
    </div>
  )
}
