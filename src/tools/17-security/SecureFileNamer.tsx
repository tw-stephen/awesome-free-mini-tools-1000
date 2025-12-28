import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function SecureFileNamer() {
  const { t } = useTranslation()
  const [originalName, setOriginalName] = useState('')
  const [classification, setClassification] = useState<'public' | 'internal' | 'confidential' | 'restricted'>('internal')
  const [includeTimestamp, setIncludeTimestamp] = useState(true)
  const [includeVersion, setIncludeVersion] = useState(false)
  const [version, setVersion] = useState('1.0')
  const [includeHash, setIncludeHash] = useState(false)
  const [hashLength, setHashLength] = useState(8)
  const [customPrefix, setCustomPrefix] = useState('')
  const [generatedNames, setGeneratedNames] = useState<string[]>([])

  const generateHash = (): string => {
    const bytes = crypto.getRandomValues(new Uint8Array(hashLength / 2))
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
  }

  const sanitizeFilename = (name: string): string => {
    // Remove dangerous characters and patterns
    return name
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_') // Windows forbidden chars
      .replace(/\.{2,}/g, '.') // No multiple dots
      .replace(/^\./, '_') // No leading dot
      .replace(/\s+/g, '_') // Replace spaces
      .replace(/_+/g, '_') // No multiple underscores
      .trim()
  }

  const generateName = () => {
    if (!originalName) return

    const parts: string[] = []

    // Add classification prefix
    const classificationPrefixes = {
      public: 'PUB',
      internal: 'INT',
      confidential: 'CONF',
      restricted: 'RESTR',
    }
    parts.push(classificationPrefixes[classification])

    // Add custom prefix
    if (customPrefix) {
      parts.push(sanitizeFilename(customPrefix))
    }

    // Add timestamp
    if (includeTimestamp) {
      const now = new Date()
      const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`
      parts.push(timestamp)
    }

    // Parse original filename
    const lastDot = originalName.lastIndexOf('.')
    const baseName = lastDot > 0 ? originalName.substring(0, lastDot) : originalName
    const extension = lastDot > 0 ? originalName.substring(lastDot) : ''

    // Add sanitized base name
    parts.push(sanitizeFilename(baseName))

    // Add version
    if (includeVersion) {
      parts.push(`v${version.replace('.', '-')}`)
    }

    // Add hash
    if (includeHash) {
      parts.push(generateHash())
    }

    const newName = parts.join('_') + extension.toLowerCase()

    setGeneratedNames([newName, ...generatedNames.slice(0, 9)])
  }

  const copyName = (name: string) => {
    navigator.clipboard.writeText(name)
  }

  const getClassificationColor = (cls: typeof classification): string => {
    switch (cls) {
      case 'public': return 'bg-green-100 text-green-700'
      case 'internal': return 'bg-blue-100 text-blue-700'
      case 'confidential': return 'bg-yellow-100 text-yellow-700'
      case 'restricted': return 'bg-red-100 text-red-700'
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="text-sm text-slate-500 block mb-1">{t('tools.secureFileNamer.original')}</label>
        <input
          type="text"
          value={originalName}
          onChange={(e) => setOriginalName(e.target.value)}
          placeholder="Original filename (e.g., quarterly_report.pdf)"
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.secureFileNamer.classification')}</h3>
        <div className="grid grid-cols-4 gap-2">
          {(['public', 'internal', 'confidential', 'restricted'] as const).map((cls) => (
            <button
              key={cls}
              onClick={() => setClassification(cls)}
              className={`py-2 rounded text-sm capitalize ${
                classification === cls ? getClassificationColor(cls) + ' ring-2 ring-offset-1' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.secureFileNamer.options')}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">Custom Prefix (optional)</label>
            <input
              type="text"
              value={customPrefix}
              onChange={(e) => setCustomPrefix(e.target.value)}
              placeholder="e.g., PROJECT_A"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <label className="flex items-center gap-3 p-2 bg-slate-50 rounded cursor-pointer">
            <input
              type="checkbox"
              checked={includeTimestamp}
              onChange={(e) => setIncludeTimestamp(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Include date stamp (YYYYMMDD)</span>
          </label>

          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded">
            <input
              type="checkbox"
              checked={includeVersion}
              onChange={(e) => setIncludeVersion(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Include version</span>
            {includeVersion && (
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.0"
                className="w-20 px-2 py-1 border border-slate-300 rounded text-sm"
              />
            )}
          </div>

          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded">
            <input
              type="checkbox"
              checked={includeHash}
              onChange={(e) => setIncludeHash(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Include random hash</span>
            {includeHash && (
              <select
                value={hashLength}
                onChange={(e) => setHashLength(parseInt(e.target.value))}
                className="px-2 py-1 border border-slate-300 rounded text-sm"
              >
                <option value={4}>4 chars</option>
                <option value={8}>8 chars</option>
                <option value={12}>12 chars</option>
              </select>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={generateName}
        disabled={!originalName}
        className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-slate-300 font-medium"
      >
        {t('tools.secureFileNamer.generate')}
      </button>

      {generatedNames.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.secureFileNamer.results')}</h3>
          <div className="space-y-2">
            {generatedNames.map((name, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                <code className="flex-1 text-sm font-mono break-all">{name}</code>
                <button
                  onClick={() => copyName(name)}
                  className="px-3 py-1 text-sm text-blue-500 hover:text-blue-600"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.secureFileNamer.preview')}</h3>
        <div className="bg-slate-100 p-3 rounded font-mono text-sm">
          <span className="text-purple-600">[CLASSIFICATION]</span>_
          {customPrefix && <><span className="text-blue-600">[PREFIX]</span>_</>}
          {includeTimestamp && <><span className="text-green-600">[DATE]</span>_</>}
          <span className="text-orange-600">[FILENAME]</span>
          {includeVersion && <>_<span className="text-red-600">[VERSION]</span></>}
          {includeHash && <>_<span className="text-slate-600">[HASH]</span></>}
          <span className="text-slate-400">.ext</span>
        </div>
      </div>

      <div className="card p-4 bg-blue-50">
        <h4 className="font-medium mb-2">{t('tools.secureFileNamer.tips')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Classification prefixes help with data handling</li>
          <li>• Timestamps enable version tracking</li>
          <li>• Random hashes prevent name prediction</li>
          <li>• Sanitized names prevent path traversal attacks</li>
        </ul>
      </div>
    </div>
  )
}
