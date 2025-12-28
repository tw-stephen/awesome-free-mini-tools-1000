import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function WordChain() {
  const { t } = useTranslation()
  const [currentWord, setCurrentWord] = useState('')
  const [chain, setChain] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [error, setError] = useState('')
  const [gameMode, setGameMode] = useState<'solo' | 'versus'>('solo')
  const [currentPlayer, setCurrentPlayer] = useState(1)

  const validWords = new Set([
    'apple', 'elephant', 'tiger', 'rainbow', 'water', 'rain', 'nature', 'earth',
    'happy', 'yellow', 'wonder', 'river', 'rose', 'energy', 'yes', 'sun', 'north',
    'house', 'eat', 'tree', 'eye', 'end', 'dance', 'enter', 'run', 'nice', 'each',
    'help', 'play', 'young', 'green', 'night', 'time', 'eat', 'table', 'every',
    'year', 'road', 'dream', 'music', 'candle', 'eagle', 'echo', 'orange', 'english'
  ])

  const startGame = () => {
    const startWords = ['apple', 'house', 'water', 'happy', 'music']
    const word = startWords[Math.floor(Math.random() * startWords.length)]
    setCurrentWord(word)
    setChain([word])
    setInput('')
    setScore(0)
    setError('')
    setCurrentPlayer(1)
  }

  const submitWord = () => {
    const word = input.toLowerCase().trim()

    if (!word) {
      setError(t('tools.wordChain.enterWord'))
      return
    }

    const lastLetter = currentWord[currentWord.length - 1]
    if (word[0] !== lastLetter) {
      setError(t('tools.wordChain.mustStartWith', { letter: lastLetter.toUpperCase() }))
      return
    }

    if (chain.includes(word)) {
      setError(t('tools.wordChain.alreadyUsed'))
      return
    }

    if (word.length < 3) {
      setError(t('tools.wordChain.tooShort'))
      return
    }

    // Accept the word
    setCurrentWord(word)
    setChain(prev => [...prev, word])
    setScore(prev => prev + word.length * 10)
    setInput('')
    setError('')

    if (gameMode === 'versus') {
      setCurrentPlayer(prev => prev === 1 ? 2 : 1)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitWord()
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setGameMode('solo')}
            className={`flex-1 py-2 rounded ${gameMode === 'solo' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
          >
            {t('tools.wordChain.solo')}
          </button>
          <button
            onClick={() => setGameMode('versus')}
            className={`flex-1 py-2 rounded ${gameMode === 'versus' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}
          >
            {t('tools.wordChain.versus')}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-slate-500">{t('tools.wordChain.score')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{chain.length}</div>
            <div className="text-sm text-slate-500">{t('tools.wordChain.chainLength')}</div>
          </div>
        </div>

        {gameMode === 'versus' && chain.length > 0 && (
          <div className="mt-4 text-center">
            <span className={`px-4 py-2 rounded font-medium ${
              currentPlayer === 1 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
            }`}>
              {t('tools.wordChain.player', { num: currentPlayer })} {t('tools.wordChain.turn')}
            </span>
          </div>
        )}
      </div>

      <div className="card p-4">
        {chain.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🔗</div>
            <h2 className="text-xl font-bold mb-2">{t('tools.wordChain.title')}</h2>
            <p className="text-slate-500 mb-4">{t('tools.wordChain.description')}</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
            >
              {t('tools.wordChain.startGame')}
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              <span className="text-sm text-slate-500">{t('tools.wordChain.currentWord')}:</span>
              <div className="text-4xl font-bold text-blue-600">{currentWord.toUpperCase()}</div>
              <div className="text-lg text-slate-500 mt-2">
                {t('tools.wordChain.nextMustStart')}: <span className="font-bold text-green-600 text-2xl">
                  {currentWord[currentWord.length - 1].toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('tools.wordChain.typeWord')}
                className="flex-1 px-4 py-3 border border-slate-300 rounded text-center text-lg"
                autoFocus
              />
              <button
                onClick={submitWord}
                className="px-6 py-3 bg-blue-500 text-white rounded font-medium hover:bg-blue-600"
              >
                {t('tools.wordChain.submit')}
              </button>
            </div>

            {error && (
              <div className="mt-2 p-2 bg-red-100 text-red-700 rounded text-center text-sm">
                {error}
              </div>
            )}
          </>
        )}
      </div>

      {chain.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">{t('tools.wordChain.wordHistory')}</h3>
          <div className="flex flex-wrap gap-2">
            {chain.map((word, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-slate-100 rounded text-sm"
              >
                {word}
                {i < chain.length - 1 && <span className="text-slate-400 ml-1">→</span>}
              </span>
            ))}
          </div>
          <button
            onClick={startGame}
            className="mt-4 w-full py-2 bg-slate-100 rounded hover:bg-slate-200"
          >
            {t('tools.wordChain.newGame')}
          </button>
        </div>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.wordChain.rules')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.wordChain.rule1')}</li>
          <li>• {t('tools.wordChain.rule2')}</li>
          <li>• {t('tools.wordChain.rule3')}</li>
        </ul>
      </div>
    </div>
  )
}
