import Layout from './components/layout/Layout.tsx'
import Home from './pages/Home.tsx'
import ToolPage from './pages/ToolPage.tsx'
import { useHashRouter } from './hooks/useHashRouter.ts'
import { getToolByPath } from './tools/registry.ts'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getFaqContent } from './content/faq'
import {
  SITE_NAME,
  applySeo,
  buildCollectionSchema,
  buildFaqSchema,
  buildToolSchema,
  buildToolUrl,
  buildWebsiteSchema,
} from './seo/seo'

function App() {
  const { t, i18n } = useTranslation()
  const { path, navigate } = useHashRouter()
  const tool = getToolByPath(path)

  useEffect(() => {
    const language = i18n.resolvedLanguage || 'en'

    if (tool) {
      const name = t(tool.nameKey)
      const description = t(tool.descriptionKey)
      const canonical = buildToolUrl(tool.path)

      applySeo({
        title: `${name} | ${SITE_NAME}`,
        description,
        canonical,
        language,
        jsonLd: [
          {
            id: 'tool',
            data: buildToolSchema({
              name,
              description,
              url: canonical,
              category: t(`categories.${tool.category}`),
              language,
            }),
          },
        ],
      })

      return
    }

    const description = t('home.subtitle')
    const faq = getFaqContent(language)

    applySeo({
      title: `${t('home.title')} | ${SITE_NAME}`,
      description,
      canonical: 'https://stephen-taipei.github.io/awesome-free-mini-tools-1000/',
      language,
      jsonLd: [
        { id: 'website', data: buildWebsiteSchema(description, language) },
        { id: 'collection', data: buildCollectionSchema(description, language) },
        { id: 'faq', data: buildFaqSchema(faq.items) },
      ],
    })
  }, [i18n.resolvedLanguage, t, tool])

  return (
    <Layout>
      {tool ? (
        <ToolPage tool={tool} onBack={() => navigate('')} />
      ) : (
        <Home onNavigate={navigate} />
      )}
    </Layout>
  )
}

export default App
