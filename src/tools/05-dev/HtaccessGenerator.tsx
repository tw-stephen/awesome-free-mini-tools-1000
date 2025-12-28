import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function HtaccessGenerator() {
  const { t } = useTranslation()
  const [enableRewrite, setEnableRewrite] = useState(true)
  const [httpsRedirect, setHttpsRedirect] = useState(false)
  const [wwwRedirect, setWwwRedirect] = useState<'none' | 'www' | 'non-www'>('none')
  const [defaultIndex, _setDefaultIndex] = useState('index.php index.html')
  const [errorPages, _setErrorPages] = useState([
    { code: '404', page: '/404.html' },
    { code: '500', page: '/500.html' },
  ])
  const [enableGzip, setEnableGzip] = useState(true)
  const [enableCaching, setEnableCaching] = useState(true)
  const [cacheDays, setCacheDays] = useState(30)
  const [preventHotlinking, setPreventHotlinking] = useState(false)
  const [hotlinkDomains, setHotlinkDomains] = useState('example.com')
  const [blockIps, _setBlockIps] = useState<string[]>([])
  const [customRules, _setCustomRules] = useState('')
  const { copy, copied } = useClipboard()

  const output = useMemo(() => {
    const lines: string[] = []

    // Header
    lines.push('# Generated .htaccess file')
    lines.push('')

    // Rewrite engine
    if (enableRewrite || httpsRedirect || wwwRedirect !== 'none') {
      lines.push('# Enable Rewrite Engine')
      lines.push('<IfModule mod_rewrite.c>')
      lines.push('    RewriteEngine On')
      lines.push('')

      // HTTPS redirect
      if (httpsRedirect) {
        lines.push('    # Force HTTPS')
        lines.push('    RewriteCond %{HTTPS} off')
        lines.push('    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]')
        lines.push('')
      }

      // WWW redirect
      if (wwwRedirect === 'www') {
        lines.push('    # Redirect to www')
        lines.push('    RewriteCond %{HTTP_HOST} !^www\\. [NC]')
        lines.push('    RewriteRule ^(.*)$ https://www.%{HTTP_HOST}/$1 [R=301,L]')
        lines.push('')
      } else if (wwwRedirect === 'non-www') {
        lines.push('    # Redirect to non-www')
        lines.push('    RewriteCond %{HTTP_HOST} ^www\\.(.*)$ [NC]')
        lines.push('    RewriteRule ^(.*)$ https://%1/$1 [R=301,L]')
        lines.push('')
      }

      // SPA support (if needed)
      if (enableRewrite) {
        lines.push('    # SPA Support - Route all requests to index')
        lines.push('    RewriteCond %{REQUEST_FILENAME} !-f')
        lines.push('    RewriteCond %{REQUEST_FILENAME} !-d')
        lines.push('    RewriteRule ^(.*)$ /index.html [L]')
      }

      lines.push('</IfModule>')
      lines.push('')
    }

    // Default index
    if (defaultIndex) {
      lines.push('# Default directory index')
      lines.push(`DirectoryIndex ${defaultIndex}`)
      lines.push('')
    }

    // Error pages
    if (errorPages.some(e => e.code && e.page)) {
      lines.push('# Custom error pages')
      for (const err of errorPages) {
        if (err.code && err.page) {
          lines.push(`ErrorDocument ${err.code} ${err.page}`)
        }
      }
      lines.push('')
    }

    // Gzip compression
    if (enableGzip) {
      lines.push('# Enable Gzip compression')
      lines.push('<IfModule mod_deflate.c>')
      lines.push('    AddOutputFilterByType DEFLATE text/plain')
      lines.push('    AddOutputFilterByType DEFLATE text/html')
      lines.push('    AddOutputFilterByType DEFLATE text/xml')
      lines.push('    AddOutputFilterByType DEFLATE text/css')
      lines.push('    AddOutputFilterByType DEFLATE application/xml')
      lines.push('    AddOutputFilterByType DEFLATE application/xhtml+xml')
      lines.push('    AddOutputFilterByType DEFLATE application/rss+xml')
      lines.push('    AddOutputFilterByType DEFLATE application/javascript')
      lines.push('    AddOutputFilterByType DEFLATE application/x-javascript')
      lines.push('    AddOutputFilterByType DEFLATE application/json')
      lines.push('</IfModule>')
      lines.push('')
    }

    // Browser caching
    if (enableCaching) {
      lines.push('# Browser caching')
      lines.push('<IfModule mod_expires.c>')
      lines.push('    ExpiresActive On')
      lines.push(`    ExpiresDefault "access plus ${cacheDays} days"`)
      lines.push('')
      lines.push('    ExpiresByType text/css "access plus 1 year"')
      lines.push('    ExpiresByType text/javascript "access plus 1 year"')
      lines.push('    ExpiresByType application/javascript "access plus 1 year"')
      lines.push('    ExpiresByType image/gif "access plus 1 year"')
      lines.push('    ExpiresByType image/jpeg "access plus 1 year"')
      lines.push('    ExpiresByType image/png "access plus 1 year"')
      lines.push('    ExpiresByType image/svg+xml "access plus 1 year"')
      lines.push('    ExpiresByType image/webp "access plus 1 year"')
      lines.push('    ExpiresByType font/woff "access plus 1 year"')
      lines.push('    ExpiresByType font/woff2 "access plus 1 year"')
      lines.push('</IfModule>')
      lines.push('')
    }

    // Prevent hotlinking
    if (preventHotlinking && hotlinkDomains) {
      lines.push('# Prevent hotlinking')
      lines.push('<IfModule mod_rewrite.c>')
      lines.push('    RewriteEngine On')
      lines.push(`    RewriteCond %{HTTP_REFERER} !^$`)
      for (const domain of hotlinkDomains.split(',').map(d => d.trim())) {
        lines.push(`    RewriteCond %{HTTP_REFERER} !^https?://(www\\.)?${domain.replace('.', '\\.')} [NC]`)
      }
      lines.push('    RewriteRule \\.(jpg|jpeg|png|gif|webp|svg)$ - [F,NC,L]')
      lines.push('</IfModule>')
      lines.push('')
    }

    // Block IPs
    if (blockIps.filter(Boolean).length > 0) {
      lines.push('# Block specific IPs')
      lines.push('<RequireAll>')
      lines.push('    Require all granted')
      for (const ip of blockIps.filter(Boolean)) {
        lines.push(`    Require not ip ${ip}`)
      }
      lines.push('</RequireAll>')
      lines.push('')
    }

    // Security headers
    lines.push('# Security headers')
    lines.push('<IfModule mod_headers.c>')
    lines.push('    Header set X-Content-Type-Options "nosniff"')
    lines.push('    Header set X-Frame-Options "SAMEORIGIN"')
    lines.push('    Header set X-XSS-Protection "1; mode=block"')
    lines.push('</IfModule>')
    lines.push('')

    // Custom rules
    if (customRules.trim()) {
      lines.push('# Custom rules')
      lines.push(customRules.trim())
      lines.push('')
    }

    return lines.join('\n')
  }, [enableRewrite, httpsRedirect, wwwRedirect, defaultIndex, errorPages, enableGzip, enableCaching, cacheDays, preventHotlinking, hotlinkDomains, blockIps, customRules])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.htaccessGenerator.redirects')}
        </h3>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={httpsRedirect}
                onChange={(e) => setHttpsRedirect(e.target.checked)}
              />
              Force HTTPS
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={enableRewrite}
                onChange={(e) => setEnableRewrite(e.target.checked)}
              />
              SPA Support
            </label>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">WWW Redirect</label>
            <select
              value={wwwRedirect}
              onChange={(e) => setWwwRedirect(e.target.value as typeof wwwRedirect)}
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            >
              <option value="none">None</option>
              <option value="www">Redirect to www</option>
              <option value="non-www">Redirect to non-www</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.htaccessGenerator.performance')}
        </h3>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={enableGzip}
                onChange={(e) => setEnableGzip(e.target.checked)}
              />
              Enable Gzip
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={enableCaching}
                onChange={(e) => setEnableCaching(e.target.checked)}
              />
              Browser Caching
            </label>
          </div>

          {enableCaching && (
            <div>
              <label className="block text-xs text-slate-500 mb-1">Cache Duration (days)</label>
              <input
                type="number"
                value={cacheDays}
                onChange={(e) => setCacheDays(parseInt(e.target.value) || 30)}
                className="w-32 px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          )}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.htaccessGenerator.security')}
        </h3>

        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={preventHotlinking}
              onChange={(e) => setPreventHotlinking(e.target.checked)}
            />
            Prevent Hotlinking
          </label>

          {preventHotlinking && (
            <div>
              <label className="block text-xs text-slate-500 mb-1">Allowed Domains (comma separated)</label>
              <input
                type="text"
                value={hotlinkDomains}
                onChange={(e) => setHotlinkDomains(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
          )}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">.htaccess</h3>
          <Button variant="secondary" onClick={() => copy(output)}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>

        <pre className="p-3 bg-slate-50 rounded-lg overflow-x-auto max-h-96">
          <code className="font-mono text-xs text-slate-800">{output}</code>
        </pre>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.htaccessGenerator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.htaccessGenerator.tip1')}</li>
          <li>{t('tools.htaccessGenerator.tip2')}</li>
          <li>{t('tools.htaccessGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
