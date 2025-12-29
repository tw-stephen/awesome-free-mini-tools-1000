import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface EasingPreset {
  name: string
  value: string
  cubicBezier: [number, number, number, number]
}

export default function AnimationTimingCalculator() {
  const { t } = useTranslation()
  const [duration, setDuration] = useState(300)
  const [delay, setDelay] = useState(0)
  const [easing, setEasing] = useState<string>('ease')
  const [customBezier, setCustomBezier] = useState<[number, number, number, number]>([0.25, 0.1, 0.25, 1])
  const [isPlaying, setIsPlaying] = useState(false)
  const animationRef = useRef<number>()
  const [progress, setProgress] = useState(0)

  const easingPresets: EasingPreset[] = [
    { name: 'linear', value: 'linear', cubicBezier: [0, 0, 1, 1] },
    { name: 'ease', value: 'ease', cubicBezier: [0.25, 0.1, 0.25, 1] },
    { name: 'ease-in', value: 'ease-in', cubicBezier: [0.42, 0, 1, 1] },
    { name: 'ease-out', value: 'ease-out', cubicBezier: [0, 0, 0.58, 1] },
    { name: 'ease-in-out', value: 'ease-in-out', cubicBezier: [0.42, 0, 0.58, 1] },
    { name: 'ease-in-quad', value: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)', cubicBezier: [0.55, 0.085, 0.68, 0.53] },
    { name: 'ease-out-quad', value: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', cubicBezier: [0.25, 0.46, 0.45, 0.94] },
    { name: 'ease-in-cubic', value: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)', cubicBezier: [0.55, 0.055, 0.675, 0.19] },
    { name: 'ease-out-cubic', value: 'cubic-bezier(0.215, 0.61, 0.355, 1)', cubicBezier: [0.215, 0.61, 0.355, 1] },
    { name: 'ease-in-back', value: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)', cubicBezier: [0.6, -0.28, 0.735, 0.045] },
    { name: 'ease-out-back', value: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', cubicBezier: [0.175, 0.885, 0.32, 1.275] },
    { name: 'ease-in-elastic', value: 'cubic-bezier(0.5, -0.5, 0.75, -0.5)', cubicBezier: [0.5, -0.5, 0.75, -0.5] },
  ]

  const selectedPreset = easingPresets.find((p) => p.name === easing)
  const currentBezier = easing === 'custom' ? customBezier : (selectedPreset?.cubicBezier || [0.25, 0.1, 0.25, 1])

  const cubicBezier = (t: number, p1: number, p2: number, p3: number, p4: number): number => {
    const cx = 3 * p1
    const bx = 3 * (p3 - p1) - cx
    const ax = 1 - cx - bx
    const cy = 3 * p2
    const by = 3 * (p4 - p2) - cy
    const ay = 1 - cy - by

    const sampleCurveX = (t: number) => ((ax * t + bx) * t + cx) * t
    const sampleCurveY = (t: number) => ((ay * t + bx) * t + cy) * t

    let t2 = t
    for (let i = 0; i < 8; i++) {
      const x2 = sampleCurveX(t2) - t
      if (Math.abs(x2) < 0.001) break
      const d2 = (3 * ax * t2 + 2 * bx) * t2 + cx
      if (Math.abs(d2) < 0.000001) break
      t2 = t2 - x2 / d2
    }

    return sampleCurveY(t2)
  }

  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime - delay
        if (elapsed < 0) {
          setProgress(0)
          animationRef.current = requestAnimationFrame(animate)
          return
        }

        const t = Math.min(elapsed / duration, 1)
        const easedProgress = cubicBezier(t, currentBezier[0], currentBezier[1], currentBezier[2], currentBezier[3])
        setProgress(easedProgress)

        if (t < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          setIsPlaying(false)
        }
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, duration, delay, currentBezier])

  const playAnimation = () => {
    setProgress(0)
    setIsPlaying(true)
  }

  const generateCSS = (): string => {
    const easingValue = easing === 'custom'
      ? `cubic-bezier(${customBezier.join(', ')})`
      : selectedPreset?.value || 'ease'

    return `.animated-element {
  transition: all ${duration}ms ${easingValue}${delay > 0 ? ` ${delay}ms` : ''};
}

/* Or as animation */
@keyframes slide {
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
}

.animated-element {
  animation: slide ${duration}ms ${easingValue}${delay > 0 ? ` ${delay}ms` : ''};
}`
  }

  const drawBezierCurve = () => {
    const points: string[] = []
    for (let i = 0; i <= 100; i++) {
      const t = i / 100
      const y = cubicBezier(t, currentBezier[0], currentBezier[1], currentBezier[2], currentBezier[3])
      points.push(`${i * 2},${200 - y * 200}`)
    }
    return points.join(' ')
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {t('tools.animationTimingCalculator.duration')}: {duration}ms
          </label>
          <input
            type="range"
            min="100"
            max="2000"
            step="50"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t('tools.animationTimingCalculator.delay')}: {delay}ms
          </label>
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={delay}
            onChange={(e) => setDelay(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('tools.animationTimingCalculator.easing')}</label>
          <select
            value={easing}
            onChange={(e) => setEasing(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            {easingPresets.map((preset) => (
              <option key={preset.name} value={preset.name}>{preset.name}</option>
            ))}
            <option value="custom">custom</option>
          </select>
        </div>
      </div>

      {easing === 'custom' && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.animationTimingCalculator.customBezier')}</h3>
          <div className="grid grid-cols-4 gap-4">
            {customBezier.map((value, i) => (
              <div key={i}>
                <label className="text-sm text-gray-500">P{Math.floor(i / 2) + 1} {i % 2 === 0 ? 'X' : 'Y'}</label>
                <input
                  type="number"
                  step="0.1"
                  min="-1"
                  max="2"
                  value={value}
                  onChange={(e) => {
                    const newBezier = [...customBezier] as [number, number, number, number]
                    newBezier[i] = parseFloat(e.target.value) || 0
                    setCustomBezier(newBezier)
                  }}
                  className="w-full px-2 py-1 border rounded"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.animationTimingCalculator.curve')}</h3>
          <svg viewBox="0 0 200 200" className="w-full max-w-xs mx-auto bg-gray-50 rounded">
            {/* Grid */}
            <line x1="0" y1="200" x2="200" y2="0" stroke="#e5e7eb" strokeDasharray="4" />
            <line x1="0" y1="200" x2="200" y2="200" stroke="#d1d5db" />
            <line x1="0" y1="0" x2="0" y2="200" stroke="#d1d5db" />

            {/* Control points */}
            <line
              x1="0"
              y1="200"
              x2={currentBezier[0] * 200}
              y2={200 - currentBezier[1] * 200}
              stroke="#94a3b8"
              strokeWidth="1"
            />
            <line
              x1="200"
              y1="0"
              x2={currentBezier[2] * 200}
              y2={200 - currentBezier[3] * 200}
              stroke="#94a3b8"
              strokeWidth="1"
            />

            {/* Curve */}
            <polyline
              points={drawBezierCurve()}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
            />

            {/* Control point handles */}
            <circle cx={currentBezier[0] * 200} cy={200 - currentBezier[1] * 200} r="5" fill="#3b82f6" />
            <circle cx={currentBezier[2] * 200} cy={200 - currentBezier[3] * 200} r="5" fill="#3b82f6" />

            {/* Progress indicator */}
            {isPlaying && (
              <circle
                cx={progress * 200}
                cy={200 - progress * 200}
                r="6"
                fill="#ef4444"
              />
            )}
          </svg>
          <div className="text-center mt-2 text-sm text-gray-500">
            cubic-bezier({currentBezier.join(', ')})
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.animationTimingCalculator.preview')}</h3>
          <div className="space-y-4">
            <div className="h-16 bg-gray-100 rounded relative overflow-hidden">
              <div
                className="absolute w-12 h-12 bg-blue-500 rounded top-2"
                style={{
                  left: `${progress * 80}%`,
                  transition: isPlaying ? 'none' : undefined,
                }}
              />
            </div>

            <div className="h-16 bg-gray-100 rounded relative overflow-hidden">
              <div
                className="absolute inset-y-2 left-2 right-2 bg-blue-500 rounded origin-left"
                style={{
                  transform: `scaleX(${progress})`,
                  transition: isPlaying ? 'none' : undefined,
                }}
              />
            </div>

            <div className="flex justify-center">
              <div
                className="w-16 h-16 bg-blue-500 rounded"
                style={{
                  opacity: progress,
                  transform: `scale(${0.5 + progress * 0.5})`,
                  transition: isPlaying ? 'none' : undefined,
                }}
              />
            </div>
          </div>

          <button
            onClick={playAnimation}
            disabled={isPlaying}
            className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isPlaying ? t('tools.animationTimingCalculator.playing') : t('tools.animationTimingCalculator.play')}
          </button>
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

      <div className="card p-4 bg-blue-50">
        <h4 className="font-medium text-blue-800 mb-2">{t('tools.animationTimingCalculator.tips')}</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>Use 200-300ms for micro-interactions</li>
          <li>Use 300-500ms for page transitions</li>
          <li>ease-out feels responsive for entrances</li>
          <li>ease-in works well for exits</li>
        </ul>
      </div>
    </div>
  )
}
