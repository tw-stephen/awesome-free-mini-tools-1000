import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

type Template = 'elegant' | 'modern' | 'rustic' | 'floral' | 'minimalist'
type Orientation = 'tent' | 'flat'

interface PlaceCard {
  id: string
  name: string
  tableName: string
  title?: string
}

export default function PlaceCardGenerator() {
  const { t } = useTranslation()
  const [template, setTemplate] = useState<Template>('elegant')
  const [orientation, setOrientation] = useState<Orientation>('tent')
  const [cards, setCards] = useState<PlaceCard[]>([])
  const [bulkInput, setBulkInput] = useState('')
  const [showBulkInput, setShowBulkInput] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [newCard, setNewCard] = useState({
    name: '',
    tableName: '',
    title: ''
  })

  const templateStyles: Record<Template, { bg: string; text: string; accent: string; font: string }> = {
    elegant: { bg: '#faf9f6', text: '#2c2c2c', accent: '#c9a959', font: 'serif' },
    modern: { bg: '#ffffff', text: '#1a1a1a', accent: '#3b82f6', font: 'sans-serif' },
    rustic: { bg: '#f5e6d3', text: '#5c4033', accent: '#8b4513', font: 'serif' },
    floral: { bg: '#fdf2f8', text: '#831843', accent: '#ec4899', font: 'serif' },
    minimalist: { bg: '#f8fafc', text: '#334155', accent: '#94a3b8', font: 'sans-serif' }
  }

  const addCard = () => {
    if (!newCard.name) return
    const card: PlaceCard = {
      id: Date.now().toString(),
      name: newCard.name,
      tableName: newCard.tableName,
      title: newCard.title || undefined
    }
    setCards([...cards, card])
    setNewCard({ name: '', tableName: '', title: '' })
  }

  const addBulkCards = () => {
    const lines = bulkInput.split('\n').filter(line => line.trim())
    const newCards: PlaceCard[] = lines.map((line, index) => {
      const parts = line.split(',').map(p => p.trim())
      return {
        id: `${Date.now()}-${index}`,
        name: parts[0] || '',
        tableName: parts[1] || '',
        title: parts[2] || undefined
      }
    }).filter(c => c.name)

    setCards([...cards, ...newCards])
    setBulkInput('')
    setShowBulkInput(false)
  }

  const deleteCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id))
  }

  const downloadCard = (card: PlaceCard) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const style = templateStyles[template]
    const width = 400
    const height = orientation === 'tent' ? 300 : 200

    canvas.width = width
    canvas.height = height

    // Background
    ctx.fillStyle = style.bg
    ctx.fillRect(0, 0, width, height)

    // Border
    ctx.strokeStyle = style.accent
    ctx.lineWidth = 3
    ctx.strokeRect(15, 15, width - 30, height - 30)

    // Decorative corner elements
    const cornerSize = 20
    ctx.fillStyle = style.accent
    ctx.beginPath()
    ctx.moveTo(20, 20)
    ctx.lineTo(20 + cornerSize, 20)
    ctx.lineTo(20, 20 + cornerSize)
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(width - 20, 20)
    ctx.lineTo(width - 20 - cornerSize, 20)
    ctx.lineTo(width - 20, 20 + cornerSize)
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(20, height - 20)
    ctx.lineTo(20 + cornerSize, height - 20)
    ctx.lineTo(20, height - 20 - cornerSize)
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(width - 20, height - 20)
    ctx.lineTo(width - 20 - cornerSize, height - 20)
    ctx.lineTo(width - 20, height - 20 - cornerSize)
    ctx.fill()

    // Name
    ctx.fillStyle = style.text
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `bold 32px ${style.font}`
    ctx.fillText(card.name, width / 2, height / 2 - (card.tableName ? 15 : 0))

    // Title if exists
    if (card.title) {
      ctx.font = `italic 16px ${style.font}`
      ctx.fillStyle = style.accent
      ctx.fillText(card.title, width / 2, height / 2 - 50)
    }

    // Table name
    if (card.tableName) {
      ctx.font = `18px ${style.font}`
      ctx.fillStyle = style.accent
      ctx.fillText(card.tableName, width / 2, height / 2 + 25)
    }

    // Download
    const link = document.createElement('a')
    link.download = `place-card-${card.name.replace(/\s+/g, '-')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const downloadAll = () => {
    cards.forEach((card, index) => {
      setTimeout(() => downloadCard(card), index * 500)
    })
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.placeCardGenerator.template')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(['elegant', 'modern', 'rustic', 'floral', 'minimalist'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTemplate(t)}
              className={`px-3 py-1.5 rounded text-sm capitalize ${
                template === t ? 'bg-blue-500 text-white' : 'bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.placeCardGenerator.orientation')}
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setOrientation('tent')}
            className={`flex-1 py-2 rounded text-sm ${
              orientation === 'tent' ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.placeCardGenerator.tent')}
          </button>
          <button
            onClick={() => setOrientation('flat')}
            className={`flex-1 py-2 rounded text-sm ${
              orientation === 'flat' ? 'bg-blue-500 text-white' : 'bg-slate-100'
            }`}
          >
            {t('tools.placeCardGenerator.flat')}
          </button>
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <h3 className="text-sm font-medium text-slate-700">
          {t('tools.placeCardGenerator.addCard')}
        </h3>
        <input
          type="text"
          value={newCard.name}
          onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
          placeholder={t('tools.placeCardGenerator.guestName')}
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={newCard.tableName}
            onChange={(e) => setNewCard({ ...newCard, tableName: e.target.value })}
            placeholder={t('tools.placeCardGenerator.tableName')}
            className="px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            value={newCard.title}
            onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
            placeholder={t('tools.placeCardGenerator.title')}
            className="px-3 py-2 border border-slate-300 rounded"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={addCard}
            disabled={!newCard.name}
            className="flex-1 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {t('tools.placeCardGenerator.add')}
          </button>
          <button
            onClick={() => setShowBulkInput(!showBulkInput)}
            className="px-4 py-2 bg-slate-100 rounded"
          >
            {t('tools.placeCardGenerator.bulk')}
          </button>
        </div>
      </div>

      {showBulkInput && (
        <div className="card p-4 space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            {t('tools.placeCardGenerator.bulkInput')}
          </label>
          <textarea
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            placeholder={t('tools.placeCardGenerator.bulkPlaceholder')}
            rows={5}
            className="w-full px-3 py-2 border border-slate-300 rounded font-mono text-sm resize-none"
          />
          <button
            onClick={addBulkCards}
            disabled={!bulkInput}
            className="w-full py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {t('tools.placeCardGenerator.addAll')}
          </button>
        </div>
      )}

      {cards.length > 0 && (
        <>
          <div className="card p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-slate-700">
                {t('tools.placeCardGenerator.cards')} ({cards.length})
              </h3>
              <button
                onClick={downloadAll}
                className="text-sm text-blue-500"
              >
                {t('tools.placeCardGenerator.downloadAll')}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {cards.map(card => (
                <div
                  key={card.id}
                  className="p-3 rounded text-center relative"
                  style={{ backgroundColor: templateStyles[template].bg }}
                >
                  <button
                    onClick={() => deleteCard(card.id)}
                    className="absolute top-1 right-2 text-red-400 hover:text-red-600"
                  >
                    ×
                  </button>
                  {card.title && (
                    <div className="text-xs italic" style={{ color: templateStyles[template].accent }}>
                      {card.title}
                    </div>
                  )}
                  <div className="font-bold" style={{ color: templateStyles[template].text }}>
                    {card.name}
                  </div>
                  {card.tableName && (
                    <div className="text-xs" style={{ color: templateStyles[template].accent }}>
                      {card.tableName}
                    </div>
                  )}
                  <button
                    onClick={() => downloadCard(card)}
                    className="mt-2 text-xs text-blue-500"
                  >
                    {t('tools.placeCardGenerator.download')}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setCards([])}
            className="w-full py-2 bg-red-100 text-red-600 rounded"
          >
            {t('tools.placeCardGenerator.clearAll')}
          </button>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
