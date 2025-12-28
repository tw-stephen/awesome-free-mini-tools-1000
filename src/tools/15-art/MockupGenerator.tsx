import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function MockupGenerator() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [device, setDevice] = useState<'phone' | 'tablet' | 'laptop' | 'desktop'>('phone')
  const [screenColor, setScreenColor] = useState('#3B82F6')
  const [deviceColor, setDeviceColor] = useState('#1F2937')
  const [showContent, setShowContent] = useState(true)

  const devices = {
    phone: { width: 120, height: 240, screenWidth: 100, screenHeight: 200, radius: 20 },
    tablet: { width: 200, height: 280, screenWidth: 180, screenHeight: 250, radius: 15 },
    laptop: { width: 300, height: 200, screenWidth: 280, screenHeight: 160, radius: 8 },
    desktop: { width: 280, height: 200, screenWidth: 260, screenHeight: 160, radius: 5 },
  }

  useEffect(() => {
    drawMockup()
  }, [device, screenColor, deviceColor, showContent])

  const drawMockup = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const d = devices[device]
    canvas.width = 400
    canvas.height = 350

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Background
    ctx.fillStyle = '#f1f5f9'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Draw device frame
    ctx.fillStyle = deviceColor
    ctx.beginPath()
    if (device === 'laptop') {
      // Screen part
      ctx.roundRect(centerX - d.width / 2, centerY - d.height / 2 - 20, d.width, d.height, d.radius)
      ctx.fill()
      // Base
      ctx.fillRect(centerX - d.width / 2 - 20, centerY + d.height / 2 - 20, d.width + 40, 20)
      ctx.fillRect(centerX - d.width / 2 - 30, centerY + d.height / 2, d.width + 60, 10)
    } else if (device === 'desktop') {
      // Monitor
      ctx.roundRect(centerX - d.width / 2, centerY - d.height / 2 - 40, d.width, d.height, d.radius)
      ctx.fill()
      // Stand
      ctx.fillRect(centerX - 30, centerY + d.height / 2 - 40, 60, 40)
      ctx.fillRect(centerX - 50, centerY + d.height / 2, 100, 15)
    } else {
      ctx.roundRect(centerX - d.width / 2, centerY - d.height / 2, d.width, d.height, d.radius)
      ctx.fill()
    }

    // Draw screen
    ctx.fillStyle = screenColor
    const screenX = centerX - d.screenWidth / 2
    const screenY = device === 'laptop' || device === 'desktop'
      ? centerY - d.screenHeight / 2 - (device === 'laptop' ? 15 : 35)
      : centerY - d.screenHeight / 2 + 10
    ctx.fillRect(screenX, screenY, d.screenWidth, d.screenHeight)

    // Draw content placeholders
    if (showContent) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      const contentWidth = d.screenWidth - 20

      // Header
      ctx.fillRect(screenX + 10, screenY + 10, contentWidth, 15)

      // Content blocks
      ctx.fillRect(screenX + 10, screenY + 35, contentWidth * 0.6, 10)
      ctx.fillRect(screenX + 10, screenY + 50, contentWidth * 0.8, 10)
      ctx.fillRect(screenX + 10, screenY + 65, contentWidth * 0.5, 10)

      if (d.screenHeight > 100) {
        ctx.fillRect(screenX + 10, screenY + 90, contentWidth, 40)
        ctx.fillRect(screenX + 10, screenY + 140, contentWidth * 0.7, 10)
      }
    }

    // Camera for phones/tablets
    if (device === 'phone' || device === 'tablet') {
      ctx.fillStyle = '#374151'
      ctx.beginPath()
      ctx.arc(centerX, centerY - d.height / 2 + 15, 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const downloadMockup = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `mockup-${device}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            className="border border-slate-200 rounded-lg"
          />
        </div>
        <button
          onClick={downloadMockup}
          className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
        >
          {t('tools.mockupGenerator.download')}
        </button>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.mockupGenerator.device')}</h3>
        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(devices) as Array<keyof typeof devices>).map((d) => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              className={`py-2 rounded capitalize ${
                device === d ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.mockupGenerator.colors')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.mockupGenerator.screenColor')}</label>
            <input
              type="color"
              value={screenColor}
              onChange={(e) => setScreenColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.mockupGenerator.deviceColor')}</label>
            <input
              type="color"
              value={deviceColor}
              onChange={(e) => setDeviceColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showContent}
            onChange={(e) => setShowContent(e.target.checked)}
            className="w-4 h-4"
          />
          <span>{t('tools.mockupGenerator.showContent')}</span>
        </label>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.mockupGenerator.about')}</h4>
        <p className="text-sm text-slate-600">
          {t('tools.mockupGenerator.aboutText')}
        </p>
      </div>
    </div>
  )
}
