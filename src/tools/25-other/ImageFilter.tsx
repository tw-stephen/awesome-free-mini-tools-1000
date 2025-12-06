import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface FilterValues {
  brightness: number
  contrast: number
  saturate: number
  grayscale: number
  sepia: number
  hueRotate: number
  blur: number
  invert: number
}

const defaultFilters: FilterValues = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  grayscale: 0,
  sepia: 0,
  hueRotate: 0,
  blur: 0,
  invert: 0
}

const presets: { name: string; filters: FilterValues }[] = [
  { name: 'Original', filters: defaultFilters },
  { name: 'Vivid', filters: { ...defaultFilters, saturate: 150, contrast: 110 } },
  { name: 'Warm', filters: { ...defaultFilters, sepia: 30, saturate: 110 } },
  { name: 'Cool', filters: { ...defaultFilters, hueRotate: 180, saturate: 80 } },
  { name: 'B&W', filters: { ...defaultFilters, grayscale: 100 } },
  { name: 'Vintage', filters: { ...defaultFilters, sepia: 50, contrast: 90, brightness: 110 } },
  { name: 'High Contrast', filters: { ...defaultFilters, contrast: 150 } },
  { name: 'Soft', filters: { ...defaultFilters, blur: 1, brightness: 105, contrast: 95 } }
]

export default function ImageFilter() {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [filters, setFilters] = useState<FilterValues>(defaultFilters)
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png')
  const [quality, setQuality] = useState(0.9)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = () => {
      setImage(img)
      setFilters(defaultFilters)
    }
    img.src = URL.createObjectURL(file)
  }

  const getFilterString = () => {
    return `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) hue-rotate(${filters.hueRotate}deg) blur(${filters.blur}px) invert(${filters.invert}%)`
  }

  useEffect(() => {
    if (!image || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = image.width
    canvas.height = image.height

    ctx.filter = getFilterString()
    ctx.drawImage(image, 0, 0)
  }, [image, filters])

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const mimeType = `image/${format}`
    const a = document.createElement('a')
    a.download = `filtered.${format}`
    a.href = canvas.toDataURL(mimeType, quality)
    a.click()
  }

  const copyToClipboard = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/png')
      })
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const updateFilter = (key: keyof FilterValues, value: number) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const applyPreset = (preset: typeof presets[0]) => {
    setFilters(preset.filters)
  }

  const filterControls: { key: keyof FilterValues; min: number; max: number; unit: string }[] = [
    { key: 'brightness', min: 0, max: 200, unit: '%' },
    { key: 'contrast', min: 0, max: 200, unit: '%' },
    { key: 'saturate', min: 0, max: 200, unit: '%' },
    { key: 'grayscale', min: 0, max: 100, unit: '%' },
    { key: 'sepia', min: 0, max: 100, unit: '%' },
    { key: 'hueRotate', min: 0, max: 360, unit: '°' },
    { key: 'blur', min: 0, max: 10, unit: 'px' },
    { key: 'invert', min: 0, max: 100, unit: '%' }
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button onClick={() => fileInputRef.current?.click()}>
          {image ? t('tools.imageFilter.changeImage') : t('tools.imageFilter.selectImage')}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button variant="secondary" onClick={() => setFilters(defaultFilters)} disabled={!image}>
          {t('tools.imageFilter.reset')}
        </Button>
        <div className="flex-1" />
        <Button variant="secondary" onClick={copyToClipboard} disabled={!image}>
          {t('common.copy')}
        </Button>
        <Button variant="secondary" onClick={downloadImage} disabled={!image}>
          {t('common.download')}
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-center p-4 bg-slate-100 rounded-lg min-h-[350px] overflow-auto">
            {image ? (
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[350px] shadow-lg"
                style={{ objectFit: 'contain' }}
              />
            ) : (
              <div className="flex items-center justify-center text-slate-400 h-full">
                {t('tools.imageFilter.placeholder')}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">{t('tools.imageFilter.presets')}</label>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  disabled={!image}
                  className="px-2 py-1.5 text-xs rounded border border-slate-200 hover:border-slate-300 disabled:opacity-50"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4 max-h-[550px] overflow-auto">
          <h3 className="font-semibold text-slate-700">{t('tools.imageFilter.settings')}</h3>

          <div className="space-y-3">
            {filterControls.map(({ key, min, max, unit }) => (
              <div key={key}>
                <label className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>{t(`tools.imageFilter.${key}`)}</span>
                  <span>{filters[key]}{unit}</span>
                </label>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={key === 'blur' ? 0.5 : 1}
                  value={filters[key]}
                  onChange={(e) => updateFilter(key, parseFloat(e.target.value))}
                  className="w-full"
                  disabled={!image}
                />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.imageFilter.format')}</label>
              <div className="flex gap-1">
                {(['png', 'jpeg', 'webp'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`flex-1 px-2 py-1 text-xs rounded ${format === f ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {format !== 'png' && (
              <div className="mt-3">
                <label className="block text-xs text-slate-500 mb-1">{t('tools.imageFilter.quality')} ({Math.round(quality * 100)}%)</label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {image && (
            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.imageFilter.info')}</h4>
              <div className="space-y-1 text-xs text-slate-600">
                <div>{t('tools.imageFilter.size')}: {image.width}×{image.height}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
