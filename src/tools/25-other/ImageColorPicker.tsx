import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface PickedColor {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  x: number
  y: number
}

export default function ImageColorPicker() {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [pickedColors, setPickedColors] = useState<PickedColor[]>([])
  const [currentColor, setCurrentColor] = useState<PickedColor | null>(null)
  const [scale, setScale] = useState(1)
  const [copied, setCopied] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = () => {
      setImage(img)
      setPickedColors([])
      setCurrentColor(null)

      const container = containerRef.current
      if (container) {
        const maxWidth = container.clientWidth - 32
        const maxHeight = 400
        const newScale = Math.min(maxWidth / img.width, maxHeight / img.height, 1)
        setScale(newScale)
      }
    }
    img.src = URL.createObjectURL(file)
  }

  useEffect(() => {
    if (!image || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = image.width
    canvas.height = image.height
    ctx.drawImage(image, 0, 0)
  }, [image])

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
  }

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / d + 2) / 6
          break
        case b:
          h = ((r - g) / d + 4) / 6
          break
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = Math.round((e.clientX - rect.left) / scale)
    const y = Math.round((e.clientY - rect.top) / scale)

    const pixel = ctx.getImageData(x, y, 1, 1).data
    const r = pixel[0]
    const g = pixel[1]
    const b = pixel[2]

    const color: PickedColor = {
      hex: rgbToHex(r, g, b),
      rgb: { r, g, b },
      hsl: rgbToHsl(r, g, b),
      x,
      y
    }

    setCurrentColor(color)
    setPickedColors(prev => [color, ...prev.slice(0, 9)])
  }

  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = Math.round((e.clientX - rect.left) / scale)
    const y = Math.round((e.clientY - rect.top) / scale)

    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return

    const pixel = ctx.getImageData(x, y, 1, 1).data
    const r = pixel[0]
    const g = pixel[1]
    const b = pixel[2]

    setCurrentColor({
      hex: rgbToHex(r, g, b),
      rgb: { r, g, b },
      hsl: rgbToHsl(r, g, b),
      x,
      y
    })
  }

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 1500)
  }

  const clearColors = () => {
    setPickedColors([])
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button onClick={() => fileInputRef.current?.click()}>
          {image ? t('tools.imageColorPicker.changeImage') : t('tools.imageColorPicker.selectImage')}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button variant="secondary" onClick={clearColors} disabled={pickedColors.length === 0}>
          {t('common.clear')}
        </Button>
        <div className="flex-1" />
        <span className="text-sm text-slate-500">
          {pickedColors.length} {t('tools.imageColorPicker.colorsPicked')}
        </span>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4" ref={containerRef}>
          <div className="flex justify-center p-4 bg-slate-100 rounded-lg min-h-[350px] overflow-auto">
            {image ? (
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                onMouseMove={handleCanvasMove}
                className="cursor-crosshair shadow-lg"
                style={{
                  width: image.width * scale,
                  height: image.height * scale
                }}
              />
            ) : (
              <div className="flex items-center justify-center text-slate-400 h-full">
                {t('tools.imageColorPicker.placeholder')}
              </div>
            )}
          </div>

          {pickedColors.length > 0 && (
            <div>
              <label className="block text-xs text-slate-500 mb-2">{t('tools.imageColorPicker.history')}</label>
              <div className="flex gap-2 flex-wrap">
                {pickedColors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => copyToClipboard(color.hex, `history-${i}`)}
                    className="w-10 h-10 rounded shadow border border-slate-200 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color.hex }}
                    title={color.hex}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.imageColorPicker.colorInfo')}</h3>

          {currentColor ? (
            <div className="space-y-4">
              <div
                className="w-full h-24 rounded-lg shadow-inner"
                style={{ backgroundColor: currentColor.hex }}
              />

              <div className="space-y-2">
                <div
                  className="flex justify-between items-center p-2 bg-slate-50 rounded cursor-pointer hover:bg-slate-100"
                  onClick={() => copyToClipboard(currentColor.hex, 'hex')}
                >
                  <span className="text-xs text-slate-500">HEX</span>
                  <span className="font-mono text-sm">{currentColor.hex}</span>
                  {copied === 'hex' && <span className="text-xs text-green-500">✓</span>}
                </div>

                <div
                  className="flex justify-between items-center p-2 bg-slate-50 rounded cursor-pointer hover:bg-slate-100"
                  onClick={() => copyToClipboard(`rgb(${currentColor.rgb.r}, ${currentColor.rgb.g}, ${currentColor.rgb.b})`, 'rgb')}
                >
                  <span className="text-xs text-slate-500">RGB</span>
                  <span className="font-mono text-sm">
                    {currentColor.rgb.r}, {currentColor.rgb.g}, {currentColor.rgb.b}
                  </span>
                  {copied === 'rgb' && <span className="text-xs text-green-500">✓</span>}
                </div>

                <div
                  className="flex justify-between items-center p-2 bg-slate-50 rounded cursor-pointer hover:bg-slate-100"
                  onClick={() => copyToClipboard(`hsl(${currentColor.hsl.h}, ${currentColor.hsl.s}%, ${currentColor.hsl.l}%)`, 'hsl')}
                >
                  <span className="text-xs text-slate-500">HSL</span>
                  <span className="font-mono text-sm">
                    {currentColor.hsl.h}°, {currentColor.hsl.s}%, {currentColor.hsl.l}%
                  </span>
                  {copied === 'hsl' && <span className="text-xs text-green-500">✓</span>}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.imageColorPicker.position')}</h4>
                <div className="text-sm text-slate-600">
                  X: {currentColor.x}, Y: {currentColor.y}
                </div>
              </div>

              <div className="text-xs text-slate-400 text-center">
                {t('tools.imageColorPicker.clickToCopy')}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
              {image ? t('tools.imageColorPicker.hoverHint') : t('tools.imageColorPicker.selectHint')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
