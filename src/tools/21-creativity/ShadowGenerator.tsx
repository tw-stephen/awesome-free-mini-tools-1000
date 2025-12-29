import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Shadow {
  x: number
  y: number
  blur: number
  spread: number
  color: string
  opacity: number
  inset: boolean
}

export default function ShadowGenerator() {
  const { t } = useTranslation()
  const [shadows, setShadows] = useState<Shadow[]>([
    { x: 0, y: 4, blur: 6, spread: -1, color: '#000000', opacity: 10, inset: false },
    { x: 0, y: 2, blur: 4, spread: -2, color: '#000000', opacity: 10, inset: false },
  ])
  const [activeShadow, setActiveShadow] = useState(0)
  const [boxColor, setBoxColor] = useState('#ffffff')
  const [bgColor, setBgColor] = useState('#f1f5f9')
  const [borderRadius, setBorderRadius] = useState(8)

  const hexToRgba = (hex: string, opacity: number): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return `rgba(0, 0, 0, ${opacity / 100})`
    const r = parseInt(result[1], 16)
    const g = parseInt(result[2], 16)
    const b = parseInt(result[3], 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
  }

  const generateBoxShadow = (): string => {
    return shadows
      .map((s) => {
        const color = hexToRgba(s.color, s.opacity)
        return `${s.inset ? 'inset ' : ''}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${color}`
      })
      .join(', ')
  }

  const boxShadowCSS = generateBoxShadow()

  const updateShadow = (index: number, field: keyof Shadow, value: number | string | boolean) => {
    const newShadows = [...shadows]
    newShadows[index] = { ...newShadows[index], [field]: value }
    setShadows(newShadows)
  }

  const addShadow = () => {
    setShadows([
      ...shadows,
      { x: 0, y: 4, blur: 6, spread: 0, color: '#000000', opacity: 15, inset: false },
    ])
    setActiveShadow(shadows.length)
  }

  const removeShadow = (index: number) => {
    if (shadows.length <= 1) return
    setShadows(shadows.filter((_, i) => i !== index))
    if (activeShadow >= shadows.length - 1) {
      setActiveShadow(Math.max(0, shadows.length - 2))
    }
  }

  const presets = [
    {
      name: 'Subtle',
      shadows: [{ x: 0, y: 1, blur: 3, spread: 0, color: '#000000', opacity: 10, inset: false }],
    },
    {
      name: 'Medium',
      shadows: [
        { x: 0, y: 4, blur: 6, spread: -1, color: '#000000', opacity: 10, inset: false },
        { x: 0, y: 2, blur: 4, spread: -2, color: '#000000', opacity: 10, inset: false },
      ],
    },
    {
      name: 'Large',
      shadows: [
        { x: 0, y: 10, blur: 15, spread: -3, color: '#000000', opacity: 10, inset: false },
        { x: 0, y: 4, blur: 6, spread: -4, color: '#000000', opacity: 10, inset: false },
      ],
    },
    {
      name: 'Elevated',
      shadows: [
        { x: 0, y: 20, blur: 25, spread: -5, color: '#000000', opacity: 10, inset: false },
        { x: 0, y: 8, blur: 10, spread: -6, color: '#000000', opacity: 10, inset: false },
      ],
    },
    {
      name: 'Sharp',
      shadows: [{ x: 4, y: 4, blur: 0, spread: 0, color: '#000000', opacity: 100, inset: false }],
    },
    {
      name: 'Inset',
      shadows: [{ x: 0, y: 2, blur: 4, spread: 0, color: '#000000', opacity: 15, inset: true }],
    },
  ]

  const current = shadows[activeShadow]

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => {
              setShadows(preset.shadows)
              setActiveShadow(0)
            }}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div
        className="p-12 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <div
          className="w-48 h-48 flex items-center justify-center"
          style={{
            backgroundColor: boxColor,
            borderRadius,
            boxShadow: boxShadowCSS,
          }}
        >
          <span className="text-gray-500">{t('tools.shadowGenerator.preview')}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium">{t('tools.shadowGenerator.layers')}</label>
            <div className="flex gap-1 flex-1">
              {shadows.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveShadow(i)}
                  className={`w-8 h-8 rounded text-sm ${
                    activeShadow === i ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={addShadow}
                className="w-8 h-8 rounded bg-green-100 hover:bg-green-200 text-green-700"
              >
                +
              </button>
            </div>
            {shadows.length > 1 && (
              <button
                onClick={() => removeShadow(activeShadow)}
                className="w-8 h-8 rounded bg-red-100 hover:bg-red-200 text-red-700"
              >
                -
              </button>
            )}
          </div>

          {current && (
            <div className="card p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">X: {current.x}px</label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={current.x}
                    onChange={(e) => updateShadow(activeShadow, 'x', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Y: {current.y}px</label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={current.y}
                    onChange={(e) => updateShadow(activeShadow, 'y', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">{t('tools.shadowGenerator.blur')}: {current.blur}px</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={current.blur}
                    onChange={(e) => updateShadow(activeShadow, 'blur', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">{t('tools.shadowGenerator.spread')}: {current.spread}px</label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={current.spread}
                    onChange={(e) => updateShadow(activeShadow, 'spread', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">{t('tools.shadowGenerator.color')}</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={current.color}
                      onChange={(e) => updateShadow(activeShadow, 'color', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={current.color}
                      onChange={(e) => updateShadow(activeShadow, 'color', e.target.value)}
                      className="flex-1 px-2 py-1 border rounded font-mono text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">{t('tools.shadowGenerator.opacity')}: {current.opacity}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={current.opacity}
                    onChange={(e) => updateShadow(activeShadow, 'opacity', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={current.inset}
                  onChange={(e) => updateShadow(activeShadow, 'inset', e.target.checked)}
                />
                <span className="text-sm">{t('tools.shadowGenerator.inset')}</span>
              </label>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.shadowGenerator.boxSettings')}</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div>
                  <label className="text-sm text-gray-600">{t('tools.shadowGenerator.boxColor')}</label>
                  <input
                    type="color"
                    value={boxColor}
                    onChange={(e) => setBoxColor(e.target.value)}
                    className="block w-10 h-10 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">{t('tools.shadowGenerator.bgColor')}</label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="block w-10 h-10 rounded cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">{t('tools.shadowGenerator.borderRadius')}: {borderRadius}px</label>
                <input
                  type="range"
                  min="0"
                  max="48"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">CSS Code</h3>
          <button
            onClick={() => navigator.clipboard.writeText(`box-shadow: ${boxShadowCSS};`)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('common.copy')}
          </button>
        </div>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
          {`box-shadow: ${boxShadowCSS};`}
        </pre>
      </div>
    </div>
  )
}
