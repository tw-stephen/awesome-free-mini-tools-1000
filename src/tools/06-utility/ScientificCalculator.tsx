import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export default function ScientificCalculator() {
  const { t } = useTranslation()
  const [display, setDisplay] = useState('0')
  const [memory, setMemory] = useState(0)
  const [isRadians, setIsRadians] = useState(true)
  const [history, setHistory] = useState<string[]>([])

  const inputDigit = useCallback((digit: string) => {
    setDisplay(prev => prev === '0' ? digit : prev + digit)
  }, [])

  const inputDecimal = useCallback(() => {
    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }, [display])

  const clear = useCallback(() => {
    setDisplay('0')
  }, [])

  const clearAll = useCallback(() => {
    setDisplay('0')
    setMemory(0)
  }, [])

  const backspace = useCallback(() => {
    setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0')
  }, [])

  const calculate = useCallback((operation: string) => {
    const num = parseFloat(display)
    let result: number

    const toRad = (deg: number) => deg * Math.PI / 180
    const angle = isRadians ? num : toRad(num)

    switch (operation) {
      case 'sin': result = Math.sin(angle); break
      case 'cos': result = Math.cos(angle); break
      case 'tan': result = Math.tan(angle); break
      case 'asin': result = isRadians ? Math.asin(num) : Math.asin(num) * 180 / Math.PI; break
      case 'acos': result = isRadians ? Math.acos(num) : Math.acos(num) * 180 / Math.PI; break
      case 'atan': result = isRadians ? Math.atan(num) : Math.atan(num) * 180 / Math.PI; break
      case 'log': result = Math.log10(num); break
      case 'ln': result = Math.log(num); break
      case 'sqrt': result = Math.sqrt(num); break
      case 'cbrt': result = Math.cbrt(num); break
      case 'x^2': result = num * num; break
      case 'x^3': result = num * num * num; break
      case '1/x': result = 1 / num; break
      case 'abs': result = Math.abs(num); break
      case 'exp': result = Math.exp(num); break
      case '10^x': result = Math.pow(10, num); break
      case 'n!': result = factorial(Math.floor(num)); break
      case 'floor': result = Math.floor(num); break
      case 'ceil': result = Math.ceil(num); break
      case 'round': result = Math.round(num); break
      default: result = num
    }

    const expression = `${operation}(${num}) = ${result}`
    setHistory(prev => [expression, ...prev.slice(0, 9)])
    setDisplay(String(result))
  }, [display, isRadians])

  const factorial = (n: number): number => {
    if (n < 0) return NaN
    if (n <= 1) return 1
    return n * factorial(n - 1)
  }

  const insertConstant = useCallback((constant: string) => {
    let value: number
    switch (constant) {
      case 'π': value = Math.PI; break
      case 'e': value = Math.E; break
      default: value = 0
    }
    setDisplay(String(value))
  }, [])

  const memoryOperation = useCallback((op: string) => {
    const num = parseFloat(display)
    switch (op) {
      case 'MC': setMemory(0); break
      case 'MR': setDisplay(String(memory)); break
      case 'M+': setMemory(prev => prev + num); break
      case 'M-': setMemory(prev => prev - num); break
      case 'MS': setMemory(num); break
    }
  }, [display, memory])

  const evaluate = useCallback(() => {
    try {
      const expression = display
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**')
      const result = Function(`"use strict"; return (${expression})`)()
      setHistory(prev => [`${display} = ${result}`, ...prev.slice(0, 9)])
      setDisplay(String(result))
    } catch {
      setDisplay('Error')
    }
  }, [display])

  const addOperator = useCallback((op: string) => {
    const lastChar = display.slice(-1)
    if (['+', '-', '×', '÷', '^'].includes(lastChar)) {
      setDisplay(display.slice(0, -1) + op)
    } else {
      setDisplay(display + op)
    }
  }, [display])

  const scientificButtons = [
    ['sin', 'cos', 'tan', 'π'],
    ['asin', 'acos', 'atan', 'e'],
    ['log', 'ln', 'sqrt', 'x^2'],
    ['10^x', 'exp', 'cbrt', 'x^3'],
    ['abs', 'floor', 'ceil', 'n!'],
  ]

  const memoryButtons = ['MC', 'MR', 'M+', 'M-', 'MS']

  return (
    <div className="space-y-4">
      <div className="card p-4 max-w-md mx-auto">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">
              {memory !== 0 && `M: ${memory}`}
            </span>
            <button
              onClick={() => setIsRadians(!isRadians)}
              className="text-xs px-2 py-1 bg-slate-200 rounded"
            >
              {isRadians ? 'RAD' : 'DEG'}
            </button>
          </div>
          <div className="text-right text-2xl font-mono bg-slate-100 p-3 rounded overflow-x-auto">
            {display}
          </div>
        </div>

        <div className="flex gap-1 mb-2">
          {memoryButtons.map(btn => (
            <button
              key={btn}
              onClick={() => memoryOperation(btn)}
              className="flex-1 p-2 text-xs bg-slate-200 rounded hover:bg-slate-300"
            >
              {btn}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-1 mb-2">
          {scientificButtons.flat().map(btn => (
            <button
              key={btn}
              onClick={() => btn === 'π' || btn === 'e' ? insertConstant(btn) : calculate(btn)}
              className="p-2 text-sm bg-purple-100 rounded hover:bg-purple-200"
            >
              {btn}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-1">
          {['(', ')', '^', 'C', '⌫'].map(btn => (
            <button
              key={btn}
              onClick={() => {
                if (btn === 'C') clear()
                else if (btn === '⌫') backspace()
                else if (btn === '^') addOperator('^')
                else setDisplay(display === '0' ? btn : display + btn)
              }}
              className="p-3 bg-slate-200 rounded hover:bg-slate-300"
            >
              {btn}
            </button>
          ))}
          {['7', '8', '9', '÷', 'AC'].map(btn => (
            <button
              key={btn}
              onClick={() => {
                if (btn === 'AC') clearAll()
                else if (btn === '÷') addOperator('÷')
                else inputDigit(btn)
              }}
              className={`p-3 ${btn === 'AC' ? 'bg-red-500 text-white' : btn === '÷' ? 'bg-blue-500 text-white' : 'bg-slate-100'} rounded hover:opacity-80`}
            >
              {btn}
            </button>
          ))}
          {['4', '5', '6', '×', '1/x'].map(btn => (
            <button
              key={btn}
              onClick={() => {
                if (btn === '×') addOperator('×')
                else if (btn === '1/x') calculate('1/x')
                else inputDigit(btn)
              }}
              className={`p-3 ${btn === '×' ? 'bg-blue-500 text-white' : btn === '1/x' ? 'bg-purple-100' : 'bg-slate-100'} rounded hover:opacity-80`}
            >
              {btn}
            </button>
          ))}
          {['1', '2', '3', '-', 'round'].map(btn => (
            <button
              key={btn}
              onClick={() => {
                if (btn === '-') addOperator('-')
                else if (btn === 'round') calculate('round')
                else inputDigit(btn)
              }}
              className={`p-3 ${btn === '-' ? 'bg-blue-500 text-white' : btn === 'round' ? 'bg-purple-100' : 'bg-slate-100'} rounded hover:opacity-80`}
            >
              {btn}
            </button>
          ))}
          {['0', '.', '±', '+', '='].map(btn => (
            <button
              key={btn}
              onClick={() => {
                if (btn === '+') addOperator('+')
                else if (btn === '=') evaluate()
                else if (btn === '.') inputDecimal()
                else if (btn === '±') setDisplay(String(-parseFloat(display)))
                else inputDigit(btn)
              }}
              className={`p-3 ${btn === '+' ? 'bg-blue-500 text-white' : btn === '=' ? 'bg-green-500 text-white' : 'bg-slate-100'} rounded hover:opacity-80`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      {history.length > 0 && (
        <div className="card p-4 max-w-md mx-auto">
          <h3 className="text-sm font-medium text-slate-700 mb-2">
            {t('tools.scientificCalculator.history')}
          </h3>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {history.map((h, i) => (
              <div key={i} className="text-xs font-mono text-slate-600 py-1 border-b border-slate-100">
                {h}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4 max-w-md mx-auto">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          {t('tools.scientificCalculator.tips')}
        </h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>{t('tools.scientificCalculator.tip1')}</li>
          <li>{t('tools.scientificCalculator.tip2')}</li>
          <li>{t('tools.scientificCalculator.tip3')}</li>
        </ul>
      </div>
    </div>
  )
}
