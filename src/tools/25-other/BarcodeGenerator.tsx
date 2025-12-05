import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

// Code 128 encoding patterns (simplified subset)
const CODE128_PATTERNS: { [key: string]: string } = {
  ' ': '11011001100', '!': '11001101100', '"': '11001100110', '#': '10010011000',
  '$': '10010001100', '%': '10001001100', '&': '10011001000', "'": '10011000100',
  '(': '10001100100', ')': '11001001000', '*': '11001000100', '+': '11000100100',
  ',': '10110011100', '-': '10011011100', '.': '10011001110', '/': '10111001100',
  '0': '10011101100', '1': '10011100110', '2': '11001110010', '3': '11001011100',
  '4': '11001001110', '5': '11011100100', '6': '11001110100', '7': '11101101110',
  '8': '11101001100', '9': '11100101100', ':': '11100100110', ';': '11101100100',
  '<': '11100110100', '=': '11100110010', '>': '11011011000', '?': '11011000110',
  '@': '11000110110', 'A': '10100011000', 'B': '10001011000', 'C': '10001000110',
  'D': '10110001000', 'E': '10001101000', 'F': '10001100010', 'G': '11010001000',
  'H': '11000101000', 'I': '11000100010', 'J': '10110111000', 'K': '10110001110',
  'L': '10001101110', 'M': '10111011000', 'N': '10111000110', 'O': '10001110110',
  'P': '11101110110', 'Q': '11010001110', 'R': '11000101110', 'S': '11011101000',
  'T': '11011100010', 'U': '11011101110', 'V': '11101011000', 'W': '11101000110',
  'X': '11100010110', 'Y': '11101101000', 'Z': '11101100010', '[': '11100011010',
  '\\': '11101111010', ']': '11001000010', '^': '11110001010', '_': '10100110000',
  '`': '10100001100', 'a': '10010110000', 'b': '10010000110', 'c': '10000101100',
  'd': '10000100110', 'e': '10110010000', 'f': '10110000100', 'g': '10011010000',
  'h': '10011000010', 'i': '10000110100', 'j': '10000110010', 'k': '11000010010',
  'l': '11001010000', 'm': '11110111010', 'n': '11000010100', 'o': '10001111010',
  'p': '10100111100', 'q': '10010111100', 'r': '10010011110', 's': '10111100100',
  't': '10011110100', 'u': '10011110010', 'v': '11110100100', 'w': '11110010100',
  'x': '11110010010', 'y': '11011011110', 'z': '11011110110', '{': '11110110110',
  '|': '10101111000', '}': '10100011110', '~': '10001011110'
}

const START_CODE_B = '11010010000'
const STOP_CODE = '1100011101011'

export default function BarcodeGenerator() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [text, setText] = useState('HELLO-123')
  const [width, setWidth] = useState(300)
  const [height, setHeight] = useState(100)
  const [showText, setShowText] = useState(true)
  const [barColor, setBarColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')

  const generateBarcode = (input: string): string => {
    let pattern = START_CODE_B

    for (const char of input) {
      if (CODE128_PATTERNS[char]) {
        pattern += CODE128_PATTERNS[char]
      }
    }

    pattern += STOP_CODE
    return pattern
  }

  useEffect(() => {
    if (!canvasRef.current || !text.trim()) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = width
    canvas.height = height

    // Background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, width, height)

    const pattern = generateBarcode(text)
    const barWidth = (width - 40) / pattern.length
    const barHeight = showText ? height - 30 : height - 20
    const startX = 20

    // Draw bars
    ctx.fillStyle = barColor
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] === '1') {
        ctx.fillRect(startX + i * barWidth, 10, barWidth, barHeight)
      }
    }

    // Draw text
    if (showText) {
      ctx.fillStyle = barColor
      ctx.font = '14px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(text, width / 2, height - 8)
    }
  }, [text, width, height, showText, barColor, bgColor])

  const downloadImage = () => {
    if (!canvasRef.current) return
    const a = document.createElement('a')
    a.download = 'barcode.png'
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <label className="flex items-center gap-1 text-sm">
          <input type="checkbox" checked={showText} onChange={(e) => setShowText(e.target.checked)} className="rounded" />
          {t('tools.barcode.showText')}
        </label>
        <div className="flex-1" />
        <Button variant="secondary" onClick={copyToClipboard}>{t('common.copy')}</Button>
        <Button variant="secondary" onClick={downloadImage}>{t('common.download')}</Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.barcode.content')}</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('tools.barcode.placeholder')}
              className="input w-full font-mono"
            />
          </div>

          <div className="flex justify-center p-8 border border-slate-200 rounded-lg bg-slate-50">
            <canvas
              ref={canvasRef}
              style={{ maxWidth: '100%' }}
              className="shadow-lg"
            />
          </div>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.barcode.settings')}</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.barcode.width')} ({width}px)</label>
              <input
                type="range"
                min="200"
                max="500"
                step="10"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.barcode.height')} ({height}px)</label>
              <input
                type="range"
                min="60"
                max="200"
                step="10"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.barcode.barColor')}</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={barColor}
                  onChange={(e) => setBarColor(e.target.value)}
                  className="w-10 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={barColor}
                  onChange={(e) => setBarColor(e.target.value)}
                  className="input flex-1 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.barcode.bgColor')}</label>
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
          </div>

          <div className="mt-auto pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.barcode.info')}</h4>
            <div className="space-y-1 text-xs text-slate-500">
              <div>{t('tools.barcode.format')}: Code 128</div>
              <div>{t('tools.barcode.chars')}: {text.length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
