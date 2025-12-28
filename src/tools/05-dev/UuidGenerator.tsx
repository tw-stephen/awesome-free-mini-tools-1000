import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function UuidGenerator() {
  const { t } = useTranslation()
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(5)
  const [format, setFormat] = useState<'standard' | 'uppercase' | 'no-dashes' | 'braces'>('standard')
  const [version, setVersion] = useState<'v4' | 'v1-like'>('v4')
  const { copy, copied } = useClipboard()

  const generateUUIDv4 = (): string => {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)

    // Set version (4) and variant bits
    array[6] = (array[6] & 0x0f) | 0x40
    array[8] = (array[8] & 0x3f) | 0x80

    const hex = Array.from(array, b => b.toString(16).padStart(2, '0')).join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
  }

  const generateUUIDv1Like = (): string => {
    // Not a true v1 UUID, but a time-based UUID-like format
    const now = Date.now()
    const timeHex = now.toString(16).padStart(12, '0')

    const array = new Uint8Array(10)
    crypto.getRandomValues(array)
    const randomHex = Array.from(array, b => b.toString(16).padStart(2, '0')).join('')

    const hex = timeHex + randomHex
    const formatted = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-1${hex.slice(13, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
    return formatted
  }

  const formatUuid = (uuid: string): string => {
    switch (format) {
      case 'uppercase':
        return uuid.toUpperCase()
      case 'no-dashes':
        return uuid.replace(/-/g, '')
      case 'braces':
        return `{${uuid}}`
      default:
        return uuid
    }
  }

  const generate = useCallback(() => {
    const newUuids: string[] = []
    for (let i = 0; i < count; i++) {
      const uuid = version === 'v4' ? generateUUIDv4() : generateUUIDv1Like()
      newUuids.push(formatUuid(uuid))
    }
    setUuids(newUuids)
  }, [count, format, version])

  const copyAll = () => {
    copy(uuids.join('\n'))
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.uuidGenerator.options')}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-2">
              {t('tools.uuidGenerator.version')}
            </label>
            <div className="flex gap-2">
              {(['v4', 'v1-like'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setVersion(v)}
                  className={`px-4 py-2 text-sm rounded border ${
                    version === v
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-slate-50 border-slate-300 text-slate-600'
                  }`}
                >
                  {v === 'v4' ? 'UUID v4 (Random)' : 'UUID v1-like (Time)'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">
              {t('tools.uuidGenerator.format')}
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'standard', label: 'lowercase' },
                { value: 'uppercase', label: 'UPPERCASE' },
                { value: 'no-dashes', label: 'No Dashes' },
                { value: 'braces', label: '{Braces}' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFormat(value as typeof format)}
                  className={`px-3 py-1 text-sm rounded border ${
                    format === value
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-slate-50 border-slate-300 text-slate-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">
              {t('tools.uuidGenerator.count')}: {count}
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <Button variant="primary" onClick={generate} className="mt-4">
          {t('tools.uuidGenerator.generate')}
        </Button>
      </div>

      {uuids.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.uuidGenerator.generated')} ({uuids.length})
            </h3>
            <Button variant="secondary" onClick={copyAll}>
              {copied ? t('common.copied') : t('tools.uuidGenerator.copyAll')}
            </Button>
          </div>

          <div className="space-y-2">
            {uuids.map((uuid, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-slate-50 rounded">
                <code className="flex-1 font-mono text-sm text-slate-800">{uuid}</code>
                <Button variant="secondary" onClick={() => copy(uuid)}>
                  {copied ? t('common.copied') : t('common.copy')}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.uuidGenerator.about')}
        </h3>
        <div className="space-y-3 text-sm text-slate-600">
          <div className="p-3 bg-slate-50 rounded">
            <p className="font-medium text-slate-700 mb-1">UUID v4 (Random)</p>
            <p>{t('tools.uuidGenerator.v4Description')}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded">
            <p className="font-medium text-slate-700 mb-1">UUID v1-like (Time-based)</p>
            <p>{t('tools.uuidGenerator.v1Description')}</p>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.uuidGenerator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.uuidGenerator.tip1')}</li>
          <li>{t('tools.uuidGenerator.tip2')}</li>
          <li>{t('tools.uuidGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
