import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface HeaderCheck {
  header: string
  status: 'present' | 'missing' | 'warning'
  value?: string
  description: string
  recommendation: string
}

export default function SecurityHeadersChecker() {
  const { t } = useTranslation()
  const [headers, setHeaders] = useState('')
  const [results, setResults] = useState<HeaderCheck[]>([])
  const [score, setScore] = useState(0)

  const securityHeaders = [
    {
      name: 'Strict-Transport-Security',
      description: 'Forces HTTPS connections',
      recommendation: 'max-age=31536000; includeSubDomains; preload',
      weight: 2,
    },
    {
      name: 'Content-Security-Policy',
      description: 'Controls resource loading to prevent XSS',
      recommendation: "default-src 'self'; script-src 'self'",
      weight: 3,
    },
    {
      name: 'X-Content-Type-Options',
      description: 'Prevents MIME type sniffing',
      recommendation: 'nosniff',
      weight: 1,
    },
    {
      name: 'X-Frame-Options',
      description: 'Prevents clickjacking attacks',
      recommendation: 'DENY or SAMEORIGIN',
      weight: 2,
    },
    {
      name: 'X-XSS-Protection',
      description: 'Legacy XSS filter (use CSP instead)',
      recommendation: '1; mode=block',
      weight: 1,
    },
    {
      name: 'Referrer-Policy',
      description: 'Controls referrer information',
      recommendation: 'strict-origin-when-cross-origin',
      weight: 1,
    },
    {
      name: 'Permissions-Policy',
      description: 'Controls browser features',
      recommendation: 'geolocation=(), microphone=(), camera=()',
      weight: 1,
    },
    {
      name: 'Cache-Control',
      description: 'Controls caching behavior',
      recommendation: 'no-store for sensitive data',
      weight: 1,
    },
  ]

  const analyzeHeaders = () => {
    const headerLines = headers.split('\n').map(line => line.trim()).filter(Boolean)
    const headerMap: Record<string, string> = {}

    headerLines.forEach(line => {
      const colonIndex = line.indexOf(':')
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim()
        const value = line.substring(colonIndex + 1).trim()
        headerMap[key.toLowerCase()] = value
      }
    })

    const checks: HeaderCheck[] = securityHeaders.map(header => {
      const found = headerMap[header.name.toLowerCase()]

      if (found) {
        // Check for weak values
        let status: 'present' | 'warning' = 'present'
        if (header.name === 'X-XSS-Protection' && found === '0') {
          status = 'warning'
        }
        if (header.name === 'Strict-Transport-Security') {
          const maxAge = parseInt(found.match(/max-age=(\d+)/)?.[1] || '0')
          if (maxAge < 31536000) status = 'warning'
        }

        return {
          header: header.name,
          status,
          value: found,
          description: header.description,
          recommendation: header.recommendation,
        }
      }

      return {
        header: header.name,
        status: 'missing',
        description: header.description,
        recommendation: header.recommendation,
      }
    })

    setResults(checks)

    // Calculate score
    const totalWeight = securityHeaders.reduce((sum, h) => sum + h.weight, 0)
    const earnedWeight = checks.reduce((sum, check, i) => {
      if (check.status === 'present') return sum + securityHeaders[i].weight
      if (check.status === 'warning') return sum + securityHeaders[i].weight * 0.5
      return sum
    }, 0)

    setScore(Math.round((earnedWeight / totalWeight) * 100))
  }

  const getStatusIcon = (status: HeaderCheck['status']): string => {
    switch (status) {
      case 'present': return '✓'
      case 'warning': return '⚠'
      case 'missing': return '✗'
    }
  }

  const getStatusColor = (status: HeaderCheck['status']): string => {
    switch (status) {
      case 'present': return 'text-green-600 bg-green-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      case 'missing': return 'text-red-600 bg-red-50'
    }
  }

  const loadSample = () => {
    setHeaders(`HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Content-Security-Policy: default-src 'self'
Referrer-Policy: strict-origin-when-cross-origin`)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{t('tools.securityHeadersChecker.input')}</h3>
          <button
            onClick={loadSample}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            Load Sample
          </button>
        </div>
        <textarea
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          placeholder="Paste HTTP response headers here..."
          rows={8}
          className="w-full px-3 py-2 border border-slate-300 rounded resize-none font-mono text-sm"
        />
        <button
          onClick={analyzeHeaders}
          disabled={!headers.trim()}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300"
        >
          {t('tools.securityHeadersChecker.analyze')}
        </button>
      </div>

      {results.length > 0 && (
        <>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">{t('tools.securityHeadersChecker.score')}</h3>
              <span className={`text-2xl font-bold ${
                score >= 80 ? 'text-green-600' :
                score >= 50 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {score}/100
              </span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  score >= 80 ? 'bg-green-500' :
                  score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-slate-500">
              <span>
                {results.filter(r => r.status === 'present').length} present
              </span>
              <span>
                {results.filter(r => r.status === 'warning').length} warnings
              </span>
              <span>
                {results.filter(r => r.status === 'missing').length} missing
              </span>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.securityHeadersChecker.results')}</h3>
            <div className="space-y-2">
              {results.map((result) => (
                <div key={result.header} className={`p-3 rounded ${getStatusColor(result.status)}`}>
                  <div className="flex items-start gap-2">
                    <span className="text-lg mt-0.5">{getStatusIcon(result.status)}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{result.header}</span>
                        {result.status !== 'missing' && (
                          <span className="text-xs font-mono bg-white/50 px-2 py-0.5 rounded">
                            {result.value?.substring(0, 40)}{result.value && result.value.length > 40 ? '...' : ''}
                          </span>
                        )}
                      </div>
                      <p className="text-sm opacity-80">{result.description}</p>
                      {result.status !== 'present' && (
                        <p className="text-xs mt-1">
                          <strong>Recommended:</strong> {result.recommendation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="card p-4 bg-blue-50">
        <h4 className="font-medium mb-2">{t('tools.securityHeadersChecker.howTo')}</h4>
        <p className="text-sm text-slate-600 mb-2">To get HTTP headers:</p>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• <strong>Browser DevTools:</strong> Network tab → Select request → Headers</li>
          <li>• <strong>curl:</strong> <code className="bg-white px-1 rounded">curl -I https://example.com</code></li>
          <li>• <strong>Online tools:</strong> SecurityHeaders.com, Mozilla Observatory</li>
        </ul>
      </div>
    </div>
  )
}
