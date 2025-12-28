import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

interface EnvVar {
  key: string
  value: string
  comment: string
}

export default function EnvFileGenerator() {
  const { t } = useTranslation()
  const [vars, setVars] = useState<EnvVar[]>([
    { key: 'NODE_ENV', value: 'development', comment: 'Environment mode' },
    { key: 'PORT', value: '3000', comment: 'Server port' },
    { key: 'DATABASE_URL', value: 'postgresql://user:pass@localhost:5432/db', comment: 'Database connection string' },
    { key: 'API_KEY', value: 'your-api-key-here', comment: 'API key for external service' },
  ])
  const [includeComments, setIncludeComments] = useState(true)
  const [quoteValues, setQuoteValues] = useState(false)
  const { copy, copied } = useClipboard()

  const addVar = () => {
    setVars([...vars, { key: '', value: '', comment: '' }])
  }

  const removeVar = (index: number) => {
    setVars(vars.filter((_, i) => i !== index))
  }

  const updateVar = (index: number, field: keyof EnvVar, value: string) => {
    setVars(vars.map((v, i) => i === index ? { ...v, [field]: value } : v))
  }

  const output = useMemo(() => {
    const lines: string[] = []

    for (const v of vars) {
      if (!v.key) continue

      if (includeComments && v.comment) {
        lines.push(`# ${v.comment}`)
      }

      let value = v.value
      if (quoteValues || value.includes(' ') || value.includes('#')) {
        value = `"${value.replace(/"/g, '\\"')}"`
      }

      lines.push(`${v.key}=${value}`)
      if (includeComments) lines.push('')
    }

    return lines.join('\n').trim()
  }, [vars, includeComments, quoteValues])

  const templates = [
    {
      name: 'Node.js',
      vars: [
        { key: 'NODE_ENV', value: 'development', comment: 'Environment mode' },
        { key: 'PORT', value: '3000', comment: 'Server port' },
        { key: 'HOST', value: 'localhost', comment: 'Server host' },
      ]
    },
    {
      name: 'Database',
      vars: [
        { key: 'DB_HOST', value: 'localhost', comment: 'Database host' },
        { key: 'DB_PORT', value: '5432', comment: 'Database port' },
        { key: 'DB_NAME', value: 'mydb', comment: 'Database name' },
        { key: 'DB_USER', value: 'user', comment: 'Database user' },
        { key: 'DB_PASSWORD', value: '', comment: 'Database password' },
      ]
    },
    {
      name: 'AWS',
      vars: [
        { key: 'AWS_ACCESS_KEY_ID', value: '', comment: 'AWS access key' },
        { key: 'AWS_SECRET_ACCESS_KEY', value: '', comment: 'AWS secret key' },
        { key: 'AWS_REGION', value: 'us-east-1', comment: 'AWS region' },
        { key: 'S3_BUCKET', value: '', comment: 'S3 bucket name' },
      ]
    },
    {
      name: 'JWT',
      vars: [
        { key: 'JWT_SECRET', value: 'your-super-secret-key', comment: 'JWT signing secret' },
        { key: 'JWT_EXPIRES_IN', value: '7d', comment: 'JWT expiration time' },
        { key: 'JWT_REFRESH_EXPIRES_IN', value: '30d', comment: 'Refresh token expiration' },
      ]
    },
    {
      name: 'Email',
      vars: [
        { key: 'SMTP_HOST', value: 'smtp.example.com', comment: 'SMTP server host' },
        { key: 'SMTP_PORT', value: '587', comment: 'SMTP server port' },
        { key: 'SMTP_USER', value: '', comment: 'SMTP username' },
        { key: 'SMTP_PASSWORD', value: '', comment: 'SMTP password' },
        { key: 'FROM_EMAIL', value: 'noreply@example.com', comment: 'Default from email' },
      ]
    },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.envFileGenerator.variables')}
          </h3>
          <Button variant="secondary" onClick={addVar}>
            {t('tools.envFileGenerator.addVariable')}
          </Button>
        </div>

        <div className="space-y-3">
          {vars.map((v, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-start">
              <div className="col-span-3">
                <input
                  type="text"
                  value={v.key}
                  onChange={(e) => updateVar(i, 'key', e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_'))}
                  placeholder="VARIABLE_NAME"
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm font-mono"
                />
              </div>
              <div className="col-span-4">
                <input
                  type="text"
                  value={v.value}
                  onChange={(e) => updateVar(i, 'value', e.target.value)}
                  placeholder="value"
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm font-mono"
                />
              </div>
              <div className="col-span-4">
                <input
                  type="text"
                  value={v.comment}
                  onChange={(e) => updateVar(i, 'comment', e.target.value)}
                  placeholder="Comment (optional)"
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                />
              </div>
              <div className="col-span-1">
                <button
                  onClick={() => removeVar(i)}
                  className="p-1.5 text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-4">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={includeComments}
              onChange={(e) => setIncludeComments(e.target.checked)}
            />
            {t('tools.envFileGenerator.includeComments')}
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={quoteValues}
              onChange={(e) => setQuoteValues(e.target.checked)}
            />
            {t('tools.envFileGenerator.quoteValues')}
          </label>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.envFileGenerator.templates')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {templates.map(template => (
            <Button
              key={template.name}
              variant="secondary"
              onClick={() => setVars([...vars, ...template.vars])}
            >
              + {template.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            .env
          </h3>
          <Button variant="secondary" onClick={() => copy(output)}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>

        <pre className="p-3 bg-slate-50 rounded-lg overflow-x-auto max-h-96">
          <code className="font-mono text-sm text-slate-800">{output || t('tools.envFileGenerator.noVariables')}</code>
        </pre>
      </div>

      <div className="card p-4 bg-yellow-50 border border-yellow-200">
        <h3 className="text-sm font-medium text-yellow-700 mb-2">
          {t('tools.envFileGenerator.securityNote')}
        </h3>
        <ul className="text-sm text-yellow-600 space-y-1 list-disc list-inside">
          <li>{t('tools.envFileGenerator.security1')}</li>
          <li>{t('tools.envFileGenerator.security2')}</li>
          <li>{t('tools.envFileGenerator.security3')}</li>
        </ul>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.envFileGenerator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.envFileGenerator.tip1')}</li>
          <li>{t('tools.envFileGenerator.tip2')}</li>
          <li>{t('tools.envFileGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
