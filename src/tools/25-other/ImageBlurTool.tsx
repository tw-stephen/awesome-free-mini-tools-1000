import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface BlurSettings {
  blurType: 'full' | 'region'
  blurAmount: number
  regionX: number
  regionY: number
  regionWidth: number
  regionHeight: number
}

export default function ImageBlurTool() {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [scale, setScale] = useState(1)
  const [isSelecting, setIsSelecting] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [settings, setSettings] = useState<BlurSettings>({
    blurType: 'full',
    blurAmount: 10,
    regionX: 0,
    regionY: 0,
    regionWidth: 100,
    regionHeight: 100
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = () => {
      setImage(img)

      const container = containerRef.current
      if (container) {
        const maxWidth = container.clientWidth - 32
        const maxHeight = 450
        const newScale = Math.min(maxWidth / img.width, maxHeight / img.height, 1)
        setScale(newScale)
      }

      setSettings(prev => ({
        ...prev,
        regionX: Math.floor(img.width / 4),
        regionY: Math.floor(img.height / 4),
        regionWidth: Math.floor(img.width / 2),
        regionHeight: Math.floor(img.height / 2)
      }))
    }
    img.src = URL.createObjectURL(file)
  }

  const applyBlur = () => {
    if (!canvasRef.current || !image) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = image.width
    canvas.height = image.height
    ctx.drawImage(image, 0, 0)

    if (settings.blurType === 'full') {
      ctx.filter = `blur(${settings.blurAmount}px)`
      ctx.drawImage(image, 0, 0)
      ctx.filter = 'none'
    } else {
      // Region blur using stack blur algorithm simulation
      const { regionX, regionY, regionWidth, regionHeight } = settings

      // Create a temporary canvas for the blurred region
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = regionWidth
      tempCanvas.height = regionHeight
      const tempCtx = tempCanvas.getContext('2d')
      if (!tempCtx) return

      // Draw the region to temp canvas
      tempCtx.drawImage(
        image,
        regionX, regionY, regionWidth, regionHeight,
        0, 0, regionWidth, regionHeight
      )

      // Apply blur to temp canvas
      tempCtx.filter = `blur(${settings.blurAmount}px)`
      tempCtx.drawImage(tempCanvas, 0, 0)
      tempCtx.filter = 'none'

      // Draw blurred region back to main canvas
      ctx.drawImage(tempCanvas, regionX, regionY)

      // Draw region outline for preview
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.strokeRect(regionX, regionY, regionWidth, regionHeight)
      ctx.setLineDash([])
    }
  }

  useEffect(() => {
    if (image) {
      applyBlur()
    }
  }, [image, settings])

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: Math.round((e.clientX - rect.left) / scale),
      y: Math.round((e.clientY - rect.top) / scale)
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (settings.blurType !== 'region') return

    const pos = getCanvasCoords(e)
    setIsSelecting(true)
    setStartPos(pos)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSelecting || settings.blurType !== 'region') return

    const pos = getCanvasCoords(e)
    setSettings(prev => ({
      ...prev,
      regionX: Math.min(startPos.x, pos.x),
      regionY: Math.min(startPos.y, pos.y),
      regionWidth: Math.abs(pos.x - startPos.x),
      regionHeight: Math.abs(pos.y - startPos.y)
    }))
  }

  const handleMouseUp = () => {
    setIsSelecting(false)
  }

  const downloadImage = () => {
    if (!canvasRef.current || !image) return

    // Redraw without selection outline
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = image.width
    canvas.height = image.height
    ctx.drawImage(image, 0, 0)

    if (settings.blurType === 'full') {
      ctx.filter = `blur(${settings.blurAmount}px)`
      ctx.drawImage(image, 0, 0)
      ctx.filter = 'none'
    } else {
      const { regionX, regionY, regionWidth, regionHeight } = settings

      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = regionWidth
      tempCanvas.height = regionHeight
      const tempCtx = tempCanvas.getContext('2d')
      if (!tempCtx) return

      tempCtx.drawImage(
        image,
        regionX, regionY, regionWidth, regionHeight,
        0, 0, regionWidth, regionHeight
      )

      tempCtx.filter = `blur(${settings.blurAmount}px)`
      tempCtx.drawImage(tempCanvas, 0, 0)
      tempCtx.filter = 'none'

      ctx.drawImage(tempCanvas, regionX, regionY)
    }

    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `blurred-${Date.now()}.png`
    link.click()

    // Redraw with outline after download
    applyBlur()
  }

  const resetRegion = () => {
    if (!image) return

    setSettings(prev => ({
      ...prev,
      regionX: Math.floor(image.width / 4),
      regionY: Math.floor(image.height / 4),
      regionWidth: Math.floor(image.width / 2),
      regionHeight: Math.floor(image.height / 2)
    }))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button onClick={() => fileInputRef.current?.click()}>
          {image ? t('tools.imageBlur.changeImage') : t('tools.imageBlur.selectImage')}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button variant="secondary" onClick={downloadImage} disabled={!image}>
          {t('common.download')}
        </Button>
        {settings.blurType === 'region' && (
          <Button variant="secondary" onClick={resetRegion} disabled={!image}>
            {t('tools.imageBlur.resetRegion')}
          </Button>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4" ref={containerRef}>
          <div className="flex justify-center p-4 bg-slate-100 rounded-lg min-h-[400px] overflow-auto">
            {image ? (
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className={`shadow-lg ${settings.blurType === 'region' ? 'cursor-crosshair' : 'cursor-default'}`}
                style={{
                  width: image.width * scale,
                  height: image.height * scale
                }}
              />
            ) : (
              <div className="flex items-center justify-center text-slate-400 h-full">
                {t('tools.imageBlur.placeholder')}
              </div>
            )}
          </div>

          {settings.blurType === 'region' && image && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-600">
              {t('tools.imageBlur.regionHint')}
            </div>
          )}
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.imageBlur.settings')}</h3>

          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('tools.imageBlur.blurType')}</label>
            <select
              value={settings.blurType}
              onChange={(e) => setSettings({ ...settings, blurType: e.target.value as 'full' | 'region' })}
              className="w-full p-2 border border-slate-200 rounded text-sm"
            >
              <option value="full">{t('tools.imageBlur.fullImage')}</option>
              <option value="region">{t('tools.imageBlur.regionOnly')}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.imageBlur.blurAmount')}: {settings.blurAmount}px
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={settings.blurAmount}
              onChange={(e) => setSettings({ ...settings, blurAmount: Number(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>{t('tools.imageBlur.light')}</span>
              <span>{t('tools.imageBlur.heavy')}</span>
            </div>
          </div>

          {settings.blurType === 'region' && (
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
              <h4 className="text-xs font-medium text-slate-500">{t('tools.imageBlur.regionSettings')}</h4>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-400">X</label>
                  <input
                    type="number"
                    value={settings.regionX}
                    onChange={(e) => setSettings({ ...settings, regionX: Number(e.target.value) })}
                    className="w-full p-1 border border-slate-200 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400">Y</label>
                  <input
                    type="number"
                    value={settings.regionY}
                    onChange={(e) => setSettings({ ...settings, regionY: Number(e.target.value) })}
                    className="w-full p-1 border border-slate-200 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400">{t('tools.imageBlur.width')}</label>
                  <input
                    type="number"
                    value={settings.regionWidth}
                    onChange={(e) => setSettings({ ...settings, regionWidth: Number(e.target.value) })}
                    className="w-full p-1 border border-slate-200 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400">{t('tools.imageBlur.height')}</label>
                  <input
                    type="number"
                    value={settings.regionHeight}
                    onChange={(e) => setSettings({ ...settings, regionHeight: Number(e.target.value) })}
                    className="w-full p-1 border border-slate-200 rounded text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.imageBlur.tips')}</h4>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>• {t('tools.imageBlur.tip1')}</li>
              <li>• {t('tools.imageBlur.tip2')}</li>
              <li>• {t('tools.imageBlur.tip3')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
