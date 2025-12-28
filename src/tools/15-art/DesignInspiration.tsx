import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Inspiration {
  id: number
  category: string
  title: string
  colors: string[]
  style: string
  elements: string[]
}

export default function DesignInspiration() {
  const { t } = useTranslation()
  const [category, setCategory] = useState<'all' | 'web' | 'mobile' | 'print' | 'brand'>('all')

  const inspirations: Inspiration[] = [
    {
      id: 1,
      category: 'web',
      title: 'Clean Corporate',
      colors: ['#1F2937', '#3B82F6', '#F3F4F6', '#FFFFFF'],
      style: 'Minimalist, Professional',
      elements: ['Serif headings', 'Ample whitespace', 'Blue accents', 'Card layouts']
    },
    {
      id: 2,
      category: 'web',
      title: 'Bold Startup',
      colors: ['#7C3AED', '#EC4899', '#F59E0B', '#1F2937'],
      style: 'Vibrant, Modern',
      elements: ['Gradient backgrounds', 'Large typography', 'Rounded corners', 'Illustrations']
    },
    {
      id: 3,
      category: 'mobile',
      title: 'Dark Mode App',
      colors: ['#111827', '#1F2937', '#10B981', '#FFFFFF'],
      style: 'Sleek, Modern',
      elements: ['Dark backgrounds', 'Green accents', 'Soft shadows', 'Card-based UI']
    },
    {
      id: 4,
      category: 'mobile',
      title: 'Playful App',
      colors: ['#FEF3C7', '#F59E0B', '#EF4444', '#1F2937'],
      style: 'Fun, Engaging',
      elements: ['Warm colors', 'Rounded buttons', 'Emoji usage', 'Micro-interactions']
    },
    {
      id: 5,
      category: 'print',
      title: 'Luxury Magazine',
      colors: ['#1F2937', '#B8860B', '#FFFFFF', '#F5F5DC'],
      style: 'Elegant, Sophisticated',
      elements: ['Gold accents', 'Serif typography', 'High contrast', 'Editorial layout']
    },
    {
      id: 6,
      category: 'print',
      title: 'Tech Poster',
      colors: ['#000000', '#00FF00', '#0066FF', '#FFFFFF'],
      style: 'Futuristic, Bold',
      elements: ['Neon colors', 'Grid patterns', 'Monospace fonts', 'Geometric shapes']
    },
    {
      id: 7,
      category: 'brand',
      title: 'Eco-Friendly',
      colors: ['#059669', '#34D399', '#FEF3C7', '#1F2937'],
      style: 'Natural, Trustworthy',
      elements: ['Green tones', 'Organic shapes', 'Nature imagery', 'Clean design']
    },
    {
      id: 8,
      category: 'brand',
      title: 'Creative Agency',
      colors: ['#EC4899', '#8B5CF6', '#F97316', '#1F2937'],
      style: 'Creative, Dynamic',
      elements: ['Bold gradients', 'Asymmetric layouts', 'Custom fonts', 'Motion design']
    },
  ]

  const filteredInspirations = category === 'all'
    ? inspirations
    : inspirations.filter(i => i.category === category)

  const generateRandomPalette = (): string[] => {
    const colors: string[] = []
    for (let i = 0; i < 4; i++) {
      colors.push('#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'))
    }
    return colors
  }

  const [randomPalette, setRandomPalette] = useState<string[]>(generateRandomPalette())

  const copyColors = (colors: string[]) => {
    navigator.clipboard.writeText(colors.join(', '))
  }

  const categories = [
    { id: 'all', name: 'All', icon: '🎨' },
    { id: 'web', name: 'Web', icon: '🌐' },
    { id: 'mobile', name: 'Mobile', icon: '📱' },
    { id: 'print', name: 'Print', icon: '📄' },
    { id: 'brand', name: 'Brand', icon: '✨' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.designInspiration.category')}</h3>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id as any)}
              className={`px-4 py-2 rounded-lg ${
                category === cat.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.designInspiration.randomPalette')}</h3>
          <button
            onClick={() => setRandomPalette(generateRandomPalette())}
            className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
          >
            Regenerate
          </button>
        </div>
        <div className="flex rounded-lg overflow-hidden h-16 mb-2">
          {randomPalette.map((color, i) => (
            <div
              key={i}
              className="flex-1 cursor-pointer hover:scale-105 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        <button
          onClick={() => copyColors(randomPalette)}
          className="w-full py-2 bg-slate-100 rounded text-sm hover:bg-slate-200"
        >
          {t('tools.designInspiration.copyColors')}
        </button>
      </div>

      <div className="grid gap-4">
        {filteredInspirations.map((insp) => (
          <div key={insp.id} className="card p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium">{insp.title}</h3>
                <span className="text-sm text-slate-500">{insp.style}</span>
              </div>
              <span className="px-2 py-1 bg-slate-100 rounded text-xs capitalize">
                {insp.category}
              </span>
            </div>

            <div className="flex rounded-lg overflow-hidden h-12 mb-3">
              {insp.colors.map((color, i) => (
                <div
                  key={i}
                  className="flex-1 cursor-pointer"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>

            <div className="flex gap-1 flex-wrap mb-3">
              {insp.colors.map((color, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-slate-100 rounded text-xs font-mono"
                >
                  {color}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {insp.elements.map((element, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                >
                  {element}
                </span>
              ))}
            </div>

            <button
              onClick={() => copyColors(insp.colors)}
              className="w-full mt-3 py-2 bg-slate-100 rounded text-sm hover:bg-slate-200"
            >
              {t('tools.designInspiration.copyColors')}
            </button>
          </div>
        ))}
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.designInspiration.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.designInspiration.tip1')}</li>
          <li>• {t('tools.designInspiration.tip2')}</li>
          <li>• {t('tools.designInspiration.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
