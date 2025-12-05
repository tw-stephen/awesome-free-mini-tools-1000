import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { tools, categories } from '../registry'
import { useHashRouter } from '../../hooks/useHashRouter'

export default function ToolIndex() {
  const { t } = useTranslation()
  const { navigate } = useHashRouter()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredTools = useMemo(() => {
    let result = tools

    if (selectedCategory !== 'all') {
      result = result.filter((tool) => tool.category === selectedCategory)
    }

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (tool) =>
          tool.id.includes(q) ||
          t(tool.nameKey).toLowerCase().includes(q) ||
          t(tool.descriptionKey).toLowerCase().includes(q)
      )
    }

    return result
  }, [search, selectedCategory, t])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('tools.toolIndex.searchPlaceholder')}
            className="input w-full"
            autoFocus
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="select md:w-48"
        >
          <option value="all">{t('common.allTools')}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {t(cat.nameKey)}
            </option>
          ))}
        </select>
      </div>

      <div className="text-sm text-slate-500">
        {t('tools.toolIndex.showing')} {filteredTools.length} {t('tools.toolIndex.tools')}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => navigate(tool.path)}
            className="card p-4 cursor-pointer hover:shadow-md hover:border-primary-300 transition-all duration-200 group"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary-50 text-primary-500 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold">
                #{tool.id}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-slate-800 group-hover:text-primary-600 truncate">
                  {t(tool.nameKey)}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {t(tool.descriptionKey)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredTools.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          {t('common.noContent')}
        </div>
      )}
    </div>
  )
}
