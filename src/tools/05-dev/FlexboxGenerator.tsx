import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function FlexboxGenerator() {
  const { t } = useTranslation()
  const [flexDirection, setFlexDirection] = useState<'row' | 'row-reverse' | 'column' | 'column-reverse'>('row')
  const [justifyContent, setJustifyContent] = useState<'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'>('flex-start')
  const [alignItems, setAlignItems] = useState<'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'>('stretch')
  const [flexWrap, setFlexWrap] = useState<'nowrap' | 'wrap' | 'wrap-reverse'>('nowrap')
  const [gap, setGap] = useState(8)
  const [itemCount, setItemCount] = useState(5)
  const { copy, copied } = useClipboard()

  const cssCode = useMemo(() => {
    const lines = [
      'display: flex;',
      `flex-direction: ${flexDirection};`,
      `justify-content: ${justifyContent};`,
      `align-items: ${alignItems};`,
      `flex-wrap: ${flexWrap};`,
      `gap: ${gap}px;`
    ]
    return lines.join('\n')
  }, [flexDirection, justifyContent, alignItems, flexWrap, gap])

  const items = Array.from({ length: itemCount }, (_, i) => i + 1)

  return (
    <div className="space-y-4">
      <div className="card p-4 bg-slate-100">
        <div
          className="min-h-[200px] p-4 bg-white rounded-lg border-2 border-dashed border-slate-300"
          style={{
            display: 'flex',
            flexDirection,
            justifyContent,
            alignItems,
            flexWrap,
            gap: `${gap}px`
          }}
        >
          {items.map((i) => (
            <div
              key={i}
              className="px-4 py-3 bg-blue-500 text-white rounded font-medium text-center min-w-[60px]"
              style={{ height: i % 2 === 0 ? '60px' : '40px' }}
            >
              {i}
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.flexboxGenerator.containerProperties')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-2">
              flex-direction
            </label>
            <div className="flex flex-wrap gap-2">
              {(['row', 'row-reverse', 'column', 'column-reverse'] as const).map((value) => (
                <button
                  key={value}
                  onClick={() => setFlexDirection(value)}
                  className={`px-3 py-1 text-xs rounded border ${
                    flexDirection === value
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-slate-50 border-slate-300 text-slate-600'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">
              justify-content
            </label>
            <div className="flex flex-wrap gap-2">
              {(['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'] as const).map((value) => (
                <button
                  key={value}
                  onClick={() => setJustifyContent(value)}
                  className={`px-3 py-1 text-xs rounded border ${
                    justifyContent === value
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-slate-50 border-slate-300 text-slate-600'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">
              align-items
            </label>
            <div className="flex flex-wrap gap-2">
              {(['flex-start', 'flex-end', 'center', 'stretch', 'baseline'] as const).map((value) => (
                <button
                  key={value}
                  onClick={() => setAlignItems(value)}
                  className={`px-3 py-1 text-xs rounded border ${
                    alignItems === value
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-slate-50 border-slate-300 text-slate-600'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">
              flex-wrap
            </label>
            <div className="flex flex-wrap gap-2">
              {(['nowrap', 'wrap', 'wrap-reverse'] as const).map((value) => (
                <button
                  key={value}
                  onClick={() => setFlexWrap(value)}
                  className={`px-3 py-1 text-xs rounded border ${
                    flexWrap === value
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-slate-50 border-slate-300 text-slate-600'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">
              gap: {gap}px
            </label>
            <input
              type="range"
              min="0"
              max="32"
              value={gap}
              onChange={(e) => setGap(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">
              {t('tools.flexboxGenerator.itemCount')}: {itemCount}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={itemCount}
              onChange={(e) => setItemCount(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.flexboxGenerator.cssCode')}
          </h3>
          <Button variant="secondary" onClick={() => copy(cssCode)}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>

        <pre className="p-3 bg-slate-50 rounded-lg overflow-x-auto">
          <code className="font-mono text-sm text-slate-800">{cssCode}</code>
        </pre>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.flexboxGenerator.cheatsheet')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded">
            <p className="font-medium text-slate-700 mb-2">flex-direction</p>
            <ul className="space-y-1 text-slate-600">
              <li><code>row</code> - {t('tools.flexboxGenerator.cheatRow')}</li>
              <li><code>column</code> - {t('tools.flexboxGenerator.cheatColumn')}</li>
            </ul>
          </div>
          <div className="p-3 bg-slate-50 rounded">
            <p className="font-medium text-slate-700 mb-2">justify-content</p>
            <ul className="space-y-1 text-slate-600">
              <li><code>flex-start</code> - {t('tools.flexboxGenerator.cheatStart')}</li>
              <li><code>center</code> - {t('tools.flexboxGenerator.cheatCenter')}</li>
              <li><code>space-between</code> - {t('tools.flexboxGenerator.cheatBetween')}</li>
            </ul>
          </div>
          <div className="p-3 bg-slate-50 rounded">
            <p className="font-medium text-slate-700 mb-2">align-items</p>
            <ul className="space-y-1 text-slate-600">
              <li><code>stretch</code> - {t('tools.flexboxGenerator.cheatStretch')}</li>
              <li><code>center</code> - {t('tools.flexboxGenerator.cheatCenterY')}</li>
            </ul>
          </div>
          <div className="p-3 bg-slate-50 rounded">
            <p className="font-medium text-slate-700 mb-2">flex-wrap</p>
            <ul className="space-y-1 text-slate-600">
              <li><code>nowrap</code> - {t('tools.flexboxGenerator.cheatNowrap')}</li>
              <li><code>wrap</code> - {t('tools.flexboxGenerator.cheatWrap')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
