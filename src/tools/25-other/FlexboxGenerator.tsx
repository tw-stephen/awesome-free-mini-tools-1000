import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

export default function FlexboxGenerator() {
  const { t } = useTranslation()

  const [flexDirection, setFlexDirection] = useState<'row' | 'row-reverse' | 'column' | 'column-reverse'>('row')
  const [justifyContent, setJustifyContent] = useState<'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'>('flex-start')
  const [alignItems, setAlignItems] = useState<'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'>('stretch')
  const [flexWrap, setFlexWrap] = useState<'nowrap' | 'wrap' | 'wrap-reverse'>('nowrap')
  const [gap, setGap] = useState(8)
  const [itemCount, setItemCount] = useState(5)
  const [copied, setCopied] = useState(false)

  const generateCSS = (): string => {
    const lines = [
      'display: flex;',
      `flex-direction: ${flexDirection};`,
      `justify-content: ${justifyContent};`,
      `align-items: ${alignItems};`,
      `flex-wrap: ${flexWrap};`,
      `gap: ${gap}px;`
    ]
    return lines.join('\n')
  }

  const flexCSS = generateCSS()

  const copyCSS = async () => {
    await navigator.clipboard.writeText(flexCSS)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const directionOptions: { value: typeof flexDirection; label: string }[] = [
    { value: 'row', label: 'row' },
    { value: 'row-reverse', label: 'row-reverse' },
    { value: 'column', label: 'column' },
    { value: 'column-reverse', label: 'column-reverse' }
  ]

  const justifyOptions: { value: typeof justifyContent; label: string }[] = [
    { value: 'flex-start', label: 'flex-start' },
    { value: 'flex-end', label: 'flex-end' },
    { value: 'center', label: 'center' },
    { value: 'space-between', label: 'space-between' },
    { value: 'space-around', label: 'space-around' },
    { value: 'space-evenly', label: 'space-evenly' }
  ]

  const alignOptions: { value: typeof alignItems; label: string }[] = [
    { value: 'flex-start', label: 'flex-start' },
    { value: 'flex-end', label: 'flex-end' },
    { value: 'center', label: 'center' },
    { value: 'stretch', label: 'stretch' },
    { value: 'baseline', label: 'baseline' }
  ]

  const wrapOptions: { value: typeof flexWrap; label: string }[] = [
    { value: 'nowrap', label: 'nowrap' },
    { value: 'wrap', label: 'wrap' },
    { value: 'wrap-reverse', label: 'wrap-reverse' }
  ]

  const itemSizes = [
    { w: 60, h: 40 },
    { w: 80, h: 60 },
    { w: 50, h: 50 },
    { w: 70, h: 45 },
    { w: 55, h: 70 },
    { w: 65, h: 55 },
    { w: 75, h: 40 },
    { w: 45, h: 65 }
  ]

  const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500">{t('tools.flexbox.items')}</label>
          <input
            type="number"
            min="1"
            max="8"
            value={itemCount}
            onChange={(e) => setItemCount(Math.min(8, Math.max(1, parseInt(e.target.value) || 1)))}
            className="input w-16 text-center"
          />
        </div>
        <div className="flex-1" />
        <Button variant="secondary" onClick={copyCSS}>
          {copied ? t('common.copied') : t('tools.flexbox.copyCSS')}
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 min-h-[300px] bg-slate-50">
            <div
              className="w-full h-full min-h-[268px] rounded bg-white border border-slate-200"
              style={{
                display: 'flex',
                flexDirection,
                justifyContent,
                alignItems,
                flexWrap,
                gap: `${gap}px`,
                padding: '16px'
              }}
            >
              {Array.from({ length: itemCount }).map((_, i) => (
                <div
                  key={i}
                  className="rounded flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                  style={{
                    backgroundColor: colors[i % colors.length],
                    width: itemSizes[i % itemSizes.length].w,
                    height: alignItems === 'stretch' ? 'auto' : itemSizes[i % itemSizes.length].h,
                    minHeight: itemSizes[i % itemSizes.length].h
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-800 rounded-lg">
            <code className="text-sm text-green-400 whitespace-pre">
              {flexCSS}
            </code>
          </div>
        </div>

        <div className="w-72 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4 max-h-[500px] overflow-auto">
          <h3 className="font-semibold text-slate-700">{t('tools.flexbox.properties')}</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-2">{t('tools.flexbox.direction')}</label>
              <div className="grid grid-cols-2 gap-1">
                {directionOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setFlexDirection(opt.value)}
                    className={`px-2 py-1.5 text-xs rounded ${flexDirection === opt.value ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-2">{t('tools.flexbox.justify')}</label>
              <div className="grid grid-cols-2 gap-1">
                {justifyOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setJustifyContent(opt.value)}
                    className={`px-2 py-1.5 text-xs rounded ${justifyContent === opt.value ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-2">{t('tools.flexbox.align')}</label>
              <div className="grid grid-cols-2 gap-1">
                {alignOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setAlignItems(opt.value)}
                    className={`px-2 py-1.5 text-xs rounded ${alignItems === opt.value ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-2">{t('tools.flexbox.wrap')}</label>
              <div className="grid grid-cols-3 gap-1">
                {wrapOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setFlexWrap(opt.value)}
                    className={`px-2 py-1.5 text-xs rounded ${flexWrap === opt.value ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('tools.flexbox.gap')} ({gap}px)</label>
              <input
                type="range"
                min="0"
                max="32"
                value={gap}
                onChange={(e) => setGap(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.flexbox.hint')}</h4>
            <p className="text-xs text-slate-400">
              {t('tools.flexbox.hintText')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
