import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function LineHeightCalculator() {
  const { t } = useTranslation()
  const [fontSize, setFontSize] = useState(16)
  const [lineHeight, setLineHeight] = useState(1.5)
  const [unit, setUnit] = useState<'ratio' | 'px' | 'em'>('ratio')
  const [textType, setTextType] = useState<'body' | 'heading' | 'ui'>('body')

  const recommendations = {
    body: { min: 1.4, ideal: 1.6, max: 1.8 },
    heading: { min: 1.1, ideal: 1.3, max: 1.5 },
    ui: { min: 1.2, ideal: 1.4, max: 1.6 }
  }

  const calculateLineHeight = (): number => {
    if (unit === 'ratio') return lineHeight
    if (unit === 'px') return lineHeight / fontSize
    if (unit === 'em') return lineHeight
    return lineHeight
  }

  const getLineHeightInUnit = (value: number, targetUnit: string): string => {
    switch (targetUnit) {
      case 'ratio': return value.toFixed(2)
      case 'px': return `${Math.round(fontSize * value)}px`
      case 'em': return `${value.toFixed(2)}em`
      case '%': return `${Math.round(value * 100)}%`
      default: return value.toFixed(2)
    }
  }

  const currentLineHeight = calculateLineHeight()
  const rec = recommendations[textType]

  const getLineHeightQuality = (): { label: string; color: string } => {
    if (currentLineHeight < rec.min) {
      return { label: t('tools.lineHeightCalculator.tooTight'), color: 'text-red-500' }
    }
    if (currentLineHeight > rec.max) {
      return { label: t('tools.lineHeightCalculator.tooLoose'), color: 'text-yellow-500' }
    }
    if (currentLineHeight >= rec.ideal - 0.1 && currentLineHeight <= rec.ideal + 0.1) {
      return { label: t('tools.lineHeightCalculator.optimal'), color: 'text-green-500' }
    }
    return { label: t('tools.lineHeightCalculator.acceptable'), color: 'text-blue-500' }
  }

  const quality = getLineHeightQuality()
  const sampleText = "The quick brown fox jumps over the lazy dog. Typography is the art and technique of arranging type to make written language legible, readable and appealing when displayed."

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.lineHeightCalculator.fontSize')} (px)
            </label>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value) || 16)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.lineHeightCalculator.lineHeight')}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step={unit === 'px' ? 1 : 0.1}
                value={lineHeight}
                onChange={(e) => setLineHeight(parseFloat(e.target.value) || 1.5)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
              />
              <select
                value={unit}
                onChange={(e) => {
                  const newUnit = e.target.value as 'ratio' | 'px' | 'em'
                  if (newUnit === 'px' && unit !== 'px') {
                    setLineHeight(Math.round(fontSize * lineHeight))
                  } else if (newUnit !== 'px' && unit === 'px') {
                    setLineHeight(parseFloat((lineHeight / fontSize).toFixed(2)))
                  }
                  setUnit(newUnit)
                }}
                className="px-3 py-2 border border-slate-300 rounded"
              >
                <option value="ratio">{t('tools.lineHeightCalculator.ratio')}</option>
                <option value="px">px</option>
                <option value="em">em</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-500 block mb-1">
            {t('tools.lineHeightCalculator.textType')}
          </label>
          <div className="flex gap-2">
            {(['body', 'heading', 'ui'] as const).map(type => (
              <button
                key={type}
                onClick={() => setTextType(type)}
                className={`flex-1 py-2 rounded capitalize ${
                  textType === type ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {t(`tools.lineHeightCalculator.${type}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Line height visualization */}
      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">{t('tools.lineHeightCalculator.analysis')}</h3>
          <span className={`font-medium ${quality.color}`}>{quality.label}</span>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-slate-500 mb-1">
            <span>{t('tools.lineHeightCalculator.tight')}</span>
            <span>{t('tools.lineHeightCalculator.ideal')}</span>
            <span>{t('tools.lineHeightCalculator.loose')}</span>
          </div>
          <div className="relative h-6 bg-slate-100 rounded">
            {/* Recommended range */}
            <div
              className="absolute h-full bg-green-200 rounded"
              style={{
                left: `${(rec.min - 1) / 1 * 100}%`,
                width: `${(rec.max - rec.min) / 1 * 100}%`
              }}
            />
            {/* Ideal point */}
            <div
              className="absolute w-1 h-full bg-green-500"
              style={{ left: `${(rec.ideal - 1) / 1 * 100}%` }}
            />
            {/* Current value marker */}
            <div
              className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow top-1"
              style={{
                left: `calc(${Math.min(100, Math.max(0, (currentLineHeight - 1) / 1 * 100))}% - 8px)`
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>1.0</span>
            <span>1.5</span>
            <span>2.0</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 text-center text-sm">
          <div className="p-2 bg-slate-50 rounded">
            <div className="font-mono">{getLineHeightInUnit(currentLineHeight, 'ratio')}</div>
            <div className="text-xs text-slate-500">{t('tools.lineHeightCalculator.ratio')}</div>
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <div className="font-mono">{getLineHeightInUnit(currentLineHeight, 'px')}</div>
            <div className="text-xs text-slate-500">px</div>
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <div className="font-mono">{getLineHeightInUnit(currentLineHeight, 'em')}</div>
            <div className="text-xs text-slate-500">em</div>
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <div className="font-mono">{getLineHeightInUnit(currentLineHeight, '%')}</div>
            <div className="text-xs text-slate-500">%</div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.lineHeightCalculator.preview')}</h3>
        <div
          className="p-4 bg-slate-50 rounded border border-slate-200"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: currentLineHeight
          }}
        >
          {sampleText}
        </div>
      </div>

      {/* Recommendations */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.lineHeightCalculator.recommendations')}</h3>
        <div className="space-y-3">
          {Object.entries(recommendations).map(([type, values]) => (
            <div key={type} className="flex items-center gap-4">
              <div className="w-20 font-medium capitalize">{t(`tools.lineHeightCalculator.${type}`)}</div>
              <div className="flex-1">
                <div className="flex gap-4 text-sm">
                  <span>Min: {values.min}</span>
                  <span className="text-green-600">Ideal: {values.ideal}</span>
                  <span>Max: {values.max}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setTextType(type as 'body' | 'heading' | 'ui')
                  setLineHeight(values.ideal)
                  setUnit('ratio')
                }}
                className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded hover:bg-slate-200"
              >
                {t('tools.lineHeightCalculator.apply')}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.lineHeightCalculator.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>* {t('tools.lineHeightCalculator.tip1')}</li>
          <li>* {t('tools.lineHeightCalculator.tip2')}</li>
          <li>* {t('tools.lineHeightCalculator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
