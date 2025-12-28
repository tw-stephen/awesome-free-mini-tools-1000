import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function WatermarkMaker() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [text, setText] = useState('© Your Name')
  const [position, setPosition] = useState<'center' | 'bottom-right' | 'bottom-left' | 'tiled'>('bottom-right')
  const [opacity, setOpacity] = useState(50)
  const [fontSize, setFontSize] = useState(24)
  const [textColor, setTextColor] = useState('#ffffff')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = () => {
      setImage(img)
    }
    img.src = URL.createObjectURL(file)
  }

  useEffect(() => {
    if (!image) return
    drawWatermark()
  }, [image, text, position, opacity, fontSize, textColor])

  const drawWatermark = () => {
    const canvas = canvasRef.current
    if (!canvas || !image) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const maxSize = 500
    const scale = Math.min(maxSize / image.width, maxSize / image.height, 1)
    canvas.width = image.width * scale
    canvas.height = image.height * scale

    // Draw image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

    // Set watermark style
    ctx.font = `${fontSize}px Arial`
    ctx.fillStyle = textColor
    ctx.globalAlpha = opacity / 100

    const textWidth = ctx.measureText(text).width
    const padding = 20

    if (position === 'tiled') {
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.rotate(-Math.PI / 6)
      const spacing = Math.max(textWidth + 50, 150)
      for (let y = -canvas.height; y < canvas.height * 2; y += spacing) {
        for (let x = -canvas.width; x < canvas.width * 2; x += spacing) {
          ctx.fillText(text, x, y)
        }
      }
    } else {
      let x: number, y: number

      switch (position) {
        case 'center':
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          x = canvas.width / 2
          y = canvas.height / 2
          break
        case 'bottom-left':
          ctx.textAlign = 'left'
          ctx.textBaseline = 'bottom'
          x = padding
          y = canvas.height - padding
          break
        case 'bottom-right':
        default:
          ctx.textAlign = 'right'
          ctx.textBaseline = 'bottom'
          x = canvas.width - padding
          y = canvas.height - padding
          break
      }

      // Draw shadow for readability
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
      ctx.shadowBlur = 4
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2

      ctx.fillText(text, x, y)
    }

    ctx.globalAlpha = 1
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'watermarked-image.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const positions = [
    { id: 'bottom-right', name: 'Bottom Right' },
    { id: 'bottom-left', name: 'Bottom Left' },
    { id: 'center', name: 'Center' },
    { id: 'tiled', name: 'Tiled' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        {!image ? (
          <label className="block w-full py-12 border-2 border-dashed border-slate-300 rounded-lg text-center cursor-pointer hover:border-blue-500">
            <div className="text-4xl mb-2">🖼️</div>
            <div className="text-slate-600">{t('tools.watermarkMaker.upload')}</div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <canvas ref={canvasRef} className="max-w-full border border-slate-200 rounded" />
            </div>
            <div className="flex gap-2">
              <label className="flex-1 py-2 bg-slate-100 rounded text-center cursor-pointer hover:bg-slate-200">
                {t('tools.watermarkMaker.change')}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={downloadImage}
                className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {t('tools.watermarkMaker.download')}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.watermarkMaker.text')}</h3>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded"
          placeholder="© Your Name"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.watermarkMaker.position')}</h3>
        <div className="grid grid-cols-4 gap-2">
          {positions.map((pos) => (
            <button
              key={pos.id}
              onClick={() => setPosition(pos.id as any)}
              className={`py-2 rounded text-sm ${
                position === pos.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {pos.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.watermarkMaker.settings')}</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.watermarkMaker.color')}
            </label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.watermarkMaker.opacity')}: {opacity}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.watermarkMaker.fontSize')}: {fontSize}px
            </label>
            <input
              type="range"
              min="12"
              max="72"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
