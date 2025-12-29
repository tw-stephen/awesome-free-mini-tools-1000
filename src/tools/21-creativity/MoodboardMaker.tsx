import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface MoodboardItem {
  id: string
  type: 'color' | 'text' | 'image'
  content: string
  x: number
  y: number
  width: number
  height: number
}

export default function MoodboardMaker() {
  const { t } = useTranslation()
  const [items, setItems] = useState<MoodboardItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [boardColor, setBoardColor] = useState('#f8fafc')
  const [newText, setNewText] = useState('')
  const [newColor, setNewColor] = useState('#3b82f6')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const addColorSwatch = () => {
    const newItem: MoodboardItem = {
      id: generateId(),
      type: 'color',
      content: newColor,
      x: 20 + Math.random() * 100,
      y: 20 + Math.random() * 100,
      width: 80,
      height: 80,
    }
    setItems([...items, newItem])
  }

  const addText = () => {
    if (!newText.trim()) return
    const newItem: MoodboardItem = {
      id: generateId(),
      type: 'text',
      content: newText,
      x: 20 + Math.random() * 100,
      y: 20 + Math.random() * 100,
      width: 150,
      height: 50,
    }
    setItems([...items, newItem])
    setNewText('')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const newItem: MoodboardItem = {
        id: generateId(),
        type: 'image',
        content: event.target?.result as string,
        x: 20 + Math.random() * 50,
        y: 20 + Math.random() * 50,
        width: 150,
        height: 150,
      }
      setItems([...items, newItem])
    }
    reader.readAsDataURL(file)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id)
    setSelectedId(id)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    const board = boardRef.current
    if (!board) return

    const rect = board.getBoundingClientRect()
    const x = e.clientX - rect.left - 40
    const y = e.clientY - rect.top - 40

    setItems(items.map((item) =>
      item.id === id ? { ...item, x: Math.max(0, x), y: Math.max(0, y) } : item
    ))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const updateItemSize = (id: string, delta: number) => {
    setItems(items.map((item) => {
      if (item.id !== id) return item
      const newWidth = Math.max(50, item.width + delta)
      const newHeight = item.type === 'text' ? item.height : Math.max(50, item.height + delta)
      return { ...item, width: newWidth, height: newHeight }
    }))
  }

  const exportMoodboard = () => {
    const board = boardRef.current
    if (!board) return

    // Simple HTML export
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Moodboard</title>
  <style>
    body { margin: 0; padding: 20px; background: ${boardColor}; }
    .board { position: relative; width: 800px; height: 600px; }
    .item { position: absolute; }
    .color { border-radius: 8px; }
    .text { font-family: sans-serif; padding: 8px; }
    .image { object-fit: cover; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="board">
    ${items.map((item) => {
      if (item.type === 'color') {
        return `<div class="item color" style="left:${item.x}px;top:${item.y}px;width:${item.width}px;height:${item.height}px;background:${item.content}"></div>`
      } else if (item.type === 'text') {
        return `<div class="item text" style="left:${item.x}px;top:${item.y}px;width:${item.width}px">${item.content}</div>`
      } else {
        return `<img class="item image" src="${item.content}" style="left:${item.x}px;top:${item.y}px;width:${item.width}px;height:${item.height}px" />`
      }
    }).join('\n    ')}
  </div>
</body>
</html>`

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'moodboard.html'
    link.click()
    URL.revokeObjectURL(url)
  }

  const presetPalettes = [
    ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'],
    ['#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd'],
    ['#03071e', '#370617', '#6a040f', '#9d0208', '#d00000'],
    ['#cdb4db', '#ffc8dd', '#ffafcc', '#bde0fe', '#a2d2ff'],
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('tools.moodboardMaker.addColor')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <button
              onClick={addColorSwatch}
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              +
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t('tools.moodboardMaker.addText')}</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Enter text..."
              className="px-3 py-2 border rounded"
              onKeyDown={(e) => e.key === 'Enter' && addText()}
            />
            <button
              onClick={addText}
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              +
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t('tools.moodboardMaker.addImage')}</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t('tools.moodboardMaker.background')}</label>
          <input
            type="color"
            value={boardColor}
            onChange={(e) => setBoardColor(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{t('tools.moodboardMaker.palettes')}</label>
        <div className="flex gap-2">
          {presetPalettes.map((palette, i) => (
            <button
              key={i}
              onClick={() => {
                palette.forEach((color, j) => {
                  setTimeout(() => {
                    const newItem: MoodboardItem = {
                      id: generateId(),
                      type: 'color',
                      content: color,
                      x: 20 + j * 90,
                      y: 20,
                      width: 80,
                      height: 80,
                    }
                    setItems((prev) => [...prev, newItem])
                  }, j * 100)
                })
              }}
              className="flex rounded overflow-hidden hover:ring-2 ring-blue-500"
            >
              {palette.map((color, j) => (
                <div key={j} className="w-6 h-8" style={{ backgroundColor: color }} />
              ))}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={boardRef}
        className="relative min-h-[400px] rounded-lg border-2 border-dashed border-gray-300 overflow-hidden"
        style={{ backgroundColor: boardColor }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {items.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            {t('tools.moodboardMaker.dragHint')}
          </div>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item.id)}
            onClick={() => setSelectedId(item.id)}
            className={`absolute cursor-move group ${
              selectedId === item.id ? 'ring-2 ring-blue-500' : ''
            }`}
            style={{
              left: item.x,
              top: item.y,
              width: item.width,
              height: item.type === 'text' ? 'auto' : item.height,
            }}
          >
            {item.type === 'color' && (
              <div
                className="w-full h-full rounded-lg shadow-md"
                style={{ backgroundColor: item.content }}
              />
            )}
            {item.type === 'text' && (
              <div className="bg-white/80 backdrop-blur-sm p-2 rounded shadow-md">
                {item.content}
              </div>
            )}
            {item.type === 'image' && (
              <img
                src={item.content}
                alt="Moodboard"
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
            )}

            <div className="absolute -top-2 -right-2 hidden group-hover:flex gap-1">
              {item.type !== 'text' && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); updateItemSize(item.id, -20) }}
                    className="w-6 h-6 bg-gray-700 text-white rounded text-xs hover:bg-gray-600"
                  >
                    -
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); updateItemSize(item.id, 20) }}
                    className="w-6 h-6 bg-gray-700 text-white rounded text-xs hover:bg-gray-600"
                  >
                    +
                  </button>
                </>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); deleteItem(item.id) }}
                className="w-6 h-6 bg-red-500 text-white rounded text-xs hover:bg-red-600"
              >
                X
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setItems([])}
          className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
        >
          {t('common.clear')}
        </button>
        <button
          onClick={exportMoodboard}
          disabled={items.length === 0}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {t('common.download')} HTML
        </button>
      </div>
    </div>
  )
}
