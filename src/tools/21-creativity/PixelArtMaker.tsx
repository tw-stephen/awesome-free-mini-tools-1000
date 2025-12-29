import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export default function PixelArtMaker() {
  const { t } = useTranslation()
  const [gridSize, setGridSize] = useState(16)
  const [currentColor, setCurrentColor] = useState('#000000')
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState<'draw' | 'erase' | 'fill'>('draw')
  const [pixels, setPixels] = useState<Record<string, string>>({})
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const presetColors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff',
    '#88ff00', '#0088ff', '#ff0088', '#888888', '#ff8888',
    '#88ff88', '#8888ff', '#ffff88', '#ff88ff', '#88ffff',
  ]

  const handlePixelAction = (x: number, y: number) => {
    const key = `${x}-${y}`
    const newPixels = { ...pixels }

    if (tool === 'draw') {
      newPixels[key] = currentColor
    } else if (tool === 'erase') {
      delete newPixels[key]
    } else if (tool === 'fill') {
      const targetColor = pixels[key] || null
      floodFill(newPixels, x, y, targetColor, currentColor)
    }

    setPixels(newPixels)
  }

  const floodFill = (
    grid: Record<string, string>,
    x: number,
    y: number,
    targetColor: string | null,
    fillColor: string
  ) => {
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return
    const key = `${x}-${y}`
    const currentPixelColor = grid[key] || null

    if (currentPixelColor === fillColor) return
    if (currentPixelColor !== targetColor) return

    grid[key] = fillColor

    floodFill(grid, x + 1, y, targetColor, fillColor)
    floodFill(grid, x - 1, y, targetColor, fillColor)
    floodFill(grid, x, y + 1, targetColor, fillColor)
    floodFill(grid, x, y - 1, targetColor, fillColor)
  }

  const handleMouseDown = (x: number, y: number) => {
    setIsDrawing(true)
    handlePixelAction(x, y)
  }

  const handleMouseEnter = (x: number, y: number) => {
    if (isDrawing && tool !== 'fill') {
      handlePixelAction(x, y)
    }
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    setPixels({})
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const pixelSize = 20
    canvas.width = gridSize * pixelSize
    canvas.height = gridSize * pixelSize

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const key = `${x}-${y}`
        if (pixels[key]) {
          ctx.fillStyle = pixels[key]
          ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
        }
      }
    }

    const link = document.createElement('a')
    link.download = 'pixel-art.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const cellSize = Math.min(24, Math.floor(400 / gridSize))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="space-y-1">
          <label className="text-sm font-medium">{t('tools.pixelArtMaker.gridSize')}</label>
          <select
            value={gridSize}
            onChange={(e) => {
              setGridSize(parseInt(e.target.value))
              setPixels({})
            }}
            className="block px-3 py-2 border rounded"
          >
            <option value={8}>8x8</option>
            <option value={16}>16x16</option>
            <option value={32}>32x32</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">{t('tools.pixelArtMaker.tool')}</label>
          <div className="flex gap-1">
            <button
              onClick={() => setTool('draw')}
              className={`px-3 py-2 rounded ${
                tool === 'draw' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {t('tools.pixelArtMaker.draw')}
            </button>
            <button
              onClick={() => setTool('erase')}
              className={`px-3 py-2 rounded ${
                tool === 'erase' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {t('tools.pixelArtMaker.erase')}
            </button>
            <button
              onClick={() => setTool('fill')}
              className={`px-3 py-2 rounded ${
                tool === 'fill' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {t('tools.pixelArtMaker.fill')}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{t('tools.pixelArtMaker.color')}</label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer"
          />
          <div className="flex flex-wrap gap-1">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => setCurrentColor(color)}
                className={`w-6 h-6 rounded border-2 ${
                  currentColor === color ? 'border-blue-500' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        className="card p-4 overflow-auto"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="inline-grid border border-gray-300 bg-white"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
            gap: '1px',
            backgroundColor: '#ddd',
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, i) => {
            const x = i % gridSize
            const y = Math.floor(i / gridSize)
            const key = `${x}-${y}`
            return (
              <div
                key={key}
                className="cursor-crosshair hover:opacity-80"
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: pixels[key] || '#ffffff',
                }}
                onMouseDown={() => handleMouseDown(x, y)}
                onMouseEnter={() => handleMouseEnter(x, y)}
              />
            )
          })}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-2">
        <button
          onClick={clearCanvas}
          className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
        >
          {t('common.clear')}
        </button>
        <button
          onClick={downloadImage}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('common.download')}
        </button>
      </div>
    </div>
  )
}
