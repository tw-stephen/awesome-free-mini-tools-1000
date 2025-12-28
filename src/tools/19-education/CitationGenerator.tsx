import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type CitationType = 'book' | 'journal' | 'website' | 'article'
type CitationStyle = 'apa' | 'mla' | 'chicago' | 'harvard'

interface Source {
  id: number
  type: CitationType
  authors: string
  title: string
  year: string
  publisher: string
  journal: string
  volume: string
  issue: string
  pages: string
  url: string
  accessDate: string
}

export default function CitationGenerator() {
  const { t } = useTranslation()
  const [style, setStyle] = useState<CitationStyle>('apa')
  const [source, setSource] = useState<Omit<Source, 'id'>>({
    type: 'book',
    authors: '',
    title: '',
    year: '',
    publisher: '',
    journal: '',
    volume: '',
    issue: '',
    pages: '',
    url: '',
    accessDate: new Date().toISOString().split('T')[0],
  })

  const [savedCitations, setSavedCitations] = useState<{ source: Source; citation: string }[]>([])

  const formatAuthorsAPA = (authors: string): string => {
    const authorList = authors.split(',').map(a => a.trim())
    if (authorList.length === 1) {
      const parts = authorList[0].split(' ')
      if (parts.length >= 2) {
        return `${parts[parts.length - 1]}, ${parts.slice(0, -1).map(n => n[0] + '.').join(' ')}`
      }
      return authorList[0]
    }
    return authorList.map(author => {
      const parts = author.split(' ')
      if (parts.length >= 2) {
        return `${parts[parts.length - 1]}, ${parts.slice(0, -1).map(n => n[0] + '.').join(' ')}`
      }
      return author
    }).join(', & ')
  }

  const formatAuthorsMLA = (authors: string): string => {
    const authorList = authors.split(',').map(a => a.trim())
    if (authorList.length === 1) {
      const parts = authorList[0].split(' ')
      if (parts.length >= 2) {
        return `${parts[parts.length - 1]}, ${parts.slice(0, -1).join(' ')}`
      }
      return authorList[0]
    }
    return authorList.join(', and ')
  }

  const generateCitation = (): string => {
    const { type, authors, title, year, publisher, journal, volume, issue, pages, url, accessDate } = source

    if (!authors || !title) return ''

    switch (style) {
      case 'apa':
        switch (type) {
          case 'book':
            return `${formatAuthorsAPA(authors)} (${year}). *${title}*. ${publisher}.`
          case 'journal':
            return `${formatAuthorsAPA(authors)} (${year}). ${title}. *${journal}*, *${volume}*${issue ? `(${issue})` : ''}, ${pages}.`
          case 'website':
            return `${formatAuthorsAPA(authors)} (${year}). ${title}. Retrieved ${accessDate}, from ${url}`
          case 'article':
            return `${formatAuthorsAPA(authors)} (${year}). ${title}. *${journal}*, ${pages}.`
        }
        break

      case 'mla':
        switch (type) {
          case 'book':
            return `${formatAuthorsMLA(authors)}. *${title}*. ${publisher}, ${year}.`
          case 'journal':
            return `${formatAuthorsMLA(authors)}. "${title}." *${journal}*, vol. ${volume}, no. ${issue}, ${year}, pp. ${pages}.`
          case 'website':
            return `${formatAuthorsMLA(authors)}. "${title}." *${journal || 'Website'}*, ${year}, ${url}. Accessed ${accessDate}.`
          case 'article':
            return `${formatAuthorsMLA(authors)}. "${title}." *${journal}*, ${year}, pp. ${pages}.`
        }
        break

      case 'chicago':
        switch (type) {
          case 'book':
            return `${authors}. *${title}*. ${publisher}, ${year}.`
          case 'journal':
            return `${authors}. "${title}." *${journal}* ${volume}, no. ${issue} (${year}): ${pages}.`
          case 'website':
            return `${authors}. "${title}." Accessed ${accessDate}. ${url}.`
          case 'article':
            return `${authors}. "${title}." *${journal}* (${year}): ${pages}.`
        }
        break

      case 'harvard':
        switch (type) {
          case 'book':
            return `${authors.split(',')[0].split(' ').pop()}, ${authors.split(',')[0].split(' ').slice(0, -1).map(n => n[0] + '.').join('')} (${year}) *${title}*. ${publisher}.`
          case 'journal':
            return `${authors} (${year}) '${title}', *${journal}*, ${volume}(${issue}), pp. ${pages}.`
          case 'website':
            return `${authors} (${year}) *${title}*. Available at: ${url} (Accessed: ${accessDate}).`
          case 'article':
            return `${authors} (${year}) '${title}', *${journal}*, pp. ${pages}.`
        }
        break
    }
    return ''
  }

  const citation = generateCitation()

  const saveCitation = () => {
    if (!citation) return
    setSavedCitations([...savedCitations, { source: { ...source, id: Date.now() }, citation }])
  }

  const copyCitation = () => {
    navigator.clipboard.writeText(citation.replace(/\*/g, ''))
  }

  const copyAllCitations = () => {
    const text = savedCitations.map(c => c.citation.replace(/\*/g, '')).join('\n\n')
    navigator.clipboard.writeText(text)
  }

  const removeCitation = (id: number) => {
    setSavedCitations(savedCitations.filter(c => c.source.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.citationGenerator.style')}</h3>
        <div className="flex gap-2">
          {(['apa', 'mla', 'chicago', 'harvard'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`flex-1 py-2 rounded font-medium uppercase text-sm
                ${style === s ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.citationGenerator.sourceType')}</h3>
        <div className="flex gap-2 mb-4">
          {(['book', 'journal', 'website', 'article'] as const).map(type => (
            <button
              key={type}
              onClick={() => setSource({ ...source, type })}
              className={`flex-1 py-2 rounded text-sm capitalize
                ${source.type === type ? 'bg-green-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={source.authors}
            onChange={(e) => setSource({ ...source, authors: e.target.value })}
            placeholder="Authors (comma separated: John Smith, Jane Doe)"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <input
            type="text"
            value={source.title}
            onChange={(e) => setSource({ ...source, title: e.target.value })}
            placeholder="Title"
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={source.year}
              onChange={(e) => setSource({ ...source, year: e.target.value })}
              placeholder="Year"
              className="px-3 py-2 border border-slate-300 rounded"
            />
            {source.type === 'book' && (
              <input
                type="text"
                value={source.publisher}
                onChange={(e) => setSource({ ...source, publisher: e.target.value })}
                placeholder="Publisher"
                className="px-3 py-2 border border-slate-300 rounded"
              />
            )}
            {(source.type === 'journal' || source.type === 'article') && (
              <input
                type="text"
                value={source.journal}
                onChange={(e) => setSource({ ...source, journal: e.target.value })}
                placeholder="Journal Name"
                className="px-3 py-2 border border-slate-300 rounded"
              />
            )}
          </div>

          {source.type === 'journal' && (
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={source.volume}
                onChange={(e) => setSource({ ...source, volume: e.target.value })}
                placeholder="Volume"
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <input
                type="text"
                value={source.issue}
                onChange={(e) => setSource({ ...source, issue: e.target.value })}
                placeholder="Issue"
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <input
                type="text"
                value={source.pages}
                onChange={(e) => setSource({ ...source, pages: e.target.value })}
                placeholder="Pages (e.g., 1-15)"
                className="px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          )}

          {source.type === 'website' && (
            <>
              <input
                type="url"
                value={source.url}
                onChange={(e) => setSource({ ...source, url: e.target.value })}
                placeholder="URL"
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
              <input
                type="date"
                value={source.accessDate}
                onChange={(e) => setSource({ ...source, accessDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </>
          )}
        </div>
      </div>

      {citation && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">{t('tools.citationGenerator.preview')}</h3>
            <div className="flex gap-2">
              <button onClick={copyCitation} className="text-blue-500 text-sm hover:text-blue-600">
                Copy
              </button>
              <button onClick={saveCitation} className="text-green-500 text-sm hover:text-green-600">
                Save
              </button>
            </div>
          </div>
          <div
            className="p-3 bg-slate-50 rounded text-sm"
            dangerouslySetInnerHTML={{ __html: citation.replace(/\*([^*]+)\*/g, '<em>$1</em>') }}
          />
        </div>
      )}

      {savedCitations.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">{t('tools.citationGenerator.saved')} ({savedCitations.length})</h3>
            <button onClick={copyAllCitations} className="text-blue-500 text-sm hover:text-blue-600">
              Copy All
            </button>
          </div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {savedCitations.map(({ source: s, citation: c }) => (
              <div key={s.id} className="p-2 bg-slate-50 rounded flex items-start justify-between text-sm">
                <div
                  className="flex-1"
                  dangerouslySetInnerHTML={{ __html: c.replace(/\*([^*]+)\*/g, '<em>$1</em>') }}
                />
                <button onClick={() => removeCitation(s.id)} className="text-red-400 hover:text-red-600 ml-2">
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
