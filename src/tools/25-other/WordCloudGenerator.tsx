import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

interface Word {
  text: string
  weight: number
  x: number
  y: number
  fontSize: number
  color: string
  rotation: number
}

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

export default function WordCloudGenerator() {
  const { t } = useTranslation()
  const svgRef = useRef<SVGSVGElement>(null)

  const [inputText, setInputText] = useState(`React JavaScript TypeScript CSS HTML Node Python Java Kotlin Swift Rust Go Ruby PHP Laravel Django Flask Express MongoDB PostgreSQL MySQL Redis Docker Kubernetes AWS Azure Cloud Frontend Backend Fullstack Developer Engineer Software Code Programming API REST GraphQL`)
  const [words, setWords] = useState<Word[]>([])
  const [minFontSize, setMinFontSize] = useState(14)
  const [maxFontSize, setMaxFontSize] = useState(48)
  const [allowRotation, setAllowRotation] = useState(true)

  const chartWidth = 600
  const chartHeight = 400

  const generateCloud = () => {
    const wordCounts = new Map<string, number>()

    // Count words
    inputText
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2)
      .forEach(word => {
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1)
      })

    // Sort by count and take top 50
    const sortedWords = Array.from(wordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50)

    if (sortedWords.length === 0) {
      setWords([])
      return
    }

    const maxCount = sortedWords[0][1]
    const minCount = sortedWords[sortedWords.length - 1][1]
    const countRange = maxCount - minCount || 1

    // Place words with simple spiral algorithm
    const placedWords: Word[] = []
    const occupied: { x: number; y: number; w: number; h: number }[] = []

    const checkOverlap = (x: number, y: number, w: number, h: number) => {
      for (const rect of occupied) {
        if (
          x < rect.x + rect.w &&
          x + w > rect.x &&
          y < rect.y + rect.h &&
          y + h > rect.y
        ) {
          return true
        }
      }
      return false
    }

    sortedWords.forEach(([text, count], index) => {
      const normalized = (count - minCount) / countRange
      const fontSize = minFontSize + normalized * (maxFontSize - minFontSize)
      const color = COLORS[index % COLORS.length]
      const rotation = allowRotation && Math.random() > 0.7 ? (Math.random() > 0.5 ? 90 : -90) : 0

      // Estimate word dimensions
      const charWidth = fontSize * 0.6
      const wordWidth = text.length * charWidth
      const wordHeight = fontSize * 1.2

      // Spiral placement
      let placed = false
      let angle = 0
      let radius = 0
      const centerX = chartWidth / 2
      const centerY = chartHeight / 2

      while (!placed && radius < Math.max(chartWidth, chartHeight) / 2) {
        const x = centerX + Math.cos(angle) * radius - wordWidth / 2
        const y = centerY + Math.sin(angle) * radius - wordHeight / 2

        if (
          x > 10 &&
          x + wordWidth < chartWidth - 10 &&
          y > 10 &&
          y + wordHeight < chartHeight - 10 &&
          !checkOverlap(x, y, wordWidth, wordHeight)
        ) {
          placedWords.push({
            text,
            weight: count,
            x: x + wordWidth / 2,
            y: y + wordHeight / 2,
            fontSize,
            color,
            rotation
          })
          occupied.push({ x, y, w: wordWidth, h: wordHeight })
          placed = true
        }

        angle += 0.5
        radius += 0.5
      }
    })

    setWords(placedWords)
  }

  useEffect(() => {
    generateCloud()
  }, [])

  const downloadImage = () => {
    if (!svgRef.current) return
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    canvas.width = chartWidth
    canvas.height = chartHeight
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        const a = document.createElement('a')
        a.download = 'word-cloud.png'
        a.href = canvas.toDataURL('image/png')
        a.click()
      }
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button onClick={generateCloud}>{t('tools.wordCloud.generate')}</Button>
        <div className="flex items-center gap-2 ml-4">
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={allowRotation} onChange={(e) => setAllowRotation(e.target.checked)} className="rounded" />
            {t('tools.wordCloud.rotation')}
          </label>
          <label className="flex items-center gap-2 text-sm">
            {t('tools.wordCloud.minSize')}:
            <input type="number" min="8" max="24" value={minFontSize} onChange={(e) => setMinFontSize(parseInt(e.target.value) || 14)} className="input w-16 py-1" />
          </label>
          <label className="flex items-center gap-2 text-sm">
            {t('tools.wordCloud.maxSize')}:
            <input type="number" min="24" max="72" value={maxFontSize} onChange={(e) => setMaxFontSize(parseInt(e.target.value) || 48)} className="input w-16 py-1" />
          </label>
        </div>
        <div className="flex-1" />
        <Button variant="secondary" onClick={downloadImage}>{t('common.download')}</Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.wordCloud.inputLabel')}</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('tools.wordCloud.placeholder')}
              className="input w-full h-32 resize-none"
            />
          </div>

          <div className="border border-slate-200 rounded-lg bg-white overflow-hidden shadow-inner">
            <svg ref={svgRef} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full select-none">
              <rect width={chartWidth} height={chartHeight} fill="white" />

              {words.map((word, index) => (
                <text
                  key={index}
                  x={word.x}
                  y={word.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={word.fontSize}
                  fontWeight={word.fontSize > 30 ? '700' : '500'}
                  fill={word.color}
                  transform={word.rotation ? `rotate(${word.rotation}, ${word.x}, ${word.y})` : undefined}
                  className="select-none"
                >
                  {word.text}
                </text>
              ))}

              {words.length === 0 && (
                <text x={chartWidth / 2} y={chartHeight / 2} textAnchor="middle" fontSize="16" fill="#94a3b8">
                  {t('tools.wordCloud.empty')}
                </text>
              )}
            </svg>
          </div>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.wordCloud.stats')}</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">{t('tools.wordCloud.totalWords')}:</span>
              <span className="text-slate-700 font-medium">{words.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t('tools.wordCloud.uniqueWords')}:</span>
              <span className="text-slate-700 font-medium">{new Set(inputText.toLowerCase().split(/\s+/).filter(w => w.length > 2)).size}</span>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.wordCloud.topWords')}</h4>
            <div className="space-y-1 max-h-48 overflow-auto">
              {words.slice(0, 15).map((word, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: word.color }} />
                  <span className="flex-1 truncate">{word.text}</span>
                  <span className="text-slate-400">{word.weight}x</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-200 text-xs text-slate-400">
            {t('tools.wordCloud.hint')}
          </div>
        </div>
      </div>
    </div>
  )
}
