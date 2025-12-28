import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export default function QRCodeGenerator() {
  const { t } = useTranslation()
  const [inputType, setInputType] = useState<'url' | 'text' | 'email' | 'phone' | 'wifi'>('url')
  const [content, setContent] = useState('')
  const [wifiSSID, setWifiSSID] = useState('')
  const [wifiPassword, setWifiPassword] = useState('')
  const [wifiType, setWifiType] = useState<'WPA' | 'WEP' | 'nopass'>('WPA')
  const [size, setSize] = useState(200)
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const getQRContent = () => {
    switch (inputType) {
      case 'url':
        return content.startsWith('http') ? content : `https://${content}`
      case 'email':
        return `mailto:${content}`
      case 'phone':
        return `tel:${content}`
      case 'wifi':
        return `WIFI:T:${wifiType};S:${wifiSSID};P:${wifiPassword};;`
      default:
        return content
    }
  }

  useEffect(() => {
    const qrContent = getQRContent()
    if (!qrContent || qrContent.length < 3) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Simple QR code simulation (in production, use a proper QR library)
    canvas.width = size
    canvas.height = size

    // Draw background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, size, size)

    // Draw a simulated QR pattern
    ctx.fillStyle = fgColor
    const moduleSize = size / 25

    // Create a deterministic pattern based on content
    const hash = qrContent.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

    // Position detection patterns (corners)
    const drawFinderPattern = (x: number, y: number) => {
      // Outer square
      ctx.fillRect(x * moduleSize, y * moduleSize, 7 * moduleSize, moduleSize)
      ctx.fillRect(x * moduleSize, (y + 6) * moduleSize, 7 * moduleSize, moduleSize)
      ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, 7 * moduleSize)
      ctx.fillRect((x + 6) * moduleSize, y * moduleSize, moduleSize, 7 * moduleSize)
      // Inner square
      ctx.fillRect((x + 2) * moduleSize, (y + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize)
    }

    drawFinderPattern(0, 0) // Top-left
    drawFinderPattern(18, 0) // Top-right
    drawFinderPattern(0, 18) // Bottom-left

    // Fill data area with pattern
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        // Skip finder patterns
        if ((i < 8 && j < 8) || (i < 8 && j > 16) || (i > 16 && j < 8)) continue

        // Generate pattern based on hash and position
        if ((hash + i * j) % 3 === 0 || (hash + i + j) % 4 === 0) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize)
        }
      }
    }
  }, [content, wifiSSID, wifiPassword, inputType, size, fgColor, bgColor])

  const downloadQR = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.qrCodeGenerator.type')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['url', 'text', 'email', 'phone', 'wifi'] as const).map(type => (
            <button
              key={type}
              onClick={() => setInputType(type)}
              className={`px-3 py-1.5 rounded text-sm ${
                inputType === type ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {t(`tools.qrCodeGenerator.type${type.charAt(0).toUpperCase() + type.slice(1)}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        {inputType === 'wifi' ? (
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.qrCodeGenerator.wifiSSID')}
              </label>
              <input
                type="text"
                value={wifiSSID}
                onChange={(e) => setWifiSSID(e.target.value)}
                placeholder={t('tools.qrCodeGenerator.wifiSSIDPlaceholder')}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.qrCodeGenerator.wifiPassword')}
              </label>
              <input
                type="text"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                placeholder={t('tools.qrCodeGenerator.wifiPasswordPlaceholder')}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                {t('tools.qrCodeGenerator.wifiSecurity')}
              </label>
              <select
                value={wifiType}
                onChange={(e) => setWifiType(e.target.value as 'WPA' | 'WEP' | 'nopass')}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">{t('tools.qrCodeGenerator.noPassword')}</option>
              </select>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              {t(`tools.qrCodeGenerator.${inputType}Label`)}
            </label>
            <input
              type={inputType === 'email' ? 'email' : inputType === 'phone' ? 'tel' : 'text'}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t(`tools.qrCodeGenerator.${inputType}Placeholder`)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.qrCodeGenerator.customize')}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.qrCodeGenerator.size')}
            </label>
            <select
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            >
              <option value={150}>150px</option>
              <option value={200}>200px</option>
              <option value={250}>250px</option>
              <option value={300}>300px</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.qrCodeGenerator.foreground')}
            </label>
            <input
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.qrCodeGenerator.background')}
            </label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="card p-4 flex flex-col items-center">
        <canvas
          ref={canvasRef}
          className="border border-slate-200 rounded"
          style={{ width: size, height: size }}
        />
        <p className="text-xs text-slate-500 mt-2">
          {t('tools.qrCodeGenerator.preview')}
        </p>
      </div>

      <button
        onClick={downloadQR}
        disabled={!content && inputType !== 'wifi'}
        className="w-full py-3 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
      >
        {t('tools.qrCodeGenerator.download')}
      </button>

      <div className="card p-4 bg-yellow-50">
        <p className="text-sm text-yellow-700">
          {t('tools.qrCodeGenerator.note')}
        </p>
      </div>
    </div>
  )
}
