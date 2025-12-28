import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export default function BarcodeGenerator() {
  const { t } = useTranslation()
  const [text, setText] = useState('')
  const [barcodeType, setBarcodeType] = useState<'CODE128' | 'CODE39' | 'EAN13' | 'UPC'>('CODE128')
  const [height, setHeight] = useState(80)
  const [showText, setShowText] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Simplified barcode patterns
  const code128Patterns: Record<string, string> = {
    '0': '11011001100', '1': '11001101100', '2': '11001100110', '3': '10010011000',
    '4': '10010001100', '5': '10001001100', '6': '10011001000', '7': '10011000100',
    '8': '10001100100', '9': '11001001000', 'A': '10110011100', 'B': '10011011100',
    'C': '10011001110', 'D': '10111001100', 'E': '10011101100', 'F': '10011100110',
    'G': '11001110010', 'H': '11001011100', 'I': '11001001110', 'J': '11011100100',
    'K': '11001110100', 'L': '11101101110', 'M': '11101001100', 'N': '11100101100',
    'O': '11100100110', 'P': '11101100100', 'Q': '11100110100', 'R': '11100110010',
    'S': '11011011000', 'T': '11011000110', 'U': '11000110110', 'V': '10100011000',
    'W': '10001011000', 'X': '10001000110', 'Y': '10110001000', 'Z': '10001101000',
    ' ': '11011001100', '-': '10010110000', '.': '11110101110',
  }

  useEffect(() => {
    if (!text || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Calculate width based on content
    const barWidth = 2
    let pattern = '11010011100' // Start code B

    const upperText = text.toUpperCase()
    for (const char of upperText) {
      pattern += code128Patterns[char] || code128Patterns['0']
    }
    pattern += '1100011101011' // Stop code

    const width = pattern.length * barWidth + 40
    canvas.width = width
    canvas.height = height + (showText ? 25 : 0)

    // White background
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw barcode
    ctx.fillStyle = '#000000'
    let x = 20

    for (const bit of pattern) {
      if (bit === '1') {
        ctx.fillRect(x, 10, barWidth, height)
      }
      x += barWidth
    }

    // Draw text
    if (showText) {
      ctx.font = '14px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(text, canvas.width / 2, height + 22)
    }
  }, [text, barcodeType, height, showText])

  const downloadBarcode = () => {
    if (!canvasRef.current) return

    const link = document.createElement('a')
    link.download = 'barcode.png'
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.barcodeGenerator.content')}
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 20))}
              placeholder={t('tools.barcodeGenerator.placeholder')}
              maxLength={20}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <div className="text-xs text-slate-400 mt-1">
              {text.length}/20 {t('tools.barcodeGenerator.characters')}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.barcodeGenerator.type')}
            </label>
            <select
              value={barcodeType}
              onChange={(e) => setBarcodeType(e.target.value as typeof barcodeType)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            >
              <option value="CODE128">CODE 128</option>
              <option value="CODE39">CODE 39</option>
              <option value="EAN13">EAN-13</option>
              <option value="UPC">UPC-A</option>
            </select>
          </div>
        </div>
      </div>

      {text && (
        <div className="card p-4">
          <div className="flex justify-center mb-4 overflow-x-auto">
            <canvas
              ref={canvasRef}
              className="border border-slate-200 rounded"
            />
          </div>

          <button
            onClick={downloadBarcode}
            className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            {t('tools.barcodeGenerator.download')}
          </button>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.barcodeGenerator.options')}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.barcodeGenerator.height')}: {height}px
            </label>
            <input
              type="range"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value))}
              min="40"
              max="150"
              className="w-full"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showText}
              onChange={(e) => setShowText(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-600">
              {t('tools.barcodeGenerator.showText')}
            </span>
          </label>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.barcodeGenerator.formats')}
        </h3>
        <div className="space-y-2 text-sm text-slate-600">
          <div className="p-2 bg-slate-50 rounded">
            <strong>CODE 128:</strong> {t('tools.barcodeGenerator.code128Desc')}
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <strong>CODE 39:</strong> {t('tools.barcodeGenerator.code39Desc')}
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <strong>EAN-13:</strong> {t('tools.barcodeGenerator.ean13Desc')}
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <strong>UPC-A:</strong> {t('tools.barcodeGenerator.upcDesc')}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.barcodeGenerator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.barcodeGenerator.tip1')}</li>
          <li>{t('tools.barcodeGenerator.tip2')}</li>
          <li>{t('tools.barcodeGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
