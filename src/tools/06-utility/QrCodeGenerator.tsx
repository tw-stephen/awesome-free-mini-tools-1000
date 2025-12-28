import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export default function QrCodeGenerator() {
  const { t } = useTranslation()
  const [text, setText] = useState('')
  const [size, setSize] = useState(200)
  const [color, setColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#FFFFFF')
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Simple QR Code generation using a pattern (placeholder for real QR library)
  // In production, you'd use a library like qrcode or qrcode-generator
  useEffect(() => {
    if (!text || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    // Fill background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, size, size)

    // Simple pattern visualization (not a real QR code)
    // In production, use a proper QR code library
    const moduleCount = 25
    const moduleSize = size / moduleCount

    ctx.fillStyle = color

    // Generate a simple pattern based on text hash
    const hash = text.split('').reduce((acc, char) => {
      return ((acc << 5) - acc + char.charCodeAt(0)) | 0
    }, 0)

    // Finder patterns (top-left, top-right, bottom-left)
    const drawFinderPattern = (x: number, y: number) => {
      // Outer square
      for (let i = 0; i < 7; i++) {
        ctx.fillRect((x + i) * moduleSize, y * moduleSize, moduleSize, moduleSize)
        ctx.fillRect((x + i) * moduleSize, (y + 6) * moduleSize, moduleSize, moduleSize)
        ctx.fillRect(x * moduleSize, (y + i) * moduleSize, moduleSize, moduleSize)
        ctx.fillRect((x + 6) * moduleSize, (y + i) * moduleSize, moduleSize, moduleSize)
      }
      // Inner square
      for (let i = 2; i < 5; i++) {
        for (let j = 2; j < 5; j++) {
          ctx.fillRect((x + i) * moduleSize, (y + j) * moduleSize, moduleSize, moduleSize)
        }
      }
    }

    drawFinderPattern(0, 0)
    drawFinderPattern(moduleCount - 7, 0)
    drawFinderPattern(0, moduleCount - 7)

    // Timing patterns
    for (let i = 8; i < moduleCount - 8; i += 2) {
      ctx.fillRect(i * moduleSize, 6 * moduleSize, moduleSize, moduleSize)
      ctx.fillRect(6 * moduleSize, i * moduleSize, moduleSize, moduleSize)
    }

    // Data area (pseudo-random based on text)
    for (let y = 0; y < moduleCount; y++) {
      for (let x = 0; x < moduleCount; x++) {
        // Skip finder patterns and timing
        if ((x < 9 && y < 9) || (x >= moduleCount - 8 && y < 9) || (x < 9 && y >= moduleCount - 8)) {
          continue
        }

        const seed = (hash + x * 31 + y * 17 + text.charCodeAt(x % text.length)) % 100
        if (seed < 40) {
          ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize)
        }
      }
    }
  }, [text, size, color, bgColor])

  const downloadQR = () => {
    if (!canvasRef.current) return

    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  const presets = [
    { label: t('tools.qrCodeGenerator.url'), placeholder: 'https://example.com' },
    { label: t('tools.qrCodeGenerator.email'), placeholder: 'mailto:email@example.com' },
    { label: t('tools.qrCodeGenerator.phone'), placeholder: 'tel:+1234567890' },
    { label: t('tools.qrCodeGenerator.sms'), placeholder: 'sms:+1234567890?body=Hello' },
    { label: t('tools.qrCodeGenerator.wifi'), placeholder: 'WIFI:S:NetworkName;T:WPA;P:password;;' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="mb-4">
          <label className="block text-xs text-slate-500 mb-1">
            {t('tools.qrCodeGenerator.content')}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('tools.qrCodeGenerator.placeholder')}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {presets.map((preset, i) => (
            <button
              key={i}
              onClick={() => setText(preset.placeholder)}
              className="px-3 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {text && (
        <div className="card p-4">
          <div className="flex justify-center mb-4">
            <canvas
              ref={canvasRef}
              className="border border-slate-200 rounded"
              style={{ width: size, height: size }}
            />
          </div>

          <button
            onClick={downloadQR}
            className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            {t('tools.qrCodeGenerator.download')}
          </button>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.qrCodeGenerator.options')}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.qrCodeGenerator.size')}: {size}px
            </label>
            <input
              type="range"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              min="100"
              max="400"
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.qrCodeGenerator.foreground')}
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.qrCodeGenerator.background')}
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
                  className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.qrCodeGenerator.errorCorrection')}
            </label>
            <select
              value={errorLevel}
              onChange={(e) => setErrorLevel(e.target.value as typeof errorLevel)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            >
              <option value="L">L - {t('tools.qrCodeGenerator.low')} (7%)</option>
              <option value="M">M - {t('tools.qrCodeGenerator.medium')} (15%)</option>
              <option value="Q">Q - {t('tools.qrCodeGenerator.quartile')} (25%)</option>
              <option value="H">H - {t('tools.qrCodeGenerator.high')} (30%)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.qrCodeGenerator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.qrCodeGenerator.tip1')}</li>
          <li>{t('tools.qrCodeGenerator.tip2')}</li>
          <li>{t('tools.qrCodeGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
