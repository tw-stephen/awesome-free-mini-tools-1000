import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface FontPair {
  heading: string
  body: string
  category: string
}

export default function FontPairing() {
  const { t } = useTranslation()
  const [selectedPair, setSelectedPair] = useState(0)
  const [headingText, setHeadingText] = useState('The Quick Brown Fox')
  const [bodyText, setBodyText] = useState(
    'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!'
  )

  const fontPairs: FontPair[] = [
    { heading: 'Playfair Display', body: 'Source Sans Pro', category: 'elegant' },
    { heading: 'Montserrat', body: 'Merriweather', category: 'modern' },
    { heading: 'Oswald', body: 'Open Sans', category: 'bold' },
    { heading: 'Raleway', body: 'Lato', category: 'clean' },
    { heading: 'Roboto Slab', body: 'Roboto', category: 'balanced' },
    { heading: 'Lora', body: 'Source Sans Pro', category: 'classic' },
    { heading: 'PT Serif', body: 'PT Sans', category: 'harmonious' },
    { heading: 'Abril Fatface', body: 'Poppins', category: 'dramatic' },
    { heading: 'Cormorant Garamond', body: 'Fira Sans', category: 'refined' },
    { heading: 'Work Sans', body: 'Bitter', category: 'contemporary' },
    { heading: 'Libre Baskerville', body: 'Montserrat', category: 'traditional' },
    { heading: 'Archivo Black', body: 'Nunito', category: 'impactful' },
  ]

  const currentPair = fontPairs[selectedPair]

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      elegant: 'bg-purple-100 text-purple-800',
      modern: 'bg-blue-100 text-blue-800',
      bold: 'bg-red-100 text-red-800',
      clean: 'bg-green-100 text-green-800',
      balanced: 'bg-yellow-100 text-yellow-800',
      classic: 'bg-indigo-100 text-indigo-800',
      harmonious: 'bg-pink-100 text-pink-800',
      dramatic: 'bg-orange-100 text-orange-800',
      refined: 'bg-teal-100 text-teal-800',
      contemporary: 'bg-cyan-100 text-cyan-800',
      traditional: 'bg-amber-100 text-amber-800',
      impactful: 'bg-rose-100 text-rose-800',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const generateCSSImport = (): string => {
    const heading = currentPair.heading.replace(/ /g, '+')
    const body = currentPair.body.replace(/ /g, '+')
    return `@import url('https://fonts.googleapis.com/css2?family=${heading}:wght@400;700&family=${body}:wght@400;700&display=swap');

h1, h2, h3, h4, h5, h6 {
  font-family: '${currentPair.heading}', serif;
}

body, p {
  font-family: '${currentPair.body}', sans-serif;
}`
  }

  const copyCSS = () => {
    navigator.clipboard.writeText(generateCSSImport())
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {fontPairs.map((pair, index) => (
          <button
            key={index}
            onClick={() => setSelectedPair(index)}
            className={`p-3 rounded border text-left transition ${
              selectedPair === index
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-sm font-medium truncate">{pair.heading}</div>
            <div className="text-xs text-gray-500 truncate">{pair.body}</div>
            <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded ${getCategoryColor(pair.category)}`}>
              {pair.category}
            </span>
          </button>
        ))}
      </div>

      <div className="card p-6 bg-white">
        <link
          href={`https://fonts.googleapis.com/css2?family=${currentPair.heading.replace(/ /g, '+')}:wght@400;700&family=${currentPair.body.replace(/ /g, '+')}:wght@400;700&display=swap`}
          rel="stylesheet"
        />

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">
              {t('tools.fontPairing.heading')}: {currentPair.heading}
            </label>
            <input
              type="text"
              value={headingText}
              onChange={(e) => setHeadingText(e.target.value)}
              className="w-full text-4xl font-bold py-2 border-b border-transparent hover:border-gray-200 focus:border-blue-500 outline-none"
              style={{ fontFamily: `'${currentPair.heading}', serif` }}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">
              {t('tools.fontPairing.body')}: {currentPair.body}
            </label>
            <textarea
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              rows={4}
              className="w-full text-lg py-2 border-b border-transparent hover:border-gray-200 focus:border-blue-500 outline-none resize-none"
              style={{ fontFamily: `'${currentPair.body}', sans-serif`, lineHeight: 1.6 }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-medium mb-2">{t('tools.fontPairing.headingFont')}</h3>
          <div
            className="text-2xl mb-2"
            style={{ fontFamily: `'${currentPair.heading}', serif` }}
          >
            {currentPair.heading}
          </div>
          <div className="text-sm text-gray-500">
            Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-medium mb-2">{t('tools.fontPairing.bodyFont')}</h3>
          <div
            className="text-2xl mb-2"
            style={{ fontFamily: `'${currentPair.body}', sans-serif` }}
          >
            {currentPair.body}
          </div>
          <div className="text-sm text-gray-500">
            Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-2">{t('tools.fontPairing.cssCode')}</h3>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto whitespace-pre-wrap">
          {generateCSSImport()}
        </pre>
      </div>

      <div className="flex gap-2">
        <button
          onClick={copyCSS}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('common.copy')} CSS
        </button>
        <button
          onClick={() => window.open(`https://fonts.google.com/specimen/${currentPair.heading.replace(/ /g, '+')}`, '_blank')}
          className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
        >
          {t('tools.fontPairing.viewOnGoogle')}
        </button>
      </div>
    </div>
  )
}
