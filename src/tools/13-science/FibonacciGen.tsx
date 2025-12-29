import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function FibonacciGen() {
  const { t } = useTranslation()
  const [count, setCount] = useState(20)
  const [checkNumber, setCheckNumber] = useState(144)

  const generateFibonacci = (n: number): bigint[] => {
    const sequence: bigint[] = []
    let a = BigInt(0)
    let b = BigInt(1)

    for (let i = 0; i < n; i++) {
      sequence.push(a)
      const temp = a
      a = b
      b = temp + b
    }
    return sequence
  }

  const getNthFibonacci = (n: number): bigint => {
    if (n <= 0) return BigInt(0)
    if (n === 1) return BigInt(0)
    if (n === 2) return BigInt(1)

    let a = BigInt(0)
    let b = BigInt(1)
    for (let i = 2; i < n; i++) {
      const temp = a
      a = b
      b = temp + b
    }
    return b
  }

  const isFibonacci = (n: number): boolean => {
    // A number is Fibonacci if and only if one of (5*n^2 + 4) or (5*n^2 - 4) is a perfect square
    const isPerfectSquare = (x: number): boolean => {
      const s = Math.sqrt(x)
      return s * s === x
    }
    return isPerfectSquare(5 * n * n + 4) || isPerfectSquare(5 * n * n - 4)
  }

  const findFibonacciIndex = (n: number): number => {
    if (n === 0) return 1
    if (n === 1) return 2

    let a = BigInt(0)
    let b = BigInt(1)
    let index = 2

    while (b < BigInt(n)) {
      const temp = a
      a = b
      b = temp + b
      index++
    }

    return b === BigInt(n) ? index : -1
  }

  const sequence = generateFibonacci(count)
  const isCheck = isFibonacci(checkNumber)
  const checkIndex = isCheck ? findFibonacciIndex(checkNumber) : -1

  // Golden ratio
  const phi = (1 + Math.sqrt(5)) / 2

  // Ratio convergence
  const ratios = sequence.slice(1, 15).map((val, i) => {
    if (i === 0) return 0
    const prev = sequence[i]
    if (prev === BigInt(0)) return 0
    return Number(val) / Number(prev)
  }).filter(r => r > 0)

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.fibonacciGen.generateSequence')}</h3>
        <div className="flex items-center gap-2">
          <span>{t('tools.fibonacciGen.first')}</span>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-20 px-3 py-2 border border-slate-300 rounded text-center"
            min="1"
            max="100"
          />
          <span>{t('tools.fibonacciGen.numbers')}</span>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-2">{t('tools.fibonacciGen.sequence')}</h3>
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
          {sequence.map((num, i) => (
            <div key={i} className="px-3 py-1 bg-blue-100 rounded text-sm">
              <span className="text-blue-400 text-xs mr-1">F{i + 1}</span>
              <span className="font-mono">{num.toString().length > 10 ? num.toString().slice(0, 8) + '...' : num.toString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.fibonacciGen.checkNumber')}</h3>
        <input
          type="number"
          value={checkNumber}
          onChange={(e) => setCheckNumber(parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-slate-300 rounded text-center text-xl"
          min="0"
        />

        <div className={`mt-3 p-3 rounded text-center ${isCheck ? 'bg-green-100' : 'bg-red-100'}`}>
          <div className={`font-bold ${isCheck ? 'text-green-600' : 'text-red-600'}`}>
            {isCheck
              ? `${t('tools.fibonacciGen.isFibonacci')} (F${checkIndex})`
              : t('tools.fibonacciGen.notFibonacci')}
          </div>
        </div>
      </div>

      <div className="card p-4 bg-yellow-50">
        <h3 className="font-medium mb-2">{t('tools.fibonacciGen.goldenRatio')}</h3>
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-600">phi = {phi.toFixed(10)}</div>
          <div className="text-sm text-slate-500 mt-1">(1 + sqrt(5)) / 2</div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">{t('tools.fibonacciGen.ratioConvergence')}</h4>
          <div className="space-y-1">
            {ratios.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs w-16">F{i + 3}/F{i + 2}</span>
                <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-yellow-500 h-full"
                    style={{ width: `${(r / phi) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-mono w-20">{r.toFixed(6)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-medium mb-2">{t('tools.fibonacciGen.properties')}</h3>
        <ul className="text-sm text-slate-600 space-y-2">
          <li>- F(n) = F(n-1) + F(n-2)</li>
          <li>- F(1) = 0, F(2) = 1</li>
          <li>- {t('tools.fibonacciGen.property1')}</li>
          <li>- {t('tools.fibonacciGen.property2')}</li>
          <li>- {t('tools.fibonacciGen.property3')}</li>
        </ul>
      </div>

      <div className="card p-4 bg-blue-50">
        <h3 className="font-medium mb-2">{t('tools.fibonacciGen.binetFormula')}</h3>
        <div className="font-mono text-sm text-center p-2 bg-white rounded">
          F(n) = (phi^n - psi^n) / sqrt(5)
        </div>
        <div className="text-xs text-slate-500 mt-2">
          {t('tools.fibonacciGen.binetNote')}
        </div>
      </div>
    </div>
  )
}
