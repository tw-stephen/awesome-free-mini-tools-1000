import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Reference {
  id: number
  rawText: string
  formatted: string
  style: string
}

export default function BibliographyMaker() {
  const { t } = useTranslation()
  const [references, setReferences] = useState<Reference[]>([])
  const [newRef, setNewRef] = useState('')
  const [style, setStyle] = useState<'apa' | 'mla' | 'chicago'>('apa')
  const [sortBy, setSortBy] = useState<'author' | 'date' | 'title'>('author')

  const addReference = () => {
    if (!newRef.trim()) return
    setReferences([...references, {
      id: Date.now(),
      rawText: newRef,
      formatted: newRef,
      style,
    }])
    setNewRef('')
  }

  const removeReference = (id: number) => {
    setReferences(references.filter(r => r.id !== id))
  }

  const sortedReferences = [...references].sort((a, b) => {
    const aText = a.formatted.toLowerCase()
    const bText = b.formatted.toLowerCase()
    return aText.localeCompare(bText)
  })

  const generateBibliography = (): string => {
    const header = {
      apa: 'References',
      mla: 'Works Cited',
      chicago: 'Bibliography',
    }[style]

    let bib = `${header}\n${'─'.repeat(40)}\n\n`
    sortedReferences.forEach(ref => {
      bib += `${ref.formatted}\n\n`
    })
    return bib
  }

  const copyBibliography = () => {
    navigator.clipboard.writeText(generateBibliography())
  }

  const exampleFormats = {
    apa: [
      'Smith, J. A. (2023). Title of the book. Publisher.',
      'Jones, M., & Brown, K. (2022). Article title. Journal Name, 10(2), 15-30.',
      'Williams, R. (2024). Website title. https://example.com',
    ],
    mla: [
      'Smith, John A. Title of the Book. Publisher, 2023.',
      'Jones, Mary, and Kate Brown. "Article Title." Journal Name, vol. 10, no. 2, 2022, pp. 15-30.',
      'Williams, Robert. "Website Title." Website, 2024, https://example.com.',
    ],
    chicago: [
      'Smith, John A. Title of the Book. Publisher, 2023.',
      'Jones, Mary, and Kate Brown. "Article Title." Journal Name 10, no. 2 (2022): 15-30.',
      'Williams, Robert. "Website Title." Accessed January 1, 2024. https://example.com.',
    ],
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.bibliographyMaker.style')}</h3>
        <div className="flex gap-2">
          {(['apa', 'mla', 'chicago'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`flex-1 py-2 rounded font-medium uppercase
                ${style === s ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.bibliographyMaker.addRef')}</h3>
        <textarea
          value={newRef}
          onChange={(e) => setNewRef(e.target.value)}
          placeholder="Enter a formatted reference..."
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded resize-none mb-3"
        />
        <button
          onClick={addReference}
          disabled={!newRef.trim()}
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
        >
          Add Reference
        </button>

        <div className="mt-4 p-3 bg-slate-50 rounded">
          <div className="text-sm font-medium text-slate-600 mb-2">
            Example {style.toUpperCase()} format:
          </div>
          <div className="space-y-1 text-xs text-slate-500">
            {exampleFormats[style].map((ex, i) => (
              <div key={i}>{ex}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-2 py-1 border border-slate-300 rounded text-sm"
            >
              <option value="author">Author</option>
              <option value="date">Date</option>
              <option value="title">Title</option>
            </select>
          </div>
          <span className="font-medium">{references.length} references</span>
        </div>
      </div>

      {sortedReferences.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">
              {style === 'apa' ? 'References' : style === 'mla' ? 'Works Cited' : 'Bibliography'}
            </h3>
          </div>
          <div className="space-y-3">
            {sortedReferences.map(ref => (
              <div key={ref.id} className="flex items-start gap-2">
                <div className="flex-1 p-2 bg-slate-50 rounded text-sm" style={{ textIndent: '-1.5em', paddingLeft: '1.5em' }}>
                  {ref.formatted}
                </div>
                <button
                  onClick={() => removeReference(ref.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {references.length === 0 && (
        <div className="card p-8 text-center text-slate-500">
          Add references to build your bibliography
        </div>
      )}

      {references.length > 0 && (
        <button
          onClick={copyBibliography}
          className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
        >
          {t('tools.bibliographyMaker.copy')}
        </button>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.bibliographyMaker.tips')}</h3>
        <ul className="text-sm text-slate-600 space-y-2">
          <li>• Keep references in alphabetical order by author's last name</li>
          <li>• Use hanging indentation (first line flush, subsequent lines indented)</li>
          <li>• Italicize book titles, journal names, and website names</li>
          <li>• Double-check formatting for your specific style guide</li>
          <li>• Include DOI or URL for online sources when available</li>
        </ul>
      </div>
    </div>
  )
}
