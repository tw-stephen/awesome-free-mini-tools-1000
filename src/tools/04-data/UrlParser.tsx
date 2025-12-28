import { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

interface ParsedUrl {
  protocol: string
  username: string
  password: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string
  origin: string
  host: string
  searchParams: [string, string][]
}

export default function UrlParser() {
  const { t } = useTranslation()
  const [url, setUrl] = useState('https://user:pass@example.com:8080/path/to/page?foo=bar&baz=qux#section')
  const [error, setError] = useState('')
  const { copy, copied } = useClipboard()

  const parsedUrl = useMemo((): ParsedUrl | null => {
    if (!url.trim()) {
      setError('')
      return null
    }

    try {
      const parsed = new URL(url)
      setError('')

      return {
        protocol: parsed.protocol,
        username: parsed.username,
        password: parsed.password,
        hostname: parsed.hostname,
        port: parsed.port,
        pathname: parsed.pathname,
        search: parsed.search,
        hash: parsed.hash,
        origin: parsed.origin,
        host: parsed.host,
        searchParams: Array.from(parsed.searchParams.entries()),
      }
    } catch {
      setError(t('tools.urlParser.invalidUrl'))
      return null
    }
  }, [url, t])

  const buildUrl = useCallback(
    (updates: Partial<ParsedUrl>): string => {
      if (!parsedUrl) return url

      try {
        const newUrl = new URL(url)

        if (updates.protocol) newUrl.protocol = updates.protocol
        if (updates.username !== undefined) newUrl.username = updates.username
        if (updates.password !== undefined) newUrl.password = updates.password
        if (updates.hostname) newUrl.hostname = updates.hostname
        if (updates.port !== undefined) newUrl.port = updates.port
        if (updates.pathname) newUrl.pathname = updates.pathname
        if (updates.search !== undefined) newUrl.search = updates.search
        if (updates.hash !== undefined) newUrl.hash = updates.hash

        return newUrl.toString()
      } catch {
        return url
      }
    },
    [parsedUrl, url]
  )

  const handlePartChange = (part: keyof ParsedUrl, value: string) => {
    const newUrl = buildUrl({ [part]: value })
    setUrl(newUrl)
  }

  const addQueryParam = (key: string, value: string) => {
    if (!parsedUrl) return

    try {
      const newUrl = new URL(url)
      newUrl.searchParams.append(key, value)
      setUrl(newUrl.toString())
    } catch {
      // ignore
    }
  }

  const removeQueryParam = (key: string) => {
    if (!parsedUrl) return

    try {
      const newUrl = new URL(url)
      newUrl.searchParams.delete(key)
      setUrl(newUrl.toString())
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.urlParser.input')}
          </h3>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => copy(url)}>
              {copied ? t('common.copied') : t('common.copy')}
            </Button>
            <Button variant="secondary" onClick={() => setUrl('')}>
              {t('common.clear')}
            </Button>
          </div>
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/path?query=value#hash"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {parsedUrl && (
        <>
          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.urlParser.components')}
            </h3>

            <div className="space-y-3">
              {[
                { key: 'protocol', label: t('tools.urlParser.protocol'), value: parsedUrl.protocol },
                { key: 'username', label: t('tools.urlParser.username'), value: parsedUrl.username },
                { key: 'password', label: t('tools.urlParser.password'), value: parsedUrl.password },
                { key: 'hostname', label: t('tools.urlParser.hostname'), value: parsedUrl.hostname },
                { key: 'port', label: t('tools.urlParser.port'), value: parsedUrl.port },
                { key: 'pathname', label: t('tools.urlParser.pathname'), value: parsedUrl.pathname },
                { key: 'search', label: t('tools.urlParser.search'), value: parsedUrl.search },
                { key: 'hash', label: t('tools.urlParser.hash'), value: parsedUrl.hash },
              ].map(({ key, label, value }) => (
                <div key={key} className="flex items-center gap-2">
                  <label className="w-24 text-sm text-slate-600">{label}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handlePartChange(key as keyof ParsedUrl, e.target.value)}
                    className="flex-1 px-2 py-1 text-sm font-mono border border-slate-300 rounded"
                    placeholder={`(${t('tools.urlParser.empty')})`}
                  />
                  <button
                    onClick={() => copy(value)}
                    className="text-blue-500 hover:text-blue-700 text-xs"
                  >
                    {t('common.copy')}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.urlParser.derived')}
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span className="text-sm text-slate-600">{t('tools.urlParser.origin')}</span>
                <span className="font-mono text-sm text-slate-800">{parsedUrl.origin}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span className="text-sm text-slate-600">{t('tools.urlParser.host')}</span>
                <span className="font-mono text-sm text-slate-800">{parsedUrl.host}</span>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-700">
                {t('tools.urlParser.queryParams')} ({parsedUrl.searchParams.length})
              </h3>
              <Button
                variant="secondary"
                onClick={() => {
                  const key = prompt(t('tools.urlParser.enterKey'))
                  const value = prompt(t('tools.urlParser.enterValue'))
                  if (key) addQueryParam(key, value || '')
                }}
              >
                + {t('tools.urlParser.addParam')}
              </Button>
            </div>

            {parsedUrl.searchParams.length === 0 ? (
              <p className="text-sm text-slate-500 italic">
                {t('tools.urlParser.noParams')}
              </p>
            ) : (
              <div className="space-y-2">
                {parsedUrl.searchParams.map(([key, value], i) => (
                  <div
                    key={`${key}-${i}`}
                    className="flex items-center gap-2 p-2 bg-slate-50 rounded"
                  >
                    <span className="font-mono text-sm text-blue-600">{key}</span>
                    <span className="text-slate-400">=</span>
                    <span className="flex-1 font-mono text-sm text-slate-800 truncate">
                      {value}
                    </span>
                    <button
                      onClick={() => copy(`${key}=${value}`)}
                      className="text-blue-500 hover:text-blue-700 text-xs"
                    >
                      {t('common.copy')}
                    </button>
                    <button
                      onClick={() => removeQueryParam(key)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              {t('tools.urlParser.encoded')}
            </h3>

            <div className="space-y-2">
              <div className="p-2 bg-slate-50 rounded">
                <span className="text-xs text-slate-500">encodeURIComponent:</span>
                <p className="font-mono text-sm text-slate-800 break-all mt-1">
                  {encodeURIComponent(url)}
                </p>
              </div>
              <div className="p-2 bg-slate-50 rounded">
                <span className="text-xs text-slate-500">encodeURI:</span>
                <p className="font-mono text-sm text-slate-800 break-all mt-1">
                  {encodeURI(url)}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
