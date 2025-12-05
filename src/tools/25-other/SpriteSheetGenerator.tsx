import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface SpriteFrame {
  id: string
  name: string
  image: HTMLImageElement
  width: number
  height: number
}

export default function SpriteSheetGenerator() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [frames, setFrames] = useState<SpriteFrame[]>([])
  const [columns, setColumns] = useState(4)
  const [padding, setPadding] = useState(0)
  const [bgColor, setBgColor] = useState('transparent')
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const newFrame: SpriteFrame = {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name.replace(/\.[^/.]+$/, ''),
            image: img,
            width: img.width,
            height: img.height
          }
          setFrames(prev => [...prev, newFrame])
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    })

    e.target.value = ''
  }

  const removeFrame = (id: string) => {
    setFrames(prev => prev.filter(f => f.id !== id))
    if (selectedFrame === id) setSelectedFrame(null)
  }

  const moveFrame = (id: string, direction: 'up' | 'down') => {
    const index = frames.findIndex(f => f.id === id)
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= frames.length) return

    const newFrames = [...frames]
    const [removed] = newFrames.splice(index, 1)
    newFrames.splice(newIndex, 0, removed)
    setFrames(newFrames)
  }

  const generateSpriteSheet = () => {
    if (frames.length === 0) return null

    const maxWidth = Math.max(...frames.map(f => f.width))
    const maxHeight = Math.max(...frames.map(f => f.height))

    const rows = Math.ceil(frames.length / columns)
    const canvasWidth = columns * (maxWidth + padding) - padding
    const canvasHeight = rows * (maxHeight + padding) - padding

    const canvas = canvasRef.current
    if (!canvas) return null

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    if (bgColor !== 'transparent') {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    } else {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    }

    frames.forEach((frame, index) => {
      const col = index % columns
      const row = Math.floor(index / columns)
      const x = col * (maxWidth + padding) + (maxWidth - frame.width) / 2
      const y = row * (maxHeight + padding) + (maxHeight - frame.height) / 2
      ctx.drawImage(frame.image, x, y)
    })

    return { canvasWidth, canvasHeight, maxWidth, maxHeight, rows }
  }

  const downloadSpriteSheet = () => {
    generateSpriteSheet()
    const canvas = canvasRef.current
    if (!canvas) return

    const a = document.createElement('a')
    a.download = 'spritesheet.png'
    a.href = canvas.toDataURL('image/png')
    a.click()
  }

  const generateCSS = () => {
    if (frames.length === 0) return ''

    const maxWidth = Math.max(...frames.map(f => f.width))
    const maxHeight = Math.max(...frames.map(f => f.height))

    let css = `.sprite {\n  background-image: url('spritesheet.png');\n  width: ${maxWidth}px;\n  height: ${maxHeight}px;\n}\n\n`

    frames.forEach((frame, index) => {
      const col = index % columns
      const row = Math.floor(index / columns)
      const x = col * (maxWidth + padding)
      const y = row * (maxHeight + padding)
      css += `.sprite-${frame.name.toLowerCase().replace(/\s+/g, '-')} {\n  background-position: -${x}px -${y}px;\n}\n\n`
    })

    return css
  }

  const copyCSS = async () => {
    await navigator.clipboard.writeText(generateCSS())
  }

  const spriteInfo = generateSpriteSheet()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button onClick={() => fileInputRef.current?.click()}>{t('tools.spriteSheet.addFrames')}</Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button variant="secondary" onClick={downloadSpriteSheet} disabled={frames.length === 0}>
          {t('common.download')}
        </Button>
        <Button variant="secondary" onClick={copyCSS} disabled={frames.length === 0}>
          {t('tools.spriteSheet.copyCSS')}
        </Button>
        <div className="flex-1" />
        <span className="text-sm text-slate-500">
          {frames.length} {t('tools.spriteSheet.frames')}
        </span>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-center p-4 bg-slate-100 rounded-lg overflow-auto min-h-[300px]">
            {frames.length > 0 ? (
              <div
                className="inline-block"
                style={{
                  backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
              >
                <canvas ref={canvasRef} className="max-w-full" />
              </div>
            ) : (
              <div className="flex items-center justify-center text-slate-400">
                {t('tools.spriteSheet.empty')}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">{t('tools.spriteSheet.frameList')}</label>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {frames.map((frame, index) => (
                <div
                  key={frame.id}
                  className={`relative border rounded-lg p-2 cursor-pointer ${
                    selectedFrame === frame.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setSelectedFrame(frame.id)}
                >
                  <div className="aspect-square flex items-center justify-center bg-slate-50 rounded mb-1 overflow-hidden">
                    <img
                      src={frame.image.src}
                      alt={frame.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="text-xs text-slate-600 truncate text-center">{index + 1}</div>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFrame(frame.id) }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {frames.length > 0 && (
            <div className="p-3 bg-slate-800 rounded-lg overflow-x-auto max-h-40">
              <code className="text-xs text-green-400 whitespace-pre">{generateCSS()}</code>
            </div>
          )}
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.spriteSheet.settings')}</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.spriteSheet.columns')} ({columns})</label>
              <input
                type="range"
                min="1"
                max="12"
                value={columns}
                onChange={(e) => setColumns(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.spriteSheet.padding')} ({padding}px)</label>
              <input
                type="range"
                min="0"
                max="20"
                value={padding}
                onChange={(e) => setPadding(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.spriteSheet.bgColor')}</label>
              <div className="flex gap-2">
                <select
                  value={bgColor === 'transparent' ? 'transparent' : 'custom'}
                  onChange={(e) => setBgColor(e.target.value === 'transparent' ? 'transparent' : '#ffffff')}
                  className="input flex-1 text-sm"
                >
                  <option value="transparent">{t('tools.spriteSheet.transparent')}</option>
                  <option value="custom">{t('tools.spriteSheet.custom')}</option>
                </select>
                {bgColor !== 'transparent' && (
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-8 rounded cursor-pointer"
                  />
                )}
              </div>
            </div>

            {selectedFrame && (
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.spriteSheet.selectedFrame')}</h4>
                <div className="space-y-2">
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveFrame(selectedFrame, 'up')}
                      className="flex-1 px-2 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200"
                    >
                      {t('tools.spriteSheet.moveUp')}
                    </button>
                    <button
                      onClick={() => moveFrame(selectedFrame, 'down')}
                      className="flex-1 px-2 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200"
                    >
                      {t('tools.spriteSheet.moveDown')}
                    </button>
                  </div>
                  <button
                    onClick={() => removeFrame(selectedFrame)}
                    className="w-full px-2 py-1 text-xs rounded bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    {t('tools.spriteSheet.remove')}
                  </button>
                </div>
              </div>
            )}

            {spriteInfo && (
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.spriteSheet.info')}</h4>
                <div className="space-y-1 text-xs text-slate-600">
                  <div>{t('tools.spriteSheet.sheetSize')}: {spriteInfo.canvasWidth}×{spriteInfo.canvasHeight}</div>
                  <div>{t('tools.spriteSheet.frameSize')}: {spriteInfo.maxWidth}×{spriteInfo.maxHeight}</div>
                  <div>{t('tools.spriteSheet.grid')}: {columns}×{spriteInfo.rows}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
