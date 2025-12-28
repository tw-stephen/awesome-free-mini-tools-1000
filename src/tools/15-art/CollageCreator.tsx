import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface CollageImage {
  src: string
  file: File
}

export default function CollageCreator() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [images, setImages] = useState<CollageImage[]>([])
  const [layout, setLayout] = useState<'grid-2x2' | 'grid-3x3' | 'horizontal' | 'vertical'>('grid-2x2')
  const [gap, setGap] = useState(10)
  const [bgColor, setBgColor] = useState('#ffffff')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImages((prev) => [
          ...prev,
          { src: event.target?.result as string, file }
        ].slice(0, 9))
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const generateCollage = () => {
    const canvas = canvasRef.current
    if (!canvas || images.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = 600
    canvas.width = size
    canvas.height = size

    // Background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, size, size)

    const loadedImages: HTMLImageElement[] = []
    let loaded = 0

    images.forEach((img, i) => {
      const image = new Image()
      image.onload = () => {
        loadedImages[i] = image
        loaded++

        if (loaded === images.length) {
          drawCollage(ctx, loadedImages, size)
        }
      }
      image.src = img.src
    })
  }

  const drawCollage = (ctx: CanvasRenderingContext2D, loadedImages: HTMLImageElement[], size: number) => {
    let positions: { x: number; y: number; w: number; h: number }[] = []

    switch (layout) {
      case 'grid-2x2':
        const cellSize2 = (size - gap * 3) / 2
        positions = [
          { x: gap, y: gap, w: cellSize2, h: cellSize2 },
          { x: gap * 2 + cellSize2, y: gap, w: cellSize2, h: cellSize2 },
          { x: gap, y: gap * 2 + cellSize2, w: cellSize2, h: cellSize2 },
          { x: gap * 2 + cellSize2, y: gap * 2 + cellSize2, w: cellSize2, h: cellSize2 },
        ]
        break
      case 'grid-3x3':
        const cellSize3 = (size - gap * 4) / 3
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            positions.push({
              x: gap + col * (cellSize3 + gap),
              y: gap + row * (cellSize3 + gap),
              w: cellSize3,
              h: cellSize3,
            })
          }
        }
        break
      case 'horizontal':
        const hWidth = (size - gap * (images.length + 1)) / images.length
        images.forEach((_, i) => {
          positions.push({
            x: gap + i * (hWidth + gap),
            y: gap,
            w: hWidth,
            h: size - gap * 2,
          })
        })
        break
      case 'vertical':
        const vHeight = (size - gap * (images.length + 1)) / images.length
        images.forEach((_, i) => {
          positions.push({
            x: gap,
            y: gap + i * (vHeight + gap),
            w: size - gap * 2,
            h: vHeight,
          })
        })
        break
    }

    loadedImages.forEach((img, i) => {
      if (i >= positions.length) return
      const pos = positions[i]

      // Calculate crop to fill
      const imgRatio = img.width / img.height
      const cellRatio = pos.w / pos.h

      let sx = 0, sy = 0, sw = img.width, sh = img.height

      if (imgRatio > cellRatio) {
        sw = img.height * cellRatio
        sx = (img.width - sw) / 2
      } else {
        sh = img.width / cellRatio
        sy = (img.height - sh) / 2
      }

      ctx.drawImage(img, sx, sy, sw, sh, pos.x, pos.y, pos.w, pos.h)
    })
  }

  const downloadCollage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'collage.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const layouts = [
    { id: 'grid-2x2', name: '2×2 Grid', maxImages: 4 },
    { id: 'grid-3x3', name: '3×3 Grid', maxImages: 9 },
    { id: 'horizontal', name: 'Horizontal', maxImages: 6 },
    { id: 'vertical', name: 'Vertical', maxImages: 6 },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block w-full py-8 border-2 border-dashed border-slate-300 rounded-lg text-center cursor-pointer hover:border-blue-500">
          <div className="text-4xl mb-2">📷</div>
          <div className="text-slate-600">{t('tools.collageCreator.addImages')}</div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {images.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.collageCreator.images')} ({images.length})</h3>
          <div className="flex gap-2 flex-wrap">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={img.src}
                  alt={`Image ${i + 1}`}
                  className="w-16 h-16 object-cover rounded"
                />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.collageCreator.layout')}</h3>
        <div className="grid grid-cols-4 gap-2">
          {layouts.map((l) => (
            <button
              key={l.id}
              onClick={() => setLayout(l.id as any)}
              className={`py-2 rounded text-sm ${
                layout === l.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {l.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.collageCreator.settings')}</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.collageCreator.bgColor')}</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.collageCreator.gap')}: {gap}px
            </label>
            <input
              type="range"
              min="0"
              max="30"
              value={gap}
              onChange={(e) => setGap(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="card p-4">
          <button
            onClick={generateCollage}
            className="w-full py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600 mb-4"
          >
            {t('tools.collageCreator.generate')}
          </button>
          <div className="flex justify-center mb-4">
            <canvas ref={canvasRef} className="max-w-full border border-slate-200 rounded" />
          </div>
          <button
            onClick={downloadCollage}
            className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
          >
            {t('tools.collageCreator.download')}
          </button>
        </div>
      )}
    </div>
  )
}
