import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/ui/Button'

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde',
  'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque',
  'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
  'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta',
  'explicabo', 'nemo', 'ipsam', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit',
  'fugit', 'consequuntur', 'magni', 'dolores', 'eos', 'ratione', 'sequi', 'nesciunt'
]

const CLASSIC_LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

type OutputType = 'paragraphs' | 'sentences' | 'words'

export default function LoremIpsumGenerator() {
  const { t } = useTranslation()

  const [outputType, setOutputType] = useState<OutputType>('paragraphs')
  const [count, setCount] = useState(3)
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const getRandomWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]

  const generateSentence = (wordCount: number = 0): string => {
    const len = wordCount || Math.floor(Math.random() * 10) + 5
    const words = Array.from({ length: len }, () => getRandomWord())
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
    return words.join(' ') + '.'
  }

  const generateParagraph = (sentenceCount: number = 0): string => {
    const len = sentenceCount || Math.floor(Math.random() * 4) + 3
    return Array.from({ length: len }, () => generateSentence()).join(' ')
  }

  const generate = () => {
    let result = ''

    switch (outputType) {
      case 'paragraphs': {
        const paragraphs = Array.from({ length: count }, (_, i) => {
          if (i === 0 && startWithLorem) {
            return CLASSIC_LOREM + ' ' + generateParagraph(2)
          }
          return generateParagraph()
        })
        result = paragraphs.join('\n\n')
        break
      }
      case 'sentences': {
        const sentences = Array.from({ length: count }, (_, i) => {
          if (i === 0 && startWithLorem) {
            return CLASSIC_LOREM
          }
          return generateSentence()
        })
        result = sentences.join(' ')
        break
      }
      case 'words': {
        if (startWithLorem) {
          const loremWords = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet']
          const remaining = count - loremWords.length
          if (remaining > 0) {
            result = [...loremWords, ...Array.from({ length: remaining }, () => getRandomWord())].join(' ')
          } else {
            result = loremWords.slice(0, count).join(' ')
          }
        } else {
          result = Array.from({ length: count }, () => getRandomWord()).join(' ')
        }
        break
      }
    }

    setOutput(result)
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const getWordCount = () => output.split(/\s+/).filter(w => w).length
  const getCharCount = () => output.length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap items-center">
        <Button onClick={generate}>{t('tools.loremIpsum.generate')}</Button>
        <div className="flex gap-1">
          {(['paragraphs', 'sentences', 'words'] as OutputType[]).map(type => (
            <button
              key={type}
              onClick={() => setOutputType(type)}
              className={`px-2 py-1 text-xs rounded ${outputType === type ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
            >
              {t(`tools.loremIpsum.${type}`)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
            className="input w-16 text-center"
          />
        </div>
        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={startWithLorem}
            onChange={(e) => setStartWithLorem(e.target.checked)}
            className="rounded"
          />
          {t('tools.loremIpsum.startClassic')}
        </label>
        <div className="flex-1" />
        <Button variant="secondary" onClick={copyToClipboard} disabled={!output}>
          {copied ? t('common.copied') : t('common.copy')}
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div className="border border-slate-200 rounded-lg bg-white p-4 min-h-[400px]">
            {output ? (
              <div className="prose prose-slate max-w-none">
                {output.split('\n\n').map((para, i) => (
                  <p key={i} className="mb-4 last:mb-0 text-slate-700 leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                {t('tools.loremIpsum.placeholder')}
              </div>
            )}
          </div>
        </div>

        <div className="w-64 border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700">{t('tools.loremIpsum.stats')}</h3>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-500 mb-1">{t('tools.loremIpsum.wordCount')}</div>
              <div className="text-2xl font-bold text-slate-700">{getWordCount()}</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-500 mb-1">{t('tools.loremIpsum.charCount')}</div>
              <div className="text-2xl font-bold text-slate-700">{getCharCount()}</div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 mb-2">{t('tools.loremIpsum.quickGenerate')}</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setOutputType('paragraphs'); setCount(1); setTimeout(generate, 0) }}
                className="px-2 py-1.5 text-xs rounded bg-slate-100 hover:bg-slate-200"
              >
                1 {t('tools.loremIpsum.para')}
              </button>
              <button
                onClick={() => { setOutputType('paragraphs'); setCount(3); setTimeout(generate, 0) }}
                className="px-2 py-1.5 text-xs rounded bg-slate-100 hover:bg-slate-200"
              >
                3 {t('tools.loremIpsum.paras')}
              </button>
              <button
                onClick={() => { setOutputType('sentences'); setCount(5); setTimeout(generate, 0) }}
                className="px-2 py-1.5 text-xs rounded bg-slate-100 hover:bg-slate-200"
              >
                5 {t('tools.loremIpsum.sents')}
              </button>
              <button
                onClick={() => { setOutputType('words'); setCount(50); setTimeout(generate, 0) }}
                className="px-2 py-1.5 text-xs rounded bg-slate-100 hover:bg-slate-200"
              >
                50 {t('tools.loremIpsum.wds')}
              </button>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-400">
              {t('tools.loremIpsum.hint')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
