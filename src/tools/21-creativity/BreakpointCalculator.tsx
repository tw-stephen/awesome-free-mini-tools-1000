import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Breakpoint {
  name: string
  minWidth: number
  maxWidth: number | null
  containerWidth: number | null
}

export default function BreakpointCalculator() {
  const { t } = useTranslation()
  const [preset, setPreset] = useState<'tailwind' | 'bootstrap' | 'custom'>('tailwind')
  const [customBreakpoints, setCustomBreakpoints] = useState<Breakpoint[]>([
    { name: 'sm', minWidth: 640, maxWidth: 767, containerWidth: 640 },
    { name: 'md', minWidth: 768, maxWidth: 1023, containerWidth: 768 },
    { name: 'lg', minWidth: 1024, maxWidth: 1279, containerWidth: 1024 },
    { name: 'xl', minWidth: 1280, maxWidth: 1535, containerWidth: 1280 },
    { name: '2xl', minWidth: 1536, maxWidth: null, containerWidth: 1536 },
  ])

  const presets: Record<string, Breakpoint[]> = {
    tailwind: [
      { name: 'sm', minWidth: 640, maxWidth: 767, containerWidth: 640 },
      { name: 'md', minWidth: 768, maxWidth: 1023, containerWidth: 768 },
      { name: 'lg', minWidth: 1024, maxWidth: 1279, containerWidth: 1024 },
      { name: 'xl', minWidth: 1280, maxWidth: 1535, containerWidth: 1280 },
      { name: '2xl', minWidth: 1536, maxWidth: null, containerWidth: 1536 },
    ],
    bootstrap: [
      { name: 'sm', minWidth: 576, maxWidth: 767, containerWidth: 540 },
      { name: 'md', minWidth: 768, maxWidth: 991, containerWidth: 720 },
      { name: 'lg', minWidth: 992, maxWidth: 1199, containerWidth: 960 },
      { name: 'xl', minWidth: 1200, maxWidth: 1399, containerWidth: 1140 },
      { name: 'xxl', minWidth: 1400, maxWidth: null, containerWidth: 1320 },
    ],
    custom: customBreakpoints,
  }

  const breakpoints = preset === 'custom' ? customBreakpoints : presets[preset]

  const updateCustomBreakpoint = (index: number, field: keyof Breakpoint, value: string | number | null) => {
    const newBreakpoints = [...customBreakpoints]
    newBreakpoints[index] = { ...newBreakpoints[index], [field]: value }
    setCustomBreakpoints(newBreakpoints)
  }

  const addCustomBreakpoint = () => {
    const last = customBreakpoints[customBreakpoints.length - 1]
    setCustomBreakpoints([
      ...customBreakpoints,
      {
        name: `${customBreakpoints.length + 1}xl`,
        minWidth: (last?.minWidth || 1536) + 200,
        maxWidth: null,
        containerWidth: (last?.containerWidth || 1536) + 200,
      },
    ])
  }

  const removeCustomBreakpoint = (index: number) => {
    if (customBreakpoints.length <= 1) return
    setCustomBreakpoints(customBreakpoints.filter((_, i) => i !== index))
  }

  const generateCSS = (): string => {
    let css = '/* Breakpoint CSS Variables */\n:root {\n'
    breakpoints.forEach((bp) => {
      css += `  --breakpoint-${bp.name}: ${bp.minWidth}px;\n`
    })
    css += '}\n\n/* Media Query Mixins */\n'

    breakpoints.forEach((bp) => {
      css += `/* ${bp.name}: ${bp.minWidth}px${bp.maxWidth ? ` - ${bp.maxWidth}px` : '+'} */\n`
      css += `@media (min-width: ${bp.minWidth}px) {\n  /* styles */\n}\n\n`
    })

    css += '/* Container widths */\n'
    breakpoints.forEach((bp) => {
      if (bp.containerWidth) {
        css += `@media (min-width: ${bp.minWidth}px) {\n  .container { max-width: ${bp.containerWidth}px; }\n}\n`
      }
    })

    return css
  }

  const generateSCSS = (): string => {
    let scss = '// Breakpoint Variables\n'
    breakpoints.forEach((bp) => {
      scss += `$breakpoint-${bp.name}: ${bp.minWidth}px;\n`
    })

    scss += '\n// Breakpoint Map\n$breakpoints: (\n'
    breakpoints.forEach((bp, i) => {
      scss += `  "${bp.name}": ${bp.minWidth}px${i < breakpoints.length - 1 ? ',' : ''}\n`
    })
    scss += ');\n\n'

    scss += '// Media Query Mixin\n'
    scss += '@mixin breakpoint($name) {\n'
    scss += '  @media (min-width: map-get($breakpoints, $name)) {\n'
    scss += '    @content;\n'
    scss += '  }\n'
    scss += '}\n\n'

    scss += '// Usage:\n'
    scss += '// @include breakpoint("md") { ... }\n'

    return scss
  }

  const [viewportWidth, setViewportWidth] = useState(1024)
  const currentBreakpoint = breakpoints.find((bp, i) => {
    const next = breakpoints[i + 1]
    return viewportWidth >= bp.minWidth && (!next || viewportWidth < next.minWidth)
  })

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(['tailwind', 'bootstrap', 'custom'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPreset(p)}
            className={`px-4 py-2 rounded capitalize ${
              preset === p ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-4">{t('tools.breakpointCalculator.breakpoints')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">{t('tools.breakpointCalculator.name')}</th>
                <th className="py-2 text-left">{t('tools.breakpointCalculator.minWidth')}</th>
                <th className="py-2 text-left">{t('tools.breakpointCalculator.maxWidth')}</th>
                <th className="py-2 text-left">{t('tools.breakpointCalculator.container')}</th>
                {preset === 'custom' && <th className="py-2"></th>}
              </tr>
            </thead>
            <tbody>
              {breakpoints.map((bp, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">
                    {preset === 'custom' ? (
                      <input
                        type="text"
                        value={bp.name}
                        onChange={(e) => updateCustomBreakpoint(index, 'name', e.target.value)}
                        className="w-16 px-2 py-1 border rounded"
                      />
                    ) : (
                      <span className="font-mono">{bp.name}</span>
                    )}
                  </td>
                  <td className="py-2">
                    {preset === 'custom' ? (
                      <input
                        type="number"
                        value={bp.minWidth}
                        onChange={(e) => updateCustomBreakpoint(index, 'minWidth', parseInt(e.target.value))}
                        className="w-24 px-2 py-1 border rounded"
                      />
                    ) : (
                      <span>{bp.minWidth}px</span>
                    )}
                  </td>
                  <td className="py-2">
                    {bp.maxWidth ? `${bp.maxWidth}px` : '-'}
                  </td>
                  <td className="py-2">
                    {preset === 'custom' ? (
                      <input
                        type="number"
                        value={bp.containerWidth || ''}
                        onChange={(e) => updateCustomBreakpoint(index, 'containerWidth', parseInt(e.target.value) || null)}
                        className="w-24 px-2 py-1 border rounded"
                      />
                    ) : (
                      <span>{bp.containerWidth}px</span>
                    )}
                  </td>
                  {preset === 'custom' && (
                    <td className="py-2">
                      <button
                        onClick={() => removeCustomBreakpoint(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        X
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {preset === 'custom' && (
          <button
            onClick={addCustomBreakpoint}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            + {t('tools.breakpointCalculator.addBreakpoint')}
          </button>
        )}
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-4">{t('tools.breakpointCalculator.visualization')}</h3>
        <div className="space-y-2">
          {breakpoints.map((bp, i) => {
            const width = (bp.minWidth / 1920) * 100
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="w-12 text-sm font-mono">{bp.name}</span>
                <div className="flex-1 h-8 bg-gray-100 rounded relative overflow-hidden">
                  <div
                    className="absolute h-full bg-blue-500 rounded-r"
                    style={{ left: `${width}%`, right: 0 }}
                  />
                  <div
                    className="absolute h-full border-l-2 border-blue-700"
                    style={{ left: `${width}%` }}
                  />
                </div>
                <span className="w-16 text-sm text-gray-500">{bp.minWidth}px</span>
              </div>
            )
          })}
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>0px</span>
            <span>480px</span>
            <span>960px</span>
            <span>1440px</span>
            <span>1920px</span>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-4">{t('tools.breakpointCalculator.simulator')}</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">
              {t('tools.breakpointCalculator.viewportWidth')}: {viewportWidth}px
              {currentBreakpoint && (
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                  {currentBreakpoint.name}
                </span>
              )}
            </label>
            <input
              type="range"
              min="320"
              max="1920"
              value={viewportWidth}
              onChange={(e) => setViewportWidth(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[320, 375, 414, 768, 1024, 1280, 1440, 1920].map((w) => (
              <button
                key={w}
                onClick={() => setViewportWidth(w)}
                className={`px-3 py-1 text-sm rounded ${
                  viewportWidth === w ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {w}px
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">CSS</h3>
            <button
              onClick={() => navigator.clipboard.writeText(generateCSS())}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {t('common.copy')}
            </button>
          </div>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto max-h-48">
            {generateCSS()}
          </pre>
        </div>

        <div className="card p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">SCSS</h3>
            <button
              onClick={() => navigator.clipboard.writeText(generateSCSS())}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {t('common.copy')}
            </button>
          </div>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto max-h-48">
            {generateSCSS()}
          </pre>
        </div>
      </div>
    </div>
  )
}
