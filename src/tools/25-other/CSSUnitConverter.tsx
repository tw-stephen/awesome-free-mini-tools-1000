import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

type Unit = 'px' | 'rem' | 'em' | 'pt' | 'vw' | 'vh' | '%'

interface ConversionResult {
  unit: Unit
  value: number
  formula: string
}

export default function CSSUnitConverter() {
  const { t } = useTranslation()

  const [inputValue, setInputValue] = useState(16)
  const [inputUnit, setInputUnit] = useState<Unit>('px')
  const [baseFontSize, setBaseFontSize] = useState(16)
  const [parentSize, setParentSize] = useState(16)
  const [viewportWidth, setViewportWidth] = useState(1920)
  const [viewportHeight, setViewportHeight] = useState(1080)
  const [containerWidth, setContainerWidth] = useState(800)
  const [copied, setCopied] = useState<string | null>(null)

  const toPx = (value: number, unit: Unit): number => {
    switch (unit) {
      case 'px': return value
      case 'rem': return value * baseFontSize
      case 'em': return value * parentSize
      case 'pt': return value * (96 / 72)
      case 'vw': return (value / 100) * viewportWidth
      case 'vh': return (value / 100) * viewportHeight
      case '%': return (value / 100) * containerWidth
      default: return value
    }
  }

  const fromPx = (px: number, unit: Unit): number => {
    switch (unit) {
      case 'px': return px
      case 'rem': return px / baseFontSize
      case 'em': return px / parentSize
      case 'pt': return px / (96 / 72)
      case 'vw': return (px / viewportWidth) * 100
      case 'vh': return (px / viewportHeight) * 100
      case '%': return (px / containerWidth) * 100
      default: return px
    }
  }

  const getFormula = (fromUnit: Unit, toUnit: Unit): string => {
    if (fromUnit === toUnit) return '1:1'
    if (fromUnit === 'px') {
      switch (toUnit) {
        case 'rem': return `px ÷ ${baseFontSize}`
        case 'em': return `px ÷ ${parentSize}`
        case 'pt': return 'px × 0.75'
        case 'vw': return `px ÷ ${viewportWidth} × 100`
        case 'vh': return `px ÷ ${viewportHeight} × 100`
        case '%': return `px ÷ ${containerWidth} × 100`
      }
    }
    return `${fromUnit} → px → ${toUnit}`
  }

  const pxValue = toPx(inputValue, inputUnit)

  const conversions: ConversionResult[] = (['px', 'rem', 'em', 'pt', 'vw', 'vh', '%'] as Unit[]).map(unit => ({
    unit,
    value: fromPx(pxValue, unit),
    formula: getFormula(inputUnit, unit)
  }))

  const copyValue = async (result: ConversionResult) => {
    const text = `${result.value.toFixed(4).replace(/\.?0+$/, '')}${result.unit}`
    await navigator.clipboard.writeText(text)
    setCopied(result.unit)
    setTimeout(() => setCopied(null), 1500)
  }

  const units: Unit[] = ['px', 'rem', 'em', 'pt', 'vw', 'vh', '%']

  const quickValues = [8, 12, 14, 16, 18, 20, 24, 32, 48, 64]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <div className="flex gap-1">
          {quickValues.map(val => (
            <button
              key={val}
              onClick={() => setInputValue(val)}
              className={`px-2 py-1 text-xs rounded ${inputValue === val ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div className="border border-slate-200 rounded-lg p-4 bg-white">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm text-slate-600 mb-1">{t('tools.unitConverter.value')}</label>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
                  className="input w-full text-2xl font-mono"
                />
              </div>
              <div className="w-32">
                <label className="block text-sm text-slate-600 mb-1">{t('tools.unitConverter.unit')}</label>
                <select
                  value={inputUnit}
                  onChange={(e) => setInputUnit(e.target.value as Unit)}
                  className="input w-full text-lg"
                >
                  {units.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {conversions.map(result => (
              <div
                key={result.unit}
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  result.unit === inputUnit
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
                onClick={() => copyValue(result)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-slate-500 uppercase">{result.unit}</span>
                  {copied === result.unit && (
                    <span className="text-xs text-green-500">{t('common.copied')}</span>
                  )}
                </div>
                <div className="text-xl font-mono font-semibold text-slate-700">
                  {result.value.toFixed(4).replace(/\.?0+$/, '')}
                </div>
                <div className="text-xs text-slate-400 mt-1 truncate">
                  {result.formula}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-800 rounded-lg">
            <code className="text-sm text-green-400">
              {inputValue}{inputUnit} = {pxValue.toFixed(2)}px
            </code>
          </div>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.unitConverter.settings')}</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.unitConverter.baseFontSize')} ({baseFontSize}px)
              </label>
              <input
                type="range"
                min="10"
                max="24"
                value={baseFontSize}
                onChange={(e) => setBaseFontSize(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-slate-400 mt-1">rem = px ÷ {baseFontSize}</div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.unitConverter.parentSize')} ({parentSize}px)
              </label>
              <input
                type="range"
                min="10"
                max="48"
                value={parentSize}
                onChange={(e) => setParentSize(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-slate-400 mt-1">em = px ÷ {parentSize}</div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.unitConverter.viewportWidth')} ({viewportWidth}px)
              </label>
              <input
                type="number"
                value={viewportWidth}
                onChange={(e) => setViewportWidth(parseInt(e.target.value) || 1920)}
                className="input w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.unitConverter.viewportHeight')} ({viewportHeight}px)
              </label>
              <input
                type="number"
                value={viewportHeight}
                onChange={(e) => setViewportHeight(parseInt(e.target.value) || 1080)}
                className="input w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.unitConverter.containerWidth')} ({containerWidth}px)
              </label>
              <input
                type="number"
                value={containerWidth}
                onChange={(e) => setContainerWidth(parseInt(e.target.value) || 800)}
                className="input w-full text-sm"
              />
              <div className="text-xs text-slate-400 mt-1">% = px ÷ {containerWidth} × 100</div>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-200">
            <Button
              variant="secondary"
              className="w-full text-xs"
              onClick={() => {
                setBaseFontSize(16)
                setParentSize(16)
                setViewportWidth(1920)
                setViewportHeight(1080)
                setContainerWidth(800)
              }}
            >
              {t('tools.unitConverter.reset')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
