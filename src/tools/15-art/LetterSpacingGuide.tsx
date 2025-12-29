import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function LetterSpacingGuide() {
  const { t } = useTranslation()
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [fontSize, setFontSize] = useState(16)
  const [textCase, setTextCase] = useState<'normal' | 'uppercase' | 'lowercase'>('normal')
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('normal')

  const presets = [
    { name: 'Tight', value: -0.05, use: 'Large headings, display text' },
    { name: 'Normal', value: 0, use: 'Body text, paragraphs' },
    { name: 'Wide', value: 0.05, use: 'Uppercase text, labels' },
    { name: 'Wider', value: 0.1, use: 'All-caps headings' },
    { name: 'Widest', value: 0.2, use: 'Stylized text, logos' },
  ]

  const getSpacingInUnit = (value: number, unit: string): string => {
    switch (unit) {
      case 'em': return `${value.toFixed(3)}em`
      case 'px': return `${(value * fontSize).toFixed(1)}px`
      case '%': return `${(value * 100).toFixed(1)}%`
      default: return `${value.toFixed(3)}em`
    }
  }

  const copyCSS = () => {
    const css = `letter-spacing: ${letterSpacing}em;`
    navigator.clipboard.writeText(css)
  }

  const sampleText = textCase === 'uppercase'
    ? 'THE QUICK BROWN FOX'
    : textCase === 'lowercase'
      ? 'the quick brown fox'
      : 'The Quick Brown Fox'

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.letterSpacingGuide.fontSize')} (px)
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
              {t('tools.letterSpacingGuide.letterSpacing')} (em)
            </label>
            <input
              type="number"
              step={0.01}
              value={letterSpacing}
              onChange={(e) => setLetterSpacing(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm text-slate-500 block mb-1">
            {t('tools.letterSpacingGuide.textCase')}
          </label>
          <div className="flex gap-2">
            {(['normal', 'uppercase', 'lowercase'] as const).map(tc => (
              <button
                key={tc}
                onClick={() => setTextCase(tc)}
                className={`flex-1 py-2 rounded capitalize ${
                  textCase === tc ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {t(`tools.letterSpacingGuide.${tc}`)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-500 block mb-1">
            {t('tools.letterSpacingGuide.fontWeight')}
          </label>
          <div className="flex gap-2">
            {(['normal', 'bold'] as const).map(fw => (
              <button
                key={fw}
                onClick={() => setFontWeight(fw)}
                className={`flex-1 py-2 rounded capitalize ${
                  fontWeight === fw ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {t(`tools.letterSpacingGuide.${fw}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-2">
          {t('tools.letterSpacingGuide.adjustSpacing')}
        </label>
        <input
          type="range"
          min="-0.1"
          max="0.3"
          step="0.01"
          value={letterSpacing}
          onChange={(e) => setLetterSpacing(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-slate-500 mt-1">
          <span>-0.1em</span>
          <span>0</span>
          <span>0.3em</span>
        </div>
      </div>

      {/* Preview */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.letterSpacingGuide.preview')}</h3>
        <div
          className="p-6 bg-slate-50 rounded text-center"
          style={{
            fontSize: `${fontSize}px`,
            letterSpacing: `${letterSpacing}em`,
            fontWeight: fontWeight === 'bold' ? 'bold' : 'normal',
            textTransform: textCase === 'uppercase' ? 'uppercase' : textCase === 'lowercase' ? 'lowercase' : 'none'
          }}
        >
          {sampleText}
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4 text-center text-sm">
          <div className="p-2 bg-slate-50 rounded">
            <div className="font-mono">{getSpacingInUnit(letterSpacing, 'em')}</div>
            <div className="text-xs text-slate-500">em</div>
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <div className="font-mono">{getSpacingInUnit(letterSpacing, 'px')}</div>
            <div className="text-xs text-slate-500">px</div>
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <button
              onClick={copyCSS}
              className="text-blue-500 hover:text-blue-600"
            >
              {t('tools.letterSpacingGuide.copyCSS')}
            </button>
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.letterSpacingGuide.presets')}</h3>
        <div className="space-y-2">
          {presets.map((preset, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 bg-slate-50 rounded cursor-pointer hover:bg-slate-100"
              onClick={() => setLetterSpacing(preset.value)}
            >
              <div className="w-20 font-medium">{preset.name}</div>
              <div className="w-16 text-sm font-mono text-slate-500">
                {preset.value}em
              </div>
              <div
                className="flex-1 text-sm"
                style={{
                  letterSpacing: `${preset.value}em`,
                  textTransform: textCase === 'uppercase' ? 'uppercase' : 'none'
                }}
              >
                Sample Text
              </div>
              <div className="text-xs text-slate-400">{preset.use}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.letterSpacingGuide.comparison')}</h3>
        <div className="space-y-4">
          {[-0.05, 0, 0.05, 0.1, 0.15].map((spacing, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-16 text-sm font-mono text-slate-500">
                {spacing}em
              </div>
              <div
                className="flex-1 p-2 bg-slate-50 rounded"
                style={{
                  letterSpacing: `${spacing}em`,
                  textTransform: textCase === 'uppercase' ? 'uppercase' : 'none'
                }}
              >
                {sampleText}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.letterSpacingGuide.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>* {t('tools.letterSpacingGuide.tip1')}</li>
          <li>* {t('tools.letterSpacingGuide.tip2')}</li>
          <li>* {t('tools.letterSpacingGuide.tip3')}</li>
          <li>* {t('tools.letterSpacingGuide.tip4')}</li>
        </ul>
      </div>
    </div>
  )
}
