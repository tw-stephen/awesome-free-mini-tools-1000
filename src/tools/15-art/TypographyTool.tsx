import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function TypographyTool() {
  const { t } = useTranslation()
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog.')
  const [fontFamily, setFontFamily] = useState('Arial')
  const [fontSize, setFontSize] = useState(24)
  const [fontWeight, setFontWeight] = useState(400)
  const [lineHeight, setLineHeight] = useState(1.5)
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [textColor, setTextColor] = useState('#1F2937')
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left')
  const [textTransform, setTextTransform] = useState<'none' | 'uppercase' | 'lowercase' | 'capitalize'>('none')

  const fonts = [
    'Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana',
    'Trebuchet MS', 'Impact', 'Comic Sans MS', 'Palatino Linotype', 'Lucida Console'
  ]

  const copyCSS = () => {
    const css = `font-family: "${fontFamily}", sans-serif;
font-size: ${fontSize}px;
font-weight: ${fontWeight};
line-height: ${lineHeight};
letter-spacing: ${letterSpacing}px;
color: ${textColor};
text-align: ${textAlign};
text-transform: ${textTransform};`
    navigator.clipboard.writeText(css)
  }

  const textStyle: React.CSSProperties = {
    fontFamily: `"${fontFamily}", sans-serif`,
    fontSize: `${fontSize}px`,
    fontWeight,
    lineHeight,
    letterSpacing: `${letterSpacing}px`,
    color: textColor,
    textAlign,
    textTransform,
  }

  const scales = [
    { name: 'Minor Second', ratio: 1.067 },
    { name: 'Major Second', ratio: 1.125 },
    { name: 'Minor Third', ratio: 1.2 },
    { name: 'Major Third', ratio: 1.25 },
    { name: 'Perfect Fourth', ratio: 1.333 },
    { name: 'Golden Ratio', ratio: 1.618 },
  ]

  const [selectedScale, setSelectedScale] = useState(scales[2])

  const getScaleSizes = () => {
    const baseSize = 16
    const sizes = []
    for (let i = -2; i <= 5; i++) {
      sizes.push(Math.round(baseSize * Math.pow(selectedScale.ratio, i)))
    }
    return sizes
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          rows={3}
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.typographyTool.preview')}</h3>
        <div
          className="p-6 bg-white border border-slate-200 rounded-lg min-h-[150px]"
          style={textStyle}
        >
          {text}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.typographyTool.font')}</h3>
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        >
          {fonts.map((font) => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.typographyTool.settings')}</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              Font Size: {fontSize}px
            </label>
            <input
              type="range"
              min="12"
              max="72"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm text-slate-500 block mb-1">
              Font Weight: {fontWeight}
            </label>
            <input
              type="range"
              min="100"
              max="900"
              step="100"
              value={fontWeight}
              onChange={(e) => setFontWeight(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm text-slate-500 block mb-1">
              Line Height: {lineHeight}
            </label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={lineHeight}
              onChange={(e) => setLineHeight(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm text-slate-500 block mb-1">
              Letter Spacing: {letterSpacing}px
            </label>
            <input
              type="range"
              min="-5"
              max="10"
              value={letterSpacing}
              onChange={(e) => setLetterSpacing(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.typographyTool.options')}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">Text Align</label>
            <div className="flex gap-2">
              {(['left', 'center', 'right', 'justify'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => setTextAlign(align)}
                  className={`flex-1 py-2 rounded capitalize ${
                    textAlign === align ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-500 block mb-1">Text Transform</label>
            <div className="flex gap-2">
              {(['none', 'uppercase', 'lowercase', 'capitalize'] as const).map((transform) => (
                <button
                  key={transform}
                  onClick={() => setTextTransform(transform)}
                  className={`flex-1 py-2 rounded capitalize text-sm ${
                    textTransform === transform ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {transform}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-500 block mb-1">Text Color</label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.typographyTool.typeScale')}</h3>
        <select
          value={selectedScale.name}
          onChange={(e) => setSelectedScale(scales.find(s => s.name === e.target.value) || scales[2])}
          className="w-full px-3 py-2 border border-slate-300 rounded mb-3"
        >
          {scales.map((scale) => (
            <option key={scale.name} value={scale.name}>
              {scale.name} ({scale.ratio})
            </option>
          ))}
        </select>
        <div className="space-y-1">
          {getScaleSizes().map((size, i) => (
            <div
              key={i}
              className="flex items-center gap-3"
              style={{ fontSize: `${size}px`, fontFamily }}
            >
              <span className="w-12 text-xs text-slate-500 font-mono">{size}px</span>
              <span>Aa</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-800 text-white font-mono text-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400">/* CSS */</span>
          <button
            onClick={copyCSS}
            className="px-2 py-1 bg-slate-700 rounded text-xs hover:bg-slate-600"
          >
            Copy
          </button>
        </div>
        <pre>{`font-family: "${fontFamily}", sans-serif;
font-size: ${fontSize}px;
font-weight: ${fontWeight};
line-height: ${lineHeight};
letter-spacing: ${letterSpacing}px;
color: ${textColor};
text-align: ${textAlign};
text-transform: ${textTransform};`}</pre>
      </div>
    </div>
  )
}
