import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

type FieldType = 'name' | 'email' | 'phone' | 'address' | 'company' | 'date' | 'number' | 'boolean' | 'uuid' | 'text'

interface Field {
  name: string
  type: FieldType
}

export default function MockDataGenerator() {
  const { t } = useTranslation()
  const [fields, setFields] = useState<Field[]>([
    { name: 'id', type: 'uuid' },
    { name: 'name', type: 'name' },
    { name: 'email', type: 'email' },
    { name: 'createdAt', type: 'date' }
  ])
  const [count, setCount] = useState(5)
  const [output, setOutput] = useState('')
  const [outputFormat, setOutputFormat] = useState<'json' | 'csv'>('json')
  const { copy, copied } = useClipboard()

  const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas']
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com', 'company.org', 'mail.net']
  const streets = ['Main St', 'Oak Ave', 'Park Blvd', 'Cedar Ln', 'Elm St', 'Pine Rd', 'Maple Dr', 'Washington Ave']
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego']
  const companies = ['Acme Inc', 'Global Corp', 'Tech Solutions', 'Innovation Labs', 'Digital Dynamics', 'Future Systems', 'Prime Industries', 'Elite Services']
  const lorem = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor']

  const randomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

  const generateValue = (type: FieldType): unknown => {
    switch (type) {
      case 'name':
        return `${randomElement(firstNames)} ${randomElement(lastNames)}`
      case 'email': {
        const name = `${randomElement(firstNames).toLowerCase()}${Math.floor(Math.random() * 100)}`
        return `${name}@${randomElement(domains)}`
      }
      case 'phone':
        return `+1${Math.floor(Math.random() * 900 + 100)}${Math.floor(Math.random() * 900 + 100)}${Math.floor(Math.random() * 9000 + 1000)}`
      case 'address':
        return `${Math.floor(Math.random() * 9999) + 1} ${randomElement(streets)}, ${randomElement(cities)}`
      case 'company':
        return randomElement(companies)
      case 'date': {
        const start = new Date(2020, 0, 1).getTime()
        const end = new Date().getTime()
        return new Date(start + Math.random() * (end - start)).toISOString()
      }
      case 'number':
        return Math.floor(Math.random() * 1000)
      case 'boolean':
        return Math.random() > 0.5
      case 'uuid': {
        const array = new Uint8Array(16)
        crypto.getRandomValues(array)
        array[6] = (array[6] & 0x0f) | 0x40
        array[8] = (array[8] & 0x3f) | 0x80
        const hex = Array.from(array, b => b.toString(16).padStart(2, '0')).join('')
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
      }
      case 'text':
        return lorem.slice(0, Math.floor(Math.random() * 8) + 3).join(' ')
      default:
        return ''
    }
  }

  const generate = useCallback(() => {
    const data: Record<string, unknown>[] = []

    for (let i = 0; i < count; i++) {
      const record: Record<string, unknown> = {}
      for (const field of fields) {
        record[field.name] = generateValue(field.type)
      }
      data.push(record)
    }

    if (outputFormat === 'json') {
      setOutput(JSON.stringify(data, null, 2))
    } else {
      const headers = fields.map(f => f.name).join(',')
      const rows = data.map(record =>
        fields.map(f => {
          const val = record[f.name]
          const str = String(val)
          return str.includes(',') ? `"${str}"` : str
        }).join(',')
      )
      setOutput([headers, ...rows].join('\n'))
    }
  }, [fields, count, outputFormat])

  const addField = () => {
    setFields([...fields, { name: `field${fields.length + 1}`, type: 'text' }])
  }

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const updateField = (index: number, key: 'name' | 'type', value: string) => {
    setFields(fields.map((f, i) => i === index ? { ...f, [key]: value } : f))
  }

  const fieldTypes: FieldType[] = ['name', 'email', 'phone', 'address', 'company', 'date', 'number', 'boolean', 'uuid', 'text']

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.mockDataGenerator.schema')}
          </h3>
          <Button variant="secondary" onClick={addField}>
            {t('tools.mockDataGenerator.addField')}
          </Button>
        </div>

        <div className="space-y-2">
          {fields.map((field, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={field.name}
                onChange={(e) => updateField(i, 'name', e.target.value)}
                placeholder={t('tools.mockDataGenerator.fieldName')}
                className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <select
                value={field.type}
                onChange={(e) => updateField(i, 'type', e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              >
                {fieldTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <button
                onClick={() => removeField(i)}
                className="p-2 text-red-500 hover:text-red-700"
                disabled={fields.length <= 1}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.mockDataGenerator.options')}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-2">
              {t('tools.mockDataGenerator.count')}: {count}
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">
              {t('tools.mockDataGenerator.format')}
            </label>
            <div className="flex gap-2">
              {(['json', 'csv'] as const).map(format => (
                <button
                  key={format}
                  onClick={() => setOutputFormat(format)}
                  className={`px-4 py-2 text-sm rounded border ${
                    outputFormat === format
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-slate-50 border-slate-300 text-slate-600'
                  }`}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button variant="primary" onClick={generate} className="mt-4">
          {t('tools.mockDataGenerator.generate')}
        </Button>
      </div>

      {output && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.mockDataGenerator.output')}
            </h3>
            <Button variant="secondary" onClick={() => copy(output)}>
              {copied ? t('common.copied') : t('common.copy')}
            </Button>
          </div>

          <pre className="p-3 bg-slate-50 rounded-lg overflow-x-auto max-h-96">
            <code className="font-mono text-xs text-slate-800">{output}</code>
          </pre>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.mockDataGenerator.fieldTypes')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          {fieldTypes.map(type => (
            <div key={type} className="p-2 bg-slate-50 rounded">
              <code className="text-blue-600">{type}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
