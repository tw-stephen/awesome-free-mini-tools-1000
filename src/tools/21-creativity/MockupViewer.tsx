import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

type DeviceType = 'iphone' | 'android' | 'ipad' | 'macbook' | 'browser'

interface DeviceConfig {
  name: string
  width: number
  height: number
  screenX: number
  screenY: number
  screenWidth: number
  screenHeight: number
  borderRadius: number
  bezelColor: string
}

export default function MockupViewer() {
  const { t } = useTranslation()
  const [imageSrc, setImageSrc] = useState<string>('')
  const [device, setDevice] = useState<DeviceType>('iphone')
  const [bgColor, setBgColor] = useState('#f1f5f9')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const devices: Record<DeviceType, DeviceConfig> = {
    iphone: {
      name: 'iPhone',
      width: 280,
      height: 560,
      screenX: 15,
      screenY: 15,
      screenWidth: 250,
      screenHeight: 530,
      borderRadius: 40,
      bezelColor: '#1f2937',
    },
    android: {
      name: 'Android Phone',
      width: 280,
      height: 560,
      screenX: 12,
      screenY: 30,
      screenWidth: 256,
      screenHeight: 500,
      borderRadius: 30,
      bezelColor: '#374151',
    },
    ipad: {
      name: 'iPad',
      width: 400,
      height: 540,
      screenX: 20,
      screenY: 30,
      screenWidth: 360,
      screenHeight: 480,
      borderRadius: 30,
      bezelColor: '#1f2937',
    },
    macbook: {
      name: 'MacBook',
      width: 500,
      height: 320,
      screenX: 30,
      screenY: 15,
      screenWidth: 440,
      screenHeight: 275,
      borderRadius: 12,
      bezelColor: '#9ca3af',
    },
    browser: {
      name: 'Browser',
      width: 500,
      height: 350,
      screenX: 0,
      screenY: 30,
      screenWidth: 500,
      screenHeight: 320,
      borderRadius: 8,
      bezelColor: '#e5e7eb',
    },
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const config = devices[device]

  const downloadMockup = () => {
    const canvas = canvasRef.current
    if (!canvas || !imageSrc) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const scale = 2
    canvas.width = (config.width + 100) * scale
    canvas.height = (config.height + 100) * scale
    ctx.scale(scale, scale)

    // Background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, config.width + 100, config.height + 100)

    const offsetX = 50
    const offsetY = 50

    // Device frame
    ctx.fillStyle = config.bezelColor
    ctx.beginPath()
    ctx.roundRect(offsetX, offsetY, config.width, config.height, config.borderRadius)
    ctx.fill()

    // Screen area
    ctx.fillStyle = '#000'
    ctx.fillRect(
      offsetX + config.screenX,
      offsetY + config.screenY,
      config.screenWidth,
      config.screenHeight
    )

    // Browser chrome
    if (device === 'browser') {
      ctx.fillStyle = '#f3f4f6'
      ctx.fillRect(offsetX, offsetY, config.width, 30)
      ctx.fillStyle = '#e5e7eb'
      ctx.strokeStyle = '#d1d5db'
      ctx.lineWidth = 1
      ctx.strokeRect(offsetX, offsetY, config.width, 30)

      // Browser buttons
      const buttonColors = ['#ef4444', '#f59e0b', '#22c55e']
      buttonColors.forEach((color, i) => {
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(offsetX + 15 + i * 18, offsetY + 15, 5, 0, Math.PI * 2)
        ctx.fill()
      })

      // URL bar
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.roundRect(offsetX + 80, offsetY + 8, config.width - 100, 14, 4)
      ctx.fill()
    }

    // MacBook bottom
    if (device === 'macbook') {
      ctx.fillStyle = '#d1d5db'
      ctx.fillRect(offsetX - 20, offsetY + config.height, config.width + 40, 15)
      ctx.fillStyle = '#9ca3af'
      ctx.fillRect(offsetX + config.width / 2 - 40, offsetY + config.height, 80, 15)
    }

    // Draw image
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(
        img,
        offsetX + config.screenX,
        offsetY + config.screenY,
        config.screenWidth,
        config.screenHeight
      )

      const link = document.createElement('a')
      link.download = `mockup-${device}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    img.src = imageSrc
  }

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="block w-full"
          />

          <div>
            <label className="block text-sm font-medium mb-2">{t('tools.mockupViewer.device')}</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(devices) as DeviceType[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDevice(d)}
                  className={`px-3 py-2 rounded ${
                    device === d ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {devices[d].name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <label className="text-sm font-medium">{t('tools.mockupViewer.background')}:</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <div className="flex gap-1">
              {['#f1f5f9', '#e2e8f0', '#fef3c7', '#d1fae5', '#e0e7ff', '#fce7f3'].map((color) => (
                <button
                  key={color}
                  onClick={() => setBgColor(color)}
                  className={`w-8 h-8 rounded ${bgColor === color ? 'ring-2 ring-blue-500' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div
        className="card p-8 flex items-center justify-center min-h-[500px]"
        style={{ backgroundColor: bgColor }}
      >
        <div
          className="relative"
          style={{
            width: config.width,
            height: config.height,
          }}
        >
          {/* Device frame */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: config.bezelColor,
              borderRadius: config.borderRadius,
            }}
          />

          {/* Browser chrome */}
          {device === 'browser' && (
            <div className="absolute top-0 left-0 right-0 h-[30px] bg-gray-100 border-b border-gray-300 rounded-t-lg flex items-center px-3 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div className="flex-1 ml-4 h-4 bg-white rounded" />
            </div>
          )}

          {/* Screen */}
          <div
            className="absolute overflow-hidden"
            style={{
              left: config.screenX,
              top: config.screenY,
              width: config.screenWidth,
              height: config.screenHeight,
              backgroundColor: '#000',
            }}
          >
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                {t('tools.mockupViewer.uploadHint')}
              </div>
            )}
          </div>

          {/* MacBook bottom */}
          {device === 'macbook' && (
            <div
              className="absolute -left-5 -right-5 h-4 bg-gray-300"
              style={{ top: config.height }}
            >
              <div className="absolute left-1/2 -translate-x-1/2 w-20 h-full bg-gray-400" />
            </div>
          )}

          {/* iPhone notch */}
          {device === 'iphone' && (
            <div
              className="absolute left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-b-2xl"
              style={{ top: config.screenY }}
            />
          )}
        </div>
      </div>

      <button
        onClick={downloadMockup}
        disabled={!imageSrc}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t('common.download')} Mockup
      </button>
    </div>
  )
}
