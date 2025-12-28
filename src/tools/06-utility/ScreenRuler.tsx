import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function ScreenRuler() {
  const { t } = useTranslation()
  const [unit, setUnit] = useState<'px' | 'cm' | 'in'>('px')
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal')
  const [ppi, setPpi] = useState(96)
  const [customPpi, setCustomPpi] = useState('')
  const rulerRef = useRef<HTMLDivElement>(null)
  const [rulerLength, setRulerLength] = useState(0)

  useEffect(() => {
    const updateRulerLength = () => {
      if (rulerRef.current) {
        const length = orientation === 'horizontal'
          ? rulerRef.current.clientWidth
          : rulerRef.current.clientHeight
        setRulerLength(length)
      }
    }

    updateRulerLength()
    window.addEventListener('resize', updateRulerLength)
    return () => window.removeEventListener('resize', updateRulerLength)
  }, [orientation])

  const pxPerUnit = {
    px: 1,
    cm: ppi / 2.54,
    in: ppi,
  }

  const getMarks = () => {
    const marks = []
    const step = pxPerUnit[unit]
    const majorInterval = unit === 'px' ? 100 : unit === 'cm' ? 1 : 1
    const minorInterval = unit === 'px' ? 10 : unit === 'cm' ? 0.1 : 0.1

    for (let i = 0; i <= rulerLength / step; i += minorInterval) {
      const position = i * step
      if (position > rulerLength) break

      const isMajor = Math.abs(i % majorInterval) < 0.001 || Math.abs(i % majorInterval - majorInterval) < 0.001
      const isMedium = !isMajor && (unit === 'cm' ? i % 0.5 < 0.001 : i % 0.5 < 0.001)

      marks.push({
        position,
        label: isMajor ? (unit === 'px' ? i : i.toFixed(0)) : '',
        height: isMajor ? 20 : isMedium ? 12 : 6,
      })
    }

    return marks
  }

  const detectPpi = () => {
    // Create a div that's exactly 1 inch
    const testDiv = document.createElement('div')
    testDiv.style.width = '1in'
    testDiv.style.height = '1in'
    testDiv.style.position = 'absolute'
    testDiv.style.left = '-9999px'
    document.body.appendChild(testDiv)
    const detectedPpi = testDiv.offsetWidth
    document.body.removeChild(testDiv)
    setPpi(detectedPpi)
  }

  const marks = getMarks()

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setUnit('px')}
              className={`flex-1 py-2 rounded text-sm font-medium ${
                unit === 'px' ? 'bg-blue-500 text-white' : 'bg-slate-200'
              }`}
            >
              Pixels (px)
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`flex-1 py-2 rounded text-sm font-medium ${
                unit === 'cm' ? 'bg-blue-500 text-white' : 'bg-slate-200'
              }`}
            >
              Centimeters (cm)
            </button>
            <button
              onClick={() => setUnit('in')}
              className={`flex-1 py-2 rounded text-sm font-medium ${
                unit === 'in' ? 'bg-blue-500 text-white' : 'bg-slate-200'
              }`}
            >
              Inches (in)
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setOrientation('horizontal')}
              className={`flex-1 py-2 rounded text-sm font-medium ${
                orientation === 'horizontal' ? 'bg-green-500 text-white' : 'bg-slate-200'
              }`}
            >
              {t('tools.screenRuler.horizontal')}
            </button>
            <button
              onClick={() => setOrientation('vertical')}
              className={`flex-1 py-2 rounded text-sm font-medium ${
                orientation === 'vertical' ? 'bg-green-500 text-white' : 'bg-slate-200'
              }`}
            >
              {t('tools.screenRuler.vertical')}
            </button>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div
          ref={rulerRef}
          className={`relative bg-yellow-100 ${
            orientation === 'horizontal' ? 'h-16 w-full' : 'w-16 h-96'
          }`}
          style={{
            background: 'linear-gradient(to right, #fef3c7, #fde68a)',
          }}
        >
          {marks.map((mark, i) => (
            <div
              key={i}
              className="absolute bg-slate-800"
              style={
                orientation === 'horizontal'
                  ? {
                      left: mark.position,
                      top: 0,
                      width: 1,
                      height: mark.height,
                    }
                  : {
                      top: mark.position,
                      left: 0,
                      height: 1,
                      width: mark.height,
                    }
              }
            >
              {mark.label && (
                <span
                  className="absolute text-xs text-slate-700"
                  style={
                    orientation === 'horizontal'
                      ? { top: mark.height + 2, left: 2 }
                      : { left: mark.height + 2, top: -4 }
                  }
                >
                  {mark.label}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-2 text-center text-sm text-slate-500">
          {(rulerLength / pxPerUnit[unit]).toFixed(2)} {unit}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.screenRuler.ppiSettings')}
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">
              {t('tools.screenRuler.currentPpi')}: {ppi}
            </span>
            <button
              onClick={detectPpi}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              {t('tools.screenRuler.autoDetect')}
            </button>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.screenRuler.customPpi')}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={customPpi}
                onChange={(e) => setCustomPpi(e.target.value)}
                placeholder="96"
                className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <button
                onClick={() => {
                  const value = parseInt(customPpi)
                  if (value > 0) setPpi(value)
                }}
                className="px-4 py-2 bg-slate-200 rounded text-sm hover:bg-slate-300"
              >
                {t('common.apply')}
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            {[72, 96, 110, 144, 192].map((p) => (
              <button
                key={p}
                onClick={() => setPpi(p)}
                className={`px-3 py-1 rounded text-sm ${
                  ppi === p ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.screenRuler.commonPpi')}
        </h3>
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex justify-between p-2 bg-slate-50 rounded">
            <span>{t('tools.screenRuler.standardMonitor')}</span>
            <span className="font-mono">96 PPI</span>
          </div>
          <div className="flex justify-between p-2 bg-slate-50 rounded">
            <span>{t('tools.screenRuler.macRetina')}</span>
            <span className="font-mono">110-220 PPI</span>
          </div>
          <div className="flex justify-between p-2 bg-slate-50 rounded">
            <span>{t('tools.screenRuler.smartphone')}</span>
            <span className="font-mono">300-500 PPI</span>
          </div>
          <div className="flex justify-between p-2 bg-slate-50 rounded">
            <span>{t('tools.screenRuler.printDpi')}</span>
            <span className="font-mono">300 DPI</span>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.screenRuler.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.screenRuler.tip1')}</li>
          <li>{t('tools.screenRuler.tip2')}</li>
          <li>{t('tools.screenRuler.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
