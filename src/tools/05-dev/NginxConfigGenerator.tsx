import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function NginxConfigGenerator() {
  const { t } = useTranslation()
  const [serverName, setServerName] = useState('example.com')
  const [listenPort, setListenPort] = useState('80')
  const [root, setRoot] = useState('/var/www/html')
  const [index, setIndex] = useState('index.html index.htm')
  const [enableSsl, setEnableSsl] = useState(false)
  const [sslCert, setSslCert] = useState('/etc/nginx/ssl/cert.pem')
  const [sslKey, setSslKey] = useState('/etc/nginx/ssl/key.pem')
  const [enableGzip, setEnableGzip] = useState(true)
  const [enableProxy, setEnableProxy] = useState(false)
  const [proxyPass, setProxyPass] = useState('http://localhost:3000')
  const [locations, setLocations] = useState([
    { path: '/', config: 'try_files $uri $uri/ =404;' }
  ])
  const { copy, copied } = useClipboard()

  const output = useMemo(() => {
    const lines: string[] = []

    lines.push('server {')

    // Listen directives
    if (enableSsl) {
      lines.push(`    listen 443 ssl;`)
      lines.push(`    listen [::]:443 ssl;`)
    } else {
      lines.push(`    listen ${listenPort};`)
      lines.push(`    listen [::]:${listenPort};`)
    }
    lines.push('')

    // Server name
    lines.push(`    server_name ${serverName};`)
    lines.push('')

    // SSL configuration
    if (enableSsl) {
      lines.push(`    ssl_certificate ${sslCert};`)
      lines.push(`    ssl_certificate_key ${sslKey};`)
      lines.push(`    ssl_protocols TLSv1.2 TLSv1.3;`)
      lines.push(`    ssl_ciphers HIGH:!aNULL:!MD5;`)
      lines.push('')
    }

    // Root and index
    if (!enableProxy) {
      lines.push(`    root ${root};`)
      lines.push(`    index ${index};`)
      lines.push('')
    }

    // Gzip
    if (enableGzip) {
      lines.push(`    gzip on;`)
      lines.push(`    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;`)
      lines.push(`    gzip_min_length 256;`)
      lines.push('')
    }

    // Locations
    for (const loc of locations) {
      if (enableProxy && loc.path === '/') {
        lines.push(`    location ${loc.path} {`)
        lines.push(`        proxy_pass ${proxyPass};`)
        lines.push(`        proxy_http_version 1.1;`)
        lines.push(`        proxy_set_header Upgrade $http_upgrade;`)
        lines.push(`        proxy_set_header Connection 'upgrade';`)
        lines.push(`        proxy_set_header Host $host;`)
        lines.push(`        proxy_cache_bypass $http_upgrade;`)
        lines.push(`    }`)
      } else {
        lines.push(`    location ${loc.path} {`)
        lines.push(`        ${loc.config}`)
        lines.push(`    }`)
      }
      lines.push('')
    }

    // Error pages
    lines.push(`    error_page 404 /404.html;`)
    lines.push(`    error_page 500 502 503 504 /50x.html;`)
    lines.push('')

    // Access log
    lines.push(`    access_log /var/log/nginx/${serverName}.access.log;`)
    lines.push(`    error_log /var/log/nginx/${serverName}.error.log;`)

    lines.push('}')

    // HTTP to HTTPS redirect
    if (enableSsl) {
      lines.push('')
      lines.push('server {')
      lines.push(`    listen 80;`)
      lines.push(`    listen [::]:80;`)
      lines.push(`    server_name ${serverName};`)
      lines.push(`    return 301 https://$server_name$request_uri;`)
      lines.push('}')
    }

    return lines.join('\n')
  }, [serverName, listenPort, root, index, enableSsl, sslCert, sslKey, enableGzip, enableProxy, proxyPass, locations])

  const presets = [
    {
      name: 'Static Site',
      config: () => {
        setEnableProxy(false)
        setRoot('/var/www/html')
        setLocations([{ path: '/', config: 'try_files $uri $uri/ =404;' }])
      }
    },
    {
      name: 'SPA (React/Vue)',
      config: () => {
        setEnableProxy(false)
        setRoot('/var/www/html')
        setLocations([{ path: '/', config: 'try_files $uri $uri/ /index.html;' }])
      }
    },
    {
      name: 'Reverse Proxy',
      config: () => {
        setEnableProxy(true)
        setProxyPass('http://localhost:3000')
      }
    },
    {
      name: 'PHP (Laravel)',
      config: () => {
        setEnableProxy(false)
        setRoot('/var/www/html/public')
        setIndex('index.php index.html')
        setLocations([
          { path: '/', config: 'try_files $uri $uri/ /index.php?$query_string;' },
          { path: '~ \\.php$', config: 'fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;\n        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;\n        include fastcgi_params;' }
        ])
      }
    },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.nginxConfigGenerator.presets')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {presets.map(preset => (
            <Button key={preset.name} variant="secondary" onClick={preset.config}>
              {preset.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.nginxConfigGenerator.configuration')}
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">server_name</label>
              <input
                type="text"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">listen port</label>
              <input
                type="text"
                value={listenPort}
                onChange={(e) => setListenPort(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
                disabled={enableSsl}
              />
            </div>
          </div>

          {!enableProxy && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">root</label>
                <input
                  type="text"
                  value={root}
                  onChange={(e) => setRoot(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">index</label>
                <input
                  type="text"
                  value={index}
                  onChange={(e) => setIndex(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={enableSsl}
                onChange={(e) => setEnableSsl(e.target.checked)}
              />
              Enable SSL
            </label>
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
                checked={enableProxy}
                onChange={(e) => setEnableProxy(e.target.checked)}
              />
              Reverse Proxy
            </label>
          </div>

          {enableSsl && (
            <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded">
              <div>
                <label className="block text-xs text-slate-500 mb-1">SSL Certificate</label>
                <input
                  type="text"
                  value={sslCert}
                  onChange={(e) => setSslCert(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">SSL Key</label>
                <input
                  type="text"
                  value={sslKey}
                  onChange={(e) => setSslKey(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
                />
              </div>
            </div>
          )}

          {enableProxy && (
            <div className="p-3 bg-slate-50 rounded">
              <label className="block text-xs text-slate-500 mb-1">proxy_pass</label>
              <input
                type="text"
                value={proxyPass}
                onChange={(e) => setProxyPass(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
              />
            </div>
          )}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">nginx.conf</h3>
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
          {t('tools.nginxConfigGenerator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.nginxConfigGenerator.tip1')}</li>
          <li>{t('tools.nginxConfigGenerator.tip2')}</li>
          <li>{t('tools.nginxConfigGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
