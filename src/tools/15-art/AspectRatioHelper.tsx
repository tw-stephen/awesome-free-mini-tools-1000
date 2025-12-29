import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const COMMON_RATIOS = [
  { name: '1:1', width: 1, height: 1, use: 'Square, Social media profile' },
  { name: '4:3', width: 4, height: 3, use: 'Traditional TV, iPad' },
  { name: '3:2', width: 3, height: 2, use: 'DSLR photos, 35mm film' },
  { name: '16:9', width: 16, height: 9, use: 'HD video, Widescreen' },
  { name: '21:9', width: 21, height: 9, use: 'Ultra-wide, Cinema' },
  { name: '9:16', width: 9, height: 16, use: 'Mobile video, Stories' },
  { name: '4:5', width: 4, height: 5, use: 'Instagram portrait' },
  { name: '2:3', width: 2, height: 3, use: 'Pinterest pins' },
  { name: '1.91:1', width: 1.91, height: 1, use: 'Facebook/Twitter ads' },
]

export default function AspectRatioHelper() {
  const { t } = useTranslation()
  const [width, setWidth] = useState(1920)
  const [height, setHeight] = useState(1080)
  const [lockRatio, setLockRatio] = useState(true)
  const [lockedWidth, setLockedWidth] = useState(1920)
  const [lockedHeight, setLockedHeight] = useState(1080)

  const gcd = (a: number, b: number): number => {
    a = Math.abs(Math.round(a))
    b = Math.abs(Math.round(b))
    while (b) {
      const t = b
      b = a % b
      a = t
    }
    return a
  }

  const calculateRatio = () => {
    const divisor = gcd(width, height)
    return {
      simplified: `${width / divisor}:${height / divisor}`,
      decimal: (width / height).toFixed(4),
      ratioWidth: width / divisor,
      ratioHeight: height / divisor
    }
  }

  const ratio = calculateRatio()

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth)
    if (lockRatio && lockedWidth && lockedHeight) {
      const aspectRatio = lockedWidth / lockedHeight
      setHeight(Math.round(newWidth / aspectRatio))
    }
  }

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight)
    if (lockRatio && lockedWidth && lockedHeight) {
      const aspectRatio = lockedWidth / lockedHeight
      setWidth(Math.round(newHeight * aspectRatio))
    }
  }

  const applyRatio = (ratioWidth: number, ratioHeight: number) => {
    const aspectRatio = ratioWidth / ratioHeight
    const newHeight = Math.round(width / aspectRatio)
    setHeight(newHeight)
    setLockedWidth(width)
    setLockedHeight(newHeight)
    setLockRatio(true)
  }

  const swapDimensions = () => {
    const temp = width
    setWidth(height)
    setHeight(temp)
    setLockedWidth(height)
    setLockedHeight(temp)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-4 items-end mb-4">
          <div className="flex-1">
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.aspectRatioHelper.width')}
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <button
            onClick={swapDimensions}
            className="p-2 bg-slate-100 rounded hover:bg-slate-200"
            title="Swap"
          >
            ⇄
          </button>
          <div className="flex-1">
            <label className="text-sm text-slate-500 block mb-1">
              {t('tools.aspectRatioHelper.height')}
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="lockRatio"
            checked={lockRatio}
            onChange={(e) => {
              setLockRatio(e.target.checked)
              if (e.target.checked) {
                setLockedWidth(width)
                setLockedHeight(height)
              }
            }}
            className="w-4 h-4"
          />
          <label htmlFor="lockRatio" className="text-sm text-slate-600">
            {t('tools.aspectRatioHelper.lockRatio')}
          </label>
        </div>
      </div>

      {/* Calculated Ratio */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.aspectRatioHelper.calculatedRatio')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded text-center">
            <div className="text-3xl font-bold text-blue-600">{ratio.simplified}</div>
            <div className="text-sm text-slate-500">{t('tools.aspectRatioHelper.simplified')}</div>
          </div>
          <div className="p-4 bg-green-50 rounded text-center">
            <div className="text-3xl font-bold text-green-600">{ratio.decimal}</div>
            <div className="text-sm text-slate-500">{t('tools.aspectRatioHelper.decimal')}</div>
          </div>
        </div>
      </div>

      {/* Visual Preview */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.aspectRatioHelper.preview')}</h3>
        <div className="flex justify-center items-center h-48 bg-slate-100 rounded">
          <div
            className="bg-blue-500 bg-opacity-30 border-2 border-blue-500 flex items-center justify-center text-blue-700 font-medium"
            style={{
              width: `${Math.min(200, 200 * (width / Math.max(width, height)))}px`,
              height: `${Math.min(180, 180 * (height / Math.max(width, height)))}px`
            }}
          >
            {width} x {height}
          </div>
        </div>
      </div>

      {/* Common Ratios */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.aspectRatioHelper.commonRatios')}</h3>
        <div className="grid gap-2">
          {COMMON_RATIOS.map((r, i) => (
            <button
              key={i}
              onClick={() => applyRatio(r.width, r.height)}
              className="flex items-center gap-4 p-3 bg-slate-50 rounded hover:bg-slate-100 text-left"
            >
              <div
                className="w-12 h-12 bg-blue-500 bg-opacity-30 border border-blue-500 rounded flex-shrink-0"
                style={{
                  width: `${Math.min(48, 48 * (r.width / Math.max(r.width, r.height)))}px`,
                  height: `${Math.min(48, 48 * (r.height / Math.max(r.width, r.height)))}px`
                }}
              />
              <div className="flex-1">
                <div className="font-medium">{r.name}</div>
                <div className="text-sm text-slate-500">{r.use}</div>
              </div>
              <div className="text-sm text-slate-400">
                {Math.round(width * r.height / r.width) === height && '✓'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Size Calculator */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.aspectRatioHelper.sizeCalculator')}</h3>
        <p className="text-sm text-slate-500 mb-3">
          {t('tools.aspectRatioHelper.sizeCalculatorDesc')}
        </p>
        <div className="space-y-2">
          {[480, 720, 1080, 1440, 2160].map(targetHeight => {
            const targetWidth = Math.round(targetHeight * (width / height))
            return (
              <button
                key={targetHeight}
                onClick={() => {
                  setWidth(targetWidth)
                  setHeight(targetHeight)
                }}
                className="w-full flex justify-between p-2 bg-slate-50 rounded hover:bg-slate-100"
              >
                <span className="font-mono">{targetWidth} x {targetHeight}</span>
                <span className="text-sm text-slate-500">{targetHeight}p</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.aspectRatioHelper.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>* {t('tools.aspectRatioHelper.tip1')}</li>
          <li>* {t('tools.aspectRatioHelper.tip2')}</li>
          <li>* {t('tools.aspectRatioHelper.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
