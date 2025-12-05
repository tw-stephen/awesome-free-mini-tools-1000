import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

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

const defaultFilters: FilterValues = {
  blur: 0,
  brightness: 100,
  contrast: 100,
  grayscale: 0,
  hueRotate: 0,
  invert: 0,
  opacity: 100,
  saturate: 100,
  sepia: 0
}

export default function CSSFilterGenerator() {
  const { t } = useTranslation()

  const [filters, setFilters] = useState<FilterValues>(defaultFilters)
  const [copied, setCopied] = useState(false)

  const generateCSS = (): string => {
    const parts: string[] = []

    if (filters.blur !== 0) parts.push(`blur(${filters.blur}px)`)
    if (filters.brightness !== 100) parts.push(`brightness(${filters.brightness}%)`)
    if (filters.contrast !== 100) parts.push(`contrast(${filters.contrast}%)`)
    if (filters.grayscale !== 0) parts.push(`grayscale(${filters.grayscale}%)`)
    if (filters.hueRotate !== 0) parts.push(`hue-rotate(${filters.hueRotate}deg)`)
    if (filters.invert !== 0) parts.push(`invert(${filters.invert}%)`)
    if (filters.opacity !== 100) parts.push(`opacity(${filters.opacity}%)`)
    if (filters.saturate !== 100) parts.push(`saturate(${filters.saturate}%)`)
    if (filters.sepia !== 0) parts.push(`sepia(${filters.sepia}%)`)

    return parts.length > 0 ? parts.join(' ') : 'none'
  }

  const filterCSS = generateCSS()

  const updateFilter = (key: keyof FilterValues, value: number) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
  }

  const copyCSS = async () => {
    await navigator.clipboard.writeText(`filter: ${filterCSS};`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const presets = [
    { name: 'None', values: defaultFilters },
    { name: 'Vintage', values: { ...defaultFilters, sepia: 50, contrast: 110, brightness: 90 } },
    { name: 'Grayscale', values: { ...defaultFilters, grayscale: 100 } },
    { name: 'High Contrast', values: { ...defaultFilters, contrast: 150, brightness: 110 } },
    { name: 'Warm', values: { ...defaultFilters, sepia: 20, saturate: 130 } },
    { name: 'Cool', values: { ...defaultFilters, hueRotate: 180, saturate: 80 } },
    { name: 'Faded', values: { ...defaultFilters, contrast: 80, brightness: 110, saturate: 80 } },
    { name: 'Invert', values: { ...defaultFilters, invert: 100 } }
  ]

  const filterControls: { key: keyof FilterValues; min: number; max: number; unit: string; default: number }[] = [
    { key: 'blur', min: 0, max: 20, unit: 'px', default: 0 },
    { key: 'brightness', min: 0, max: 200, unit: '%', default: 100 },
    { key: 'contrast', min: 0, max: 200, unit: '%', default: 100 },
    { key: 'grayscale', min: 0, max: 100, unit: '%', default: 0 },
    { key: 'hueRotate', min: 0, max: 360, unit: 'deg', default: 0 },
    { key: 'invert', min: 0, max: 100, unit: '%', default: 0 },
    { key: 'opacity', min: 0, max: 100, unit: '%', default: 100 },
    { key: 'saturate', min: 0, max: 200, unit: '%', default: 100 },
    { key: 'sepia', min: 0, max: 100, unit: '%', default: 0 }
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button variant="secondary" onClick={resetFilters}>{t('tools.cssFilter.reset')}</Button>
        <div className="flex gap-1 flex-wrap">
          {presets.map(preset => (
            <button
              key={preset.name}
              onClick={() => setFilters(preset.values)}
              className="px-2 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              {preset.name}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <Button variant="secondary" onClick={copyCSS}>
          {copied ? t('common.copied') : t('tools.cssFilter.copyCSS')}
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-slate-100 rounded-lg p-8 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Cdefs%3E%3ClinearGradient id='g1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ff6b6b'/%3E%3Cstop offset='50%25' style='stop-color:%234ecdc4'/%3E%3Cstop offset='100%25' style='stop-color:%23ffe66d'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='150' height='150' fill='url(%23g1)'/%3E%3Ccircle cx='40' cy='40' r='20' fill='%23fff' opacity='0.8'/%3E%3Ccircle cx='110' cy='110' r='25' fill='%23333' opacity='0.6'/%3E%3Crect x='60' y='50' width='50' height='50' fill='%23fff' opacity='0.5'/%3E%3C/svg%3E"
                alt="Sample"
                className="w-36 h-36 rounded-lg shadow-lg"
                style={{ filter: filterCSS }}
              />
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%2334495e'/%3E%3Ccircle cx='75' cy='60' r='30' fill='%23e74c3c'/%3E%3Crect x='30' y='100' width='90' height='30' rx='5' fill='%233498db'/%3E%3Cpolygon points='75,20 90,45 60,45' fill='%23f1c40f'/%3E%3C/svg%3E"
                alt="Sample 2"
                className="w-36 h-36 rounded-lg shadow-lg"
                style={{ filter: filterCSS }}
              />
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%232ecc71'/%3E%3Ccircle cx='75' cy='75' r='50' fill='%23fff' opacity='0.3'/%3E%3Ccircle cx='75' cy='75' r='30' fill='%23fff' opacity='0.5'/%3E%3Ccircle cx='75' cy='75' r='15' fill='%23fff'/%3E%3C/svg%3E"
                alt="Sample 3"
                className="w-36 h-36 rounded-lg shadow-lg"
                style={{ filter: filterCSS }}
              />
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Cdefs%3E%3ClinearGradient id='g2' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%239b59b6'/%3E%3Cstop offset='100%25' style='stop-color:%233498db'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='150' height='150' fill='url(%23g2)'/%3E%3Cpath d='M0 100 Q75 50 150 100 L150 150 L0 150 Z' fill='%23fff' opacity='0.2'/%3E%3Cpath d='M0 120 Q75 80 150 120 L150 150 L0 150 Z' fill='%23fff' opacity='0.3'/%3E%3C/svg%3E"
                alt="Sample 4"
                className="w-36 h-36 rounded-lg shadow-lg"
                style={{ filter: filterCSS }}
              />
            </div>
          </div>

          <div className="p-3 bg-slate-800 rounded-lg">
            <code className="text-sm text-green-400 break-all">
              filter: {filterCSS};
            </code>
          </div>
        </div>

        <div className="w-72 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-3 max-h-[500px] overflow-auto">
          <h3 className="font-semibold text-slate-700">{t('tools.cssFilter.filters')}</h3>

          {filterControls.map(control => (
            <div key={control.key}>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-slate-500">
                  {t(`tools.cssFilter.${control.key}`)}
                </label>
                <span className="text-xs text-slate-400">
                  {filters[control.key]}{control.unit}
                </span>
              </div>
              <input
                type="range"
                min={control.min}
                max={control.max}
                value={filters[control.key]}
                onChange={(e) => updateFilter(control.key, parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
