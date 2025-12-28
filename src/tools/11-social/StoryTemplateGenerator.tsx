import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

type Template = 'announcement' | 'question' | 'poll' | 'countdown' | 'quote' | 'promo' | 'ama'
type Theme = 'minimal' | 'bold' | 'gradient' | 'dark' | 'playful'

export default function StoryTemplateGenerator() {
  const { t } = useTranslation()
  const [template, setTemplate] = useState<Template>('announcement')
  const [theme, setTheme] = useState<Theme>('minimal')
  const [mainText, setMainText] = useState('')
  const [subText, setSubText] = useState('')
  const [ctaText, setCtaText] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const templateLabels: Record<Template, string> = {
    announcement: 'Announcement',
    question: 'Question',
    poll: 'This or That',
    countdown: 'Countdown',
    quote: 'Quote',
    promo: 'Promo',
    ama: 'AMA'
  }

  const templateDefaults: Record<Template, { main: string; sub: string; cta: string }> = {
    announcement: { main: 'BIG NEWS!', sub: 'Something amazing is coming...', cta: 'Stay tuned' },
    question: { main: 'Quick Question', sub: 'What would you choose?', cta: 'Reply in DMs!' },
    poll: { main: 'THIS or THAT?', sub: 'Let me know your pick!', cta: 'React with 👈 or 👉' },
    countdown: { main: 'COMING SOON', sub: '3 DAYS LEFT', cta: 'Mark your calendar' },
    quote: { main: '"Your quote here"', sub: '- Author Name', cta: '' },
    promo: { main: 'SPECIAL OFFER', sub: '50% OFF', cta: 'Link in bio' },
    ama: { main: 'Ask Me Anything!', sub: 'Drop your questions below', cta: 'Best questions answered!' }
  }

  const themeStyles: Record<Theme, { bg: string; primary: string; secondary: string; accent: string }> = {
    minimal: { bg: '#ffffff', primary: '#1a1a1a', secondary: '#64748b', accent: '#3b82f6' },
    bold: { bg: '#ff6b6b', primary: '#ffffff', secondary: '#fff5f5', accent: '#ffd93d' },
    gradient: { bg: 'gradient', primary: '#ffffff', secondary: '#e2e8f0', accent: '#ffffff' },
    dark: { bg: '#1a1a1a', primary: '#ffffff', secondary: '#94a3b8', accent: '#8b5cf6' },
    playful: { bg: '#fef08a', primary: '#1a1a1a', secondary: '#78350f', accent: '#f97316' }
  }

  const downloadStory = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 1080
    const height = 1920

    canvas.width = width
    canvas.height = height

    const style = themeStyles[theme]

    // Background
    if (theme === 'gradient') {
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#667eea')
      gradient.addColorStop(0.5, '#764ba2')
      gradient.addColorStop(1, '#f093fb')
      ctx.fillStyle = gradient
    } else {
      ctx.fillStyle = style.bg
    }
    ctx.fillRect(0, 0, width, height)

    // Decorative elements based on template
    if (template === 'announcement' || template === 'promo') {
      // Stars/sparkles
      ctx.fillStyle = style.accent
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const size = Math.random() * 8 + 4
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    if (template === 'poll') {
      // Left/right sections
      ctx.fillStyle = style.accent
      ctx.globalAlpha = 0.1
      ctx.fillRect(0, height / 2, width / 2, height / 2)
      ctx.fillRect(width / 2, height / 2, width / 2, height / 2)
      ctx.globalAlpha = 1

      ctx.strokeStyle = style.primary
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(width / 2, height / 2 - 100)
      ctx.lineTo(width / 2, height - 200)
      ctx.stroke()
    }

    // Main text
    const main = mainText || templateDefaults[template].main
    ctx.fillStyle = style.primary
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Calculate font size based on text length
    let fontSize = 120
    if (main.length > 20) fontSize = 90
    if (main.length > 40) fontSize = 70

    ctx.font = `bold ${fontSize}px sans-serif`

    // Word wrap for main text
    const maxWidth = width - 160
    const words = main.split(' ')
    const lines: string[] = []
    let currentLine = ''

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    }
    lines.push(currentLine)

    const lineHeight = fontSize * 1.2
    const totalHeight = lines.length * lineHeight
    const startY = height / 2 - totalHeight / 2

    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight)
    })

    // Sub text
    const sub = subText || templateDefaults[template].sub
    ctx.fillStyle = style.secondary
    ctx.font = '48px sans-serif'
    ctx.fillText(sub, width / 2, startY + totalHeight + 80)

    // CTA
    const cta = ctaText || templateDefaults[template].cta
    if (cta) {
      ctx.fillStyle = style.accent
      ctx.fillRect(width / 2 - 200, height - 300, 400, 80)
      ctx.fillStyle = theme === 'gradient' ? '#667eea' : style.bg === '#ffffff' ? style.primary : style.bg
      ctx.font = 'bold 36px sans-serif'
      ctx.fillText(cta, width / 2, height - 260)
    }

    // Download
    const link = document.createElement('a')
    link.download = `story-${template}-${theme}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const applyDefaults = () => {
    setMainText(templateDefaults[template].main)
    setSubText(templateDefaults[template].sub)
    setCtaText(templateDefaults[template].cta)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.storyTemplateGenerator.template')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['announcement', 'question', 'poll', 'countdown', 'quote', 'promo', 'ama'] as const).map(tmp => (
            <button
              key={tmp}
              onClick={() => setTemplate(tmp)}
              className={`px-3 py-1.5 rounded text-sm ${
                template === tmp ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {templateLabels[tmp]}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.storyTemplateGenerator.theme')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['minimal', 'bold', 'gradient', 'dark', 'playful'] as const).map(th => (
            <button
              key={th}
              onClick={() => setTheme(th)}
              className={`px-3 py-1.5 rounded text-sm capitalize ${
                theme === th ? 'bg-blue-500 text-white' : ''
              }`}
              style={{
                backgroundColor: theme === th ? themeStyles[th].bg === 'gradient' ? '#667eea' : themeStyles[th].bg : '#f1f5f9',
                color: theme === th ? (th === 'minimal' || th === 'playful' ? '#1a1a1a' : '#ffffff') : '#1a1a1a'
              }}
            >
              {th}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.storyTemplateGenerator.content')}
          </h3>
          <button
            onClick={applyDefaults}
            className="text-xs text-blue-500"
          >
            {t('tools.storyTemplateGenerator.useDefaults')}
          </button>
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">
            {t('tools.storyTemplateGenerator.mainText')}
          </label>
          <input
            type="text"
            value={mainText}
            onChange={(e) => setMainText(e.target.value)}
            placeholder={templateDefaults[template].main}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">
            {t('tools.storyTemplateGenerator.subText')}
          </label>
          <input
            type="text"
            value={subText}
            onChange={(e) => setSubText(e.target.value)}
            placeholder={templateDefaults[template].sub}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">
            {t('tools.storyTemplateGenerator.cta')}
          </label>
          <input
            type="text"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            placeholder={templateDefaults[template].cta}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.storyTemplateGenerator.preview')}
        </h3>
        <div
          className="mx-auto rounded-lg overflow-hidden"
          style={{
            width: '180px',
            height: '320px',
            background: theme === 'gradient'
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
              : themeStyles[theme].bg
          }}
        >
          <div className="h-full flex flex-col items-center justify-center p-4 text-center">
            <div
              className="font-bold text-sm mb-1"
              style={{ color: themeStyles[theme].primary }}
            >
              {mainText || templateDefaults[template].main}
            </div>
            <div
              className="text-xs mb-3"
              style={{ color: themeStyles[theme].secondary }}
            >
              {subText || templateDefaults[template].sub}
            </div>
            {(ctaText || templateDefaults[template].cta) && (
              <div
                className="px-3 py-1 rounded text-xs"
                style={{
                  backgroundColor: themeStyles[theme].accent,
                  color: theme === 'gradient' ? '#667eea' : themeStyles[theme].bg === '#ffffff' ? themeStyles[theme].primary : themeStyles[theme].bg
                }}
              >
                {ctaText || templateDefaults[template].cta}
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={downloadStory}
        className="w-full py-3 bg-blue-500 text-white rounded font-medium"
      >
        {t('tools.storyTemplateGenerator.download')} (1080x1920)
      </button>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
