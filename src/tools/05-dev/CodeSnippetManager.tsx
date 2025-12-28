import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

interface Snippet {
  id: string
  title: string
  language: string
  code: string
  tags: string[]
  createdAt: number
}

const STORAGE_KEY = 'code-snippets'

export default function CodeSnippetManager() {
  const { t } = useTranslation()
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState('')
  const [tags, setTags] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterLanguage, setFilterLanguage] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const { copy, copied } = useClipboard()

  const languages = [
    'javascript', 'typescript', 'python', 'java', 'csharp', 'go', 'rust',
    'php', 'ruby', 'swift', 'kotlin', 'html', 'css', 'sql', 'bash', 'json', 'yaml', 'other'
  ]

  // Load snippets from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setSnippets(JSON.parse(stored))
      }
    } catch {
      // Ignore parse errors
    }
  }, [])

  // Save snippets to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets))
  }, [snippets])

  const saveSnippet = useCallback(() => {
    if (!title.trim() || !code.trim()) return

    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean)

    if (editingId) {
      setSnippets(snippets.map(s =>
        s.id === editingId
          ? { ...s, title, language, code, tags: tagList }
          : s
      ))
      setEditingId(null)
    } else {
      const newSnippet: Snippet = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        title,
        language,
        code,
        tags: tagList,
        createdAt: Date.now()
      }
      setSnippets([newSnippet, ...snippets])
    }

    setTitle('')
    setCode('')
    setTags('')
  }, [title, language, code, tags, editingId, snippets])

  const editSnippet = useCallback((snippet: Snippet) => {
    setEditingId(snippet.id)
    setTitle(snippet.title)
    setLanguage(snippet.language)
    setCode(snippet.code)
    setTags(snippet.tags.join(', '))
  }, [])

  const deleteSnippet = useCallback((id: string) => {
    setSnippets(snippets.filter(s => s.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setTitle('')
      setCode('')
      setTags('')
    }
  }, [snippets, editingId])

  const cancelEdit = useCallback(() => {
    setEditingId(null)
    setTitle('')
    setCode('')
    setTags('')
  }, [])

  const filteredSnippets = snippets.filter(s => {
    const matchesSearch = !searchQuery ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesLanguage = !filterLanguage || s.language === filterLanguage
    return matchesSearch && matchesLanguage
  })

  const exportSnippets = useCallback(() => {
    const json = JSON.stringify(snippets, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'code-snippets.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [snippets])

  const importSnippets = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result as string)
        if (Array.isArray(imported)) {
          setSnippets([...imported, ...snippets])
        }
      } catch {
        // Invalid JSON
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }, [snippets])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {editingId ? t('tools.codeSnippetManager.editSnippet') : t('tools.codeSnippetManager.addSnippet')}
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.codeSnippetManager.title')}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Snippet title"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.codeSnippetManager.language')}
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.codeSnippetManager.code')}
            </label>
            <TextArea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Your code here..."
              rows={6}
              className="font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              {t('tools.codeSnippetManager.tags')} ({t('tools.codeSnippetManager.commaSeparated')})
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="utility, helper, api"
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="primary" onClick={saveSnippet} disabled={!title.trim() || !code.trim()}>
              {editingId ? t('tools.codeSnippetManager.update') : t('tools.codeSnippetManager.save')}
            </Button>
            {editingId && (
              <Button variant="secondary" onClick={cancelEdit}>
                {t('common.cancel')}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.codeSnippetManager.yourSnippets')} ({snippets.length})
          </h3>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={exportSnippets} disabled={snippets.length === 0}>
              {t('tools.codeSnippetManager.export')}
            </Button>
            <label className="cursor-pointer">
              <input type="file" accept=".json" onChange={importSnippets} className="hidden" />
              <span className="px-3 py-1.5 text-sm border border-slate-300 rounded bg-white hover:bg-slate-50">
                {t('tools.codeSnippetManager.import')}
              </span>
            </label>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('tools.codeSnippetManager.search')}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
          />
          <select
            value={filterLanguage}
            onChange={(e) => setFilterLanguage(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded text-sm"
          >
            <option value="">{t('tools.codeSnippetManager.allLanguages')}</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        {filteredSnippets.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">
            {snippets.length === 0
              ? t('tools.codeSnippetManager.noSnippets')
              : t('tools.codeSnippetManager.noMatches')}
          </p>
        ) : (
          <div className="space-y-3">
            {filteredSnippets.map(snippet => (
              <div key={snippet.id} className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-slate-700">{snippet.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                        {snippet.language}
                      </span>
                      {snippet.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="secondary" onClick={() => copy(snippet.code)}>
                      {copied ? t('common.copied') : t('common.copy')}
                    </Button>
                    <Button variant="secondary" onClick={() => editSnippet(snippet)}>
                      {t('tools.codeSnippetManager.edit')}
                    </Button>
                    <button
                      onClick={() => deleteSnippet(snippet.id)}
                      className="p-1.5 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <pre className="p-2 bg-white rounded overflow-x-auto max-h-32">
                  <code className="font-mono text-xs text-slate-800">{snippet.code}</code>
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.codeSnippetManager.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.codeSnippetManager.tip1')}</li>
          <li>{t('tools.codeSnippetManager.tip2')}</li>
          <li>{t('tools.codeSnippetManager.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
