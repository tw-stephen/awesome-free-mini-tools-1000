import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function BorderRadiusGenerator() {
  const { t } = useTranslation()
  const [topLeft, setTopLeft] = useState(16)
  const [topRight, setTopRight] = useState(16)
  const [bottomRight, setBottomRight] = useState(16)
  const [bottomLeft, setBottomLeft] = useState(16)
  const [linkCorners, setLinkCorners] = useState(true)
  const [bgColor, setBgColor] = useState('#3b82f6')
  const { copy, copied } = useClipboard()

  const borderRadiusCss = useMemo(() => {
    if (topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft) {
      return `${topLeft}px`
    }
    if (topLeft === bottomRight && topRight === bottomLeft) {
      return `${topLeft}px ${topRight}px`
    }
    return `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`
  }, [topLeft, topRight, bottomRight, bottomLeft])

  const updateCorner = (corner: 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft', value: number) => {
    if (linkCorners) {
      setTopLeft(value)
      setTopRight(value)
      setBottomRight(value)
      setBottomLeft(value)
    } else {
      switch (corner) {
        case 'topLeft': setTopLeft(value); break
        case 'topRight': setTopRight(value); break
        case 'bottomRight': setBottomRight(value); break
        case 'bottomLeft': setBottomLeft(value); break
      }
    }
  }

  const presets = [
    { name: t('tools.borderRadiusGenerator.presetNone'), values: [0, 0, 0, 0] },
    { name: t('tools.borderRadiusGenerator.presetSmall'), values: [4, 4, 4, 4] },
    { name: t('tools.borderRadiusGenerator.presetMedium'), values: [8, 8, 8, 8] },
    { name: t('tools.borderRadiusGenerator.presetLarge'), values: [16, 16, 16, 16] },
    { name: t('tools.borderRadiusGenerator.presetXl'), values: [24, 24, 24, 24] },
    { name: t('tools.borderRadiusGenerator.presetFull'), values: [9999, 9999, 9999, 9999] },
    { name: t('tools.borderRadiusGenerator.presetPill'), values: [9999, 9999, 9999, 9999] },
    { name: t('tools.borderRadiusGenerator.presetTop'), values: [16, 16, 0, 0] },
    { name: t('tools.borderRadiusGenerator.presetBottom'), values: [0, 0, 16, 16] },
    { name: t('tools.borderRadiusGenerator.presetLeft'), values: [16, 0, 0, 16] },
    { name: t('tools.borderRadiusGenerator.presetRight'), values: [0, 16, 16, 0] },
    { name: t('tools.borderRadiusGenerator.presetBlob'), values: [30, 70, 70, 30] },
  ]

  const applyPreset = (values: number[]) => {
    setLinkCorners(false)
    setTopLeft(values[0])
    setTopRight(values[1])
    setBottomRight(values[2])
    setBottomLeft(values[3])
  }

  return (
    <div className="space-y-4">
      <div className="card p-8 flex justify-center items-center bg-slate-100">
        <div
          className="w-48 h-32 flex items-center justify-center text-white font-medium"
          style={{
            backgroundColor: bgColor,
            borderRadius: borderRadiusCss
          }}
        >
          {t('tools.borderRadiusGenerator.preview')}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.borderRadiusGenerator.corners')}
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">{t('tools.borderRadiusGenerator.bgColor')}:</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={linkCorners}
                onChange={(e) => setLinkCorners(e.target.checked)}
              />
              {t('tools.borderRadiusGenerator.linkCorners')}
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.borderRadiusGenerator.topLeft')}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={topLeft}
              onChange={(e) => updateCorner('topLeft', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-600">
              <span>{topLeft}px</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.borderRadiusGenerator.topRight')}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={topRight}
              onChange={(e) => updateCorner('topRight', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-600">
              <span>{topRight}px</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.borderRadiusGenerator.bottomLeft')}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={bottomLeft}
              onChange={(e) => updateCorner('bottomLeft', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-600">
              <span>{bottomLeft}px</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.borderRadiusGenerator.bottomRight')}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={bottomRight}
              onChange={(e) => updateCorner('bottomRight', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-600">
              <span>{bottomRight}px</span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2">
              <div className="w-8 h-8 bg-blue-200 rounded-tl-lg mx-auto" />
              <p className="text-xs text-slate-500 mt-1">{topLeft}px</p>
            </div>
            <div className="p-2">
              <div className="w-8 h-8 bg-blue-200 rounded-tr-lg mx-auto" />
              <p className="text-xs text-slate-500 mt-1">{topRight}px</p>
            </div>
            <div className="p-2">
              <div className="w-8 h-8 bg-blue-200 rounded-bl-lg mx-auto" />
              <p className="text-xs text-slate-500 mt-1">{bottomLeft}px</p>
            </div>
            <div className="p-2">
              <div className="w-8 h-8 bg-blue-200 rounded-br-lg mx-auto" />
              <p className="text-xs text-slate-500 mt-1">{bottomRight}px</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.borderRadiusGenerator.presets')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.name}
              variant="secondary"
              onClick={() => applyPreset(preset.values)}
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.borderRadiusGenerator.cssCode')}
          </h3>
          <Button variant="secondary" onClick={() => copy(`border-radius: ${borderRadiusCss};`)}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>

        <pre className="p-3 bg-slate-50 rounded-lg overflow-x-auto">
          <code className="font-mono text-sm text-slate-800">
            border-radius: {borderRadiusCss};
          </code>
        </pre>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.borderRadiusGenerator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.borderRadiusGenerator.tip1')}</li>
          <li>{t('tools.borderRadiusGenerator.tip2')}</li>
          <li>{t('tools.borderRadiusGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
