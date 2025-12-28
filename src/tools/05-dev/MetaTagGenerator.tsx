import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function MetaTagGenerator() {
  const { t } = useTranslation()
  const [title, setTitle] = useState('My Awesome Website')
  const [description, setDescription] = useState('Welcome to my awesome website. We provide the best services for your needs.')
  const [keywords, setKeywords] = useState('website, awesome, services')
  const [author, setAuthor] = useState('John Doe')
  const [ogImage, setOgImage] = useState('https://example.com/og-image.jpg')
  const [siteUrl, setSiteUrl] = useState('https://example.com')
  const [twitterHandle, setTwitterHandle] = useState('@mysite')
  const [robots, setRobots] = useState('index, follow')
  const [charset, _setCharset] = useState('UTF-8')
  const [viewport, _setViewport] = useState('width=device-width, initial-scale=1.0')
  const { copy, copied } = useClipboard()

  const metaTags = useMemo(() => {
    const tags: string[] = []

    // Basic meta tags
    if (charset) tags.push(`<meta charset="${charset}">`)
    if (viewport) tags.push(`<meta name="viewport" content="${viewport}">`)
    if (title) tags.push(`<title>${title}</title>`)
    if (description) tags.push(`<meta name="description" content="${description}">`)
    if (keywords) tags.push(`<meta name="keywords" content="${keywords}">`)
    if (author) tags.push(`<meta name="author" content="${author}">`)
    if (robots) tags.push(`<meta name="robots" content="${robots}">`)

    // Canonical URL
    if (siteUrl) tags.push(`<link rel="canonical" href="${siteUrl}">`)

    // Open Graph tags
    tags.push('')
    tags.push('<!-- Open Graph / Facebook -->')
    tags.push(`<meta property="og:type" content="website">`)
    if (siteUrl) tags.push(`<meta property="og:url" content="${siteUrl}">`)
    if (title) tags.push(`<meta property="og:title" content="${title}">`)
    if (description) tags.push(`<meta property="og:description" content="${description}">`)
    if (ogImage) tags.push(`<meta property="og:image" content="${ogImage}">`)

    // Twitter Card tags
    tags.push('')
    tags.push('<!-- Twitter -->')
    tags.push(`<meta property="twitter:card" content="summary_large_image">`)
    if (siteUrl) tags.push(`<meta property="twitter:url" content="${siteUrl}">`)
    if (title) tags.push(`<meta property="twitter:title" content="${title}">`)
    if (description) tags.push(`<meta property="twitter:description" content="${description}">`)
    if (ogImage) tags.push(`<meta property="twitter:image" content="${ogImage}">`)
    if (twitterHandle) tags.push(`<meta name="twitter:site" content="${twitterHandle}">`)

    return tags.join('\n')
  }, [title, description, keywords, author, ogImage, siteUrl, twitterHandle, robots, charset, viewport])

  const robotsOptions = [
    'index, follow',
    'noindex, follow',
    'index, nofollow',
    'noindex, nofollow',
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.metaTagGenerator.basicInfo')}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.metaTagGenerator.title')}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Website Title"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <p className="text-xs text-slate-400 mt-1">
              {title.length}/60 {t('tools.metaTagGenerator.characters')}
            </p>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.metaTagGenerator.description')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of your website"
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <p className="text-xs text-slate-400 mt-1">
              {description.length}/160 {t('tools.metaTagGenerator.characters')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.metaTagGenerator.keywords')}
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.metaTagGenerator.author')}
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author Name"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.metaTagGenerator.robots')}
            </label>
            <select
              value={robots}
              onChange={(e) => setRobots(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            >
              {robotsOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.metaTagGenerator.socialMedia')}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.metaTagGenerator.siteUrl')}
            </label>
            <input
              type="text"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.metaTagGenerator.ogImage')}
            </label>
            <input
              type="text"
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.metaTagGenerator.twitterHandle')}
            </label>
            <input
              type="text"
              value={twitterHandle}
              onChange={(e) => setTwitterHandle(e.target.value)}
              placeholder="@yourhandle"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.metaTagGenerator.generatedTags')}
          </h3>
          <Button variant="secondary" onClick={() => copy(metaTags)}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>

        <pre className="p-3 bg-slate-50 rounded-lg overflow-x-auto max-h-96">
          <code className="font-mono text-xs text-slate-800">{metaTags}</code>
        </pre>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.metaTagGenerator.preview')}
        </h3>

        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <p className="text-xs text-slate-500 mb-2">Google Search Preview</p>
            <div className="text-blue-600 text-lg hover:underline cursor-pointer">
              {title || 'Page Title'}
            </div>
            <div className="text-green-700 text-sm">{siteUrl}</div>
            <div className="text-slate-600 text-sm mt-1">
              {description.slice(0, 160)}{description.length > 160 ? '...' : ''}
            </div>
          </div>

          <div className="p-4 bg-slate-800 rounded-lg">
            <p className="text-xs text-slate-400 mb-2">Twitter Card Preview</p>
            <div className="bg-slate-700 rounded-lg overflow-hidden">
              <div className="h-32 bg-slate-600 flex items-center justify-center text-slate-400">
                {ogImage ? 'Image Preview' : 'No Image'}
              </div>
              <div className="p-3">
                <p className="text-white font-medium">{title}</p>
                <p className="text-slate-400 text-sm mt-1">{description.slice(0, 100)}</p>
                <p className="text-slate-500 text-xs mt-2">{siteUrl}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.metaTagGenerator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.metaTagGenerator.tip1')}</li>
          <li>{t('tools.metaTagGenerator.tip2')}</li>
          <li>{t('tools.metaTagGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
