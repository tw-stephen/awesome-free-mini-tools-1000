import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface LogoConcept {
  name: string
  description: string
  style: string
  elements: string[]
  colors: string[]
}

export default function LogoIdeas() {
  const { t } = useTranslation()
  const [brandName, setBrandName] = useState('')
  const [industry, setIndustry] = useState('')
  const [keywords, setKeywords] = useState('')
  const [concepts, setConcepts] = useState<LogoConcept[]>([])

  const industries = [
    'technology', 'healthcare', 'finance', 'education', 'food',
    'fashion', 'sports', 'entertainment', 'travel', 'real-estate',
  ]

  const stylesByIndustry: Record<string, string[]> = {
    technology: ['minimalist', 'geometric', 'futuristic', 'gradient'],
    healthcare: ['clean', 'organic', 'trust', 'caring'],
    finance: ['professional', 'solid', 'trustworthy', 'classic'],
    education: ['friendly', 'approachable', 'growth', 'knowledge'],
    food: ['appetizing', 'fresh', 'organic', 'playful'],
    fashion: ['elegant', 'luxury', 'trendy', 'sophisticated'],
    sports: ['dynamic', 'energetic', 'bold', 'powerful'],
    entertainment: ['fun', 'vibrant', 'creative', 'exciting'],
    travel: ['adventurous', 'global', 'free', 'inspiring'],
    'real-estate': ['stable', 'premium', 'home', 'investment'],
  }

  const elementsByIndustry: Record<string, string[]> = {
    technology: ['circuit', 'pixel', 'connection', 'wave', 'node', 'code'],
    healthcare: ['heart', 'cross', 'leaf', 'hand', 'shield', 'pulse'],
    finance: ['chart', 'arrow', 'building', 'coin', 'graph', 'shield'],
    education: ['book', 'graduation cap', 'lightbulb', 'pencil', 'tree', 'brain'],
    food: ['fork', 'leaf', 'chef hat', 'plate', 'fruit', 'flame'],
    fashion: ['hanger', 'needle', 'fabric', 'mannequin', 'crown', 'diamond'],
    sports: ['ball', 'trophy', 'flame', 'wing', 'star', 'shield'],
    entertainment: ['star', 'spotlight', 'music note', 'camera', 'mask', 'ticket'],
    travel: ['plane', 'globe', 'compass', 'mountain', 'sun', 'wave'],
    'real-estate': ['house', 'key', 'building', 'roof', 'door', 'window'],
  }

  const colorPalettesByIndustry: Record<string, string[][]> = {
    technology: [['#667eea', '#764ba2'], ['#00d2ff', '#3a7bd5'], ['#11998e', '#38ef7d']],
    healthcare: [['#4facfe', '#00f2fe'], ['#43e97b', '#38f9d7'], ['#667eea', '#764ba2']],
    finance: [['#1e3c72', '#2a5298'], ['#134e5e', '#71b280'], ['#373b44', '#4286f4']],
    education: [['#ff512f', '#f09819'], ['#f093fb', '#f5576c'], ['#4facfe', '#00f2fe']],
    food: [['#f12711', '#f5af19'], ['#56ab2f', '#a8e063'], ['#ff416c', '#ff4b2b']],
    fashion: [['#232526', '#414345'], ['#c31432', '#240b36'], ['#d4af37', '#856304']],
    sports: [['#f12711', '#f5af19'], ['#ff416c', '#ff4b2b'], ['#00c6ff', '#0072ff']],
    entertainment: [['#f093fb', '#f5576c'], ['#4facfe', '#00f2fe'], ['#ffecd2', '#fcb69f']],
    travel: [['#00c6ff', '#0072ff'], ['#f093fb', '#f5576c'], ['#11998e', '#38ef7d']],
    'real-estate': [['#1e3c72', '#2a5298'], ['#373b44', '#4286f4'], ['#c31432', '#240b36']],
  }

  const generateConcepts = () => {
    if (!brandName || !industry) return

    const styles = stylesByIndustry[industry] || stylesByIndustry.technology
    const elements = elementsByIndustry[industry] || elementsByIndustry.technology
    const palettes = colorPalettesByIndustry[industry] || colorPalettesByIndustry.technology
    const keywordList = keywords.split(',').map(k => k.trim()).filter(Boolean)

    const newConcepts: LogoConcept[] = []

    // Generate 4 different concepts
    for (let i = 0; i < 4; i++) {
      const style = styles[i % styles.length]
      const selectedElements = [
        elements[Math.floor(Math.random() * elements.length)],
        elements[Math.floor(Math.random() * elements.length)],
      ].filter((v, i, a) => a.indexOf(v) === i)

      const palette = palettes[i % palettes.length]

      const conceptTypes = [
        {
          name: `${brandName} - ${t('tools.logoIdeas.wordmark')}`,
          description: `A clean wordmark logo featuring "${brandName}" with custom typography that conveys ${style} aesthetics.`,
        },
        {
          name: `${brandName} - ${t('tools.logoIdeas.iconLogo')}`,
          description: `An iconic symbol combining ${selectedElements.join(' and ')} elements, representing your ${industry} brand.`,
        },
        {
          name: `${brandName} - ${t('tools.logoIdeas.lettermark')}`,
          description: `A monogram using the initials "${brandName.split(' ').map(w => w[0]).join('').toUpperCase()}" with ${style} styling.`,
        },
        {
          name: `${brandName} - ${t('tools.logoIdeas.combination')}`,
          description: `A combination mark pairing a ${selectedElements[0]} icon with the brand name in a ${style} arrangement.`,
        },
      ]

      const concept = conceptTypes[i]
      newConcepts.push({
        name: concept.name,
        description: concept.description + (keywordList.length ? ` Incorporates: ${keywordList.join(', ')}.` : ''),
        style,
        elements: selectedElements,
        colors: palette,
      })
    }

    setConcepts(newConcepts)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t('tools.logoIdeas.brandName')}</label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="Your Brand Name"
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('tools.logoIdeas.industry')}</label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">{t('tools.logoIdeas.selectIndustry')}</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind.charAt(0).toUpperCase() + ind.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('tools.logoIdeas.keywords')}</label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="innovation, trust, growth (comma separated)"
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          onClick={generateConcepts}
          disabled={!brandName || !industry}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('tools.logoIdeas.generate')}
        </button>
      </div>

      {concepts.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-lg">{t('tools.logoIdeas.concepts')}</h3>

          <div className="grid gap-4">
            {concepts.map((concept, index) => (
              <div key={index} className="card p-4">
                <div className="flex gap-4">
                  <div
                    className="w-24 h-24 rounded-lg flex items-center justify-center text-white font-bold text-2xl shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${concept.colors[0]}, ${concept.colors[1]})`,
                    }}
                  >
                    {brandName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium">{concept.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{concept.description}</p>

                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                        {concept.style}
                      </span>
                      {concept.elements.map((el, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                          {el}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-1 mt-2">
                      {concept.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4 bg-blue-50">
        <h4 className="font-medium text-blue-800 mb-2">{t('tools.logoIdeas.tips')}</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>Keep your logo simple and memorable</li>
          <li>Ensure it works in black and white</li>
          <li>Test at different sizes (favicon to billboard)</li>
          <li>Consider how it will look on different backgrounds</li>
          <li>Make sure it represents your brand values</li>
        </ul>
      </div>
    </div>
  )
}
