import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ContrastChecker() {
  const { t } = useTranslation()
  const [foreground, setForeground] = useState('#000000')
  const [background, setBackground] = useState('#ffffff')

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 }
  }

  const getLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map((v) => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  const getContrastRatio = (fg: string, bg: string): number => {
    const fgRgb = hexToRgb(fg)
    const bgRgb = hexToRgb(bg)
    const fgLum = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b)
    const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b)
    const lighter = Math.max(fgLum, bgLum)
    const darker = Math.min(fgLum, bgLum)
    return (lighter + 0.05) / (darker + 0.05)
  }

  const swapColors = () => {
    const temp = foreground
    setForeground(background)
    setBackground(temp)
  }

  const ratio = getContrastRatio(foreground, background)

  const getWCAGLevel = (ratio: number, size: 'normal' | 'large'): { aa: boolean; aaa: boolean } => {
    if (size === 'large') {
      return { aa: ratio >= 3, aaa: ratio >= 4.5 }
    }
    return { aa: ratio >= 4.5, aaa: ratio >= 7 }
  }

  const normalText = getWCAGLevel(ratio, 'normal')
  const largeText = getWCAGLevel(ratio, 'large')

  const getScoreColor = (pass: boolean): string => {
    return pass ? 'text-green-600' : 'text-red-600'
  }

  const suggestions = [
    { fg: '#000000', bg: '#ffffff', ratio: 21.0 },
    { fg: '#1F2937', bg: '#F9FAFB', ratio: 15.5 },
    { fg: '#1E40AF', bg: '#DBEAFE', ratio: 8.6 },
    { fg: '#065F46', bg: '#D1FAE5', ratio: 7.8 },
    { fg: '#7C2D12', bg: '#FED7AA', ratio: 7.2 },
    { fg: '#581C87', bg: '#F3E8FF', ratio: 10.4 },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.contrastChecker.colors')}</h3>
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <label className="text-sm text-slate-500 block mb-1">{t('tools.contrastChecker.foreground')}</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={foreground}
                onChange={(e) => setForeground(e.target.value)}
                className="w-12 h-12 cursor-pointer rounded"
              />
              <input
                type="text"
                value={foreground}
                onChange={(e) => setForeground(e.target.value)}
                className="flex-1 px-2 py-1 border border-slate-300 rounded font-mono text-sm"
              />
            </div>
          </div>
          <button
            onClick={swapColors}
            className="p-2 bg-slate-100 rounded hover:bg-slate-200"
            title="Swap colors"
          >
            ⇄
          </button>
          <div className="flex-1">
            <label className="text-sm text-slate-500 block mb-1">{t('tools.contrastChecker.background')}</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="w-12 h-12 cursor-pointer rounded"
              />
              <input
                type="text"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="flex-1 px-2 py-1 border border-slate-300 rounded font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.contrastChecker.preview')}</h3>
        <div
          className="p-6 rounded-lg"
          style={{ backgroundColor: background }}
        >
          <p
            className="text-2xl font-bold mb-2"
            style={{ color: foreground }}
          >
            Large Text Preview (24px)
          </p>
          <p
            className="text-base"
            style={{ color: foreground }}
          >
            Normal text preview (16px). This is how your text will look with these colors.
          </p>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.contrastChecker.ratio')}</h3>
        <div className="text-center mb-4">
          <div className="text-5xl font-bold">{ratio.toFixed(2)}:1</div>
          <div className="text-slate-500">
            {ratio >= 7 ? 'Excellent' : ratio >= 4.5 ? 'Good' : ratio >= 3 ? 'Fair' : 'Poor'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">{t('tools.contrastChecker.normalText')}</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>WCAG AA (4.5:1)</span>
                <span className={`font-bold ${getScoreColor(normalText.aa)}`}>
                  {normalText.aa ? '✓ Pass' : '✗ Fail'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>WCAG AAA (7:1)</span>
                <span className={`font-bold ${getScoreColor(normalText.aaa)}`}>
                  {normalText.aaa ? '✓ Pass' : '✗ Fail'}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">{t('tools.contrastChecker.largeText')}</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>WCAG AA (3:1)</span>
                <span className={`font-bold ${getScoreColor(largeText.aa)}`}>
                  {largeText.aa ? '✓ Pass' : '✗ Fail'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>WCAG AAA (4.5:1)</span>
                <span className={`font-bold ${getScoreColor(largeText.aaa)}`}>
                  {largeText.aaa ? '✓ Pass' : '✗ Fail'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.contrastChecker.suggestions')}</h3>
        <div className="grid grid-cols-3 gap-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                setForeground(s.fg)
                setBackground(s.bg)
              }}
              className="p-3 rounded-lg text-center hover:ring-2 ring-blue-500"
              style={{ backgroundColor: s.bg }}
            >
              <span style={{ color: s.fg }} className="font-bold">
                Aa
              </span>
              <div className="text-xs mt-1" style={{ color: s.fg }}>
                {s.ratio}:1
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.contrastChecker.about')}</h4>
        <p className="text-sm text-slate-600">
          {t('tools.contrastChecker.aboutText')}
        </p>
      </div>
    </div>
  )
}
