import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function BannerCreator() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [headline, setHeadline] = useState('Your Banner')
  const [subtext, setSubtext] = useState('Click here to learn more')
  const [bgColor1, setBgColor1] = useState('#3B82F6')
  const [bgColor2, setBgColor2] = useState('#8B5CF6')
  const [textColor, setTextColor] = useState('#ffffff')
  const [size, setSize] = useState<'leaderboard' | 'medium' | 'wide'>('leaderboard')

  const sizes = {
    leaderboard: { width: 728, height: 90, name: 'Leaderboard (728×90)' },
    medium: { width: 300, height: 250, name: 'Medium Rectangle (300×250)' },
    wide: { width: 970, height: 250, name: 'Wide (970×250)' },
  }

  useEffect(() => {
    drawBanner()
  }, [headline, subtext, bgColor1, bgColor2, textColor, size])

  const drawBanner = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = sizes[size]
    canvas.width = width
    canvas.height = height

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, bgColor1)
    gradient.addColorStop(1, bgColor2)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Headline
    ctx.fillStyle = textColor
    const headlineSize = size === 'leaderboard' ? 28 : 32
    ctx.font = `bold ${headlineSize}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(headline, width / 2, height / 2 - 15)

    // Subtext
    ctx.font = '16px Arial'
    ctx.fillText(subtext, width / 2, height / 2 + 20)
  }

  const downloadBanner = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `banner-${sizes[size].width}x${sizes[size].height}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="overflow-x-auto mb-4">
          <canvas
            ref={canvasRef}
            className="border border-slate-200 rounded mx-auto block"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
        <button
          onClick={downloadBanner}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          {t('tools.bannerCreator.download')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.bannerCreator.size')}</h3>
        <div className="space-y-2">
          {(Object.keys(sizes) as Array<keyof typeof sizes>).map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`w-full py-2 px-4 rounded text-left ${
                size === s ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {sizes[s].name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.bannerCreator.text')}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.bannerCreator.headline')}</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.bannerCreator.subtext')}</label>
            <input
              type="text"
              value={subtext}
              onChange={(e) => setSubtext(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.bannerCreator.colors')}</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.bannerCreator.gradientStart')}</label>
            <input
              type="color"
              value={bgColor1}
              onChange={(e) => setBgColor1(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.bannerCreator.gradientEnd')}</label>
            <input
              type="color"
              value={bgColor2}
              onChange={(e) => setBgColor2(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.bannerCreator.textColor')}</label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
