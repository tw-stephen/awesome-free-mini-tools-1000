import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface FilterValues {
  blur: number
  brightness: number
  contrast: number
  grayscale: number
  hueRotate: number
  invert: number
  opacity: number
  saturate: number
  sepia: number
}

export default function FilterPreview() {
  const { t } = useTranslation()
  const [imageSrc, setImageSrc] = useState<string>('/api/placeholder/400/300')
  const [filters, setFilters] = useState<FilterValues>({
    blur: 0,
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    hueRotate: 0,
    invert: 0,
    opacity: 100,
    saturate: 100,
    sepia: 0,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filterConfig = [
    { key: 'blur', min: 0, max: 20, unit: 'px', default: 0 },
    { key: 'brightness', min: 0, max: 200, unit: '%', default: 100 },
    { key: 'contrast', min: 0, max: 200, unit: '%', default: 100 },
    { key: 'grayscale', min: 0, max: 100, unit: '%', default: 0 },
    { key: 'hueRotate', min: 0, max: 360, unit: 'deg', default: 0 },
    { key: 'invert', min: 0, max: 100, unit: '%', default: 0 },
    { key: 'opacity', min: 0, max: 100, unit: '%', default: 100 },
    { key: 'saturate', min: 0, max: 200, unit: '%', default: 100 },
    { key: 'sepia', min: 0, max: 100, unit: '%', default: 0 },
  ] as const

  const presets = [
    { name: 'None', values: { blur: 0, brightness: 100, contrast: 100, grayscale: 0, hueRotate: 0, invert: 0, opacity: 100, saturate: 100, sepia: 0 } },
    { name: 'Vintage', values: { blur: 0, brightness: 110, contrast: 90, grayscale: 0, hueRotate: 0, invert: 0, opacity: 100, saturate: 80, sepia: 30 } },
    { name: 'B&W', values: { blur: 0, brightness: 100, contrast: 120, grayscale: 100, hueRotate: 0, invert: 0, opacity: 100, saturate: 0, sepia: 0 } },
    { name: 'Vivid', values: { blur: 0, brightness: 110, contrast: 110, grayscale: 0, hueRotate: 0, invert: 0, opacity: 100, saturate: 150, sepia: 0 } },
    { name: 'Muted', values: { blur: 0, brightness: 95, contrast: 90, grayscale: 20, hueRotate: 0, invert: 0, opacity: 100, saturate: 70, sepia: 10 } },
    { name: 'Warm', values: { blur: 0, brightness: 105, contrast: 100, grayscale: 0, hueRotate: 15, invert: 0, opacity: 100, saturate: 110, sepia: 20 } },
    { name: 'Cool', values: { blur: 0, brightness: 100, contrast: 100, grayscale: 0, hueRotate: 200, invert: 0, opacity: 100, saturate: 90, sepia: 0 } },
    { name: 'Dreamy', values: { blur: 2, brightness: 110, contrast: 85, grayscale: 0, hueRotate: 0, invert: 0, opacity: 100, saturate: 90, sepia: 15 } },
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const generateFilterCSS = (): string => {
    const filterParts: string[] = []

    if (filters.blur !== 0) filterParts.push(`blur(${filters.blur}px)`)
    if (filters.brightness !== 100) filterParts.push(`brightness(${filters.brightness}%)`)
    if (filters.contrast !== 100) filterParts.push(`contrast(${filters.contrast}%)`)
    if (filters.grayscale !== 0) filterParts.push(`grayscale(${filters.grayscale}%)`)
    if (filters.hueRotate !== 0) filterParts.push(`hue-rotate(${filters.hueRotate}deg)`)
    if (filters.invert !== 0) filterParts.push(`invert(${filters.invert}%)`)
    if (filters.opacity !== 100) filterParts.push(`opacity(${filters.opacity}%)`)
    if (filters.saturate !== 100) filterParts.push(`saturate(${filters.saturate}%)`)
    if (filters.sepia !== 0) filterParts.push(`sepia(${filters.sepia}%)`)

    return filterParts.length > 0 ? filterParts.join(' ') : 'none'
  }

  const filterCSS = generateFilterCSS()

  const updateFilter = (key: keyof FilterValues, value: number) => {
    setFilters({ ...filters, [key]: value })
  }

  const resetFilters = () => {
    setFilters({
      blur: 0,
      brightness: 100,
      contrast: 100,
      grayscale: 0,
      hueRotate: 0,
      invert: 0,
      opacity: 100,
      saturate: 100,
      sepia: 0,
    })
  }

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="block w-full mb-4"
        />

        <div className="flex gap-2 flex-wrap">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setFilters(preset.values)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-medium mb-2">{t('tools.filterPreview.original')}</h3>
          <div className="aspect-video bg-gray-100 rounded overflow-hidden">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Original"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                <span className="text-white">{t('tools.filterPreview.sampleImage')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-medium mb-2">{t('tools.filterPreview.filtered')}</h3>
          <div className="aspect-video bg-gray-100 rounded overflow-hidden">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Filtered"
                className="w-full h-full object-cover"
                style={{ filter: filterCSS }}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600"
                style={{ filter: filterCSS }}
              >
                <span className="text-white">{t('tools.filterPreview.sampleImage')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">{t('tools.filterPreview.filters')}</h3>
          <button
            onClick={resetFilters}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            {t('tools.filterPreview.reset')}
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filterConfig.map((config) => {
            const value = filters[config.key]
            const isModified = value !== config.default
            return (
              <div key={config.key}>
                <div className="flex justify-between items-center mb-1">
                  <label className={`text-sm capitalize ${isModified ? 'font-medium text-blue-600' : 'text-gray-600'}`}>
                    {config.key.replace(/([A-Z])/g, '-$1').toLowerCase()}
                  </label>
                  <span className="text-sm text-gray-500">
                    {value}{config.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={config.min}
                  max={config.max}
                  value={value}
                  onChange={(e) => updateFilter(config.key, parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">CSS Code</h3>
          <button
            onClick={() => navigator.clipboard.writeText(`filter: ${filterCSS};`)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('common.copy')}
          </button>
        </div>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
          {`filter: ${filterCSS};`}
        </pre>
      </div>

      <div className="card p-4 bg-blue-50">
        <h4 className="font-medium text-blue-800 mb-2">{t('tools.filterPreview.tips')}</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>Filters are applied in the order they appear in the CSS</li>
          <li>Blur values in pixels create a Gaussian blur effect</li>
          <li>Brightness and contrast at 100% are neutral (no change)</li>
          <li>Combine multiple filters for complex effects</li>
        </ul>
      </div>
    </div>
  )
}
