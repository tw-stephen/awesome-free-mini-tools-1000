import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Section {
  id: number
  title: string
  content: string
  subsections: { id: number; title: string; content: string }[]
}

export default function ResearchPaperOutliner() {
  const { t } = useTranslation()
  const [title, setTitle] = useState('')
  const [thesis, setThesis] = useState('')
  const [sections, setSections] = useState<Section[]>([
    { id: 1, title: 'Introduction', content: '', subsections: [] },
    { id: 2, title: 'Literature Review', content: '', subsections: [] },
    { id: 3, title: 'Methodology', content: '', subsections: [] },
    { id: 4, title: 'Results', content: '', subsections: [] },
    { id: 5, title: 'Discussion', content: '', subsections: [] },
    { id: 6, title: 'Conclusion', content: '', subsections: [] },
  ])

  const updateSection = (id: number, field: 'title' | 'content', value: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const addSection = () => {
    setSections([...sections, {
      id: Date.now(),
      title: 'New Section',
      content: '',
      subsections: [],
    }])
  }

  const removeSection = (id: number) => {
    setSections(sections.filter(s => s.id !== id))
  }

  const addSubsection = (sectionId: number) => {
    setSections(sections.map(s => {
      if (s.id !== sectionId) return s
      return {
        ...s,
        subsections: [...s.subsections, { id: Date.now(), title: 'Subsection', content: '' }],
      }
    }))
  }

  const updateSubsection = (sectionId: number, subId: number, field: 'title' | 'content', value: string) => {
    setSections(sections.map(s => {
      if (s.id !== sectionId) return s
      return {
        ...s,
        subsections: s.subsections.map(sub =>
          sub.id === subId ? { ...sub, [field]: value } : sub
        ),
      }
    }))
  }

  const removeSubsection = (sectionId: number, subId: number) => {
    setSections(sections.map(s => {
      if (s.id !== sectionId) return s
      return {
        ...s,
        subsections: s.subsections.filter(sub => sub.id !== subId),
      }
    }))
  }

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= sections.length) return
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]]
    setSections(newSections)
  }

  const exportOutline = () => {
    let text = title ? `${title}\n${'='.repeat(title.length)}\n\n` : ''
    if (thesis) text += `Thesis: ${thesis}\n\n`

    sections.forEach((section, i) => {
      text += `${i + 1}. ${section.title}\n`
      if (section.content) text += `   ${section.content}\n`
      section.subsections.forEach((sub, j) => {
        text += `   ${i + 1}.${j + 1} ${sub.title}\n`
        if (sub.content) text += `       ${sub.content}\n`
      })
      text += '\n'
    })

    navigator.clipboard.writeText(text)
  }

  const getWordCount = (): number => {
    let count = 0
    if (title) count += title.split(/\s+/).length
    if (thesis) count += thesis.split(/\s+/).length
    sections.forEach(s => {
      if (s.content) count += s.content.split(/\s+/).length
      s.subsections.forEach(sub => {
        if (sub.content) count += sub.content.split(/\s+/).length
      })
    })
    return count
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Research Paper Title"
          className="w-full px-3 py-2 text-lg font-bold border border-slate-300 rounded mb-3"
        />
        <textarea
          value={thesis}
          onChange={(e) => setThesis(e.target.value)}
          placeholder="Thesis statement - the main argument or claim of your paper"
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">
          {sections.length} sections • ~{getWordCount()} words in outline
        </span>
        <button
          onClick={addSection}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          + Add Section
        </button>
      </div>

      <div className="space-y-3">
        {sections.map((section, index) => (
          <div key={section.id} className="card p-4">
            <div className="flex items-start gap-2 mb-2">
              <span className="text-slate-400 font-medium mt-2">{index + 1}.</span>
              <div className="flex-1">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                  className="w-full px-2 py-1 font-medium border border-slate-300 rounded"
                />
                <textarea
                  value={section.content}
                  onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                  placeholder="Key points for this section..."
                  rows={2}
                  className="w-full px-2 py-1 mt-2 text-sm border border-slate-300 rounded resize-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveSection(index, 'up')}
                  disabled={index === 0}
                  className="px-2 py-1 text-xs bg-slate-100 rounded disabled:opacity-30"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveSection(index, 'down')}
                  disabled={index === sections.length - 1}
                  className="px-2 py-1 text-xs bg-slate-100 rounded disabled:opacity-30"
                >
                  ▼
                </button>
                <button
                  onClick={() => removeSection(section.id)}
                  className="px-2 py-1 text-xs text-red-500 bg-red-50 rounded"
                >
                  ×
                </button>
              </div>
            </div>

            {section.subsections.map((sub, subIndex) => (
              <div key={sub.id} className="ml-6 mt-2 flex items-start gap-2">
                <span className="text-slate-400 text-sm mt-1">{index + 1}.{subIndex + 1}</span>
                <div className="flex-1">
                  <input
                    type="text"
                    value={sub.title}
                    onChange={(e) => updateSubsection(section.id, sub.id, 'title', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded"
                  />
                  <textarea
                    value={sub.content}
                    onChange={(e) => updateSubsection(section.id, sub.id, 'content', e.target.value)}
                    placeholder="Notes..."
                    rows={1}
                    className="w-full px-2 py-1 mt-1 text-xs border border-slate-300 rounded resize-none"
                  />
                </div>
                <button
                  onClick={() => removeSubsection(section.id, sub.id)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  ×
                </button>
              </div>
            ))}

            <button
              onClick={() => addSubsection(section.id)}
              className="ml-6 mt-2 text-xs text-blue-500 hover:text-blue-600"
            >
              + Add Subsection
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={exportOutline}
        className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
      >
        {t('tools.researchPaperOutliner.export')}
      </button>

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium text-blue-700 mb-2">{t('tools.researchPaperOutliner.tips')}</h3>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• Start with a clear thesis statement</li>
          <li>• Each section should support your thesis</li>
          <li>• Use subsections to organize complex ideas</li>
          <li>• Include key evidence or sources in notes</li>
        </ul>
      </div>
    </div>
  )
}
