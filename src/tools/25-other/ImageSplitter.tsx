import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface SplitSettings {
  mode: 'grid' | 'custom'
  rows: number
  cols: number
  customWidth: number
  customHeight: number
}

interface SplitPiece {
  x: number
  y: number
  width: number
  height: number
  dataUrl: string
}

export default function ImageSplitter() {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [pieces, setPieces] = useState<SplitPiece[]>([])
  const [settings, setSettings] = useState<SplitSettings>({
    mode: 'grid',
    rows: 2,
    cols: 2,
    customWidth: 100,
    customHeight: 100
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = () => {
      setImage(img)
      setPieces([])
    }
    img.src = URL.createObjectURL(file)
  }

  const splitImage = () => {
    if (!image) return

    const newPieces: SplitPiece[] = []
    let pieceWidth: number
    let pieceHeight: number
    let rows: number
    let cols: number

    if (settings.mode === 'grid') {
      rows = settings.rows
      cols = settings.cols
      pieceWidth = Math.floor(image.width / cols)
      pieceHeight = Math.floor(image.height / rows)
    } else {
      pieceWidth = settings.customWidth
      pieceHeight = settings.customHeight
      cols = Math.ceil(image.width / pieceWidth)
      rows = Math.ceil(image.height / pieceHeight)
    }

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * pieceWidth
        const y = row * pieceHeight
        const w = Math.min(pieceWidth, image.width - x)
        const h = Math.min(pieceHeight, image.height - y)

        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(image, x, y, w, h, 0, 0, w, h)
          newPieces.push({
            x,
            y,
            width: w,
            height: h,
            dataUrl: canvas.toDataURL('image/png')
          })
        }
      }
    }

    setPieces(newPieces)
  }

  useEffect(() => {
    if (image) {
      splitImage()
    }
  }, [image, settings])

  const downloadPiece = (piece: SplitPiece, index: number) => {
    const link = document.createElement('a')
    link.href = piece.dataUrl
    link.download = `piece-${index + 1}-${piece.x}x${piece.y}.png`
    link.click()
  }

  const downloadAllPieces = () => {
    pieces.forEach((piece, index) => {
      setTimeout(() => {
        downloadPiece(piece, index)
      }, index * 200)
    })
  }

  const drawPreview = () => {
    if (!canvasRef.current || !image) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const maxSize = 400
    const scale = Math.min(maxSize / image.width, maxSize / image.height, 1)
    canvas.width = image.width * scale
    canvas.height = image.height * scale

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

    // Draw grid lines
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])

    let rows: number, cols: number
    if (settings.mode === 'grid') {
      rows = settings.rows
      cols = settings.cols
    } else {
      cols = Math.ceil(image.width / settings.customWidth)
      rows = Math.ceil(image.height / settings.customHeight)
    }

    const cellWidth = canvas.width / cols
    const cellHeight = canvas.height / rows

    for (let i = 1; i < cols; i++) {
      ctx.beginPath()
      ctx.moveTo(i * cellWidth, 0)
      ctx.lineTo(i * cellWidth, canvas.height)
      ctx.stroke()
    }

    for (let i = 1; i < rows; i++) {
      ctx.beginPath()
      ctx.moveTo(0, i * cellHeight)
      ctx.lineTo(canvas.width, i * cellHeight)
      ctx.stroke()
    }
  }

  useEffect(() => {
    drawPreview()
  }, [image, settings])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button onClick={() => fileInputRef.current?.click()}>
          {image ? t('tools.imageSplitter.changeImage') : t('tools.imageSplitter.selectImage')}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button variant="secondary" onClick={downloadAllPieces} disabled={pieces.length === 0}>
          {t('tools.imageSplitter.downloadAll')}
        </Button>
        <div className="flex-1" />
        {pieces.length > 0 && (
          <span className="text-sm text-slate-500">
            {pieces.length} {t('tools.imageSplitter.pieces')}
          </span>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-center p-4 bg-slate-100 rounded-lg min-h-[300px]">
            {image ? (
              <canvas ref={canvasRef} className="shadow-lg rounded" />
            ) : (
              <div className="flex items-center justify-center text-slate-400 h-full">
                {t('tools.imageSplitter.placeholder')}
              </div>
            )}
          </div>

          {pieces.length > 0 && (
            <div>
              <label className="block text-xs text-slate-500 mb-2">{t('tools.imageSplitter.splitResult')}</label>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 p-3 bg-slate-50 rounded-lg max-h-[200px] overflow-auto">
                {pieces.map((piece, index) => (
                  <button
                    key={index}
                    onClick={() => downloadPiece(piece, index)}
                    className="relative group"
                  >
                    <img
                      src={piece.dataUrl}
                      alt={`Piece ${index + 1}`}
                      className="w-full aspect-square object-cover rounded shadow border border-slate-200 hover:border-blue-500 transition-colors"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                      <span className="text-white text-xs">↓</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] text-center rounded-b">
                      {index + 1}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.imageSplitter.settings')}</h3>

          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('tools.imageSplitter.splitMode')}</label>
            <select
              value={settings.mode}
              onChange={(e) => setSettings({ ...settings, mode: e.target.value as 'grid' | 'custom' })}
              className="w-full p-2 border border-slate-200 rounded text-sm"
            >
              <option value="grid">{t('tools.imageSplitter.gridMode')}</option>
              <option value="custom">{t('tools.imageSplitter.customMode')}</option>
            </select>
          </div>

          {settings.mode === 'grid' ? (
            <>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.imageSplitter.rows')}: {settings.rows}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={settings.rows}
                  onChange={(e) => setSettings({ ...settings, rows: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.imageSplitter.cols')}: {settings.cols}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={settings.cols}
                  onChange={(e) => setSettings({ ...settings, cols: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.imageSplitter.pieceWidth')}</label>
                <input
                  type="number"
                  min="10"
                  value={settings.customWidth}
                  onChange={(e) => setSettings({ ...settings, customWidth: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-200 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.imageSplitter.pieceHeight')}</label>
                <input
                  type="number"
                  min="10"
                  value={settings.customHeight}
                  onChange={(e) => setSettings({ ...settings, customHeight: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-200 rounded text-sm"
                />
              </div>
            </>
          )}

          {image && (
            <div className="p-3 bg-slate-50 rounded-lg space-y-1 text-xs text-slate-600">
              <div>{t('tools.imageSplitter.originalSize')}: {image.width} × {image.height}</div>
              {pieces.length > 0 && (
                <div>{t('tools.imageSplitter.pieceSize')}: {pieces[0].width} × {pieces[0].height}</div>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.imageSplitter.tips')}</h4>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>• {t('tools.imageSplitter.tip1')}</li>
              <li>• {t('tools.imageSplitter.tip2')}</li>
              <li>• {t('tools.imageSplitter.tip3')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
