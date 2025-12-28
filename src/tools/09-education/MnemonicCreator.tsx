import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function MnemonicCreator() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'acrostic' | 'story' | 'rhyme'>('acrostic')
  const [items, setItems] = useState('')
  const [result, setResult] = useState<string | null>(null)

  const commonWords: Record<string, string[]> = {
    A: ['Apple', 'Amazing', 'Awesome', 'Always', 'Active'],
    B: ['Bear', 'Bright', 'Beautiful', 'Brave', 'Big'],
    C: ['Cat', 'Creative', 'Cool', 'Clever', 'Calm'],
    D: ['Dog', 'Dancing', 'Daring', 'Delightful', 'Dream'],
    E: ['Elephant', 'Eager', 'Exciting', 'Elegant', 'Every'],
    F: ['Fox', 'Friendly', 'Fast', 'Fantastic', 'Free'],
    G: ['Giraffe', 'Great', 'Green', 'Gentle', 'Giant'],
    H: ['Horse', 'Happy', 'Helpful', 'Honest', 'Hero'],
    I: ['Ice', 'Incredible', 'Intelligent', 'Important', 'Imagine'],
    J: ['Jaguar', 'Joyful', 'Jumping', 'Just', 'Jolly'],
    K: ['Kangaroo', 'Kind', 'Keen', 'King', 'Kite'],
    L: ['Lion', 'Lovely', 'Lucky', 'Lively', 'Light'],
    M: ['Monkey', 'Magical', 'Mighty', 'Marvelous', 'Moon'],
    N: ['Newt', 'Nice', 'Noble', 'Natural', 'New'],
    O: ['Owl', 'Outstanding', 'Original', 'Open', 'Ocean'],
    P: ['Penguin', 'Perfect', 'Powerful', 'Pleasant', 'Pride'],
    Q: ['Queen', 'Quick', 'Quiet', 'Quality', 'Quest'],
    R: ['Rabbit', 'Remarkable', 'Ready', 'Rainbow', 'Rising'],
    S: ['Snake', 'Super', 'Smart', 'Strong', 'Star'],
    T: ['Tiger', 'Terrific', 'True', 'Talented', 'Treasure'],
    U: ['Unicorn', 'Unique', 'Ultimate', 'United', 'Under'],
    V: ['Vulture', 'Victory', 'Vibrant', 'Valuable', 'Vivid'],
    W: ['Wolf', 'Wonderful', 'Wise', 'Wild', 'Winning'],
    X: ['X-ray', 'Xtra', 'Xenial', 'eXcellent', 'eXpert'],
    Y: ['Yak', 'Young', 'Yellow', 'Youthful', 'Yes'],
    Z: ['Zebra', 'Zesty', 'Zealous', 'Zero', 'Zen'],
  }

  const generateAcrostic = () => {
    const itemList = items.split(/[\n,]+/).map(s => s.trim()).filter(Boolean)
    if (itemList.length === 0) return

    const firstLetters = itemList.map(item => item[0].toUpperCase())
    const mnemonicWords = firstLetters.map(letter => {
      const words = commonWords[letter] || [`(${letter}...)`]
      return words[Math.floor(Math.random() * words.length)]
    })

    setResult(mnemonicWords.join(' '))
  }

  const generateStory = () => {
    const itemList = items.split(/[\n,]+/).map(s => s.trim()).filter(Boolean)
    if (itemList.length === 0) return

    const connectors = ['then', 'and', 'next', 'suddenly', 'after that', 'so']
    let story = `Remember: "${itemList[0]}"`

    for (let i = 1; i < itemList.length; i++) {
      const connector = connectors[i % connectors.length]
      story += ` ${connector} "${itemList[i]}"`
    }

    setResult(story + '.')
  }

  const generateRhyme = () => {
    const itemList = items.split(/[\n,]+/).map(s => s.trim()).filter(Boolean)
    if (itemList.length === 0) return

    const rhymeEndings = ['day', 'way', 'say', 'play', 'stay']
    let rhyme = ''

    itemList.forEach((item, i) => {
      const ending = rhymeEndings[i % rhymeEndings.length]
      rhyme += `${item} is here to ${ending},\n`
    })

    rhyme += 'Now you know them all the way!'

    setResult(rhyme)
  }

  const generate = () => {
    switch (mode) {
      case 'acrostic': generateAcrostic(); break
      case 'story': generateStory(); break
      case 'rhyme': generateRhyme(); break
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['acrostic', 'story', 'rhyme'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setResult(null) }}
            className={`flex-1 py-2 rounded font-medium ${mode === m ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
          >
            {t(`tools.mnemonicCreator.${m}`)}
          </button>
        ))}
      </div>

      <div className="card p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('tools.mnemonicCreator.enterItems')}
        </label>
        <textarea
          value={items}
          onChange={(e) => setItems(e.target.value)}
          placeholder={t('tools.mnemonicCreator.placeholder')}
          className="w-full px-3 py-2 border border-slate-300 rounded resize-none"
          rows={5}
        />
        <p className="text-xs text-slate-500 mt-1">
          {t('tools.mnemonicCreator.hint')}
        </p>
      </div>

      <button
        onClick={generate}
        disabled={!items.trim()}
        className="w-full py-3 bg-blue-500 text-white rounded font-medium disabled:opacity-50"
      >
        {t('tools.mnemonicCreator.generate')}
      </button>

      {result && (
        <div className="card p-4 bg-green-50">
          <h3 className="text-sm font-medium text-slate-700 mb-2">
            {t('tools.mnemonicCreator.yourMnemonic')}
          </h3>
          <p className="text-lg whitespace-pre-wrap">{result}</p>
          <button
            onClick={() => navigator.clipboard.writeText(result)}
            className="mt-3 px-3 py-1 text-sm bg-white rounded border"
          >
            {t('common.copy')}
          </button>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.mnemonicCreator.examples')}
        </h3>
        <div className="text-xs text-slate-500 space-y-2">
          <p><strong>{t('tools.mnemonicCreator.acrostic')}:</strong> {t('tools.mnemonicCreator.acrosticExample')}</p>
          <p><strong>{t('tools.mnemonicCreator.story')}:</strong> {t('tools.mnemonicCreator.storyExample')}</p>
          <p><strong>{t('tools.mnemonicCreator.rhyme')}:</strong> {t('tools.mnemonicCreator.rhymeExample')}</p>
        </div>
      </div>
    </div>
  )
}
