import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export default function RandomNumberGenerator() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'range' | 'dice' | 'list'>('range')
  const [min, setMin] = useState('1')
  const [max, setMax] = useState('100')
  const [count, setCount] = useState('1')
  const [allowDuplicates, setAllowDuplicates] = useState(true)
  const [diceCount, setDiceCount] = useState('2')
  const [diceSides, setDiceSides] = useState('6')
  const [listItems, setListItems] = useState('')
  const [results, setResults] = useState<(number | string)[]>([])
  const [history, setHistory] = useState<{ result: string; timestamp: Date }[]>([])

  const generateSecureRandom = () => {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    return array[0] / (0xFFFFFFFF + 1)
  }

  const generateRange = useCallback(() => {
    const minVal = parseInt(min) || 0
    const maxVal = parseInt(max) || 100
    const countVal = Math.min(parseInt(count) || 1, allowDuplicates ? 1000 : maxVal - minVal + 1)

    const nums: number[] = []

    if (allowDuplicates) {
      for (let i = 0; i < countVal; i++) {
        const num = Math.floor(generateSecureRandom() * (maxVal - minVal + 1)) + minVal
        nums.push(num)
      }
    } else {
      const available = Array.from({ length: maxVal - minVal + 1 }, (_, i) => minVal + i)
      for (let i = 0; i < Math.min(countVal, available.length); i++) {
        const index = Math.floor(generateSecureRandom() * available.length)
        nums.push(available[index])
        available.splice(index, 1)
      }
    }

    setResults(nums)
    setHistory((prev) => [
      { result: nums.join(', '), timestamp: new Date() },
      ...prev.slice(0, 9),
    ])
  }, [min, max, count, allowDuplicates])

  const generateDice = useCallback(() => {
    const diceCountVal = parseInt(diceCount) || 1
    const diceSidesVal = parseInt(diceSides) || 6
    const rolls: number[] = []

    for (let i = 0; i < diceCountVal; i++) {
      const roll = Math.floor(generateSecureRandom() * diceSidesVal) + 1
      rolls.push(roll)
    }

    setResults(rolls)
    const total = rolls.reduce((sum, n) => sum + n, 0)
    setHistory((prev) => [
      { result: `${rolls.join(' + ')} = ${total}`, timestamp: new Date() },
      ...prev.slice(0, 9),
    ])
  }, [diceCount, diceSides])

  const generateFromList = useCallback(() => {
    const items = listItems
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    if (items.length === 0) return

    const countVal = Math.min(parseInt(count) || 1, allowDuplicates ? 100 : items.length)
    const selected: string[] = []

    if (allowDuplicates) {
      for (let i = 0; i < countVal; i++) {
        const index = Math.floor(generateSecureRandom() * items.length)
        selected.push(items[index])
      }
    } else {
      const available = [...items]
      for (let i = 0; i < Math.min(countVal, available.length); i++) {
        const index = Math.floor(generateSecureRandom() * available.length)
        selected.push(available[index])
        available.splice(index, 1)
      }
    }

    setResults(selected)
    setHistory((prev) => [
      { result: selected.join(', '), timestamp: new Date() },
      ...prev.slice(0, 9),
    ])
  }, [listItems, count, allowDuplicates])

  const generate = () => {
    switch (mode) {
      case 'range': generateRange(); break
      case 'dice': generateDice(); break
      case 'list': generateFromList(); break
    }
  }

  const diceTotal = mode === 'dice' && results.length > 0
    ? (results as number[]).reduce((sum, n) => sum + n, 0)
    : 0

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('range')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium ${
              mode === 'range' ? 'bg-blue-500 text-white' : 'bg-slate-200'
            }`}
          >
            {t('tools.randomNumberGenerator.range')}
          </button>
          <button
            onClick={() => setMode('dice')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium ${
              mode === 'dice' ? 'bg-blue-500 text-white' : 'bg-slate-200'
            }`}
          >
            {t('tools.randomNumberGenerator.dice')}
          </button>
          <button
            onClick={() => setMode('list')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium ${
              mode === 'list' ? 'bg-blue-500 text-white' : 'bg-slate-200'
            }`}
          >
            {t('tools.randomNumberGenerator.list')}
          </button>
        </div>

        {mode === 'range' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.randomNumberGenerator.min')}
                </label>
                <input
                  type="number"
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.randomNumberGenerator.max')}
                </label>
                <input
                  type="number"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.randomNumberGenerator.count')}
              </label>
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                min="1"
                max="1000"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={allowDuplicates}
                onChange={(e) => setAllowDuplicates(e.target.checked)}
              />
              {t('tools.randomNumberGenerator.allowDuplicates')}
            </label>
          </div>
        )}

        {mode === 'dice' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.randomNumberGenerator.numberOfDice')}
                </label>
                <input
                  type="number"
                  value={diceCount}
                  onChange={(e) => setDiceCount(e.target.value)}
                  min="1"
                  max="20"
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {t('tools.randomNumberGenerator.sidesPerDice')}
                </label>
                <select
                  value={diceSides}
                  onChange={(e) => setDiceSides(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                >
                  <option value="4">D4</option>
                  <option value="6">D6</option>
                  <option value="8">D8</option>
                  <option value="10">D10</option>
                  <option value="12">D12</option>
                  <option value="20">D20</option>
                  <option value="100">D100</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => setDiceCount(String(n))}
                  className="px-3 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200"
                >
                  {n}d{diceSides}
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === 'list' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.randomNumberGenerator.listItems')}
              </label>
              <textarea
                value={listItems}
                onChange={(e) => setListItems(e.target.value)}
                placeholder={t('tools.randomNumberGenerator.listPlaceholder')}
                rows={5}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t('tools.randomNumberGenerator.pickCount')}
              </label>
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                min="1"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={allowDuplicates}
                onChange={(e) => setAllowDuplicates(e.target.checked)}
              />
              {t('tools.randomNumberGenerator.allowDuplicates')}
            </label>
          </div>
        )}

        <button
          onClick={generate}
          className="w-full mt-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
        >
          {t('tools.randomNumberGenerator.generate')}
        </button>
      </div>

      {results.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('tools.randomNumberGenerator.result')}
          </h3>

          {mode === 'dice' ? (
            <div className="text-center">
              <div className="flex justify-center gap-2 flex-wrap mb-4">
                {results.map((result, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 bg-red-500 text-white rounded-lg flex items-center justify-center text-xl font-bold shadow-lg"
                  >
                    {result}
                  </div>
                ))}
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {t('tools.randomNumberGenerator.total')}: {diceTotal}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {results.map((result, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-lg font-medium"
                >
                  {result}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-2">
            {t('tools.randomNumberGenerator.history')}
          </h3>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {history.map((h, i) => (
              <div key={i} className="text-sm text-slate-600 py-1 border-b border-slate-100 flex justify-between">
                <span className="truncate flex-1">{h.result}</span>
                <span className="text-xs text-slate-400 ml-2">
                  {h.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.randomNumberGenerator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.randomNumberGenerator.tip1')}</li>
          <li>{t('tools.randomNumberGenerator.tip2')}</li>
          <li>{t('tools.randomNumberGenerator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
