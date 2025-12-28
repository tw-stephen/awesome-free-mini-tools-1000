import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export default function PixelArtMaker() {
  const { t } = useTranslation()
  const [gridSize, setGridSize] = useState(16)
  const [currentColor, setCurrentColor] = useState('#3B82F6')
  const [grid, setGrid] = useState<string[][]>(
    Array(16).fill(null).map(() => Array(16).fill('#ffffff'))
  )
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState<'draw' | 'erase' | 'fill'>('draw')

  const palette = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff',
    '#88ff00', '#0088ff', '#ff0088', '#888888', '#444444',
    '#cc4444', '#44cc44', '#4444cc', '#cccc44', '#44cccc'
  ]

  const resizeGrid = (newSize: number) => {
    const newGrid = Array(newSize).fill(null).map((_, y) =>
      Array(newSize).fill(null).map((_, x) =>
        grid[y]?.[x] || '#ffffff'
      )
    )
    setGrid(newGrid)
    setGridSize(newSize)
  }

  const paintCell = (x: number, y: number) => {
    const color = tool === 'erase' ? '#ffffff' : currentColor
    const newGrid = grid.map((row, ry) =>
      row.map((cell, rx) => (rx === x && ry === y ? color : cell))
    )
    setGrid(newGrid)
  }

  const floodFill = (x: number, y: number, targetColor: string, newColor: string) => {
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return
    if (grid[y][x] !== targetColor || targetColor === newColor) return

    const newGrid = [...grid.map(row => [...row])]
    const stack: [number, number][] = [[x, y]]

    while (stack.length > 0) {
      const [cx, cy] = stack.pop()!
      if (cx < 0 || cx >= gridSize || cy < 0 || cy >= gridSize) continue
      if (newGrid[cy][cx] !== targetColor) continue

      newGrid[cy][cx] = newColor
      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1])
    }

    setGrid(newGrid)
  }

  const handleCellClick = (x: number, y: number) => {
    if (tool === 'fill') {
      floodFill(x, y, grid[y][x], currentColor)
    } else {
      paintCell(x, y)
    }
  }

  const handleMouseMove = (x: number, y: number) => {
    if (isDrawing && tool !== 'fill') {
      paintCell(x, y)
    }
  }

  const clearGrid = () => {
    setGrid(Array(gridSize).fill(null).map(() => Array(gridSize).fill('#ffffff')))
  }

  const downloadPixelArt = () => {
    const canvas = document.createElement('canvas')
    const scale = Math.max(1, Math.floor(256 / gridSize))
    canvas.width = gridSize * scale
    canvas.height = gridSize * scale
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    grid.forEach((row, y) => {
      row.forEach((color, x) => {
        ctx.fillStyle = color
        ctx.fillRect(x * scale, y * scale, scale, scale)
      })
    })

    const link = document.createElement('a')
    link.download = 'pixel-art.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const cellSize = Math.min(20, 300 / gridSize)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          {(['draw', 'erase', 'fill'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTool(t)}
              className={`px-4 py-2 rounded font-medium ${
                tool === t ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {t === 'draw' && '✏️'} {t === 'erase' && '🧹'} {t === 'fill' && '🪣'}
              {t('tools.pixelArtMaker.' + t)}
            </button>
          ))}
        </div>

        <div
          className="inline-block border border-slate-300 rounded overflow-hidden mb-4"
          onMouseLeave={() => setIsDrawing(false)}
        >
          {grid.map((row, y) => (
            <div key={y} className="flex">
              {row.map((color, x) => (
                <div
                  key={x}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: color,
                    borderRight: '1px solid #e5e7eb',
                    borderBottom: '1px solid #e5e7eb'
                  }}
                  onMouseDown={() => {
                    setIsDrawing(true)
                    handleCellClick(x, y)
                  }}
                  onMouseUp={() => setIsDrawing(false)}
                  onMouseEnter={() => handleMouseMove(x, y)}
                  className="cursor-crosshair"
                />
              ))}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={clearGrid}
            className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200"
          >
            🗑️ {t('tools.pixelArtMaker.clear')}
          </button>
          <button
            onClick={downloadPixelArt}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ⬇️ {t('tools.pixelArtMaker.download')}
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.pixelArtMaker.currentColor')}</h3>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded border-2 border-slate-300"
            style={{ backgroundColor: currentColor }}
          />
          <input
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            className="w-12 h-12 cursor-pointer"
          />
          <input
            type="text"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded font-mono"
          />
        </div>

        <h4 className="text-sm text-slate-500 mb-2">{t('tools.pixelArtMaker.palette')}</h4>
        <div className="flex flex-wrap gap-1">
          {palette.map((color) => (
            <button
              key={color}
              onClick={() => setCurrentColor(color)}
              className={`w-8 h-8 rounded ${
                currentColor === color ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{ backgroundColor: color, border: color === '#ffffff' ? '1px solid #e5e7eb' : 'none' }}
            />
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.pixelArtMaker.gridSize')}: {gridSize}x{gridSize}</h3>
        <div className="flex gap-2">
          {[8, 16, 24, 32].map((size) => (
            <button
              key={size}
              onClick={() => resizeGrid(size)}
              className={`px-4 py-2 rounded ${
                gridSize === size ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {size}×{size}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.pixelArtMaker.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.pixelArtMaker.tip1')}</li>
          <li>• {t('tools.pixelArtMaker.tip2')}</li>
          <li>• {t('tools.pixelArtMaker.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
