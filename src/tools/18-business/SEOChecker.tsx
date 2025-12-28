import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface SEOItem {
  id: string
  category: string
  check: string
  status: 'pass' | 'warning' | 'fail' | 'unchecked'
  recommendation: string
}

export default function SEOChecker() {
  const { t } = useTranslation()
  const [url, setUrl] = useState('')
  const [pageData, setPageData] = useState({
    title: '',
    description: '',
    h1: '',
    keywords: '',
    wordCount: 0,
    imageCount: 0,
    imagesWithAlt: 0,
    internalLinks: 0,
    externalLinks: 0,
    hasHttps: false,
    hasSitemap: false,
    hasRobots: false,
    loadTime: 0,
  })

  const defaultChecks: SEOItem[] = [
    { id: 'title', category: 'Content', check: 'Title Tag (50-60 characters)', status: 'unchecked', recommendation: 'Include primary keyword, keep 50-60 characters' },
    { id: 'description', category: 'Content', check: 'Meta Description (150-160 characters)', status: 'unchecked', recommendation: 'Write compelling description with call-to-action' },
    { id: 'h1', category: 'Content', check: 'H1 Tag Present', status: 'unchecked', recommendation: 'Have exactly one H1 tag with primary keyword' },
    { id: 'keywords', category: 'Content', check: 'Keyword in First 100 Words', status: 'unchecked', recommendation: 'Place primary keyword early in content' },
    { id: 'wordCount', category: 'Content', check: 'Content Length (300+ words)', status: 'unchecked', recommendation: 'Aim for 1000+ words for comprehensive coverage' },
    { id: 'images', category: 'Technical', check: 'Image Alt Tags', status: 'unchecked', recommendation: 'Add descriptive alt text to all images' },
    { id: 'internalLinks', category: 'Links', check: 'Internal Links (3+)', status: 'unchecked', recommendation: 'Link to relevant internal pages' },
    { id: 'externalLinks', category: 'Links', check: 'External Links (1+)', status: 'unchecked', recommendation: 'Link to authoritative sources' },
    { id: 'https', category: 'Technical', check: 'HTTPS Enabled', status: 'unchecked', recommendation: 'Secure your site with SSL certificate' },
    { id: 'sitemap', category: 'Technical', check: 'XML Sitemap', status: 'unchecked', recommendation: 'Submit sitemap to search engines' },
    { id: 'robots', category: 'Technical', check: 'Robots.txt', status: 'unchecked', recommendation: 'Configure proper crawl directives' },
    { id: 'speed', category: 'Performance', check: 'Page Load Speed (<3s)', status: 'unchecked', recommendation: 'Optimize images and minimize resources' },
  ]

  const [checks, setChecks] = useState<SEOItem[]>(defaultChecks)

  const runChecks = () => {
    const updatedChecks = checks.map(check => {
      let status: SEOItem['status'] = 'unchecked'

      switch (check.id) {
        case 'title':
          if (pageData.title.length >= 50 && pageData.title.length <= 60) status = 'pass'
          else if (pageData.title.length > 0) status = 'warning'
          else status = 'fail'
          break
        case 'description':
          if (pageData.description.length >= 150 && pageData.description.length <= 160) status = 'pass'
          else if (pageData.description.length > 0) status = 'warning'
          else status = 'fail'
          break
        case 'h1':
          status = pageData.h1.length > 0 ? 'pass' : 'fail'
          break
        case 'keywords':
          status = pageData.keywords.length > 0 ? 'pass' : 'warning'
          break
        case 'wordCount':
          if (pageData.wordCount >= 1000) status = 'pass'
          else if (pageData.wordCount >= 300) status = 'warning'
          else status = 'fail'
          break
        case 'images':
          if (pageData.imageCount === 0 || pageData.imagesWithAlt === pageData.imageCount) status = 'pass'
          else if (pageData.imagesWithAlt > 0) status = 'warning'
          else status = 'fail'
          break
        case 'internalLinks':
          status = pageData.internalLinks >= 3 ? 'pass' : pageData.internalLinks > 0 ? 'warning' : 'fail'
          break
        case 'externalLinks':
          status = pageData.externalLinks >= 1 ? 'pass' : 'warning'
          break
        case 'https':
          status = pageData.hasHttps ? 'pass' : 'fail'
          break
        case 'sitemap':
          status = pageData.hasSitemap ? 'pass' : 'warning'
          break
        case 'robots':
          status = pageData.hasRobots ? 'pass' : 'warning'
          break
        case 'speed':
          if (pageData.loadTime > 0 && pageData.loadTime < 3) status = 'pass'
          else if (pageData.loadTime < 5) status = 'warning'
          else status = 'fail'
          break
      }

      return { ...check, status }
    })

    setChecks(updatedChecks)
  }

  const getStatusColor = (status: SEOItem['status']): string => {
    const colors = {
      pass: 'bg-green-100 text-green-600',
      warning: 'bg-yellow-100 text-yellow-600',
      fail: 'bg-red-100 text-red-600',
      unchecked: 'bg-slate-100 text-slate-500',
    }
    return colors[status]
  }

  const getScore = (): number => {
    const scored = checks.filter(c => c.status !== 'unchecked')
    if (scored.length === 0) return 0
    const points = scored.reduce((sum, c) => {
      if (c.status === 'pass') return sum + 10
      if (c.status === 'warning') return sum + 5
      return sum
    }, 0)
    return Math.round((points / (scored.length * 10)) * 100)
  }

  const score = getScore()

  const groupedChecks = checks.reduce((acc, check) => {
    if (!acc[check.category]) acc[check.category] = []
    acc[check.category].push(check)
    return acc
  }, {} as Record<string, SEOItem[]>)

  const generateReport = (): string => {
    let doc = `SEO AUDIT REPORT\n${'═'.repeat(50)}\n\n`
    doc += `URL: ${url || '[Enter URL]'}\n`
    doc += `Score: ${score}/100\n`
    doc += `Date: ${new Date().toLocaleDateString()}\n\n`

    Object.entries(groupedChecks).forEach(([category, categoryChecks]) => {
      doc += `${category.toUpperCase()}\n${'─'.repeat(40)}\n`
      categoryChecks.forEach(check => {
        const icon = check.status === 'pass' ? '✓' : check.status === 'warning' ? '!' : check.status === 'fail' ? '✗' : '?'
        doc += `[${icon}] ${check.check}\n`
        if (check.status !== 'pass' && check.status !== 'unchecked') {
          doc += `    Recommendation: ${check.recommendation}\n`
        }
      })
      doc += '\n'
    })

    return doc
  }

  const copyReport = () => {
    navigator.clipboard.writeText(generateReport())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.seoChecker.url')}</h3>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/page"
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.seoChecker.pageData')}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-500 flex justify-between">
              <span>Title Tag</span>
              <span className={pageData.title.length >= 50 && pageData.title.length <= 60 ? 'text-green-500' : 'text-orange-500'}>
                {pageData.title.length}/60
              </span>
            </label>
            <input type="text" value={pageData.title} onChange={(e) => setPageData({ ...pageData, title: e.target.value })} placeholder="Page Title" className="w-full px-3 py-2 border border-slate-300 rounded" />
          </div>
          <div>
            <label className="text-sm text-slate-500 flex justify-between">
              <span>Meta Description</span>
              <span className={pageData.description.length >= 150 && pageData.description.length <= 160 ? 'text-green-500' : 'text-orange-500'}>
                {pageData.description.length}/160
              </span>
            </label>
            <textarea value={pageData.description} onChange={(e) => setPageData({ ...pageData, description: e.target.value })} placeholder="Meta description" rows={2} className="w-full px-3 py-2 border border-slate-300 rounded resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="text" value={pageData.h1} onChange={(e) => setPageData({ ...pageData, h1: e.target.value })} placeholder="H1 Tag Content" className="px-3 py-2 border border-slate-300 rounded" />
            <input type="text" value={pageData.keywords} onChange={(e) => setPageData({ ...pageData, keywords: e.target.value })} placeholder="Target Keywords" className="px-3 py-2 border border-slate-300 rounded" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-slate-500">Word Count</label>
              <input type="number" value={pageData.wordCount} onChange={(e) => setPageData({ ...pageData, wordCount: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded" min="0" />
            </div>
            <div>
              <label className="text-xs text-slate-500">Images</label>
              <input type="number" value={pageData.imageCount} onChange={(e) => setPageData({ ...pageData, imageCount: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded" min="0" />
            </div>
            <div>
              <label className="text-xs text-slate-500">W/ Alt Tags</label>
              <input type="number" value={pageData.imagesWithAlt} onChange={(e) => setPageData({ ...pageData, imagesWithAlt: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded" min="0" />
            </div>
            <div>
              <label className="text-xs text-slate-500">Load Time (s)</label>
              <input type="number" value={pageData.loadTime} onChange={(e) => setPageData({ ...pageData, loadTime: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded" min="0" step="0.1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500">Internal Links</label>
              <input type="number" value={pageData.internalLinks} onChange={(e) => setPageData({ ...pageData, internalLinks: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded" min="0" />
            </div>
            <div>
              <label className="text-xs text-slate-500">External Links</label>
              <input type="number" value={pageData.externalLinks} onChange={(e) => setPageData({ ...pageData, externalLinks: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 rounded" min="0" />
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={pageData.hasHttps} onChange={(e) => setPageData({ ...pageData, hasHttps: e.target.checked })} className="rounded" />
              <span className="text-sm">HTTPS</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={pageData.hasSitemap} onChange={(e) => setPageData({ ...pageData, hasSitemap: e.target.checked })} className="rounded" />
              <span className="text-sm">Sitemap</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={pageData.hasRobots} onChange={(e) => setPageData({ ...pageData, hasRobots: e.target.checked })} className="rounded" />
              <span className="text-sm">Robots.txt</span>
            </label>
          </div>
        </div>
      </div>

      <button onClick={runChecks} className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
        {t('tools.seoChecker.analyze')}
      </button>

      {score > 0 && (
        <div className={`card p-4 text-center ${score >= 80 ? 'bg-green-50' : score >= 60 ? 'bg-yellow-50' : 'bg-red-50'}`}>
          <div className="text-sm text-slate-500">SEO Score</div>
          <div className={`text-4xl font-bold ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
            {score}/100
          </div>
        </div>
      )}

      {Object.entries(groupedChecks).map(([category, categoryChecks]) => (
        <div key={category} className="card p-4">
          <h3 className="font-medium mb-3">{category}</h3>
          <div className="space-y-2">
            {categoryChecks.map(check => (
              <div key={check.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span className="text-sm">{check.check}</span>
                <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(check.status)}`}>
                  {check.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button onClick={copyReport} className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium">
        {t('tools.seoChecker.export')}
      </button>
    </div>
  )
}
