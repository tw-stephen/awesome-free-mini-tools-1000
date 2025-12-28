import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type CitationStyle = 'apa' | 'mla' | 'chicago'
type SourceType = 'book' | 'journal' | 'website'

export default function CitationGenerator() {
  const { t } = useTranslation()
  const [style, setStyle] = useState<CitationStyle>('apa')
  const [sourceType, setSourceType] = useState<SourceType>('book')
  const [copied, setCopied] = useState(false)

  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [year, setYear] = useState('')
  const [publisher, setPublisher] = useState('')
  const [city, setCity] = useState('')
  const [journalName, setJournalName] = useState('')
  const [volume, setVolume] = useState('')
  const [issue, setIssue] = useState('')
  const [pages, setPages] = useState('')
  const [url, setUrl] = useState('')
  const [accessDate, setAccessDate] = useState('')
  const [websiteTitle, setWebsiteTitle] = useState('')

  const citation = useMemo(() => {
    if (!author || !title) return ''

    const formatAuthor = (name: string, style: CitationStyle) => {
      const parts = name.split(' ')
      if (parts.length < 2) return name
      const lastName = parts[parts.length - 1]
      const firstName = parts.slice(0, -1).join(' ')

      if (style === 'apa') return `${lastName}, ${firstName.charAt(0)}.`
      if (style === 'mla') return `${lastName}, ${firstName}`
      return `${lastName}, ${firstName}`
    }

    if (sourceType === 'book') {
      if (style === 'apa') {
        return `${formatAuthor(author, 'apa')} (${year}). ${title}. ${publisher}.`
      }
      if (style === 'mla') {
        return `${formatAuthor(author, 'mla')}. ${title}. ${publisher}, ${year}.`
      }
      return `${formatAuthor(author, 'chicago')}. ${title}. ${city}: ${publisher}, ${year}.`
    }

    if (sourceType === 'journal') {
      if (style === 'apa') {
        return `${formatAuthor(author, 'apa')} (${year}). ${title}. ${journalName}, ${volume}(${issue}), ${pages}.`
      }
      if (style === 'mla') {
        return `${formatAuthor(author, 'mla')}. "${title}." ${journalName}, vol. ${volume}, no. ${issue}, ${year}, pp. ${pages}.`
      }
      return `${formatAuthor(author, 'chicago')}. "${title}." ${journalName} ${volume}, no. ${issue} (${year}): ${pages}.`
    }

    if (sourceType === 'website') {
      if (style === 'apa') {
        return `${formatAuthor(author, 'apa')} (${year}). ${title}. ${websiteTitle}. ${url}`
      }
      if (style === 'mla') {
        return `${formatAuthor(author, 'mla')}. "${title}." ${websiteTitle}, ${year}, ${url}. Accessed ${accessDate}.`
      }
      return `${formatAuthor(author, 'chicago')}. "${title}." ${websiteTitle}. Last modified ${year}. ${url}.`
    }

    return ''
  }, [author, title, year, publisher, city, journalName, volume, issue, pages, url, accessDate, websiteTitle, style, sourceType])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(citation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('tools.citationGenerator.style')}</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as CitationStyle)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            >
              <option value="apa">APA</option>
              <option value="mla">MLA</option>
              <option value="chicago">Chicago</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('tools.citationGenerator.sourceType')}</label>
            <select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value as SourceType)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            >
              <option value="book">{t('tools.citationGenerator.book')}</option>
              <option value="journal">{t('tools.citationGenerator.journal')}</option>
              <option value="website">{t('tools.citationGenerator.website')}</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('tools.citationGenerator.author')}</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="John Smith"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('tools.citationGenerator.title')}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('tools.citationGenerator.titlePlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('tools.citationGenerator.year')}</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2024"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>

          {sourceType === 'book' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('tools.citationGenerator.publisher')}</label>
                <input
                  type="text"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
              {style === 'chicago' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('tools.citationGenerator.city')}</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  />
                </div>
              )}
            </>
          )}

          {sourceType === 'journal' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('tools.citationGenerator.journalName')}</label>
                <input
                  type="text"
                  value={journalName}
                  onChange={(e) => setJournalName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">{t('tools.citationGenerator.volume')}</label>
                  <input
                    type="text"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">{t('tools.citationGenerator.issue')}</label>
                  <input
                    type="text"
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">{t('tools.citationGenerator.pages')}</label>
                  <input
                    type="text"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    placeholder="1-20"
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  />
                </div>
              </div>
            </>
          )}

          {sourceType === 'website' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('tools.citationGenerator.websiteTitle')}</label>
                <input
                  type="text"
                  value={websiteTitle}
                  onChange={(e) => setWebsiteTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
              {style === 'mla' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('tools.citationGenerator.accessDate')}</label>
                  <input
                    type="text"
                    value={accessDate}
                    onChange={(e) => setAccessDate(e.target.value)}
                    placeholder="1 Jan. 2024"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {citation && (
        <div className="card p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-slate-700">{t('tools.citationGenerator.citation')}</h3>
            <button
              onClick={copyToClipboard}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {copied ? t('common.copied') : t('common.copy')}
            </button>
          </div>
          <p className="text-sm text-slate-800 p-3 bg-slate-50 rounded italic">
            {citation}
          </p>
        </div>
      )}
    </div>
  )
}
