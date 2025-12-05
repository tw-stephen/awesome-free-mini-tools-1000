import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function BorderRadiusGenerator() {
  const { t } = useTranslation()

  const [linked, setLinked] = useState(true)
  const [topLeft, setTopLeft] = useState(16)
  const [topRight, setTopRight] = useState(16)
  const [bottomRight, setBottomRight] = useState(16)
  const [bottomLeft, setBottomLeft] = useState(16)
  const [unit, setUnit] = useState<'px' | '%'>('px')
  const [boxColor, setBoxColor] = useState('#3b82f6')
  const [bgColor, setBgColor] = useState('#f1f5f9')
  const [copied, setCopied] = useState(false)

  const updateRadius = (corner: string, value: number) => {
    if (linked) {
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

  const allSame = topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft

  const generateCSS = (): string => {
    if (allSame) {
      return `${topLeft}${unit}`
    }
    return `${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit}`
  }

  const borderRadiusCSS = generateCSS()

  const copyCSS = async () => {
    await navigator.clipboard.writeText(`border-radius: ${borderRadiusCSS};`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const presets = [
    { name: 'None', values: [0, 0, 0, 0] },
    { name: 'Small', values: [4, 4, 4, 4] },
    { name: 'Medium', values: [8, 8, 8, 8] },
    { name: 'Large', values: [16, 16, 16, 16] },
    { name: 'XL', values: [24, 24, 24, 24] },
    { name: 'Full', values: [9999, 9999, 9999, 9999] },
    { name: 'Leaf', values: [0, 24, 0, 24] },
    { name: 'Drop', values: [50, 50, 0, 50] },
    { name: 'Message', values: [16, 16, 16, 0] }
  ]

  const applyPreset = (values: number[]) => {
    setTopLeft(values[0])
    setTopRight(values[1])
    setBottomRight(values[2])
    setBottomLeft(values[3])
  }

  const maxValue = unit === 'px' ? 200 : 50

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={linked}
            onChange={(e) => setLinked(e.target.checked)}
            className="rounded"
          />
          {t('tools.borderRadius.linked')}
        </label>
        <div className="flex gap-1">
          {(['px', '%'] as const).map(u => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`px-2 py-1 text-xs rounded ${unit === u ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
            >
              {u}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <Button variant="secondary" onClick={copyCSS}>
          {copied ? t('common.copied') : t('tools.borderRadius.copyCSS')}
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {presets.map(preset => (
          <button
            key={preset.name}
            onClick={() => applyPreset(preset.values)}
            className="px-3 py-1.5 text-xs rounded-full border border-slate-200 hover:border-slate-300"
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div
            className="h-64 rounded-lg flex items-center justify-center relative"
            style={{ backgroundColor: bgColor }}
          >
            <div
              className="w-48 h-48"
              style={{
                backgroundColor: boxColor,
                borderRadius: borderRadiusCSS
              }}
            />

            {/* Corner labels */}
            <div className="absolute top-4 left-4 text-xs text-slate-500">
              {topLeft}{unit}
            </div>
            <div className="absolute top-4 right-4 text-xs text-slate-500">
              {topRight}{unit}
            </div>
            <div className="absolute bottom-4 right-4 text-xs text-slate-500">
              {bottomRight}{unit}
            </div>
            <div className="absolute bottom-4 left-4 text-xs text-slate-500">
              {bottomLeft}{unit}
            </div>
          </div>

          <div className="p-3 bg-slate-800 rounded-lg">
            <code className="text-sm text-green-400 break-all">
              border-radius: {borderRadiusCSS};
            </code>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">{t('tools.borderRadius.boxColor')}</label>
              <input
                type="color"
                value={boxColor}
                onChange={(e) => setBoxColor(e.target.value)}
                className="w-8 h-6 rounded cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">{t('tools.borderRadius.bgColor')}</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-6 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.borderRadius.corners')}</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.borderRadius.topLeft')} ({topLeft}{unit})
              </label>
              <input
                type="range"
                min="0"
                max={maxValue}
                value={topLeft}
                onChange={(e) => updateRadius('topLeft', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.borderRadius.topRight')} ({topRight}{unit})
              </label>
              <input
                type="range"
                min="0"
                max={maxValue}
                value={topRight}
                onChange={(e) => updateRadius('topRight', parseInt(e.target.value))}
                className="w-full"
                disabled={linked}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.borderRadius.bottomRight')} ({bottomRight}{unit})
              </label>
              <input
                type="range"
                min="0"
                max={maxValue}
                value={bottomRight}
                onChange={(e) => updateRadius('bottomRight', parseInt(e.target.value))}
                className="w-full"
                disabled={linked}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.borderRadius.bottomLeft')} ({bottomLeft}{unit})
              </label>
              <input
                type="range"
                min="0"
                max={maxValue}
                value={bottomLeft}
                onChange={(e) => updateRadius('bottomLeft', parseInt(e.target.value))}
                className="w-full"
                disabled={linked}
              />
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.borderRadius.quickInput')}</h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min="0"
                max={maxValue}
                value={topLeft}
                onChange={(e) => updateRadius('topLeft', parseInt(e.target.value) || 0)}
                className="input text-xs text-center"
                placeholder="TL"
              />
              <input
                type="number"
                min="0"
                max={maxValue}
                value={topRight}
                onChange={(e) => updateRadius('topRight', parseInt(e.target.value) || 0)}
                className="input text-xs text-center"
                placeholder="TR"
                disabled={linked}
              />
              <input
                type="number"
                min="0"
                max={maxValue}
                value={bottomLeft}
                onChange={(e) => updateRadius('bottomLeft', parseInt(e.target.value) || 0)}
                className="input text-xs text-center"
                placeholder="BL"
                disabled={linked}
              />
              <input
                type="number"
                min="0"
                max={maxValue}
                value={bottomRight}
                onChange={(e) => updateRadius('bottomRight', parseInt(e.target.value) || 0)}
                className="input text-xs text-center"
                placeholder="BR"
                disabled={linked}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
