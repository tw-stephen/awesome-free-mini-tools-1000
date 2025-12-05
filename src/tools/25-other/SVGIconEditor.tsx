import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface IconData {
  path: string
  name: string
}

const defaultIcons: IconData[] = [
  { name: 'Heart', path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' },
  { name: 'Star', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { name: 'Check', path: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z' },
  { name: 'Close', path: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z' },
  { name: 'Home', path: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' },
  { name: 'User', path: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' },
  { name: 'Settings', path: 'M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z' },
  { name: 'Search', path: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z' },
  { name: 'Mail', path: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z' },
  { name: 'Phone', path: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z' },
  { name: 'Bell', path: 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z' },
  { name: 'Calendar', path: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z' }
]

export default function SVGIconEditor() {
  const { t } = useTranslation()

  const [selectedIcon, setSelectedIcon] = useState<IconData>(defaultIcons[0])
  const [customPath, setCustomPath] = useState('')
  const [color, setColor] = useState('#3b82f6')
  const [size, setSize] = useState(64)
  const [strokeWidth, setStrokeWidth] = useState(0)
  const [strokeColor, setStrokeColor] = useState('#1e293b')
  const [rotation, setRotation] = useState(0)
  const [flipX, setFlipX] = useState(false)
  const [flipY, setFlipY] = useState(false)

  const currentPath = customPath || selectedIcon.path

  const getSvgCode = () => {
    const transform = []
    if (rotation !== 0) transform.push(`rotate(${rotation} 12 12)`)
    if (flipX || flipY) {
      const scaleX = flipX ? -1 : 1
      const scaleY = flipY ? -1 : 1
      transform.push(`translate(${flipX ? 24 : 0} ${flipY ? 24 : 0}) scale(${scaleX} ${scaleY})`)
    }
    const transformAttr = transform.length ? ` transform="${transform.join(' ')}"` : ''

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
  <path d="${currentPath}" fill="${color}"${strokeWidth > 0 ? ` stroke="${strokeColor}" stroke-width="${strokeWidth}"` : ''}${transformAttr}/>
</svg>`
  }

  const copySvg = async () => {
    await navigator.clipboard.writeText(getSvgCode())
  }

  const downloadSvg = () => {
    const blob = new Blob([getSvgCode()], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `icon-${size}x${size}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadPng = () => {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    const svgBlob = new Blob([getSvgCode()], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(svgBlob)

    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = `icon-${size}x${size}.png`
      a.click()
      URL.revokeObjectURL(url)
    }
    img.src = url
  }

  const getTransformStyle = () => {
    const transforms = []
    if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`)
    if (flipX) transforms.push('scaleX(-1)')
    if (flipY) transforms.push('scaleY(-1)')
    return transforms.length ? transforms.join(' ') : 'none'
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button onClick={copySvg}>{t('tools.svgIcon.copySVG')}</Button>
        <Button variant="secondary" onClick={downloadSvg}>{t('tools.svgIcon.downloadSVG')}</Button>
        <Button variant="secondary" onClick={downloadPng}>{t('tools.svgIcon.downloadPNG')}</Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-center p-8 bg-slate-100 rounded-lg min-h-[300px]">
            <div
              className="bg-white rounded-lg shadow-lg p-8 flex items-center justify-center"
              style={{
                backgroundImage: 'linear-gradient(45deg, #f1f5f9 25%, transparent 25%), linear-gradient(-45deg, #f1f5f9 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f1f5f9 75%), linear-gradient(-45deg, transparent 75%, #f1f5f9 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
              }}
            >
              <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                style={{ transform: getTransformStyle() }}
              >
                <path
                  d={currentPath}
                  fill={color}
                  stroke={strokeWidth > 0 ? strokeColor : 'none'}
                  strokeWidth={strokeWidth}
                />
              </svg>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">{t('tools.svgIcon.iconLibrary')}</label>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
              {defaultIcons.map((icon) => (
                <button
                  key={icon.name}
                  onClick={() => { setSelectedIcon(icon); setCustomPath('') }}
                  className={`p-2 rounded border ${selectedIcon.name === icon.name && !customPath ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
                  title={icon.name}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d={icon.path} fill="#64748b" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">{t('tools.svgIcon.customPath')}</label>
            <textarea
              value={customPath}
              onChange={(e) => setCustomPath(e.target.value)}
              placeholder={t('tools.svgIcon.pathPlaceholder')}
              className="input w-full h-20 font-mono text-xs"
            />
          </div>

          <div className="p-3 bg-slate-800 rounded-lg overflow-x-auto">
            <code className="text-xs text-green-400 whitespace-pre">{getSvgCode()}</code>
          </div>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4 max-h-[600px] overflow-auto">
          <h3 className="font-semibold text-slate-700">{t('tools.svgIcon.settings')}</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.svgIcon.size')} ({size}px)</label>
              <input
                type="range"
                min="16"
                max="256"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.svgIcon.fillColor')}</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="input flex-1 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.svgIcon.strokeWidth')} ({strokeWidth})</label>
              <input
                type="range"
                min="0"
                max="3"
                step="0.5"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {strokeWidth > 0 && (
              <div>
                <label className="block text-xs text-slate-500 mb-1">{t('tools.svgIcon.strokeColor')}</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                    className="w-10 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                    className="input flex-1 text-xs font-mono"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.svgIcon.rotation')} ({rotation}°)</label>
              <input
                type="range"
                min="0"
                max="360"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-2">{t('tools.svgIcon.transform')}</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFlipX(!flipX)}
                  className={`flex-1 px-2 py-1.5 text-xs rounded ${flipX ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                >
                  {t('tools.svgIcon.flipX')}
                </button>
                <button
                  onClick={() => setFlipY(!flipY)}
                  className={`flex-1 px-2 py-1.5 text-xs rounded ${flipY ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                >
                  {t('tools.svgIcon.flipY')}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.svgIcon.quickColors')}</h4>
              <div className="grid grid-cols-5 gap-1">
                {['#3b82f6', '#22c55e', '#ef4444', '#f97316', '#8b5cf6', '#ec4899', '#06b6d4', '#eab308', '#1e293b', '#64748b'].map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className="w-full aspect-square rounded"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
