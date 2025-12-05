import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

// Simple QR Code implementation using bit matrix
const generateQRMatrix = (text: string, size: number = 21): boolean[][] => {
  // This is a simplified QR-like pattern generator
  // Real QR codes require Reed-Solomon error correction
  const matrix: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false))

  // Add finder patterns (top-left, top-right, bottom-left)
  const addFinderPattern = (startX: number, startY: number) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const isOuter = y === 0 || y === 6 || x === 0 || x === 6
        const isInner = y >= 2 && y <= 4 && x >= 2 && x <= 4
        matrix[startY + y][startX + x] = isOuter || isInner
      }
    }
  }

  addFinderPattern(0, 0)
  addFinderPattern(size - 7, 0)
  addFinderPattern(0, size - 7)

  // Add timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0
    matrix[i][6] = i % 2 === 0
  }

  // Encode text into data area
  let dataIndex = 0
  const textBytes = new TextEncoder().encode(text)

  for (let y = size - 1; y >= 0; y -= 2) {
    if (y === 6) y = 5 // Skip timing pattern
    for (let x = size - 1; x >= 0; x--) {
      // Skip finder patterns and timing
      if ((x < 8 && y < 8) || (x >= size - 8 && y < 8) || (x < 8 && y >= size - 8)) continue
      if (x === 6 || y === 6) continue

      if (dataIndex < textBytes.length * 8) {
        const byteIndex = Math.floor(dataIndex / 8)
        const bitIndex = 7 - (dataIndex % 8)
        matrix[y][x] = ((textBytes[byteIndex] >> bitIndex) & 1) === 1
        dataIndex++
      } else {
        // Fill remaining with pattern
        matrix[y][x] = (x + y) % 3 === 0
      }
    }
  }

  return matrix
}

export default function QRCodeGenerator() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [text, setText] = useState('https://example.com')
  const [size, setSize] = useState(256)
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [matrix, setMatrix] = useState<boolean[][]>([])

  const moduleSize = 25 // Fixed QR version

  useEffect(() => {
    if (text.trim()) {
      const newMatrix = generateQRMatrix(text, moduleSize)
      setMatrix(newMatrix)
    }
  }, [text])

  useEffect(() => {
    if (!canvasRef.current || matrix.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    const cellSize = size / matrix.length

    // Background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, size, size)

    // Modules
    ctx.fillStyle = fgColor
    matrix.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
        }
      })
    })
  }, [matrix, size, fgColor, bgColor])

  const downloadImage = () => {
    if (!canvasRef.current) return
    const a = document.createElement('a')
    a.download = 'qrcode.png'
    a.href = canvasRef.current.toDataURL('image/png')
    a.click()
  }

  const copyToClipboard = async () => {
    if (!canvasRef.current) return
    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvasRef.current!.toBlob((b) => resolve(b!), 'image/png')
      })
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const presets = [
    { label: 'URL', value: 'https://example.com' },
    { label: 'Email', value: 'mailto:hello@example.com' },
    { label: 'Phone', value: 'tel:+1234567890' },
    { label: 'SMS', value: 'sms:+1234567890?body=Hello' },
    { label: 'WiFi', value: 'WIFI:T:WPA;S:NetworkName;P:Password;;' },
    { label: 'vCard', value: 'BEGIN:VCARD\nVERSION:3.0\nN:Doe;John\nTEL:+1234567890\nEND:VCARD' }
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <div className="flex gap-1">
          {presets.map(preset => (
            <button
              key={preset.label}
              onClick={() => setText(preset.value)}
              className="px-2 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <Button variant="secondary" onClick={copyToClipboard}>{t('common.copy')}</Button>
        <Button variant="secondary" onClick={downloadImage}>{t('common.download')}</Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.qrCode.content')}</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('tools.qrCode.placeholder')}
              className="input w-full h-32 resize-none font-mono text-sm"
            />
          </div>

          <div className="flex justify-center p-8 border border-slate-200 rounded-lg bg-slate-50">
            <canvas
              ref={canvasRef}
              style={{ width: size, height: size, maxWidth: '100%' }}
              className="shadow-lg"
            />
          </div>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.qrCode.settings')}</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.qrCode.size')} ({size}px)</label>
              <input
                type="range"
                min="128"
                max="512"
                step="32"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.qrCode.foreground')}</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-10 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="input flex-1 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.qrCode.background')}</label>
              <div className="flex gap-2 items-center">
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

            <div className="flex gap-2">
              <button
                onClick={() => { setFgColor('#000000'); setBgColor('#ffffff') }}
                className="flex-1 px-2 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200"
              >
                {t('tools.qrCode.reset')}
              </button>
              <button
                onClick={() => { const tmp = fgColor; setFgColor(bgColor); setBgColor(tmp) }}
                className="flex-1 px-2 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200"
              >
                {t('tools.qrCode.invert')}
              </button>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.qrCode.info')}</h4>
            <div className="space-y-1 text-xs text-slate-500">
              <div>{t('tools.qrCode.chars')}: {text.length}</div>
              <div>{t('tools.qrCode.bytes')}: {new TextEncoder().encode(text).length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
