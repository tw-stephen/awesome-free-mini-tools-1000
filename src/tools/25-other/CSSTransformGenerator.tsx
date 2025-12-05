import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface TransformValues {
  translateX: number
  translateY: number
  rotate: number
  scaleX: number
  scaleY: number
  skewX: number
  skewY: number
}

const defaultTransform: TransformValues = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  scaleX: 1,
  scaleY: 1,
  skewX: 0,
  skewY: 0
}

export default function CSSTransformGenerator() {
  const { t } = useTranslation()

  const [transform, setTransform] = useState<TransformValues>(defaultTransform)
  const [originX, setOriginX] = useState(50)
  const [originY, setOriginY] = useState(50)
  const [boxColor, setBoxColor] = useState('#3b82f6')
  const [bgColor, setBgColor] = useState('#f1f5f9')
  const [copied, setCopied] = useState(false)

  const generateTransformCSS = (): string => {
    const parts: string[] = []

    if (transform.translateX !== 0 || transform.translateY !== 0) {
      parts.push(`translate(${transform.translateX}px, ${transform.translateY}px)`)
    }
    if (transform.rotate !== 0) {
      parts.push(`rotate(${transform.rotate}deg)`)
    }
    if (transform.scaleX !== 1 || transform.scaleY !== 1) {
      if (transform.scaleX === transform.scaleY) {
        parts.push(`scale(${transform.scaleX})`)
      } else {
        parts.push(`scale(${transform.scaleX}, ${transform.scaleY})`)
      }
    }
    if (transform.skewX !== 0 || transform.skewY !== 0) {
      parts.push(`skew(${transform.skewX}deg, ${transform.skewY}deg)`)
    }

    return parts.length > 0 ? parts.join(' ') : 'none'
  }

  const transformCSS = generateTransformCSS()
  const originCSS = `${originX}% ${originY}%`

  const updateTransform = (key: keyof TransformValues, value: number) => {
    setTransform(prev => ({ ...prev, [key]: value }))
  }

  const resetTransform = () => {
    setTransform(defaultTransform)
    setOriginX(50)
    setOriginY(50)
  }

  const copyCSS = async () => {
    const css = `transform: ${transformCSS};\ntransform-origin: ${originCSS};`
    await navigator.clipboard.writeText(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const presets = [
    { name: 'None', values: defaultTransform, ox: 50, oy: 50 },
    { name: 'Flip H', values: { ...defaultTransform, scaleX: -1 }, ox: 50, oy: 50 },
    { name: 'Flip V', values: { ...defaultTransform, scaleY: -1 }, ox: 50, oy: 50 },
    { name: 'Rotate 45°', values: { ...defaultTransform, rotate: 45 }, ox: 50, oy: 50 },
    { name: 'Rotate 90°', values: { ...defaultTransform, rotate: 90 }, ox: 50, oy: 50 },
    { name: 'Scale Up', values: { ...defaultTransform, scaleX: 1.2, scaleY: 1.2 }, ox: 50, oy: 50 },
    { name: 'Skew', values: { ...defaultTransform, skewX: 10, skewY: 5 }, ox: 50, oy: 50 },
    { name: 'Tilt', values: { ...defaultTransform, rotate: -5, skewX: 10 }, ox: 0, oy: 100 }
  ]

  const applyPreset = (values: TransformValues, ox: number, oy: number) => {
    setTransform(values)
    setOriginX(ox)
    setOriginY(oy)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button variant="secondary" onClick={resetTransform}>{t('tools.cssTransform.reset')}</Button>
        <div className="flex gap-1 flex-wrap">
          {presets.map(preset => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset.values, preset.ox, preset.oy)}
              className="px-2 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              {preset.name}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <Button variant="secondary" onClick={copyCSS}>
          {copied ? t('common.copied') : t('tools.cssTransform.copyCSS')}
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div
            className="h-72 rounded-lg flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: bgColor }}
          >
            {/* Ghost element showing original position */}
            <div
              className="absolute w-32 h-32 rounded-lg border-2 border-dashed border-slate-300 opacity-50"
            />
            {/* Transformed element */}
            <div
              className="w-32 h-32 rounded-lg flex items-center justify-center text-white font-semibold"
              style={{
                backgroundColor: boxColor,
                transform: transformCSS,
                transformOrigin: originCSS
              }}
            >
              <span className="text-2xl">A</span>
            </div>
          </div>

          <div className="p-3 bg-slate-800 rounded-lg space-y-1">
            <code className="text-sm text-green-400 block">
              transform: {transformCSS};
            </code>
            <code className="text-sm text-green-400 block">
              transform-origin: {originCSS};
            </code>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">{t('tools.cssTransform.boxColor')}</label>
              <input
                type="color"
                value={boxColor}
                onChange={(e) => setBoxColor(e.target.value)}
                className="w-8 h-6 rounded cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">{t('tools.cssTransform.bgColor')}</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-6 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="w-72 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4 max-h-[500px] overflow-auto">
          <h3 className="font-semibold text-slate-700">{t('tools.cssTransform.transform')}</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.cssTransform.translateX')} ({transform.translateX}px)
              </label>
              <input
                type="range"
                min="-100"
                max="100"
                value={transform.translateX}
                onChange={(e) => updateTransform('translateX', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.cssTransform.translateY')} ({transform.translateY}px)
              </label>
              <input
                type="range"
                min="-100"
                max="100"
                value={transform.translateY}
                onChange={(e) => updateTransform('translateY', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.cssTransform.rotate')} ({transform.rotate}°)
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                value={transform.rotate}
                onChange={(e) => updateTransform('rotate', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.cssTransform.scaleX')} ({transform.scaleX})
                </label>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={transform.scaleX}
                  onChange={(e) => updateTransform('scaleX', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.cssTransform.scaleY')} ({transform.scaleY})
                </label>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={transform.scaleY}
                  onChange={(e) => updateTransform('scaleY', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.cssTransform.skewX')} ({transform.skewX}°)
                </label>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  value={transform.skewX}
                  onChange={(e) => updateTransform('skewX', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.cssTransform.skewY')} ({transform.skewY}°)
                </label>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  value={transform.skewY}
                  onChange={(e) => updateTransform('skewY', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 mb-3">{t('tools.cssTransform.origin')}</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-slate-500 mb-1">X ({originX}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={originX}
                  onChange={(e) => setOriginX(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Y ({originY}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={originY}
                  onChange={(e) => setOriginY(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
