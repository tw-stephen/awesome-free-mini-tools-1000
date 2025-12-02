import { useTranslation } from 'react-i18next'
import { ToolInfo } from '../tools/registry'

interface ToolPageProps {
  tool: ToolInfo
  onBack: () => void
}

export default function ToolPage({ tool, onBack }: ToolPageProps) {
  const { t } = useTranslation()
  const ToolComponent = tool.component

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('common.home')}
        </button>
      </div>

      {/* Tool Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-sm font-medium mb-3">
          #{tool.id} · {t(`categories.${tool.category}`)}
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {t(tool.nameKey)}
        </h1>
        <p className="text-slate-600">
          {t(tool.descriptionKey)}
        </p>
      </div>

      {/* Tool Component */}
      <ToolComponent />
    </div>
  )
}
