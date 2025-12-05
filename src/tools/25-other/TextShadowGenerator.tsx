import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface Shadow {
  id: string
  x: number
  y: number
  blur: number
  color: string
  opacity: number
}

export default function TextShadowGenerator() {
  const { t } = useTranslation()

  const [shadows, setShadows] = useState<Shadow[]>([
    { id: '1', x: 2, y: 2, blur: 4, color: '#000000', opacity: 30 }
  ])
  const [selectedId, setSelectedId] = useState<string>('1')
  const [text, setText] = useState('Shadow Text')
  const [fontSize, setFontSize] = useState(48)
  const [textColor, setTextColor] = useState('#1e293b')
  const [bgColor, setBgColor] = useState('#f1f5f9')
  const [copied, setCopied] = useState(false)

  const hexToRgba = (hex: string, opacity: number): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return `rgba(0,0,0,${opacity / 100})`
    return `rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)},${opacity / 100})`
  }

  const generateCSS = (): string => {
    if (shadows.length === 0) return 'none'
    return shadows.map(s =>
      `${s.x}px ${s.y}px ${s.blur}px ${hexToRgba(s.color, s.opacity)}`
    ).join(', ')
  }

  const textShadowCSS = generateCSS()

  const addShadow = () => {
    const newId = Date.now().toString()
    setShadows([...shadows, {
      id: newId,
      x: 2,
      y: 2,
      blur: 4,
      color: '#000000',
      opacity: 30
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
    await navigator.clipboard.writeText(`text-shadow: ${textShadowCSS};`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const presets = [
    { name: 'Subtle', shadows: [{ x: 1, y: 1, blur: 2, color: '#000000', opacity: 20 }] },
    { name: 'Drop', shadows: [{ x: 2, y: 2, blur: 4, color: '#000000', opacity: 30 }] },
    { name: 'Hard', shadows: [{ x: 3, y: 3, blur: 0, color: '#000000', opacity: 100 }] },
    { name: 'Glow', shadows: [{ x: 0, y: 0, blur: 10, color: '#3b82f6', opacity: 80 }] },
    { name: 'Neon', shadows: [{ x: 0, y: 0, blur: 5, color: '#ec4899', opacity: 100 }, { x: 0, y: 0, blur: 10, color: '#ec4899', opacity: 80 }, { x: 0, y: 0, blur: 20, color: '#ec4899', opacity: 60 }] },
    { name: 'Retro', shadows: [{ x: 4, y: 4, blur: 0, color: '#f59e0b', opacity: 100 }] },
    { name: '3D', shadows: [{ x: 1, y: 1, blur: 0, color: '#64748b', opacity: 100 }, { x: 2, y: 2, blur: 0, color: '#94a3b8', opacity: 100 }, { x: 3, y: 3, blur: 0, color: '#cbd5e1', opacity: 100 }] },
    { name: 'Outline', shadows: [{ x: -1, y: -1, blur: 0, color: '#000000', opacity: 100 }, { x: 1, y: -1, blur: 0, color: '#000000', opacity: 100 }, { x: -1, y: 1, blur: 0, color: '#000000', opacity: 100 }, { x: 1, y: 1, blur: 0, color: '#000000', opacity: 100 }] }
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
        <Button variant="secondary" onClick={addShadow}>{t('tools.textShadow.addShadow')}</Button>
        <div className="flex gap-1 flex-wrap">
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
          {copied ? t('common.copied') : t('tools.textShadow.copyCSS')}
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div
            className="h-48 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: bgColor }}
          >
            <span
              className="font-bold select-none"
              style={{
                fontSize: `${fontSize}px`,
                color: textColor,
                textShadow: textShadowCSS
              }}
            >
              {text}
            </span>
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t('tools.textShadow.textPlaceholder')}
                className="input w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">{t('tools.textShadow.fontSize')}</label>
              <input
                type="number"
                min="12"
                max="120"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value) || 48)}
                className="input w-16 text-center"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-800 rounded-lg">
            <code className="text-sm text-green-400 break-all">
              text-shadow: {textShadowCSS};
            </code>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">{t('tools.textShadow.textColor')}</label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-8 h-6 rounded cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">{t('tools.textShadow.bgColor')}</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-6 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4 max-h-[450px] overflow-auto">
          <h3 className="font-semibold text-slate-700">{t('tools.textShadow.shadows')}</h3>

          <div className="space-y-1">
            {shadows.map((shadow, index) => (
              <div
                key={shadow.id}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer ${selectedId === shadow.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'}`}
                onClick={() => setSelectedId(shadow.id)}
              >
                <div className="w-4 h-4 rounded" style={{ backgroundColor: shadow.color }} />
                <span className="text-xs flex-1">{t('tools.textShadow.layer')} {index + 1}</span>
                <span className="text-xs text-slate-400">{shadow.x},{shadow.y}</span>
              </div>
            ))}
          </div>

          {selectedShadow && (
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <h4 className="text-xs font-medium text-slate-500">{t('tools.textShadow.editShadow')}</h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">X ({selectedShadow.x}px)</label>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    value={selectedShadow.x}
                    onChange={(e) => updateShadow(selectedId, { x: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Y ({selectedShadow.y}px)</label>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    value={selectedShadow.y}
                    onChange={(e) => updateShadow(selectedId, { y: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.textShadow.blur')} ({selectedShadow.blur}px)</label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={selectedShadow.blur}
                  onChange={(e) => updateShadow(selectedId, { blur: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.textShadow.color')}</label>
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
                <label className="block text-xs text-slate-500 mb-1">{t('tools.textShadow.opacity')} ({selectedShadow.opacity}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedShadow.opacity}
                  onChange={(e) => updateShadow(selectedId, { opacity: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              {shadows.length > 1 && (
                <Button
                  variant="secondary"
                  className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => deleteShadow(selectedId)}
                >
                  {t('tools.textShadow.delete')}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
