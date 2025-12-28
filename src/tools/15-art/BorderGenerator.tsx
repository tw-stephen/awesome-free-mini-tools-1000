import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function BorderGenerator() {
  const { t } = useTranslation()
  const [borderWidth, setBorderWidth] = useState({ top: 2, right: 2, bottom: 2, left: 2 })
  const [borderStyle, setBorderStyle] = useState<'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge'>('solid')
  const [borderColor, setBorderColor] = useState('#3B82F6')
  const [borderRadius, setBorderRadius] = useState({ tl: 8, tr: 8, br: 8, bl: 8 })
  const [uniform, setUniform] = useState(true)
  const [uniformRadius, setUniformRadius] = useState(true)
  const [copied, setCopied] = useState(false)

  const getBorderCSS = (): string => {
    let css = ''

    if (uniform) {
      css += `border: ${borderWidth.top}px ${borderStyle} ${borderColor};\n`
    } else {
      css += `border-width: ${borderWidth.top}px ${borderWidth.right}px ${borderWidth.bottom}px ${borderWidth.left}px;\n`
      css += `border-style: ${borderStyle};\n`
      css += `border-color: ${borderColor};\n`
    }

    if (uniformRadius) {
      css += `border-radius: ${borderRadius.tl}px;`
    } else {
      css += `border-radius: ${borderRadius.tl}px ${borderRadius.tr}px ${borderRadius.br}px ${borderRadius.bl}px;`
    }

    return css
  }

  const getStyleObject = (): React.CSSProperties => {
    return {
      borderWidth: uniform
        ? borderWidth.top
        : `${borderWidth.top}px ${borderWidth.right}px ${borderWidth.bottom}px ${borderWidth.left}px`,
      borderStyle,
      borderColor,
      borderRadius: uniformRadius
        ? borderRadius.tl
        : `${borderRadius.tl}px ${borderRadius.tr}px ${borderRadius.br}px ${borderRadius.bl}px`,
    }
  }

  const updateWidth = (side: keyof typeof borderWidth, value: number) => {
    if (uniform) {
      setBorderWidth({ top: value, right: value, bottom: value, left: value })
    } else {
      setBorderWidth({ ...borderWidth, [side]: value })
    }
  }

  const updateRadius = (corner: keyof typeof borderRadius, value: number) => {
    if (uniformRadius) {
      setBorderRadius({ tl: value, tr: value, br: value, bl: value })
    } else {
      setBorderRadius({ ...borderRadius, [corner]: value })
    }
  }

  const copyCSS = () => {
    navigator.clipboard.writeText(getBorderCSS())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const styles: (typeof borderStyle)[] = ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge']

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-center p-8 bg-slate-100 rounded-lg">
          <div
            className="w-48 h-32 bg-white flex items-center justify-center text-slate-500"
            style={getStyleObject()}
          >
            Preview
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.borderGenerator.style')}</h3>
        <div className="grid grid-cols-3 gap-2">
          {styles.map((style) => (
            <button
              key={style}
              onClick={() => setBorderStyle(style)}
              className={`py-2 rounded capitalize text-sm ${
                borderStyle === style ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.borderGenerator.width')}</h3>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={uniform}
              onChange={(e) => setUniform(e.target.checked)}
            />
            Uniform
          </label>
        </div>

        {uniform ? (
          <div>
            <label className="text-sm text-slate-500 block mb-1">All sides: {borderWidth.top}px</label>
            <input
              type="range"
              min="0"
              max="20"
              value={borderWidth.top}
              onChange={(e) => updateWidth('top', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
              <div key={side}>
                <label className="text-sm text-slate-500 block mb-1 capitalize">
                  {side}: {borderWidth[side]}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={borderWidth[side]}
                  onChange={(e) => updateWidth(side, parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.borderGenerator.radius')}</h3>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={uniformRadius}
              onChange={(e) => setUniformRadius(e.target.checked)}
            />
            Uniform
          </label>
        </div>

        {uniformRadius ? (
          <div>
            <label className="text-sm text-slate-500 block mb-1">All corners: {borderRadius.tl}px</label>
            <input
              type="range"
              min="0"
              max="50"
              value={borderRadius.tl}
              onChange={(e) => updateRadius('tl', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'tl', label: 'Top Left' },
              { key: 'tr', label: 'Top Right' },
              { key: 'bl', label: 'Bottom Left' },
              { key: 'br', label: 'Bottom Right' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="text-sm text-slate-500 block mb-1">
                  {label}: {borderRadius[key as keyof typeof borderRadius]}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={borderRadius[key as keyof typeof borderRadius]}
                  onChange={(e) => updateRadius(key as keyof typeof borderRadius, parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.borderGenerator.color')}</h3>
        <div className="flex gap-2">
          <input
            type="color"
            value={borderColor}
            onChange={(e) => setBorderColor(e.target.value)}
            className="w-16 h-10 cursor-pointer"
          />
          <input
            type="text"
            value={borderColor}
            onChange={(e) => setBorderColor(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded font-mono"
          />
        </div>
      </div>

      <div className="card p-4 bg-slate-800 text-white font-mono text-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400">/* CSS */</span>
          <button
            onClick={copyCSS}
            className="px-2 py-1 bg-slate-700 rounded text-xs hover:bg-slate-600"
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
        <pre>{getBorderCSS()}</pre>
      </div>
    </div>
  )
}
