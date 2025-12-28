import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function ImageFilters() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [blur, setBlur] = useState(0)
  const [sepia, setSepia] = useState(0)
  const [grayscale, setGrayscale] = useState(0)
  const [hueRotate, setHueRotate] = useState(0)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = () => {
      setImage(img)
    }
    img.src = URL.createObjectURL(file)
  }

  useEffect(() => {
    if (!image) return
    drawImage()
  }, [image, brightness, contrast, saturation, blur, sepia, grayscale, hueRotate])

  const drawImage = () => {
    const canvas = canvasRef.current
    if (!canvas || !image) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to match image (max 400px)
    const scale = Math.min(400 / image.width, 400 / image.height, 1)
    canvas.width = image.width * scale
    canvas.height = image.height * scale

    // Apply filters
    ctx.filter = `
      brightness(${brightness}%)
      contrast(${contrast}%)
      saturate(${saturation}%)
      blur(${blur}px)
      sepia(${sepia}%)
      grayscale(${grayscale}%)
      hue-rotate(${hueRotate}deg)
    `

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  }

  const resetFilters = () => {
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
    setBlur(0)
    setSepia(0)
    setGrayscale(0)
    setHueRotate(0)
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'filtered-image.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const presets = [
    { name: 'Vintage', brightness: 110, contrast: 85, saturation: 70, sepia: 40, grayscale: 0, blur: 0, hue: 0 },
    { name: 'B&W', brightness: 100, contrast: 120, saturation: 0, sepia: 0, grayscale: 100, blur: 0, hue: 0 },
    { name: 'Vivid', brightness: 105, contrast: 110, saturation: 150, sepia: 0, grayscale: 0, blur: 0, hue: 0 },
    { name: 'Cool', brightness: 100, contrast: 100, saturation: 90, sepia: 0, grayscale: 0, blur: 0, hue: 180 },
    { name: 'Warm', brightness: 105, contrast: 100, saturation: 110, sepia: 20, grayscale: 0, blur: 0, hue: 0 },
  ]

  const applyPreset = (preset: typeof presets[0]) => {
    setBrightness(preset.brightness)
    setContrast(preset.contrast)
    setSaturation(preset.saturation)
    setSepia(preset.sepia)
    setGrayscale(preset.grayscale)
    setBlur(preset.blur)
    setHueRotate(preset.hue)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        {!image ? (
          <label className="block w-full py-12 border-2 border-dashed border-slate-300 rounded-lg text-center cursor-pointer hover:border-blue-500">
            <div className="text-4xl mb-2">🖼️</div>
            <div className="text-slate-600">{t('tools.imageFilters.upload')}</div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <canvas ref={canvasRef} className="max-w-full border border-slate-200 rounded" />
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2 bg-slate-100 rounded hover:bg-slate-200"
              >
                {t('tools.imageFilters.reset')}
              </button>
              <button
                onClick={downloadImage}
                className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {t('tools.imageFilters.download')}
              </button>
            </div>
          </>
        )}
      </div>

      {image && (
        <>
          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.imageFilters.presets')}</h3>
            <div className="flex gap-2 flex-wrap">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.imageFilters.adjustments')}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-500 block mb-1">
                  Brightness: {brightness}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-slate-500 block mb-1">
                  Contrast: {contrast}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-slate-500 block mb-1">
                  Saturation: {saturation}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => setSaturation(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-slate-500 block mb-1">
                  Blur: {blur}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={blur}
                  onChange={(e) => setBlur(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-slate-500 block mb-1">
                  Sepia: {sepia}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sepia}
                  onChange={(e) => setSepia(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-slate-500 block mb-1">
                  Grayscale: {grayscale}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={grayscale}
                  onChange={(e) => setGrayscale(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-slate-500 block mb-1">
                  Hue Rotate: {hueRotate}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hueRotate}
                  onChange={(e) => setHueRotate(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
