import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface AnagramPuzzle {
  letters: string
  words: string[]
  hint: string
}

export default function AnagramFinder() {
  const { t } = useTranslation()
  const [puzzle, setPuzzle] = useState<AnagramPuzzle | null>(null)
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set())
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState('')
  const [showHint, setShowHint] = useState(false)

  const puzzles: AnagramPuzzle[] = [
    { letters: 'LISTEN', words: ['LISTEN', 'SILENT', 'ENLIST', 'TINSEL'], hint: 'Hear something' },
    { letters: 'EARTH', words: ['EARTH', 'HEART', 'HATER', 'RATHE'], hint: 'Our planet' },
    { letters: 'ANGEL', words: ['ANGEL', 'ANGLE', 'GLEAN'], hint: 'Divine being' },
    { letters: 'SPARE', words: ['SPARE', 'SPEAR', 'PARSE', 'PEARS', 'REAPS'], hint: 'Extra' },
    { letters: 'TRAMS', words: ['TRAMS', 'SMART', 'MARTS'], hint: 'Public transport' },
    { letters: 'NOTES', words: ['NOTES', 'STONE', 'ONSET', 'TONES'], hint: 'Musical sounds' },
    { letters: 'LATER', words: ['LATER', 'ALTER', 'ALERT'], hint: 'Not now' },
    { letters: 'DATER', words: ['DATER', 'TRADE', 'RATED', 'TREAD'], hint: 'Someone dating' },
    { letters: 'STEAM', words: ['STEAM', 'MEATS', 'MATES', 'TEAMS', 'TAMES'], hint: 'Hot vapor' },
    { letters: 'CATER', words: ['CATER', 'TRACE', 'CRATE', 'REACT', 'CREATE'], hint: 'Provide food' },
  ]

  const startGame = () => {
    const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)]
    setPuzzle(randomPuzzle)
    setFoundWords(new Set())
    setInput('')
    setScore(0)
    setMessage('')
    setShowHint(false)
  }

  const shuffleLetters = (letters: string): string => {
    const arr = letters.split('')
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr.join('')
  }

  const handleShuffle = () => {
    if (puzzle) {
      setPuzzle({ ...puzzle, letters: shuffleLetters(puzzle.letters) })
    }
  }

  const submitWord = () => {
    if (!puzzle) return

    const word = input.toUpperCase().trim()
    if (!word) return

    if (foundWords.has(word)) {
      setMessage(t('tools.anagramFinder.alreadyFound'))
      return
    }

    if (puzzle.words.includes(word)) {
      setFoundWords(prev => new Set([...prev, word]))
      setScore(prev => prev + word.length * 10)
      setMessage(t('tools.anagramFinder.correct'))
      setInput('')

      if (foundWords.size + 1 === puzzle.words.length) {
        setScore(prev => prev + 50) // Bonus for finding all
        setMessage(t('tools.anagramFinder.foundAll'))
      }
    } else {
      setMessage(t('tools.anagramFinder.notValid'))
    }

    setTimeout(() => setMessage(''), 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitWord()
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-slate-500">{t('tools.anagramFinder.score')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">
              {puzzle ? `${foundWords.size}/${puzzle.words.length}` : '0/0'}
            </div>
            <div className="text-sm text-slate-500">{t('tools.anagramFinder.found')}</div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        {!puzzle ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🔤</div>
            <h2 className="text-xl font-bold mb-2">{t('tools.anagramFinder.title')}</h2>
            <p className="text-slate-500 mb-4">{t('tools.anagramFinder.description')}</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
            >
              {t('tools.anagramFinder.startGame')}
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              <div className="flex justify-center gap-2 mb-4">
                {puzzle.letters.split('').map((letter, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg text-2xl font-bold text-blue-700"
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <button
                onClick={handleShuffle}
                className="px-4 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200"
              >
                🔀 {t('tools.anagramFinder.shuffle')}
              </button>
            </div>

            {showHint && (
              <div className="text-sm text-blue-600 mb-4 p-2 bg-blue-50 rounded text-center">
                💡 {puzzle.hint}
              </div>
            )}

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder={t('tools.anagramFinder.typeWord')}
                className="flex-1 px-4 py-3 border border-slate-300 rounded text-center text-lg uppercase"
                maxLength={puzzle.letters.length}
              />
              <button
                onClick={submitWord}
                className="px-6 py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
              >
                {t('tools.anagramFinder.check')}
              </button>
            </div>

            {message && (
              <div className={`p-2 rounded text-center text-sm ${
                message.includes('Correct') || message.includes('正確') || message.includes('Found all')
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <div className="flex gap-2 justify-center mt-4">
              {!showHint && (
                <button
                  onClick={() => setShowHint(true)}
                  className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200"
                >
                  💡 {t('tools.anagramFinder.showHint')}
                </button>
              )}
              <button
                onClick={startGame}
                className="px-4 py-2 bg-slate-100 rounded text-sm hover:bg-slate-200"
              >
                {t('tools.anagramFinder.newPuzzle')}
              </button>
            </div>
          </>
        )}
      </div>

      {puzzle && foundWords.size > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.anagramFinder.foundWords')}</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(foundWords).map((word, i) => (
              <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded">
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.anagramFinder.howToPlay')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.anagramFinder.instruction1')}</li>
          <li>• {t('tools.anagramFinder.instruction2')}</li>
          <li>• {t('tools.anagramFinder.instruction3')}</li>
        </ul>
      </div>
    </div>
  )
}
