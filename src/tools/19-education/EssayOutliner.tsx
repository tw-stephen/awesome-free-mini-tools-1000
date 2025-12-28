import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Point {
  id: number
  text: string
  subpoints: { id: number; text: string }[]
}

interface Section {
  id: number
  title: string
  points: Point[]
}

export default function EssayOutliner() {
  const { t } = useTranslation()
  const [essay, setEssay] = useState({
    title: '',
    thesis: '',
    essayType: 'argumentative',
  })

  const [sections, setSections] = useState<Section[]>([
    { id: 1, title: 'Introduction', points: [{ id: 1, text: '', subpoints: [] }] },
    { id: 2, title: 'Body Paragraph 1', points: [{ id: 2, text: '', subpoints: [] }] },
    { id: 3, title: 'Body Paragraph 2', points: [{ id: 3, text: '', subpoints: [] }] },
    { id: 4, title: 'Conclusion', points: [{ id: 4, text: '', subpoints: [] }] },
  ])

  const essayTypes = [
    { id: 'argumentative', name: 'Argumentative' },
    { id: 'expository', name: 'Expository' },
    { id: 'narrative', name: 'Narrative' },
    { id: 'descriptive', name: 'Descriptive' },
    { id: 'compare', name: 'Compare & Contrast' },
  ]

  const addSection = () => {
    const newSection: Section = {
      id: Date.now(),
      title: `Body Paragraph ${sections.length - 1}`,
      points: [{ id: Date.now() + 1, text: '', subpoints: [] }],
    }
    const lastSection = sections[sections.length - 1]
    setSections([...sections.slice(0, -1), newSection, lastSection])
  }

  const removeSection = (id: number) => {
    if (sections.length <= 3) return
    setSections(sections.filter(s => s.id !== id))
  }

  const updateSectionTitle = (id: number, title: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, title } : s))
  }

  const addPoint = (sectionId: number) => {
    setSections(sections.map(s => {
      if (s.id !== sectionId) return s
      return {
        ...s,
        points: [...s.points, { id: Date.now(), text: '', subpoints: [] }],
      }
    }))
  }

  const updatePoint = (sectionId: number, pointId: number, text: string) => {
    setSections(sections.map(s => {
      if (s.id !== sectionId) return s
      return {
        ...s,
        points: s.points.map(p => p.id === pointId ? { ...p, text } : p),
      }
    }))
  }

  const removePoint = (sectionId: number, pointId: number) => {
    setSections(sections.map(s => {
      if (s.id !== sectionId) return s
      if (s.points.length <= 1) return s
      return {
        ...s,
        points: s.points.filter(p => p.id !== pointId),
      }
    }))
  }

  const addSubpoint = (sectionId: number, pointId: number) => {
    setSections(sections.map(s => {
      if (s.id !== sectionId) return s
      return {
        ...s,
        points: s.points.map(p => {
          if (p.id !== pointId) return p
          return {
            ...p,
            subpoints: [...p.subpoints, { id: Date.now(), text: '' }],
          }
        }),
      }
    }))
  }

  const updateSubpoint = (sectionId: number, pointId: number, subpointId: number, text: string) => {
    setSections(sections.map(s => {
      if (s.id !== sectionId) return s
      return {
        ...s,
        points: s.points.map(p => {
          if (p.id !== pointId) return p
          return {
            ...p,
            subpoints: p.subpoints.map(sp => sp.id === subpointId ? { ...sp, text } : sp),
          }
        }),
      }
    }))
  }

  const removeSubpoint = (sectionId: number, pointId: number, subpointId: number) => {
    setSections(sections.map(s => {
      if (s.id !== sectionId) return s
      return {
        ...s,
        points: s.points.map(p => {
          if (p.id !== pointId) return p
          return {
            ...p,
            subpoints: p.subpoints.filter(sp => sp.id !== subpointId),
          }
        }),
      }
    }))
  }

  const generateOutline = (): string => {
    let outline = `${essay.title || 'Essay Title'}\n${'═'.repeat(50)}\n\n`

    if (essay.thesis) {
      outline += `Thesis: ${essay.thesis}\n\n`
    }

    sections.forEach((section, sIndex) => {
      outline += `${toRoman(sIndex + 1)}. ${section.title}\n`
      section.points.forEach((point, pIndex) => {
        if (point.text) {
          outline += `   ${String.fromCharCode(65 + pIndex)}. ${point.text}\n`
          point.subpoints.forEach((sp, spIndex) => {
            if (sp.text) {
              outline += `      ${spIndex + 1}. ${sp.text}\n`
            }
          })
        }
      })
      outline += '\n'
    })

    return outline
  }

  const toRoman = (num: number): string => {
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
    return romanNumerals[num - 1] || num.toString()
  }

  const copyOutline = () => {
    navigator.clipboard.writeText(generateOutline())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.essayOutliner.details')}</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={essay.title}
            onChange={(e) => setEssay({ ...essay, title: e.target.value })}
            placeholder="Essay Title"
            className="w-full px-3 py-2 border border-slate-300 rounded font-medium"
          />
          <textarea
            value={essay.thesis}
            onChange={(e) => setEssay({ ...essay, thesis: e.target.value })}
            placeholder="Thesis Statement"
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          />
          <div>
            <label className="text-sm text-slate-500 block mb-2">Essay Type</label>
            <div className="flex flex-wrap gap-2">
              {essayTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setEssay({ ...essay, essayType: type.id })}
                  className={`px-3 py-1 rounded text-sm
                    ${essay.essayType === type.id ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {sections.map((section, sIndex) => (
          <div key={section.id} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">{toRoman(sIndex + 1)}.</span>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                  className="px-2 py-1 border border-slate-300 rounded font-medium"
                />
              </div>
              {sIndex > 0 && sIndex < sections.length - 1 && (
                <button
                  onClick={() => removeSection(section.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  ×
                </button>
              )}
            </div>

            <div className="space-y-2 ml-6">
              {section.points.map((point, pIndex) => (
                <div key={point.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm">{String.fromCharCode(65 + pIndex)}.</span>
                    <input
                      type="text"
                      value={point.text}
                      onChange={(e) => updatePoint(section.id, point.id, e.target.value)}
                      placeholder="Main point"
                      className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                    />
                    <button
                      onClick={() => addSubpoint(section.id, point.id)}
                      className="text-blue-400 hover:text-blue-600 text-sm"
                    >
                      +sub
                    </button>
                    {section.points.length > 1 && (
                      <button
                        onClick={() => removePoint(section.id, point.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {point.subpoints.map((sp, spIndex) => (
                    <div key={sp.id} className="flex items-center gap-2 ml-6">
                      <span className="text-slate-400 text-xs">{spIndex + 1}.</span>
                      <input
                        type="text"
                        value={sp.text}
                        onChange={(e) => updateSubpoint(section.id, point.id, sp.id, e.target.value)}
                        placeholder="Supporting detail"
                        className="flex-1 px-2 py-1 border border-slate-300 rounded text-xs"
                      />
                      <button
                        onClick={() => removeSubpoint(section.id, point.id, sp.id)}
                        className="text-red-400 hover:text-red-600 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ))}
              <button
                onClick={() => addPoint(section.id)}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                + Add Point
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addSection}
        className="w-full py-2 border-2 border-dashed border-slate-300 rounded text-slate-500 hover:border-blue-400 hover:text-blue-500"
      >
        + Add Section
      </button>

      <button
        onClick={copyOutline}
        className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
      >
        {t('tools.essayOutliner.copy')}
      </button>
    </div>
  )
}
