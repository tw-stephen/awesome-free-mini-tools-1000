import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Slide {
  id: string
  title: string
  points: string[]
  notes: string
  duration: number
}

interface Presentation {
  id: string
  title: string
  author: string
  slides: Slide[]
  createdAt: string
}

export default function PresentationOutline() {
  const { t } = useTranslation()
  const [presentations, setPresentations] = useState<Presentation[]>([])
  const [current, setCurrent] = useState<Presentation | null>(null)
  const [_editingSlide, _setEditingSlide] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('presentations')
    if (saved) setPresentations(JSON.parse(saved))
  }, [])

  const savePresentations = (updated: Presentation[]) => {
    setPresentations(updated)
    localStorage.setItem('presentations', JSON.stringify(updated))
  }

  const createPresentation = () => {
    const presentation: Presentation = {
      id: Date.now().toString(),
      title: t('tools.presentationOutline.newPresentation'),
      author: '',
      slides: [
        { id: '1', title: t('tools.presentationOutline.titleSlide'), points: [], notes: '', duration: 1 }
      ],
      createdAt: new Date().toISOString()
    }
    setCurrent(presentation)
  }

  const savePresentation = () => {
    if (!current) return
    const exists = presentations.find(p => p.id === current.id)
    if (exists) {
      savePresentations(presentations.map(p => p.id === current.id ? current : p))
    } else {
      savePresentations([current, ...presentations])
    }
  }

  const deletePresentation = (id: string) => {
    savePresentations(presentations.filter(p => p.id !== id))
    if (current?.id === id) setCurrent(null)
  }

  const addSlide = () => {
    if (!current) return
    const slide: Slide = {
      id: Date.now().toString(),
      title: t('tools.presentationOutline.newSlide'),
      points: [],
      notes: '',
      duration: 2
    }
    setCurrent({ ...current, slides: [...current.slides, slide] })
  }

  const updateSlide = (slideId: string, updates: Partial<Slide>) => {
    if (!current) return
    setCurrent({
      ...current,
      slides: current.slides.map(s => s.id === slideId ? { ...s, ...updates } : s)
    })
  }

  const deleteSlide = (slideId: string) => {
    if (!current || current.slides.length <= 1) return
    setCurrent({
      ...current,
      slides: current.slides.filter(s => s.id !== slideId)
    })
  }

  const moveSlide = (slideId: string, direction: 'up' | 'down') => {
    if (!current) return
    const index = current.slides.findIndex(s => s.id === slideId)
    if (index === -1) return
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= current.slides.length) return

    const slides = [...current.slides]
    ;[slides[index], slides[newIndex]] = [slides[newIndex], slides[index]]
    setCurrent({ ...current, slides })
  }

  const addPoint = (slideId: string, point: string) => {
    if (!point.trim()) return
    const slide = current?.slides.find(s => s.id === slideId)
    if (!slide) return
    updateSlide(slideId, { points: [...slide.points, point.trim()] })
  }

  const removePoint = (slideId: string, index: number) => {
    const slide = current?.slides.find(s => s.id === slideId)
    if (!slide) return
    updateSlide(slideId, { points: slide.points.filter((_, i) => i !== index) })
  }

  const totalDuration = current?.slides.reduce((sum, s) => sum + s.duration, 0) || 0

  const generateText = () => {
    if (!current) return ''
    let text = `${current.title}\n`
    text += `${current.author ? `By: ${current.author}\n` : ''}`
    text += `${'='.repeat(50)}\n\n`

    current.slides.forEach((slide, index) => {
      text += `Slide ${index + 1}: ${slide.title} (${slide.duration} min)\n`
      text += `${'-'.repeat(30)}\n`
      slide.points.forEach(point => {
        text += `  • ${point}\n`
      })
      if (slide.notes) {
        text += `\nNotes: ${slide.notes}\n`
      }
      text += '\n'
    })

    text += `${'='.repeat(50)}\n`
    text += `Total Duration: ${totalDuration} minutes\n`
    text += `Total Slides: ${current.slides.length}`

    return text
  }

  const copyOutline = () => {
    navigator.clipboard.writeText(generateText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      {!current ? (
        <>
          <button
            onClick={createPresentation}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            + {t('tools.presentationOutline.create')}
          </button>

          {presentations.length > 0 && (
            <div className="card p-4">
              <h3 className="font-medium text-slate-700 mb-3">{t('tools.presentationOutline.saved')}</h3>
              <div className="space-y-2">
                {presentations.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                    <div onClick={() => setCurrent(p)} className="flex-1 cursor-pointer">
                      <div className="font-medium">{p.title}</div>
                      <div className="text-xs text-slate-500">
                        {p.slides.length} {t('tools.presentationOutline.slides')} • {new Date(p.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <button onClick={() => deletePresentation(p.id)} className="text-red-500">×</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrent(null)} className="px-3 py-2 bg-slate-100 rounded">←</button>
            <input
              type="text"
              value={current.title}
              onChange={(e) => setCurrent({ ...current, title: e.target.value })}
              className="flex-1 px-3 py-2 border border-slate-300 rounded font-medium"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="card p-3 text-center">
              <div className="text-xl font-bold">{current.slides.length}</div>
              <div className="text-xs text-slate-500">{t('tools.presentationOutline.slides')}</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-xl font-bold">{totalDuration}</div>
              <div className="text-xs text-slate-500">{t('tools.presentationOutline.minutes')}</div>
            </div>
            <div className="card p-3 text-center">
              <div className="text-xl font-bold">{current.slides.reduce((sum, s) => sum + s.points.length, 0)}</div>
              <div className="text-xs text-slate-500">{t('tools.presentationOutline.points')}</div>
            </div>
          </div>

          <input
            type="text"
            value={current.author}
            onChange={(e) => setCurrent({ ...current, author: e.target.value })}
            placeholder={t('tools.presentationOutline.author')}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />

          <div className="space-y-3">
            {current.slides.map((slide, index) => (
              <div key={slide.id} className="card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveSlide(slide.id, 'up')}
                      disabled={index === 0}
                      className="text-xs text-slate-400 disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveSlide(slide.id, 'down')}
                      disabled={index === current.slides.length - 1}
                      className="text-xs text-slate-400 disabled:opacity-30"
                    >
                      ▼
                    </button>
                  </div>
                  <span className="text-sm text-slate-400 w-8">#{index + 1}</span>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => updateSlide(slide.id, { title: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded font-medium"
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={slide.duration}
                      onChange={(e) => updateSlide(slide.id, { duration: parseInt(e.target.value) || 1 })}
                      min="1"
                      className="w-16 px-2 py-2 border border-slate-300 rounded text-center"
                    />
                    <span className="text-xs text-slate-500">min</span>
                  </div>
                  <button
                    onClick={() => deleteSlide(slide.id)}
                    disabled={current.slides.length <= 1}
                    className="text-red-500 disabled:opacity-30"
                  >
                    ×
                  </button>
                </div>

                <div className="mb-2">
                  <div className="text-xs text-slate-500 mb-1">{t('tools.presentationOutline.bulletPoints')}</div>
                  <div className="space-y-1 mb-2">
                    {slide.points.map((point, i) => (
                      <div key={i} className="flex items-center gap-2 pl-2">
                        <span className="text-slate-400">•</span>
                        <span className="flex-1 text-sm">{point}</span>
                        <button onClick={() => removePoint(slide.id, i)} className="text-red-500 text-xs">×</button>
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder={t('tools.presentationOutline.addPoint')}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addPoint(slide.id, e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                </div>

                <div>
                  <div className="text-xs text-slate-500 mb-1">{t('tools.presentationOutline.speakerNotes')}</div>
                  <textarea
                    value={slide.notes}
                    onChange={(e) => updateSlide(slide.id, { notes: e.target.value })}
                    placeholder={t('tools.presentationOutline.notesPlaceholder')}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm resize-none"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addSlide}
            className="w-full py-2 border-2 border-dashed border-slate-300 rounded text-slate-500"
          >
            + {t('tools.presentationOutline.addSlide')}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={copyOutline}
              className={`py-2 rounded font-medium ${copied ? 'bg-green-500 text-white' : 'bg-slate-100'}`}
            >
              {copied ? '✓' : t('tools.presentationOutline.copy')}
            </button>
            <button
              onClick={savePresentation}
              className="py-2 bg-blue-500 text-white rounded font-medium"
            >
              {t('tools.presentationOutline.save')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
