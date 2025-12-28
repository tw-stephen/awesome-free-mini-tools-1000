import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

interface Shadow {
  offsetX: number
  offsetY: number
  blur: number
  spread: number
  color: string
  inset: boolean
}

export default function BoxShadowGenerator() {
  const { t } = useTranslation()
  const [shadows, setShadows] = useState<Shadow[]>([
    { offsetX: 0, offsetY: 4, blur: 6, spread: -1, color: 'rgba(0, 0, 0, 0.1)', inset: false },
    { offsetX: 0, offsetY: 2, blur: 4, spread: -2, color: 'rgba(0, 0, 0, 0.1)', inset: false }
  ])
  const [bgColor, setBgColor] = useState('#ffffff')
  const { copy, copied } = useClipboard()

  const shadowCss = useMemo(() => {
    return shadows
      .map(s => `${s.inset ? 'inset ' : ''}${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${s.color}`)
      .join(', ')
  }, [shadows])

  const addShadow = () => {
    if (shadows.length >= 5) return
    setShadows([...shadows, { offsetX: 0, offsetY: 4, blur: 8, spread: 0, color: 'rgba(0, 0, 0, 0.15)', inset: false }])
  }

  const removeShadow = (index: number) => {
    if (shadows.length <= 1) return
    setShadows(shadows.filter((_, i) => i !== index))
  }

  const updateShadow = (index: number, field: keyof Shadow, value: number | string | boolean) => {
    setShadows(shadows.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  const presets = [
    {
      name: t('tools.boxShadowGenerator.presetSubtle'),
      shadows: [{ offsetX: 0, offsetY: 1, blur: 3, spread: 0, color: 'rgba(0, 0, 0, 0.1)', inset: false }]
    },
    {
      name: t('tools.boxShadowGenerator.presetMedium'),
      shadows: [
        { offsetX: 0, offsetY: 4, blur: 6, spread: -1, color: 'rgba(0, 0, 0, 0.1)', inset: false },
        { offsetX: 0, offsetY: 2, blur: 4, spread: -2, color: 'rgba(0, 0, 0, 0.1)', inset: false }
      ]
    },
    {
      name: t('tools.boxShadowGenerator.presetLarge'),
      shadows: [
        { offsetX: 0, offsetY: 10, blur: 15, spread: -3, color: 'rgba(0, 0, 0, 0.1)', inset: false },
        { offsetX: 0, offsetY: 4, blur: 6, spread: -4, color: 'rgba(0, 0, 0, 0.1)', inset: false }
      ]
    },
    {
      name: t('tools.boxShadowGenerator.presetInset'),
      shadows: [{ offsetX: 0, offsetY: 2, blur: 4, spread: 0, color: 'rgba(0, 0, 0, 0.06)', inset: true }]
    },
    {
      name: t('tools.boxShadowGenerator.presetColored'),
      shadows: [{ offsetX: 0, offsetY: 4, blur: 14, spread: 0, color: 'rgba(59, 130, 246, 0.5)', inset: false }]
    },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-8 flex justify-center items-center bg-slate-100">
        <div
          className="w-48 h-32 rounded-lg flex items-center justify-center text-slate-600"
          style={{
            backgroundColor: bgColor,
            boxShadow: shadowCss
          }}
        >
          {t('tools.boxShadowGenerator.preview')}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.boxShadowGenerator.shadows')} ({shadows.length})
          </h3>
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">{t('tools.boxShadowGenerator.bgColor')}:</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
            </div>
            <Button
              variant="secondary"
              onClick={addShadow}
              disabled={shadows.length >= 5}
            >
              {t('tools.boxShadowGenerator.addShadow')}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {shadows.map((shadow, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-600">
                  {t('tools.boxShadowGenerator.shadow')} {i + 1}
                </span>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={shadow.inset}
                      onChange={(e) => updateShadow(i, 'inset', e.target.checked)}
                    />
                    {t('tools.boxShadowGenerator.inset')}
                  </label>
                  <button
                    onClick={() => removeShadow(i)}
                    disabled={shadows.length <= 1}
                    className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    {t('tools.boxShadowGenerator.offsetX')}
                  </label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={shadow.offsetX}
                    onChange={(e) => updateShadow(i, 'offsetX', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-slate-600">{shadow.offsetX}px</span>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    {t('tools.boxShadowGenerator.offsetY')}
                  </label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={shadow.offsetY}
                    onChange={(e) => updateShadow(i, 'offsetY', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-slate-600">{shadow.offsetY}px</span>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    {t('tools.boxShadowGenerator.blur')}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={shadow.blur}
                    onChange={(e) => updateShadow(i, 'blur', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-slate-600">{shadow.blur}px</span>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    {t('tools.boxShadowGenerator.spread')}
                  </label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={shadow.spread}
                    onChange={(e) => updateShadow(i, 'spread', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-slate-600">{shadow.spread}px</span>
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.boxShadowGenerator.color')}
                </label>
                <input
                  type="text"
                  value={shadow.color}
                  onChange={(e) => updateShadow(i, 'color', e.target.value)}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm font-mono"
                  placeholder="rgba(0, 0, 0, 0.1)"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.boxShadowGenerator.presets')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.name}
              variant="secondary"
              onClick={() => setShadows(preset.shadows)}
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.boxShadowGenerator.cssCode')}
          </h3>
          <Button variant="secondary" onClick={() => copy(`box-shadow: ${shadowCss};`)}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>

        <pre className="p-3 bg-slate-50 rounded-lg overflow-x-auto">
          <code className="font-mono text-sm text-slate-800">
            box-shadow: {shadowCss};
          </code>
        </pre>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.boxShadowGenerator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.boxShadowGenerator.tip1')}</li>
          <li>{t('tools.boxShadowGenerator.tip2')}</li>
          <li>{t('tools.boxShadowGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
