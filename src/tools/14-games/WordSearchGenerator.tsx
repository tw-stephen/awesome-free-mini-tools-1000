import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Grid {
  letters: string[][]
  words: string[]
  foundWords: string[]
}

export default function WordSearchGenerator() {
  const { t } = useTranslation()
  const [wordsInput, setWordsInput] = useState('APPLE\nBANANA\nORANGE\nGRAPE\nMELON')
  const [gridSize, setGridSize] = useState(12)
  const [grid, setGrid] = useState<Grid | null>(null)
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set())
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set())

  const directions = [
    [0, 1],   // right
    [1, 0],   // down
    [1, 1],   // diagonal down-right
    [-1, 1],  // diagonal up-right
    [0, -1],  // left
    [-1, 0],  // up
    [-1, -1], // diagonal up-left
    [1, -1],  // diagonal down-left
  ]

  const generateGrid = () => {
    const words = wordsInput
      .toUpperCase()
      .split('\n')
      .map(w => w.trim())
      .filter(w => w.length > 0 && w.length <= gridSize)

    if (words.length === 0) return

    const letters: string[][] = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => '')
    )

    const placedWords: string[] = []

    // Try to place each word
    for (const word of words) {
      let placed = false
      let attempts = 0

      while (!placed && attempts < 100) {
        const dir = directions[Math.floor(Math.random() * directions.length)]
        const startRow = Math.floor(Math.random() * gridSize)
        const startCol = Math.floor(Math.random() * gridSize)

        if (canPlaceWord(letters, word, startRow, startCol, dir)) {
          placeWord(letters, word, startRow, startCol, dir)
          placedWords.push(word)
          placed = true
        }
        attempts++
      }
    }

    // Fill empty cells with random letters
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (letters[i][j] === '') {
          letters[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26))
        }
      }
    }

    setGrid({ letters, words: placedWords, foundWords: [] })
    setSelectedCells(new Set())
    setFoundWords(new Set())
  }

  const canPlaceWord = (
    letters: string[][],
    word: string,
    row: number,
    col: number,
    dir: number[]
  ): boolean => {
    for (let i = 0; i < word.length; i++) {
      const newRow = row + dir[0] * i
      const newCol = col + dir[1] * i

      if (newRow < 0 || newRow >= gridSize || newCol < 0 || newCol >= gridSize) {
        return false
      }

      if (letters[newRow][newCol] !== '' && letters[newRow][newCol] !== word[i]) {
        return false
      }
    }
    return true
  }

  const placeWord = (
    letters: string[][],
    word: string,
    row: number,
    col: number,
    dir: number[]
  ) => {
    for (let i = 0; i < word.length; i++) {
      const newRow = row + dir[0] * i
      const newCol = col + dir[1] * i
      letters[newRow][newCol] = word[i]
    }
  }

  const toggleCell = (row: number, col: number) => {
    const key = `${row}-${col}`
    const newSelected = new Set(selectedCells)
    if (newSelected.has(key)) {
      newSelected.delete(key)
    } else {
      newSelected.add(key)
    }
    setSelectedCells(newSelected)

    // Check if selected cells form a word
    if (grid) {
      const selectedLetters = Array.from(newSelected)
        .sort()
        .map(k => {
          const [r, c] = k.split('-').map(Number)
          return grid.letters[r][c]
        })
        .join('')

      const selectedLettersReverse = selectedLetters.split('').reverse().join('')

      for (const word of grid.words) {
        if ((word === selectedLetters || word === selectedLettersReverse) && !foundWords.has(word)) {
          setFoundWords(prev => new Set([...prev, word]))
          setSelectedCells(new Set())
        }
      }
    }
  }

  const sampleWordLists = {
    fruits: 'APPLE\nBANANA\nORANGE\nGRAPE\nMELON\nPEACH\nPLUM\nKIWI',
    animals: 'DOG\nCAT\nBIRD\nFISH\nLION\nTIGER\nBEAR\nWOLF',
    colors: 'RED\nBLUE\nGREEN\nYELLOW\nPURPLE\nORANGE\nPINK\nBLACK',
    sports: 'SOCCER\nTENNIS\nGOLF\nHOCKEY\nRUGBY\nCRICKET\nBOXING',
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="block text-sm font-medium mb-2">
          {t('tools.wordSearchGenerator.enterWords')}
        </label>
        <textarea
          value={wordsInput}
          onChange={(e) => setWordsInput(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded h-32 font-mono"
          placeholder="Enter words, one per line"
        />

        <div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(sampleWordLists).map(([name, words]) => (
            <button
              key={name}
              onClick={() => setWordsInput(words)}
              className="px-2 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200 capitalize"
            >
              {name}
            </button>
          ))}
        </div>

        <div className="flex gap-4 mt-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              {t('tools.wordSearchGenerator.gridSize')}
            </label>
            <select
              value={gridSize}
              onChange={(e) => setGridSize(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded"
            >
              {[8, 10, 12, 15, 20].map(size => (
                <option key={size} value={size}>{size} x {size}</option>
              ))}
            </select>
          </div>
          <button
            onClick={generateGrid}
            className="px-6 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 self-end"
          >
            {t('tools.wordSearchGenerator.generate')}
          </button>
        </div>
      </div>

      {grid && (
        <>
          <div className="card p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">{t('tools.wordSearchGenerator.puzzle')}</h3>
              <span className="text-sm text-slate-500">
                {foundWords.size}/{grid.words.length} {t('tools.wordSearchGenerator.found')}
              </span>
            </div>

            <div className="overflow-x-auto">
              <div
                className="grid gap-1 mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                  maxWidth: gridSize * 32
                }}
              >
                {grid.letters.map((row, i) =>
                  row.map((letter, j) => (
                    <button
                      key={`${i}-${j}`}
                      onClick={() => toggleCell(i, j)}
                      className={`w-7 h-7 flex items-center justify-center text-sm font-mono font-bold rounded
                        ${selectedCells.has(`${i}-${j}`)
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-100 hover:bg-slate-200'
                        }`}
                    >
                      {letter}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-medium mb-3">{t('tools.wordSearchGenerator.wordsToFind')}</h3>
            <div className="flex flex-wrap gap-2">
              {grid.words.map(word => (
                <span
                  key={word}
                  className={`px-3 py-1 rounded text-sm ${
                    foundWords.has(word)
                      ? 'bg-green-100 text-green-700 line-through'
                      : 'bg-slate-100'
                  }`}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="card p-4 bg-slate-50">
        <h4 className="font-medium mb-2">{t('tools.wordSearchGenerator.howToPlay')}</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• {t('tools.wordSearchGenerator.instruction1')}</li>
          <li>• {t('tools.wordSearchGenerator.instruction2')}</li>
          <li>• {t('tools.wordSearchGenerator.instruction3')}</li>
        </ul>
      </div>
    </div>
  )
}
