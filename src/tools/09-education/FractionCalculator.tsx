import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function FractionCalculator() {
  const { t } = useTranslation()
  const [num1, setNum1] = useState('')
  const [den1, setDen1] = useState('')
  const [num2, setNum2] = useState('')
  const [den2, setDen2] = useState('')
  const [operation, setOperation] = useState<'+' | '-' | '×' | '÷'>('+')

  const gcd = (a: number, b: number): number => {
    a = Math.abs(a)
    b = Math.abs(b)
    while (b) {
      const t = b
      b = a % b
      a = t
    }
    return a
  }

  const simplify = (num: number, den: number) => {
    if (den === 0) return { num: 0, den: 1, error: true }
    const g = gcd(num, den)
    let n = num / g
    let d = den / g
    if (d < 0) {
      n = -n
      d = -d
    }
    return { num: n, den: d, error: false }
  }

  const result = useMemo(() => {
    const n1 = parseInt(num1) || 0
    const d1 = parseInt(den1) || 1
    const n2 = parseInt(num2) || 0
    const d2 = parseInt(den2) || 1

    if (d1 === 0 || d2 === 0) return null

    let resNum: number
    let resDen: number

    switch (operation) {
      case '+':
        resNum = n1 * d2 + n2 * d1
        resDen = d1 * d2
        break
      case '-':
        resNum = n1 * d2 - n2 * d1
        resDen = d1 * d2
        break
      case '×':
        resNum = n1 * n2
        resDen = d1 * d2
        break
      case '÷':
        if (n2 === 0) return null
        resNum = n1 * d2
        resDen = d1 * n2
        break
      default:
        return null
    }

    const simplified = simplify(resNum, resDen)
    const decimal = simplified.den !== 0 ? simplified.num / simplified.den : 0
    const mixed = Math.abs(simplified.num) >= simplified.den && simplified.den !== 1
      ? {
          whole: Math.floor(Math.abs(simplified.num) / simplified.den) * (simplified.num < 0 ? -1 : 1),
          num: Math.abs(simplified.num) % simplified.den,
          den: simplified.den,
        }
      : null

    return {
      num: simplified.num,
      den: simplified.den,
      decimal,
      mixed,
      steps: {
        n1, d1, n2, d2,
        resNum, resDen,
      }
    }
  }, [num1, den1, num2, den2, operation])

  const operations: Array<'+' | '-' | '×' | '÷'> = ['+', '-', '×', '÷']

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <input
              type="number"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              placeholder="0"
              className="w-20 px-2 py-1 text-center border-b-2 border-slate-300 text-lg focus:outline-none focus:border-blue-500"
            />
            <div className="w-20 h-0.5 bg-slate-800 my-1" />
            <input
              type="number"
              value={den1}
              onChange={(e) => setDen1(e.target.value)}
              placeholder="1"
              className="w-20 px-2 py-1 text-center border-b-2 border-slate-300 text-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            {operations.map(op => (
              <button
                key={op}
                onClick={() => setOperation(op)}
                className={`w-10 h-10 rounded font-bold text-lg ${
                  operation === op ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {op}
              </button>
            ))}
          </div>

          <div className="text-center">
            <input
              type="number"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              placeholder="0"
              className="w-20 px-2 py-1 text-center border-b-2 border-slate-300 text-lg focus:outline-none focus:border-blue-500"
            />
            <div className="w-20 h-0.5 bg-slate-800 my-1" />
            <input
              type="number"
              value={den2}
              onChange={(e) => setDen2(e.target.value)}
              placeholder="1"
              className="w-20 px-2 py-1 text-center border-b-2 border-slate-300 text-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {result && (
        <div className="card p-4 bg-blue-50 text-center">
          <div className="text-sm text-slate-600 mb-2">{t('tools.fractionCalculator.result')}</div>
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{result.num}</div>
              {result.den !== 1 && (
                <>
                  <div className="w-12 h-0.5 bg-blue-600 mx-auto my-1" />
                  <div className="text-3xl font-bold text-blue-600">{result.den}</div>
                </>
              )}
            </div>

            <span className="text-2xl text-slate-400">=</span>

            <div className="text-2xl font-bold text-slate-700">
              {result.decimal.toFixed(4).replace(/\.?0+$/, '')}
            </div>
          </div>

          {result.mixed && (
            <div className="mt-4 text-sm text-slate-600">
              {t('tools.fractionCalculator.mixedNumber')}:
              <span className="font-bold ml-2">
                {result.mixed.whole}
                {result.mixed.num > 0 && ` ${result.mixed.num}/${result.mixed.den}`}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">{t('tools.fractionCalculator.quickFractions')}</h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { num: 1, den: 2 },
            { num: 1, den: 3 },
            { num: 1, den: 4 },
            { num: 2, den: 3 },
            { num: 3, den: 4 },
            { num: 1, den: 5 },
            { num: 1, den: 6 },
            { num: 1, den: 8 },
          ].map(({ num, den }) => (
            <button
              key={`${num}/${den}`}
              onClick={() => { setNum1(num.toString()); setDen1(den.toString()) }}
              className="p-2 bg-slate-50 rounded hover:bg-slate-100 text-center"
            >
              <span className="text-sm font-medium">{num}/{den}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.fractionCalculator.tips')}</h3>
        <div className="text-xs text-slate-500 space-y-1">
          <p>• {t('tools.fractionCalculator.tip1')}</p>
          <p>• {t('tools.fractionCalculator.tip2')}</p>
          <p>• {t('tools.fractionCalculator.tip3')}</p>
        </div>
      </div>
    </div>
  )
}
