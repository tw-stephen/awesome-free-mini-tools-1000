import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset'

interface BorderSide {
  width: number
  style: BorderStyle
  color: string
}

export default function BorderGenerator() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'uniform' | 'individual'>('uniform')
  const [uniformBorder, setUniformBorder] = useState<BorderSide>({
    width: 2,
    style: 'solid',
    color: '#3b82f6',
  })
  const [borders, setBorders] = useState({
    top: { width: 2, style: 'solid' as BorderStyle, color: '#3b82f6' },
    right: { width: 2, style: 'solid' as BorderStyle, color: '#3b82f6' },
    bottom: { width: 2, style: 'solid' as BorderStyle, color: '#3b82f6' },
    left: { width: 2, style: 'solid' as BorderStyle, color: '#3b82f6' },
  })
  const [borderRadius, setBorderRadius] = useState({
    topLeft: 8,
    topRight: 8,
    bottomRight: 8,
    bottomLeft: 8,
  })
  const [radiusMode, setRadiusMode] = useState<'uniform' | 'individual'>('uniform')
  const [uniformRadius, setUniformRadius] = useState(8)
  const [bgColor, setBgColor] = useState('#ffffff')
  const [boxColor, setBoxColor] = useState('#f8fafc')

  const borderStyles: BorderStyle[] = ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset']
  const sides = ['top', 'right', 'bottom', 'left'] as const

  const updateBorder = (side: typeof sides[number], field: keyof BorderSide, value: number | string) => {
    setBorders({ ...borders, [side]: { ...borders[side], [field]: value } })
  }

  const updateRadius = (corner: keyof typeof borderRadius, value: number) => {
    setBorderRadius({ ...borderRadius, [corner]: value })
  }

  const generateBorderCSS = (): string => {
    if (mode === 'uniform') {
      return `border: ${uniformBorder.width}px ${uniformBorder.style} ${uniformBorder.color};`
    }

    const lines: string[] = []
    sides.forEach((side) => {
      const b = borders[side]
      lines.push(`border-${side}: ${b.width}px ${b.style} ${b.color};`)
    })
    return lines.join('\n')
  }

  const generateRadiusCSS = (): string => {
    if (radiusMode === 'uniform') {
      return `border-radius: ${uniformRadius}px;`
    }
    return `border-radius: ${borderRadius.topLeft}px ${borderRadius.topRight}px ${borderRadius.bottomRight}px ${borderRadius.bottomLeft}px;`
  }

  const getBoxStyle = () => {
    const style: React.CSSProperties = {
      backgroundColor: bgColor,
    }

    if (mode === 'uniform') {
      style.border = `${uniformBorder.width}px ${uniformBorder.style} ${uniformBorder.color}`
    } else {
      style.borderTop = `${borders.top.width}px ${borders.top.style} ${borders.top.color}`
      style.borderRight = `${borders.right.width}px ${borders.right.style} ${borders.right.color}`
      style.borderBottom = `${borders.bottom.width}px ${borders.bottom.style} ${borders.bottom.color}`
      style.borderLeft = `${borders.left.width}px ${borders.left.style} ${borders.left.color}`
    }

    if (radiusMode === 'uniform') {
      style.borderRadius = uniformRadius
    } else {
      style.borderRadius = `${borderRadius.topLeft}px ${borderRadius.topRight}px ${borderRadius.bottomRight}px ${borderRadius.bottomLeft}px`
    }

    return style
  }

  const presets = [
    { name: 'Subtle', border: { width: 1, style: 'solid' as BorderStyle, color: '#e5e7eb' }, radius: 4 },
    { name: 'Card', border: { width: 1, style: 'solid' as BorderStyle, color: '#d1d5db' }, radius: 8 },
    { name: 'Bold', border: { width: 3, style: 'solid' as BorderStyle, color: '#3b82f6' }, radius: 8 },
    { name: 'Dashed', border: { width: 2, style: 'dashed' as BorderStyle, color: '#6b7280' }, radius: 4 },
    { name: 'Double', border: { width: 4, style: 'double' as BorderStyle, color: '#1f2937' }, radius: 0 },
    { name: 'Pill', border: { width: 2, style: 'solid' as BorderStyle, color: '#3b82f6' }, radius: 9999 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => {
              setMode('uniform')
              setRadiusMode('uniform')
              setUniformBorder(preset.border)
              setUniformRadius(preset.radius)
            }}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div
        className="p-8 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: boxColor }}
      >
        <div
          className="w-48 h-48 flex items-center justify-center"
          style={getBoxStyle()}
        >
          <span className="text-gray-500">{t('tools.borderGenerator.preview')}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">{t('tools.borderGenerator.border')}</h3>
            <div className="flex gap-1">
              <button
                onClick={() => setMode('uniform')}
                className={`px-3 py-1 text-sm rounded ${
                  mode === 'uniform' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                {t('tools.borderGenerator.uniform')}
              </button>
              <button
                onClick={() => setMode('individual')}
                className={`px-3 py-1 text-sm rounded ${
                  mode === 'individual' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                {t('tools.borderGenerator.individual')}
              </button>
            </div>
          </div>

          {mode === 'uniform' ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">{t('tools.borderGenerator.width')}: {uniformBorder.width}px</label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={uniformBorder.width}
                  onChange={(e) => setUniformBorder({ ...uniformBorder, width: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">{t('tools.borderGenerator.style')}</label>
                <select
                  value={uniformBorder.style}
                  onChange={(e) => setUniformBorder({ ...uniformBorder, style: e.target.value as BorderStyle })}
                  className="w-full px-3 py-2 border rounded"
                >
                  {borderStyles.map((style) => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">{t('tools.borderGenerator.color')}</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={uniformBorder.color}
                    onChange={(e) => setUniformBorder({ ...uniformBorder, color: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={uniformBorder.color}
                    onChange={(e) => setUniformBorder({ ...uniformBorder, color: e.target.value })}
                    className="flex-1 px-2 py-1 border rounded font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {sides.map((side) => (
                <div key={side} className="flex gap-2 items-center">
                  <span className="w-16 text-sm capitalize">{side}</span>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={borders[side].width}
                    onChange={(e) => updateBorder(side, 'width', parseInt(e.target.value))}
                    className="w-16 px-2 py-1 border rounded text-sm"
                  />
                  <select
                    value={borders[side].style}
                    onChange={(e) => updateBorder(side, 'style', e.target.value)}
                    className="flex-1 px-2 py-1 border rounded text-sm"
                  >
                    {borderStyles.map((style) => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>
                  <input
                    type="color"
                    value={borders[side].color}
                    onChange={(e) => updateBorder(side, 'color', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">{t('tools.borderGenerator.radius')}</h3>
            <div className="flex gap-1">
              <button
                onClick={() => setRadiusMode('uniform')}
                className={`px-3 py-1 text-sm rounded ${
                  radiusMode === 'uniform' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                {t('tools.borderGenerator.uniform')}
              </button>
              <button
                onClick={() => setRadiusMode('individual')}
                className={`px-3 py-1 text-sm rounded ${
                  radiusMode === 'individual' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                {t('tools.borderGenerator.individual')}
              </button>
            </div>
          </div>

          {radiusMode === 'uniform' ? (
            <div>
              <label className="text-sm text-gray-600">{t('tools.borderGenerator.radius')}: {uniformRadius}px</label>
              <input
                type="range"
                min="0"
                max="100"
                value={uniformRadius}
                onChange={(e) => setUniformRadius(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {(['topLeft', 'topRight', 'bottomRight', 'bottomLeft'] as const).map((corner) => (
                <div key={corner}>
                  <label className="text-sm text-gray-600 capitalize">
                    {corner.replace(/([A-Z])/g, ' $1').trim()}: {borderRadius[corner]}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={borderRadius[corner]}
                    onChange={(e) => updateRadius(corner, parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">{t('tools.borderGenerator.boxBg')}</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="block w-10 h-10 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">{t('tools.borderGenerator.containerBg')}</label>
                <input
                  type="color"
                  value={boxColor}
                  onChange={(e) => setBoxColor(e.target.value)}
                  className="block w-10 h-10 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">CSS Code</h3>
          <button
            onClick={() => navigator.clipboard.writeText(`${generateBorderCSS()}\n${generateRadiusCSS()}`)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('common.copy')}
          </button>
        </div>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
          {generateBorderCSS()}
          {'\n'}
          {generateRadiusCSS()}
        </pre>
      </div>
    </div>
  )
}
