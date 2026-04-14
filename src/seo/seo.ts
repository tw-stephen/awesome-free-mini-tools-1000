import { FaqEntry } from '../content/faq'

export const SITE_NAME = 'Awesome Free Mini Tools 1000'
export const SITE_URL =
  import.meta.env.VITE_SITE_URL || 'https://stephen-taipei.github.io/awesome-free-mini-tools-1000'
export const DEFAULT_TITLE = SITE_NAME
export const DEFAULT_DESCRIPTION =
  '1000 browser-based mini tools for text, image, data, developer, and productivity workflows. Privacy-first, frontend-only, and easy to use.'

const absoluteUrl = (path = '') => {
  const base = SITE_URL.replace(/\/$/, '')
  if (!path) return `${base}/`
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (path.startsWith('/')) return `${base}${path}`
  return `${base}/${path}`
}

const upsertMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attr, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

const upsertLink = (rel: string, href: string, attrs: Record<string, string> = {}) => {
  const selector = Object.entries({ rel, ...attrs })
    .map(([key, value]) => `[${key}="${value}"]`)
    .join('')
  let element = document.head.querySelector<HTMLLinkElement>(`link${selector}`)
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    Object.entries(attrs).forEach(([key, value]) => element?.setAttribute(key, value))
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

const upsertJsonLd = (id: string, data: unknown) => {
  let element = document.head.querySelector<HTMLScriptElement>(`script[data-seo-id="${id}"]`)
  if (!element) {
    element = document.createElement('script')
    element.type = 'application/ld+json'
    element.dataset.seoId = id
    document.head.appendChild(element)
  }
  element.textContent = JSON.stringify(data)
}

const clearJsonLd = (ids: string[]) => {
  ids.forEach((id) => {
    const element = document.head.querySelector<HTMLScriptElement>(`script[data-seo-id="${id}"]`)
    if (element) element.remove()
  })
}

export const buildToolUrl = (toolPath: string) => absoluteUrl(`/?tool=${encodeURIComponent(toolPath)}`)

export const buildFaqSchema = (items: FaqEntry[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
})

export const buildWebsiteSchema = (description: string, language: string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: absoluteUrl('/'),
  description,
  inLanguage: language,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${absoluteUrl('/')}?tool={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
})

export const buildCollectionSchema = (description: string, language: string) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: SITE_NAME,
  url: absoluteUrl('/'),
  description,
  inLanguage: language,
})

export const buildToolSchema = ({
  name,
  description,
  url,
  category,
  language,
}: {
  name: string
  description: string
  url: string
  category: string
  language: string
}) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name,
  description,
  url,
  applicationCategory: category,
  operatingSystem: 'Web',
  inLanguage: language,
  isAccessibleForFree: true,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
})

export const applySeo = ({
  title,
  description,
  canonical,
  type = 'website',
  language,
  jsonLd = [],
}: {
  title: string
  description: string
  canonical: string
  type?: string
  language: string
  jsonLd?: Array<{ id: string; data: unknown }>
}) => {
  document.title = title
  document.documentElement.lang = language

  upsertMeta('name', 'description', description)
  upsertMeta('name', 'robots', 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1')
  upsertMeta('property', 'og:title', title)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:type', type)
  upsertMeta('property', 'og:url', canonical)
  upsertMeta('property', 'og:site_name', SITE_NAME)
  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', title)
  upsertMeta('name', 'twitter:description', description)

  upsertLink('canonical', canonical)
  upsertLink('alternate', absoluteUrl('/llms.txt'), { type: 'text/plain', title: 'LLMs.txt' })
  upsertLink('sitemap', absoluteUrl('/sitemap.xml'), { type: 'application/xml' })

  clearJsonLd(['website', 'collection', 'faq', 'tool'])
  jsonLd.forEach((item) => upsertJsonLd(item.id, item.data))
}

