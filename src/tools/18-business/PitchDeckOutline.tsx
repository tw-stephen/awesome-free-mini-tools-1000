import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Slide {
  id: string
  title: string
  description: string
  content: string
  tips: string[]
  included: boolean
}

export default function PitchDeckOutline() {
  const { t } = useTranslation()
  const [companyName, setCompanyName] = useState('')
  const [slides, setSlides] = useState<Slide[]>([
    { id: 'title', title: 'Title Slide', description: 'Company name, logo, tagline', content: '', tips: ['Keep it clean and memorable', 'Include your logo', 'Add a compelling tagline'], included: true },
    { id: 'problem', title: 'Problem', description: 'The problem you solve', content: '', tips: ['Focus on customer pain points', 'Use real examples', 'Quantify the problem'], included: true },
    { id: 'solution', title: 'Solution', description: 'How you solve the problem', content: '', tips: ['Keep it simple', 'Show your unique approach', 'Connect to the problem'], included: true },
    { id: 'market', title: 'Market Size', description: 'TAM, SAM, SOM', content: '', tips: ['Use credible sources', 'Show growth trends', 'Define your target market'], included: true },
    { id: 'product', title: 'Product', description: 'Your product/service details', content: '', tips: ['Include screenshots/demos', 'Highlight key features', 'Show the user experience'], included: true },
    { id: 'business', title: 'Business Model', description: 'How you make money', content: '', tips: ['Be clear about pricing', 'Show revenue streams', 'Include unit economics'], included: true },
    { id: 'traction', title: 'Traction', description: 'Progress and milestones', content: '', tips: ['Show growth metrics', 'Include user testimonials', 'Highlight key achievements'], included: true },
    { id: 'competition', title: 'Competition', description: 'Competitive landscape', content: '', tips: ['Show your differentiation', 'Use a positioning matrix', 'Be honest about competitors'], included: true },
    { id: 'team', title: 'Team', description: 'Your team and advisors', content: '', tips: ['Highlight relevant experience', 'Show diversity', 'Include key advisors'], included: true },
    { id: 'financials', title: 'Financials', description: 'Projections and metrics', content: '', tips: ['Show 3-5 year projections', 'Include key assumptions', 'Be realistic'], included: true },
    { id: 'ask', title: 'The Ask', description: 'What you\u0027re raising and use of funds', content: '', tips: ['Be specific about amount', 'Show use of funds', 'Include timeline'], included: true },
    { id: 'contact', title: 'Contact', description: 'How to reach you', content: '', tips: ['Include email and phone', 'Add website and social links', 'Make it easy to follow up'], included: true },
  ])

  const toggleSlide = (id: string) => {
    setSlides(slides.map(s =>
      s.id === id ? { ...s, included: !s.included } : s
    ))
  }

  const updateContent = (id: string, content: string) => {
    setSlides(slides.map(s =>
      s.id === id ? { ...s, content } : s
    ))
  }

  const moveSlide = (id: string, direction: 'up' | 'down') => {
    const index = slides.findIndex(s => s.id === id)
    if (direction === 'up' && index > 0) {
      const newSlides = [...slides]
      ;[newSlides[index - 1], newSlides[index]] = [newSlides[index], newSlides[index - 1]]
      setSlides(newSlides)
    } else if (direction === 'down' && index < slides.length - 1) {
      const newSlides = [...slides]
      ;[newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]]
      setSlides(newSlides)
    }
  }

  const includedSlides = slides.filter(s => s.included)

  const generateOutline = (): string => {
    const company = companyName || '[Company Name]'
    let outline = `PITCH DECK OUTLINE\n${company}\n${'='.repeat(50)}\n\n`
    outline += `Total Slides: ${includedSlides.length}\n\n`

    includedSlides.forEach((slide, i) => {
      outline += `SLIDE ${i + 1}: ${slide.title.toUpperCase()}\n${'─'.repeat(40)}\n`
      outline += `Purpose: ${slide.description}\n`
      if (slide.content) outline += `Notes: ${slide.content}\n`
      outline += `Tips:\n${slide.tips.map(t => `  • ${t}`).join('\n')}\n\n`
    })

    return outline
  }

  const copyOutline = () => {
    navigator.clipboard.writeText(generateOutline())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.pitchDeckOutline.info')}</h3>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Company name..."
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.pitchDeckOutline.slides')}</h3>
          <span className="text-sm text-slate-500">{includedSlides.length} slides</span>
        </div>
        <div className="space-y-2">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`p-3 rounded border ${
                slide.included ? 'bg-white border-blue-200' : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={slide.included}
                  onChange={() => toggleSlide(slide.id)}
                  className="mt-1 rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400">#{index + 1}</span>
                      <span className="font-medium">{slide.title}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => moveSlide(slide.id, 'up')}
                        disabled={index === 0}
                        className="px-2 py-0.5 text-xs bg-slate-100 rounded disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveSlide(slide.id, 'down')}
                        disabled={index === slides.length - 1}
                        className="px-2 py-0.5 text-xs bg-slate-100 rounded disabled:opacity-30"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mb-2">{slide.description}</p>
                  {slide.included && (
                    <>
                      <input
                        type="text"
                        value={slide.content}
                        onChange={(e) => updateContent(slide.id, e.target.value)}
                        placeholder="Your notes for this slide..."
                        className="w-full px-2 py-1 border border-slate-200 rounded text-sm mb-2"
                      />
                      <div className="flex flex-wrap gap-1">
                        {slide.tips.map((tip, i) => (
                          <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
                            {tip}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={copyOutline}
        className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
      >
        {t('tools.pitchDeckOutline.export')}
      </button>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.pitchDeckOutline.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Keep your deck to 10-15 slides</li>
          <li>• Aim for 3-4 minutes per slide</li>
          <li>• Use visuals over text</li>
          <li>• Practice your delivery</li>
        </ul>
      </div>
    </div>
  )
}
