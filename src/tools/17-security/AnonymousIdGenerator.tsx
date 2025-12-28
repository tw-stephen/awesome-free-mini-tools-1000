import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface GeneratedId {
  type: string
  value: string
}

export default function AnonymousIdGenerator() {
  const { t } = useTranslation()
  const [generatedIds, setGeneratedIds] = useState<GeneratedId[]>([])
  const [prefix, setPrefix] = useState('')
  const [includeTimestamp, setIncludeTimestamp] = useState(false)
  const [count, setCount] = useState(5)

  const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  const generateNanoId = (size: number = 21): string => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-'
    const bytes = crypto.getRandomValues(new Uint8Array(size))
    return Array.from(bytes).map(b => alphabet[b % alphabet.length]).join('')
  }

  const generateShortId = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const bytes = crypto.getRandomValues(new Uint8Array(8))
    return Array.from(bytes).map(b => chars[b % chars.length]).join('')
  }

  const generateHexId = (length: number = 32): string => {
    const bytes = crypto.getRandomValues(new Uint8Array(length / 2))
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
  }

  const generateBase64Id = (): string => {
    const bytes = crypto.getRandomValues(new Uint8Array(18))
    return btoa(String.fromCharCode(...bytes))
  }

  const generateNumericId = (): string => {
    const bytes = crypto.getRandomValues(new Uint8Array(8))
    let result = ''
    for (let i = 0; i < 16; i++) {
      result += (bytes[i % 8] + i) % 10
    }
    return result
  }

  const generateAllTypes = () => {
    const ids: GeneratedId[] = []
    const timestamp = includeTimestamp ? `${Date.now()}_` : ''
    const pre = prefix ? `${prefix}_` : ''

    for (let i = 0; i < count; i++) {
      ids.push({ type: 'UUID v4', value: pre + generateUUID() })
      ids.push({ type: 'NanoID', value: pre + timestamp + generateNanoId() })
      ids.push({ type: 'Short ID', value: pre + timestamp + generateShortId() })
      ids.push({ type: 'Hex (32)', value: pre + timestamp + generateHexId() })
      ids.push({ type: 'Base64', value: pre + timestamp + generateBase64Id() })
      ids.push({ type: 'Numeric', value: pre + timestamp + generateNumericId() })
    }

    setGeneratedIds(ids)
  }

  const generateSingleType = (type: string) => {
    const timestamp = includeTimestamp ? `${Date.now()}_` : ''
    const pre = prefix ? `${prefix}_` : ''
    const ids: GeneratedId[] = []

    for (let i = 0; i < count; i++) {
      let value = ''
      switch (type) {
        case 'uuid': value = generateUUID(); break
        case 'nanoid': value = generateNanoId(); break
        case 'short': value = generateShortId(); break
        case 'hex': value = generateHexId(); break
        case 'base64': value = generateBase64Id(); break
        case 'numeric': value = generateNumericId(); break
      }
      ids.push({ type, value: pre + timestamp + value })
    }

    setGeneratedIds(ids)
  }

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id)
  }

  const copyAll = () => {
    const allIds = generatedIds.map(id => id.value).join('\n')
    navigator.clipboard.writeText(allIds)
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.anonymousIdGenerator.options')}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-500 block mb-1">{t('tools.anonymousIdGenerator.prefix')}</label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="Optional prefix (e.g., user_, temp_)"
              className="w-full px-3 py-2 border border-slate-300 rounded"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm text-slate-500 block mb-1">{t('tools.anonymousIdGenerator.count')}</label>
              <input
                type="number"
                min={1}
                max={20}
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 p-2 bg-slate-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTimestamp}
                  onChange={(e) => setIncludeTimestamp(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Include timestamp</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.anonymousIdGenerator.generate')}</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => generateSingleType('uuid')}
            className="py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
          >
            UUID v4
          </button>
          <button
            onClick={() => generateSingleType('nanoid')}
            className="py-2 bg-green-50 text-green-700 rounded hover:bg-green-100"
          >
            NanoID
          </button>
          <button
            onClick={() => generateSingleType('short')}
            className="py-2 bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100"
          >
            Short ID
          </button>
          <button
            onClick={() => generateSingleType('hex')}
            className="py-2 bg-purple-50 text-purple-700 rounded hover:bg-purple-100"
          >
            Hex (32)
          </button>
          <button
            onClick={() => generateSingleType('base64')}
            className="py-2 bg-pink-50 text-pink-700 rounded hover:bg-pink-100"
          >
            Base64
          </button>
          <button
            onClick={() => generateSingleType('numeric')}
            className="py-2 bg-orange-50 text-orange-700 rounded hover:bg-orange-100"
          >
            Numeric
          </button>
        </div>
        <button
          onClick={generateAllTypes}
          className="w-full mt-3 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
        >
          {t('tools.anonymousIdGenerator.generateAll')}
        </button>
      </div>

      {generatedIds.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">{t('tools.anonymousIdGenerator.results')}</h3>
            <button
              onClick={copyAll}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Copy All
            </button>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {generatedIds.map((id, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                <span className="text-xs text-slate-500 w-16 shrink-0">{id.type}</span>
                <code className="flex-1 text-sm font-mono truncate">{id.value}</code>
                <button
                  onClick={() => copyId(id.value)}
                  className="text-xs text-blue-500 hover:text-blue-600"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4 bg-blue-50">
        <h4 className="font-medium mb-2">{t('tools.anonymousIdGenerator.info')}</h4>
        <div className="text-sm text-slate-600 space-y-2">
          <p><strong>UUID v4:</strong> Standard 128-bit format, widely compatible</p>
          <p><strong>NanoID:</strong> URL-safe, smaller than UUID, customizable</p>
          <p><strong>Short ID:</strong> Compact 8-char identifier for limited spaces</p>
          <p><strong>Hex:</strong> Pure hexadecimal, good for tokens</p>
          <p><strong>Base64:</strong> Compact encoding, higher entropy per char</p>
          <p><strong>Numeric:</strong> Numbers only, for phone/SMS compatible IDs</p>
        </div>
      </div>
    </div>
  )
}
