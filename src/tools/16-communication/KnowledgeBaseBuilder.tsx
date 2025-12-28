import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Article {
  id: number
  title: string
  category: string
  content: string
  tags: string[]
  lastUpdated: string
}

export default function KnowledgeBaseBuilder() {
  const { t } = useTranslation()
  const [kbName, setKbName] = useState('')
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState(['Getting Started', 'How-To', 'Troubleshooting', 'FAQ'])
  const [newCategory, setNewCategory] = useState('')
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  const createArticle = () => {
    const article: Article = {
      id: Date.now(),
      title: '',
      category: categories[0] || 'General',
      content: '',
      tags: [],
      lastUpdated: new Date().toISOString().split('T')[0]
    }
    setEditingArticle(article)
  }

  const saveArticle = () => {
    if (!editingArticle || !editingArticle.title.trim()) return
    const updatedArticle = { ...editingArticle, lastUpdated: new Date().toISOString().split('T')[0] }
    const existing = articles.find(a => a.id === editingArticle.id)
    if (existing) {
      setArticles(articles.map(a => a.id === editingArticle.id ? updatedArticle : a))
    } else {
      setArticles([...articles, updatedArticle])
    }
    setEditingArticle(null)
  }

  const deleteArticle = (id: number) => {
    setArticles(articles.filter(a => a.id !== id))
  }

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()])
      setNewCategory('')
    }
  }

  const filteredArticles = articles
    .filter(a => filterCategory === 'all' || a.category === filterCategory)
    .filter(a =>
      searchTerm === '' ||
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )

  const generateKB = (): string => {
    let text = `KNOWLEDGE BASE\\n${'='.repeat(50)}\\n`
    text += `Name: ${kbName || '[Knowledge Base]'}\\n`
    text += `Articles: ${articles.length}\\n\\n`

    categories.forEach(cat => {
      const catArticles = articles.filter(a => a.category === cat)
      if (catArticles.length > 0) {
        text += `${cat.toUpperCase()}\\n${'─'.repeat(30)}\\n`
        catArticles.forEach(a => {
          text += `\\n## ${a.title}\\n`
          if (a.tags.length > 0) text += `Tags: ${a.tags.join(', ')}\\n`
          text += `Last Updated: ${a.lastUpdated}\\n\\n`
          text += `${a.content}\\n`
        })
        text += '\\n'
      }
    })

    return text
  }

  const copyKB = () => {
    navigator.clipboard.writeText(generateKB())
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-1">{t('tools.knowledgeBaseBuilder.name')}</label>
        <input
          type="text"
          value={kbName}
          onChange={(e) => setKbName(e.target.value)}
          placeholder="Knowledge base name"
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.knowledgeBaseBuilder.categories')}</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {categories.map((cat, i) => (
            <span key={i} className="px-3 py-1 bg-slate-100 rounded text-sm">
              {cat}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
            placeholder="Add category"
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
          />
          <button
            onClick={addCategory}
            className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200"
          >
            Add
          </button>
        </div>
      </div>

      {editingArticle ? (
        <div className="card p-4">
          <h3 className="font-medium mb-3">
            {articles.find(a => a.id === editingArticle.id) ? 'Edit' : 'New'} Article
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              value={editingArticle.title}
              onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
              placeholder="Article title"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <select
              value={editingArticle.category}
              onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <textarea
              value={editingArticle.content}
              onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
              placeholder="Article content..."
              rows={8}
              className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
            />
            <input
              type="text"
              value={editingArticle.tags.join(', ')}
              onChange={(e) => setEditingArticle({
                ...editingArticle,
                tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
              })}
              placeholder="Tags (comma-separated)"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
            <div className="flex gap-2">
              <button
                onClick={saveArticle}
                className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Article
              </button>
              <button
                onClick={() => setEditingArticle(null)}
                className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="card p-4">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles..."
                className="flex-1 px-3 py-2 border border-slate-300 rounded"
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button
                onClick={createArticle}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                + New Article
              </button>
            </div>

            <h3 className="font-medium mb-3">
              {t('tools.knowledgeBaseBuilder.articles')} ({filteredArticles.length})
            </h3>

            {filteredArticles.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                {articles.length === 0 ? 'No articles yet. Create one!' : 'No matching articles'}
              </p>
            ) : (
              <div className="space-y-3">
                {filteredArticles.map((article) => (
                  <div key={article.id} className="p-4 bg-slate-50 rounded">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{article.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                            {article.category}
                          </span>
                          <span>Updated: {article.lastUpdated}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingArticle(article)}
                          className="px-3 py-1 text-sm bg-slate-200 rounded hover:bg-slate-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteArticle(article.id)}
                          className="px-3 py-1 text-sm text-red-500 hover:bg-red-100 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{article.content}</p>
                    {article.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {article.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-200 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.knowledgeBaseBuilder.export')}</h3>
            <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
              {generateKB()}
            </pre>
            <button
              onClick={copyKB}
              className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {t('tools.knowledgeBaseBuilder.copy')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
