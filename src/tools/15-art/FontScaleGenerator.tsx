import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const SCALE_RATIOS: Record<string, { name: string; ratio: number }> = {
  minorSecond: { name: 'Minor Second', ratio: 1.067 },
  majorSecond: { name: 'Major Second', ratio: 1.125 },
  minorThird: { name: 'Minor Third', ratio: 1.2 },
  majorThird: { name: 'Major Third', ratio: 1.25 },
  perfectFourth: { name: 'Perfect Fourth', ratio: 1.333 },
  augmentedFourth: { name: 'Augmented Fourth', ratio: 1.414 },
  perfectFifth: { name: 'Perfect Fifth', ratio: 1.5 },
  goldenRatio: { name: 'Golden Ratio', ratio: 1.618 },
}

export default function FontScaleGenerator() {
  const { t } = useTranslation()
  const [baseSize, setBaseSize] = useState(16)
  const [scaleRatio, setScaleRatio] = useState<keyof typeof SCALE_RATIOS>('majorThird')
  const [steps, setSteps] = useState(6)
  const [unit, setUnit] = useState<'px' | 'rem' | 'em'>('px')

  const generateScale = (): { size: number; name: string }[] => {
    const ratio = SCALE_RATIOS[scaleRatio].ratio
    const scale: { size: number; name: string }[] = []

    // Generate sizes below base
    for (let i = 2; i >= 1; i--) {
      const size = baseSize / Math.pow(ratio, i)
      scale.push({
        size: Math.round(size * 100) / 100,
        name: `xs${i === 2 ? '' : '2'}`
      })
    }

    // Base size
    scale.push({ size: baseSize, name: 'base' })

    // Generate sizes above base
    const sizeNames = ['lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl']
    for (let i = 1; i <= steps; i++) {
      const size = baseSize * Math.pow(ratio, i)
      scale.push({
        size: Math.round(size * 100) / 100,
        name: sizeNames[i - 1] || `${i}xl`
      })
    }

    return scale
  }

  const formatSize = (size: number): string => {
    if (unit === 'px') return `${Math.round(size)}px`
    if (unit === 'rem') return `${(size / 16).toFixed(3)}rem`
    if (unit === 'em') return `${(size / baseSize).toFixed(3)}em`
    return `${size}`
  }

  const scale = generateScale()

  const copyCSS = () => {
    const css = scale.map(s => `--font-${s.name}: ${formatSize(s.size)};`).join('\n')
    navigator.clipboard.writeText(`:root {\n${css}\n}`)
  }

  const copyTailwind = () => {
    const config = scale.reduce((acc, s) => {
      acc[s.name] = formatSize(s.size)
      return acc
    }, {} as Record<string, string>)
    navigator.clipboard.writeText(JSON.stringify({ fontSize: config }, null, 2))
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.fontScaleGenerator.baseSize')}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={baseSize}
                onChange={(e) => setBaseSize(parseInt(e.target.value) || 16)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'px' | 'rem' | 'em')}
                className="px-3 py-2 border border-slate-300 rounded"
              >
                <option value="px">px</option>
                <option value="rem">rem</option>
                <option value="em">em</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.fontScaleGenerator.steps')}
            </label>
            <input
              type="number"
              min={3}
              max={10}
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value) || 6)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-500 block mb-1">
            {t('tools.fontScaleGenerator.ratio')}
          </label>
          <select
            value={scaleRatio}
            onChange={(e) => setScaleRatio(e.target.value as keyof typeof SCALE_RATIOS)}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          >
            {Object.entries(SCALE_RATIOS).map(([key, value]) => (
              <option key={key} value={key}>
                {value.name} ({value.ratio})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Preview */}
      <div className="card p-4">
        <h3 className="font-medium mb-4">{t('tools.fontScaleGenerator.preview')}</h3>
        <div className="space-y-3">
          {scale.map((s, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-16 text-right text-sm text-slate-500 font-mono">
                {formatSize(s.size)}
              </div>
              <div
                className="flex-1 truncate"
                style={{ fontSize: `${s.size}px` }}
              >
                {s.name === 'base' ? (
                  <span className="font-medium">{t('tools.fontScaleGenerator.sampleText')}</span>
                ) : (
                  t('tools.fontScaleGenerator.sampleText')
                )}
              </div>
              <div className="text-sm text-slate-400">{s.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Output */}
      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">{t('tools.fontScaleGenerator.cssVariables')}</h3>
          <button
            onClick={copyCSS}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            {t('tools.fontScaleGenerator.copy')}
          </button>
        </div>
        <pre className="bg-slate-800 text-slate-100 p-4 rounded text-sm overflow-x-auto">
          <code>
{`:root {
${scale.map(s => `  --font-${s.name}: ${formatSize(s.size)};`).join('\n')}
}`}
          </code>
        </pre>
      </div>

      {/* Tailwind Config */}
      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">{t('tools.fontScaleGenerator.tailwindConfig')}</h3>
          <button
            onClick={copyTailwind}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            {t('tools.fontScaleGenerator.copy')}
          </button>
        </div>
        <pre className="bg-slate-800 text-slate-100 p-4 rounded text-sm overflow-x-auto">
          <code>
{`fontSize: {
${scale.map(s => `  '${s.name}': '${formatSize(s.size)}',`).join('\n')}
}`}
          </code>
        </pre>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.fontScaleGenerator.about')}</h4>
        <p className="text-sm text-slate-600">
          {t('tools.fontScaleGenerator.aboutText')}
        </p>
      </div>
    </div>
  )
}
