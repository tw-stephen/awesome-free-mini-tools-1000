import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

type BlendMode =
  | 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten'
  | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference'
  | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity'

export default function BlendModePreview() {
  const { t } = useTranslation()
  const [baseImageSrc, setBaseImageSrc] = useState<string>('')
  const [overlayImageSrc, setOverlayImageSrc] = useState<string>('')
  const [overlayColor, setOverlayColor] = useState('#3b82f6')
  const [blendMode, setBlendMode] = useState<BlendMode>('multiply')
  const [overlayOpacity, setOverlayOpacity] = useState(100)
  const [overlayType, setOverlayType] = useState<'color' | 'image'>('color')
  const baseInputRef = useRef<HTMLInputElement>(null)
  const overlayInputRef = useRef<HTMLInputElement>(null)

  const blendModes: BlendMode[] = [
    'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
    'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference',
    'exclusion', 'hue', 'saturation', 'color', 'luminosity',
  ]

  const blendModeDescriptions: Record<BlendMode, string> = {
    'normal': 'No blending, top layer covers bottom',
    'multiply': 'Darkens by multiplying colors',
    'screen': 'Lightens by inverting, multiplying, inverting',
    'overlay': 'Combines multiply and screen',
    'darken': 'Keeps darker pixels from both layers',
    'lighten': 'Keeps lighter pixels from both layers',
    'color-dodge': 'Brightens by decreasing contrast',
    'color-burn': 'Darkens by increasing contrast',
    'hard-light': 'Intense overlay effect',
    'soft-light': 'Gentle overlay effect',
    'difference': 'Subtracts colors, creates negative',
    'exclusion': 'Similar to difference, less contrast',
    'hue': 'Uses hue from top, saturation/luminosity from bottom',
    'saturation': 'Uses saturation from top layer',
    'color': 'Uses hue and saturation from top',
    'luminosity': 'Uses luminosity from top layer',
  }

  const handleBaseImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setBaseImageSrc(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleOverlayImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setOverlayImageSrc(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const generateCSS = (): string => {
    return `.blended-element {
  position: relative;
}

.blended-element::after {
  content: '';
  position: absolute;
  inset: 0;
  ${overlayType === 'color' ? `background-color: ${overlayColor};` : `background-image: url('overlay.jpg');
  background-size: cover;`}
  mix-blend-mode: ${blendMode};
  opacity: ${overlayOpacity / 100};
}`
  }

  const sampleGradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  ]

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.blendModePreview.baseLayer')}</h3>
          <input
            ref={baseInputRef}
            type="file"
            accept="image/*"
            onChange={handleBaseImageUpload}
            className="block w-full mb-2"
          />
          {!baseImageSrc && (
            <div className="text-sm text-gray-500">
              {t('tools.blendModePreview.usingSample')}
            </div>
          )}
        </div>

        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.blendModePreview.overlayLayer')}</h3>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setOverlayType('color')}
              className={`flex-1 py-2 rounded ${
                overlayType === 'color' ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              {t('tools.blendModePreview.colorOverlay')}
            </button>
            <button
              onClick={() => setOverlayType('image')}
              className={`flex-1 py-2 rounded ${
                overlayType === 'image' ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              {t('tools.blendModePreview.imageOverlay')}
            </button>
          </div>

          {overlayType === 'color' ? (
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={overlayColor}
                onChange={(e) => setOverlayColor(e.target.value)}
                className="w-12 h-12 rounded cursor-pointer"
              />
              <input
                type="text"
                value={overlayColor}
                onChange={(e) => setOverlayColor(e.target.value)}
                className="flex-1 px-3 py-2 border rounded font-mono"
              />
            </div>
          ) : (
            <input
              ref={overlayInputRef}
              type="file"
              accept="image/*"
              onChange={handleOverlayImageUpload}
              className="block w-full"
            />
          )}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">{t('tools.blendModePreview.blendMode')}</h3>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">{t('tools.blendModePreview.opacity')}:</label>
            <input
              type="range"
              min="0"
              max="100"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(parseInt(e.target.value))}
              className="w-24"
            />
            <span className="text-sm w-10">{overlayOpacity}%</span>
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {blendModes.map((mode) => (
            <button
              key={mode}
              onClick={() => setBlendMode(mode)}
              className={`px-2 py-1 text-xs rounded truncate ${
                blendMode === mode ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              title={mode}
            >
              {mode}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-2">
          {blendModeDescriptions[blendMode]}
        </p>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.blendModePreview.preview')}</h3>
        <div className="aspect-video bg-gray-100 rounded overflow-hidden relative">
          {/* Base layer */}
          {baseImageSrc ? (
            <img
              src={baseImageSrc}
              alt="Base"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: sampleGradients[0] }}
            />
          )}

          {/* Overlay layer */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: overlayType === 'color' ? overlayColor : undefined,
              backgroundImage: overlayType === 'image' && overlayImageSrc ? `url(${overlayImageSrc})` : undefined,
              backgroundSize: 'cover',
              mixBlendMode: blendMode,
              opacity: overlayOpacity / 100,
            }}
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.blendModePreview.comparison')}</h3>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {blendModes.map((mode) => (
            <button
              key={mode}
              onClick={() => setBlendMode(mode)}
              className={`aspect-square rounded overflow-hidden relative ${
                blendMode === mode ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {/* Base */}
              {baseImageSrc ? (
                <img
                  src={baseImageSrc}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{ background: sampleGradients[0] }}
                />
              )}
              {/* Overlay */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: overlayType === 'color' ? overlayColor : undefined,
                  backgroundImage: overlayType === 'image' && overlayImageSrc ? `url(${overlayImageSrc})` : undefined,
                  backgroundSize: 'cover',
                  mixBlendMode: mode,
                  opacity: overlayOpacity / 100,
                }}
              />
              <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] text-center py-0.5 truncate">
                {mode}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">CSS Code</h3>
          <button
            onClick={() => navigator.clipboard.writeText(generateCSS())}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('common.copy')}
          </button>
        </div>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
          {generateCSS()}
        </pre>
      </div>
    </div>
  )
}
