import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a))
  b = Math.abs(Math.round(b))
  while (b) {
    const t = b
    b = a % b
    a = t
  }
  return a
}

export default function AspectRatioCalculator() {
  const { t } = useTranslation()

  const [width, setWidth] = useState(1920)
  const [height, setHeight] = useState(1080)
  const [newWidth, setNewWidth] = useState(1280)
  const [newHeight, setNewHeight] = useState(720)
  const [lockRatio, setLockRatio] = useState(true)
  const [copied, setCopied] = useState(false)

  const divisor = gcd(width, height)
  const ratioW = width / divisor
  const ratioH = height / divisor
  const ratio = width / height

  useEffect(() => {
    if (lockRatio && width > 0 && height > 0) {
      setNewHeight(Math.round(newWidth / ratio))
    }
  }, [newWidth, lockRatio, ratio, width, height])

  const updateNewWidth = (value: number) => {
    setNewWidth(value)
    if (lockRatio) {
      setNewHeight(Math.round(value / ratio))
    }
  }

  const updateNewHeight = (value: number) => {
    setNewHeight(value)
    if (lockRatio) {
      setNewWidth(Math.round(value * ratio))
    }
  }

  const swapDimensions = () => {
    setWidth(height)
    setHeight(width)
    setNewWidth(newHeight)
    setNewHeight(newWidth)
  }

  const copyRatio = async () => {
    await navigator.clipboard.writeText(`${ratioW}:${ratioH}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const presets = [
    { name: '16:9', w: 1920, h: 1080 },
    { name: '4:3', w: 1024, h: 768 },
    { name: '1:1', w: 1080, h: 1080 },
    { name: '21:9', w: 2560, h: 1080 },
    { name: '9:16', w: 1080, h: 1920 },
    { name: '3:2', w: 1440, h: 960 },
    { name: '2:3', w: 800, h: 1200 },
    { name: '4:5', w: 1080, h: 1350 }
  ]

  const applyPreset = (preset: typeof presets[0]) => {
    setWidth(preset.w)
    setHeight(preset.h)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <div className="flex gap-1 flex-wrap">
          {presets.map(preset => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="px-2 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              {preset.name}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <Button variant="secondary" onClick={copyRatio}>
          {copied ? t('common.copied') : t('tools.aspectRatio.copyRatio')}
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-center p-8 bg-slate-50 rounded-lg min-h-[300px]">
            <div
              className="bg-blue-500 rounded-lg shadow-lg flex items-center justify-center text-white"
              style={{
                width: Math.min(400, width / Math.max(width, height) * 400),
                height: Math.min(300, height / Math.max(width, height) * 300),
                aspectRatio: `${width} / ${height}`
              }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold">{ratioW}:{ratioH}</div>
                <div className="text-sm opacity-80 mt-1">{width} × {height}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-lg p-4 bg-white">
              <h4 className="text-sm font-medium text-slate-700 mb-3">{t('tools.aspectRatio.original')}</h4>
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <label className="block text-xs text-slate-500 mb-1">{t('tools.aspectRatio.width')}</label>
                  <input
                    type="number"
                    min="1"
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value) || 1)}
                    className="input w-full"
                  />
                </div>
                <button
                  onClick={swapDimensions}
                  className="mt-5 p-2 rounded hover:bg-slate-100"
                  title={t('tools.aspectRatio.swap')}
                >
                  ⇄
                </button>
                <div className="flex-1">
                  <label className="block text-xs text-slate-500 mb-1">{t('tools.aspectRatio.height')}</label>
                  <input
                    type="number"
                    min="1"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value) || 1)}
                    className="input w-full"
                  />
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-slate-700">{t('tools.aspectRatio.resize')}</h4>
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={lockRatio}
                    onChange={(e) => setLockRatio(e.target.checked)}
                    className="rounded"
                  />
                  {t('tools.aspectRatio.lock')}
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <label className="block text-xs text-slate-500 mb-1">{t('tools.aspectRatio.width')}</label>
                  <input
                    type="number"
                    min="1"
                    value={newWidth}
                    onChange={(e) => updateNewWidth(parseInt(e.target.value) || 1)}
                    className="input w-full"
                  />
                </div>
                <span className="mt-5 text-slate-400">×</span>
                <div className="flex-1">
                  <label className="block text-xs text-slate-500 mb-1">{t('tools.aspectRatio.height')}</label>
                  <input
                    type="number"
                    min="1"
                    value={newHeight}
                    onChange={(e) => updateNewHeight(parseInt(e.target.value) || 1)}
                    className="input w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.aspectRatio.info')}</h3>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-500 mb-1">{t('tools.aspectRatio.ratio')}</div>
              <div className="text-2xl font-bold text-slate-700">{ratioW}:{ratioH}</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-xs text-slate-500">{t('tools.aspectRatio.decimal')}</div>
                <div className="text-sm font-mono">{ratio.toFixed(4)}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <div className="text-xs text-slate-500">{t('tools.aspectRatio.pixels')}</div>
                <div className="text-sm font-mono">{(width * height).toLocaleString()}</div>
              </div>
            </div>

            <div className="p-2 bg-slate-50 rounded">
              <div className="text-xs text-slate-500 mb-1">{t('tools.aspectRatio.css')}</div>
              <code className="text-xs font-mono text-slate-700">
                aspect-ratio: {ratioW}/{ratioH};
              </code>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.aspectRatio.common')}</h4>
            <div className="space-y-1 text-xs text-slate-500">
              <div>16:9 - {t('tools.aspectRatio.widescreen')}</div>
              <div>4:3 - {t('tools.aspectRatio.standard')}</div>
              <div>1:1 - {t('tools.aspectRatio.square')}</div>
              <div>9:16 - {t('tools.aspectRatio.portrait')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
