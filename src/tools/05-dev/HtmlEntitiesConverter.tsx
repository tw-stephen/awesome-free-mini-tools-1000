import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function HtmlEntitiesConverter() {
  const { t } = useTranslation()
  const [input, setInput] = useState('<div class="container">Hello & Welcome!</div>')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const { copy, copied } = useClipboard()

  const entities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    ' ': '&nbsp;',
    '©': '&copy;',
    '®': '&reg;',
    '™': '&trade;',
    '€': '&euro;',
    '£': '&pound;',
    '¥': '&yen;',
    '¢': '&cent;',
    '°': '&deg;',
    '±': '&plusmn;',
    '×': '&times;',
    '÷': '&divide;',
    '≤': '&le;',
    '≥': '&ge;',
    '≠': '&ne;',
    '∞': '&infin;',
    '√': '&radic;',
    '∑': '&sum;',
    '∏': '&prod;',
    '∂': '&part;',
    '∫': '&int;',
    '←': '&larr;',
    '→': '&rarr;',
    '↑': '&uarr;',
    '↓': '&darr;',
    '↔': '&harr;',
    '♠': '&spades;',
    '♣': '&clubs;',
    '♥': '&hearts;',
    '♦': '&diams;',
  }

  const reverseEntities = Object.fromEntries(
    Object.entries(entities).map(([k, v]) => [v, k])
  )

  const output = useMemo(() => {
    if (mode === 'encode') {
      return input.replace(/[&<>"'©®™€£¥¢°±×÷≤≥≠∞√∑∏∂∫←→↑↓↔♠♣♥♦]/g, char => entities[char] || char)
    } else {
      let result = input
      // Replace named entities
      for (const [entity, char] of Object.entries(reverseEntities)) {
        result = result.split(entity).join(char)
      }
      // Replace numeric entities
      result = result.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)))
      result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      return result
    }
  }, [input, mode])

  const commonEntities = [
    { char: '&', entity: '&amp;', name: 'Ampersand' },
    { char: '<', entity: '&lt;', name: 'Less than' },
    { char: '>', entity: '&gt;', name: 'Greater than' },
    { char: '"', entity: '&quot;', name: 'Double quote' },
    { char: "'", entity: '&#39;', name: 'Single quote' },
    { char: ' ', entity: '&nbsp;', name: 'Non-breaking space' },
    { char: '©', entity: '&copy;', name: 'Copyright' },
    { char: '®', entity: '&reg;', name: 'Registered' },
    { char: '™', entity: '&trade;', name: 'Trademark' },
    { char: '€', entity: '&euro;', name: 'Euro' },
    { char: '£', entity: '&pound;', name: 'Pound' },
    { char: '°', entity: '&deg;', name: 'Degree' },
  ]

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.htmlEntitiesConverter.mode')}
          </h3>
          <div className="flex gap-2">
            {(['encode', 'decode'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 text-sm rounded border ${
                  mode === m
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-slate-50 border-slate-300 text-slate-600'
                }`}
              >
                {t(`tools.htmlEntitiesConverter.${m}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            {t('tools.htmlEntitiesConverter.input')}
          </h3>
          <Button variant="secondary" onClick={() => setInput('')}>
            {t('common.clear')}
          </Button>
        </div>

        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode'
            ? t('tools.htmlEntitiesConverter.encodePlaceholder')
            : t('tools.htmlEntitiesConverter.decodePlaceholder')}
          rows={6}
          className="font-mono text-sm"
        />
      </div>

      <div className="card p-4 bg-green-50 border border-green-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-green-700">
            {t('tools.htmlEntitiesConverter.output')}
          </h3>
          <Button variant="secondary" onClick={() => copy(output)}>
            {copied ? t('common.copied') : t('common.copy')}
          </Button>
        </div>

        <pre className="p-3 bg-white rounded overflow-x-auto">
          <code className="font-mono text-sm text-green-800 whitespace-pre-wrap">{output}</code>
        </pre>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.htmlEntitiesConverter.commonEntities')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {commonEntities.map(({ char, entity, name }) => (
            <div
              key={entity}
              className="p-2 bg-slate-50 rounded text-sm cursor-pointer hover:bg-slate-100"
              onClick={() => copy(entity)}
              title={t('tools.htmlEntitiesConverter.clickToCopy')}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">{char === ' ' ? '␣' : char}</span>
                <code className="text-xs text-blue-600">{entity}</code>
              </div>
              <p className="text-xs text-slate-500 mt-1">{name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.htmlEntitiesConverter.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.htmlEntitiesConverter.tip1')}</li>
          <li>{t('tools.htmlEntitiesConverter.tip2')}</li>
          <li>{t('tools.htmlEntitiesConverter.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
