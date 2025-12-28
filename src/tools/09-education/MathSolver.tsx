import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function MathSolver() {
  const { t } = useTranslation()
  const [expression, setExpression] = useState('')
  const [history, setHistory] = useState<{ expr: string; result: string }[]>([])

  const result = useMemo(() => {
    if (!expression.trim()) return null

    try {
      // Safe evaluation of mathematical expressions
      const sanitized = expression
        .replace(/\s+/g, '')
        .replace(/\^/g, '**')
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/e(?![a-zA-Z])/g, 'Math.E')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/abs\(/g, 'Math.abs(')
        .replace(/floor\(/g, 'Math.floor(')
        .replace(/ceil\(/g, 'Math.ceil(')
        .replace(/round\(/g, 'Math.round(')

      // Only allow safe characters
      if (!/^[\d+\-*/().MathPIsqrtsincootalgnbefloceiru\s]+$/.test(sanitized)) {
        return { error: t('tools.mathSolver.invalidExpression') }
      }

      // eslint-disable-next-line no-eval
      const evaluated = eval(sanitized)

      if (typeof evaluated !== 'number' || !isFinite(evaluated)) {
        return { error: t('tools.mathSolver.invalidResult') }
      }

      return {
        value: evaluated,
        formatted: Number.isInteger(evaluated) ? evaluated.toString() : evaluated.toFixed(10).replace(/\.?0+$/, '')
      }
    } catch (e) {
      return { error: t('tools.mathSolver.error') }
    }
  }, [expression, t])

  const calculate = () => {
    if (result && !('error' in result)) {
      setHistory([{ expr: expression, result: result.formatted }, ...history.slice(0, 9)])
    }
  }

  const insertSymbol = (symbol: string) => {
    setExpression(expression + symbol)
  }

  const buttons = [
    ['7', '8', '9', '÷', 'sqrt('],
    ['4', '5', '6', '×', '^'],
    ['1', '2', '3', '-', '('],
    ['0', '.', '=', '+', ')'],
  ]

  const functions = ['sin(', 'cos(', 'tan(', 'log(', 'ln(', 'abs(', 'π', 'e']

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && calculate()}
          placeholder={t('tools.mathSolver.placeholder')}
          className="w-full px-4 py-3 text-xl text-right border border-slate-300 rounded font-mono"
        />
        {result && (
          <div className={`text-right mt-2 text-lg ${('error' in result) ? 'text-red-500' : 'text-green-600'}`}>
            {'error' in result ? result.error : `= ${result.formatted}`}
          </div>
        )}
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap gap-1 mb-3">
          {functions.map(fn => (
            <button
              key={fn}
              onClick={() => insertSymbol(fn)}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              {fn}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-2">
          {buttons.flat().map(btn => (
            <button
              key={btn}
              onClick={() => btn === '=' ? calculate() : insertSymbol(btn)}
              className={`p-3 text-lg font-medium rounded ${
                btn === '='
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : /[+\-×÷^()]/.test(btn)
                  ? 'bg-slate-200 hover:bg-slate-300'
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {btn}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setExpression('')}
            className="flex-1 py-2 bg-red-100 text-red-600 rounded font-medium hover:bg-red-200"
          >
            {t('common.clear')}
          </button>
          <button
            onClick={() => setExpression(expression.slice(0, -1))}
            className="flex-1 py-2 bg-yellow-100 text-yellow-700 rounded font-medium hover:bg-yellow-200"
          >
            ⌫
          </button>
        </div>
      </div>

      {history.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.mathSolver.history')}</h3>
          <div className="space-y-1 text-sm font-mono max-h-40 overflow-y-auto">
            {history.map((item, i) => (
              <div
                key={i}
                className="flex justify-between p-2 bg-slate-50 rounded cursor-pointer hover:bg-slate-100"
                onClick={() => setExpression(item.expr)}
              >
                <span className="text-slate-600">{item.expr}</span>
                <span className="text-green-600">= {item.result}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">{t('tools.mathSolver.tips')}</h3>
        <div className="text-xs text-slate-500 space-y-1">
          <p>• {t('tools.mathSolver.tip1')}</p>
          <p>• {t('tools.mathSolver.tip2')}</p>
          <p>• {t('tools.mathSolver.tip3')}</p>
        </div>
      </div>
    </div>
  )
}
