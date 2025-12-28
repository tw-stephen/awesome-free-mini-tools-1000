import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function EmojiArt() {
  const { t } = useTranslation()
  const [gridSize, setGridSize] = useState(8)
  const [grid, setGrid] = useState<string[][]>(
    Array(8).fill(null).map(() => Array(8).fill('⬜'))
  )
  const [selectedEmoji, setSelectedEmoji] = useState('❤️')
  const [isDrawing, setIsDrawing] = useState(false)

  const emojiPalette = [
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎',
    '⬛', '⬜', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫',
    '😀', '😎', '🥰', '😢', '😡', '🤔', '💀', '👻', '🎃',
    '⭐', '🌙', '☀️', '🌈', '🔥', '💧', '🌸', '🌺', '🌻',
    '🍎', '🍊', '🍋', '🥑', '🍇', '🍓', '🍒', '🥕', '🌽',
  ]

  const resizeGrid = (newSize: number) => {
    const newGrid = Array(newSize).fill(null).map((_, y) =>
      Array(newSize).fill(null).map((_, x) =>
        grid[y]?.[x] || '⬜'
      )
    )
    setGrid(newGrid)
    setGridSize(newSize)
  }

  const paintCell = (x: number, y: number) => {
    const newGrid = grid.map((row, ry) =>
      row.map((cell, rx) => (rx === x && ry === y ? selectedEmoji : cell))
    )
    setGrid(newGrid)
  }

  const handleMouseMove = (x: number, y: number) => {
    if (isDrawing) {
      paintCell(x, y)
    }
  }

  const clearGrid = () => {
    setGrid(Array(gridSize).fill(null).map(() => Array(gridSize).fill('⬜')))
  }

  const copyArt = () => {
    const art = grid.map(row => row.join('')).join('\n')
    navigator.clipboard.writeText(art)
  }

  const templates = [
    {
      name: 'Heart',
      data: [
        '⬜❤️❤️⬜⬜❤️❤️⬜',
        '❤️❤️❤️❤️❤️❤️❤️❤️',
        '❤️❤️❤️❤️❤️❤️❤️❤️',
        '❤️❤️❤️❤️❤️❤️❤️❤️',
        '⬜❤️❤️❤️❤️❤️❤️⬜',
        '⬜⬜❤️❤️❤️❤️⬜⬜',
        '⬜⬜⬜❤️❤️⬜⬜⬜',
        '⬜⬜⬜⬜⬜⬜⬜⬜',
      ]
    },
    {
      name: 'Star',
      data: [
        '⬜⬜⬜⭐⬜⬜⬜⬜',
        '⬜⬜⭐⭐⭐⬜⬜⬜',
        '⬜⭐⭐⭐⭐⭐⬜⬜',
        '⭐⭐⭐⭐⭐⭐⭐⬜',
        '⬜⭐⭐⭐⭐⭐⬜⬜',
        '⬜⬜⭐⭐⭐⬜⬜⬜',
        '⬜⭐⭐⬜⭐⭐⬜⬜',
        '⭐⭐⬜⬜⬜⭐⭐⬜',
      ]
    },
    {
      name: 'Smiley',
      data: [
        '⬜⬜🟡🟡🟡🟡⬜⬜',
        '⬜🟡🟡🟡🟡🟡🟡⬜',
        '🟡🟡⬛🟡🟡⬛🟡🟡',
        '🟡🟡🟡🟡🟡🟡🟡🟡',
        '🟡⬛🟡🟡🟡🟡⬛🟡',
        '🟡🟡⬛⬛⬛⬛🟡🟡',
        '⬜🟡🟡🟡🟡🟡🟡⬜',
        '⬜⬜🟡🟡🟡🟡⬜⬜',
      ]
    }
  ]

  const loadTemplate = (template: { name: string; data: string[] }) => {
    const normalizedGrid: string[][] = []

    template.data.forEach((row) => {
      const chars: string[] = []
      const regex = /\p{Extended_Pictographic}/gu
      const matches = row.match(regex)
      if (matches) {
        chars.push(...matches)
      }
      while (chars.length < gridSize) {
        chars.push('⬜')
      }
      normalizedGrid.push(chars.slice(0, gridSize))
    })

    while (normalizedGrid.length < gridSize) {
      normalizedGrid.push(Array(gridSize).fill('⬜'))
    }

    setGrid(normalizedGrid.slice(0, gridSize))
  }

  const cellSize = Math.min(36, 300 / gridSize)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div
          className="inline-block border border-slate-200 rounded overflow-hidden"
          onMouseLeave={() => setIsDrawing(false)}
        >
          {grid.map((row, y) => (
            <div key={y} className="flex">
              {row.map((emoji, x) => (
                <div
                  key={x}
                  style={{ width: cellSize, height: cellSize, fontSize: cellSize * 0.7 }}
                  className="flex items-center justify-center cursor-pointer hover:bg-slate-100 select-none"
                  onMouseDown={() => {
                    setIsDrawing(true)
                    paintCell(x, y)
                  }}
                  onMouseUp={() => setIsDrawing(false)}
                  onMouseEnter={() => handleMouseMove(x, y)}
                >
                  {emoji}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={clearGrid}
            className="flex-1 py-2 bg-slate-100 rounded hover:bg-slate-200"
          >
            {t('tools.emojiArt.clear')}
          </button>
          <button
            onClick={copyArt}
            className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('tools.emojiArt.copy')}
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.emojiArt.selectedEmoji')}</h3>
        <div className="text-4xl text-center mb-4">{selectedEmoji}</div>
        <div className="flex flex-wrap gap-1">
          {emojiPalette.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setSelectedEmoji(emoji)}
              className={`text-2xl p-1 rounded ${
                selectedEmoji === emoji ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-slate-100'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.emojiArt.templates')}</h3>
        <div className="flex gap-2">
          {templates.map((template) => (
            <button
              key={template.name}
              onClick={() => loadTemplate(template)}
              className="flex-1 py-2 bg-slate-100 rounded hover:bg-slate-200"
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.emojiArt.gridSize')}: {gridSize}×{gridSize}</h3>
        <div className="flex gap-2">
          {[6, 8, 10, 12].map((size) => (
            <button
              key={size}
              onClick={() => resizeGrid(size)}
              className={`flex-1 py-2 rounded ${
                gridSize === size ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {size}×{size}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-800 text-white font-mono text-sm">
        <div className="text-slate-400 mb-2">Output:</div>
        <pre>{grid.map(row => row.join('')).join('\n')}</pre>
      </div>
    </div>
  )
}
