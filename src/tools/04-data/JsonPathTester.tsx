import { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function JsonPathTester() {
  const { t } = useTranslation()
  const [json, setJson] = useState(`{
  "store": {
    "book": [
      { "category": "fiction", "title": "The Great Gatsby", "price": 10.99 },
      { "category": "fiction", "title": "1984", "price": 8.99 },
      { "category": "science", "title": "A Brief History of Time", "price": 15.99 }
    ],
    "bicycle": {
      "color": "red",
      "price": 199.99
    }
  }
}`)
  const [path, setPath] = useState('store.book[0].title')
  const [error, setError] = useState('')
  const { copy, copied } = useClipboard()

  const evaluatePath = useCallback(
    (obj: unknown, pathStr: string): unknown => {
      if (!pathStr.trim()) return obj

      const parts = pathStr.split(/\.|\[|\]/).filter(Boolean)
      let current: unknown = obj

      for (const part of parts) {
        if (current === null || current === undefined) {
          return undefined
        }

        if (typeof current === 'object') {
          const index = parseInt(part, 10)
          if (!isNaN(index) && Array.isArray(current)) {
            current = current[index]
          } else {
            current = (current as Record<string, unknown>)[part]
          }
        } else {
          return undefined
        }
      }

      return current
    },
    []
  )

  const result = useMemo(() => {
    if (!json.trim()) {
      setError('')
      return null
    }

    try {
      const parsed = JSON.parse(json)
      setError('')

      const value = evaluatePath(parsed, path)
      return {
        value,
        type: value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value,
        formatted: JSON.stringify(value, null, 2),
      }
    } catch (e) {
      setError(t('tools.jsonPathTester.invalidJson'))
      return null
    }
  }, [json, path, evaluatePath, t])

  const commonPaths = [
    'store',
    'store.book',
    'store.book[0]',
    'store.book[0].title',
    'store.book[1].price',
    'store.bicycle',
    'store.bicycle.color',
  ]

  const formatJson = () => {
    try {
      const parsed = JSON.parse(json)
      setJson(JSON.stringify(parsed, null, 2))
      setError('')
    } catch {
      setError(t('tools.jsonPathTester.invalidJson'))
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.jsonPathTester.json')}
          </h3>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={formatJson}>
              {t('tools.jsonPathTester.format')}
            </Button>
            <Button variant="secondary" onClick={() => setJson('')}>
              {t('common.clear')}
            </Button>
          </div>
        </div>
        <TextArea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          placeholder={t('tools.jsonPathTester.jsonPlaceholder')}
          rows={12}
          className="font-mono text-sm"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.jsonPathTester.path')}
        </h3>
        <input
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="store.book[0].title"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm"
        />

        <div className="flex gap-2 mt-2 flex-wrap">
          {commonPaths.map((p) => (
            <button
              key={p}
              onClick={() => setPath(p)}
              className={`px-2 py-1 text-xs rounded ${
                path === p
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.jsonPathTester.result')}
              <span className="ml-2 px-2 py-0.5 text-xs bg-slate-100 rounded">
                {result.type}
              </span>
            </h3>
            <Button variant="secondary" onClick={() => copy(result.formatted)}>
              {copied ? t('common.copied') : t('common.copy')}
            </Button>
          </div>

          {result.value === undefined ? (
            <p className="text-sm text-slate-500 italic">
              {t('tools.jsonPathTester.undefined')}
            </p>
          ) : (
            <pre className="p-3 bg-slate-50 rounded-lg font-mono text-sm text-slate-800 overflow-auto">
              {result.formatted}
            </pre>
          )}
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.jsonPathTester.syntax')}
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex gap-4">
            <code className="text-blue-600">object.property</code>
            <span className="text-slate-600">- {t('tools.jsonPathTester.accessProp')}</span>
          </div>
          <div className="flex gap-4">
            <code className="text-blue-600">array[0]</code>
            <span className="text-slate-600">- {t('tools.jsonPathTester.accessIndex')}</span>
          </div>
          <div className="flex gap-4">
            <code className="text-blue-600">obj.arr[0].prop</code>
            <span className="text-slate-600">- {t('tools.jsonPathTester.nested')}</span>
          </div>
        </div>
      </div>

      {result && json && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.jsonPathTester.structure')}
          </h3>

          <div className="font-mono text-sm">
            {(() => {
              try {
                const parsed = JSON.parse(json)
                const renderStructure = (obj: unknown, prefix = ''): JSX.Element[] => {
                  const items: JSX.Element[] = []

                  if (obj === null) {
                    items.push(
                      <div key={prefix} className="text-slate-500">
                        {prefix || '(root)'}: null
                      </div>
                    )
                  } else if (Array.isArray(obj)) {
                    obj.slice(0, 3).forEach((item, i) => {
                      const newPrefix = `${prefix}[${i}]`
                      if (typeof item === 'object' && item !== null) {
                        items.push(...renderStructure(item, newPrefix))
                      } else {
                        items.push(
                          <button
                            key={newPrefix}
                            onClick={() => setPath(newPrefix.replace(/^\./, ''))}
                            className="block text-left text-blue-600 hover:underline"
                          >
                            {newPrefix}: {typeof item}
                          </button>
                        )
                      }
                    })
                    if (obj.length > 3) {
                      items.push(
                        <div key={`${prefix}...`} className="text-slate-400">
                          ... ({obj.length - 3} more)
                        </div>
                      )
                    }
                  } else if (typeof obj === 'object') {
                    Object.entries(obj).forEach(([key, value]) => {
                      const newPrefix = prefix ? `${prefix}.${key}` : key
                      if (typeof value === 'object' && value !== null) {
                        items.push(...renderStructure(value, newPrefix))
                      } else {
                        items.push(
                          <button
                            key={newPrefix}
                            onClick={() => setPath(newPrefix)}
                            className="block text-left text-blue-600 hover:underline"
                          >
                            {newPrefix}: {value === null ? 'null' : typeof value}
                          </button>
                        )
                      }
                    })
                  }

                  return items
                }

                return renderStructure(parsed)
              } catch {
                return null
              }
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
