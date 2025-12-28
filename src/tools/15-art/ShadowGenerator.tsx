import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Shadow {
  x: number
  y: number
  blur: number
  spread: number
  color: string
  inset: boolean
}

export default function ShadowGenerator() {
  const { t } = useTranslation()
  const [shadows, setShadows] = useState<Shadow[]>([
    { x: 5, y: 5, blur: 15, spread: 0, color: '#00000040', inset: false }
  ])
  const [bgColor, setBgColor] = useState('#ffffff')
  const [boxColor, setBoxColor] = useState('#3B82F6')
  const [copied, setCopied] = useState(false)

  const getShadowCSS = (): string => {
    return shadows
      .map(s => `${s.inset ? 'inset ' : ''}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}`)
      .join(', ')
  }

  const updateShadow = (index: number, updates: Partial<Shadow>) => {
    setShadows(shadows.map((s, i) => i === index ? { ...s, ...updates } : s))
  }

  const addShadow = () => {
    if (shadows.length < 5) {
      setShadows([...shadows, { x: 0, y: 10, blur: 20, spread: 0, color: '#00000030', inset: false }])
    }
  }

  const removeShadow = (index: number) => {
    if (shadows.length > 1) {
      setShadows(shadows.filter((_, i) => i !== index))
    }
  }

  const copyCSS = () => {
    navigator.clipboard.writeText(`box-shadow: ${getShadowCSS()};`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const presets = [
    { name: 'Soft', shadows: [{ x: 0, y: 4, blur: 6, spread: -1, color: '#0000001a', inset: false }] },
    { name: 'Medium', shadows: [{ x: 0, y: 10, blur: 15, spread: -3, color: '#00000033', inset: false }] },
    { name: 'Hard', shadows: [{ x: 0, y: 25, blur: 50, spread: -12, color: '#00000040', inset: false }] },
    { name: 'Layered', shadows: [
      { x: 0, y: 1, blur: 3, spread: 0, color: '#0000001a', inset: false },
      { x: 0, y: 4, blur: 6, spread: -1, color: '#0000001a', inset: false },
      { x: 0, y: 10, blur: 15, spread: -3, color: '#0000001a', inset: false }
    ]},
    { name: 'Inset', shadows: [{ x: 0, y: 2, blur: 4, spread: 0, color: '#00000040', inset: true }] },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div
          className="w-full h-48 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <div
            className="w-32 h-32 rounded-lg"
            style={{
              backgroundColor: boxColor,
              boxShadow: getShadowCSS()
            }}
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.shadowGenerator.presets')}</h3>
        <div className="flex gap-2 flex-wrap">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setShadows(preset.shadows)}
              className="px-3 py-1 bg-slate-100 rounded hover:bg-slate-200 text-sm"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.shadowGenerator.shadows')}</h3>
          {shadows.length < 5 && (
            <button
              onClick={addShadow}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              + Add Layer
            </button>
          )}
        </div>

        <div className="space-y-4">
          {shadows.map((shadow, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Layer {i + 1}</span>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={shadow.inset}
                      onChange={(e) => updateShadow(i, { inset: e.target.checked })}
                    />
                    Inset
                  </label>
                  {shadows.length > 1 && (
                    <button
                      onClick={() => removeShadow(i)}
                      className="text-red-500 hover:text-red-600"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500">X: {shadow.x}px</label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={shadow.x}
                    onChange={(e) => updateShadow(i, { x: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Y: {shadow.y}px</label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={shadow.y}
                    onChange={(e) => updateShadow(i, { y: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Blur: {shadow.blur}px</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={shadow.blur}
                    onChange={(e) => updateShadow(i, { blur: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Spread: {shadow.spread}px</label>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    value={shadow.spread}
                    onChange={(e) => updateShadow(i, { spread: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="mt-2">
                <label className="text-xs text-slate-500">Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={shadow.color.slice(0, 7)}
                    onChange={(e) => updateShadow(i, { color: e.target.value + shadow.color.slice(7) })}
                    className="w-10 h-8 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={shadow.color}
                    onChange={(e) => updateShadow(i, { color: e.target.value })}
                    className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm font-mono"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.shadowGenerator.boxColors')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.shadowGenerator.boxColor')}</label>
            <input
              type="color"
              value={boxColor}
              onChange={(e) => setBoxColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.shadowGenerator.bgColor')}</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="card p-4 bg-slate-800 text-white font-mono text-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400">/* CSS */</span>
          <button
            onClick={copyCSS}
            className="px-2 py-1 bg-slate-700 rounded text-xs hover:bg-slate-600"
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
        <div>box-shadow: {getShadowCSS()};</div>
      </div>
    </div>
  )
}
