import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function FactorialCalc() {
  const { t } = useTranslation()
  const [number, setNumber] = useState(10)

  const factorial = (n: number): bigint => {
    if (n < 0) return BigInt(0)
    if (n <= 1) return BigInt(1)
    let result = BigInt(1)
    for (let i = 2; i <= n; i++) {
      result *= BigInt(i)
    }
    return result
  }

  const doubleFactorial = (n: number): bigint => {
    if (n < 0) return BigInt(0)
    if (n <= 1) return BigInt(1)
    let result = BigInt(1)
    for (let i = n; i > 0; i -= 2) {
      result *= BigInt(i)
    }
    return result
  }

  const result = factorial(number)
  const doubleResult = doubleFactorial(number)
  const digits = result.toString().length

  // Stirling approximation
  const stirling = Math.sqrt(2 * Math.PI * number) * Math.pow(number / Math.E, number)

  // First 20 factorials
  const factorialTable = Array.from({ length: 21 }, (_, i) => ({
    n: i,
    factorial: factorial(i).toString()
  }))

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <h3 className="font-medium mb-3">{t('tools.factorialCalc.calculateFactorial')}</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(Math.min(170, Math.max(0, parseInt(e.target.value) || 0)))}
            className="flex-1 px-3 py-2 border border-slate-300 rounded text-center text-2xl"
            min="0"
            max="170"
          />
          <span className="text-2xl">!</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">{t('tools.factorialCalc.maxNote')}</p>
      </div>

      <div className="card p-4 bg-blue-50">
        <div className="text-sm text-slate-500 mb-1">{number}! =</div>
        <div className="text-xl font-mono font-bold text-blue-600 break-all">
          {number <= 20 ? result.toString() : result.toString().slice(0, 50) + '...'}
        </div>
        {number > 20 && (
          <div className="text-sm text-slate-500 mt-2">
            {t('tools.factorialCalc.fullResult')}: {result.toString()}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card p-3 text-center">
          <div className="text-sm text-slate-500">{t('tools.factorialCalc.digits')}</div>
          <div className="text-2xl font-bold text-purple-600">{digits}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-sm text-slate-500">{t('tools.factorialCalc.doubleFactorial')}</div>
          <div className="text-xl font-bold text-green-600">
            {doubleResult.toString().length > 15
              ? doubleResult.toString().slice(0, 12) + '...'
              : doubleResult.toString()}
          </div>
        </div>
      </div>

      {number <= 20 && (
        <div className="card p-4">
          <h3 className="font-medium mb-2">{t('tools.factorialCalc.expansion')}</h3>
          <div className="p-3 bg-slate-50 rounded font-mono text-sm">
            {number}! = {Array.from({ length: number }, (_, i) => number - i).join(' x ')} = {result.toString()}
          </div>
        </div>
      )}

      {number >= 10 && (
        <div className="card p-4">
          <h3 className="font-medium mb-2">{t('tools.factorialCalc.stirling')}</h3>
          <div className="p-3 bg-slate-50 rounded">
            <div className="text-sm text-slate-500 mb-1">
              n! approx sqrt(2 pi n) * (n/e)^n
            </div>
            <div className="font-mono">
              {stirling.toExponential(6)}
            </div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="font-medium mb-2">{t('tools.factorialCalc.table')}</h3>
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b">
                <th className="text-left py-2 px-2">n</th>
                <th className="text-left py-2 px-2">n!</th>
              </tr>
            </thead>
            <tbody>
              {factorialTable.map(row => (
                <tr key={row.n} className={`border-b ${row.n === number ? 'bg-blue-50' : ''}`}>
                  <td className="py-1 px-2 font-medium">{row.n}</td>
                  <td className="py-1 px-2 font-mono text-xs">{row.factorial}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-4 bg-slate-50">
        <h3 className="font-medium mb-2">{t('tools.factorialCalc.whatIs')}</h3>
        <p className="text-sm text-slate-600 mb-2">
          {t('tools.factorialCalc.definition')}
        </p>
        <div className="font-mono text-sm">
          n! = n x (n-1) x (n-2) x ... x 2 x 1
        </div>
        <div className="mt-2 text-sm">
          <strong>0! = 1</strong> ({t('tools.factorialCalc.byDefinition')})
        </div>
      </div>
    </div>
  )
}
