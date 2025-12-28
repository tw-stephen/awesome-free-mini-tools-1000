import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '../../hooks/useClipboard'
import Button from '../../components/ui/Button'
import TextArea from '../../components/ui/TextArea'

// Generate UUID v4
const generateUUIDv4 = (): string => {
  // Use crypto.randomUUID if available
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // Fallback implementation
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)

  // Set version (4) and variant (10xx)
  array[6] = (array[6] & 0x0f) | 0x40
  array[8] = (array[8] & 0x3f) | 0x80

  const hex = Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

// Generate UUID v1 (time-based) - simplified version
const generateUUIDv1 = (): string => {
  const now = Date.now()
  const offset = 122192928000000000n // Offset between UUID epoch (1582) and Unix epoch (1970)
  const timestamp = BigInt(now) * 10000n + offset

  const timeLow = Number(timestamp & 0xffffffffn)
  const timeMid = Number((timestamp >> 32n) & 0xffffn)
  const timeHi = Number((timestamp >> 48n) & 0x0fffn) | 0x1000

  const clockSeq = Math.floor(Math.random() * 0x3fff) | 0x8000
  const node = Array.from({ length: 6 }, () => Math.floor(Math.random() * 256))

  const hex = (n: number, len: number) => n.toString(16).padStart(len, '0')

  return `${hex(timeLow, 8)}-${hex(timeMid, 4)}-${hex(timeHi, 4)}-${hex(clockSeq, 4)}-${node.map((n) => hex(n, 2)).join('')}`
}

// Validate UUID
const isValidUUID = (uuid: string): boolean => {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return regex.test(uuid)
}

// Get UUID version
const getUUIDVersion = (uuid: string): number | null => {
  if (!isValidUUID(uuid)) return null
  return parseInt(uuid.charAt(14), 16)
}

export default function UuidGenerator() {
  const { t } = useTranslation()
  const [count, setCount] = useState(1)
  const [version, setVersion] = useState<'v4' | 'v1'>('v4')
  const [format, setFormat] = useState<'standard' | 'uppercase' | 'no-dashes'>('standard')
  const [uuids, setUuids] = useState<string[]>([])
  const [validateInput, setValidateInput] = useState('')
  const { copied, copy } = useClipboard()

  const formatUUID = useCallback(
    (uuid: string): string => {
      if (format === 'uppercase') return uuid.toUpperCase()
      if (format === 'no-dashes') return uuid.replace(/-/g, '')
      return uuid
    },
    [format]
  )

  const generate = useCallback(() => {
    const generator = version === 'v4' ? generateUUIDv4 : generateUUIDv1
    const newUuids = Array.from({ length: count }, () => formatUUID(generator()))
    setUuids(newUuids)
  }, [count, version, formatUUID])

  const copyAll = () => {
    copy(uuids.join('\n'))
  }

  const validationResult = validateInput
    ? isValidUUID(validateInput)
      ? { valid: true, version: getUUIDVersion(validateInput) }
      : { valid: false }
    : null

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">{t('tools.uuidGenerator.settings')}</h3>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.uuidGenerator.version')}</label>
            <select
              value={version}
              onChange={(e) => setVersion(e.target.value as 'v4' | 'v1')}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="v4">UUID v4 ({t('tools.uuidGenerator.random')})</option>
              <option value="v1">UUID v1 ({t('tools.uuidGenerator.timeBased')})</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.uuidGenerator.format')}</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'standard' | 'uppercase' | 'no-dashes')}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="standard">{t('tools.uuidGenerator.standard')}</option>
              <option value="uppercase">{t('tools.uuidGenerator.uppercase')}</option>
              <option value="no-dashes">{t('tools.uuidGenerator.noDashes')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">{t('tools.uuidGenerator.count')}</label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={generate} variant="primary">
            {t('tools.uuidGenerator.generate')}
          </Button>
          {uuids.length > 0 && (
            <Button onClick={copyAll}>
              {copied ? t('common.copied') : t('tools.uuidGenerator.copyAll')}
            </Button>
          )}
        </div>
      </div>

      {uuids.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.uuidGenerator.generated')} ({uuids.length})
          </h3>
          <TextArea value={uuids.join('\n')} readOnly rows={Math.min(10, uuids.length)} className="font-mono" />
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.uuidGenerator.validate')}</h3>
        <input
          type="text"
          value={validateInput}
          onChange={(e) => setValidateInput(e.target.value)}
          placeholder={t('tools.uuidGenerator.validatePlaceholder')}
          className="w-full px-4 py-2 font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {validationResult && (
          <div className={`mt-2 text-sm ${validationResult.valid ? 'text-green-600' : 'text-red-600'}`}>
            {validationResult.valid
              ? `${t('tools.uuidGenerator.validUuid')} (v${validationResult.version})`
              : t('tools.uuidGenerator.invalidUuid')}
          </div>
        )}
      </div>
    </div>
  )
}
