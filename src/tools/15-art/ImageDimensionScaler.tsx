import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ImageDimensionScaler() {
  const { t } = useTranslation()
  const [originalWidth, setOriginalWidth] = useState(1920)
  const [originalHeight, setOriginalHeight] = useState(1080)
  const [targetWidth, setTargetWidth] = useState(1920)
  const [targetHeight, setTargetHeight] = useState(1080)
  const [scaleMode, setScaleMode] = useState<'width' | 'height' | 'percentage' | 'custom'>('percentage')
  const [percentage, setPercentage] = useState(50)
  const [maintainRatio, setMaintainRatio] = useState(true)

  const aspectRatio = originalWidth / originalHeight

  const calculateDimensions = () => {
    switch (scaleMode) {
      case 'width':
        return {
          width: targetWidth,
          height: maintainRatio ? Math.round(targetWidth / aspectRatio) : targetHeight
        }
      case 'height':
        return {
          width: maintainRatio ? Math.round(targetHeight * aspectRatio) : targetWidth,
          height: targetHeight
        }
      case 'percentage':
        return {
          width: Math.round(originalWidth * percentage / 100),
          height: Math.round(originalHeight * percentage / 100)
        }
      case 'custom':
        return { width: targetWidth, height: targetHeight }
      default:
        return { width: originalWidth, height: originalHeight }
    }
  }

  const result = calculateDimensions()
  const scaleFactor = result.width / originalWidth

  const presets = [
    { name: '25%', percentage: 25 },
    { name: '50%', percentage: 50 },
    { name: '75%', percentage: 75 },
    { name: '150%', percentage: 150 },
    { name: '200%', percentage: 200 },
  ]

  const commonSizes = [
    { name: 'HD', width: 1280, height: 720 },
    { name: 'Full HD', width: 1920, height: 1080 },
    { name: '2K', width: 2560, height: 1440 },
    { name: '4K', width: 3840, height: 2160 },
    { name: 'Instagram Square', width: 1080, height: 1080 },
    { name: 'Instagram Story', width: 1080, height: 1920 },
    { name: 'Twitter', width: 1200, height: 675 },
    { name: 'Facebook Cover', width: 820, height: 312 },
  ]

  const handleWidthChange = (newWidth: number) => {
    setTargetWidth(newWidth)
    if (maintainRatio && scaleMode !== 'custom') {
      setTargetHeight(Math.round(newWidth / aspectRatio))
    }
  }

  const handleHeightChange = (newHeight: number) => {
    setTargetHeight(newHeight)
    if (maintainRatio && scaleMode !== 'custom') {
      setTargetWidth(Math.round(newHeight * aspectRatio))
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.imageDimensionScaler.originalSize')}</h3>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.imageDimensionScaler.width')}
            </label>
            <input
              type="number"
              value={originalWidth}
              onChange={(e) => setOriginalWidth(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div className="flex items-end text-2xl text-slate-400">x</div>
          <div className="flex-1">
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.imageDimensionScaler.height')}
            </label>
            <input
              type="number"
              value={originalHeight}
              onChange={(e) => setOriginalHeight(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>
        <div className="text-sm text-slate-500 mt-2">
          {t('tools.imageDimensionScaler.aspectRatio')}: {aspectRatio.toFixed(4)}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.imageDimensionScaler.scaleMode')}</h3>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {(['percentage', 'width', 'height', 'custom'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setScaleMode(mode)}
              className={`py-2 rounded capitalize text-sm ${
                scaleMode === mode ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {t(`tools.imageDimensionScaler.${mode}`)}
            </button>
          ))}
        </div>

        {scaleMode === 'percentage' && (
          <>
            <div className="flex gap-2 mb-4">
              {presets.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => setPercentage(preset.percentage)}
                  className={`flex-1 py-2 rounded text-sm ${
                    percentage === preset.percentage ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
            <div>
              <label className="text-sm text-slate-500 block mb-1">
                {t('tools.imageDimensionScaler.percentage')}: {percentage}%
              </label>
              <input
                type="range"
                min="1"
                max="300"
                value={percentage}
                onChange={(e) => setPercentage(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </>
        )}

        {(scaleMode === 'width' || scaleMode === 'custom') && (
          <div className="mb-4">
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.imageDimensionScaler.targetWidth')}
            </label>
            <input
              type="number"
              value={targetWidth}
              onChange={(e) => handleWidthChange(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        )}

        {(scaleMode === 'height' || scaleMode === 'custom') && (
          <div className="mb-4">
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.imageDimensionScaler.targetHeight')}
            </label>
            <input
              type="number"
              value={targetHeight}
              onChange={(e) => handleHeightChange(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        )}

        {scaleMode !== 'percentage' && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="maintainRatio"
              checked={maintainRatio}
              onChange={(e) => setMaintainRatio(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="maintainRatio" className="text-sm text-slate-600">
              {t('tools.imageDimensionScaler.maintainRatio')}
            </label>
          </div>
        )}
      </div>

      {/* Result */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.imageDimensionScaler.result')}</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-blue-50 rounded text-center">
            <div className="text-2xl font-bold text-blue-600">
              {result.width} x {result.height}
            </div>
            <div className="text-sm text-slate-500">{t('tools.imageDimensionScaler.pixels')}</div>
          </div>
          <div className="p-4 bg-green-50 rounded text-center">
            <div className="text-2xl font-bold text-green-600">
              {(scaleFactor * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-slate-500">{t('tools.imageDimensionScaler.scale')}</div>
          </div>
        </div>

        {/* Visual comparison */}
        <div className="flex items-end gap-4 justify-center h-32 bg-slate-100 rounded p-4">
          <div
            className="bg-blue-500 bg-opacity-30 border border-blue-500 flex items-center justify-center text-xs"
            style={{
              width: `${Math.min(80, 80 * (originalWidth / Math.max(originalWidth, result.width)))}px`,
              height: `${Math.min(100, 100 * (originalHeight / Math.max(originalHeight, result.height)))}px`
            }}
          >
            {t('tools.imageDimensionScaler.original')}
          </div>
          <div
            className="bg-green-500 bg-opacity-30 border border-green-500 flex items-center justify-center text-xs"
            style={{
              width: `${Math.min(80, 80 * (result.width / Math.max(originalWidth, result.width)))}px`,
              height: `${Math.min(100, 100 * (result.height / Math.max(originalHeight, result.height)))}px`
            }}
          >
            {t('tools.imageDimensionScaler.scaled')}
          </div>
        </div>
      </div>

      {/* Common sizes */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.imageDimensionScaler.commonSizes')}</h3>
        <div className="grid grid-cols-2 gap-2">
          {commonSizes.map((size, i) => (
            <button
              key={i}
              onClick={() => {
                setTargetWidth(size.width)
                setTargetHeight(size.height)
                setScaleMode('custom')
                setMaintainRatio(false)
              }}
              className="p-2 bg-slate-50 rounded hover:bg-slate-100 text-left"
            >
              <div className="font-medium">{size.name}</div>
              <div className="text-sm text-slate-500">{size.width} x {size.height}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.imageDimensionScaler.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>* {t('tools.imageDimensionScaler.tip1')}</li>
          <li>* {t('tools.imageDimensionScaler.tip2')}</li>
          <li>* {t('tools.imageDimensionScaler.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
