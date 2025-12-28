import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function MemeGenerator() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [topText, setTopText] = useState('TOP TEXT')
  const [bottomText, setBottomText] = useState('BOTTOM TEXT')
  const [fontSize, setFontSize] = useState(36)
  const [textColor, setTextColor] = useState('#ffffff')
  const [strokeColor, setStrokeColor] = useState('#000000')

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
    drawMeme()
  }, [image, topText, bottomText, fontSize, textColor, strokeColor])

  const drawMeme = () => {
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

    // Set text style
    ctx.font = `bold ${fontSize}px Impact, sans-serif`
    ctx.fillStyle = textColor
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = fontSize / 12
    ctx.textAlign = 'center'
    ctx.lineJoin = 'round'

    // Draw top text
    if (topText) {
      ctx.textBaseline = 'top'
      const topY = 20
      ctx.strokeText(topText.toUpperCase(), canvas.width / 2, topY)
      ctx.fillText(topText.toUpperCase(), canvas.width / 2, topY)
    }

    // Draw bottom text
    if (bottomText) {
      ctx.textBaseline = 'bottom'
      const bottomY = canvas.height - 20
      ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, bottomY)
      ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, bottomY)
    }
  }

  const downloadMeme = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'meme.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const templates = [
    { name: 'Drake', color: '#1da1f2' },
    { name: 'Distracted BF', color: '#e74c3c' },
    { name: 'Success Kid', color: '#27ae60' },
    { name: 'One Does Not', color: '#8e44ad' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        {!image ? (
          <label className="block w-full py-12 border-2 border-dashed border-slate-300 rounded-lg text-center cursor-pointer hover:border-blue-500">
            <div className="text-4xl mb-2">🖼️</div>
            <div className="text-slate-600">{t('tools.memeGenerator.upload')}</div>
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
                {t('tools.memeGenerator.change')}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={downloadMeme}
                className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {t('tools.memeGenerator.download')}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.memeGenerator.text')}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.memeGenerator.topText')}</label>
            <input
              type="text"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="TOP TEXT"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.memeGenerator.bottomText')}</label>
            <input
              type="text"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
              placeholder="BOTTOM TEXT"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.memeGenerator.style')}</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.memeGenerator.fontSize')}: {fontSize}px
            </label>
            <input
              type="range"
              min="20"
              max="72"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-500 block mb-1">{t('tools.memeGenerator.textColor')}</label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full h-10 cursor-pointer"
              />
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">{t('tools.memeGenerator.strokeColor')}</label>
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="w-full h-10 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.memeGenerator.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.memeGenerator.tip1')}</li>
          <li>• {t('tools.memeGenerator.tip2')}</li>
          <li>• {t('tools.memeGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
