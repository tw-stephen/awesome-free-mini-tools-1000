import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Section {
  id: string
  title: string
  points: string[]
}

interface Outline {
  id: number
  title: string
  thesis: string
  sections: Section[]
  conclusion: string
  date: string
}

export default function EssayOutliner() {
  const { t } = useTranslation()
  const [outlines, setOutlines] = useState<Outline[]>([])
  const [mode, setMode] = useState<'list' | 'edit'>('list')
  const [current, setCurrent] = useState<Outline | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('essay-outlines')
    if (saved) {
      try {
        setOutlines(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load outlines')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('essay-outlines', JSON.stringify(outlines))
  }, [outlines])

  const createNew = () => {
    setCurrent({
      id: Date.now(),
      title: '',
      thesis: '',
      sections: [
        { id: '1', title: t('tools.essayOutliner.introduction'), points: [''] },
        { id: '2', title: t('tools.essayOutliner.bodyParagraph') + ' 1', points: [''] },
        { id: '3', title: t('tools.essayOutliner.bodyParagraph') + ' 2', points: [''] },
        { id: '4', title: t('tools.essayOutliner.bodyParagraph') + ' 3', points: [''] },
      ],
      conclusion: '',
      date: new Date().toISOString().split('T')[0],
    })
    setMode('edit')
  }

  const save = () => {
    if (!current) return

    const existing = outlines.find(o => o.id === current.id)
    if (existing) {
      setOutlines(outlines.map(o => o.id === current.id ? current : o))
    } else {
      setOutlines([current, ...outlines])
    }
    setMode('list')
  }

  const deleteOutline = (id: number) => {
    setOutlines(outlines.filter(o => o.id !== id))
  }

  const updateSection = (sectionId: string, title: string) => {
    if (!current) return
    setCurrent({
      ...current,
      sections: current.sections.map(s =>
        s.id === sectionId ? { ...s, title } : s
      ),
    })
  }

  const updatePoint = (sectionId: string, pointIndex: number, value: string) => {
    if (!current) return
    setCurrent({
      ...current,
      sections: current.sections.map(s =>
        s.id === sectionId
          ? { ...s, points: s.points.map((p, i) => i === pointIndex ? value : p) }
          : s
      ),
    })
  }

  const addPoint = (sectionId: string) => {
    if (!current) return
    setCurrent({
      ...current,
      sections: current.sections.map(s =>
        s.id === sectionId ? { ...s, points: [...s.points, ''] } : s
      ),
    })
  }

  const addSection = () => {
    if (!current) return
    setCurrent({
      ...current,
      sections: [...current.sections, {
        id: Date.now().toString(),
        title: t('tools.essayOutliner.newSection'),
        points: [''],
      }],
    })
  }

  const exportOutline = () => {
    if (!current) return ''
    let text = `# ${current.title}\n\n`
    text += `**Thesis:** ${current.thesis}\n\n`
    current.sections.forEach((section, i) => {
      text += `## ${i + 1}. ${section.title}\n`
      section.points.forEach(point => {
        if (point.trim()) text += `- ${point}\n`
      })
      text += '\n'
    })
    text += `## Conclusion\n${current.conclusion}`
    return text
  }

  return (
    <div className="space-y-4">
      {mode === 'list' && (
        <>
          <button
            onClick={createNew}
            className="w-full py-3 bg-blue-500 text-white rounded font-medium"
          >
            + {t('tools.essayOutliner.newOutline')}
          </button>

          {outlines.length === 0 ? (
            <div className="card p-6 text-center text-slate-500">
              {t('tools.essayOutliner.noOutlines')}
            </div>
          ) : (
            <div className="space-y-2">
              {outlines.map(outline => (
                <div key={outline.id} className="card p-4">
                  <div className="flex justify-between items-start">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => { setCurrent(outline); setMode('edit') }}
                    >
                      <div className="font-medium">
                        {outline.title || t('tools.essayOutliner.untitled')}
                      </div>
                      <div className="text-xs text-slate-400">{outline.date}</div>
                      {outline.thesis && (
                        <div className="text-sm text-slate-500 mt-1 line-clamp-1">
                          {outline.thesis}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => deleteOutline(outline.id)}
                      className="text-red-500"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {mode === 'edit' && current && (
        <>
          <div className="card p-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.essayOutliner.essayTitle')}
            </label>
            <input
              type="text"
              value={current.title}
              onChange={(e) => setCurrent({ ...current, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded font-medium"
              placeholder={t('tools.essayOutliner.titlePlaceholder')}
            />
          </div>

          <div className="card p-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.essayOutliner.thesis')}
            </label>
            <textarea
              value={current.thesis}
              onChange={(e) => setCurrent({ ...current, thesis: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
              rows={2}
              placeholder={t('tools.essayOutliner.thesisPlaceholder')}
            />
          </div>

          {current.sections.map((section) => (
            <div key={section.id} className="card p-4">
              <input
                type="text"
                value={section.title}
                onChange={(e) => updateSection(section.id, e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded font-medium mb-3"
              />
              <div className="space-y-2 pl-4 border-l-2 border-blue-200">
                {section.points.map((point, pIndex) => (
                  <input
                    key={pIndex}
                    type="text"
                    value={point}
                    onChange={(e) => updatePoint(section.id, pIndex, e.target.value)}
                    placeholder={t('tools.essayOutliner.point')}
                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm"
                  />
                ))}
                <button
                  onClick={() => addPoint(section.id)}
                  className="text-sm text-blue-500"
                >
                  + {t('tools.essayOutliner.addPoint')}
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={addSection}
            className="w-full py-2 border-2 border-dashed border-slate-300 rounded text-slate-500"
          >
            + {t('tools.essayOutliner.addSection')}
          </button>

          <div className="card p-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('tools.essayOutliner.conclusion')}
            </label>
            <textarea
              value={current.conclusion}
              onChange={(e) => setCurrent({ ...current, conclusion: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
              rows={3}
              placeholder={t('tools.essayOutliner.conclusionPlaceholder')}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setMode('list')}
              className="flex-1 py-2 bg-slate-100 rounded"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(exportOutline())}
              className="flex-1 py-2 bg-green-500 text-white rounded"
            >
              {t('tools.essayOutliner.export')}
            </button>
            <button
              onClick={save}
              className="flex-1 py-2 bg-blue-500 text-white rounded"
            >
              {t('tools.essayOutliner.save')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
