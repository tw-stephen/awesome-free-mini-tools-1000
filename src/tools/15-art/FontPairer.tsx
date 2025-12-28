import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface FontPair {
  heading: string
  body: string
  description: string
}

export default function FontPairer() {
  const { t } = useTranslation()
  const [selectedPair, setSelectedPair] = useState(0)
  const [headingText, setHeadingText] = useState('The Art of Typography')
  const [bodyText, setBodyText] = useState('Good typography is invisible. It should communicate without drawing attention to itself. The best fonts work together harmoniously to create a cohesive reading experience.')

  const fontPairs: FontPair[] = [
    { heading: 'Georgia', body: 'Verdana', description: 'Classic & Readable' },
    { heading: 'Palatino Linotype', body: 'Georgia', description: 'Elegant Serif Pair' },
    { heading: 'Impact', body: 'Arial', description: 'Bold Headlines' },
    { heading: 'Trebuchet MS', body: 'Lucida Sans Unicode', description: 'Modern Sans' },
    { heading: 'Georgia', body: 'Arial', description: 'Serif + Sans Mix' },
    { heading: 'Verdana', body: 'Georgia', description: 'Web-Safe Pair' },
    { heading: 'Times New Roman', body: 'Trebuchet MS', description: 'Traditional + Modern' },
    { heading: 'Arial Black', body: 'Arial', description: 'Bold & Clean' },
    { heading: 'Courier New', body: 'Georgia', description: 'Mono + Serif' },
    { heading: 'Comic Sans MS', body: 'Trebuchet MS', description: 'Casual & Friendly' },
  ]

  const currentPair = fontPairs[selectedPair]

  const copyCSS = () => {
    const css = `/* Heading */
font-family: "${currentPair.heading}", serif;

/* Body */
font-family: "${currentPair.body}", sans-serif;`
    navigator.clipboard.writeText(css)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.fontPairer.preview')}</h3>
        <div className="p-6 bg-white border border-slate-200 rounded-lg">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ fontFamily: `"${currentPair.heading}", serif` }}
          >
            {headingText}
          </h2>
          <p
            className="text-base leading-relaxed text-slate-600"
            style={{ fontFamily: `"${currentPair.body}", sans-serif` }}
          >
            {bodyText}
          </p>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.fontPairer.customText')}</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={headingText}
            onChange={(e) => setHeadingText(e.target.value)}
            placeholder="Heading text"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <textarea
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            placeholder="Body text"
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.fontPairer.fontPairs')}</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {fontPairs.map((pair, i) => (
            <button
              key={i}
              onClick={() => setSelectedPair(i)}
              className={`w-full p-3 rounded-lg text-left transition-all ${
                selectedPair === i
                  ? 'bg-blue-50 border-2 border-blue-500'
                  : 'bg-slate-50 border-2 border-transparent hover:border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium" style={{ fontFamily: pair.heading }}>
                  {pair.heading}
                </span>
                <span className="text-xs text-slate-400">Heading</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600" style={{ fontFamily: pair.body }}>
                  {pair.body}
                </span>
                <span className="text-xs text-slate-400">Body</span>
              </div>
              <div className="text-xs text-blue-500 mt-1">{pair.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.fontPairer.comparison')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-500 mb-2">Heading Font</div>
            <div
              className="text-2xl font-bold"
              style={{ fontFamily: `"${currentPair.heading}", serif` }}
            >
              {currentPair.heading}
            </div>
            <div
              className="mt-2"
              style={{ fontFamily: `"${currentPair.heading}", serif` }}
            >
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
              abcdefghijklmnopqrstuvwxyz<br />
              0123456789
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-500 mb-2">Body Font</div>
            <div
              className="text-2xl"
              style={{ fontFamily: `"${currentPair.body}", sans-serif` }}
            >
              {currentPair.body}
            </div>
            <div
              className="mt-2"
              style={{ fontFamily: `"${currentPair.body}", sans-serif` }}
            >
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
              abcdefghijklmnopqrstuvwxyz<br />
              0123456789
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4 bg-slate-800 text-white font-mono text-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400">/* CSS */</span>
          <button
            onClick={copyCSS}
            className="px-2 py-1 bg-slate-700 rounded text-xs hover:bg-slate-600"
          >
            Copy
          </button>
        </div>
        <pre>{`/* Heading */
font-family: "${currentPair.heading}", serif;

/* Body */
font-family: "${currentPair.body}", sans-serif;`}</pre>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.fontPairer.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.fontPairer.tip1')}</li>
          <li>• {t('tools.fontPairer.tip2')}</li>
          <li>• {t('tools.fontPairer.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
