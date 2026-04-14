import { useTranslation } from 'react-i18next'
import { tools, categories, getToolsByCategory } from '../tools/registry'
import { getFaqContent } from '../content/faq'

interface HomeProps {
  onNavigate: (path: string) => void
}

export default function Home({ onNavigate }: HomeProps) {
  const { t, i18n } = useTranslation()
  const faq = getFaqContent(i18n.resolvedLanguage)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          {t('home.title')}
        </h1>
        <p className="text-lg text-slate-600">
          {t('home.subtitle')}
        </p>
        <div className="mt-4 text-sm text-primary-600 font-medium">
          {tools.length} / 1000 {t('common.allTools')}
        </div>
      </div>

      {/* Tools by Category */}
      {categories.map((category) => {
        const categoryTools = getToolsByCategory(category.id)
        if (categoryTools.length === 0) return null

        return (
          <div key={category.id} className="mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm font-bold">
                {categoryTools.length}
              </span>
              {t(category.nameKey)}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {categoryTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => onNavigate(tool.path)}
                  className="card p-5 text-left hover:shadow-md hover:border-primary-300 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 transition-colors">
                      <span className="text-sm font-bold">#{tool.id}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 group-hover:text-primary-600 transition-colors">
                        {t(tool.nameKey)}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                        {t(tool.descriptionKey)}
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-slate-400 group-hover:text-primary-500 transition-colors flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )
      })}

      <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-800">{faq.title}</h2>
          <p className="mt-2 text-slate-600">{faq.intro}</p>
        </div>

        <div className="mt-6 space-y-4">
          {faq.items.map((item) => (
            <article key={item.question} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-lg font-semibold text-slate-800">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
