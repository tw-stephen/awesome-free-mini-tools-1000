import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const QUOTES = [
  "THE ONLY WAY TO DO GREAT WORK IS TO LOVE WHAT YOU DO",
  "LIFE IS WHAT HAPPENS WHEN YOU ARE BUSY MAKING OTHER PLANS",
  "BE THE CHANGE YOU WISH TO SEE IN THE WORLD",
  "IN THE MIDDLE OF DIFFICULTY LIES OPPORTUNITY",
  "THE JOURNEY OF A THOUSAND MILES BEGINS WITH A SINGLE STEP",
  "IMAGINATION IS MORE IMPORTANT THAN KNOWLEDGE",
  "STAY HUNGRY STAY FOOLISH",
  "SIMPLICITY IS THE ULTIMATE SOPHISTICATION",
  "THE BEST TIME TO PLANT A TREE WAS TWENTY YEARS AGO",
  "DO OR DO NOT THERE IS NO TRY"
]

export default function CryptogramPuzzle() {
  const { t } = useTranslation()
  const [originalText, setOriginalText] = useState('')
  const [encryptedText, setEncryptedText] = useState('')
  const [cipher, setCipher] = useState<Record<string, string>>({})
  const [userGuesses, setUserGuesses] = useState<Record<string, string>>({})
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [solved, setSolved] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [showHint, setShowHint] = useState(false)

  const generateCipher = (): Record<string, string> => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const shuffled = [...alphabet].sort(() => Math.random() - 0.5)
    const cipherMap: Record<string, string> = {}

    // Ensure no letter maps to itself
    for (let i = 0; i < alphabet.length; i++) {
      if (alphabet[i] === shuffled[i]) {
        const swapIndex = (i + 1) % alphabet.length
        const temp = shuffled[i]
        shuffled[i] = shuffled[swapIndex]
        shuffled[swapIndex] = temp
      }
      cipherMap[alphabet[i]] = shuffled[i]
    }

    return cipherMap
  }

  const encryptText = (text: string, cipherMap: Record<string, string>): string => {
    return text
      .split('')
      .map(char => cipherMap[char] || char)
      .join('')
  }

  const startNewPuzzle = () => {
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)]
    const newCipher = generateCipher()
    const encrypted = encryptText(quote, newCipher)

    setOriginalText(quote)
    setEncryptedText(encrypted)
    setCipher(newCipher)
    setUserGuesses({})
    setSelectedLetter(null)
    setSolved(false)
    setHintsUsed(0)
    setShowHint(false)
  }

  useEffect(() => {
    startNewPuzzle()
  }, [])

  const handleLetterClick = (encryptedLetter: string) => {
    if (solved) return
    if (!/[A-Z]/.test(encryptedLetter)) return
    setSelectedLetter(encryptedLetter)
  }

  const handleGuess = (guessedLetter: string) => {
    if (!selectedLetter || solved) return

    const newGuesses = { ...userGuesses }

    // Remove any existing guess for this letter
    Object.keys(newGuesses).forEach(key => {
      if (newGuesses[key] === guessedLetter) {
        delete newGuesses[key]
      }
    })

    if (guessedLetter) {
      newGuesses[selectedLetter] = guessedLetter
    } else {
      delete newGuesses[selectedLetter]
    }

    setUserGuesses(newGuesses)
    setSelectedLetter(null)

    // Check if solved
    const decrypted = encryptedText
      .split('')
      .map(char => newGuesses[char] || char)
      .join('')

    if (decrypted === originalText) {
      setSolved(true)
    }
  }

  const useHint = () => {
    if (solved) return

    // Find a letter that hasn't been correctly guessed
    const reverseCipher: Record<string, string> = {}
    Object.keys(cipher).forEach(key => {
      reverseCipher[cipher[key]] = key
    })

    for (const encryptedChar of encryptedText) {
      if (/[A-Z]/.test(encryptedChar)) {
        const correctLetter = reverseCipher[encryptedChar]
        if (userGuesses[encryptedChar] !== correctLetter) {
          setUserGuesses(prev => ({ ...prev, [encryptedChar]: correctLetter }))
          setHintsUsed(prev => prev + 1)
          setShowHint(false)

          // Check if solved after hint
          const newGuesses = { ...userGuesses, [encryptedChar]: correctLetter }
          const decrypted = encryptedText
            .split('')
            .map(char => newGuesses[char] || char)
            .join('')
          if (decrypted === originalText) {
            setSolved(true)
          }
          return
        }
      }
    }
  }

  const getLetterFrequency = (): Record<string, number> => {
    const freq: Record<string, number> = {}
    encryptedText.split('').forEach(char => {
      if (/[A-Z]/.test(char)) {
        freq[char] = (freq[char] || 0) + 1
      }
    })
    return freq
  }

  const frequency = getLetterFrequency()
  const usedGuesses = new Set(Object.values(userGuesses))

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-slate-500">
            {t('tools.cryptogramPuzzle.hintsUsed')}: {hintsUsed}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200"
            >
              {t('tools.cryptogramPuzzle.hint')}
            </button>
            <button
              onClick={startNewPuzzle}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              {t('tools.cryptogramPuzzle.newPuzzle')}
            </button>
          </div>
        </div>
      </div>

      {showHint && (
        <div className="card p-4 bg-yellow-50">
          <p className="text-sm text-yellow-700 mb-2">
            {t('tools.cryptogramPuzzle.hintText')}
          </p>
          <button
            onClick={useHint}
            className="px-4 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
          >
            {t('tools.cryptogramPuzzle.revealLetter')}
          </button>
        </div>
      )}

      <div className={`card p-6 ${solved ? 'bg-green-50' : ''}`}>
        {solved && (
          <div className="text-center text-green-600 font-bold text-lg mb-4">
            {t('tools.cryptogramPuzzle.solved')}
          </div>
        )}

        <div className="font-mono text-lg leading-loose flex flex-wrap">
          {encryptedText.split('').map((char, i) => {
            const isLetter = /[A-Z]/.test(char)
            const guessedLetter = userGuesses[char]
            const isSelected = selectedLetter === char
            const isCorrect = guessedLetter && guessedLetter === originalText[i]

            return (
              <div key={i} className="inline-flex flex-col items-center mx-0.5">
                {isLetter ? (
                  <>
                    <button
                      onClick={() => handleLetterClick(char)}
                      className={`w-7 h-7 flex items-center justify-center rounded ${
                        isSelected
                          ? 'bg-blue-500 text-white'
                          : guessedLetter
                            ? isCorrect
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                            : 'bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      {guessedLetter || '_'}
                    </button>
                    <span className="text-xs text-slate-400 mt-0.5">{char}</span>
                  </>
                ) : (
                  <span className="w-7 h-7 flex items-center justify-center">{char}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {selectedLetter && (
        <div className="card p-4">
          <h4 className="font-medium mb-2 text-center">
            {t('tools.cryptogramPuzzle.selectLetter', { letter: selectedLetter })}
          </h4>
          <div className="flex flex-wrap gap-1 justify-center">
            <button
              onClick={() => handleGuess('')}
              className="w-8 h-8 bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              X
            </button>
            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
              <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={usedGuesses.has(letter)}
                className={`w-8 h-8 rounded ${
                  usedGuesses.has(letter)
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h4 className="font-medium mb-2">{t('tools.cryptogramPuzzle.frequency')}</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .map(([letter, count]) => (
              <div
                key={letter}
                className="px-2 py-1 bg-slate-100 rounded text-sm"
              >
                {letter}: {count}
              </div>
            ))}
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.cryptogramPuzzle.howToPlay')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>* {t('tools.cryptogramPuzzle.tip1')}</li>
          <li>* {t('tools.cryptogramPuzzle.tip2')}</li>
          <li>* {t('tools.cryptogramPuzzle.tip3')}</li>
          <li>* {t('tools.cryptogramPuzzle.tip4')}</li>
        </ul>
      </div>
    </div>
  )
}
