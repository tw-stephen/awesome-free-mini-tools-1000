import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'
import { useClipboard } from '../../hooks/useClipboard'

export default function LoremIpsumGenerator() {
  const { t } = useTranslation()
  const [count, setCount] = useState(3)
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs')
  const [output, setOutput] = useState('')
  const [startWithLorem, setStartWithLorem] = useState(true)
  const { copy, copied } = useClipboard()

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'nullam', 'dictum',
    'felis', 'donec', 'pede', 'justo', 'fringilla', 'vel', 'aliquet', 'nec',
    'vulputate', 'eget', 'arcu', 'curabitur', 'ultrices', 'mauris', 'eleifend',
    'proin', 'sapien', 'porta', 'vestibulum', 'convallis', 'lacus', 'turpis',
    'massa', 'tincidunt', 'dui', 'libero', 'vivamus', 'elementum', 'semper',
    'nisi', 'malesuada', 'fames', 'ac', 'ante', 'primis', 'faucibus', 'orci',
    'luctus', 'posuere', 'cubilia', 'curae', 'maecenas', 'interdum', 'metus',
    'hendrerit', 'gravida', 'blandit', 'leo', 'varius', 'sodales', 'rutrum'
  ]

  const getRandomWord = (): string => {
    return loremWords[Math.floor(Math.random() * loremWords.length)]
  }

  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const generateSentence = (wordCount?: number): string => {
    const count = wordCount || Math.floor(Math.random() * 10) + 5
    const words: string[] = []
    for (let i = 0; i < count; i++) {
      words.push(getRandomWord())
    }
    return capitalize(words.join(' ')) + '.'
  }

  const generateParagraph = (sentenceCount?: number): string => {
    const count = sentenceCount || Math.floor(Math.random() * 4) + 3
    const sentences: string[] = []
    for (let i = 0; i < count; i++) {
      sentences.push(generateSentence())
    }
    return sentences.join(' ')
  }

  const generate = useCallback(() => {
    let result = ''

    switch (type) {
      case 'words': {
        const words: string[] = []
        for (let i = 0; i < count; i++) {
          words.push(getRandomWord())
        }
        result = words.join(' ')
        break
      }
      case 'sentences': {
        const sentences: string[] = []
        for (let i = 0; i < count; i++) {
          sentences.push(generateSentence())
        }
        result = sentences.join(' ')
        break
      }
      case 'paragraphs': {
        const paragraphs: string[] = []
        for (let i = 0; i < count; i++) {
          paragraphs.push(generateParagraph())
        }
        result = paragraphs.join('\n\n')
        break
      }
    }

    if (startWithLorem && result.length > 0) {
      result = 'Lorem ipsum dolor sit amet, ' + result.slice(result.indexOf(' ') + 1)
    }

    setOutput(result)
  }, [count, type, startWithLorem])

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          {t('tools.loremIpsumGenerator.options')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-2">
              {t('tools.loremIpsumGenerator.type')}
            </label>
            <div className="flex gap-2">
              {(['paragraphs', 'sentences', 'words'] as const).map((value) => (
                <button
                  key={value}
                  onClick={() => setType(value)}
                  className={`px-4 py-2 text-sm rounded border ${
                    type === value
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-slate-50 border-slate-300 text-slate-600'
                  }`}
                >
                  {t(`tools.loremIpsumGenerator.${value}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">
              {t('tools.loremIpsumGenerator.count')}: {count}
            </label>
            <input
              type="range"
              min="1"
              max={type === 'words' ? 100 : type === 'sentences' ? 20 : 10}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
            />
            {t('tools.loremIpsumGenerator.startWithLorem')}
          </label>
        </div>

        <Button variant="primary" onClick={generate} className="mt-4">
          {t('tools.loremIpsumGenerator.generate')}
        </Button>
      </div>

      {output && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-700">
              {t('tools.loremIpsumGenerator.output')}
            </h3>
            <div className="flex gap-2">
              <span className="text-xs text-slate-500">
                {output.split(/\s+/).length} {t('tools.loremIpsumGenerator.words')}
              </span>
              <Button variant="secondary" onClick={() => copy(output)}>
                {copied ? t('common.copied') : t('common.copy')}
              </Button>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-700 whitespace-pre-wrap max-h-96 overflow-y-auto">
            {output}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          {t('tools.loremIpsumGenerator.quickCopy')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: '1 Paragraph', type: 'paragraphs' as const, count: 1 },
            { label: '3 Paragraphs', type: 'paragraphs' as const, count: 3 },
            { label: '5 Sentences', type: 'sentences' as const, count: 5 },
            { label: '50 Words', type: 'words' as const, count: 50 },
          ].map((preset) => (
            <Button
              key={preset.label}
              variant="secondary"
              onClick={() => {
                setType(preset.type)
                setCount(preset.count)
                setTimeout(generate, 0)
              }}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.loremIpsumGenerator.about')}
        </h3>
        <p className="text-sm text-slate-600">
          {t('tools.loremIpsumGenerator.aboutText')}
        </p>
      </div>
    </div>
  )
}
