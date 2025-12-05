import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface Shadow {
  id: string
  x: number
  y: number
  blur: number
  spread: number
  color: string
  opacity: number
  inset: boolean
}

export default function BoxShadowGenerator() {
  const { t } = useTranslation()

  const [shadows, setShadows] = useState<Shadow[]>([
    { id: '1', x: 0, y: 4, blur: 6, spread: -1, color: '#000000', opacity: 10, inset: false },
    { id: '2', x: 0, y: 2, blur: 4, spread: -2, color: '#000000', opacity: 10, inset: false }
  ])
  const [selectedId, setSelectedId] = useState<string>('1')
  const [boxColor, setBoxColor] = useState('#ffffff')
  const [bgColor, setBgColor] = useState('#f1f5f9')
  const [copied, setCopied] = useState(false)

  const hexToRgba = (hex: string, opacity: number): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return `rgba(0,0,0,${opacity / 100})`
    return `rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)},${opacity / 100})`
  }

  const generateCSS = (): string => {
    if (shadows.length === 0) return 'none'
    return shadows.map(s => {
      const insetStr = s.inset ? 'inset ' : ''
      return `${insetStr}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${hexToRgba(s.color, s.opacity)}`
    }).join(', ')
  }

  const boxShadowCSS = generateCSS()

  const addShadow = () => {
    const newId = Date.now().toString()
    setShadows([...shadows, {
      id: newId,
      x: 0,
      y: 4,
      blur: 8,
      spread: 0,
      color: '#000000',
      opacity: 15,
      inset: false
    }])
    setSelectedId(newId)
  }

  const updateShadow = (id: string, updates: Partial<Shadow>) => {
    setShadows(shadows.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const deleteShadow = (id: string) => {
    if (shadows.length <= 1) return
    const newShadows = shadows.filter(s => s.id !== id)
    setShadows(newShadows)
    if (selectedId === id) {
      setSelectedId(newShadows[0]?.id || null)
    }
  }

  const copyCSS = async () => {
    await navigator.clipboard.writeText(`box-shadow: ${boxShadowCSS};`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const presets = [
    { name: 'Subtle', shadows: [{ x: 0, y: 1, blur: 3, spread: 0, color: '#000000', opacity: 10, inset: false }] },
    { name: 'Medium', shadows: [{ x: 0, y: 4, blur: 6, spread: -1, color: '#000000', opacity: 10, inset: false }, { x: 0, y: 2, blur: 4, spread: -2, color: '#000000', opacity: 10, inset: false }] },
    { name: 'Large', shadows: [{ x: 0, y: 10, blur: 15, spread: -3, color: '#000000', opacity: 10, inset: false }, { x: 0, y: 4, blur: 6, spread: -4, color: '#000000', opacity: 10, inset: false }] },
    { name: 'Sharp', shadows: [{ x: 4, y: 4, blur: 0, spread: 0, color: '#000000', opacity: 100, inset: false }] },
    { name: 'Glow', shadows: [{ x: 0, y: 0, blur: 20, spread: 0, color: '#3b82f6', opacity: 50, inset: false }] },
    { name: 'Inset', shadows: [{ x: 0, y: 2, blur: 4, spread: 0, color: '#000000', opacity: 20, inset: true }] }
  ]

  const applyPreset = (presetShadows: Omit<Shadow, 'id'>[]) => {
    const newShadows = presetShadows.map((s, i) => ({ ...s, id: Date.now().toString() + i }))
    setShadows(newShadows)
    setSelectedId(newShadows[0].id)
  }

  const selectedShadow = shadows.find(s => s.id === selectedId)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button variant="secondary" onClick={addShadow}>{t('tools.boxShadow.addShadow')}</Button>
        <div className="flex gap-1">
          {presets.map(preset => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset.shadows)}
              className="px-2 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              {preset.name}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <Button variant="secondary" onClick={copyCSS}>
          {copied ? t('common.copied') : t('tools.boxShadow.copyCSS')}
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div
            className="h-64 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: bgColor }}
          >
            <div
              className="w-48 h-32 rounded-lg"
              style={{
                backgroundColor: boxColor,
                boxShadow: boxShadowCSS
              }}
            />
          </div>

          <div className="p-3 bg-slate-800 rounded-lg">
            <code className="text-sm text-green-400 break-all">
              box-shadow: {boxShadowCSS};
            </code>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">{t('tools.boxShadow.boxColor')}</label>
              <input
                type="color"
                value={boxColor}
                onChange={(e) => setBoxColor(e.target.value)}
                className="w-8 h-6 rounded cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">{t('tools.boxShadow.bgColor')}</label>
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
          <h3 className="font-semibold text-slate-700">{t('tools.boxShadow.shadows')}</h3>

          <div className="space-y-1">
            {shadows.map((shadow, index) => (
              <div
                key={shadow.id}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer ${selectedId === shadow.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'}`}
                onClick={() => setSelectedId(shadow.id)}
              >
                <div className="w-6 h-6 rounded border border-slate-200" style={{
                  boxShadow: `${shadow.inset ? 'inset ' : ''}${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${hexToRgba(shadow.color, shadow.opacity)}`
                }} />
                <span className="text-xs flex-1">{t('tools.boxShadow.layer')} {index + 1}</span>
                {shadow.inset && <span className="text-xs text-slate-400">inset</span>}
              </div>
            ))}
          </div>

          {selectedShadow && (
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <h4 className="text-xs font-medium text-slate-500">{t('tools.boxShadow.editShadow')}</h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">X ({selectedShadow.x}px)</label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={selectedShadow.x}
                    onChange={(e) => updateShadow(selectedId, { x: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Y ({selectedShadow.y}px)</label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={selectedShadow.y}
                    onChange={(e) => updateShadow(selectedId, { y: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">{t('tools.boxShadow.blur')} ({selectedShadow.blur}px)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedShadow.blur}
                    onChange={(e) => updateShadow(selectedId, { blur: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">{t('tools.boxShadow.spread')} ({selectedShadow.spread}px)</label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={selectedShadow.spread}
                    onChange={(e) => updateShadow(selectedId, { spread: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.boxShadow.color')}</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={selectedShadow.color}
                    onChange={(e) => updateShadow(selectedId, { color: e.target.value })}
                    className="w-10 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={selectedShadow.color}
                    onChange={(e) => updateShadow(selectedId, { color: e.target.value })}
                    className="input flex-1 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.boxShadow.opacity')} ({selectedShadow.opacity}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedShadow.opacity}
                  onChange={(e) => updateShadow(selectedId, { opacity: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedShadow.inset}
                  onChange={(e) => updateShadow(selectedId, { inset: e.target.checked })}
                  className="rounded"
                />
                {t('tools.boxShadow.inset')}
              </label>

              {shadows.length > 1 && (
                <Button
                  variant="secondary"
                  className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => deleteShadow(selectedId)}
                >
                  {t('tools.boxShadow.delete')}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
