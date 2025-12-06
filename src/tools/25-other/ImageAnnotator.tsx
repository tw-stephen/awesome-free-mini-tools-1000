import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface Annotation {
  id: string
  type: 'arrow' | 'rectangle' | 'circle' | 'text' | 'line'
  x: number
  y: number
  width?: number
  height?: number
  endX?: number
  endY?: number
  text?: string
  color: string
  strokeWidth: number
}

export default function ImageAnnotator() {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [selectedTool, setSelectedTool] = useState<Annotation['type']>('arrow')
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [settings, setSettings] = useState({
    color: '#ff0000',
    strokeWidth: 3,
    fontSize: 16
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = () => {
      setImage(img)
      setAnnotations([])
      setSelectedAnnotation(null)

      const container = containerRef.current
      if (container) {
        const maxWidth = container.clientWidth - 32
        const maxHeight = 450
        const newScale = Math.min(maxWidth / img.width, maxHeight / img.height, 1)
        setScale(newScale)
      }
    }
    img.src = URL.createObjectURL(file)
  }

  const redrawCanvas = () => {
    if (!canvasRef.current || !image) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = image.width
    canvas.height = image.height
    ctx.drawImage(image, 0, 0)

    annotations.forEach(annotation => {
      ctx.strokeStyle = annotation.color
      ctx.fillStyle = annotation.color
      ctx.lineWidth = annotation.strokeWidth

      switch (annotation.type) {
        case 'arrow':
          if (annotation.endX !== undefined && annotation.endY !== undefined) {
            const angle = Math.atan2(annotation.endY - annotation.y, annotation.endX - annotation.x)
            const headLength = 15

            ctx.beginPath()
            ctx.moveTo(annotation.x, annotation.y)
            ctx.lineTo(annotation.endX, annotation.endY)
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(annotation.endX, annotation.endY)
            ctx.lineTo(
              annotation.endX - headLength * Math.cos(angle - Math.PI / 6),
              annotation.endY - headLength * Math.sin(angle - Math.PI / 6)
            )
            ctx.lineTo(
              annotation.endX - headLength * Math.cos(angle + Math.PI / 6),
              annotation.endY - headLength * Math.sin(angle + Math.PI / 6)
            )
            ctx.closePath()
            ctx.fill()
          }
          break

        case 'rectangle':
          if (annotation.width && annotation.height) {
            ctx.strokeRect(annotation.x, annotation.y, annotation.width, annotation.height)
          }
          break

        case 'circle':
          if (annotation.width && annotation.height) {
            const radiusX = Math.abs(annotation.width) / 2
            const radiusY = Math.abs(annotation.height) / 2
            const centerX = annotation.x + annotation.width / 2
            const centerY = annotation.y + annotation.height / 2

            ctx.beginPath()
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI)
            ctx.stroke()
          }
          break

        case 'line':
          if (annotation.endX !== undefined && annotation.endY !== undefined) {
            ctx.beginPath()
            ctx.moveTo(annotation.x, annotation.y)
            ctx.lineTo(annotation.endX, annotation.endY)
            ctx.stroke()
          }
          break

        case 'text':
          if (annotation.text) {
            ctx.font = `${settings.fontSize}px sans-serif`
            ctx.fillText(annotation.text, annotation.x, annotation.y)
          }
          break
      }
    })
  }

  useEffect(() => {
    redrawCanvas()
  }, [image, annotations])

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasCoords(e)
    setIsDrawing(true)
    setStartPos(pos)

    if (selectedTool === 'text') {
      const text = prompt(t('tools.imageAnnotator.enterText'))
      if (text) {
        const newAnnotation: Annotation = {
          id: `${Date.now()}`,
          type: 'text',
          x: pos.x,
          y: pos.y,
          text,
          color: settings.color,
          strokeWidth: settings.strokeWidth
        }
        setAnnotations(prev => [...prev, newAnnotation])
      }
      setIsDrawing(false)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || selectedTool === 'text') return

    const pos = getCanvasCoords(e)
    const tempAnnotation: Annotation = {
      id: 'temp',
      type: selectedTool,
      x: startPos.x,
      y: startPos.y,
      color: settings.color,
      strokeWidth: settings.strokeWidth
    }

    if (selectedTool === 'arrow' || selectedTool === 'line') {
      tempAnnotation.endX = pos.x
      tempAnnotation.endY = pos.y
    } else {
      tempAnnotation.width = pos.x - startPos.x
      tempAnnotation.height = pos.y - startPos.y
    }

    setAnnotations(prev => [...prev.filter(a => a.id !== 'temp'), tempAnnotation])
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || selectedTool === 'text') return

    const pos = getCanvasCoords(e)
    const newAnnotation: Annotation = {
      id: `${Date.now()}`,
      type: selectedTool,
      x: startPos.x,
      y: startPos.y,
      color: settings.color,
      strokeWidth: settings.strokeWidth
    }

    if (selectedTool === 'arrow' || selectedTool === 'line') {
      newAnnotation.endX = pos.x
      newAnnotation.endY = pos.y
    } else {
      newAnnotation.width = pos.x - startPos.x
      newAnnotation.height = pos.y - startPos.y
    }

    setAnnotations(prev => [...prev.filter(a => a.id !== 'temp'), newAnnotation])
    setIsDrawing(false)
  }

  const downloadAnnotated = () => {
    if (!canvasRef.current) return

    const link = document.createElement('a')
    link.href = canvasRef.current.toDataURL('image/png')
    link.download = `annotated-${Date.now()}.png`
    link.click()
  }

  const undoLast = () => {
    setAnnotations(prev => prev.slice(0, -1))
  }

  const clearAll = () => {
    setAnnotations([])
    setSelectedAnnotation(null)
  }

  const tools = [
    { id: 'arrow', icon: '↗', label: t('tools.imageAnnotator.arrow') },
    { id: 'rectangle', icon: '□', label: t('tools.imageAnnotator.rectangle') },
    { id: 'circle', icon: '○', label: t('tools.imageAnnotator.circle') },
    { id: 'line', icon: '/', label: t('tools.imageAnnotator.line') },
    { id: 'text', icon: 'T', label: t('tools.imageAnnotator.text') }
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button onClick={() => fileInputRef.current?.click()}>
          {image ? t('tools.imageAnnotator.changeImage') : t('tools.imageAnnotator.selectImage')}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button variant="secondary" onClick={undoLast} disabled={annotations.length === 0}>
          {t('tools.imageAnnotator.undo')}
        </Button>
        <Button variant="secondary" onClick={clearAll} disabled={annotations.length === 0}>
          {t('common.clear')}
        </Button>
        <Button variant="secondary" onClick={downloadAnnotated} disabled={!image}>
          {t('common.download')}
        </Button>
        <div className="flex-1" />
        <span className="text-sm text-slate-500">
          {annotations.filter(a => a.id !== 'temp').length} {t('tools.imageAnnotator.annotations')}
        </span>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4" ref={containerRef}>
          <div className="flex gap-2 flex-wrap">
            {tools.map(tool => (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id as Annotation['type'])}
                className={`px-3 py-2 rounded-lg border ${
                  selectedTool === tool.id
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
                title={tool.label}
              >
                <span className="text-lg mr-1">{tool.icon}</span>
                <span className="text-sm">{tool.label}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-center p-4 bg-slate-100 rounded-lg min-h-[400px] overflow-auto">
            {image ? (
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => setIsDrawing(false)}
                className="cursor-crosshair shadow-lg"
                style={{
                  width: image.width * scale,
                  height: image.height * scale
                }}
              />
            ) : (
              <div className="flex items-center justify-center text-slate-400 h-full">
                {t('tools.imageAnnotator.placeholder')}
              </div>
            )}
          </div>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.imageAnnotator.settings')}</h3>

          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('tools.imageAnnotator.color')}</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.color}
                onChange={(e) => setSettings({ ...settings, color: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.color}
                onChange={(e) => setSettings({ ...settings, color: e.target.value })}
                className="flex-1 p-2 border border-slate-200 rounded text-sm font-mono"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#000000', '#ffffff'].map(color => (
              <button
                key={color}
                onClick={() => setSettings({ ...settings, color })}
                className={`w-8 h-8 rounded border-2 ${settings.color === color ? 'border-blue-500' : 'border-slate-200'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.imageAnnotator.strokeWidth')}: {settings.strokeWidth}px
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={settings.strokeWidth}
              onChange={(e) => setSettings({ ...settings, strokeWidth: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.imageAnnotator.fontSize')}: {settings.fontSize}px
            </label>
            <input
              type="range"
              min="12"
              max="48"
              value={settings.fontSize}
              onChange={(e) => setSettings({ ...settings, fontSize: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.imageAnnotator.tips')}</h4>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>• {t('tools.imageAnnotator.tip1')}</li>
              <li>• {t('tools.imageAnnotator.tip2')}</li>
              <li>• {t('tools.imageAnnotator.tip3')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
